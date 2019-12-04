window.addEventListener('load', function load(event) {

	var popup = window.self;
	popup.opener = window.self;
	
    chrome.storage.sync.get(['mBR'], function(display) {
        if (!display.mBR) {
            document.getElementById("maintBR").style.display = "none";
        }
    });
        chrome.storage.sync.get(['mBU'], function(display) {
        if (!display.mBU) {
            document.getElementById("maintBU").style.display = "none";
        }
    });
        chrome.storage.sync.get(['ImE'], function(display) {
        if (!display.ImE) {
            document.getElementById("importEMP").style.display = "none";
        }
    });
        chrome.storage.sync.get(['CFL'], function(display) {
        if (!display.CFL) {
            document.getElementById("customFields").style.display = "none";
        }
    });
    





    document.getElementById('maintBU').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
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

    document.getElementById('maintBR').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
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

    document.getElementById('importEMP').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
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

    document.getElementById('customFields').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
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

});