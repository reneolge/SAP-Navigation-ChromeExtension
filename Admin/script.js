/**
 * SAP Administrations Chrome Extension
 * Popup logic: applies visibility settings and wires navigation buttons.
 */

// Storage keys that control button visibility
const SETTINGS = ['mBU', 'mBR', 'ImE', 'CF', 'CL', 'WfEl'];

// Map each storage key to the popup button element it controls
const SETTINGS_MAP = {
    mBU: 'maintBU',
    mBR: 'maintBR',
    ImE: 'importEMP',
    CF: 'customFields',
    CL: 'customLogic',
    WfEl: 'workflowErrorLog'
};

// Map each button id to its Fiori intent (URL hash)
const URL_MAPPINGS = {
    maintBU: '#BusinessUser-maintain',
    maintBR: '#BusinessUserRole-maintain',
    importEMP: '#HRAdministration-import',
    customFields: '#CustomField-develop',
    customLogic: '#CustomLogic-maintain',
    workflowErrorLog: '#WorkflowItem-handleApplicationErrors'
};

/**
 * Get current active tab
 * @returns {Promise<chrome.tabs.Tab>} The active tab
 */
function getCurrentTab() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0]);
        });
    });
}

/**
 * Update tab URL and close the popup
 * @param {number} tabId - The tab ID
 * @param {string} url - The new URL
 */
function updateTabUrl(tabId, url) {
    chrome.tabs.update(tabId, { url });
    window.close();
}

/**
 * Navigate the active tab to a Fiori intent
 * @param {string} action - The button id key from URL_MAPPINGS
 */
async function navigateToSAPPage(action) {
    const tab = await getCurrentTab();
    const [baseUrl] = tab.url.split('#');

    if (!baseUrl) return;

    const targetUrl = URL_MAPPINGS[action];
    if (!targetUrl) return;

    updateTabUrl(tab.id, baseUrl + targetUrl);
}

/**
 * Load visibility settings from storage
 * @returns {Promise<Object>} Settings object
 */
function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(SETTINGS, (settings) => {
            resolve(settings);
        });
    });
}

/**
 * Hide buttons whose setting is disabled
 * @param {Object} settings - Settings object
 */
function applyVisibilitySettings(settings) {
    Object.entries(SETTINGS_MAP).forEach(([setting, elementId]) => {
        if (settings[setting] === false) {
            const element = document.getElementById(elementId);
            if (element) element.style.display = 'none';
        }
    });
}

/**
 * Wire each navigation button to its handler
 */
function setupEventHandlers() {
    Object.keys(URL_MAPPINGS).forEach((id) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => navigateToSAPPage(id));
        }
    });
}

/**
 * Initialize popup on window load
 */
window.addEventListener('load', async () => {
    const settings = await loadSettings();
    applyVisibilitySettings(settings);
    setupEventHandlers();
});
