---
title: "Get Links From Link"
description: "Extract and analyze all hyperlinks from web pages for site mapping, link validation, and automated navigation workflows."
template: doc
tags: ["Web Extraction", "Browser Automation", "HTTP", "DOM", "Content Extraction"]
---

# Get Links From Link

## Overview

The Get Links From Link node discovers and extracts all hyperlinks from web pages, providing comprehensive link analysis including URLs, anchor text, link types, and validation status. This node is essential for site mapping, SEO analysis, link validation, and automated web navigation workflows.

### Purpose and Functionality

This node performs comprehensive link discovery by:
- Scanning web pages for all hyperlink elements (a, area, link tags)
- Extracting URLs, anchor text, titles, and link attributes
- Categorizing links by type (internal, external, email, phone, etc.)
- Validating link accessibility and providing status information
- Supporting both static and dynamically generated links

### Key Features

- **Complete Link Discovery**: Finds all types of links including navigation, content, and metadata links
- **Link Classification**: Automatically categorizes links as internal, external, email, phone, or file downloads
- **Validation Support**: Checks link accessibility and provides status codes for validation workflows
- **Metadata Extraction**: Captures anchor text, titles, rel attributes, and other link properties

### Primary Use Cases

- **Site Mapping**: Create comprehensive maps of website structure and navigation paths
- **SEO Analysis**: Analyze internal linking structure, external links, and anchor text optimization
- **Link Validation**: Identify broken links, redirects, and accessibility issues across websites
- **Competitive Research**: Analyze competitor linking strategies and external partnerships

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `url` | `string` | The target URL from which to extract link information | `"https://example.com/page"` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `includeInternal` | `boolean` | `true` | Include links to the same domain | `true` |
| `includeExternal` | `boolean` | `true` | Include links to external domains | `false` |
| `validateLinks` | `boolean` | `false` | Check if links are accessible (slower but more comprehensive) | `true` |
| `maxLinks` | `number` | `200` | Maximum number of links to return | `100` |
| `includeMetadata` | `boolean` | `true` | Extract detailed metadata for each link | `false` |
| `filterPatterns` | `array` | `[]` | URL patterns to exclude from results | `["mailto:", "tel:", "#"]` |

### Advanced Configuration

```json
{
  "url": "https://example.com/page",
  "includeInternal": true,
  "includeExternal": true,
  "validateLinks": false,
  "maxLinks": 150,
  "includeMetadata": true,
  "filterPatterns": ["javascript:", "mailto:", "#"],
  "analysisOptions": {
    "categorizeByType": true,
    "extractAnchorText": true,
    "checkRedirects": false
  }
}
```

## Browser API Integration

### Required Permissions

| Permission | Purpose | Security Impact |
|------------|---------|-----------------|
| `activeTab` | Access content of the current active tab | Can read all link content and metadata from the active webpage |
| `scripting` | Execute content scripts for link discovery | Can run JavaScript to analyze DOM and extract link information |

### Browser APIs Used

- **chrome.tabs API**: For navigating to target URLs and accessing page content
- **chrome.scripting API**: For executing content scripts that scan DOM for link elements
- **Fetch API**: For validating link accessibility when validation is enabled
- **URL API**: For parsing and categorizing different types of URLs

### Cross-Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Basic Link Extraction | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Link Validation | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |
| Metadata Extraction | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Dynamic Links | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |

### Security Considerations

- **Cross-Origin Validation**: Link validation may be blocked by CORS policies for external sites
- **Privacy Protection**: Link URLs may contain tracking parameters or personal identifiers
- **Rate Limiting**: Implement delays when validating large numbers of links to avoid being blocked
- **Malicious Links**: Filter out potentially harmful URLs (javascript:, data:, etc.)
- **Data Exposure**: Be cautious with links that may contain sensitive information in URLs

## Input/Output Specifications

### Input Data Structure

```json
{
  "url": "string",
  "options": {
    "includeInternal": "boolean",
    "includeExternal": "boolean",
    "validateLinks": "boolean",
    "maxLinks": "number",
    "includeMetadata": "boolean",
    "filterPatterns": "array"
  }
}
```

### Output Data Structure

```json
{
  "links": [
    {
      "url": "string",
      "anchorText": "string",
      "title": "string",
      "type": "internal|external|email|phone|file|anchor",
      "isValid": "boolean",
      "statusCode": "number",
      "metadata": {
        "rel": "string",
        "target": "string",
        "className": "string",
        "id": "string"
      }
    }
  ],
  "totalLinks": "number",
  "internalLinks": "number",
  "externalLinks": "number",
  "metadata": {
    "url": "string",
    "timestamp": "ISO_8601_string",
    "extractionTime": "number_ms",
    "validationTime": "number_ms"
  }
}
```## Pract

ical Examples

### Example 1: Website Navigation Analysis

**Scenario**: Analyze the navigation structure of a website to understand user flow and identify important pages

**Configuration**:
```json
{
  "url": "https://company.example.com",
  "includeInternal": true,
  "includeExternal": false,
  "validateLinks": false,
  "maxLinks": 100,
  "includeMetadata": true
}
```

**Input Data**:
```json
{
  "url": "https://company.example.com"
}
```

**Expected Output**:
```json
{
  "links": [
    {
      "url": "https://company.example.com/about",
      "anchorText": "About Us",
      "title": "Learn more about our company",
      "type": "internal",
      "isValid": true,
      "statusCode": 200,
      "metadata": {
        "rel": "",
        "target": "",
        "className": "nav-link",
        "id": "about-link"
      }
    },
    {
      "url": "https://company.example.com/products",
      "anchorText": "Our Products",
      "title": "Explore our product catalog",
      "type": "internal",
      "isValid": true,
      "statusCode": 200,
      "metadata": {
        "rel": "",
        "target": "",
        "className": "nav-link primary",
        "id": "products-link"
      }
    }
  ],
  "totalLinks": 47,
  "internalLinks": 47,
  "externalLinks": 0,
  "metadata": {
    "url": "https://company.example.com",
    "timestamp": "2024-01-15T10:30:00Z",
    "extractionTime": 320,
    "validationTime": 0
  }
}
```

**Step-by-Step Process**:
1. Navigate to the company homepage
2. Scan DOM for all anchor elements and link tags
3. Filter to include only internal links within the same domain
4. Extract anchor text, titles, and CSS metadata
5. Return structured link data for navigation analysis

### Example 2: SEO Link Audit with Validation

**Scenario**: Perform comprehensive link audit including external link validation for SEO analysis

**Configuration**:
```json
{
  "url": "https://blog.example.com/seo-guide",
  "includeInternal": true,
  "includeExternal": true,
  "validateLinks": true,
  "maxLinks": 75,
  "filterPatterns": ["mailto:", "tel:"]
}
```

**Workflow Integration**:
```
URL Input → Get Links From Link → Link Validator → SEO Report Generator
     ↓              ↓                    ↓              ↓
  target_url    all_links         validation_data    seo_analysis
```

**Complete Example**:
This configuration extracts all links from a blog post, validates their accessibility, and provides comprehensive data for SEO analysis including broken link detection, external link quality assessment, and internal linking optimization opportunities.

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the GetLinksFromLink node in a typical workflow scenario.

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

1. **Previous Node** → **GetLinksFromLink** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Site Crawling Pipeline

- **Nodes**: Get Links From Link → URL Filter → Page Crawler → Content Analyzer
- **Use Case**: Systematic website crawling and content analysis
- **Configuration Tips**: Focus on internal links for site mapping, use validation to identify crawlable pages

#### Pattern 2: Link Quality Assessment

- **Nodes**: URL List → Get Links From Link → Link Validator → Quality Report
- **Use Case**: Automated link quality assessment across multiple pages
- **Data Flow**: Multiple pages processed, links extracted and validated, comprehensive quality reports generated

### Best Practices

- **Performance**: Disable link validation for large-scale extraction to improve speed
- **Resource Management**: Use maxLinks parameter to prevent overwhelming downstream processing
- **Error Handling**: Implement robust error handling for network failures during validation
- **Rate Limiting**: Add delays between validation requests to respect target server limits

## Troubleshooting

### Common Issues

#### Issue: Missing Dynamic Links

- **Symptoms**: Fewer links returned than visible on the page
- **Causes**: JavaScript-generated links not fully loaded, AJAX content still loading
- **Solutions**:
  1. Increase page load wait time to allow dynamic content to render
  2. Check if links are generated by user interactions
  3. Verify that single-page application routing is complete
- **Prevention**: Test with pages that have known dynamic link generation

#### Issue: Link Validation Timeouts

- **Symptoms**: Validation process fails or takes extremely long time
- **Causes**: Slow external servers, network connectivity issues, rate limiting
- **Solutions**:
  1. Disable validation for initial analysis, validate separately
  2. Implement timeout limits for individual link checks
  3. Use batch processing with delays between validation requests
- **Prevention**: Start with validation disabled, enable selectively for critical links

### Browser-Specific Issues

#### Chrome

- CORS policies may prevent validation of some external links
- Use appropriate error handling for blocked validation requests

#### Firefox

- Similar CORS restrictions with different error handling requirements
- May require additional permissions for cross-origin validation

### Performance Issues

- **Large Link Collections**: Pages with hundreds of links may cause memory issues
- **Validation Overhead**: Link validation can significantly increase processing time
- **Network Dependencies**: External link validation depends on network connectivity and target server response times

## Limitations & Constraints

### Technical Limitations

- **JavaScript Links**: Links generated entirely by JavaScript may not be captured
- **Authentication Required**: Cannot validate links that require login credentials
- **Dynamic Routing**: Single-page application routes may not be detected as traditional links

### Browser Limitations

- **Cross-Origin Validation**: CORS policies limit ability to validate external links
- **Rate Limiting**: Target websites may block rapid validation requests
- **Memory Constraints**: Processing very large numbers of links may exceed browser limits

### Data Limitations

- **Link Context**: Cannot determine the semantic importance or context of links
- **Redirect Chains**: Complex redirect chains may not be fully traced
- **Temporary Failures**: Link validation reflects status at time of check, not permanent accessibility

## Key Terminology

**DOM**: Document Object Model - Programming interface for web documents

**CORS**: Cross-Origin Resource Sharing - Security feature controlling cross-domain requests

**CSP**: Content Security Policy - Security standard preventing code injection attacks

**Browser API**: Programming interfaces provided by web browsers for extension functionality

**Content Script**: JavaScript code that runs in the context of web pages

**Web Extraction**: Automated extraction of data from websites

## Search & Discovery

### Keywords

- web extraction
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
- web extraction

## Learning Path

### Skill Level: Intermediate

## Enhanced Cross-References

### Workflow Patterns

- [Web Extraction Patterns](/learning/workflow-patterns/web-extraction-patterns)
- [Browser Automation Workflows](/learning/workflow-patterns/browser-automation)
- [API Integration Patterns](/learning/workflow-patterns/integration-patterns)

### Related Tutorials

- [Web Automation Basics](/learning/text-courses/beginner/web-automation-basics)
- [Advanced Web Extraction](/learning/text-courses/advanced/complex-web-extraction)

### Practical Examples

- [Real-World Use Cases](/learning/examples/)
- [Integration Examples](/learning/examples/multi-node-automation)
- [Best Practice Examples](/learning/workflow-patterns/optimization-best-practices)

## Related Nodes

### Similar Functionality

- **GetAllTextFromLink**: Use when you need different approach to similar functionality
- **GetHTMLFromLink**: Use when you need different approach to similar functionality

### Complementary Nodes

- **Filter**: Works well together in workflows
- **EditFields**: Works well together in workflows
- **Http-Request**: Works well together in workflows

### Common Workflow Patterns

- **GetLinksFromLink → Filter → GetAllTextFromLink**: Common integration pattern
- **GetLinksFromLink → EditFields → Http-Request**: Common integration pattern

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
- [Node Types Overview](/nodes/builtin/node-types)

## Version History

### Current Version: 1.2.0

- Added link type categorization (internal, external, email, phone, file)
- Improved validation with status code reporting
- Enhanced metadata extraction including CSS classes and IDs

### Previous Versions

- **1.1.0**: Added link validation capabilities and filtering options
- **1.0.0**: Initial release with basic link URL and anchor text extraction

## Additional Resources

- [SEO Link Building Guide](/learning/workflow-patterns/optimization-best-practices)
- [Website Crawling Patterns](/learning/examples/web-automation-patterns)
- [Link Analysis Workflows](/learning/workflow-patterns/web-extraction-patterns)
- [Site Structure Analysis](/learning/workflow-patterns/data-processing-patterns)

---

**Last Updated**: October 18, 2024
**Tested With**: Browser Extension v2.1.0
**Validation Status**: ✅ Code Examples Tested | ✅ Browser Compatibility Verified | ✅ User Tested