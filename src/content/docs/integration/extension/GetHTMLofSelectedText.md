---
title: Get HTML of Selected Text
description: "Get HTML markup of selected content with Agentic Workflow Studio browser extension for precise content manipulation."
---

The **Get HTML of Selected Text** node captures the HTML markup of content that a user has selected on a web page, preserving the original formatting, links, and structure of the selected content.

## How it Works

This node uses the browser's Selection API to identify the selected content and then extracts the corresponding HTML markup, including all tags, attributes, and nested elements within the selection range.

## Browser API Details

The node leverages the following browser APIs:
- **Selection API**: `window.getSelection()` to access selected content
- **Range API**: `Range.cloneContents()` to extract HTML fragments
- **DOM Serialization**: `XMLSerializer` to convert DOM to HTML string
- **Content Scripts**: Injected into the active tab to access page content

### Required Permissions
- `activeTab`: Access to the currently active browser tab
- `scripting`: Ability to inject content scripts

## Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Include Outer Tags | Boolean | No | Include the outermost selected element tags (default: true) |
| Preserve Attributes | Boolean | No | Keep all HTML attributes (default: true) |
| Clean Markup | Boolean | No | Remove unnecessary attributes and clean HTML (default: false) |
| Include Styles | Boolean | No | Preserve inline styles and style attributes (default: true) |
| Max Length | Number | No | Maximum HTML length in characters (default: 50,000) |

### Output Data

The node outputs an object containing:

```json
{
  "selectedHTML": "<p>Selected content with <strong>formatting</strong></p>",
  "plainText": "Selected content with formatting",
  "elementCount": 3,
  "hasLinks": true,
  "hasImages": false,
  "structure": {
    "rootElement": "p",
    "nestedElements": ["strong"],
    "attributes": ["class", "id"]
  },
  "selectionInfo": {
    "startContainer": "text",
    "endContainer": "text",
    "rangeCount": 1
  },
  "extractedAt": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Rich Content Extraction

Extract formatted content while preserving structure:

```javascript
// Workflow: Select formatted text → extract HTML → process
// 1. User selects: "Visit our <a href="/products">products page</a> for more info"
// 2. Get HTML of Selected Text captures: "<a href="/products">products page</a>"
// 3. Process links and formatting for content migration
```

### Content Cloning and Replication

Clone selected content with full formatting:

```javascript
// Workflow: HTML extraction → content replication → insertion
// 1. User selects formatted content from source page
// 2. Get HTML of Selected Text preserves all formatting
// 3. Insert content into target location with original styling
// 4. Maintain links, images, and structure
```

### Content Analysis with Structure

Analyze content while preserving HTML structure:

```javascript
// Workflow: HTML selection → structure analysis → insights
// 1. Get HTML of Selected Text captures markup
// 2. Analyze HTML structure and semantic elements
// 3. Extract metadata like headings, links, emphasis
// 4. Generate structured content insights
```

### Template Extraction

Extract reusable HTML templates from selections:

```javascript
// Workflow: Select template → extract HTML → save template
// 1. User selects well-formatted content section
// 2. Get HTML of Selected Text captures complete markup
// 3. Clean and process HTML for template use
// 4. Save as reusable content template
```

## Integration Patterns

### With Content Processing

```javascript
// Pattern: HTML extraction → processing → transformation
Get HTML of Selected Text → Clean HTML → Transform Content → Apply Styling
```

### With Content Migration

```javascript
// Pattern: Extract → validate → migrate
Get HTML of Selected Text → Validate Markup → Convert Format → Insert Content
```

### With Structure Analysis

```javascript
// Pattern: HTML analysis → semantic extraction → documentation
Get HTML of Selected Text → Parse Structure → Extract Semantics → Generate Docs
```

## HTML Processing Features

### Content Preservation Options

The node can preserve various aspects of HTML content:

| Preservation Type | Description | Use Case |
|------------------|-------------|----------|
| Complete Markup | All tags, attributes, and content | Full content migration |
| Structure Only | Tags and hierarchy, minimal attributes | Template extraction |
| Semantic Elements | Headings, lists, emphasis, links | Content analysis |
| Styling Information | Classes, inline styles, formatting | Visual preservation |
| Interactive Elements | Forms, buttons, input fields | Functional content |

### Markup Cleaning Options

Available HTML cleaning and processing:
- **Attribute Filtering**: Remove tracking, analytics, or unnecessary attributes
- **Link Processing**: Convert relative to absolute URLs
- **Style Normalization**: Standardize CSS classes and inline styles
- **Content Sanitization**: Remove potentially harmful or unwanted elements

## DOM Manipulation Limitations

### Selection Boundaries

Understanding selection limitations:
- **Partial Elements**: Selections may start/end mid-element
- **Cross-Element Selections**: May span multiple parent elements
- **Complex Nesting**: Deeply nested elements can complicate extraction
- **Dynamic Content**: JavaScript-modified content may affect selection

### Browser Security Restrictions

Security limitations affecting HTML extraction:
- **Cross-Origin Content**: Cannot access iframe content from different domains
- **Protected Elements**: Some elements may be access-restricted
- **Content Security Policy**: CSP may limit content access
- **Shadow DOM**: Limited access to shadow DOM content

### Content Integrity

Factors affecting HTML integrity:
- **Incomplete Selections**: Partial element selections may break markup
- **Missing Dependencies**: External CSS/JS may not be captured
- **Dynamic Styling**: JavaScript-applied styles may be lost
- **Relative References**: Links and images may need URL resolution

## Error Handling

### Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| No Selection | User hasn't selected content | Prompt user to select content |
| Invalid HTML | Selection creates malformed markup | Use markup cleaning options |
| Size Limit Exceeded | Selected HTML too large | Increase limit or select less content |
| Access Denied | Content script injection blocked | Check page permissions |
| Serialization Failed | Complex DOM structure | Try with simplified options |

### Error Response Format

```json
{
  "error": true,
  "errorType": "INVALID_SELECTION",
  "message": "Selected content cannot be converted to valid HTML",
  "selectedHTML": "",
  "plainText": "",
  "details": {
    "reason": "Selection spans incompatible elements",
    "selectionType": "cross-element",
    "elementCount": 0
  }
}
```

## Best Practices

### Selection Quality
1. **Guide Users**: Provide clear instructions for making good selections
2. **Validate Selections**: Check that selections produce valid HTML
3. **Handle Partial Elements**: Process incomplete element selections gracefully
4. **Preserve Context**: Maintain important parent element context when needed

### HTML Quality
1. **Clean Markup**: Remove unnecessary attributes and elements
2. **Validate Structure**: Ensure extracted HTML is well-formed
3. **Resolve References**: Convert relative URLs to absolute when needed
4. **Preserve Semantics**: Maintain important semantic HTML elements

### Performance Optimization
1. **Set Size Limits**: Prevent memory issues with large selections
2. **Optimize Processing**: Use efficient HTML parsing and serialization
3. **Cache Results**: Store processed HTML to avoid re-processing
4. **Monitor Memory**: Watch for memory usage with complex HTML

### User Experience
1. **Visual Feedback**: Show users what content will be extracted
2. **Selection Validation**: Provide feedback on selection quality
3. **Error Guidance**: Help users make better selections when errors occur
4. **Preview Content**: Show extracted HTML preview before processing

## Security Considerations

### Content Sanitization

Important security practices:
- **Remove Scripts**: Strip JavaScript code from extracted HTML
- **Sanitize Attributes**: Remove event handlers and dangerous attributes
- **Validate URLs**: Check and clean href and src attributes
- **Filter Content**: Remove potentially malicious or unwanted elements

### Data Privacy

Privacy considerations for HTML extraction:
- **Personal Information**: Selected content may contain personal data
- **Authentication Data**: May include session tokens or user info
- **Tracking Elements**: Could contain analytics or tracking code
- **User Input**: Might capture form data or user-entered content

## Related Nodes

- **Get Selected Text**: Extract plain text from selections without HTML
- **Get All HTML**: Extract complete page HTML markup
- **Parse HTML**: Process and analyze extracted HTML content
- **Clean HTML**: Sanitize and clean extracted HTML markup
- **Insert HTML**: Place extracted HTML content into other locations