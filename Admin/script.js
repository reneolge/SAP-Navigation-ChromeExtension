window.addEventListener('load', function load(event) {

    var popup = window.self;
    popup.opener = window.self;

    chrome.storage.sync.get(['mBR'], function (display) {
        if (!display.mBR) {
            document.getElementById("maintBR").style.display = "none";
        }
    });
    chrome.storage.sync.get(['mBU'], function (display) {
        if (!display.mBU) {
            document.getElementById("maintBU").style.display = "none";
        }
    });
    chrome.storage.sync.get(['ImE'], function (display) {
        if (!display.ImE) {
            document.getElementById("importEMP").style.display = "none";
        }
    });
    chrome.storage.sync.get(['CF'], function (display) {
        if (!display.CF) {
            document.getElementById("customFields").style.display = "none";
        }
    });
    chrome.storage.sync.get(['CL'], function (display) {
        if (!display.CL) {
            document.getElementById("customLogic").style.display = "none";
        }
    });
    chrome.storage.sync.get(['WfEl'], function (display) {
        if (!display.WfEl) {
            document.getElementById("workflowErrorLog").style.display = "none";
        }
    });



    document.getElementById('maintBU').onclick = function () {
        chrome.tabs.getSelected(null, function (tab) {
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#BusinessUser-maintain';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };

    document.getElementById('maintBR').onclick = function () {
        chrome.tabs.getSelected(null, function (tab) {
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#BusinessUserRole-maintain';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };

    document.getElementById('importEMP').onclick = function () {
        chrome.tabs.getSelected(null, function (tab) {
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#HRAdministration-import';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };

    document.getElementById('customFields').onclick = function () {
        chrome.tabs.getSelected(null, function (tab) {
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#CustomField-develop';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };

    document.getElementById('customLogic').onclick = function () {
        chrome.tabs.getSelected(null, function (tab) {
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#CustomLogic-maintain';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };

    document.getElementById('workflowErrorLog').onclick = function () {
        chrome.tabs.getSelected(null, function (tab) {
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#WorkflowItem-handleApplicationErrors';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };

});