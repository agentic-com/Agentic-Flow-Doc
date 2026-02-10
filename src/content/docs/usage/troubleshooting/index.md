---
title: Troubleshooting Guide
description: Quick solutions for common extension and workflow issues in Agentic Workflow Studio.
---

If your workflow isn’t behaving as expected, this guide helps you diagnose and fix common problems quickly.

---

## Start with These Basic Checks

Before diving into detailed troubleshooting, confirm:

- The browser page has fully loaded before running a workflow.
- The extension has the required permissions for the site.
- You’ve refreshed the page and restarted the browser.
- Your workflow is valid and all required inputs are provided.

These simple steps fix many issues without further steps.

---

## Common Problems & How to Fix Them

### Browser Compatibility Issues

Your workflow may not run properly if:

- The browser blocks certain scripting or permissions.
- The site uses strict security headers.

**Tips for resolution:**

- Try a different browser (Chrome, Firefox).
- Ensure you enabled the extension for the current site.
- Re-load page elements before your automation steps.

See a more detailed overview on the [Browser Compatibility reference page](/usage/troubleshooting/browser-compatibility/).

---

### Permissions & Security Blocks

If actions like clicking or extracting content fail:

- Confirm the extension has access to run on the site.
- Some sites block scripts on sensitive pages (e.g., banking sites).

**Fixes:**

- Enable full extension permissions for that domain.
- If a workflow fails due to popups or dialogs, add a “Wait for Element” step before actions.

For specific permission problems, see our [Permissions & Security guide](/usage/troubleshooting/permissions-security/).

---

### Slow or Unresponsive Workflows

Performance issues can cause steps to time out.

- Increase wait times for actions on slow pages.
- Break workflows into smaller chunks.
- Reduce heavy extraction tasks into separate workflows.

More tips can be found on the [Performance Optimization page](/usage/troubleshooting/performance-optimization/).

---

### Data Extraction Problems

If workflows return empty text or missing values:

- Ensure the selectors are specific and correct.
- Use “Wait for Element” before extraction steps.
- Try filtering or verifying the extraction pattern.

See our detailed troubleshooting examples on the [Data Extraction page](/usage/troubleshooting/data-extraction/).

---

### Node Connection Issues

If data doesn’t flow between steps:

- Check that each node is connected correctly.
- Ensure key inputs are provided for the next node.
- Verify that you are using the right node type for your goal.

For help with workflow structure, see [Workflow Connections reference](/usage/troubleshooting/workflow-connections/).

---

## Systematic Troubleshooting

If the issue is unclear, use our decision guide to isolate where the problem occurs. The [Full Troubleshooting Flowchart](/usage/troubleshooting/troubleshooting-decision-guide/) walks you through checking each part of your workflow.

---

## Still Stuck?

If you cannot find a solution:

- Search or post in the <a href="https://community.agenticflow.com" target="_blank" rel="noopener noreferrer">community forum</a> describing what you see.
- Include step details, screenshots, and (if possible) exported workflow JSON.

Providing clear context helps others diagnose issues faster.

See also [Where to Get Help](/usage/help-and-community/help/) for more ways to reach support resources.
