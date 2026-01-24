---
title: Browser Compatibility
description: Understand which browsers work with Agentic Workflow Studio and how to fix common compatibility issues.
---

Agentic Workflow Studio runs **entirely inside your browser**.  
Because of this, browser choice and settings directly affect how workflows behave.

This page explains:
- Which browsers are supported
- Known limitations
- Simple steps to fix common issues

---

## Supported Browsers

Agentic Workflow Studio relies on modern browser APIs for automation, DOM access, and local AI execution.

| Browser | Support Level | Notes |
|-------|---------------|------|
| **Google Chrome** | Fully supported | Recommended |
| **Microsoft Edge** | Fully supported | Chromium-based |
| **Firefox** | Partial support | Some automation nodes may not work |
| **Safari** | Not supported | Technical limitations |

<aside>
Chrome or Edge is strongly recommended for the best experience.
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

If you do not see Agentic Workflow Studio in your toolbar or right-click menu:

1. Open the extension manager  
   `chrome://extensions/` or `edge://extensions/`
2. Make sure **Agentic Workflow Studio** is enabled
3. Refresh the webpage you are working on

If the issue persists:
- Disable other automation extensions temporarily
- Restart the browser

---

## Firefox (Limited Support)

Firefox uses stricter security rules that limit what extensions can do on webpages.

### What May Not Work Properly

Some workflows may:
- Fail to click elements
- Stop when extracting page content
- Not detect dynamic elements
- Be blocked on certain websites

These are browser limitations, not workflow errors.

### Recommendation

If a workflow does not behave as expected in Firefox:
- Try the same workflow in **Chrome or Edge**
- Use Firefox only for simple workflows or testing

---

## Safari (Not Supported)

Safari does not currently support the extension APIs required to run Agentic Workflow Studio.

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
  → Add a **Wait for Element** node
- The website may block automation  
  → Try a different selector or browser

See:  
[Page Interaction Nodes](/nodes/browser-actions/)  
[Wait for Element](/nodes/browser-actions/wait-for-element/)

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
- Page scraping
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
- [Workflow Debugging Guide](/usage/troubleshooting/workflow-debugging/)
- [Known Limitations](/usage/limitations/)
- <a href="https://community.awflow.io" target="_blank">Community Forum</a>

---

## Summary

- Chrome and Edge offer full compatibility
- Firefox works with limitations
- Safari is not supported
- Most issues are browser-related, not workflow-related

Choosing the right browser is the first step to reliable automation.
