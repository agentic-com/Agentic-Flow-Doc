---
title: Process HTML
description: "Parse, manipulate, and transform HTML content using Agentic Workflow Studio browser extension for advanced content processing workflows."
---

The **Process HTML** node provides comprehensive HTML parsing, manipulation, and transformation capabilities, enabling sophisticated content processing workflows that can analyze, modify, and restructure HTML content programmatically.

## How it Works

This node takes HTML content as input and applies various processing operations including parsing, element manipulation, content extraction, structure modification, and output formatting. It uses advanced DOM parsing and manipulation techniques to provide precise control over HTML content.

## Browser API Details

The node leverages multiple browser APIs for comprehensive HTML processing:

### Core APIs Used

**DOM Parser API**
- `DOMParser.parseFromString()`: Parse HTML strings into DOM objects
- `XMLSerializer.serializeToString()`: Convert DOM back to HTML strings
- `Document.createElement()`: Create new HTML elements
- `Element.cloneNode()`: Clone existing elements with or without children

**DOM Manipulation API**
- `Element.appendChild()`: Add elements to DOM structure
- `Element.insertBefore()`: Insert elements at specific positions
- `Element.removeChild()`: Remove elements from DOM
- `Element.replaceChild()`: Replace existing elements

**CSS Selector API**
- `Document.querySelector()`: Find single elements by CSS selector
- `Document.querySelectorAll()`: Find multiple elements by CSS selector
- `Element.matches()`: Check if element matches selector
- `Element.closest()`: Find closest ancestor matching selector

**HTML Processing API**
- `Element.innerHTML`: Get/set HTML content of elements
- `Element.outerHTML`: Get/set element including its tags
- `Element.textContent`: Get/set text content without HTML
- `Node.nodeType`: Identify node types (element, text, comment)

### Required Permissions

| Permission | Purpose | Scope |
|------------|---------|-------|
| `activeTab` | Access currently active browser tab | Current tab only |
| `scripting` | Inject content scripts for DOM access | Active tab content |
| `storage` | Cache processing results and templates | Extension storage |

## Configuration

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **HTML Content** | String | Yes | `""` | The HTML content to process |
| **Processing Mode** | String | No | `parse` | Processing mode: `parse`, `transform`, `extract`, `validate` |
| **Output Format** | String | No | `html` | Output format: `html`, `json`, `text`, `markdown` |
| **Preserve Structure** | Boolean | No | `true` | Maintain original HTML structure when possible |
| **Include Metadata** | Boolean | No | `true` | Include processing metadata in output |

### Parsing Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Parser Mode** | String | No | `html` | Parser type: `html`, `xml`, `xhtml` |
| **Error Handling** | String | No | `lenient` | Error handling: `strict`, `lenient`, `ignore` |
| **Namespace Aware** | Boolean | No | `false` | Handle XML namespaces and custom elements |
| **Validate Structure** | Boolean | No | `true` | Validate HTML structure during parsing |
| **Fragment Mode** | Boolean | No | `false` | Parse as HTML fragment (no html/body wrapper) |
| **Custom Elements** | Boolean | No | `true` | Support custom HTML elements |

### Element Selection & Filtering

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Target Selectors** | Array | No | `[]` | CSS selectors for elements to process |
| **Exclude Selectors** | Array | No | `[]` | CSS selectors for elements to exclude |
| **Element Types** | Array | No | `[]` | HTML element types to include (e.g., `["p", "div", "span"]`) |
| **Attribute Filters** | Object | No | `{}` | Filter elements by attributes (e.g., `{"class": "content"}`) |
| **Content Filters** | Array | No | `[]` | Text content patterns to match |
| **Depth Limit** | Number | No | `0` | Maximum nesting depth to process (0 = unlimited) |

### Transformation Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Transform Rules** | Array | No | `[]` | Transformation rules to apply |
| **Element Mapping** | Object | No | `{}` | Map element types (e.g., `{"b": "strong"}`) |
| **Attribute Mapping** | Object | No | `{}` | Map attribute names |
| **Content Processing** | String | No | `preserve` | Content processing: `preserve`, `clean`, `normalize` |
| **URL Processing** | String | No | `preserve` | URL handling: `preserve`, `absolute`, `relative`, `remove` |
| **Style Processing** | String | No | `preserve` | Style handling: `preserve`, `inline`, `external`, `remove` |

### Extraction Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Extract Elements** | Array | No | `[]` | Element types to extract |
| **Extract Attributes** | Array | No | `[]` | Attributes to extract from elements |
| **Extract Text** | Boolean | No | `false` | Extract text content from elements |
| **Extract Links** | Boolean | No | `false` | Extract all links with metadata |
| **Extract Images** | Boolean | No | `false` | Extract image information |
| **Extract Tables** | Boolean | No | `false` | Extract table data as structured format |
| **Extract Forms** | Boolean | No | `false` | Extract form structure and field information |

### Cleaning & Sanitization

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Remove Scripts** | Boolean | No | `true` | Remove all script elements |
| **Remove Styles** | Boolean | No | `false` | Remove style elements and attributes |
| **Remove Comments** | Boolean | No | `false` | Remove HTML comments |
| **Remove Empty Elements** | Boolean | No | `false` | Remove elements with no content |
| **Sanitize Attributes** | Boolean | No | `true` | Remove potentially dangerous attributes |
| **Allowed Tags** | Array | No | `[]` | Whitelist of allowed HTML tags |
| **Allowed Attributes** | Array | No | `[]` | Whitelist of allowed attributes |
| **Content Security** | String | No | `strict` | Security level: `strict`, `moderate`, `permissive` |

## Usage Examples

### HTML Structure Analysis

Analyze and extract structural information from HTML:

```javascript
// Configuration for structure analysis
{
  "htmlContent": "<article><h1>Title</h1><p>Content...</p></article>",
  "processingMode": "extract",
  "extractElements": ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
  "extractText": true,
  "includeMetadata": true
}

// Output: Structured data about headings, paragraphs, and content hierarchy
{
  "structure": {
    "headings": [{"level": 1, "text": "Title", "id": null}],
    "paragraphs": [{"text": "Content...", "wordCount": 15}],
    "hierarchy": ["article > h1", "article > p"]
  },
  "statistics": {
    "elementCount": 3,
    "textLength": 120,
    "nestingDepth": 2
  }
}
```

### Content Transformation Workflow

Transform HTML content with custom rules:

```javascript
// Configuration for content transformation
{
  "htmlContent": "<div><b>Bold text</b> and <i>italic text</i></div>",
  "processingMode": "transform",
  "transformRules": [
    {"from": "b", "to": "strong"},
    {"from": "i", "to": "em"}
  ],
  "elementMapping": {"b": "strong", "i": "em"},
  "outputFormat": "html"
}

// Transforms deprecated tags to semantic equivalents
// Input: <div><b>Bold text</b> and <i>italic text</i></div>
// Output: <div><strong>Bold text</strong> and <em>italic text</em></div>
```

### Data Extraction from Tables

Extract structured data from HTML tables:

```javascript
// Configuration for table extraction
{
  "htmlContent": "<table><tr><th>Name</th><th>Age</th></tr><tr><td>John</td><td>30</td></tr></table>",
  "processingMode": "extract",
  "extractTables": true,
  "outputFormat": "json"
}

// Output: Structured table data
{
  "tables": [
    {
      "headers": ["Name", "Age"],
      "rows": [["John", "30"]],
      "rowCount": 1,
      "columnCount": 2
    }
  ]
}
```

### HTML Sanitization and Cleaning

Clean and sanitize HTML content for safe use:

```javascript
// Configuration for HTML sanitization
{
  "htmlContent": "<div onclick='alert(\"xss\")'>Content <script>malicious()</script></div>",
  "processingMode": "transform",
  "removeScripts": true,
  "sanitizeAttributes": true,
  "allowedTags": ["div", "p", "span", "strong", "em"],
  "allowedAttributes": ["class", "id"],
  "contentSecurity": "strict"
}

// Output: Clean, safe HTML
// Result: <div>Content </div>
```

### Content Migration and Format Conversion

Convert HTML to different formats:

```javascript
// Configuration for format conversion
{
  "htmlContent": "<article><h1>Title</h1><p>Paragraph content</p></article>",
  "processingMode": "transform",
  "outputFormat": "markdown",
  "preserveStructure": true
}

// Output: Markdown format
// Result: "# Title\n\nParagraph content"
```

### Link Processing and URL Resolution

Process and resolve URLs in HTML content:

```javascript
// Configuration for link processing
{
  "htmlContent": "<a href='/relative-link'>Link</a>",
  "processingMode": "transform",
  "urlProcessing": "absolute",
  "baseUrl": "https://example.com",
  "extractLinks": true
}

// Output: Processed HTML with absolute URLs
{
  "html": "<a href='https://example.com/relative-link'>Link</a>",
  "links": [
    {
      "text": "Link",
      "href": "https://example.com/relative-link",
      "type": "internal"
    }
  ]
}
```

### Form Structure Analysis

Extract and analyze form structures:

```javascript
// Configuration for form analysis
{
  "htmlContent": "<form><input type='email' name='email' required><button type='submit'>Submit</button></form>",
  "processingMode": "extract",
  "extractForms": true,
  "includeMetadata": true
}

// Output: Form structure data
{
  "forms": [
    {
      "method": "get",
      "action": "",
      "fields": [
        {
          "type": "email",
          "name": "email",
          "required": true,
          "validation": "email"
        }
      ],
      "buttons": [
        {
          "type": "submit",
          "text": "Submit"
        }
      ]
    }
  ]
}
```

## Integration Patterns

### With Content Analysis Workflows

```javascript
// Pattern: HTML processing → content analysis → insights
Process HTML → Extract Structure → Analyze Content → Generate Report
```

### With Data Migration Workflows

```javascript
// Pattern: Content migration and transformation
Get HTML → Process HTML → Transform Format → Validate Output → Store Result
```

### With Content Enhancement Workflows

```javascript
// Pattern: Content enhancement and optimization
Process HTML → Clean Content → Add Metadata → Optimize Structure → Output Enhanced HTML
```

### With Validation and Quality Assurance

```javascript
// Pattern: HTML validation and quality checking
Process HTML → Validate Structure → Check Accessibility → Generate Quality Report
```

## Advanced Processing Features

### Custom Transformation Rules

Define complex transformation rules:

```javascript
// Example transformation rules
{
  "transformRules": [
    {
      "selector": "div.old-class",
      "action": "replace-class",
      "newClass": "new-class"
    },
    {
      "selector": "img[src^='http://']",
      "action": "update-attribute",
      "attribute": "src",
      "transform": "http-to-https"
    },
    {
      "selector": "a[href^='/']",
      "action": "resolve-url",
      "baseUrl": "https://example.com"
    }
  ]
}
```

### Template Processing

Process HTML templates with dynamic content:

```javascript
// Template processing configuration
{
  "htmlContent": "<div>{{title}}</div><p>{{content}}</p>",
  "processingMode": "template",
  "templateData": {
    "title": "Dynamic Title",
    "content": "Dynamic content here"
  },
  "templateEngine": "mustache"
}
```

### Batch Processing

Process multiple HTML documents:

```javascript
// Batch processing configuration
{
  "htmlDocuments": ["<html>...</html>", "<html>...</html>"],
  "processingMode": "batch",
  "batchSize": 10,
  "parallelProcessing": true
}
```

## Error Handling

### Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| Parse Error | Malformed HTML input | Enable lenient parsing or fix HTML |
| Selector Invalid | Invalid CSS selector syntax | Validate selector syntax |
| Memory Limit | HTML content too large | Reduce content size or increase limits |
| Transform Failed | Invalid transformation rule | Check rule syntax and selectors |
| Security Violation | Unsafe content detected | Enable sanitization or adjust security level |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "type": "PARSE_ERROR",
    "message": "Invalid HTML structure detected",
    "details": {
      "line": 15,
      "column": 23,
      "element": "div",
      "issue": "Unclosed tag"
    }
  },
  "partialResult": {
    "processedElements": 45,
    "validHTML": "<div>Partial content...</div>"
  },
  "suggestions": [
    "Enable lenient parsing mode",
    "Fix HTML structure before processing",
    "Use fragment mode for partial HTML"
  ]
}
```

## Performance Optimization

### Processing Performance

| HTML Size | Processing Time | Memory Usage | Recommendations |
|-----------|----------------|--------------|-----------------|
| < 50KB | < 50ms | Low | No optimization needed |
| 50-200KB | 50-200ms | Moderate | Consider selective processing |
| 200KB-1MB | 200ms-1s | High | Use batch processing |
| > 1MB | > 1s | Very High | Split into chunks, use streaming |

### Memory Management

**DOM Object Handling**
- Clear DOM references after processing
- Use document fragments for large manipulations
- Implement garbage collection for long-running processes

**Batch Processing Optimization**
- Process large documents in chunks
- Use streaming for very large HTML content
- Implement progress tracking for user feedback

## Security Considerations

### Content Sanitization

**XSS Prevention**
- Remove script tags and event handlers by default
- Sanitize href and src attributes
- Validate CSS content in style attributes
- Use whitelist approach for allowed elements and attributes

**Content Security Policy Compliance**
- Respect CSP restrictions when processing content
- Use safe DOM methods for content manipulation
- Avoid innerHTML when CSP is strict

### Data Privacy

**Sensitive Content Handling**
- Process HTML content locally in browser
- No automatic transmission of processed content
- Clear sensitive data from memory after processing
- Provide options to exclude sensitive elements

## Best Practices

### Performance
1. **Selective Processing**: Only process elements you need
2. **Batch Operations**: Group multiple operations for efficiency
3. **Memory Management**: Clear references and use garbage collection
4. **Caching**: Cache processed results for repeated operations

### Security
1. **Input Validation**: Always validate HTML input before processing
2. **Sanitization**: Use appropriate sanitization for your use case
3. **Whitelist Approach**: Prefer whitelisting over blacklisting
4. **Regular Updates**: Keep security rules updated

### Content Quality
1. **Structure Validation**: Ensure HTML structure integrity
2. **Semantic Preservation**: Maintain semantic meaning during transformation
3. **Accessibility**: Preserve accessibility attributes and structure
4. **Standards Compliance**: Follow HTML standards and best practices

## Related Nodes

- **Get All HTML**: Extract HTML content from web pages
- **Get HTML of Selected Text**: Extract HTML from user selections
- **Insert HTML**: Insert processed HTML into web pages
- **Validate HTML**: Check HTML structure and compliance
- **Parse CSS**: Process CSS content within HTML
- **Extract Data**: Extract structured data from processed HTML