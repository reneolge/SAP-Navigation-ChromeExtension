window.addEventListener('load', function load(event) {
	chrome.storage.sync.get(['myInbox'], function (display) {
		document.getElementById('xmyInbox').checked = display.myInbox
	});
	chrome.storage.sync.get(['mPO'], function (display) {
		document.getElementById('xmPO').checked = display.mPO
	});
	chrome.storage.sync.get(['GRforPO'], function (display) {
		document.getElementById('xGRforPO').checked = display.GRforPO
	});
	chrome.storage.sync.get(['SESManage'], function (display) {
		document.getElementById('xSESManage').checked = display.SESManage
	});


	document.getElementById('xmyInbox').addEventListener("change",
		function () {
			var myInbox = document.getElementById('xmyInbox').checked;

			chrome.storage.sync.set({
				myInbox: myInbox
			});
		}
	);
	document.getElementById('xmPO').addEventListener("change",
		function () {
			var mPO = document.getElementById('xmPO').checked;

			chrome.storage.sync.set({
				mPO: mPO
			});
		}
	);
	document.getElementById('xGRforPO').addEventListener("change",
		function () {
			var GRforPO = document.getElementById('xGRforPO').checked;

			chrome.storage.sync.set({
				GRforPO: GRforPO
			});
		}
	);
	document.getElementById('xSESManage').addEventListener("change",
		function () {
			var SESManage = document.getElementById('xSESManage').checked;

			chrome.storage.sync.set({
				SESManage: SESManage
			});
		}
	);
});