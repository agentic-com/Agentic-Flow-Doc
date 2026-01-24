---
title: Performance Optimization
description: Make your workflows faster and more reliable by reducing delays, heavy operations, and unnecessary steps.
---

If a workflow feels slow, freezes the page, or sometimes fails, it is usually not a bug.  
It is often caused by **too much work happening at once inside the browser**.

This page explains how to make workflows **faster, smoother, and more stable**, even on complex websites.

---

## How Workflow Performance Works

Agentic Workflow Studio runs:
- Directly inside your browser
- On the current webpage
- Using your computer’s memory and CPU

This means:
- Heavy pages = slower workflows
- Large extractions = more memory usage
- Too many steps = longer execution time

Good performance starts with **simple workflows**.

---

## Quick Wins (Do These First)

Before changing your workflow:

- Close unused browser tabs
- Restart your browser if it has been open for a long time
- Disable other heavy extensions temporarily
- Use Chrome or Edge for best performance

See:
- [Browser Compatibility](/usage/troubleshooting/browser-compatibility/)

---

## Most Common Causes of Slow Workflows

### Extracting Too Much Data

Extracting the **entire page text or full HTML** can be very slow, especially on long pages.

**Typical symptoms:**
- Workflow takes many seconds to start
- Browser becomes unresponsive
- AI nodes take a long time to answer

**Better approach:**
- Extract only what you need
- Prefer specific sections instead of the full page
- Avoid full HTML unless absolutely necessary

See:
- [Get Page Text](/nodes/extraction/get-page-text/)
- [Get Full Page HTML](/nodes/extraction/get-full-html/)

---

### Running Too Many Extraction Steps

Using many extraction nodes one after another increases execution time.

**Example of a slow pattern:**
- Extract page text
- Extract links
- Extract images
- Extract tables
- Extract metadata

**Better approach:**
- Extract only what your workflow really uses
- Avoid duplicate extractions
- Reuse extracted data when possible

---

### Pages That Load Slowly

Some websites:
- Load content progressively
- Update content while scrolling
- Use heavy animations or scripts

If your workflow starts too early, it will wait or retry.

**Best practice:**
Always add a **Wait for Element** step before extracting.

See:
- [Wait for Element](/nodes/browser-actions/wait-for-element/)

---

## Improving Workflow Speed Step by Step

### 1. Wait Before Acting

Never extract or click immediately after page load.

```mermaid
flowchart TD
    A[Page Opens] --> B[Wait for Element]
    B --> C[Extract Data]
    C --> D[Process or Analyze]
````

Waiting for the right element is faster than retrying failed steps.

---

### 2. Scroll Only When Needed

Scrolling triggers content loading on many websites.

**Use scrolling only if:**

* Data appears when scrolling
* The page uses infinite lists
* Images or items load lazily

Avoid unnecessary scrolling.

See:

* [Scroll Node](/nodes/browser-actions/scroll/)

---

### 3. Reduce AI Input Size

AI nodes slow down when they receive large text.

**If AI feels slow:**

* Send only the relevant text
* Avoid full-page input
* Summarize or filter before analysis

This dramatically improves speed.

See:

* [Local LLM Nodes](/nodes/llm/local-models/)
* [RAG and Knowledge Bases](/usage/knowledge-base/)

---

### 4. Avoid Running Too Many Things at Once

Running many heavy steps together can overload the browser.

**Better pattern:**

* One main extraction
* One transformation or AI step
* One output or action

Simple workflows are faster and more reliable.

---

## Signs Your Workflow Needs Optimization

Watch for these warning signs:

* Execution takes more than 10–15 seconds
* Browser tab freezes temporarily
* Workflow sometimes succeeds, sometimes fails
* Laptop fan turns on loudly
* Results appear only after a long delay

These usually mean the workflow is doing too much.

---

## Recommended Workflow Structure

A fast workflow usually looks like this:

```mermaid
flowchart TD
    A[Trigger] --> B[Wait for Page Ready]
    B --> C[Extract Only Needed Data]
    C --> D[Optional AI or Processing]
    D --> E[Result or Action]
```

If your workflow is much more complex, consider simplifying it.

---

## Performance Best Practices

* Prefer visible text over raw HTML
* Avoid extracting entire pages
* Add wait steps instead of retries
* Limit AI input size
* Test workflows on real pages
* Keep workflows focused on one task

---

## When Performance Is Still an Issue

If the workflow is still slow:

* Test it on a simpler page
* Disable other extensions temporarily
* Split one large workflow into two smaller ones
* Look for a similar workflow in the marketplace

See:

* [Workflow Debugging](/usage/troubleshooting/workflow-debugging/)
* [Known Limitations](/usage/limitations/)
* [Workflow Marketplace](/marketplace/)