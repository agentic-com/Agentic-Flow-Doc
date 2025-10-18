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

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Include Hidden Text | Boolean | No | Extract text from hidden elements (default: false) |
| Preserve Structure | Boolean | No | Maintain basic text structure with line breaks (default: true) |
| Max Length | Number | No | Maximum characters to extract (default: 100,000) |
| Exclude Selectors | Array | No | CSS selectors for elements to exclude (e.g., [".ads", ".sidebar"]) |
| Include Metadata | Boolean | No | Include page metadata like title and description (default: true) |

### Output Data

The node outputs an object containing:

```json
{
  "fullText": "Complete page text content...",
  "wordCount": 1250,
  "characterCount": 8500,
  "metadata": {
    "title": "Page Title",
    "description": "Page meta description",
    "url": "https://example.com/page",
    "domain": "example.com"
  },
  "structure": {
    "headings": ["Main Title", "Section 1", "Section 2"],
    "paragraphs": 15,
    "lists": 3
  },
  "extractedAt": "2024-01-15T10:30:00Z"
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

- **Get Selected Text**: Extract only user-selected text portions
- **Get All HTML**: Extract complete HTML markup instead of text
- **Get All Links**: Extract all links from the page
- **Get All Images**: Extract all images from the page
- **Filter Text**: Process and clean extracted text content