window.addEventListener('load', function load(event) {
    const settings = ['display', 'create', 'list', 'import', 'upload', 'schedule', 'displayA', 'createA', 'park', 'settings'];

    settings.forEach(setting => {
        chrome.storage.sync.get([setting], function (chromesettings) {
            document.getElementById(`xIV${setting}`).checked = chromesettings[setting];
        });

        document.getElementById(`xIV${setting}`).addEventListener("change", function () {
            const value = document.getElementById(`xIV${setting}`).checked;
            chrome.storage.sync.set({ [setting]: value });
        });
    });
});