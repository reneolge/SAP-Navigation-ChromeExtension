// Copy provided text to the clipboard.
function copyTextToClipboard(text) {
    var copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();
}

function getDraftKey() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
        if (tab.url.search("/edit/") > 0) {
            var splitUrl = tab.url.split('&/edit/');
            if (splitUrl.length === 2) {
                var intnetSplit = splitUrl[1].split('-');
                document.getElementById("DraftKey").value = intnetSplit[0] + intnetSplit[1] + intnetSplit[2] + intnetSplit[3] + intnetSplit[4]
            }
        } else if (tab.url.search("/create/") > 0) {
            var splitUrl = tab.url.split('#SupplierInvoice-create&/create/isSharedDraft=false/');
            if (splitUrl.length === 2) {
                var intnetSplit = splitUrl[1].split('-');
                document.getElementById("DraftKey").value = intnetSplit[0] + intnetSplit[1] + intnetSplit[2] + intnetSplit[3] + intnetSplit[4]
            }
        }
    });
};

function initializeYear() {
    document.getElementById("IVfiscalYear").value = new Date().getFullYear();
};

document.addEventListener('DOMContentLoaded', getDraftKey, false);
document.addEventListener('DOMContentLoaded', initializeYear, false);


window.addEventListener('load', function load(event) {

    var popup = window.self;
    popup.opener = window.self;

    chrome.storage.sync.get(['create'], function (chromesettings) {
        if (!chromesettings.create) {
            document.getElementById("IVcreate").style.chromesettings = "none";
        }
    });

    chrome.storage.sync.get(['display'], function (chromesettings) {
        if (!chromesettings.display) {
            document.getElementById("IVsupplierInvoice").style.display = "none";
            document.getElementById("IVfiscalYear").style.display = "none";
            document.getElementById("IVdisplay").style.display = "none";
            document.getElementById("IVchange").style.display = "none";
        }
    });

    chrome.storage.sync.get(['import'], function (chromesettings) {
        if (!chromesettings.import) {
            document.getElementById("IVimport").style.display = "none";
        }
    });

    chrome.storage.sync.get(['upload'], function (chromesettings) {
        if (!chromesettings.upload) {
            document.getElementById("IVupload").style.display = "none";
        }
    });

    chrome.storage.sync.get(['schedule'], function (chromesettings) {
        if (!chromesettings.schedule) {
            document.getElementById("IVschedule").style.display = "none";
        }
    });

    chrome.storage.sync.get(['list'], function (chromesettings) {
        if (!chromesettings.list) {
            document.getElementById("IVlist").style.display = "none";
        }
    });

    chrome.storage.sync.get(['createA'], function (chromesettings) {
        if (!chromesettings.createA) {
            document.getElementById("IVcreateA").style.display = "none";
        }
    });

    chrome.storage.sync.get(['displayA'], function (chromesettings) {
        if (!chromesettings.displayA) {
            document.getElementById("IVdisplayA").style.display = "none";
        }
    });

    chrome.storage.sync.get(['park'], function (chromesettings) {
        if (!chromesettings.park) {
            document.getElementById("IVpark").style.display = "none";
        }
    });

    document.getElementById('getDraftKey').onclick = function () {
        copyTextToClipboard(document.getElementById("DraftKey").value);
    };
    
    chrome.storage.sync.get(['settings'], function (chromesettings) {
        if (!chromesettings.settings) {
            document.getElementById("IVsettings").style.display = "none";
        }
    });


    document.getElementById('IVcreate').onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
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

    document.getElementById('IVlist').onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
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

    document.getElementById('IVupload').onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
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

    document.getElementById('IVimport').onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
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

    document.getElementById('IVschedule').onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
            //Your code below...
            //var tabUrl = encodeURIComponent(tab.url);
            //var tabTitle = encodeURIComponent(tab.title);
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#SupplierInvoice-scheduleApplicationJobsAdvanced?JobCatalogEntryName=SAP_MM_IV_STAT_OUTPUT_J%252CSAP_MM_IV_SI_OUTPUT_J%252CSAP_MM_IV_MR11_J%252CSAP_MM_IV_MRBR_J%252CSAP_MM_IV_MRKO_J%252CSAP_MM_IV_MRKON_J%252CSAP_MM_IV_MRRL_J%252CSAP_MM_IV_MRDC_J%252CSAP_MM_IV_MRNB_J%252CSAP_MM_IV_CHNGPDATE_J%252CSAP_MM_IV_MRIS_J%252CSAP_MM_IV_MRBP_J&/v4_JobRunList';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };

    document.getElementById('IVdisplay').onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
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

    document.getElementById('IVchange').onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
            //Your code below...
            //var tabUrl = encodeURIComponent(tab.url);
            //var tabTitle = encodeURIComponent(tab.title);
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var SIV = document.getElementById('IVsupplierInvoice');
                var FY = document.getElementById('IVfiscalYear');

                var myNewUrl = splitUrl[0] + '#SupplierInvoice-change?SupplierInvoice=' + SIV.value + '&FiscalYear=' + FY.value;

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };

    document.getElementById('IVcreateA').onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
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

    document.getElementById('IVdisplayA').onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
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

    document.getElementById('IVpark').onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
            //Your code below...
            //var tabUrl = encodeURIComponent(tab.url);
            //var tabTitle = encodeURIComponent(tab.title);
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#SupplierInvoice-park';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };

    document.getElementById('IVsettings').onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
            //Your code below...
            //var tabUrl = encodeURIComponent(tab.url);
            //var tabTitle = encodeURIComponent(tab.title);
            var splitUrl = tab.url.split('#');
            if (splitUrl.length === 2) {
                var myNewUrl = splitUrl[0] + '#SupplierInvoice-configure';

                //Update the url here.
                chrome.tabs.update(tab.id, {
                    url: myNewUrl
                });
                popup.close();
            }
        });
    };
});