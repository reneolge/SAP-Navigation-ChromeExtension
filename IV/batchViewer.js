/**
 * SAP Invoice Verification Chrome Extension - Batch Inspector viewer
 *
 * Renders the captured $batch operations from chrome.storage.local: the list of
 * requests on the left, the selected response as formatted JSON on the right.
 */

const CAPTURES_KEY = 'ivBatchCaptures';

const listEl = document.getElementById('list');
const detailEl = document.getElementById('detail');
const countEl = document.getElementById('count');

let captures = {};
let selectedKey = null;

/**
 * Escape text for safe insertion into HTML.
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Parse a JSON string, returning undefined on failure.
 * @param {string} text
 * @returns {*}
 */
function safeParse(text) {
    try {
        return JSON.parse(text);
    } catch (e) {
        return undefined;
    }
}

/**
 * Build a collapsible/expandable JSON tree as a DOM element.
 * @param {*} value
 * @returns {HTMLElement}
 */
function buildJsonTree(value) {
    const container = document.createElement('div');
    container.className = 'json-tree';
    container.appendChild(buildJsonNode(null, value));
    return container;
}

/**
 * Build one node of the JSON tree.
 * @param {string|null} keyLabel - already-quoted key, or null for root/array items
 * @param {*} value
 * @returns {HTMLElement}
 */
function buildJsonNode(keyLabel, value) {
    const wrapper = document.createElement('div');
    wrapper.className = 'jn';
    const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;

    if (type !== 'object' && type !== 'array') {
        if (keyLabel !== null) {
            const k = document.createElement('span');
            k.className = 'json-key';
            k.textContent = keyLabel + ': ';
            wrapper.appendChild(k);
        }
        const v = document.createElement('span');
        v.className = type === 'number' ? 'json-number'
            : type === 'boolean' ? 'json-boolean'
            : type === 'string' ? 'json-string' : 'json-null';
        v.textContent = type === 'string' ? JSON.stringify(value) : String(value);
        wrapper.appendChild(v);
        return wrapper;
    }

    const isArray = type === 'array';
    const entries = isArray
        ? value.map((v, i) => [i, v])
        : Object.keys(value).map((k) => [k, value[k]]);
    const openCh = isArray ? '[' : '{';
    const closeCh = isArray ? ']' : '}';

    const header = document.createElement('div');
    header.className = 'jn-header';

    const toggle = document.createElement('span');
    toggle.className = 'jn-toggle';
    toggle.textContent = entries.length ? '\u25be' : '\u00b7';
    header.appendChild(toggle);

    if (keyLabel !== null) {
        const k = document.createElement('span');
        k.className = 'json-key';
        k.textContent = keyLabel + ': ';
        header.appendChild(k);
    }

    const openBrace = document.createElement('span');
    openBrace.className = 'json-punct';
    openBrace.textContent = openCh;
    header.appendChild(openBrace);

    const summary = document.createElement('span');
    summary.className = 'jn-summary';
    summary.textContent = ' ' + entries.length + (isArray ? ' items ' : ' keys ');
    header.appendChild(summary);

    const closeInline = document.createElement('span');
    closeInline.className = 'json-punct';
    closeInline.textContent = closeCh;
    header.appendChild(closeInline);

    wrapper.appendChild(header);

    if (!entries.length) {
        summary.style.display = 'none';
        return wrapper;
    }

    const children = document.createElement('div');
    children.className = 'jn-children';
    entries.forEach(([ck, cv]) => {
        children.appendChild(buildJsonNode(isArray ? null : JSON.stringify(ck), cv));
    });

    const closeLine = document.createElement('div');
    closeLine.className = 'jn-close json-punct';
    closeLine.textContent = closeCh;

    wrapper.appendChild(children);
    wrapper.appendChild(closeLine);

    const setCollapsed = (collapsed) => {
        children.style.display = collapsed ? 'none' : '';
        closeLine.style.display = collapsed ? 'none' : '';
        summary.style.display = collapsed ? '' : 'none';
        closeInline.style.display = collapsed ? '' : 'none';
        toggle.textContent = collapsed ? '\u25b8' : '\u25be';
    };
    const startCollapsed = !isArray && Object.prototype.hasOwnProperty.call(value, '__deferred');
    setCollapsed(startCollapsed);
    wrapper._setCollapsed = setCollapsed;

    header.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentlyCollapsed = children.style.display === 'none';
        setCollapsed(!currentlyCollapsed);
    });

    return wrapper;
}

/**
 * Collapse or expand every node within a tree container.
 * @param {HTMLElement} container
 * @param {boolean} collapsed
 */
function setAllCollapsed(container, collapsed) {
    container.querySelectorAll('.jn').forEach((node) => {
        if (typeof node._setCollapsed === 'function') node._setCollapsed(collapsed);
    });
}

/**
 * Mount a JSON tree (or a <pre> fallback for non-JSON) into a container.
 * @param {HTMLElement} mount
 * @param {*} jsonValue - parsed value, or undefined to parse rawText
 * @param {string} [rawText]
 * @returns {HTMLElement|null} the tree element, if one was built
 */
function mountJson(mount, jsonValue, rawText) {
    let value = jsonValue;
    if (value === undefined && typeof rawText === 'string') value = safeParse(rawText);
    if (value !== undefined) {
        const tree = buildJsonTree(value);
        mount.appendChild(tree);
        return tree;
    }
    const pre = document.createElement('pre');
    pre.textContent = rawText || '';
    mount.appendChild(pre);
    return null;
}

/**
 * Load captures from storage and re-render.
 */
async function load() {
    const store = await chrome.storage.local.get(CAPTURES_KEY);
    captures = store[CAPTURES_KEY] || {};
    renderList();
    if (selectedKey && captures[selectedKey]) {
        renderDetail(captures[selectedKey]);
    } else {
        selectedKey = null;
        detailEl.innerHTML = '<div class="empty">Select a request on the left to see its response.</div>';
    }
}

/**
 * Render the request list (newest first).
 */
function renderList() {
    const items = Object.values(captures).sort((a, b) => (b.capturedAt || 0) - (a.capturedAt || 0));
    countEl.textContent = items.length + (items.length === 1 ? ' request' : ' requests');

    if (!items.length) {
        listEl.innerHTML = '<div class="empty">No captures yet.<br>Start recording from the extension popup, then use the app.</div>';
        return;
    }

    listEl.innerHTML = '';
    items.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'item' + (item.normalizedKey === selectedKey ? ' active' : '');
        const method = (item.method || '').toUpperCase();
        const statusOk = item.status && item.status >= 200 && item.status < 300;
        const time = item.capturedAt ? new Date(item.capturedAt).toLocaleTimeString() : '';
        div.innerHTML =
            '<div class="row1">' +
                '<span class="method ' + escapeHtml(method) + '">' + escapeHtml(method) + '</span>' +
                '<span class="label">' + escapeHtml(item.label || '') + '</span>' +
                '<span class="spacer" style="flex:1"></span>' +
                '<span class="badge-status ' + (statusOk ? 'ok' : 'err') + '">' + escapeHtml(item.status || '') + '</span>' +
            '</div>' +
            '<div class="key">' + escapeHtml(item.normalizedKey || '') + '</div>' +
            '<div class="meta">' + escapeHtml(time) + '</div>';
        div.addEventListener('click', () => {
            selectedKey = item.normalizedKey;
            renderList();
            renderDetail(item);
        });
        listEl.appendChild(div);
    });
}

/**
 * Render a "sap-message" header payload, if any.
 * @param {*} sapMessage
 * @returns {string} HTML
 */
function renderSapMessage(sapMessage) {
    if (!sapMessage) return '';
    if (typeof sapMessage === 'string') {
        return '<section class="block"><h3>sap-message</h3><div class="sap-msg">' + escapeHtml(sapMessage) + '</div></section>';
    }
    const severity = (sapMessage.severity || 'info').toLowerCase();
    let html = '<section class="block"><h3>sap-message</h3>';
    html += '<div class="sap-msg ' + escapeHtml(severity) + '">';
    html += '<strong>' + escapeHtml(sapMessage.code || '') + '</strong> ' + escapeHtml(sapMessage.message || '');
    if (Array.isArray(sapMessage.details)) {
        sapMessage.details.forEach((d) => {
            html += '<div class="detail-line">[' + escapeHtml((d.severity || '').toUpperCase()) + '] ' +
                escapeHtml(d.code || '') + ' ' + escapeHtml(d.message || '') + '</div>';
        });
    }
    html += '</div></section>';
    return html;
}

/**
 * Render the detail pane for a capture.
 * @param {Object} item
 */
function renderDetail(item) {
    const method = (item.method || '').toUpperCase();
    let html = '';
    html += '<h2><span class="method ' + escapeHtml(method) + '">' + escapeHtml(method) + '</span> ' + escapeHtml(item.label || '') + '</h2>';
    html += '<div class="subtle">' + escapeHtml(item.url || '') + '</div>';
    html += '<div class="subtle">Status: ' + escapeHtml((item.status || '') + ' ' + (item.statusText || '')) +
        (item.capturedAt ? ' · captured ' + escapeHtml(new Date(item.capturedAt).toLocaleString()) : '') + '</div>';

    html += renderSapMessage(item.sapMessage);

    if (item.requestBody) {
        html += '<section class="block"><h3>Request body</h3><div id="reqMount"></div></section>';
    }

    const hasJson = item.responseJson !== null && item.responseJson !== undefined;
    html += '<section class="block"><div class="block-head"><h3>Response</h3>';
    if (hasJson) {
        html += '<span class="tree-controls">' +
            '<button id="expandAll" class="secondary mini">Expand all</button>' +
            '<button id="collapseAll" class="secondary mini">Collapse all</button></span>';
    }
    html += '</div>';
    if (hasJson) {
        html += '<div id="respMount"></div>';
    } else if (item.responseRaw) {
        html += '<pre>' + escapeHtml(item.responseRaw) + '</pre>';
    } else {
        html += '<div class="empty">No response body.</div>';
    }
    html += '</section>';

    detailEl.innerHTML = html;

    if (item.requestBody) {
        mountJson(document.getElementById('reqMount'), undefined, item.requestBody);
    }
    if (hasJson) {
        const tree = mountJson(document.getElementById('respMount'), item.responseJson);
        const expandBtn = document.getElementById('expandAll');
        const collapseBtn = document.getElementById('collapseAll');
        if (tree && expandBtn) expandBtn.addEventListener('click', () => setAllCollapsed(tree, false));
        if (tree && collapseBtn) collapseBtn.addEventListener('click', () => setAllCollapsed(tree, true));
    }
}

document.getElementById('refresh').addEventListener('click', load);
document.getElementById('clear').addEventListener('click', async () => {
    await chrome.storage.local.remove(CAPTURES_KEY);
    selectedKey = null;
    await load();
});

// Live-update when new captures arrive while the viewer is open.
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes[CAPTURES_KEY]) {
        captures = changes[CAPTURES_KEY].newValue || {};
        renderList();
        if (selectedKey && captures[selectedKey]) {
            renderDetail(captures[selectedKey]);
        }
    }
});

load();
