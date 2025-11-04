---
title: Get HTML of Selected Text
description: "Extract selected text with all its formatting, links, and structure preserved for processing or conversion."
---

# Get HTML of Selected Text

**What it does:** Captures text you've highlighted on a webpage along with all its formatting, links, and HTML structure, perfect for preserving rich content.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Include Outer Tags | Boolean | Include the container elements | No | `true` |
| Preserve Attributes | Boolean | Keep HTML attributes like classes and IDs | No | `true` |
| Clean Markup | Boolean | Remove unnecessary HTML attributes | No | `false` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| htmlContent | String | Selected content with HTML formatting |
| plainText | String | Same content as plain text |
| elementCount | Number | Number of HTML elements in selection |
| hasLinks | Boolean | Whether the selection contains links |

## Real-World Examples

**Content Archiving**
Save formatted articles or blog posts with all their links, bold text, and structure intact for later reference.

**Content Migration**
Copy rich content from one website to another while preserving all formatting and links.

**Research Collection**
Gather formatted quotes and citations with their original styling for academic or professional research.

## How to Use It

1. **Highlight content** on any webpage by clicking and dragging
2. **Run your workflow** - the node captures the selected content with formatting
3. **Process the HTML** with other nodes for conversion or analysis
4. **Use the content** in documents, emails, or other applications

**Simple Example:**
```json
{
  "includeOuterTags": true,
  "preserveAttributes": true,
  "cleanMarkup": false
}
```

<details>
<summary>🔍 Technical Details</summary>

**What gets preserved:**
- Text formatting (bold, italic, underline)
- Links and their destinations
- HTML structure (headings, lists, paragraphs)
- Images and media elements
- CSS classes and styling information

**Content Options:**
- **Include Outer Tags**: Captures the container elements around your selection
- **Preserve Attributes**: Keeps CSS classes, IDs, and other HTML attributes
- **Clean Markup**: Removes tracking codes and unnecessary attributes

**Browser Requirements:** Works in Chrome, Firefox, and Edge. Requires permission to access the current webpage.

**Limitations:**
- You must select text before running the workflow
- Cannot capture content from password fields or secure elements
- Some websites may prevent content extraction

</details>

## Try It Yourself

**Rich Content Archive:**
```json
{
  "includeOuterTags": true,
  "preserveAttributes": true,
  "cleanMarkup": false
}
```

**Clean Content Copy:**
```json
{
  "includeOuterTags": false,
  "preserveAttributes": false,
  "cleanMarkup": true
}
```

**Formatted Research:**
```json
{
  "includeOuterTags": true,
  "preserveAttributes": true,
  "cleanMarkup": true
}
```

**Common Issues:**
- **No content captured?** Make sure you've highlighted text before running the workflow
- **Missing formatting?** Enable "Preserve Attributes" to keep styling information
- **Too much extra code?** Enable "Clean Markup" to remove unnecessary HTML

## What's Next?

- **[Get Selected Text](./GetSelectedText.md)** - Extract just the plain text without formatting
- **[Content Replacer](./ContentReplacer.md)** - Replace the selected content with processed version
- **[Insert Text](./InsertText.md)** - Add new content near your selection