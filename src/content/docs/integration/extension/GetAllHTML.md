---
title: Get All HTML
description: "Extract complete HTML content from web pages using Agentic Workflow Studio browser extension for advanced processing."
---

The **Get All HTML** node captures the complete HTML source code of the current web page, including all markup, attributes, and structure. This is essential for workflows that need to analyze page structure, extract specific elements, or perform detailed content processing.

## How it Works

This node accesses the complete DOM structure of the current page and serializes it to HTML. It can capture either the original source HTML or the current DOM state (including any JavaScript modifications).

## Browser API Details

The node leverages the following browser APIs:
- **DOM Serialization**: `document.documentElement.outerHTML` for complete page HTML
- **XMLSerializer**: For cross-browser HTML serialization
- **Content Scripts**: Injected into the active tab to access page DOM

### Required Permissions
- `activeTab`: Access to the currently active browser tab
- `scripting`: Ability to inject content scripts

## Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Include DOCTYPE | Boolean | No | Include DOCTYPE declaration (default: true) |
| Current DOM State | Boolean | No | Capture current DOM vs. original source (default: true) |
| Minify HTML | Boolean | No | Remove unnecessary whitespace (default: false) |
| Include Comments | Boolean | No | Preserve HTML comments (default: false) |
| Max Size | Number | No | Maximum HTML size in bytes (default: 10MB) |
| Exclude Scripts | Boolean | No | Remove script tags from output (default: false) |

### Output Data

The node outputs an object containing:

```json
{
  "html": "<!DOCTYPE html><html>...</html>",
  "size": 245760,
  "elementCount": 1250,
  "metadata": {
    "title": "Page Title",
    "charset": "UTF-8",
    "doctype": "html",
    "url": "https://example.com/page"
  },
  "structure": {
    "headElements": 15,
    "bodyElements": 1235,
    "scriptTags": 8,
    "styleTags": 3,
    "linkTags": 12
  },
  "extractedAt": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Web Scraping and Data Extraction

Extract structured data from HTML markup:

```javascript
// Workflow: HTML extraction → parsing → data extraction
// 1. Get All HTML captures complete page markup
// 2. Parse HTML to find specific elements (products, articles, etc.)
// 3. Extract structured data using CSS selectors
// 4. Transform data into desired format
```

### Page Structure Analysis

Analyze website structure and SEO elements:

```javascript
// Workflow: HTML analysis → SEO audit → recommendations
// 1. Get All HTML captures page markup
// 2. Analyze meta tags, headings, and structure
// 3. Check for SEO best practices compliance
// 4. Generate improvement recommendations
```

### Content Archiving

Archive complete web pages for later reference:

```javascript
// Workflow: HTML capture → processing → storage
// 1. Get All HTML captures complete page
// 2. Process and clean HTML content
// 3. Store in archive with metadata
// 4. Create searchable index
```

### Template and Component Analysis

Analyze page templates and component structure:

```javascript
// Workflow: HTML extraction → pattern detection → documentation
// 1. Get All HTML from multiple similar pages
// 2. Identify common patterns and components
// 3. Extract reusable template structures
// 4. Generate component documentation
```

## Integration Patterns

### With HTML Parsing

```javascript
// Pattern: HTML extraction → parsing → data extraction
Get All HTML → Parse HTML → Extract Elements → Process Data → Store Results
```

### With Content Modification

```javascript
// Pattern: Capture → modify → compare
Get All HTML → Modify Content → Generate New HTML → Compare Changes
```

### With Quality Analysis

```javascript
// Pattern: HTML analysis → validation → reporting
Get All HTML → Validate Markup → Check Accessibility → Generate Report
```

## HTML Processing Features

### Content Filtering Options

The node can process HTML content with various filters:

| Filter Type | Description | Use Case |
|-------------|-------------|----------|
| Script Removal | Remove all `<script>` tags | Security, clean content |
| Style Removal | Remove `<style>` tags and inline styles | Content-only extraction |
| Comment Removal | Strip HTML comments | Reduce file size |
| Attribute Filtering | Remove specific attributes | Privacy, clean markup |
| Element Exclusion | Remove elements by selector | Remove ads, navigation |

### Structure Preservation

Options for maintaining HTML structure:
- **Complete DOM**: Capture current state including JS modifications
- **Original Source**: Get initial HTML as loaded
- **Formatted Output**: Pretty-print HTML with proper indentation
- **Minified Output**: Compress HTML by removing whitespace

## Security Considerations

### Content Security Policy (CSP)

The node respects and works within CSP restrictions:
- Cannot modify CSP-protected content
- May be blocked on pages with strict CSP policies
- Extracted HTML reflects CSP-modified content

### Cross-Origin Restrictions

Security limitations when extracting HTML:
- **Same-Origin Policy**: Cannot access cross-origin iframe content
- **Sandboxed Content**: Limited access to sandboxed elements
- **Protected Resources**: Some content may be access-restricted

### Data Privacy

Important privacy considerations:
- **Sensitive Data**: HTML may contain personal information
- **Authentication Tokens**: May include session or auth data
- **User Input**: Could capture form data or user-entered content
- **Tracking Elements**: May include analytics or tracking code

## Performance Considerations

### Memory Usage

| Page Complexity | HTML Size | Memory Impact | Recommendations |
|----------------|-----------|---------------|-----------------|
| Simple | < 100KB | Low | No restrictions |
| Medium | 100KB-1MB | Moderate | Consider minification |
| Complex | 1-5MB | High | Use size limits |
| Very Complex | > 5MB | Very High | Filter content, set strict limits |

### Processing Time

Factors affecting extraction speed:
- **DOM Complexity**: Deeply nested elements slow processing
- **Dynamic Content**: JavaScript-heavy pages take longer
- **External Resources**: Embedded content affects timing
- **Browser Performance**: Available memory and CPU impact speed

## Error Handling

### Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| Size Limit Exceeded | HTML too large for processing | Increase max size or filter content |
| Access Denied | Content script blocked | Check permissions and page restrictions |
| Serialization Failed | Complex DOM structure | Try with simplified options |
| Memory Error | Insufficient browser memory | Reduce page complexity or restart |

### Error Response Format

```json
{
  "error": true,
  "errorType": "SIZE_LIMIT_EXCEEDED",
  "message": "HTML content exceeds maximum size limit",
  "html": "",
  "size": 0,
  "details": {
    "maxSize": 10485760,
    "actualSize": 15728640,
    "url": "https://example.com/page"
  }
}
```

## Best Practices

### Performance Optimization
1. **Set Size Limits**: Prevent memory issues with large pages
2. **Filter Unnecessary Content**: Remove scripts, ads, navigation when not needed
3. **Use Minification**: Reduce HTML size for storage and transmission
4. **Monitor Memory Usage**: Watch for memory leaks with large HTML content

### Security Best Practices
1. **Sanitize Output**: Clean HTML before processing or storage
2. **Remove Sensitive Data**: Strip authentication tokens and personal data
3. **Validate Content**: Check HTML structure and content validity
4. **Respect Privacy**: Be transparent about HTML data collection

### Content Quality
1. **Preserve Structure**: Maintain important HTML structure for parsing
2. **Handle Encoding**: Ensure proper character encoding preservation
3. **Validate Markup**: Check for well-formed HTML structure
4. **Document Processing**: Keep track of HTML modifications and filters applied

## Related Nodes

- **Get HTML of Selected Text**: Extract HTML of user-selected content only
- **Get All Text**: Extract text content without HTML markup
- **Parse HTML**: Process and extract data from HTML content
- **Modify HTML**: Make changes to HTML content
- **Validate HTML**: Check HTML markup for errors and compliance