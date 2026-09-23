/**
 * SAP Invoice Verification Chrome Extension - OData V2 $batch parser
 *
 * Parses the multipart/mixed request and response bodies of an OData V2
 * `$batch` call into a flat list of individual operations, pairing each
 * request with its response (changeset POSTs pair by Content-ID, everything
 * else by order).
 *
 * Loaded both in the service worker (via importScripts) and in the viewer page
 * (via <script>), so it only uses plain function declarations (global scope).
 */

/**
 * Extract the boundary token from a Content-Type header value.
 * @param {string} contentType
 * @returns {string|null}
 */
function extractBoundaryFromContentType(contentType) {
    if (!contentType) return null;
    const match = /boundary=("?)([^";]+)\1/i.exec(contentType);
    return match ? match[2].trim() : null;
}

/**
 * Fallback: derive the boundary from the first delimiter line of a body.
 * @param {string} text
 * @returns {string|null}
 */
function extractBoundaryFromBody(text) {
    const match = /^--(.+?)\r?$/m.exec(text || '');
    if (!match) return null;
    // Strip a trailing "--" in case we matched the closing delimiter.
    return match[1].replace(/--\s*$/, '').trim();
}

/**
 * Split a multipart body into its raw part strings (preamble and closing
 * delimiter removed).
 * @param {string} text
 * @param {string} boundary
 * @returns {string[]}
 */
function splitMultipart(text, boundary) {
    if (!text || !boundary) return [];
    const segments = text.split('--' + boundary);
    const parts = [];
    for (let seg of segments) {
        if (seg === '') continue;
        // Closing delimiter leaves a segment starting with "--".
        if (/^--/.test(seg)) continue;
        seg = seg.replace(/^\r?\n/, '').replace(/\r?\n$/, '');
        if (seg.trim() === '') continue;
        parts.push(seg);
    }
    return parts;
}

/**
 * Split a raw part into its headers (lowercased map) and body.
 * @param {string} part
 * @returns {{headers: Object, body: string}}
 */
function parseHeadersAndBody(part) {
    const sep = part.search(/\r?\n\r?\n/);
    let headerText = part;
    let body = '';
    if (sep !== -1) {
        headerText = part.slice(0, sep);
        const blank = part.slice(sep).match(/^\r?\n\r?\n/)[0];
        body = part.slice(sep + blank.length);
    }
    const headers = {};
    headerText.split(/\r?\n/).forEach((line) => {
        const colon = line.indexOf(':');
        if (colon > -1) {
            headers[line.slice(0, colon).trim().toLowerCase()] = line.slice(colon + 1).trim();
        }
    });
    return { headers, body };
}

/**
 * Split an embedded HTTP message into its first line, headers and body.
 * @param {string} text
 * @returns {{firstLine: string, headers: Object, body: string}}
 */
function parseHttpMessage(text) {
    const nl = text.search(/\r?\n/);
    const firstLine = nl === -1 ? text : text.slice(0, nl);
    const rest = nl === -1 ? '' : text.slice(nl).replace(/^\r?\n/, '');
    const { headers, body } = parseHeadersAndBody(rest);
    return { firstLine: firstLine.trim(), headers, body };
}

/**
 * Parse an embedded HTTP request (the body of an application/http part).
 * @param {string} text
 * @returns {{method: string, url: string, headers: Object, body: string, contentId: string|null}}
 */
function parseEmbeddedRequest(text) {
    const { firstLine, headers, body } = parseHttpMessage(text);
    const match = /^(\S+)\s+(.*?)\s+HTTP\/[\d.]+\s*$/.exec(firstLine);
    return {
        method: match ? match[1] : '',
        url: match ? match[2] : firstLine,
        headers,
        body,
        contentId: headers['content-id'] || null
    };
}

/**
 * Parse an embedded HTTP response (the body of an application/http part).
 * @param {string} text
 * @returns {{status: number|null, statusText: string, headers: Object, body: string, contentId: string|null}}
 */
function parseEmbeddedResponse(text) {
    const { firstLine, headers, body } = parseHttpMessage(text);
    const match = /^HTTP\/[\d.]+\s+(\d+)\s*(.*)$/.exec(firstLine);
    return {
        status: match ? parseInt(match[1], 10) : null,
        statusText: match ? match[2].trim() : '',
        headers,
        body,
        contentId: headers['content-id'] || null
    };
}

/**
 * Classify a top-level part as a changeset (nested multipart) or a single
 * application/http message.
 * @param {string} part
 */
function classifyPart(part) {
    const { headers, body } = parseHeadersAndBody(part);
    const contentType = headers['content-type'] || '';
    if (/multipart\/mixed/i.test(contentType)) {
        return {
            kind: 'changeset',
            boundary: extractBoundaryFromContentType(contentType) || extractBoundaryFromBody(body),
            body
        };
    }
    return { kind: 'http', headers, body };
}

/**
 * Split the query string into a stable identity, keeping only $select/$expand
 * (per design decision D2) and dropping volatile params ($skip, $top,
 * sap-client, csrf, key predicates, ...).
 * @param {string} method
 * @param {string} resourcePath
 * @param {string} query
 * @returns {string}
 */
function normalizeKey(method, resourcePath, query) {
    const normPath = resourcePath.replace(/\([^)]*\)/g, '()');
    const kept = [];
    if (query) {
        query.split('&').forEach((pair) => {
            const eq = pair.indexOf('=');
            const name = eq === -1 ? pair : pair.slice(0, eq);
            if (name === '$select' || name === '$expand') kept.push(pair);
        });
        kept.sort();
    }
    return method + ' ' + normPath + (kept.length ? '?' + kept.join('&') : '');
}

/**
 * Short, human-friendly label (method + last resource segment).
 * @param {string} method
 * @param {string} resourcePath
 * @returns {string}
 */
function shortLabel(method, resourcePath) {
    const clean = resourcePath.replace(/\([^)]*\)/g, '');
    const segment = clean.split('/').filter(Boolean).pop() || clean;
    return method + ' ' + segment;
}

/**
 * Split a request URL into resource path and query string.
 * @param {string} url
 * @returns {{resourcePath: string, query: string}}
 */
function splitUrl(url) {
    const q = url.indexOf('?');
    if (q === -1) return { resourcePath: url, query: '' };
    return { resourcePath: url.slice(0, q), query: url.slice(q + 1) };
}

/**
 * Build a single captured operation object from a request/response pair.
 */
function buildItem(reqMsg, resMsg) {
    const method = (reqMsg && reqMsg.method) || '';
    const url = (reqMsg && reqMsg.url) || '';
    const { resourcePath, query } = splitUrl(url);

    let responseJson = null;
    const responseRaw = resMsg && resMsg.body ? resMsg.body.trim() : '';
    if (responseRaw) {
        try {
            responseJson = JSON.parse(responseRaw);
        } catch (e) {
            responseJson = null;
        }
    }

    let sapMessage = null;
    if (resMsg && resMsg.headers && resMsg.headers['sap-message']) {
        try {
            sapMessage = JSON.parse(resMsg.headers['sap-message']);
        } catch (e) {
            sapMessage = resMsg.headers['sap-message'];
        }
    }

    return {
        method,
        url,
        resourcePath,
        query,
        normalizedKey: normalizeKey(method, resourcePath, query),
        label: shortLabel(method, resourcePath),
        requestHeaders: reqMsg ? reqMsg.headers : {},
        requestBody: reqMsg ? (reqMsg.body || '').trim() : '',
        contentId: (reqMsg && reqMsg.contentId) || (resMsg && resMsg.contentId) || null,
        status: resMsg ? resMsg.status : null,
        statusText: resMsg ? resMsg.statusText : '',
        responseHeaders: resMsg ? resMsg.headers : {},
        sapMessage,
        responseJson,
        responseRaw
    };
}

/**
 * Pair the inner request/response items of a changeset (by Content-ID, then
 * falling back to order) and push the built items into `results`.
 */
function pairChangeset(innerReq, innerRes, results) {
    const byId = new Map();
    innerRes.forEach((res) => {
        if (res.contentId) byId.set(res.contentId, res);
    });
    innerReq.forEach((req, idx) => {
        let res = req.contentId ? byId.get(req.contentId) : null;
        if (!res) res = innerRes[idx] || null;
        results.push(buildItem(req, res));
    });
}

/**
 * Parse a full OData V2 $batch request + response into a list of operations.
 * @param {string} requestBody - raw multipart request payload
 * @param {string} responseBody - raw multipart response payload
 * @param {string} [requestContentType] - request Content-Type header (optional)
 * @param {string} [responseContentType] - response Content-Type header (optional)
 * @returns {Array<Object>}
 */
function parseBatch(requestBody, responseBody, requestContentType, responseContentType) {
    const reqBoundary = extractBoundaryFromContentType(requestContentType) || extractBoundaryFromBody(requestBody);
    const resBoundary = extractBoundaryFromContentType(responseContentType) || extractBoundaryFromBody(responseBody);

    const reqTop = splitMultipart(requestBody, reqBoundary).map(classifyPart);
    const resTop = splitMultipart(responseBody, resBoundary).map(classifyPart);

    const results = [];
    const count = Math.max(reqTop.length, resTop.length);
    for (let i = 0; i < count; i++) {
        const rq = reqTop[i];
        const rs = resTop[i];
        if (!rq) continue;

        if (rq.kind === 'changeset') {
            const innerReq = splitMultipart(rq.body, rq.boundary).map((p) => {
                const { body } = parseHeadersAndBody(p);
                return parseEmbeddedRequest(body);
            });
            if (rs && rs.kind === 'changeset') {
                // Successful changeset: one response per operation, paired by Content-ID.
                const innerRes = splitMultipart(rs.body, rs.boundary).map((p) => {
                    const { body } = parseHeadersAndBody(p);
                    return parseEmbeddedResponse(body);
                });
                pairChangeset(innerReq, innerRes, results);
            } else if (rs && rs.kind === 'http') {
                // Failed changeset: it is rolled back as a unit and the server returns a
                // single response (typically an error) for the whole changeset. Attach
                // that response to every operation so each one shows what happened.
                const sharedRes = parseEmbeddedResponse(rs.body);
                innerReq.forEach((req) => results.push(buildItem(req, sharedRes)));
            } else {
                innerReq.forEach((req) => results.push(buildItem(req, null)));
            }
        } else {
            const reqMsg = parseEmbeddedRequest(rq.body);
            const resMsg = rs && rs.kind === 'http' ? parseEmbeddedResponse(rs.body) : null;
            results.push(buildItem(reqMsg, resMsg));
        }
    }
    return results;
}

// Expose for both service-worker (self) and page (window) contexts.
if (typeof globalThis !== 'undefined') {
    globalThis.parseBatch = parseBatch;
}
