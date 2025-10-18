---
title: Get Selected Text
description: "Extract selected text from web pages using Agentic Workflow Studio browser extension for AI processing and automation."
---

The **Get Selected Text** node allows you to capture text that a user has highlighted or selected on any web page. This is particularly useful for creating workflows that process specific content the user is interested in.

## How it Works

This node uses the browser's Selection API to access the currently selected text on the active tab. When executed, it retrieves the text content from the user's selection and makes it available for use in subsequent workflow steps.

## Browser API Details

The node leverages the following browser APIs:
- **Selection API**: `window.getSelection()` to access selected text
- **Range API**: For handling complex selections across multiple elements
- **Content Scripts**: Injected into the active tab to access page content

### Required Permissions
- `activeTab`: Access to the currently active browser tab
- `scripting`: Ability to inject content scripts

## Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Trim Whitespace | Boolean | No | Remove leading and trailing whitespace from selected text (default: true) |
| Include Formatting | Boolean | No | Preserve basic formatting information (default: false) |
| Max Length | Number | No | Maximum number of characters to extract (default: unlimited) |

### Output Data

The node outputs an object containing:

```json
{
  "selectedText": "The actual selected text content",
  "length": 42,
  "isEmpty": false,
  "selectionRange": {
    "startOffset": 10,
    "endOffset": 52
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Basic Text Extraction

Extract selected text for further processing:

```javascript
// Workflow: Selected text → AI analysis
// 1. User selects text on webpage
// 2. Get Selected Text node captures: "Climate change affects global weather patterns"
// 3. Pass to AI node for sentiment analysis or summarization
```

### Content Validation Workflow

Validate selected content against specific criteria:

```javascript
// Workflow: Text selection → validation → action
// 1. Get Selected Text captures user selection
// 2. Check if text contains email addresses or phone numbers
// 3. If valid contact info found, save to CRM system
```

### Translation Workflow

Translate selected text to different languages:

```javascript
// Workflow: Select text → detect language → translate
// 1. User selects foreign text: "Bonjour le monde"
// 2. Get Selected Text captures the selection
// 3. Language detection identifies French
// 4. Translation service converts to "Hello world"
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

- **Get All Text**: Extract all text content from a page
- **Get HTML of Selected Text**: Get HTML markup of selected content
- **Replace Selected Text**: Modify the selected text on the page
- **Highlight Selected Text**: Add visual highlighting to selections