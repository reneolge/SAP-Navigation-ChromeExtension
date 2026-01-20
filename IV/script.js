/**
 * SAP Invoice Verification Chrome Extension
 * Utility functions and event handlers
 */

// Constants
const SETTINGS = [
    'create', 'display', 'import', 'upload', 'schedule', 
    'list', 'createA', 'displayA', 'park', 'settings'
];

const URL_MAPPINGS = {
    create: '#SupplierInvoice-create',
    list: '#SupplierInvoice-list1',
    upload: '#SupplierInvoice-upload',
    import: '#SupplierInvoice-import',
    schedule: '#SupplierInvoice-scheduleApplicationJobsAdvanced?JobCatalogEntryName=SAP_MM_IV_STAT_OUTPUT_J%252CSAP_MM_IV_SI_OUTPUT_J%252CSAP_MM_IV_MR11_J%252CSAP_MM_IV_MRBR_J%252CSAP_MM_IV_MRKO_J%252CSAP_MM_IV_MRKON_J%252CSAP_MM_IV_MRRL_J%252CSAP_MM_IV_MRDC_J%252CSAP_MM_IV_MRNB_J%252CSAP_MM_IV_CHNGPDATE_J%252CSAP_MM_IV_MRIS_J%252CSAP_MM_IV_MRBP_J&/v4_JobRunList',
    createA: '#SupplierInvoice-createAdvanced?sap-ui-tech-hint=GUI',
    displayA: '#SupplierInvoice-displayAdvanced?sap-ui-tech-hint=GUI',
    park: '#SupplierInvoice-park',
    settings: '#SupplierInvoice-configure'
};

/**
 * Utility Functions
 */

/**
 * Copy text to clipboard using modern Clipboard API
 * @param {string} text - The text to copy
 */
async function copyTextToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

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
 * Update tab URL
 * @param {number} tabId - The tab ID
 * @param {string} url - The new URL
 */
function updateTabUrl(tabId, url) {
    chrome.tabs.update(tabId, { url });
    window.close();
}

/**
 * Extract draft key from URL
 * @param {string} url - The current tab URL
 * @returns {string} The draft key or empty string
 */
function extractDraftKey(url) {
    if (url.includes('/edit/')) {
        const editPart = url.split('&/edit/')[1];
        if (editPart) {
            const parts = editPart.split('-');
            return parts.slice(0, 5).join('');
        }
    } else if (url.includes('/create/')) {
        const createPart = url.split('#SupplierInvoice-create&/create/isSharedDraft=false/')[1];
        if (createPart) {
            const parts = createPart.split('-');
            return parts.slice(0, 5).join('');
        }
    }
    return '';
}

/**
 * Initialize draft key field
 */
async function initializeDraftKey() {
    const tab = await getCurrentTab();
    const draftKey = extractDraftKey(tab.url);
    const draftKeyInput = document.getElementById('DraftKey');
    if (draftKeyInput) {
        draftKeyInput.value = draftKey;
    }
}

/**
 * Initialize fiscal year with current year
 */
function initializeFiscalYear() {
    const fiscalYearInput = document.getElementById('IVfiscalYear');
    if (fiscalYearInput) {
        fiscalYearInput.value = new Date().getFullYear();
    }
}

/**
 * Initialize page on DOM load
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeDraftKey();
    initializeFiscalYear();
});


/**
 * Settings and UI Management
 */

/**
 * Load and apply visibility settings from storage
 */
async function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(SETTINGS, (settings) => {
            resolve(settings);
        });
    });
}

/**
 * Apply visibility settings to UI elements
 * @param {Object} settings - Settings object
 */
function applyVisibilitySettings(settings) {
    // Handle display setting - affects multiple elements
    if (settings.display === false) {
        const displayElements = ['IVsupplierInvoice', 'IVfiscalYear', 'IVdisplay', 'IVchange'];
        displayElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.style.display = 'none';
        });
    }

    // Handle individual settings
    const settingsMap = {
        create: 'IVcreate',
        import: 'IVimport',
        upload: 'IVupload',
        schedule: 'IVschedule',
        list: 'IVlist',
        createA: 'IVcreateA',
        displayA: 'IVdisplayA',
        park: 'IVpark',
        settings: 'IVsettings'
    };

    Object.entries(settingsMap).forEach(([setting, elementId]) => {
        if (settings[setting] === false) {
            const element = document.getElementById(elementId);
            if (element) element.style.display = 'none';
        }
    });
}

/**
 * Navigation Handler
 */

/**
 * Navigate to a specific SAP page
 * @param {string} action - The action key from URL_MAPPINGS
 * @param {Object} params - Optional parameters (e.g., supplierInvoice, fiscalYear)
 */
async function navigateToSAPPage(action, params = {}) {
    const tab = await getCurrentTab();
    const [baseUrl] = tab.url.split('#');
    
    if (!baseUrl) return;

    let targetUrl = URL_MAPPINGS[action];
    
    // Handle display and change actions with parameters
    if (action === 'display' && params.supplierInvoice && params.fiscalYear) {
        targetUrl = `#SupplierInvoice-process?SupplierInvoice=${params.supplierInvoice}&FiscalYear=${params.fiscalYear}&/display`;
    } else if (action === 'change' && params.supplierInvoice && params.fiscalYear) {
        targetUrl = `#SupplierInvoice-change?SupplierInvoice=${params.supplierInvoice}&FiscalYear=${params.fiscalYear}`;
    }

    updateTabUrl(tab.id, baseUrl + targetUrl);
}

/**
 * Event Handlers Setup
 */
function setupEventHandlers() {
    // Copy draft key button
    const getDraftKeyBtn = document.getElementById('getDraftKey');
    if (getDraftKeyBtn) {
        getDraftKeyBtn.addEventListener('click', () => {
            const draftKey = document.getElementById('DraftKey')?.value;
            if (draftKey) {
                copyTextToClipboard(draftKey);
            }
        });
    }

    // Simple navigation buttons
    const simpleButtons = [
        { id: 'IVcreate', action: 'create' },
        { id: 'IVlist', action: 'list' },
        { id: 'IVupload', action: 'upload' },
        { id: 'IVimport', action: 'import' },
        { id: 'IVschedule', action: 'schedule' },
        { id: 'IVcreateA', action: 'createA' },
        { id: 'IVdisplayA', action: 'displayA' },
        { id: 'IVpark', action: 'park' },
        { id: 'IVsettings', action: 'settings' }
    ];

    simpleButtons.forEach(({ id, action }) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => navigateToSAPPage(action));
        }
    });

    // Display button with parameters
    const displayBtn = document.getElementById('IVdisplay');
    if (displayBtn) {
        displayBtn.addEventListener('click', () => {
            const supplierInvoice = document.getElementById('IVsupplierInvoice')?.value;
            const fiscalYear = document.getElementById('IVfiscalYear')?.value;
            navigateToSAPPage('display', { supplierInvoice, fiscalYear });
        });
    }

    // Change button with parameters
    const changeBtn = document.getElementById('IVchange');
    if (changeBtn) {
        changeBtn.addEventListener('click', () => {
            const supplierInvoice = document.getElementById('IVsupplierInvoice')?.value;
            const fiscalYear = document.getElementById('IVfiscalYear')?.value;
            navigateToSAPPage('change', { supplierInvoice, fiscalYear });
        });
    }
}

/**
 * Initialize extension on window load
 */
window.addEventListener('load', async () => {
    const settings = await loadSettings();
    applyVisibilitySettings(settings);
    setupEventHandlers();
});