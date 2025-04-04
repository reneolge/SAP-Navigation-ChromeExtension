window.addEventListener('load', function load(event) {
	const settings = ['myInbox', 'mPO', 'GRforPO', 'SESManage'];

	settings.forEach(setting => {
		chrome.storage.sync.get([setting], function (display) {
			document.getElementById(`x${setting}`).checked = display[setting];
		});

		document.getElementById(`x${setting}`).addEventListener("change", function () {
			const isChecked = document.getElementById(`x${setting}`).checked;
			chrome.storage.sync.set({ [setting]: isChecked });
		});
	});
});