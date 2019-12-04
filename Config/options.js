window.addEventListener('load', function load(event) {
	chrome.storage.sync.get(['mSol'], function(display) {
	document.getElementById('xmSol').checked = display.myInbox
	});
	chrome.storage.sync.get(['mWF'], function(display) {
	document.getElementById('xmWF').checked = display.mPO
	});
	
	document.getElementById('xmSol').addEventListener("change", 
		function () {
			var mSol = document.getElementById('xmSol').checked;
		
			chrome.storage.sync.set({mSol: mSol});
		}
	);
	document.getElementById('xmWF').addEventListener("change", 
		function () {
			var mWF = document.getElementById('xmWF').checked;
		
			chrome.storage.sync.set({mWF: mWF});
		}
	);
});