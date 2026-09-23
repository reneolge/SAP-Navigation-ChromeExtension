/**
 * SAP Invoice Verification Chrome Extension - Background service worker
 *
 * Owns the chrome.debugger session used to capture OData V2 $batch traffic.
 * Recording is an explicit, per-tab on/off action driven from the popup:
 *  - START_RECORDING: attach the debugger to the given (active) tab, enable the
 *    Network domain, and start capturing $batch requests/responses.
 *  - STOP_RECORDING:  detach and stop.
 *
 * While attached, Chrome shows the "…is debugging this browser" banner, which
 * doubles as the visual "recording is live" indicator. Nothing in the page is
 * patched, so the app cannot be broken by this extension.
 */

importScripts('batchParser.js');

// Substring that identifies the OData service whose $batch we capture.
const BATCH_URL_MATCH = 'MM_SUPPLIER_INVOICE_MANAGE/$batch';

// storage.local keys
const STATE_KEY = 'ivBatchRecording'; // { active: boolean, tabId: number|null }
const CAPTURES_KEY = 'ivBatchCaptures'; // { [normalizedKey]: capture }

// In-flight requests being assembled (requestId -> partial capture context).
const pending = new Map();

/* -------------------------------------------------------------------------- */
/* State helpers                                                              */
/* -------------------------------------------------------------------------- */

async function getState() {
    const result = await chrome.storage.local.get(STATE_KEY);
    return result[STATE_KEY] || { active: false, tabId: null };
}

async function setState(state) {
    await chrome.storage.local.set({ [STATE_KEY]: state });
}

/* -------------------------------------------------------------------------- */
/* Debugger wrappers (promisified)                                            */
/* -------------------------------------------------------------------------- */

function attach(tabId) {
    return new Promise((resolve, reject) => {
        chrome.debugger.attach({ tabId }, '1.3', () => {
            if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
            else resolve();
        });
    });
}

function detach(tabId) {
    return new Promise((resolve) => {
        chrome.debugger.detach({ tabId }, () => {
            // Ignore errors (tab may already be gone / detached).
            void chrome.runtime.lastError;
            resolve();
        });
    });
}

function sendCommand(tabId, method, params) {
    return new Promise((resolve, reject) => {
        chrome.debugger.sendCommand({ tabId }, method, params || {}, (result) => {
            if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
            else resolve(result);
        });
    });
}

/* -------------------------------------------------------------------------- */
/* Recording control                                                          */
/* -------------------------------------------------------------------------- */

async function startRecording(tabId) {
    if (typeof tabId !== 'number') {
        return { ok: false, error: 'No active tab to record.' };
    }
    const state = await getState();
    // If already recording on another tab, move the session over.
    if (state.active && state.tabId != null && state.tabId !== tabId) {
        await detach(state.tabId);
    }
    try {
        await attach(tabId);
        await sendCommand(tabId, 'Network.enable', {});
        // Fresh session: clear previously captured requests.
        await chrome.storage.local.remove(CAPTURES_KEY);
        await setState({ active: true, tabId });
        return { ok: true, active: true, tabId };
    } catch (e) {
        await setState({ active: false, tabId: null });
        return { ok: false, error: String(e && e.message ? e.message : e) };
    }
}

async function stopRecording() {
    const state = await getState();
    if (state.active && state.tabId != null) {
        await detach(state.tabId);
    }
    pending.clear();
    await setState({ active: false, tabId: null });
    return { ok: true, active: false };
}

/* -------------------------------------------------------------------------- */
/* Capture pipeline                                                           */
/* -------------------------------------------------------------------------- */

function base64ToUtf8(b64) {
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
}

async function storeBatch(context, responseText) {
    let items;
    try {
        items = self.parseBatch(
            context.requestBody,
            responseText,
            context.requestContentType,
            context.responseContentType
        );
    } catch (e) {
        console.warn('IV batch parse failed:', e);
        return;
    }
    if (!items || !items.length) return;

    const store = await chrome.storage.local.get(CAPTURES_KEY);
    const captures = store[CAPTURES_KEY] || {};
    const now = Date.now();
    items.forEach((item) => {
        // Latest overwrites previous for the same normalized key.
        captures[item.normalizedKey] = Object.assign({ capturedAt: now }, item);
    });
    await chrome.storage.local.set({ [CAPTURES_KEY]: captures });
}

chrome.debugger.onEvent.addListener(async (source, method, params) => {
    const state = await getState();
    if (!state.active || source.tabId !== state.tabId) return;

    if (method === 'Network.requestWillBeSent') {
        const url = (params.request && params.request.url) || '';
        if (!url.includes(BATCH_URL_MATCH)) return;
        const headers = params.request.headers || {};
        pending.set(params.requestId, {
            url,
            method: params.request.method,
            requestBody: params.request.postData || '',
            hasPostData: !!params.request.hasPostData,
            requestContentType: headers['Content-Type'] || headers['content-type'] || '',
            responseContentType: ''
        });
    } else if (method === 'Network.responseReceived') {
        const ctx = pending.get(params.requestId);
        if (!ctx) return;
        const headers = (params.response && params.response.headers) || {};
        ctx.responseContentType = headers['Content-Type'] || headers['content-type'] || '';
    } else if (method === 'Network.loadingFinished') {
        const ctx = pending.get(params.requestId);
        if (!ctx) return;
        pending.delete(params.requestId);
        try {
            if (ctx.hasPostData && !ctx.requestBody) {
                try {
                    const rp = await sendCommand(state.tabId, 'Network.getRequestPostData', {
                        requestId: params.requestId
                    });
                    ctx.requestBody = (rp && rp.postData) || '';
                } catch (e) {
                    // Post body may no longer be available; continue with what we have.
                }
            }
            const body = await sendCommand(state.tabId, 'Network.getResponseBody', {
                requestId: params.requestId
            });
            let responseText = (body && body.body) || '';
            if (body && body.base64Encoded) responseText = base64ToUtf8(responseText);
            await storeBatch(ctx, responseText);
        } catch (e) {
            console.warn('IV batch capture failed:', e);
        }
    } else if (method === 'Network.loadingFailed') {
        pending.delete(params.requestId);
    }
});

/* -------------------------------------------------------------------------- */
/* Auto-stop when the recorded tab goes away or the debugger detaches         */
/* -------------------------------------------------------------------------- */

chrome.debugger.onDetach.addListener(async (source) => {
    const state = await getState();
    if (state.tabId != null && source.tabId === state.tabId) {
        pending.clear();
        await setState({ active: false, tabId: null });
    }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
    const state = await getState();
    if (state.tabId === tabId) {
        pending.clear();
        await setState({ active: false, tabId: null });
    }
});

/* -------------------------------------------------------------------------- */
/* Messaging (popup <-> background)                                           */
/* -------------------------------------------------------------------------- */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || !message.type) return;

    if (message.type === 'GET_STATE') {
        getState().then(sendResponse);
        return true;
    }
    if (message.type === 'START_RECORDING') {
        startRecording(message.tabId).then(sendResponse);
        return true;
    }
    if (message.type === 'STOP_RECORDING') {
        stopRecording().then(sendResponse);
        return true;
    }
    return false;
});
