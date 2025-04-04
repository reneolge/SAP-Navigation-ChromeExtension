window.addEventListener('load', function load(event) {
    const popup = window.self;
    popup.opener = window.self;

    chrome.storage.sync.get(['mBR', 'mBU', 'ImE', 'CF', 'CL', 'WfEl'], function (display) {
        if (!display.mBR) {
            document.getElementById("maintBR").style.display = "none";
        }
        if (!display.mBU) {
            document.getElementById("maintBU").style.display = "none";
        }
        if (!display.ImE) {
            document.getElementById("importEMP").style.display = "none";
        }
        if (!display.CF) {
            document.getElementById("customFields").style.display = "none";
        }
        if (!display.CL) {
            document.getElementById("customLogic").style.display = "none";
        }
        if (!display.WfEl) {
            document.getElementById("workflowErrorLog").style.display = "none";
        }
    });

    document.getElementById('maintBU').onclick = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0];
            const splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                const myNewUrl = `${splitUrl[0]}#BusinessUser-maintain`;
                chrome.tabs.update(tab.id, {url: myNewUrl});
                popup.close();
            }
        });
    };

    document.getElementById('maintBR').onclick = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0];
            const splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                const myNewUrl = `${splitUrl[0]}#BusinessUserRole-maintain`;
                chrome.tabs.update(tab.id, {url: myNewUrl});
                popup.close();
            }
        });
    };

    document.getElementById('importEMP').onclick = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0];
            const splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                const myNewUrl = `${splitUrl[0]}#HRAdministration-import`;
                chrome.tabs.update(tab.id, {url: myNewUrl});
                popup.close();
            }
        });
    };

    document.getElementById('customFields').onclick = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0];
            const splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                const myNewUrl = `${splitUrl[0]}#CustomField-develop`;
                chrome.tabs.update(tab.id, {url: myNewUrl});
                popup.close();
            }
        });
    };

    document.getElementById('customLogic').onclick = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0];
            const splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                const myNewUrl = `${splitUrl[0]}#CustomLogic-maintain`;
                chrome.tabs.update(tab.id, {url: myNewUrl});
                popup.close();
            }
        });
    };

    document.getElementById('workflowErrorLog').onclick = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0];
            const splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                const myNewUrl = `${splitUrl[0]}#WorkflowItem-handleApplicationErrors`;
                chrome.tabs.update(tab.id, {url: myNewUrl});
                popup.close();
            }
        });
    };

});