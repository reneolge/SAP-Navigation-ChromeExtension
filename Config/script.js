window.addEventListener('load', function load(event) {

    document.getElementById('customizing').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#CloudSolution-administer';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
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
        }
    });
    };

});