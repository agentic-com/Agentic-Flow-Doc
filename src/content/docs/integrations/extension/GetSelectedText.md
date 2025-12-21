---
title: Get Selected Text
description: "Capture text you've highlighted on any webpage to analyze, translate, or process with AI."
---

# Get Selected Text

**What it does:** Captures any text you highlight on a webpage so your workflow can analyze, translate, or process it.

**Perfect for:** Research collection • Quote gathering • Language learning • Content analysis

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Trim Whitespace | Boolean | Remove extra spaces from selected text | No | `true` |
| Max Length | Number | Maximum characters to capture (0 = unlimited) | No | `unlimited` |
| Include Context | Boolean | Include 50 characters before/after selection | No | `false` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| selectedText | String | The text you highlighted |
| length | Number | Number of characters in selection |
| wordCount | Number | Number of words in selection |
| pageTitle | String | Title of the webpage |
| pageUrl | String | URL where text was selected |

## Real-World Examples

**Research Assistant**
Highlight key findings from research papers and automatically save them to your knowledge base with source information.

**Language Learning**
Select foreign text on any website to instantly translate it and add to your vocabulary list.

**Content Creation**
Capture interesting quotes or statistics from articles to use in your own writing projects.

## How to Use It

1. **Highlight text** on any webpage by clicking and dragging
2. **Run your workflow** - the node automatically captures what you selected
3. **Process the text** with other nodes like AI analysis or translation

<details>
<summary>🔍 Technical Details</summary>

**Browser Requirements:** Works in Chrome, Firefox, and Edge. Requires permission to access the current webpage.

**Limitations:**
- You must select text before running the workflow
- Cannot capture text from password fields or secure elements
- Some websites may block text selection

</details>
```

## Try It Yourself

**Quick Start Workflow:**
1. Go to any news article or blog post
2. Highlight an interesting paragraph
3. Use this node to capture the text
4. Connect it to an AI node to summarize or analyze the content

**Common Issues:**
- **No text captured?** Make sure you've highlighted text before running the workflow
- **Missing formatting?** Enable "Include Formatting" in the node settings
- **Text too long?** Set a "Max Length" limit to avoid processing issues

## What's Next?

**Related nodes:** [Get All Text](./GetAllText.md) • [Insert Text](./InsertText.md) • [Content Replacer](./ContentReplacer.md)

**Common workflows:** [Smart Text Extraction](/advanced-ai/examples/smart-text-extraction/) • [Research Collection](/learning/workflow-patterns/real-world-examples/research-automation/) • [Content Analysis](/advanced-ai/examples/intelligent-content-analysis/)

**Learn more:** [First Workflow Tutorial](/learning/text-courses/beginner/first-workflow/) • [Text Processing Patterns](/learning/workflow-patterns/data-processing-patterns/)