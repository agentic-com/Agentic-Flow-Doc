---
title: Get Selected Text
description: "Extract selected text from web pages using Agentic Workflow Studio browser extension for AI processing and automation."
---

The **Get Selected Text** node allows you to capture text that a user has highlighted or selected on any web page. This is particularly useful for creating workflows that process specific content the user is interested in.

## How it Works

This node uses the browser's Selection API to access the currently selected text on the active tab. When executed, it retrieves the text content from the user's selection and makes it available for use in subsequent workflow steps.

## Browser API Details

The node leverages multiple browser APIs for comprehensive text selection handling:

### Core APIs Used

**Selection API**
- `window.getSelection()`: Primary method for accessing user selections
- `Selection.toString()`: Convert selection to plain text
- `Selection.getRangeAt()`: Get Range objects for complex selections
- `Selection.rangeCount`: Check number of selection ranges

**Range API**
- `Range.cloneContents()`: Extract selected DOM content
- `Range.getBoundingClientRect()`: Get selection position information
- `Range.commonAncestorContainer`: Find parent element of selection
- `Range.startContainer` / `Range.endContainer`: Selection boundaries

**DOM Traversal API**
- `Node.textContent`: Extract plain text from elements
- `Element.innerHTML`: Get HTML content when formatting is needed
- `Document.elementFromPoint()`: Identify elements at selection points
- `TreeWalker`: Navigate DOM structure for context extraction

**Content Scripts API**
- `chrome.scripting.executeScript()`: Inject selection extraction code
- `chrome.tabs.query()`: Identify active tab for script injection
- `chrome.runtime.sendMessage()`: Communicate selection data back to extension

### Advanced Browser Features

**Intersection Observer API**
- Monitor selection visibility and viewport position
- Detect when selected content scrolls out of view
- Optimize performance for large page selections

**Mutation Observer API**
- Watch for DOM changes that might affect selection
- Handle dynamic content updates during selection
- Maintain selection integrity in single-page applications

**Clipboard API** (when enabled)
- `navigator.clipboard.writeText()`: Copy selection to clipboard
- `ClipboardEvent`: Handle copy/paste operations
- Integration with system clipboard for enhanced workflows

### Required Permissions

| Permission | Purpose | Scope |
|------------|---------|-------|
| `activeTab` | Access currently active browser tab | Current tab only |
| `scripting` | Inject content scripts for selection access | Active tab content |
| `storage` | Cache selection data and preferences | Extension storage |
| `clipboardWrite` | Copy selections to clipboard (optional) | System clipboard |

### Browser Compatibility

| Browser | Version | Selection API | Range API | Content Scripts | Notes |
|---------|---------|---------------|-----------|-----------------|-------|
| Chrome | 88+ | ✅ Full | ✅ Full | ✅ Full | Recommended platform |
| Firefox | 85+ | ✅ Full | ✅ Full | ✅ Full | Full compatibility |
| Edge | 88+ | ✅ Full | ✅ Full | ✅ Full | Chromium-based |
| Safari | 14+ | ⚠️ Limited | ⚠️ Limited | ❌ Not supported | Web extension limitations |

### Security Considerations

**Content Security Policy (CSP)**
- Some sites block content script injection
- Inline script execution may be restricted
- Use nonce-based CSP compliance when possible

**Cross-Origin Restrictions**
- Cannot access selections in cross-origin iframes
- Subdomain selections may require additional permissions
- Third-party embedded content is typically inaccessible

**Privacy Protection**
- Selection data is processed locally in browser
- No automatic transmission of sensitive content
- User consent required for clipboard access

### Performance Optimization

**Selection Processing**
- Debounce rapid selection changes (recommended: 300ms)
- Limit processing for selections > 10,000 characters
- Use `requestIdleCallback()` for non-urgent processing

**Memory Management**
- Clear Range objects after processing to prevent memory leaks
- Limit cached selection history (recommended: 10 items)
- Use WeakMap for DOM element references

## Configuration

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Trim Whitespace** | Boolean | No | `true` | Remove leading and trailing whitespace from selected text |
| **Include Formatting** | Boolean | No | `false` | Preserve basic formatting information (bold, italic, links) |
| **Max Length** | Number | No | `unlimited` | Maximum number of characters to extract (0 = unlimited) |
| **Include Context** | Boolean | No | `false` | Include surrounding text context (50 chars before/after) |
| **Preserve Line Breaks** | Boolean | No | `true` | Maintain original line breaks and paragraph structure |
| **Extract Links** | Boolean | No | `false` | Extract URLs from selected text and include in output |
| **Case Sensitivity** | String | No | `preserve` | Text case handling: `preserve`, `lowercase`, `uppercase`, `title` |
| **Language Detection** | Boolean | No | `false` | Attempt to detect the language of selected text |
| **Selection Validation** | Boolean | No | `true` | Validate that selection contains meaningful text content |

### Advanced Configuration

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Minimum Length** | Number | No | `1` | Minimum characters required for valid selection |
| **Allowed Elements** | Array | No | `all` | HTML elements to include: `['p', 'span', 'div', 'h1-h6']` |
| **Exclude Patterns** | Array | No | `[]` | Regex patterns to exclude from selection |
| **Include Metadata** | Boolean | No | `false` | Include selection position, element info, and page context |
| **Auto Retry** | Boolean | No | `false` | Automatically retry if no selection found (useful for dynamic content) |
| **Retry Delay** | Number | No | `500` | Milliseconds to wait before retry (when Auto Retry enabled) |

### Output Data

The node outputs a comprehensive object containing:

```json
{
  "selectedText": "The actual selected text content",
  "originalText": "The actual selected text content", // Before any processing
  "length": 42,
  "wordCount": 8,
  "isEmpty": false,
  "isValid": true,
  "selectionRange": {
    "startOffset": 10,
    "endOffset": 52,
    "startContainer": "p",
    "endContainer": "p"
  },
  "context": {
    "beforeText": "...text that appears before the selection...",
    "afterText": "...text that appears after the selection...",
    "parentElement": "article",
    "pageTitle": "Example Article Title",
    "pageUrl": "https://example.com/article"
  },
  "formatting": {
    "hasBold": false,
    "hasItalic": true,
    "hasLinks": true,
    "linkUrls": ["https://example.com/link1", "https://example.com/link2"]
  },
  "metadata": {
    "language": "en",
    "confidence": 0.95,
    "elementPath": "html > body > main > article > p:nth-child(3)",
    "selectionMethod": "user", // "user" or "programmatic"
    "processingTime": 15 // milliseconds
  },
  "validation": {
    "meetsMinLength": true,
    "containsText": true,
    "excludedPatterns": [],
    "warnings": []
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Basic Text Extraction

Extract selected text for further processing:

```javascript
// Configuration
{
  "trimWhitespace": true,
  "includeFormatting": false,
  "maxLength": 1000
}

// User selects: "Climate change affects global weather patterns"
// Output:
{
  "selectedText": "Climate change affects global weather patterns",
  "length": 44,
  "wordCount": 6,
  "isEmpty": false,
  "isValid": true
}

// Workflow: Selected text → AI analysis → insights
// Next node: AI Agent for sentiment analysis or summarization
```

### Academic Research Workflow

Extract and analyze academic content with context:

```javascript
// Configuration for research extraction
{
  "includeContext": true,
  "includeFormatting": true,
  "extractLinks": true,
  "languageDetection": true,
  "includeMetadata": true
}

// User selects a key finding from research paper
// Selected: "The study found a 23% increase in efficiency when using AI-assisted workflows"
// Output includes:
{
  "selectedText": "The study found a 23% increase in efficiency when using AI-assisted workflows",
  "context": {
    "beforeText": "...conducted over 12 months with 500 participants...",
    "afterText": "...this represents a significant improvement over traditional methods...",
    "pageTitle": "AI Workflow Efficiency Study - Journal of Technology",
    "pageUrl": "https://journal.example.com/ai-efficiency-study"
  },
  "formatting": {
    "hasBold": true,
    "hasLinks": false
  },
  "metadata": {
    "language": "en",
    "confidence": 0.98
  }
}

// Workflow: Research extraction → citation formatting → knowledge base
```

### Content Validation and Fact-Checking

Validate selected content against multiple sources:

```javascript
// Configuration for fact-checking workflow
{
  "includeContext": true,
  "extractLinks": true,
  "selectionValidation": true,
  "minimumLength": 10
}

// User selects claim: "Electric vehicles reduce carbon emissions by 60%"
// Workflow: Selection → fact-check APIs → credibility score → report

// Validation checks:
// 1. Extract claim with context
// 2. Search fact-checking databases
// 3. Cross-reference with scientific sources
// 4. Generate credibility report
```

### Multi-Language Translation Workflow

Advanced translation with language detection:

```javascript
// Configuration for translation
{
  "languageDetection": true,
  "includeContext": true,
  "preserveLineBreaks": true,
  "includeFormatting": true
}

// User selects: "Bonjour le monde, comment allez-vous aujourd'hui?"
// Output:
{
  "selectedText": "Bonjour le monde, comment allez-vous aujourd'hui?",
  "metadata": {
    "language": "fr",
    "confidence": 0.97
  },
  "context": {
    "pageTitle": "French Language Learning - Lesson 3"
  }
}

// Workflow: Selection → language detection → translation service → pronunciation guide
```

### Legal Document Analysis

Extract and analyze legal text with precision:

```javascript
// Configuration for legal text
{
  "includeFormatting": true,
  "includeContext": true,
  "extractLinks": true,
  "includeMetadata": true,
  "allowedElements": ["p", "span", "strong", "em"],
  "excludePatterns": ["\\[.*?\\]"] // Exclude reference numbers
}

// User selects contract clause
// Selected: "The party of the first part agrees to indemnify and hold harmless..."
// Workflow: Legal text → clause analysis → risk assessment → summary report
```

### E-commerce Product Research

Extract product information for comparison:

```javascript
// Configuration for product data
{
  "extractLinks": true,
  "includeContext": true,
  "includeMetadata": true,
  "maxLength": 500
}

// User selects product description
// Selected: "Premium wireless headphones with 30-hour battery life and noise cancellation"
// Context includes price, ratings, and specifications
// Workflow: Product info → price comparison → feature analysis → recommendation
```

### Social Media Content Analysis

Analyze selected social media posts:

```javascript
// Configuration for social content
{
  "includeContext": true,
  "languageDetection": true,
  "includeMetadata": true,
  "preserveLineBreaks": true
}

// User selects tweet or post content
// Workflow: Social text → sentiment analysis → trend detection → engagement prediction
```

## Integration Patterns

### With AI Processing Nodes

```javascript
// Common pattern: Text extraction → AI analysis
GetSelectedText → AI Agent → Format Results → Display
```

### With Data Storage

```javascript
// Pattern: Collect selected quotes or snippets
GetSelectedText → Add Metadata → Save to Database → Notify User
```

### With Content Modification

```javascript
// Pattern: Select → process → replace
GetSelectedText → Transform Text → Replace Selection → Highlight Changes
```

## Limitations and Considerations

### Browser Security
- Only works on pages where content scripts can be injected
- Cannot access text in iframes from different domains
- Some websites may block text selection programmatically

### Performance
- Large text selections may impact performance
- Consider setting `Max Length` for very long selections
- Node execution time depends on selection size

### User Experience
- Requires user to actively select text before workflow execution
- Works best with clear visual feedback to users
- Consider providing instructions for text selection

## Error Handling

### Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| No Selection | User hasn't selected any text | Prompt user to select text first |
| Empty Selection | Selection contains only whitespace | Enable "Trim Whitespace" option |
| Access Denied | Page blocks content script injection | Try on a different page or domain |
| Selection Lost | User changed selection during execution | Re-execute workflow with new selection |

### Error Response Format

```json
{
  "error": true,
  "errorType": "NO_SELECTION",
  "message": "No text is currently selected on the page",
  "selectedText": "",
  "isEmpty": true
}
```

## Best Practices

1. **User Guidance**: Provide clear instructions on what text to select
2. **Validation**: Always check if text was successfully captured before processing
3. **Feedback**: Give users immediate feedback when text is captured
4. **Fallbacks**: Have alternative workflows for when no text is selected
5. **Privacy**: Be transparent about what happens to selected text data

## Related Nodes

### Text Extraction Alternatives
- **[Get All Text](/integration/extension/GetAllText/)**: Extract all visible text from entire page instead of selection
- **[Get HTML of Selected Text](/integration/extension/GetHTMLofSelectedText/)**: Get HTML markup of selected content with formatting preserved

### Text Processing & Manipulation
- **[Insert Text](/integration/extension/InsertText/)**: Insert processed text back into web pages
- **[Content Replacer](/integration/extension/ContentReplacer/)**: Replace selected text with processed content

### Common Workflow Patterns
- **Text Analysis**: GetSelectedText → [AI Agent](/integration/builtin/ai/AIAgents/BasicLLMChainNode/) → [Format Results](/integration/builtin/dataTransformation/EditFields/)
- **Content Enhancement**: GetSelectedText → [AI Processing](/advanced-ai/examples/intelligent-content-analysis/) → [Insert Text](/integration/extension/InsertText/)
- **Research Workflow**: GetSelectedText → [External API](/integration/builtin/core/Http-Request/) → [Data Storage](/integration/builtin/dataTransformation/DownloadAsFile/)

### Learning Resources
- **[First Workflow Tutorial](/learning/text-courses/beginner/first-workflow/)**: Learn to use text extraction in your first workflow
- **[Text Extraction Patterns](/learning/workflow-patterns/content-manipulation-patterns/)**: Advanced patterns for text processing
- **[AI Content Analysis](/learning/text-courses/advanced/ai-powered-analysis/)**: Using AI with extracted text