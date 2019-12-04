window.addEventListener('load', function load(event) {
	chrome.storage.sync.get(['mBU'], function(display) {
	document.getElementById('xmBU').checked = display.myInbox
	});
	chrome.storage.sync.get(['mBR'], function(display) {
	document.getElementById('xmBR').checked = display.myInbox
	});
	chrome.storage.sync.get(['ImE'], function(display) {
	document.getElementById('xImE').checked = display.myInbox
	});
	chrome.storage.sync.get(['CFL'], function(display) {
	document.getElementById('xCFL').checked = display.mPO
	});
	
	document.getElementById('xmBU').addEventListener("change", 
		function () {
			var mBU = document.getElementById('xmBU').checked;
		
			chrome.storage.sync.set({mBU: mBU});
		}
	);
	document.getElementById('xmBR').addEventListener("change", 
		function () {
			var mBR = document.getElementById('xmBR').checked;
		
			chrome.storage.sync.set({mBR: mBR});
		}
	);
	document.getElementById('xImE').addEventListener("change", 
		function () {
			var ImE = document.getElementById('xImE').checked;
		
			chrome.storage.sync.set({ImE: ImE});
		}
	);
	document.getElementById('xCFL').addEventListener("change", 
		function () {
			var CFL = document.getElementById('xCFL').checked;
		
			chrome.storage.sync.set({CFL: CFL});
		}
	);
});