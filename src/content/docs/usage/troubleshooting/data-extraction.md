---
title: Data Extraction Issues
description: Learn why extracted data may be missing or incomplete and how to fix it using simple workflow steps.
---

Data extraction is one of the most common steps in a workflow.  
If data is missing, empty, or incomplete, the workflow may still run — but produce the wrong result.

This page helps you understand **why extraction fails** and **how to fix it without technical knowledge**.

---

## What “Data Extraction” Means

Extraction is any action that reads information from a webpage, such as:
- Page text
- Selected text
- HTML content
- Links or images
- Tables
- Metadata (title, description, meta tags)

If the data is not visible or not ready, it cannot be extracted.

---

## First Things to Check

Before changing your workflow, verify these points:

- Is the content **visible on the page**?
- Does the content appear **after a short delay**?
- Does the page update **without reloading**?
- Are you extracting from the **correct page**?

Most extraction problems come from **timing**, not from wrong configuration.

---

## Most Common Problems (and Fixes)

### No Data Is Extracted

You expected text or data, but the result is empty.

**Common reasons:**
- The page has not finished loading
- The content appears after scrolling
- The content is generated dynamically
- The content is inside another section or frame

**Recommended fix:**

Add a **Wait for Element** node *before* the extraction step.

See:
- [Wait node](/nodes/builtin/flow/wait/)
- [Browser extension nodes](/nodes/extension/)

---

### Only Part of the Data Is Extracted

You see some results, but not everything.

**Common reasons:**
- Content loads progressively (infinite scroll)
- Only visible items are loaded
- Pagination is used
- The page updates as you scroll

**Recommended fixes:**
- Add a **Scroll** node before extraction
- Repeat scrolling until no new content appears
- Extract after scrolling is complete

See:
- [Extract links (Get All Links)](/nodes/extension/GetAllLinks/)
- [Extract images (Get All Images)](/nodes/extension/GetAllImages/)

---

### Extracted Text Looks “Messy”

The data contains:
- Extra spaces
- Line breaks
- Unwanted symbols
- Mixed text (labels + values)

This is normal. Web pages are built for humans, not data.

**Recommended fix:**
- Use text extraction instead of HTML extraction
- Clean or transform the data in a later workflow step
- Let an LLM node reformat the result if needed

See:
- [Get page text (Get All Text)](/nodes/extension/GetAllText/)
- [LLM nodes](/nodes/builtin/ai/)

---

### Extraction Works Sometimes, But Not Always

The workflow succeeds on one page load, then fails on another.

**Common reasons:**
- Content loads at different speeds
- Website behavior changes slightly
- Network delay

**Recommended fix:**
- Always add a **Wait for Element** or **Delay**
- Avoid extracting immediately after page load
- Prefer “wait until visible” instead of fixed delays

---

## Pages That Are Harder to Extract From

Some websites are more complex by design.

### Dynamic Web Apps

Many modern websites update content without reloading the page.

**Symptoms:**
- URL changes but page does not reload
- Content appears gradually
- Buttons load new content dynamically

**Best practice:**
- Wait for a specific element that confirms the page is ready
- Extract only after the page visually stabilizes

---

### Content Inside Frames

Some content is embedded inside frames.

**Symptoms:**
- You see content visually
- Extraction returns nothing

**What to know:**
- Some embedded content cannot be accessed due to browser security
- This is a browser limitation, not a workflow error

**Workaround:**
- Extract from the main page when possible
- Use visible text instead of internal structure

---

## Recommended Extraction Order

A reliable workflow usually follows this structure:

```mermaid
flowchart TD
    A[Page Opens] --> B[Wait for Element]
    B --> C[Scroll if Needed]
    C --> D[Extract Data]
    D --> E[Process or Use Data]
````

Skipping the “wait” step is the most common mistake.

---

## Best Practices for Reliable Extraction

* Always wait before extracting
* Prefer visible text over raw HTML
* Scroll before extracting long lists
* Test workflows on real pages, not blank tabs
* Use Chrome or Edge for best compatibility

See:

* [Browser Compatibility](/usage/troubleshooting/browser-compatibility/)
* [Troubleshooting Guide](/usage/troubleshooting/)

---

## When Extraction Still Fails

If nothing works:

* Try the same workflow on a similar page
* Test in Chrome or Edge
* Confirm the content is not blocked or protected
* Simplify the workflow and test step by step

You can also:

* Import a similar workflow from the marketplace
* Ask the community for patterns and templates