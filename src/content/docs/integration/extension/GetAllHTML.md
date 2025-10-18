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

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Include DOCTYPE** | Boolean | No | `true` | Include DOCTYPE declaration in output |
| **Current DOM State** | Boolean | No | `true` | Capture current DOM vs. original source HTML |
| **Minify HTML** | Boolean | No | `false` | Remove unnecessary whitespace and formatting |
| **Include Comments** | Boolean | No | `false` | Preserve HTML comments in output |
| **Max Size** | Number | No | `10485760` | Maximum HTML size in bytes (10MB) |
| **Exclude Scripts** | Boolean | No | `false` | Remove all script tags from output |
| **Exclude Styles** | Boolean | No | `false` | Remove style tags and inline styles |
| **Processing Mode** | String | No | `complete` | Processing mode: `complete`, `content-only`, `structure-only` |

### HTML Cleaning Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Remove Attributes** | Array | No | `[]` | HTML attributes to remove (e.g., `["onclick", "data-track"]`) |
| **Remove Elements** | Array | No | `[]` | HTML elements to remove (e.g., `["script", "noscript", "iframe"]`) |
| **Keep Elements Only** | Array | No | `[]` | Only keep specified elements (whitelist mode) |
| **Clean Classes** | Boolean | No | `false` | Remove CSS classes that match cleanup patterns |
| **Clean IDs** | Boolean | No | `false` | Remove or normalize element IDs |
| **Remove Empty Elements** | Boolean | No | `false` | Remove elements with no content |
| **Normalize Whitespace** | Boolean | No | `false` | Normalize whitespace between elements |

### Content Filtering Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Content Areas Only** | Boolean | No | `false` | Extract only main content areas |
| **Exclude Navigation** | Boolean | No | `false` | Remove navigation elements |
| **Exclude Sidebar** | Boolean | No | `false` | Remove sidebar content |
| **Exclude Footer** | Boolean | No | `false` | Remove footer elements |
| **Exclude Ads** | Boolean | No | `false` | Remove advertising content |
| **Custom Exclude Selectors** | Array | No | `[]` | CSS selectors for elements to exclude |
| **Custom Include Selectors** | Array | No | `[]` | CSS selectors for elements to include only |

### Processing & Performance Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Processing Timeout** | Number | No | `30000` | Maximum processing time in milliseconds |
| **Batch Processing** | Boolean | No | `false` | Process large DOMs in batches |
| **Batch Size** | Number | No | `1000` | Elements to process per batch |
| **Include Processing Stats** | Boolean | No | `false` | Include performance metrics in output |
| **Cache Results** | Boolean | No | `false` | Cache processed HTML for repeated access |
| **Cache Duration** | Number | No | `300000` | Cache duration in milliseconds |
| **Preserve Source Maps** | Boolean | No | `false` | Maintain mapping to original DOM positions |

### Output Format Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Pretty Print** | Boolean | No | `false` | Format HTML with proper indentation |
| **Indent Size** | Number | No | `2` | Spaces for indentation when pretty printing |
| **Line Length Limit** | Number | No | `0` | Maximum line length (0 = no limit) |
| **Include Metadata** | Boolean | No | `true` | Include extraction metadata in output |
| **Output Encoding** | String | No | `utf-8` | Character encoding for output |
| **Compression** | String | No | `none` | Compression: `none`, `gzip`, `deflate` |

### Output Data

The node outputs a comprehensive object containing:

```json
{
  "html": "<!DOCTYPE html><html>...</html>",
  "originalSize": 345760,
  "processedSize": 245760,
  "compressionRatio": 0.71,
  "elementCount": 1250,
  "removedElements": 89,
  "metadata": {
    "title": "Page Title",
    "description": "Page meta description",
    "charset": "UTF-8",
    "doctype": "html",
    "url": "https://example.com/page",
    "domain": "example.com",
    "language": "en",
    "viewport": "width=device-width, initial-scale=1",
    "author": "Content Author",
    "publishDate": "2024-01-10",
    "lastModified": "2024-01-15"
  },
  "structure": {
    "headElements": 15,
    "bodyElements": 1235,
    "scriptTags": 8,
    "styleTags": 3,
    "linkTags": 12,
    "imageTags": 45,
    "formElements": 2,
    "tableElements": 3,
    "listElements": 18,
    "headingElements": {
      "h1": 1,
      "h2": 8,
      "h3": 15,
      "h4": 12,
      "h5": 3,
      "h6": 1
    }
  },
  "contentAreas": {
    "header": "<header>...</header>",
    "navigation": "<nav>...</nav>",
    "main": "<main>...</main>",
    "sidebar": "<aside>...</aside>",
    "footer": "<footer>...</footer>"
  },
  "assets": {
    "stylesheets": [
      {"href": "/css/main.css", "media": "all"},
      {"href": "/css/print.css", "media": "print"}
    ],
    "scripts": [
      {"src": "/js/main.js", "type": "text/javascript", "async": true},
      {"src": "/js/analytics.js", "type": "text/javascript"}
    ],
    "images": [
      {"src": "/images/logo.png", "alt": "Company Logo", "width": 200, "height": 100},
      {"src": "/images/hero.jpg", "alt": "Hero Image", "loading": "lazy"}
    ],
    "fonts": [
      {"family": "Open Sans", "source": "Google Fonts"},
      {"family": "Roboto", "source": "Local"}
    ]
  },
  "seo": {
    "metaTags": {
      "description": "Page meta description",
      "keywords": "keyword1, keyword2, keyword3",
      "robots": "index, follow",
      "canonical": "https://example.com/page"
    },
    "openGraph": {
      "title": "OG Title",
      "description": "OG Description", 
      "image": "https://example.com/og-image.jpg",
      "type": "article"
    },
    "twitterCard": {
      "card": "summary_large_image",
      "title": "Twitter Title",
      "description": "Twitter Description"
    },
    "structuredData": [
      {"type": "Article", "headline": "Article Title"},
      {"type": "Organization", "name": "Company Name"}
    ]
  },
  "accessibility": {
    "altTextCount": 42,
    "missingAltText": 3,
    "headingStructure": "valid",
    "ariaLabels": 15,
    "focusableElements": 28,
    "colorContrast": "needs-review"
  },
  "performance": {
    "totalElements": 1250,
    "domDepth": 12,
    "criticalResources": 8,
    "renderBlockingResources": 3,
    "lazyLoadedImages": 23
  },
  "processing": {
    "timeMs": 245,
    "method": "dom-serialization",
    "batchesProcessed": 3,
    "cacheHit": false,
    "cleaningApplied": ["remove-scripts", "normalize-whitespace"],
    "warnings": ["Large DOM size", "Missing alt attributes"]
  },
  "validation": {
    "isValidHTML": true,
    "htmlVersion": "HTML5",
    "errors": [],
    "warnings": ["Deprecated attributes found"],
    "wcagCompliance": "AA-partial"
  },
  "extractedAt": "2024-01-15T10:30:00Z",
  "extractionMethod": "current-dom", // or "original-source"
  "browserInfo": {
    "userAgent": "Chrome/120.0.0.0",
    "viewport": {"width": 1920, "height": 1080},
    "devicePixelRatio": 1.0
  }
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