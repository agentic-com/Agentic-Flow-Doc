---
title: Get All Links
description: "Collect all links from web pages using Agentic Workflow Studio browser extension for comprehensive link analysis and processing."
---

The **Get All Links** node discovers and extracts all hyperlinks from the current web page, providing comprehensive link data including URLs, anchor text, and metadata for analysis, validation, or processing.

## How it Works

This node traverses the DOM to find all anchor (`<a>`) elements and other link-containing elements, extracting URLs, link text, and associated metadata. It can process both visible and hidden links, internal and external references.

## Browser API Details

The node leverages the following browser APIs:
- **DOM Query API**: `document.querySelectorAll()` to find link elements
- **URL API**: `new URL()` for URL parsing and validation
- **Element Properties**: Access to `href`, `textContent`, and other link properties
- **Content Scripts**: Injected into the active tab to access page content

### Required Permissions
- `activeTab`: Access to the currently active browser tab
- `scripting`: Ability to inject content scripts

## Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Include External Links | Boolean | No | Extract links to external domains (default: true) |
| Include Internal Links | Boolean | No | Extract links within the same domain (default: true) |
| Include Anchor Links | Boolean | No | Extract page anchor/fragment links (default: false) |
| Include Hidden Links | Boolean | No | Extract links from hidden elements (default: false) |
| Resolve Relative URLs | Boolean | No | Convert relative URLs to absolute (default: true) |
| Include Link Metadata | Boolean | No | Extract additional link attributes (default: true) |
| Max Links | Number | No | Maximum number of links to extract (default: 1000) |

### Output Data

The node outputs an object containing:

```json
{
  "links": [
    {
      "url": "https://example.com/page",
      "text": "Link text",
      "title": "Link title attribute",
      "type": "external",
      "element": "a",
      "attributes": {
        "rel": "nofollow",
        "target": "_blank",
        "class": "external-link"
      },
      "position": {
        "index": 0,
        "xpath": "/html/body/div[1]/a[1]"
      }
    }
  ],
  "summary": {
    "totalLinks": 45,
    "internalLinks": 32,
    "externalLinks": 13,
    "anchorLinks": 5,
    "brokenLinks": 2,
    "uniqueDomains": 8
  },
  "domains": [
    {
      "domain": "example.com",
      "count": 13,
      "type": "external"
    }
  ],
  "extractedAt": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Link Validation and Monitoring

Check all links on a page for validity:

```javascript
// Workflow: Extract links → validate → report broken links
// 1. Get All Links extracts all page links
// 2. HTTP Request node checks each link status
// 3. Filter node identifies broken links (404, 500, etc.)
// 4. Generate report of broken links for fixing
```

### SEO Link Analysis

Analyze link structure for SEO optimization:

```javascript
// Workflow: Link extraction → SEO analysis → recommendations
// 1. Get All Links captures all page links
// 2. Analyze internal vs external link ratio
// 3. Check for proper rel attributes and anchor text
// 4. Generate SEO improvement recommendations
```

### Content Discovery and Crawling

Discover related content through link analysis:

```javascript
// Workflow: Link extraction → filtering → content discovery
// 1. Get All Links from current page
// 2. Filter for relevant internal links
// 3. Visit discovered pages to extract more content
// 4. Build comprehensive site content map
```

### Competitive Analysis

Analyze competitor link strategies:

```javascript
// Workflow: Link extraction → categorization → analysis
// 1. Get All Links from competitor pages
// 2. Categorize links by type and destination
// 3. Analyze linking patterns and strategies
// 4. Generate competitive intelligence report
```

## Integration Patterns

### With Link Validation

```javascript
// Pattern: Extract → validate → report
Get All Links → HTTP Request → Filter Status → Generate Report
```

### With Content Crawling

```javascript
// Pattern: Discover → filter → crawl
Get All Links → Filter Internal → Loop Pages → Extract Content
```

### With Data Analysis

```javascript
// Pattern: Extract → analyze → visualize
Get All Links → Categorize Links → Analyze Patterns → Create Charts
```

## Link Processing Features

### Link Classification

The node automatically classifies links by type:

| Link Type | Description | Example |
|-----------|-------------|---------|
| Internal | Same domain links | `/about`, `./contact.html` |
| External | Different domain links | `https://google.com` |
| Anchor | Page fragment links | `#section1`, `#top` |
| Email | Mailto links | `mailto:user@example.com` |
| Phone | Tel links | `tel:+1234567890` |
| File | Direct file links | `document.pdf`, `image.jpg` |

### URL Processing Options

Available URL processing and normalization:
- **Absolute URL Resolution**: Convert relative URLs using page base URL
- **Parameter Cleaning**: Remove tracking parameters and session IDs
- **Fragment Handling**: Process or remove URL fragments
- **Protocol Normalization**: Standardize HTTP/HTTPS protocols
- **Domain Canonicalization**: Normalize domain variations (www, subdomains)

### Metadata Extraction

Additional data extracted for each link:
- **Link Attributes**: `rel`, `target`, `title`, `class`, `id`
- **Position Information**: DOM position and XPath location
- **Context**: Surrounding text and parent elements
- **Styling**: Computed styles and visibility status
- **Accessibility**: ARIA labels and accessibility attributes

## Link Filtering and Processing

### Content-Based Filtering

Filter links based on content criteria:

| Filter Type | Description | Use Case |
|-------------|-------------|----------|
| Text Content | Filter by anchor text patterns | Find specific link types |
| URL Patterns | Filter by URL structure or domain | Focus on relevant links |
| Attribute Values | Filter by HTML attributes | Find links with specific properties |
| Element Context | Filter by parent/sibling elements | Extract contextual links |
| Visibility | Filter by display status | Include/exclude hidden links |

### Quality Assessment

Assess link quality and relevance:
- **Anchor Text Quality**: Descriptive vs generic text
- **URL Structure**: Clean vs parameter-heavy URLs
- **Link Context**: Relevant vs navigational links
- **Destination Analysis**: Content type and quality indicators

## Performance Considerations

### Processing Efficiency

| Page Complexity | Link Count | Processing Time | Recommendations |
|----------------|------------|-----------------|-----------------|
| Simple | < 50 links | < 100ms | No restrictions |
| Medium | 50-200 links | 100-500ms | Consider filtering |
| Complex | 200-500 links | 500ms-1s | Use max limits |
| Very Complex | > 500 links | > 1s | Apply strict filtering |

### Memory Usage

Factors affecting memory consumption:
- **Link Count**: More links require more memory
- **Metadata Depth**: Detailed attributes increase memory usage
- **URL Length**: Long URLs consume more storage
- **Processing Options**: Additional analysis increases memory needs

## Error Handling

### Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| No Links Found | Page has no links or access denied | Check page content and permissions |
| URL Parse Error | Malformed URLs in page | Enable error tolerance in processing |
| Memory Limit | Too many links for processing | Reduce max links or add filtering |
| Access Denied | Content script injection blocked | Verify page permissions |
| Timeout | Page too complex or slow | Increase timeout or reduce scope |

### Error Response Format

```json
{
  "error": true,
  "errorType": "EXTRACTION_FAILED",
  "message": "Unable to extract links from page",
  "links": [],
  "summary": {
    "totalLinks": 0,
    "errorCount": 1
  },
  "details": {
    "reason": "Content script injection blocked",
    "url": "https://example.com/page"
  }
}
```

## Best Practices

### Performance Optimization
1. **Set Reasonable Limits**: Use `Max Links` to prevent memory issues
2. **Filter Early**: Apply filters to reduce processing overhead
3. **Batch Processing**: Process links in batches for large sets
4. **Cache Results**: Store extracted links to avoid re-processing

### Data Quality
1. **URL Validation**: Verify URL format and accessibility
2. **Deduplication**: Remove duplicate links and normalize URLs
3. **Context Preservation**: Maintain important link context information
4. **Error Handling**: Gracefully handle malformed or inaccessible links

### Security Considerations
1. **URL Sanitization**: Clean and validate extracted URLs
2. **Privacy Protection**: Be careful with tracking parameters
3. **Content Filtering**: Remove potentially harmful or unwanted links
4. **Access Control**: Respect robots.txt and crawling policies

### User Experience
1. **Progress Indicators**: Show extraction progress for large pages
2. **Result Preview**: Display sample of extracted links
3. **Error Feedback**: Provide clear error messages and suggestions
4. **Processing Notifications**: Inform users when extraction completes

## Related Nodes

- **Get All Images**: Extract all images from the page
- **Get All Text**: Extract all text content from the page
- **HTTP Request**: Validate extracted links by making requests
- **Filter Links**: Process and filter extracted link data
- **URL Parser**: Parse and analyze individual URLs from the collection