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

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Include External Links** | Boolean | No | `true` | Extract links to external domains |
| **Include Internal Links** | Boolean | No | `true` | Extract links within the same domain |
| **Include Anchor Links** | Boolean | No | `false` | Extract page anchor/fragment links |
| **Include Hidden Links** | Boolean | No | `false` | Extract links from hidden elements |
| **Resolve Relative URLs** | Boolean | No | `true` | Convert relative URLs to absolute |
| **Include Link Metadata** | Boolean | No | `true` | Extract additional link attributes |
| **Max Links** | Number | No | `1000` | Maximum number of links to extract |

### Advanced Filtering Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Link Types** | Array | No | `["http", "https"]` | URL schemes to include: `http`, `https`, `mailto`, `tel`, `ftp` |
| **Domain Filters** | Array | No | `[]` | Specific domains to include or exclude |
| **URL Pattern Filters** | Array | No | `[]` | Regex patterns for URL filtering |
| **Anchor Text Filters** | Array | No | `[]` | Text content patterns to match |
| **Element Selectors** | Array | No | `[]` | CSS selectors for link containers |
| **Exclude Selectors** | Array | No | `[]` | CSS selectors for elements to exclude |
| **Minimum Text Length** | Number | No | `0` | Minimum anchor text length |
| **Maximum Text Length** | Number | No | `0` | Maximum anchor text length (0 = unlimited) |

### Link Categorization Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Categorize By Type** | Boolean | No | `true` | Categorize links by URL type (internal/external/anchor) |
| **Categorize By Domain** | Boolean | No | `true` | Group links by destination domain |
| **Categorize By Content** | Boolean | No | `false` | Categorize by content type (page/file/media) |
| **Detect File Types** | Boolean | No | `true` | Identify file downloads vs web pages |
| **Analyze Link Context** | Boolean | No | `false` | Analyze surrounding content for context |
| **Extract Link Hierarchy** | Boolean | No | `false` | Identify navigation vs content links |

### Validation & Quality Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Validate URLs** | Boolean | No | `false` | Check URL format and structure |
| **Check Accessibility** | Boolean | No | `false` | Verify links are accessible (not 404) |
| **Analyze Anchor Text** | Boolean | No | `false` | Assess anchor text quality and relevance |
| **Detect Duplicate Links** | Boolean | No | `true` | Identify and mark duplicate URLs |
| **Check Redirect Chains** | Boolean | No | `false` | Follow and analyze redirect chains |
| **Security Scanning** | Boolean | No | `false` | Basic security checks for suspicious URLs |

### Metadata Extraction Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Extract Attributes** | Array | No | `["rel", "target", "title"]` | HTML attributes to extract |
| **Include Position Data** | Boolean | No | `false` | Include DOM position and XPath |
| **Extract Context** | Boolean | No | `false` | Include surrounding text and elements |
| **Include Styling Info** | Boolean | No | `false` | Extract computed styles and visibility |
| **Analyze Link Relationships** | Boolean | No | `false` | Identify parent-child link relationships |
| **Extract Semantic Data** | Boolean | No | `false` | Extract microdata and structured data |

### Performance & Processing Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Processing Timeout** | Number | No | `30000` | Maximum processing time in milliseconds |
| **Batch Processing** | Boolean | No | `false` | Process large link sets in batches |
| **Batch Size** | Number | No | `100` | Links to process per batch |
| **Include Processing Stats** | Boolean | No | `false` | Include performance metrics in output |
| **Cache Results** | Boolean | No | `false` | Cache extracted links for repeated access |
| **Parallel Processing** | Boolean | No | `false` | Process link validation in parallel |

### Output Data

The node outputs a comprehensive object containing:

```json
{
  "links": [
    {
      "id": "link-001",
      "url": "https://example.com/page",
      "originalUrl": "/page", // Before resolution
      "text": "Link text",
      "title": "Link title attribute",
      "type": "external",
      "category": "content-link",
      "element": "a",
      "attributes": {
        "rel": "nofollow",
        "target": "_blank",
        "class": "external-link",
        "data-track": "click-event"
      },
      "position": {
        "index": 0,
        "xpath": "/html/body/div[1]/a[1]",
        "selector": "div.content > a:first-child",
        "offsetTop": 150,
        "offsetLeft": 20
      },
      "context": {
        "parentElement": "div",
        "parentClass": "content",
        "surroundingText": "...text before link... Link text ...text after link...",
        "siblingLinks": 2,
        "sectionHeading": "Related Articles"
      },
      "validation": {
        "isValid": true,
        "isAccessible": true,
        "statusCode": 200,
        "responseTime": 245,
        "redirectChain": ["https://example.com/page"],
        "finalUrl": "https://example.com/page",
        "contentType": "text/html",
        "lastChecked": "2024-01-15T10:30:00Z"
      },
      "quality": {
        "anchorTextQuality": "good", // good, fair, poor
        "anchorTextLength": 9,
        "isDescriptive": true,
        "hasGenericText": false, // "click here", "read more"
        "contextRelevance": 0.85,
        "trustScore": 0.92
      },
      "security": {
        "isSafe": true,
        "hasTracking": true,
        "isShortened": false,
        "suspiciousPatterns": [],
        "securityScore": 0.95
      },
      "metadata": {
        "domain": "example.com",
        "subdomain": "www",
        "path": "/page",
        "parameters": {},
        "fragment": null,
        "fileExtension": null,
        "estimatedContentType": "webpage"
      }
    }
  ],
  "summary": {
    "totalLinks": 45,
    "processedLinks": 45,
    "validLinks": 43,
    "brokenLinks": 2,
    "duplicateLinks": 3,
    "internalLinks": 32,
    "externalLinks": 13,
    "anchorLinks": 5,
    "emailLinks": 2,
    "phoneLinks": 1,
    "fileLinks": 8,
    "uniqueDomains": 8,
    "averageResponseTime": 312,
    "totalProcessingTime": 2450
  },
  "categories": {
    "byType": {
      "internal": 32,
      "external": 13,
      "anchor": 5,
      "email": 2,
      "phone": 1,
      "file": 8
    },
    "byContent": {
      "navigation": 12,
      "content": 28,
      "footer": 8,
      "sidebar": 5
    },
    "byFileType": {
      "pdf": 3,
      "image": 4,
      "document": 2,
      "media": 1
    }
  },
  "domains": [
    {
      "domain": "example.com",
      "count": 13,
      "type": "external",
      "trustScore": 0.92,
      "averageResponseTime": 280,
      "categories": ["content", "reference"],
      "firstSeen": "2024-01-15T10:30:00Z"
    },
    {
      "domain": "current-site.com",
      "count": 32,
      "type": "internal",
      "categories": ["navigation", "content"],
      "siteStructure": {
        "sections": ["about", "products", "contact"],
        "depth": 3,
        "breadth": 12
      }
    }
  ],
  "patterns": {
    "commonPaths": ["/about", "/contact", "/products"],
    "parameterPatterns": ["utm_source", "ref", "id"],
    "anchorTextPatterns": ["Learn more", "Read article", "View details"],
    "linkingPatterns": {
      "mostLinkedDomain": "example.com",
      "averageLinksPerDomain": 2.3,
      "linkDensity": 0.045 // links per word
    }
  },
  "quality": {
    "overallScore": 0.87,
    "factors": {
      "descriptiveAnchors": 0.92,
      "workingLinks": 0.96,
      "appropriateTargets": 0.88,
      "securityCompliance": 0.94
    },
    "issues": [
      {
        "type": "generic-anchor-text",
        "count": 3,
        "examples": ["click here", "read more"],
        "severity": "medium"
      },
      {
        "type": "broken-links",
        "count": 2,
        "urls": ["https://broken.example.com", "https://missing.example.com"],
        "severity": "high"
      }
    ],
    "recommendations": [
      "Replace generic anchor text with descriptive text",
      "Fix or remove broken links",
      "Consider adding rel='noopener' to external links"
    ]
  },
  "accessibility": {
    "score": 0.78,
    "issues": [
      {
        "type": "missing-title-attribute",
        "count": 5,
        "severity": "medium"
      },
      {
        "type": "insufficient-color-contrast",
        "count": 2,
        "severity": "high"
      }
    ],
    "compliance": {
      "wcag2.1": "AA-partial",
      "section508": "partial"
    }
  },
  "processing": {
    "timeMs": 2450,
    "method": "dom-traversal",
    "batchesProcessed": 5,
    "cacheHit": false,
    "validationEnabled": true,
    "parallelProcessing": false,
    "warnings": ["Some links took longer than 5s to validate"],
    "errors": []
  },
  "extractedAt": "2024-01-15T10:30:00Z",
  "pageInfo": {
    "url": "https://current-site.com/page",
    "title": "Page Title",
    "domain": "current-site.com",
    "lastModified": "2024-01-14T15:20:00Z"
  }
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

### Content Collection Alternatives
- **[Get All Images](/integration/extension/GetAllImages/)**: Extract all images from the page for media analysis
- **[Get All Text](/integration/extension/GetAllText/)**: Extract all text content for comprehensive page analysis
- **[Get All HTML](/integration/extension/GetAllHTML/)**: Extract complete HTML structure including links

### Link Processing & Analysis
- **[Link Analyzer](/integration/extension/LinkAnalyzer/)**: Analyze collected links for patterns and metadata
- **[Navigate to Link](/integration/extension/NavigateToLink/)**: Programmatically navigate to discovered links
- **[HTTP Request](/integration/builtin/core/Http-Request/)**: Validate link accessibility and response data

### Data Processing
- **[Edit Fields](/integration/builtin/dataTransformation/EditFields/)**: Process and filter extracted link data
- **[Filter](/integration/builtin/flow/Filter/)**: Filter links based on criteria and patterns

### Common Workflow Patterns
- **Link Validation**: GetAllLinks → [HTTP Request](/integration/builtin/core/Http-Request/) → [Filter](/integration/builtin/flow/Filter/) → [Report Generation](/integration/builtin/dataTransformation/DownloadAsFile/)
- **Site Mapping**: GetAllLinks → [Navigate to Link](/integration/extension/NavigateToLink/) → [Recursive Collection](/integration/builtin/flow/Merge/)
- **SEO Analysis**: GetAllLinks → [Link Analyzer](/integration/extension/LinkAnalyzer/) → [AI Analysis](/integration/builtin/ai/AIAgents/BasicLLMChainNode/)

### Learning Resources
- **[Web Scraping Patterns](/learning/workflow-patterns/web-scraping-patterns/)**: Advanced link collection and processing techniques
- **[Data Processing Patterns](/learning/workflow-patterns/data-processing-patterns/)**: Techniques for processing collected link data
- **[Research Automation](/learning/workflow-patterns/real-world-examples/research-automation/)**: Using link collection for research workflows
- **Get All Text**: Extract all text content from the page
- **HTTP Request**: Validate extracted links by making requests
- **Filter Links**: Process and filter extracted link data
- **URL Parser**: Parse and analyze individual URLs from the collection