window.addEventListener('load', function load(event) {

	var popup = window.self;
	popup.opener = window.self;
	
    chrome.storage.sync.get(['mSol'], function(display) {
        if (!display.mSol) {
            document.getElementById("customizing").style.display = "none";
        }
    });
    
        chrome.storage.sync.get(['mWF'], function(display) {
        if (!display.mWF) {
            document.getElementById("workflowMaintain").style.display = "none";
        }
    });
    

    document.getElementById('customizing').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#CloudSolution-administer';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
			popup.close();
        }
    });
    };

    document.getElementById('workflowMaintain').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#SupplierInvoice-manageWorkflows';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
			popup.close();
        }
    });
    };

});