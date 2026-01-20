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

// Ensure all options are selected by default
document.addEventListener('DOMContentLoaded', () => {
    const defaultOptions = {
        option1: true,
        option2: true,
        option3: true,
        // Add all other options here
    };

    chrome.storage.sync.get(defaultOptions, (storedOptions) => {
        // Merge stored options with defaults
        const options = { ...defaultOptions, ...storedOptions };

        // Update UI to reflect the options
        for (const [key, value] of Object.entries(options)) {
            const checkbox = document.querySelector(`#${key}`);
            if (checkbox) {
                checkbox.checked = value;
            }
        }

        // Save the default options if not already set
        chrome.storage.sync.set(options);
    });
});