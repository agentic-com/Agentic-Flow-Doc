---
title: Get All Links
description: "Extract all links from a webpage to analyze site structure, find related content, or build navigation workflows."
---

# Get All Links

**What it does:** Extracts all links from a webpage, giving you URLs and link text to analyze site structure, find related content, or build automated navigation workflows.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Include External Links | Boolean | Extract links to other websites | No | `true` |
| Include Internal Links | Boolean | Extract links within the same site | No | `true` |
| Max Links | Number | Maximum number of links to extract | No | `1000` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| links | Array | List of all found links with URLs and text |
| totalLinks | Number | Total number of links found |
| internalLinks | Array | Links within the same website |
| externalLinks | Array | Links to other websites |

## Real-World Examples

**Competitor Analysis**
Extract all links from competitor websites to understand their content strategy and partnerships.

**Site Navigation Mapping**
Discover all internal links to understand website structure and create automated navigation workflows.

**Link Building Research**
Find external links on relevant websites to identify potential partnership or outreach opportunities.

## How to Use It

1. **Navigate to the webpage** you want to analyze
2. **Configure link types** - choose internal, external, or both
3. **Run the workflow** - the node finds all links on the page
4. **Process the links** with other nodes like navigation or analysis

**Simple Example:**
```json
{
  "includeExternalLinks": true,
  "includeInternalLinks": true,
  "maxLinks": 500
}
```

<details>
<summary>🔍 Technical Details</summary>

**Link Detection:** The node finds all clickable links (`<a>` tags) on the page and extracts their URLs and visible text.

**Link Classification:** Links are automatically classified as internal (same domain) or external (different domain).

**URL Processing:** Relative URLs are converted to full URLs for easier processing.

**Limitations:**
- Cannot detect links created by JavaScript after page load
- Some dynamic navigation may not be captured
- Very large pages may hit the link limit

</details>

## Try It Yourself

**Site Analysis:**
```json
{
  "includeExternalLinks": true,
  "includeInternalLinks": true,
  "maxLinks": 0
}
```

**Navigation Discovery:**
```json
{
  "includeExternalLinks": false,
  "includeInternalLinks": true,
  "maxLinks": 100
}
```

**Partnership Research:**
```json
{
  "includeExternalLinks": true,
  "includeInternalLinks": false,
  "maxLinks": 200
}
```

**Common Issues:**
- **No links found?** The page might use JavaScript navigation - try waiting for the page to fully load
- **Missing some links?** Dynamic menus or hidden navigation may not be captured
- **Too many irrelevant links?** Set a lower max limit or filter results with other nodes

## What's Next?

- **[Navigate to Link](./NavigateToLink.md)** - Visit the links you've extracted
- **[Get All Text](./GetAllText.md)** - Extract content from the linked pages
- **[Form Filler](./FormFiller.md)** - Fill forms on the pages you navigate to