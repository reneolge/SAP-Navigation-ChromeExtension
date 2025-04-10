window.addEventListener('load', function load(event) {

	var popup = window.self;
	popup.opener = window.self;

    chrome.storage.sync.get(['myInbox'], function(display) {
        if (!display.myInbox) {
            document.getElementById("myInbox").style.display = "none";
        }
    });
    
    chrome.storage.sync.get(['mPO'], function(display) {
        if (!display.mPO) {
            document.getElementById("POmanage").style.display = "none";
        }
    });
    
    chrome.storage.sync.get(['GRforPO'], function(display) {
        if (!display.GRforPO) {
            document.getElementById("POcreateGR").style.display = "none";
        }
    });
    
    chrome.storage.sync.get(['SESManage'], function(display) {
        if (!display.SESManage) {
            document.getElementById("SESManage").style.display = "none";
        }
    });

    document.getElementById('POmanage').onclick = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var tab = tabs[0];
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#PurchaseOrder-manage';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };

    document.getElementById('POcreateGR').onclick = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var tab = tabs[0];
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#PurchaseOrder-createGR';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };

    document.getElementById('myInbox').onclick = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var tab = tabs[0];
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#WorkflowTask-displayInbox?allItems=true';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };

    document.getElementById('SESManage').onclick = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var tab = tabs[0];
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#ServiceEntrySheet-manage';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };
    
});