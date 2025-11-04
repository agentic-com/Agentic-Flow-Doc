---
title: Insert Text
description: "Insert text content into web pages using Agentic Workflow Studio browser extension for dynamic content modification and automation."
---

The **Insert Text** node allows you to programmatically insert text content into web pages at specific locations, enabling dynamic content modification, form filling, and interactive web automation workflows.

## How it Works

This node uses browser DOM manipulation APIs to insert text content at specified locations within web pages. It can target specific elements, cursor positions, or user-selected areas, providing flexible text insertion capabilities for various automation scenarios.

## Browser API Details

The node leverages multiple browser APIs for comprehensive text insertion:

### Core APIs Used

**DOM Manipulation API**
- `Element.insertAdjacentText()`: Insert text relative to elements
- `Element.textContent`: Set or append text content to elements
- `Element.innerHTML`: Insert formatted text with HTML (when safe)
- `Document.createTextNode()`: Create text nodes for insertion

**Selection and Range API**
- `Selection.getRangeAt()`: Get current cursor position for insertion
- `Range.insertNode()`: Insert text at specific range positions
- `Range.collapse()`: Position cursor after insertion
- `Selection.removeAllRanges()`: Clear selections after insertion

**Input Element API**
- `HTMLInputElement.setSelectionRange()`: Position cursor in input fields
- `HTMLTextAreaElement.value`: Set text content in form fields
- `HTMLElement.focus()`: Focus elements before text insertion
- `Document.execCommand()`: Legacy text insertion (fallback)

**Event Simulation API**
- `Event.initEvent()`: Create input events for form compatibility
- `Element.dispatchEvent()`: Trigger change events after insertion
- `KeyboardEvent`: Simulate typing for enhanced compatibility
- `InputEvent`: Notify applications of text changes

### Required Permissions

| Permission | Purpose | Scope |
|------------|---------|-------|
| `activeTab` | Access currently active browser tab | Current tab only |
| `scripting` | Inject content scripts for DOM manipulation | Active tab content |
| `storage` | Store insertion preferences and history | Extension storage |

### Browser Compatibility

| Browser | Version | DOM API | Selection API | Input Events | Notes |
|---------|---------|---------|---------------|--------------|-------|
| Chrome | 88+ | ✅ Full | ✅ Full | ✅ Full | Recommended platform |
| Firefox | 85+ | ✅ Full | ✅ Full | ✅ Full | Full compatibility |
| Edge | 88+ | ✅ Full | ✅ Full | ✅ Full | Chromium-based |
| Safari | 14+ | ⚠️ Limited | ⚠️ Limited | ⚠️ Limited | Some restrictions |

## Configuration

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Text Content** | String | Yes | `""` | The text content to insert |
| **Target Method** | String | No | `cursor` | Insertion method: `cursor`, `element`, `selection`, `append` |
| **Target Selector** | String | No | `""` | CSS selector for target element (when method is `element`) |
| **Position** | String | No | `end` | Position relative to target: `start`, `end`, `before`, `after` |
| **Replace Selection** | Boolean | No | `false` | Replace selected text instead of inserting |
| **Trigger Events** | Boolean | No | `true` | Fire input/change events after insertion |
| **Focus Target** | Boolean | No | `true` | Focus target element before insertion |
| **Preserve Formatting** | Boolean | No | `false` | Maintain text formatting when possible |

### Advanced Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Insert Method** | String | No | `textContent` | DOM method: `textContent`, `innerHTML`, `insertAdjacentText` |
| **Safety Mode** | String | No | `strict` | HTML safety: `strict`, `moderate`, `permissive` |
| **Typing Simulation** | Boolean | No | `false` | Simulate human typing with delays |
| **Typing Speed** | Number | No | `50` | Milliseconds between characters (when simulating) |
| **Character Encoding** | String | No | `utf-8` | Text encoding for special characters |
| **Line Break Handling** | String | No | `preserve` | Line breaks: `preserve`, `convert`, `remove` |
| **Whitespace Handling** | String | No | `normalize` | Whitespace: `preserve`, `normalize`, `trim` |

### Form-Specific Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Form Field Type** | String | No | `auto` | Field type: `auto`, `text`, `textarea`, `contenteditable` |
| **Clear Before Insert** | Boolean | No | `false` | Clear existing content before insertion |
| **Validate Input** | Boolean | No | `true` | Validate against field constraints |
| **Submit After Insert** | Boolean | No | `false` | Automatically submit form after insertion |
| **Tab to Next Field** | Boolean | No | `false` | Move to next form field after insertion |

### Security Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Sanitize HTML** | Boolean | No | `true` | Remove potentially dangerous HTML content |
| **Allowed Tags** | Array | No | `[]` | HTML tags allowed when using innerHTML |
| **Max Length** | Number | No | `10000` | Maximum characters to insert |
| **Content Validation** | Boolean | No | `true` | Validate content against security policies |

## Usage Examples

### Basic Text Insertion at Cursor

Insert text at the current cursor position:

```javascript
// Configuration
{
  "textContent": "Hello, World!",
  "targetMethod": "cursor",
  "triggerEvents": true,
  "focusTarget": true
}

// User places cursor in text field, workflow inserts text
// Result: Text appears at cursor position with proper events fired
```

### Form Field Population

Automatically fill form fields with data:

```javascript
// Configuration for form filling
{
  "textContent": "john.doe@example.com",
  "targetMethod": "element",
  "targetSelector": "input[type='email']",
  "clearBeforeInsert": true,
  "validateInput": true,
  "tabToNextField": true
}

// Workflow: Data source → Insert Text → Validate → Next field
// Automatically fills email field and moves to next form element
```

### Content Replacement Workflow

Replace selected text with processed content:

```javascript
// Configuration for text replacement
{
  "textContent": "Processed and enhanced content...",
  "targetMethod": "selection",
  "replaceSelection": true,
  "preserveFormatting": true,
  "triggerEvents": true
}

// User selects text → AI processing → Insert Text replaces selection
// Original: "rough draft text"
// Result: "Processed and enhanced content..."
```

### Dynamic Content Insertion

Insert dynamic content into specific page elements:

```javascript
// Configuration for dynamic insertion
{
  "textContent": "Updated: 2024-01-15 - New data available",
  "targetMethod": "element",
  "targetSelector": ".status-message",
  "position": "end",
  "insertMethod": "innerHTML",
  "safetyMode": "strict"
}

// Workflow: Data update → Format message → Insert Text → Notify users
// Dynamically updates status messages on web pages
```

### Simulated Human Typing

Insert text with realistic typing simulation:

```javascript
// Configuration for human-like typing
{
  "textContent": "This text will appear as if typed by a human",
  "targetMethod": "cursor",
  "typingSimulation": true,
  "typingSpeed": 75, // Realistic typing speed
  "triggerEvents": true,
  "focusTarget": true
}

// Useful for:
// - Bypassing bot detection systems
// - Creating realistic demonstrations
// - Testing user interfaces with natural input
```

### Multi-Field Form Automation

Complete form filling workflow:

```javascript
// Configuration for comprehensive form filling
{
  "fields": [
    {
      "textContent": "John Doe",
      "targetSelector": "input[name='fullName']",
      "clearBeforeInsert": true
    },
    {
      "textContent": "john.doe@example.com", 
      "targetSelector": "input[name='email']",
      "validateInput": true
    },
    {
      "textContent": "This is a detailed message about the inquiry...",
      "targetSelector": "textarea[name='message']",
      "typingSimulation": true,
      "typingSpeed": 60
    }
  ],
  "submitAfterInsert": false,
  "validateAllFields": true
}

// Workflow: User data → Process fields → Insert Text (multiple) → Validate → Submit
```

### Content Enhancement Workflow

Enhance existing page content with AI-generated text:

```javascript
// Configuration for content enhancement
{
  "textContent": "\n\n[AI Enhancement]: This section provides additional context and insights based on the latest research in the field...",
  "targetMethod": "element",
  "targetSelector": "article p:last-child",
  "position": "after",
  "preserveFormatting": true,
  "insertMethod": "insertAdjacentText"
}

// Workflow: Page analysis → AI enhancement → Insert Text → Style formatting
// Adds AI-generated insights to existing articles
```

## Integration Patterns

### With Data Processing Nodes

```javascript
// Pattern: Data transformation → text insertion
Data Source → Process Data → Format Text → Insert Text → Validate Result
```

### With AI Content Generation

```javascript
// Pattern: AI-powered content creation
User Input → AI Agent → Content Generation → Insert Text → User Review
```

### With Form Automation

```javascript
// Pattern: Automated form completion
Data Extraction → Field Mapping → Insert Text (Multiple) → Validation → Submit
```

### With Content Management

```javascript
// Pattern: Dynamic content updates
Content Source → Template Processing → Insert Text → Style Application → Publish
```

## Security Considerations

### HTML Injection Prevention

**Strict Mode (Default)**
- All HTML tags are stripped from input
- Only plain text content is inserted
- Prevents XSS and injection attacks

**Moderate Mode**
- Allows safe HTML tags: `<b>`, `<i>`, `<em>`, `<strong>`
- Removes dangerous attributes and scripts
- Suitable for formatted text insertion

**Permissive Mode**
- Allows specified HTML tags from `allowedTags` parameter
- Requires careful configuration
- Use only with trusted content sources

### Content Validation

**Input Sanitization**
```javascript
// Automatic sanitization process:
// 1. Remove script tags and event handlers
// 2. Validate against maximum length limits
// 3. Check for malicious patterns
// 4. Encode special characters when needed
```

**CSP Compliance**
- Respects Content Security Policy restrictions
- Uses safe DOM methods when CSP is strict
- Provides fallback methods for restricted environments

### Privacy Protection

**Data Handling**
- Text content is processed locally in browser
- No automatic transmission of inserted content
- User consent required for sensitive data insertion

**Form Security**
- Validates form field constraints before insertion
- Respects form validation rules
- Maintains form security tokens and CSRF protection

## Error Handling

### Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| Target Not Found | CSS selector doesn't match any elements | Verify selector or use fallback target |
| Permission Denied | Content script injection blocked | Check site permissions and CSP |
| Invalid Content | Text contains prohibited characters | Enable content sanitization |
| Form Validation Failed | Text doesn't meet field requirements | Validate content before insertion |
| Insertion Blocked | Site prevents DOM modification | Try alternative insertion methods |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "type": "TARGET_NOT_FOUND",
    "message": "No element found matching selector 'input[name=\"email\"]'",
    "details": {
      "selector": "input[name=\"email\"]",
      "method": "element",
      "pageUrl": "https://example.com/form"
    }
  },
  "fallbackOptions": [
    "Try generic input selector",
    "Use cursor insertion method",
    "Manual user selection required"
  ]
}
```

## Performance Optimization

### Insertion Speed

| Content Size | Processing Time | Recommendations |
|--------------|----------------|-----------------|
| < 100 chars | < 10ms | No optimization needed |
| 100-1000 chars | 10-50ms | Consider batching for multiple insertions |
| 1000-5000 chars | 50-200ms | Use typing simulation sparingly |
| > 5000 chars | > 200ms | Split into chunks or use batch insertion |

### Memory Management

**DOM Reference Handling**
- Clear element references after insertion
- Use WeakMap for temporary element storage
- Avoid memory leaks in long-running workflows

**Event Listener Cleanup**
- Remove temporary event listeners after insertion
- Use AbortController for event cleanup
- Monitor memory usage in complex workflows

## Best Practices

### User Experience
1. **Visual Feedback**: Provide clear indication when text is being inserted
2. **Undo Support**: Allow users to undo automatic insertions
3. **Progress Indication**: Show progress for large text insertions
4. **Error Recovery**: Provide clear error messages and recovery options

### Content Quality
1. **Validation**: Always validate content before insertion
2. **Formatting**: Preserve appropriate text formatting
3. **Encoding**: Handle special characters and unicode properly
4. **Length Limits**: Respect form field and content length restrictions

### Security
1. **Sanitization**: Always sanitize HTML content in permissive mode
2. **Validation**: Validate against site security policies
3. **Permissions**: Request minimal necessary permissions
4. **Audit Trail**: Log insertion activities for security review

### Performance
1. **Batching**: Group multiple insertions for efficiency
2. **Caching**: Cache DOM queries for repeated insertions
3. **Throttling**: Limit insertion frequency to prevent blocking
4. **Cleanup**: Clean up resources after insertion completion

## Related Nodes

### Text Extraction for Processing
- **[Get Selected Text](/integration/extension/GetSelectedText/)**: Extract text for processing before insertion
- **[Get All Text](/integration/extension/GetAllText/)**: Extract page content for content enhancement workflows

### Content Manipulation
- **[Content Replacer](/integration/extension/ContentReplacer/)**: Advanced text replacement with pattern matching
- **[Insert Content](/integration/extension/InsertContent/)**: Insert various content types beyond plain text
- **[Form Filler](/integration/extension/FormFiller/)**: Specialized form filling automation

### Data Processing
- **[Edit Fields](/integration/builtin/dataTransformation/EditFields/)**: Process and format text before insertion
- **[AI Agent](/integration/builtin/ai/AIAgents/BasicLLMChainNode/)**: Generate content with AI before insertion

### Form Automation
- **[HTTP Request](/integration/builtin/core/Http-Request/)**: Submit forms after completion
- **[Filter](/integration/builtin/flow/Filter/)**: Validate form data after text insertion

### Common Workflow Patterns
- **AI Content Generation**: [AI Agent](/integration/builtin/ai/AIAgents/BasicLLMChainNode/) → InsertText → [Validation](/integration/builtin/flow/Filter/)
- **Form Automation**: [Data Source](/integration/builtin/dataTransformation/EditFields/) → InsertText → [Submit Form](/integration/builtin/core/Http-Request/)
- **Content Enhancement**: [Get Selected Text](/integration/extension/GetSelectedText/) → [AI Processing](/advanced-ai/examples/intelligent-content-analysis/) → InsertText

### Learning Resources
- **[Form Automation Tutorial](/learning/text-courses/intermediate/multi-step-workflows/)**: Learn automated form filling
- **[Content Manipulation Patterns](/learning/workflow-patterns/content-manipulation-patterns/)**: Advanced text insertion techniques
- **[AI Form Automation](/advanced-ai/examples/ai-form-automation/)**: Using AI for intelligent form completion