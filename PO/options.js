/**
 * SAP Purchase Orders Chrome Extension - Options Page
 * Handles settings management and default configuration.
 */

// Checkbox ids are the storage key prefixed with this string (e.g. mPO -> xmPO)
const CHECKBOX_PREFIX = 'x';

// Settings configuration (key = storage key, label = documentation only)
const SETTINGS_CONFIG = [
    { key: 'myInbox', label: 'My Inbox' },
    { key: 'mPO', label: 'Manage Purchase Orders' },
    { key: 'GRforPO', label: 'Post Goods Receipt for Purchase Order' },
    { key: 'SESManage', label: 'Manage Service Entry Sheet (Lean Service)' }
];

/**
 * Build the default settings object (everything enabled)
 * @returns {Object} Default settings object
 */
function getDefaultSettings() {
    const defaults = {};
    SETTINGS_CONFIG.forEach(({ key }) => {
        defaults[key] = true;
    });
    return defaults;
}

/**
 * Load settings from Chrome storage, falling back to defaults
 * @returns {Promise<Object>} Settings object
 */
function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(getDefaultSettings(), (settings) => {
            resolve(settings);
        });
    });
}

/**
 * Save a single setting to Chrome storage
 * @param {string} key - Setting key
 * @param {boolean} value - Setting value
 */
function saveSetting(key, value) {
    chrome.storage.sync.set({ [key]: value });
}

/**
 * Initialize settings UI
 * @param {Object} settings - Current settings
 */
function initializeUI(settings) {
    SETTINGS_CONFIG.forEach(({ key }) => {
        const checkbox = document.getElementById(`${CHECKBOX_PREFIX}${key}`);
        if (checkbox) {
            checkbox.checked = settings[key] !== false;

            checkbox.addEventListener('change', () => {
                saveSetting(key, checkbox.checked);
            });
        }
    });
}

/**
 * Initialize options page
 */
async function initialize() {
    const settings = await loadSettings();

    // Persist defaults on first run
    chrome.storage.sync.set(settings);

    initializeUI(settings);
}

document.addEventListener('DOMContentLoaded', initialize);
