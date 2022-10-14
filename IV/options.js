window.addEventListener('load', function load(event) {
	chrome.storage.sync.get(['display'], function (chromesettings) {
		document.getElementById('xIVdisplay').checked = chromesettings.display
	});
	chrome.storage.sync.get(['create'], function (chromesettings) {
		document.getElementById('xIVcreate').checked = chromesettings.create
	});
	chrome.storage.sync.get(['list'], function (chromesettings) {
		document.getElementById('xIVlist').checked = chromesettings.list
	});
	chrome.storage.sync.get(['import'], function (chromesettings) {
		document.getElementById('xIVimport').checked = chromesettings.import
	});
	chrome.storage.sync.get(['upload'], function (chromesettings) {
		document.getElementById('xIVupload').checked = chromesettings.upload
	});
	chrome.storage.sync.get(['schedule'], function (chromesettings) {
		document.getElementById('xIVschedule').checked = chromesettings.schedule
	});
	chrome.storage.sync.get(['displayA'], function (chromesettings) {
		document.getElementById('xIVdisplayA').checked = chromesettings.displayA
	});
	chrome.storage.sync.get(['createA'], function (chromesettings) {
		document.getElementById('xIVcreateA').checked = chromesettings.createA
	});
	chrome.storage.sync.get(['park'], function (chromesettings) {
		document.getElementById('xIVpark').checked = chromesettings.park
	});
	chrome.storage.sync.get(['settings'], function (chromesettings) {
		document.getElementById('xIVsettings').checked = chromesettings.settings
	});


	document.getElementById('xIVcreate').addEventListener("change",
		function () {
			var create = document.getElementById('xIVcreate').checked;

			chrome.storage.sync.set({ create: create });
		}
	);
	document.getElementById('xIVdisplay').addEventListener("change",
		function () {
			var display = document.getElementById('xIVdisplay').checked;

			chrome.storage.sync.set({ display: display });
		}
	);
	document.getElementById('xIVlist').addEventListener("change",
		function () {
			var list = document.getElementById('xIVlist').checked;

			chrome.storage.sync.set({ list: list });
		}
	);
	document.getElementById('xIVschedule').addEventListener("change",
		function () {
			var schedule = document.getElementById('xIVschedule').checked;

			chrome.storage.sync.set({ schedule: schedule });
		}
	);
	document.getElementById('xIVimport').addEventListener("change",
		function () {
			var imp = document.getElementById('xIVimport').checked;

			chrome.storage.sync.set({ import: imp });
		}
	);
	document.getElementById('xIVupload').addEventListener("change",
		function () {
			var upload = document.getElementById('xIVupload').checked;

			chrome.storage.sync.set({ upload: upload });
		}
	);
	document.getElementById('xIVcreateA').addEventListener("change",
		function () {
			var creA = document.getElementById('xIVcreateA').checked;

			chrome.storage.sync.set({ createA: creA });
		}
	);
	document.getElementById('xIVdisplayA').addEventListener("change",
		function () {
			var dspA = document.getElementById('xIVdisplayA').checked;

			chrome.storage.sync.set({ displayA: dspA });
		}
	);
	document.getElementById('xIVpark').addEventListener("change",
		function () {
			var park = document.getElementById('xIVpark').checked;

			chrome.storage.sync.set({ park: park });
		}
	);
	document.getElementById('xIVsettings').addEventListener("change",
		function () {
			var settings = document.getElementById('xIVsettings').checked;

			chrome.storage.sync.set({ settings: settings });
		}
	);
});