---
title: Process HTML
description: "Parse, clean, and transform HTML content to extract specific elements, remove unwanted code, or convert formats."
---

# Process HTML

**What it does:** Takes HTML content and processes it by extracting specific elements, cleaning unwanted code, converting formats, or restructuring the content.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| HTML Content | String | The HTML code to process | Yes | `""` |
| Operation | String | What to do: `extract`, `clean`, `convert`, `restructure` | No | `clean` |
| Target Elements | String | CSS selector for elements to focus on | No | `""` |
| Output Format | String | Format for results: `html`, `text`, `markdown` | No | `html` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| processedContent | String | The processed HTML or converted content |
| extractedElements | Array | Specific elements that were extracted |
| originalSize | Number | Size of original HTML in characters |
| processedSize | Number | Size after processing |

## Real-World Examples

**Content Cleaning**
Remove ads, tracking scripts, and unnecessary elements from HTML to focus on the main content.

**Data Extraction**
Extract specific information like product details, prices, or contact information from HTML pages.

**Format Conversion**
Convert HTML content to Markdown, plain text, or other formats for use in different systems.

## How to Use It

1. **Get HTML content** - from Get All HTML or other sources
2. **Choose processing type** - extract, clean, convert, or restructure
3. **Set target elements** - specify what parts to focus on (optional)
4. **Run the workflow** - get processed content ready for use

**Simple Example:**
```json
{
  "htmlContent": "<html>...</html>",
  "operation": "clean",
  "targetElements": ".main-content",
  "outputFormat": "html"
}
```

<details>
<summary>🔍 Technical Details</summary>

**Processing Operations:**
- **Extract**: Pull out specific elements or content sections
- **Clean**: Remove unwanted elements, scripts, and attributes
- **Convert**: Transform HTML to other formats (Markdown, text)
- **Restructure**: Reorganize elements and content hierarchy

**Target Selection:**
- Use CSS selectors to focus on specific parts of the HTML
- Leave empty to process the entire HTML content
- Combine multiple selectors with commas

**Output Formats:**
- **HTML**: Processed HTML code
- **Text**: Plain text with formatting removed
- **Markdown**: Markdown format for documentation

**Performance:**
- Large HTML documents may take longer to process
- Complex operations require more processing time
- Simple cleaning operations are very fast

</details>

## Try It Yourself

**Clean Content:**
```json
{
  "operation": "clean",
  "targetElements": "article, .content",
  "outputFormat": "html"
}
```

**Extract Product Info:**
```json
{
  "operation": "extract",
  "targetElements": ".price, .product-name, .description",
  "outputFormat": "text"
}
```

**Convert to Markdown:**
```json
{
  "operation": "convert",
  "targetElements": "",
  "outputFormat": "markdown"
}
```

**Common Issues:**
- **No results?** Check that your target elements exist in the HTML
- **Missing content?** Try using broader CSS selectors or no selector at all
- **Formatting issues?** Different output formats handle styling differently

## What's Next?

- **[Get All HTML](./GetAllHTML.md)** - Extract HTML content to process
- **[Content Replacer](./ContentReplacer.md)** - Replace content with processed results
- **[Insert Content](./InsertContent.md)** - Add processed content to webpages