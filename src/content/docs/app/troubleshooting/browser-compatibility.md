---
title: Browser Compatibility
description: Understand which browsers work with AWFlow and how to fix common compatibility issues.
section: app
---

AWFlow runs **entirely inside your browser**.  
Because of this, browser choice and settings directly affect how workflows behave.

This page explains:
- Which browsers are supported
- Known limitations
- Simple steps to fix common issues

---

## Supported Browsers

AWFlow relies on modern browser APIs for automation, DOM access, and local AI execution.

| Browser | Support Level | Notes |
|-------|---------------|------|
| **Google Chrome** | Fully supported | Recommended |
| **Microsoft Edge** | Fully supported | Chromium-based |
| **Firefox** | Supported (version 140 or later) | A few differences, listed below |
| **Safari** | Not supported | Technical limitations |

<aside>
Chrome and Edge get every feature. Firefox runs the same workflows, with the few differences listed in the Firefox section below.
</aside>

---

## Why Browser Choice Matters

Some workflow nodes require advanced browser capabilities, such as:
- Accessing page content and HTML
- Simulating clicks and form input
- Waiting for elements to appear
- Running local AI models
- Storing workflows and knowledge locally

Not all browsers expose these features in the same way.

---

## Chrome and Edge (Recommended)

These browsers provide full support for:
- Page interaction nodes (click, fill, scroll, submit)
- Data extraction nodes
- Triggering workflows from any webpage
- Local storage, vector databases, and RAG
- Marketplace workflows

### If the Extension Does Not Appear

If you do not see AWFlow in your toolbar or right-click menu:

1. Open the extension manager  
   `chrome://extensions/`, `edge://extensions/`, or `about:addons` in Firefox
2. Make sure **AWFlow** is enabled
3. Refresh the webpage you are working on

If the issue persists:
- Disable other automation extensions temporarily
- Restart the browser

---

## Firefox

AWFlow runs in **Firefox 140 or later** (desktop). Workflows, triggers, page steps, integrations and the web app work as in Chrome. The differences are below.

### First run

- **Website access.** Page steps (reading pages, clicking, filling forms) need access to the websites you visit. Firefox lets you turn this off at any time: keep **Access your data for all websites** on in `about:addons` → AWFlow → **Permissions**. If it's off, the app shows an **Allow access** card, and a page step that fails explains how to turn it back on.
- **Usage statistics.** Firefox's install prompt has an optional **technical and interaction data** setting. Anonymous usage statistics and error reports are only sent when it's on, *and* when they're on in **Settings → Privacy**. Settings → Privacy shows Firefox's setting and has an **Allow in Firefox** button.
- **Signing in.** When you sign in to an AWFlow account, Firefox asks your permission to share account data (your email and sign-in details, and the workflows and logs you sync). If you decline, you can keep using the app in local mode, without an account.

### Differences from Chrome

| Area | In Firefox |
|------|------------|
| Where the app opens | In Firefox's **sidebar** instead of Chrome's side panel: click the toolbar icon to show or hide it. The context menu says **Open in Sidebar**. |
| Keyboard shortcuts | Assign [Hotkey](/nodes/builtin/trigger/hotkey/) key combos in `about:addons` → gear menu → **Manage Extension Shortcuts**. |
| Notifications | No action buttons, and notifications close on their own. **Require Interaction** and **Silent** in [Show Notification](/nodes/extension/shownotification/) only apply in Chrome. |
| Local AI | **WebLLM** models need graphics (WebGPU) features that some Firefox and GPU combinations don't offer. They then show **Not supported here** and can't be installed. Use a **Transformers.js** model instead, which runs everywhere. |
| Ollama | Start Ollama with `OLLAMA_ORIGINS=moz-extension://*` (see [Ollama](/nodes/builtin/ai/aidependencies/llm/ollama/)). |
| OAuth credentials | Firefox uses its own redirect URI (`…extensions.allizom.org/oauth2`). Add it to your OAuth client next to Chrome's: see [Create your OAuth client](/app/connections/oauth-client/). |
| Restricted pages | Firefox doesn't let extensions run on its own pages (addons.mozilla.org, support.mozilla.org, Firefox accounts…), like Chrome's Web Store. |
| Chrome AI | The **Chrome AI** node uses Chrome's built-in AI and only works in Chrome. |

If a workflow behaves differently in Firefox than in Chrome, please report it on the <a href="https://community.awflow.io" target="_blank">Community Forum</a> with the node and the page where it happens.

---

## Safari (Not Supported)

Safari does not currently support the extension APIs required to run AWFlow.

### What You Can Do Instead

- Use **Chrome or Edge** on macOS
- Build workflows in another browser and share them
- Follow workflow execution via exported data

Safari support may be reconsidered in the future, but it is not on the current roadmap.

---

## Common Problems and Quick Fixes

### Workflows Do Not Start

- Refresh the page
- Make sure the extension is enabled
- Check that the workflow trigger matches the page

### Click or Fill Nodes Fail

- The page may load content dynamically  
  → Add a **Wait** step before the action
- The website may block automation  
  → Try a different selector or browser

See:
[Wait node](/nodes/builtin/flow/wait/)

You can also explore the available browser automation nodes here:
[Browser extension nodes](/nodes/extension/)

---

### Data Extraction Returns Empty Results

- The content may not be visible yet
- The page may be protected
- The browser may block access

Try:
- Adding a delay or wait node
- Running the workflow manually step by step
- Testing in Chrome or Edge

---

## Permissions and Access

Some websites restrict extension access.

If a workflow does not work on a specific site:

1. Open the extension settings
2. Allow access to the current website
3. Reload the page

This is required for:
- Form filling
- Page extraction
- Trigger-based workflows

---

## Performance Tips

For smoother execution:
- Close unused tabs
- Disable heavy extensions temporarily
- Avoid running many workflows at once
- Prefer Chrome or Edge with default settings

---

## When to Ask for Help

Before reporting an issue, check:
- Browser name and version
- Whether the issue happens in Chrome
- Which node fails
- Whether the page loads content dynamically

Useful links:
- [Troubleshooting guide](/app/troubleshooting/)
- <a href="https://community.awflow.io" target="_blank">Community Forum</a>

---

## Summary

- Chrome and Edge offer full compatibility
- Firefox (140+) is supported, with the differences listed above
- Safari is not supported
- Most issues are browser-related, not workflow-related

Choosing the right browser is the first step to reliable automation.
