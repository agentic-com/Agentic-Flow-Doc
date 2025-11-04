---
title: Text Extraction Node Comparison Guide
description: "Compare different text extraction methods and choose the right approach for your workflow needs."
---

# Text Extraction Node Comparison Guide

**What this guide does:** Helps you choose the right text extraction node for your specific workflow by comparing the different options available.

## Quick Comparison

| Node | When to Use | User Action Required | Best For |
|------|-------------|---------------------|----------|
| **[Get Selected Text](./GetSelectedText.md)** | You want specific text | Yes - highlight text | Focused analysis, quotes |
| **[Get All Text](./GetAllText.md)** | You want everything | No | Full page analysis, monitoring |
| **[Get HTML of Selected Text](./GetHTMLofSelectedText.md)** | You want formatted text | Yes - highlight text | Preserving formatting |
| **[Get All HTML](./GetAllHTML.md)** | You want complete structure | No | Web scraping, archiving |

## Real-World Examples

**Research Assistant**
Use **Get Selected Text** when you want to analyze specific quotes or findings that catch your attention while reading.

**Content Monitoring**
Use **Get All Text** when you want to automatically check if a webpage has changed since your last visit.

**Content Archiving**
Use **Get All HTML** when you want to save complete webpages with all their formatting and structure intact.

## Decision Helper

**Ask yourself these questions:**

1. **Do you want the user to choose what text to extract?**
   - Yes → Use **Get Selected Text** or **Get HTML of Selected Text**
   - No → Use **Get All Text** or **Get All HTML**

2. **Do you need to keep formatting (bold, links, etc.)?**
   - Yes → Use **Get HTML of Selected Text** or **Get All HTML**
   - No → Use **Get Selected Text** or **Get All Text**

3. **Are you processing with AI?**
   - Yes → Use text extraction (cleaner for AI)
   - No → Either option works

## Performance Guide

**Speed (fastest to slowest):**
1. Get Selected Text ⚡ (only selected content)
2. Get HTML of Selected Text ⚡ (only selected content)
3. Get All Text 🐌 (entire page)
4. Get All HTML 🐌🐌 (entire page with formatting)

**Memory Usage (lightest to heaviest):**
1. Get Selected Text 📱 (small selections)
2. Get HTML of Selected Text 📱 (small selections)
3. Get All Text 💻 (text only)
4. Get All HTML 💻💻 (complete page data)

<details>
<summary>🔍 Technical Details</summary>

**Browser Compatibility:**
- All nodes work in Chrome, Firefox, and Edge
- Safari has limited support for selection-based nodes
- HTML extraction may be slower on older browsers

**Common Issues:**
- **No text extracted?** Page might still be loading - add a delay
- **Missing content?** Some text might be loaded by JavaScript after the page appears
- **Too slow?** Set length limits or exclude unnecessary page sections

**Performance Tips:**
- Use selection-based nodes for better performance
- Set maximum length limits for large pages
- Exclude navigation and ads when extracting full pages

</details>

## Common Workflow Patterns

**Pattern 1: User Research**
```
User highlights interesting text → Get Selected Text → AI Analysis → Save insights
```

**Pattern 2: Content Monitoring**
```
Navigate to page → Get All Text → Compare with previous → Alert if changed
```

**Pattern 3: Content Enhancement**
```
User selects text → Get HTML of Selected Text → AI improvement → Replace original
```

## What's Next?

- **[Get Selected Text](./GetSelectedText.md)** - Extract user-highlighted text
- **[Get All Text](./GetAllText.md)** - Extract complete page content
- **[Get All HTML](./GetAllHTML.md)** - Extract complete page structure