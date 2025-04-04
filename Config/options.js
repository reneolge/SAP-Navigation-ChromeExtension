window.addEventListener('load', function load(event) {
    const settings = ['mSol', 'mWF', 'mWFPO'];
    
    settings.forEach(setting => {
        chrome.storage.sync.get([setting], function(display) {
            document.getElementById(`x${setting}`).checked = display[setting];
        });
        
        document.getElementById(`x${setting}`).addEventListener("change", function() {
            const value = document.getElementById(`x${setting}`).checked;
            chrome.storage.sync.set({ [setting]: value });
        });
    });
});