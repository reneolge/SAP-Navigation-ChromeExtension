/**
 * SAP Invoice Verification Chrome Extension - Options Page
 * Handles settings management and default configuration
 */

// Settings configuration
const SETTINGS_CONFIG = [
    { key: 'display', label: 'Display Supplier Invoice' },
    { key: 'create', label: 'Create Supplier Invoice' },
    { key: 'list', label: 'Supplier Invoice List' },
    { key: 'import', label: 'Import Supplier Invoice' },
    { key: 'upload', label: 'Upload Supplier Invoice' },
    { key: 'schedule', label: 'Schedule Supplier Invoice' },
    { key: 'displayA', label: 'Display Supplier Invoice - Advanced' },
    { key: 'createA', label: 'Create Supplier Invoice - Advanced' },
    { key: 'park', label: 'Park Supplier Invoice' },
    { key: 'settings', label: 'Supplier Invoice Settings' }
];

/**
 * Initialize default settings
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
 * Load settings from Chrome storage
 * @returns {Promise<Object>} Settings object
 */
async function loadSettings() {
    return new Promise((resolve) => {
        const defaults = getDefaultSettings();
        chrome.storage.sync.get(defaults, (settings) => {
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
        const checkbox = document.getElementById(`xIV${key}`);
        if (checkbox) {
            checkbox.checked = settings[key] !== false;
            
            // Add event listener for changes
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
    
    // Save defaults if this is first run
    chrome.storage.sync.set(settings);
    
    // Initialize UI
    initializeUI(settings);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);