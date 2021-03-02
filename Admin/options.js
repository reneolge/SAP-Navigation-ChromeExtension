window.addEventListener('load', function load(event) {
	chrome.storage.sync.get(['mBU'], function(display) {
	document.getElementById('xmBU').checked = display.mBU
	});
	chrome.storage.sync.get(['mBR'], function(display) {
	document.getElementById('xmBR').checked = display.mBR
	});
	chrome.storage.sync.get(['ImE'], function(display) {
	document.getElementById('xImE').checked = display.ImE
	});
	chrome.storage.sync.get(['CFL'], function(display) {
	document.getElementById('xCFL').checked = display.CFL
	});
	chrome.storage.sync.get(['WfEl'], function(display) {
	document.getElementById('xWfEl').checked = display.WfEl
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
	document.getElementById('xWfEl').addEventListener("change", 
		function () {
			var WfEl = document.getElementById('xWfEl').checked;
		
			chrome.storage.sync.set({WfEl: WfEl});
		}
	);
});