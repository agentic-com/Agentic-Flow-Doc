---
title: Get All Text
description: "Capture all text content from web pages with Agentic Workflow Studio browser extension for comprehensive content analysis."
---

The **Get All Text** node captures all visible text content from the current web page, providing a comprehensive text representation of the page for analysis, processing, or storage.

## How it Works

This node uses browser APIs to traverse the DOM and extract all text content from visible elements, excluding hidden content, scripts, and styling information. It provides clean, readable text that represents what a user would see on the page.

## Browser API Details

The node leverages the following browser APIs:
- **DOM Traversal API**: `document.body.innerText` and `textContent` properties
- **Element Visibility API**: `getComputedStyle()` to check element visibility
- **Content Scripts**: Injected into the active tab to access page content

### Required Permissions
- `activeTab`: Access to the currently active browser tab
- `scripting`: Ability to inject content scripts

## Configuration

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Include Hidden Text** | Boolean | No | `false` | Extract text from hidden elements (display:none, visibility:hidden) |
| **Preserve Structure** | Boolean | No | `true` | Maintain text structure with line breaks and spacing |
| **Max Length** | Number | No | `100000` | Maximum characters to extract (0 = unlimited) |
| **Exclude Selectors** | Array | No | `[]` | CSS selectors for elements to exclude |
| **Include Metadata** | Boolean | No | `true` | Include page metadata like title and description |
| **Text Quality Filter** | String | No | `medium` | Filter quality: `none`, `basic`, `medium`, `strict` |
| **Language Detection** | Boolean | No | `false` | Detect and include page language information |
| **Include Links** | Boolean | No | `false` | Extract and include all link URLs with their text |
| **Include Images Alt** | Boolean | No | `true` | Include alt text from images in extraction |
| **Chunk Size** | Number | No | `0` | Split text into chunks of specified size (0 = no chunking) |

### Advanced Filtering Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Content Areas Only** | Boolean | No | `false` | Focus on main content areas (article, main, .content) |
| **Skip Navigation** | Boolean | No | `true` | Exclude navigation menus and breadcrumbs |
| **Skip Footer** | Boolean | No | `true` | Exclude footer content and copyright notices |
| **Skip Sidebar** | Boolean | No | `true` | Exclude sidebar content and widgets |
| **Skip Comments** | Boolean | No | `false` | Exclude user comments and discussion sections |
| **Minimum Paragraph Length** | Number | No | `20` | Minimum characters for paragraph inclusion |
| **Include Tables** | Boolean | No | `true` | Include text content from tables |
| **Table Format** | String | No | `structured` | Table text format: `plain`, `structured`, `csv` |
| **Include Lists** | Boolean | No | `true` | Include content from ordered and unordered lists |
| **List Format** | String | No | `bullets` | List format: `plain`, `bullets`, `numbers` |

### Performance & Processing Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Processing Timeout** | Number | No | `30000` | Maximum processing time in milliseconds |
| **Batch Processing** | Boolean | No | `false` | Process large pages in batches to prevent blocking |
| **Batch Size** | Number | No | `1000` | Elements to process per batch |
| **Include Processing Stats** | Boolean | No | `false` | Include performance metrics in output |
| **Cache Results** | Boolean | No | `false` | Cache extracted text for repeated access |
| **Cache Duration** | Number | No | `300000` | Cache duration in milliseconds (5 minutes) |

### Output Data

The node outputs a comprehensive object containing:

```json
{
  "fullText": "Complete page text content with preserved structure...",
  "chunks": ["Chunk 1 text...", "Chunk 2 text..."], // When chunking enabled
  "statistics": {
    "wordCount": 1250,
    "characterCount": 8500,
    "paragraphCount": 15,
    "sentenceCount": 89,
    "averageWordsPerSentence": 14.0,
    "readabilityScore": 65.2
  },
  "metadata": {
    "title": "Page Title",
    "description": "Page meta description", 
    "url": "https://example.com/page",
    "domain": "example.com",
    "language": "en",
    "languageConfidence": 0.95,
    "author": "John Doe", // If available in meta tags
    "publishDate": "2024-01-10", // If available
    "lastModified": "2024-01-15"
  },
  "structure": {
    "headings": [
      {"level": 1, "text": "Main Title", "id": "main-title"},
      {"level": 2, "text": "Section 1", "id": "section-1"},
      {"level": 2, "text": "Section 2", "id": "section-2"}
    ],
    "paragraphs": 15,
    "lists": {
      "ordered": 2,
      "unordered": 3,
      "totalItems": 24
    },
    "tables": {
      "count": 1,
      "totalRows": 10,
      "totalColumns": 4
    },
    "images": {
      "count": 8,
      "withAltText": 6,
      "altTexts": ["Chart showing growth", "Product image", "..."]
    }
  },
  "links": {
    "internal": [
      {"text": "Related Article", "url": "/related-article", "title": "More Info"}
    ],
    "external": [
      {"text": "External Source", "url": "https://external.com", "domain": "external.com"}
    ],
    "totalCount": 23
  },
  "contentAreas": {
    "mainContent": "Primary article or page content...",
    "navigation": "Home > Category > Article",
    "sidebar": "Related links and widgets...",
    "footer": "Copyright and contact information..."
  },
  "quality": {
    "score": 85, // 0-100 quality score
    "factors": {
      "hasMainContent": true,
      "appropriateLength": true,
      "goodStructure": true,
      "minimalBoilerplate": true
    },
    "warnings": ["Some paragraphs are very short", "Missing meta description"]
  },
  "processing": {
    "timeMs": 245,
    "elementsProcessed": 1247,
    "excludedElements": 89,
    "cacheHit": false,
    "batchesProcessed": 3
  },
  "extractedAt": "2024-01-15T10:30:00Z",
  "extractionMethod": "dom-traversal", // or "selection-api", "readability"
  "browserInfo": {
    "userAgent": "Chrome/120.0.0.0",
    "viewport": {"width": 1920, "height": 1080},
    "pageLoadTime": 1250
  }
}
```

## Usage Examples

### Content Analysis Workflow

Analyze entire page content for insights:

```javascript
// Workflow: Page text → AI analysis → insights
// 1. Get All Text extracts full page content
// 2. AI node analyzes content for key topics
// 3. Generate summary and key points
// 4. Save insights to knowledge base
```

### Content Monitoring

Monitor web pages for content changes:

```javascript
// Workflow: Extract text → compare → alert
// 1. Get All Text captures current page content
// 2. Compare with previously stored version
// 3. Identify changes and differences
// 4. Send notification if significant changes detected
```

### Research Data Collection

Collect text data from multiple pages for research:

```javascript
// Workflow: Navigate pages → extract text → compile
// 1. Loop through list of URLs
// 2. Get All Text from each page
// 3. Clean and structure the text data
// 4. Compile into research dataset
```

### SEO Content Analysis

Analyze page content for SEO optimization:

```javascript
// Workflow: Text extraction → SEO analysis → recommendations
// 1. Get All Text captures page content
// 2. Analyze keyword density and readability
// 3. Check content structure and length
// 4. Generate SEO improvement suggestions
```

## Integration Patterns

### With AI Processing

```javascript
// Pattern: Full page analysis
Get All Text → AI Summarization → Key Points Extraction → Report Generation
```

### With Data Storage

```javascript
// Pattern: Content archiving
Get All Text → Clean Text → Add Metadata → Store in Database → Index for Search
```

### With Content Comparison

```javascript
// Pattern: Change detection
Get All Text → Compare with Previous → Identify Changes → Generate Diff Report
```

## Text Processing Options

### Content Filtering

The node can filter content based on:
- **Element Types**: Exclude navigation, ads, footers
- **Visibility**: Skip hidden or off-screen content
- **Content Quality**: Filter out low-value text (very short paragraphs, etc.)

### Structure Preservation

Options for maintaining text structure:
- **Paragraph Breaks**: Preserve paragraph separation
- **Heading Hierarchy**: Maintain heading levels
- **List Structure**: Keep list formatting
- **Link Context**: Preserve link text and relationships

## Limitations and Considerations

### Performance Impact

| Page Size | Processing Time | Memory Usage | Recommendations |
|-----------|----------------|--------------|-----------------|
| Small (< 50KB) | < 100ms | Low | No restrictions needed |
| Medium (50-200KB) | 100-500ms | Moderate | Consider text limits |
| Large (200KB-1MB) | 500ms-2s | High | Use exclude selectors |
| Very Large (> 1MB) | > 2s | Very High | Set strict max length |

### Browser Security Restrictions

- **Cross-Origin Content**: Cannot access iframes from different domains
- **Protected Pages**: Some sites block content script injection
- **Dynamic Content**: May miss content loaded after initial page load
- **Shadow DOM**: Limited access to shadow DOM content

### Content Quality Considerations

- **Generated Content**: May include auto-generated or template text
- **Duplicate Content**: Repeated navigation or footer text
- **Non-Text Elements**: Cannot extract text from images or videos
- **Formatting Loss**: Rich formatting is converted to plain text

## Error Handling

### Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| Access Denied | Content script injection blocked | Try different page or check permissions |
| Timeout | Page too large or slow to process | Reduce max length or add excludes |
| Empty Content | Page has no visible text | Check if page loaded completely |
| Memory Limit | Text content exceeds browser limits | Set lower max length limit |

### Error Response Format

```json
{
  "error": true,
  "errorType": "EXTRACTION_FAILED",
  "message": "Unable to extract text from page",
  "fullText": "",
  "wordCount": 0,
  "details": {
    "reason": "Content script injection blocked",
    "url": "https://example.com/page"
  }
}
```

## Best Practices

### Performance Optimization
1. **Set Reasonable Limits**: Use `Max Length` to prevent memory issues
2. **Exclude Unnecessary Content**: Use CSS selectors to skip ads, navigation
3. **Monitor Processing Time**: Consider user experience for large pages
4. **Cache Results**: Store extracted text to avoid re-processing

### Content Quality
1. **Clean Text Data**: Remove excessive whitespace and formatting artifacts
2. **Validate Content**: Check for meaningful content vs. template text
3. **Handle Encoding**: Ensure proper character encoding handling
4. **Structure Preservation**: Maintain important text structure when needed

### User Experience
1. **Progress Indicators**: Show extraction progress for large pages
2. **Error Feedback**: Provide clear error messages to users
3. **Content Preview**: Show sample of extracted text for verification
4. **Processing Notifications**: Inform users when extraction is complete

## Related Nodes

### Text Extraction Alternatives
- **[Get Selected Text](/integration/extension/GetSelectedText/)**: Extract only user-selected text portions for focused analysis
- **[Get All HTML](/integration/extension/GetAllHTML/)**: Extract complete HTML markup with structure preserved

### Content Collection
- **[Get All Links](/integration/extension/GetAllLinks/)**: Extract all links from the page for navigation analysis
- **[Get All Images](/integration/extension/GetAllImages/)**: Extract all images from the page for media processing

### Text Processing & Analysis
- **[Edit Fields](/integration/builtin/dataTransformation/EditFields/)**: Process and clean extracted text content
- **[AI Agent](/integration/builtin/ai/AIAgents/BasicLLMChainNode/)**: Analyze extracted text with AI models

### Common Workflow Patterns
- **Content Analysis**: GetAllText → [AI Summarization](/advanced-ai/examples/intelligent-content-analysis/) → [Generate Report](/integration/builtin/dataTransformation/DownloadAsFile/)
- **SEO Analysis**: GetAllText → [Text Processing](/integration/builtin/dataTransformation/EditFields/) → [Keyword Analysis](/advanced-ai/examples/intelligent-content-analysis/)
- **Content Monitoring**: GetAllText → [Compare Data](/integration/builtin/flow/Filter/) → [Alert System](/integration/builtin/core/Http-Request/)

### Learning Resources
- **[Content Analysis Tutorial](/learning/text-courses/intermediate/data-transformation/)**: Learn to process extracted content
- **[Web Scraping Patterns](/learning/workflow-patterns/web-scraping-patterns/)**: Advanced text extraction techniques
- **[Performance Optimization](/learning/workflow-patterns/optimization-best-practices/)**: Optimize large text processing workflows