# AGENTS.md — SAP-Navigation-ChromeExtension

Guidance for AI agents (and humans) working in this repo.

## What this is

A collection of **four independent Chrome extensions** (Manifest V3) that add a
button popup for jumping around the **SAP Fiori Launchpad**. Each button rewrites
the *current tab's* URL hash to a Fiori intent (`#SemanticObject-action`), so the
launchpad navigates without a full reload.

Each top-level folder is a **standalone unpacked extension** — load them
separately via `chrome://extensions` → *Load unpacked*.

> **Duplication is intentional.** Each folder ships as its own independent Chrome
> extension, so it must contain every file it needs (`script.js`, `style.css`,
> `manifest.json`, icon, etc.). There is **no** shared/common module and there
> cannot be one — code is deliberately copied across folders. Do not try to
> extract a shared library. Instead, keep the copies **consistent** (see below).

| Folder    | Extension name         | Focus                                                    |
|-----------|------------------------|----------------------------------------------------------|
| `IV/`     | Invoice Verification   | Supplier Invoice create/display/list/park/upload/schedule + draft-key copy |
| `PO/`     | Purchase Orders        | Manage PO, create GR, Service Entry Sheet, workflow inbox |
| `Admin/`  | Administrations        | Business User/Role, employee import, custom fields/logic, workflow error log |
| `Config/` | Configurations         | Customizing, INV/PO workflow maintenance                 |

## Architecture (per extension)

Each folder has the same file set:

- `manifest.json` — MV3. Permissions: `storage`, `tabs`; `host_permissions: <all_urls>`.
  `action.default_popup` → `popup.html`; `options_ui.page` → `options.html` (opens in a tab).
- `popup.html` — the button UI shown when the toolbar icon is clicked. Loads `script.js`.
- `script.js` — popup logic: reads visibility settings from `chrome.storage.sync`,
  hides disabled buttons, and wires each button's click to a navigation call.
- `options.html` + `options.js` — checkbox settings page; each checkbox toggles a
  key in `chrome.storage.sync` that controls whether the matching popup button shows.
- `style.css` — a vendored copy of **W3.CSS** (byte-identical across all four folders).
- `SAP.png` — toolbar icon.

### The core navigation pattern

All navigation does the same thing — take the active tab, split its URL on `#`,
replace the hash with a Fiori intent, update the tab:

```js
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const [base] = tabs[0].url.split('#');
  chrome.tabs.update(tabs[0].id, { url: base + '#SomeObject-action' });
  window.close();
});
```

`IV/script.js` is the **modernized reference style** (async/await, `URL_MAPPINGS`
table, `getCurrentTab`/`navigateToSAPPage`/`copyTextToClipboard` helpers, Clipboard
API, default-settings handling). `PO/`, `Admin/`, `Config/` still use the **older
repetitive style** (`var`, `popup.opener = window.self`, one hand-written `onclick`
block per button, no default settings).

Because the folders can't share code, consistency is a manual discipline: when you
touch one folder, **copy the IV pattern into that folder's own files** (its own
`navigate` helper, its own `URL_MAPPINGS`, its own default-settings handling)
rather than hand-writing a new one-off `onclick` block. The goal is that each
self-contained extension internally looks like the IV reference, not that they
import anything from each other.

### Settings key ↔ element convention

- Options checkbox id = `x` + storage key (e.g. key `mBU` → checkbox `#xmBU`;
  IV key `create` → checkbox `#xIVcreate`).
- `script.js` reads the key from `chrome.storage.sync` and hides the popup element
  when the value is falsy.
- IV uses descriptive keys (`create`, `display`, `list`, …). Admin/PO/Config use
  cryptic ones (`mBR`, `mBU`, `ImE`, `CF`, `CL`, `WfEl`, `mPO`, `GRforPO`,
  `SESManage`, `mSol`, `mWF`, `mWFPO`). Match the surrounding folder's convention.

## IV Batch Inspector (IV only)

The IV extension has an extra feature the others don't: it records the Supplier
Invoice app's OData `$batch` traffic and shows the latest request/response per
operation. Added files (all under `IV/`):

- `background.js` — MV3 service worker. Owns a `chrome.debugger` session; on an
  explicit **Start**, attaches to the active tab, enables the CDP `Network`
  domain, captures requests to `…/MM_SUPPLIER_INVOICE_MANAGE/$batch`
  (`requestWillBeSent` → `responseReceived` → `loadingFinished` +
  `Network.getResponseBody`), parses them and writes to `chrome.storage.local`.
  No page code is patched. Recording is per-tab and only while toggled on;
  detaches on Stop, `onDetach`, or tab close.
- `batchParser.js` — pure parser for OData V2 multipart `$batch` request +
  response bodies. Loaded by both the worker (`importScripts`) and the viewer
  (`<script>`), so it uses plain global function declarations. Pairs changeset
  POSTs by `Content-ID`, other parts by order. A **failed changeset** returns a
  single (error) response part for the whole changeset, which is attached to
  every operation in that changeset.
- `batchViewer.html` / `batchViewer.js` — the viewer tab (list left, formatted
  JSON right as a collapsible/expandable tree with Expand/Collapse all), opened
  via `chrome.tabs.create`.

Storage model: `chrome.storage.local.ivBatchCaptures = { [normalizedKey]: {...} }`,
**latest overwrites**. `normalizedKey` = METHOD + resource path with key
predicates collapsed (`Headers()/GLAccountItems`) and query params dropped except
`$select`/`$expand`. Recording state lives in `ivBatchRecording = { active, tabId }`.
Manifest adds `debugger` + `unlimitedStorage` permissions and a `background`
service worker. Popup gains a Record toggle + Open Inspector button (gated by the
`batchInspector` option, default on).

The "…is debugging this browser" banner while recording is expected (it's the
`chrome.debugger` indicator), documented in `README.md`.

### Dev notes (learned the hard way)

- **Test `batchParser.js` in Node** without a browser: it exposes globals, so
  load it with `(new Function('globalThis', fs.readFileSync('batchParser.js','utf8')))(g)`
  then call `g.parseBatch(reqBody, resBody)`. Validate against real captured
  payloads (success + failed-changeset).
- **Node on Windows resolves `/tmp` to `C:\tmp`**, not git-bash's `/tmp`. Write
  test fixtures to a repo-relative dir (e.g. `IV/_ivtest/`) and delete after.
- **After changing the manifest/service worker/permissions**, use the extension
  card's **reload ↻**. The `batchViewer.html` tab must be reloaded separately to
  pick up viewer JS/CSS changes.
- In the JSON tree, toggle a node by reading its **actual DOM state**
  (`children.style.display === 'none'`), never by inferring from the ▾/▸ glyph.

## How to add / change a link

1. Add the `<button id="...">` to that folder's `popup.html`.
2. Wire its click in `script.js` (IV: add to `URL_MAPPINGS` + `simpleButtons`;
   others: add an `onclick` block following the existing pattern).
3. Add a settings checkbox `#x<key>` to `options.html` and register the key in
   `options.js` so it can be toggled (and defaults to on).
4. Confirm the Fiori intent string (`#SemanticObject-action?params`) is correct.

## Testing (manual — no build/test tooling exists)

There is **no** `package.json`, bundler, linter, or test runner. To test:

1. `chrome://extensions` → enable Developer mode → *Load unpacked* → pick the folder.
2. Open a SAP Fiori Launchpad tab, click the extension icon, click a button,
   verify the launchpad navigates to the expected app.
3. After editing, hit the **reload** ↻ icon on the extension card.
4. Right-click the icon → *Options* to verify the settings page.

## Conventions & gotchas

- Navigation only works on a page whose URL contains `#` (a launchpad). Off-launchpad,
  handlers silently no-op — don't assume a click always navigates.
- The four `style.css` files are independent copies but meant to stay identical.
  If you change styling in one, replicate the exact change into the other three
  by hand (there is no shared stylesheet to edit).
- `manifest.json` versions are all `1.0` and out of sync with `Changelog.txt`
  (which references V7–V11). Bump the manifest `version` when shipping a real change.
- `Css doku.url` files are stray Windows shortcuts to w3schools — safe to delete; don't rely on them.

## Known cleanup opportunities (see repo review)

Note: cross-folder duplication is **not** a defect here — each extension must be
self-contained. The remaining items are real:

- `Admin/options.js` contains a dead `option1/option2/option3` placeholder block.
- Admin/PO/Config lack default-settings handling (IV has it) — port it into each.
- `host_permissions: <all_urls>` is broader than needed (only the launchpad host is used).
- Manifest `version` (all `1.0`) is out of sync with `Changelog.txt`.

If you make structural changes, update this file and `README.md` accordingly.
