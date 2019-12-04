// Saves options to chrome.storage
function save_options() {
  var SIV = document.getElementById('SIV').checked;
  var PO = document.getElementById('PO').checked;
  var ADM = document.getElementById('ADM').checked;


chrome.storage.sync.set({siv: SIV}, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

document.getElementById('save').addEventListener('click',
    save_options);