# SAP-Navigation-ChromeExtension
Chrome Extension for Fiori Launchpad Navigation

This Chrome extension should make the use of the Fiori Launchpad more easy, userfriendly and faster.

It is targeted for Supplier Invoice but I am glad to enhace it with other links as well. Just let me know either here in GIT Hub or D064957.


## Installation
In order to add the Chrome Extension go to:
chrome://extensions
Enable the developer mode (top right corner)
Then click "Load unpacked" and select the corresponding folder for all four extensions

If you want to be able to use them in incognito mode, you can set the flag in the extension details

They should be loaded now.

In order to see the Links, rightclick the Extension and click "options".
Select all the links that should be available in the respective extension.

## Batch Inspector (Invoice Verification)

The Invoice Verification extension can capture the OData `$batch` traffic that
the Supplier Invoice app sends to `…/sap/opu/odata/sap/MM_SUPPLIER_INVOICE_MANAGE/$batch`
and show the latest request/response for each operation.

- Open the IV popup and click **Start Recording**. Recording attaches to the
  **currently active tab only**, and only while you have it switched on.
- While recording, Chrome shows a **"Invoice Verification started debugging this
  browser" banner**. This is expected — it is how Chrome signals that the
  extension is reading the tab's network traffic (via `chrome.debugger`, so
  nothing in the page is modified). Click **Stop Recording** (or close the tab)
  to remove it. Note: the browser DevTools cannot be attached to the same tab
  while recording is active.
- Click **Open Inspector** to open a viewer: the list of captured requests on
  the left, the formatted JSON response on the right. Only the **latest**
  response per operation is kept (a new call overwrites the previous one).
- Toggle the whole feature on/off under the extension **options**
  ("Batch Inspector", on by default).
