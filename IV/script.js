window.addEventListener('load', function load(event) {

	var popup = window.self;
	popup.opener = window.self;
	
	chrome.storage.sync.get(['create'], function(display) {
		if (!display.create) {
			document.getElementById("IVcreate").style.display = "none";
		}
	});
	
		chrome.storage.sync.get(['display'], function(display) {
		if (!display.display) {
			document.getElementById("IVsupplierInvoice").style.display = "none";
			document.getElementById("IVfiscalYear").style.display = "none";
			document.getElementById("IVdisplay").style.display = "none";
		}
	});
	
		chrome.storage.sync.get(['import'], function(display) {
		if (!display.import) {
			document.getElementById("IVimport").style.display = "none";
		}
	});
	
		chrome.storage.sync.get(['upload'], function(display) {
		if (!display.upload) {
			document.getElementById("IVupload").style.display = "none";
		}
	});
	
		chrome.storage.sync.get(['schedule'], function(display) {
		if (!display.schedule) {
			document.getElementById("IVschedule").style.display = "none";
		}
	});
	
		chrome.storage.sync.get(['list'], function(display) {
		if (!display.list) {
			document.getElementById("IVlist").style.display = "none";
		}
	});
	
		chrome.storage.sync.get(['createA'], function(display) {
		if (!display.createA) {
			document.getElementById("IVcreateA").style.display = "none";
		}
	});
	
		chrome.storage.sync.get(['displayA'], function(display) {
		if (!display.displayA) {
			document.getElementById("IVdisplayA").style.display = "none";
		}
	});
	
	
	
	
	
	
	
    document.getElementById('IVcreate').onclick = function() {
    chrome.tabs.getSelected(null, function(tab) {
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#SupplierInvoice-create';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
			popup.close();
        }
    });
    };

    document.getElementById('IVlist').onclick = function() {
            chrome.tabs.getSelected(null, function(tab) {
        //Your code below...
        //var tabUrl = encodeURIComponent(tab.url);
        //var tabTitle = encodeURIComponent(tab.title);
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#SupplierInvoice-list1';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
			popup.close();
        }
    });
    };

        document.getElementById('IVupload').onclick = function() {
            chrome.tabs.getSelected(null, function(tab) {
        //Your code below...
        //var tabUrl = encodeURIComponent(tab.url);
        //var tabTitle = encodeURIComponent(tab.title);
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#SupplierInvoice-upload';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
			popup.close();
        }
    });
    };

        document.getElementById('IVimport').onclick = function() {
            chrome.tabs.getSelected(null, function(tab) {
        //Your code below...
        //var tabUrl = encodeURIComponent(tab.url);
        //var tabTitle = encodeURIComponent(tab.title);
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#SupplierInvoice-import';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
			popup.close();
        }
    });
    };

        document.getElementById('IVschedule').onclick = function() {
            chrome.tabs.getSelected(null, function(tab) {
        //Your code below...
        //var tabUrl = encodeURIComponent(tab.url);
        //var tabTitle = encodeURIComponent(tab.title);
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#SupplierInvoice-scheduleApplicationJobsAdvanced?JobCatalogEntryName=SAP_MM_IV_STAT_OUTPUT_J%252CSAP_MM_IV_SI_OUTPUT_J%252CSAP_MM_IV_MR11_J%252CSAP_MM_IV_MRBR_J%252CSAP_MM_IV_MRKO_J%252CSAP_MM_IV_MRKON_J%252CSAP_MM_IV_MRRL_J%252CSAP_MM_IV_MRDC_J%252CSAP_MM_IV_MRNB_J&sap-ach=MM-FIO-IV&sap-fiori-id=F1683&/v4_JobRunList';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
			popup.close();
        }
    });
    };

    document.getElementById('IVdisplay').onclick = function() {
            chrome.tabs.getSelected(null, function(tab) {
        //Your code below...
        //var tabUrl = encodeURIComponent(tab.url);
        //var tabTitle = encodeURIComponent(tab.title);
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var SIV = document.getElementById('IVsupplierInvoice');
            var FY = document.getElementById('IVfiscalYear');

            var myNewUrl = splitUrl[0] + '#SupplierInvoice-process?SupplierInvoice=' + SIV.value + '&FiscalYear=' + FY.value + '&/display';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
			popup.close();
        }
    });
    };

    document.getElementById('IVcreateA').onclick = function() {
            chrome.tabs.getSelected(null, function(tab) {
        //Your code below...
        //var tabUrl = encodeURIComponent(tab.url);
        //var tabTitle = encodeURIComponent(tab.title);
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#SupplierInvoice-createAdvanced?sap-ui-tech-hint=GUI';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
			popup.close();
        }
    });
    };

    document.getElementById('IVdisplayA').onclick = function() {
            chrome.tabs.getSelected(null, function(tab) {
        //Your code below...
        //var tabUrl = encodeURIComponent(tab.url);
        //var tabTitle = encodeURIComponent(tab.title);
        var splitUrl = tab.url.split('#');
        if (splitUrl.length === 2) {
            var myNewUrl = splitUrl[0] + '#SupplierInvoice-displayAdvanced?sap-ui-tech-hint=GUI';

            //Update the url here.
            chrome.tabs.update(tab.id, {
                url: myNewUrl
            });
			popup.close();
        }
    });
    };
});