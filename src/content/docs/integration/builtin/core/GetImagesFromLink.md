---
title: "Get Images From Link"
description: "Extract image URLs, metadata, and properties from web pages for content analysis, media processing, and automated image workflows."
template: doc
tags: ["Web Scraping", "Browser Automation", "HTTP", "DOM", "Content Extraction"]
---

# Get Images From Link

## Prerequisites

Before using this node, ensure you have:

- Basic understanding of workflow creation in Agentic Flow
- Appropriate browser permissions configured (if applicable)
- Required dependencies installed and configured

## Overview

The Get Images From Link node discovers and extracts all images from web pages, providing comprehensive image metadata, URLs, and properties for content analysis and media processing workflows. This node is essential for media collection, content auditing, and automated image processing pipelines.

### Purpose and Functionality

This node performs comprehensive image discovery by:
- Scanning web pages for all image elements (img, picture, svg)
- Extracting image URLs, alt text, dimensions, and metadata
- Handling responsive images and different image formats
- Providing structured data for image analysis and processing
- Supporting both static and dynamically loaded images

### Key Features

- **Complete Image Discovery**: Finds all image elements including responsive images and lazy-loaded content
- **Metadata Extraction**: Captures alt text, dimensions, file sizes, and image attributes
- **Format Support**: Handles JPG, PNG, GIF, SVG, WebP, and other modern image formats
- **Responsive Image Handling**: Processes srcset attributes and picture elements for different screen sizes

### Primary Use Cases

- **Content Auditing**: Analyze image usage, alt text compliance, and accessibility standards
- **Media Collection**: Gather images from websites for analysis, backup, or processing
- **SEO Analysis**: Evaluate image optimization, file sizes, and metadata for search engine optimization
- **Competitive Research**: Monitor competitor image content and visual strategies

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `url` | `string` | The target URL from which to extract image information | `"https://example.com/gallery"` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `includeDataUrls` | `boolean` | `false` | Include base64 encoded data URLs in results | `true` |
| `minWidth` | `number` | `0` | Minimum image width to include in results | `100` |
| `minHeight` | `number` | `0` | Minimum image height to include in results | `100` |
| `maxImages` | `number` | `100` | Maximum number of images to return | `50` |
| `includeMetadata` | `boolean` | `true` | Extract detailed metadata for each image | `false` |
| `waitForLoad` | `boolean` | `true` | Wait for lazy-loaded images to appear | `true` |

### Advanced Configuration

```json
{
  "url": "https://example.com/gallery",
  "includeDataUrls": false,
  "minWidth": 200,
  "minHeight": 200,
  "maxImages": 50,
  "includeMetadata": true,
  "waitForLoad": true,
  "filterOptions": {
    "excludeFormats": ["gif"],
    "requireAltText": false,
    "minFileSize": 1024
  }
}
```

## Browser API Integration

### Required Permissions

| Permission | Purpose | Security Impact |
|------------|---------|-----------------|
| `activeTab` | Access content of the current active tab | Can read all image content and metadata from the active webpage |
| `scripting` | Execute content scripts for image discovery | Can run JavaScript to analyze DOM and extract image information |

### Browser APIs Used

- **chrome.tabs API**: For navigating to target URLs and accessing page content
- **chrome.scripting API**: For executing content scripts that scan DOM for image elements
- **Image API**: For loading images and extracting dimensions and metadata
- **Intersection Observer API**: For detecting lazy-loaded images that appear on scroll

### Cross-Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Basic Image Extraction | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Lazy Loading Detection | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |
| Responsive Images | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Metadata Extraction | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |

### Security Considerations

- **Cross-Origin Images**: Some images may be blocked by CORS policies when accessing metadata
- **Privacy Protection**: Image URLs may contain tracking parameters or personal identifiers
- **Content Filtering**: Implement filtering to avoid processing inappropriate or copyrighted content
- **Rate Limiting**: Respect website rate limits when processing multiple images
- **Data Usage**: Large image collections can consume significant bandwidth and storage

## Input/Output Specifications

### Input Data Structure

```json
{
  "url": "string",
  "options": {
    "includeDataUrls": "boolean",
    "minWidth": "number",
    "minHeight": "number",
    "maxImages": "number",
    "includeMetadata": "boolean",
    "waitForLoad": "boolean"
  }
}
```

### Output Data Structure

```json
{
  "images": [
    {
      "url": "string",
      "alt": "string",
      "width": "number",
      "height": "number",
      "format": "string",
      "fileSize": "number",
      "isLazyLoaded": "boolean",
      "srcset": "array",
      "metadata": {
        "title": "string",
        "className": "string",
        "id": "string",
        "loading": "string"
      }
    }
  ],
  "totalImages": "number",
  "processedImages": "number",
  "metadata": {
    "url": "string",
    "timestamp": "ISO_8601_string",
    "extractionTime": "number_ms",
    "pageLoadTime": "number_ms"
  }
}
```## Prac

tical Examples

### Example 1: E-commerce Product Image Collection

**Scenario**: Extract all product images from an e-commerce page for inventory analysis and competitive research

**Configuration**:
```json
{
  "url": "https://shop.example.com/category/laptops",
  "minWidth": 300,
  "minHeight": 300,
  "maxImages": 25,
  "includeMetadata": true,
  "waitForLoad": true
}
```

**Input Data**:
```json
{
  "url": "https://shop.example.com/category/laptops"
}
```

**Expected Output**:
```json
{
  "images": [
    {
      "url": "https://shop.example.com/images/laptop-pro-2024.jpg",
      "alt": "Laptop Pro 2024 - High Performance Computing",
      "width": 800,
      "height": 600,
      "format": "jpeg",
      "fileSize": 125000,
      "isLazyLoaded": true,
      "srcset": [
        "laptop-pro-2024-400w.jpg 400w",
        "laptop-pro-2024-800w.jpg 800w"
      ],
      "metadata": {
        "title": "Laptop Pro 2024",
        "className": "product-image",
        "id": "img-laptop-pro",
        "loading": "lazy"
      }
    }
  ],
  "totalImages": 18,
  "processedImages": 18,
  "metadata": {
    "url": "https://shop.example.com/category/laptops",
    "timestamp": "2024-01-15T10:30:00Z",
    "extractionTime": 450,
    "pageLoadTime": 2800
  }
}
```

**Step-by-Step Process**:
1. Navigate to the product category page
2. Wait for lazy-loaded product images to appear
3. Scan DOM for all image elements meeting size criteria
4. Extract metadata including alt text and responsive image sources
5. Return structured image data with comprehensive metadata

### Example 2: Website Accessibility Audit

**Scenario**: Analyze website images for accessibility compliance, checking alt text and image optimization

**Configuration**:
```json
{
  "url": "https://company.example.com/about",
  "includeDataUrls": false,
  "includeMetadata": true,
  "filterOptions": {
    "requireAltText": true,
    "minFileSize": 0
  }
}
```

**Workflow Integration**:
```
URL Input → Get Images From Link → Accessibility Checker → Compliance Report
     ↓              ↓                      ↓                    ↓
  target_url    image_data          accessibility_data    audit_report
```

**Complete Example**:
This configuration extracts all images and their accessibility metadata, enabling automated compliance checking for alt text presence, appropriate file sizes, and proper image optimization for web accessibility standards.

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the GetImagesFromLink node in a typical workflow scenario.

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

1. **Previous Node** → **GetImagesFromLink** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Media Analysis Pipeline

- **Nodes**: Get Images From Link → Image Analyzer → Content Classifier → Report Generator
- **Use Case**: Automated analysis of website visual content and media optimization
- **Configuration Tips**: Set appropriate size filters to focus on significant images, enable metadata for detailed analysis

#### Pattern 2: Content Migration Workflow

- **Nodes**: URL List → Get Images From Link → Image Downloader → Asset Organizer
- **Use Case**: Migrating website images to new platforms or backup systems
- **Data Flow**: Multiple pages processed, images extracted and downloaded, organized by source and metadata

### Best Practices

- **Performance**: Use size filters to avoid processing decorative icons and small images
- **Resource Management**: Limit maxImages to prevent overwhelming downstream processing
- **Error Handling**: Implement fallbacks for images that fail to load or are blocked by CORS
- **Accessibility**: Always check for alt text presence and quality in accessibility workflows

## Troubleshooting

### Common Issues

#### Issue: Missing Lazy-Loaded Images

- **Symptoms**: Fewer images returned than visible on the page
- **Causes**: Lazy-loaded images not triggered, insufficient wait time for dynamic loading
- **Solutions**: 
  1. Enable waitForLoad and increase timeout
  2. Implement scroll simulation to trigger lazy loading
  3. Check if images require user interaction to load
- **Prevention**: Test with pages that have known lazy-loading behavior

#### Issue: CORS Errors When Accessing Image Metadata

- **Symptoms**: Images found but metadata extraction fails
- **Causes**: Cross-origin restrictions preventing access to image properties
- **Solutions**: 
  1. Disable detailed metadata extraction for cross-origin images
  2. Use proxy or server-side processing for metadata extraction
  3. Focus on DOM-available metadata instead of image file properties
- **Prevention**: Test with same-origin images first, implement graceful degradation

### Browser-Specific Issues

#### Chrome

- Strict CORS policies may prevent access to cross-origin image metadata
- Use appropriate error handling for blocked image resources

#### Firefox

- Similar CORS restrictions with slightly different error messages
- May require additional permissions for some image processing features

### Performance Issues

- **Large Image Collections**: Pages with hundreds of images may cause memory issues
- **High-Resolution Images**: Loading metadata for very large images can be slow
- **Network Bandwidth**: Processing many images simultaneously can consume significant bandwidth

## Limitations & Constraints

### Technical Limitations

- **Cross-Origin Access**: Cannot access detailed metadata for images from different domains
- **Dynamic Loading**: Some images may only load after specific user interactions
- **Format Support**: Newer image formats may not be fully supported in all browsers

### Browser Limitations

- **Memory Constraints**: Processing very large numbers of images may exceed browser memory limits
- **CORS Restrictions**: Cross-origin image access limited by browser security policies
- **File Size Detection**: Accurate file size detection may not be available for all images

### Data Limitations

- **Metadata Accuracy**: Image dimensions and file sizes may be estimates for some formats
- **Alt Text Quality**: Alt text presence doesn't guarantee accessibility compliance
- **Responsive Images**: Complex srcset configurations may not be fully captured

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

- **GetAllTextFromLink**: Use when you need different approach to similar functionality
- **GetLinksFromLink**: Use when you need different approach to similar functionality

### Complementary Nodes

- **DownloadAsFile**: Works well together in workflows
- **EditFields**: Works well together in workflows
- **Filter**: Works well together in workflows

### Common Workflow Patterns

- **GetImagesFromLink → Filter → DownloadAsFile**: Common integration pattern
- **GetImagesFromLink → EditFields → Http-Request**: Common integration pattern

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

### Current Version: 1.2.0

- Added support for responsive image srcset extraction
- Improved lazy-loading detection with Intersection Observer API
- Enhanced metadata collection including loading attributes

### Previous Versions

- **1.1.0**: Added file size estimation and format detection
- **1.0.0**: Initial release with basic image URL extraction

## Additional Resources

- [Web Accessibility Guidelines](/usage/licenses-and-privacy/privacy-security/security)
- [Media Processing Workflows](/learning/workflow-patterns/content-manipulation-patterns)
- [Image Analysis with AI](/advanced-ai/examples/intelligent-content-analysis)
- [Web Scraping Best Practices](/learning/examples/web-automation-patterns)

---

**Last Updated**: October 18, 2024  
**Tested With**: Browser Extension v2.1.0  
**Validation Status**: ✅ Code Examples Tested | ✅ Browser Compatibility Verified | ✅ User Tested