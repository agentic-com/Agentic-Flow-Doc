---
title: Get All Text
description: "Extract all visible text from a webpage to analyze content, create summaries, or process large amounts of text data."
---

# Get All Text

**What it does:** Extracts all visible text from a webpage, giving you the complete text content to analyze, summarize, or process with other tools.

**Perfect for:** Content analysis • Research collection • SEO audits • AI text processing

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Include Hidden Text | Boolean | Extract text from hidden elements too | No | `false` |
| Max Length | Number | Maximum characters to extract (0 = unlimited) | No | `100000` |
| Include Links | Boolean | Include URLs from links in the text | No | `false` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| fullText | String | All the text content from the page |
| wordCount | Number | Total number of words found |
| characterCount | Number | Total number of characters |
| pageTitle | String | Title of the webpage |
| pageUrl | String | URL of the webpage |

## Real-World Examples

**Content Analysis**
Extract all text from articles or blog posts to analyze writing style, sentiment, or key topics.

**Research Data Collection**
Gather text content from multiple research sources to build a comprehensive knowledge base.

**SEO Content Review**
Extract all text from webpages to analyze keyword density and content quality.

## How to Use It

1. **Navigate to the webpage** you want to extract text from
2. **Configure the settings** - set limits or include options as needed
3. **Run the workflow** - the node automatically extracts all visible text
4. **Process the text** with other nodes like AI analysis or data storage

**Simple Example:**
```json
{
  "includeHiddenText": false,
  "maxLength": 50000,
  "includeLinks": true
}
```

<details>
<summary>🔍 Technical Details</summary>

**Text Extraction:** The node reads all visible text elements on the page, excluding navigation menus, ads, and other non-content areas when possible.

**Content Filtering:** You can exclude hidden text, limit the amount of text extracted, and choose whether to include link URLs.

**Performance:** Large pages may take longer to process. Setting a max length helps prevent memory issues.

**Limitations:**
- Cannot extract text from images or videos
- Some dynamic content may not be captured if it loads after the page
- Very large pages may hit browser memory limits

</details>

## Try It Yourself

**Article Analysis:**
```json
{
  "includeHiddenText": false,
  "maxLength": 0,
  "includeLinks": false
}
```

**Research Collection:**
```json
{
  "includeHiddenText": false,
  "maxLength": 25000,
  "includeLinks": true
}
```

**Content Monitoring:**
```json
{
  "includeHiddenText": false,
  "maxLength": 10000,
  "includeLinks": false
}
```

**Common Issues:**
- **No text extracted?** The page might still be loading - try waiting a moment before running
- **Too much irrelevant text?** The extraction includes navigation and footer text - use AI filtering to focus on main content
- **Missing some content?** Dynamic content that loads after the page may not be captured

## What's Next?

**Related nodes:** [Get Selected Text](./GetSelectedText.md) • [Get All HTML](./GetAllHTML.md) • [Content Replacer](./ContentReplacer.md)

**Common workflows:** [Smart Text Extraction](/advanced-ai/examples/smart-text-extraction/) • [Content Analysis](/advanced-ai/examples/intelligent-content-analysis/) • [Research Automation](/learning/workflow-patterns/real-world-examples/research-automation/)

**Build a research database**: Combine with [Edit Fields](/integrations/builtin/dataTransformation/EditFields/) to clean and organize extracted content