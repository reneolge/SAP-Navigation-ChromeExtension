window.addEventListener('load', function load(event) {
	chrome.storage.sync.get(['display'], function(display) {
	document.getElementById('xIVdisplay').checked = display.display
	});
	chrome.storage.sync.get(['create'], function(display) {
	document.getElementById('xIVcreate').checked = display.create
	});
		chrome.storage.sync.get(['list'], function(display) {
	document.getElementById('xIVlist').checked = display.list
	});
		chrome.storage.sync.get(['import'], function(display) {
	document.getElementById('xIVimport').checked = display.import
	});
		chrome.storage.sync.get(['upload'], function(display) {
	document.getElementById('xIVupload').checked = display.upload
	});
		chrome.storage.sync.get(['schedule'], function(display) {
	document.getElementById('xIVschedule').checked = display.schedule
	});	
		chrome.storage.sync.get(['diplayA'], function(display) {
	document.getElementById('xIVdisplayA').checked = display.upload
	});
		chrome.storage.sync.get(['createA'], function(display) {
	document.getElementById('xIVcreateA').checked = display.schedule
	});	
	
	
	document.getElementById('xIVcreate').addEventListener("change", 
		function () {
			var create = document.getElementById('xIVcreate').checked;
		
			chrome.storage.sync.set({create: create});
		}
	);
	document.getElementById('xIVdisplay').addEventListener("change", 
		function () {
			var display = document.getElementById('xIVdisplay').checked;
		
			chrome.storage.sync.set({display: display});
		}
	);
	document.getElementById('xIVlist').addEventListener("change", 
		function () {
			var list = document.getElementById('xIVlist').checked;
		
			chrome.storage.sync.set({list: list});
		}
	);
	document.getElementById('xIVschedule').addEventListener("change", 
		function () {
			var schedule = document.getElementById('xIVschedule').checked;
		
			chrome.storage.sync.set({schedule: schedule});
		}
	);
	document.getElementById('xIVimport').addEventListener("change",
		function () {
			var imp = document.getElementById('xIVimport').checked;
		
			chrome.storage.sync.set({import: imp});
		}
	);
	document.getElementById('xIVupload').addEventListener("change", 
		function () {
			var upload = document.getElementById('xIVupload').checked;
		
			chrome.storage.sync.set({upload: upload});
		}
	);
	document.getElementById('xIVcreateA').addEventListener("change",
		function () {
			var creA = document.getElementById('xIVcreateA').checked;
		
			chrome.storage.sync.set({createA: creA});
		}
	);
	document.getElementById('xIVdisplayA').addEventListener("change", 
		function () {
			var dspA = document.getElementById('xIVdisplayA').checked;
		
			chrome.storage.sync.set({displayA: dspA});
		}
	);
});