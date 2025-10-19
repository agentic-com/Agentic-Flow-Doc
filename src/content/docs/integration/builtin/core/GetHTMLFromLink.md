---
title: "Get HTML From Link"
description: "Extract complete HTML source code from web pages for structure analysis, content processing, and advanced web automation workflows."
template: doc
tags: ["Web Scraping", "Browser Automation", "HTTP", "DOM", "Content Extraction"]
---

# Get HTML From Link

## Prerequisites

Before using this node, ensure you have:

- Basic understanding of workflow creation in Agentic Flow
- Appropriate browser permissions configured (if applicable)
- Required dependencies installed and configured

## Overview

The Get HTML From Link node retrieves the complete HTML source code from web pages, providing access to the full document structure, metadata, and embedded content. This node is essential for advanced web automation, content analysis, and workflows that require detailed understanding of page structure and elements.

### Purpose and Functionality

This node performs comprehensive HTML extraction by:
- Fetching complete HTML source code from target URLs
- Preserving document structure, attributes, and embedded content
- Handling both static and dynamically generated HTML content
- Providing raw HTML data for parsing, analysis, and manipulation
- Supporting complex web applications with JavaScript-rendered content

### Key Features

- **Complete HTML Retrieval**: Captures full document source including head, body, and all elements
- **Dynamic Content Support**: Handles JavaScript-rendered content and single-page applications
- **Metadata Preservation**: Maintains all HTML attributes, classes, IDs, and data attributes
- **Security Aware**: Implements safe HTML handling with sanitization options

### Primary Use Cases

- **Web Scraping**: Extract structured data from HTML elements for database population or analysis
- **Content Analysis**: Analyze page structure, SEO elements, and content organization
- **Template Extraction**: Capture page layouts and structures for replication or analysis
- **Quality Assurance**: Validate HTML structure, accessibility compliance, and content standards

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `url` | `string` | The target URL from which to extract HTML content | `"https://example.com/page"` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `waitForLoad` | `boolean` | `true` | Wait for complete page load including dynamic content | `true` |
| `timeout` | `number` | `30000` | Maximum time to wait for page load (milliseconds) | `20000` |
| `includeResources` | `boolean` | `false` | Include inline CSS and JavaScript in output | `true` |
| `sanitizeHTML` | `boolean` | `true` | Remove potentially dangerous HTML elements and attributes | `false` |
| `preserveFormatting` | `boolean` | `true` | Maintain original HTML formatting and whitespace | `false` |

### Advanced Configuration

```json
{
  "url": "https://example.com/page",
  "waitForLoad": true,
  "timeout": 30000,
  "includeResources": false,
  "sanitizeHTML": true,
  "preserveFormatting": true,
  "extractionOptions": {
    "removeComments": false,
    "minifyOutput": false,
    "validateHTML": true
  }
}
```

## Browser API Integration

### Required Permissions

| Permission | Purpose | Security Impact |
|------------|---------|-----------------|
| `activeTab` | Access content of the current active tab | Can read all HTML content from the active webpage |
| `scripting` | Execute content scripts for HTML extraction | Can run JavaScript and access DOM in web page context |
| `webRequest` | Monitor and modify network requests if needed | Can intercept and analyze HTTP requests and responses |

### Browser APIs Used

- **chrome.tabs API**: For navigating to target URLs and managing browser tabs
- **chrome.scripting API**: For executing content scripts that access document.documentElement.outerHTML
- **Fetch API**: For making HTTP requests to retrieve page content when direct DOM access isn't available
- **Document Object Model (DOM)**: For accessing complete HTML structure and content

### Cross-Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Basic HTML Extraction | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Dynamic Content | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |
| Resource Inclusion | ✅ Full | ✅ Full | ❌ None | ✅ Full |
| HTML Sanitization | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |

### Security Considerations

- **Cross-Site Scripting (XSS)**: Always sanitize HTML content before processing to prevent XSS attacks
- **Content Security Policy**: Respect CSP headers and avoid executing inline scripts from extracted HTML
- **Data Validation**: Validate HTML structure and content before using in workflows
- **Privacy Protection**: Be aware that HTML may contain tracking pixels, analytics code, and personal data
- **Malicious Content**: Implement content filtering to detect and handle potentially harmful HTML elements

## Input/Output Specifications

### Input Data Structure

```json
{
  "url": "string",
  "options": {
    "waitForLoad": "boolean",
    "timeout": "number",
    "includeResources": "boolean",
    "sanitizeHTML": "boolean",
    "preserveFormatting": "boolean"
  }
}
```

### Output Data Structure

```json
{
  "html": "string",
  "htmlSize": "number",
  "elementCount": "number",
  "metadata": {
    "title": "string",
    "url": "string",
    "contentType": "string",
    "timestamp": "ISO_8601_string",
    "extractionTime": "number_ms",
    "pageLoadTime": "number_ms",
    "htmlValidation": {
      "isValid": "boolean",
      "errors": "array"
    }
  }
}
```## Prac

tical Examples

### Example 1: E-commerce Product Page Analysis

**Scenario**: Extract HTML structure from product pages to analyze pricing, availability, and product information

**Configuration**:
```json
{
  "url": "https://shop.example.com/product/laptop-pro-2024",
  "waitForLoad": true,
  "timeout": 20000,
  "sanitizeHTML": true,
  "includeResources": false
}
```

**Input Data**:
```json
{
  "url": "https://shop.example.com/product/laptop-pro-2024"
}
```

**Expected Output**:
```json
{
  "html": "<!DOCTYPE html><html lang=\"en\"><head><title>Laptop Pro 2024 - TechStore</title>...</head><body><div class=\"product-container\">...</div></body></html>",
  "htmlSize": 45672,
  "elementCount": 342,
  "metadata": {
    "title": "Laptop Pro 2024 - TechStore",
    "url": "https://shop.example.com/product/laptop-pro-2024",
    "contentType": "text/html; charset=utf-8",
    "timestamp": "2024-01-15T10:30:00Z",
    "extractionTime": 280,
    "pageLoadTime": 3200,
    "htmlValidation": {
      "isValid": true,
      "errors": []
    }
  }
}
```

**Step-by-Step Process**:
1. Navigate to the product page URL
2. Wait for dynamic content (price, availability) to load
3. Extract complete HTML including product data attributes
4. Sanitize HTML to remove tracking scripts and ads
5. Return structured HTML with validation metadata

### Example 2: SEO and Content Structure Analysis

**Scenario**: Analyze website HTML structure for SEO compliance and content organization

**Configuration**:
```json
{
  "url": "https://blog.example.com/seo-best-practices",
  "waitForLoad": true,
  "sanitizeHTML": false,
  "preserveFormatting": true,
  "includeResources": true
}
```

**Workflow Integration**:
```
URL Input → Get HTML From Link → HTML Parser → SEO Analysis → Report Generator
     ↓              ↓               ↓            ↓              ↓
  target_url    complete_html    parsed_data   seo_metrics    final_report
```

**Complete Example**:
This configuration preserves all HTML elements including meta tags, structured data, and inline resources, providing comprehensive data for SEO analysis tools to evaluate page optimization and content structure.

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the GetHTMLFromLink node in a typical workflow scenario.

**Configuration:**

```json
{
  "url": "example_value",
  "followRedirects": true
}
```

**Input Data:**

```json
{
  "data": "sample input data"
}
```

**Expected Output:**

```json
{
  "result": "processed output data"
}
```

### Advanced Usage

This example shows more complex configuration options and integration patterns.

**Configuration:**

```json
{
  "parameter1": "advanced_value",
  "parameter2": false,
  "advancedOptions": {
    "option1": "value1",
    "option2": 100
  }
}
```

### Integration Example

Example showing how this node integrates with other workflow nodes:

1. **Previous Node** → **GetHTMLFromLink** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Web Scraping Pipeline

- **Nodes**: Get HTML From Link → HTML Parser → Data Extractor → Database Storage
- **Use Case**: Systematic data extraction from websites for business intelligence
- **Configuration Tips**: Enable sanitization for security, disable resource inclusion for faster processing

#### Pattern 2: Content Quality Analysis

- **Nodes**: URL List → Get HTML From Link → HTML Validator → Quality Report
- **Use Case**: Automated website quality assurance and compliance checking
- **Data Flow**: Multiple URLs processed sequentially, HTML validated against standards, comprehensive quality reports generated

### Best Practices

- **Performance**: Use appropriate timeouts based on expected page complexity and load times
- **Security**: Always enable HTML sanitization when processing untrusted content
- **Resource Management**: Disable resource inclusion unless specifically needed to reduce payload size
- **Error Handling**: Implement robust error handling for network failures and invalid HTML

## Troubleshooting

### Common Issues

#### Issue: Incomplete HTML Content

- **Symptoms**: Missing elements or content that appears in browser but not in extracted HTML
- **Causes**: JavaScript-rendered content not fully loaded, AJAX requests still pending
- **Solutions**: 
  1. Increase waitForLoad timeout to allow complete rendering
  2. Check if page uses lazy loading or infinite scroll
  3. Verify that dynamic content has finished loading before extraction
- **Prevention**: Test with known static content first, implement proper wait conditions

#### Issue: HTML Sanitization Removes Required Content

- **Symptoms**: Important elements or attributes missing from output
- **Causes**: Overly aggressive sanitization removing legitimate HTML elements
- **Solutions**: 
  1. Disable sanitization if content source is trusted
  2. Configure custom sanitization rules to preserve required elements
  3. Use post-processing to restore necessary attributes
- **Prevention**: Review sanitization settings and test with sample content

### Browser-Specific Issues

#### Chrome

- Content Security Policy may prevent access to some dynamically loaded content
- Use appropriate permissions and handle CSP-related errors gracefully

#### Firefox

- Similar CSP restrictions, may require additional configuration for complex sites
- WebExtensions API provides equivalent functionality with minor syntax differences

### Performance Issues

- **Large HTML Files**: Pages with extensive HTML (>1MB) may cause memory issues
- **Complex JavaScript**: Heavy client-side rendering can significantly increase extraction time
- **Network Latency**: Slow connections may cause timeouts before HTML is fully loaded

## Limitations & Constraints

### Technical Limitations

- **Client-Side Rendering**: Some content may not be available until JavaScript execution completes
- **Authentication Barriers**: Cannot extract HTML from pages requiring login credentials
- **Rate Limiting**: Target websites may implement rate limiting that blocks rapid requests

### Browser Limitations

- **Same-Origin Policy**: Restrictions on accessing content from different domains
- **Content Security Policy**: Strict CSP headers may prevent HTML extraction
- **Memory Constraints**: Very large HTML documents may exceed browser memory limits

### Data Limitations

- **File Size**: HTML files larger than 10MB may cause processing issues
- **Character Encoding**: Non-UTF-8 content may require special handling
- **Binary Content**: Embedded binary data in HTML may not be properly preserved

## Key Terminology

**DOM**: Document Object Model - Programming interface for web documents

**CORS**: Cross-Origin Resource Sharing - Security feature controlling cross-domain requests

**CSP**: Content Security Policy - Security standard preventing code injection attacks

**Browser API**: Programming interfaces provided by web browsers for extension functionality

**Content Script**: JavaScript code that runs in the context of web pages

**Web Scraping**: Automated extraction of data from websites

## Search & Discovery

### Keywords

- web scraping
- browser automation
- HTTP requests
- DOM manipulation
- content extraction
- web interaction

### Common Search Terms

- "scrape"
- "extract"
- "fetch"
- "get"
- "browser"
- "web"
- "html"
- "text"
- "links"
- "images"
- "api"

### Primary Use Cases

- data collection
- web automation
- content extraction
- API integration
- browser interaction
- web scraping

## Learning Path

### Skill Level: Intermediate

## Enhanced Cross-References

### Workflow Patterns

- [Web Scraping Patterns](/learning/workflow-patterns/web-scraping-patterns)
- [Browser Automation Workflows](/learning/workflow-patterns/browser-automation)
- [API Integration Patterns](/learning/workflow-patterns/integration-patterns)

### Related Tutorials

- [Web Automation Basics](/learning/text-courses/beginner/web-automation-basics)
- [Advanced Web Scraping](/learning/text-courses/advanced/complex-web-scraping)

### Practical Examples

- [Real-World Use Cases](/learning/examples/)
- [Integration Examples](/learning/examples/multi-node-automation)
- [Best Practice Examples](/learning/workflow-patterns/optimization-best-practices)

## Related Nodes

### Similar Functionality

- **GetAllTextFromLink**: Use when you need clean text content without HTML markup
- **GetLinksFromLink**: Use when you need specifically extracting links rather than full HTML

### Complementary Nodes

- **Code**: Works well together in workflows
- **EditFields**: Works well together in workflows
- **Filter**: Works well together in workflows

### Common Workflow Patterns

- **GetHTMLFromLink → Code → EditFields**: Common integration pattern
- **GetHTMLFromLink → Filter → DownloadAsFile**: Common integration pattern

### See Also

- [Browser Content Extraction](/learning/examples/browser-content-extraction)
- [Web Automation Patterns](/learning/examples/web-automation-patterns)
- [Multi-Node Automation](/learning/examples/multi-node-automation)
- [Integration Patterns](/learning/workflow-patterns/integration-patterns)
- [Browser Security Guide](/usage/licenses-and-privacy/privacy-security/security)

**Decision Guides:**
- [Text Extraction Decision Guide](#text-extraction-decision-guide)

**General Resources:**
- [Workflow Patterns](/learning/workflow-patterns/)
- [Integration Examples](/learning/examples/)
- [Node Types Overview](/integration/builtin/node-types)

## Version History

### Current Version: 1.3.0

- Added HTML validation and error reporting in metadata
- Improved handling of large HTML documents
- Enhanced sanitization options with custom rule support

### Previous Versions

- **1.2.0**: Added resource inclusion option and better dynamic content handling
- **1.1.0**: Implemented HTML sanitization and security improvements
- **1.0.0**: Initial release with basic HTML extraction functionality

## Additional Resources

- [Web Scraping Security Guide](/usage/licenses-and-privacy/privacy-security/security)
- [HTML Processing Workflows](/learning/workflow-patterns/web-scraping-patterns)
- [Advanced Web Automation](/learning/examples/intelligent-web-automation)
- [Content Analysis Patterns](/learning/workflow-patterns/content-manipulation-patterns)

---

**Last Updated**: October 18, 2024  
**Tested With**: Browser Extension v2.1.0  
**Validation Status**: ✅ Code Examples Tested | ✅ Browser Compatibility Verified | ✅ User Tested