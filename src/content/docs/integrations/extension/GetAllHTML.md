---
title: Get All HTML
description: "Extract complete HTML source code from webpages for analysis, archiving, or processing with other tools."
---

# Get All HTML

**What it does:** Extracts the complete HTML source code from a webpage, giving you all the underlying structure and content for analysis, archiving, or processing.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Include Metadata | Boolean | Extract SEO and page information | No | `true` |
| Exclude Scripts | Boolean | Remove JavaScript code from output | No | `false` |
| Pretty Print | Boolean | Format HTML for easier reading | No | `false` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| html | String | Complete HTML source code of the page |
| pageTitle | String | Title of the webpage |
| elementCount | Number | Total number of HTML elements found |
| pageSize | Number | Size of the HTML content in bytes |

## Real-World Examples

**SEO Analysis**
Extract HTML to analyze meta tags, heading structure, and schema markup for search engine optimization.

**Competitor Research**
Study how competitors structure their pages and what technologies they use.

**Web Archiving**
Save complete webpage snapshots with all formatting and structure preserved for future reference.

## How to Use It

1. **Navigate to the webpage** you want to extract HTML from
2. **Configure extraction options** - choose what to include or exclude
3. **Run the workflow** - the node captures all the HTML code
4. **Process the HTML** with other nodes for analysis or storage

**Simple Example:**
```json
{
  "includeMetadata": true,
  "excludeScripts": false,
  "prettyPrint": true
}
```

<details>
<summary>🔍 Technical Details</summary>

**What you get:**
- Complete HTML source code including all tags and attributes
- Page metadata like title, description, and SEO information
- Structure analysis showing element counts and organization
- Optional formatting to make the code easier to read

**Content Options:**
- **Include Metadata**: Extracts SEO tags, Open Graph data, and structured markup
- **Exclude Scripts**: Removes JavaScript for security or to focus on content
- **Pretty Print**: Formats the HTML with proper indentation for readability

**Performance:**
- Large pages may take longer to process
- Set size limits for very large pages
- Consider excluding scripts and styles for faster processing

**Limitations:**
- Cannot capture dynamically loaded content that appears after page load
- Some websites may prevent HTML extraction
- Very large pages may hit browser memory limits

</details>

## Try It Yourself

**SEO Analysis:**
```json
{
  "includeMetadata": true,
  "excludeScripts": true,
  "prettyPrint": true
}
```

**Complete Page Archive:**
```json
{
  "includeMetadata": true,
  "excludeScripts": false,
  "prettyPrint": false
}
```

**Clean Content Focus:**
```json
{
  "includeMetadata": false,
  "excludeScripts": true,
  "prettyPrint": true
}
```

**Common Issues:**
- **HTML looks messy?** Enable "Pretty Print" to format it nicely
- **Too much code?** Enable "Exclude Scripts" to focus on content structure
- **Missing dynamic content?** Some content loads after the page - try waiting before extraction

## What's Next?

- **[Get All Text](./GetAllText.md)** - Extract just the text content instead of HTML
- **[Process HTML](./ProcessHTML.md)** - Parse and analyze the extracted HTML
- **[Get Selected Text](./GetSelectedText.md)** - Extract specific portions instead of everything