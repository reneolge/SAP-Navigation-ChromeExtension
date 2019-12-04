window.addEventListener('load', function load(event) {

    document.getElementById('maintBU').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#BusinessUser-maintain';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
        }
    });
    };

    document.getElementById('maintBR').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#BusinessUserRole-maintain';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
        }
    });
    };

    document.getElementById('importEMP').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#HRAdministration-import';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
        }
    });
    };

    document.getElementById('customFields').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#CustomField-develop';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
        }
    });
    };

});