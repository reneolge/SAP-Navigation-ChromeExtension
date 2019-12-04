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
            document.getElementById("IVworkflowMaintain").style.display = "none";
        }
    });
    
        chrome.storage.sync.get(['mWFPO'], function(display) {
        if (!display.mWFPO) {
            document.getElementById("POworkflowMaintain").style.display = "none";
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

    document.getElementById('IVworkflowMaintain').onclick = function() {
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

    document.getElementById('POworkflowMaintain').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#PurchaseOrder-manageWorkflows';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
            popup.close();
        }
    });
    };

});