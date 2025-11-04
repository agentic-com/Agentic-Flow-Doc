---
title: Insert Content
description: "Insert various content types into web pages using Agentic Workflow Studio browser extension for dynamic content modification and automation."
---

The **Insert Content** node provides comprehensive content insertion capabilities, allowing you to programmatically insert various types of content including text, HTML, images, media, and interactive elements into web pages with precise control and advanced manipulation options.

## How it Works

This node uses advanced DOM manipulation APIs to insert different content types at specified locations within web pages. It supports multiple insertion methods, content validation, security sanitization, and post-insertion event handling for sophisticated content modification workflows.

## Browser API Details

The node leverages multiple browser APIs for comprehensive content insertion:

### Core APIs Used

**DOM Manipulation API**
- `Element.insertAdjacentHTML()`: Insert HTML content relative to elements
- `Element.insertAdjacentElement()`: Insert element nodes
- `Element.insertAdjacentText()`: Insert text content
- `Document.createElement()`: Create new elements dynamically

**Advanced DOM API**
- `DocumentFragment`: Efficient batch content insertion
- `Range.insertNode()`: Insert content at specific positions
- `Selection.getRangeAt()`: Insert at cursor or selection
- `TreeWalker`: Navigate DOM for insertion points

**Content Processing API**
- `DOMParser`: Parse HTML content before insertion
- `XMLSerializer`: Serialize content for validation
- `TextEncoder/TextDecoder`: Handle text encoding
- `Blob/File`: Handle binary content insertion

**Event and Interaction API**
- `Event.initEvent()`: Create custom events after insertion
- `Element.dispatchEvent()`: Trigger events for inserted content
- `MutationObserver`: Monitor insertion effects
- `IntersectionObserver`: Track inserted content visibility

### Required Permissions

| Permission | Purpose | Scope |
|------------|---------|-------|
| `activeTab` | Access current tab for content insertion | Current tab only |
| `scripting` | Inject content manipulation scripts | Active tab content |
| `storage` | Cache content templates and preferences | Extension storage |
| `clipboardRead` | Read clipboard content for insertion | System clipboard |

## Configuration

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Content** | String/Object | Yes | `""` | Content to insert (text, HTML, or content object) |
| **Content Type** | String | No | `text` | Content type: `text`, `html`, `image`, `media`, `component` |
| **Target Method** | String | No | `element` | Insertion method: `element`, `cursor`, `selection`, `position` |
| **Target Selector** | String | No | `""` | CSS selector for target element |
| **Position** | String | No | `end` | Position relative to target: `start`, `end`, `before`, `after`, `replace` |
| **Validate Content** | Boolean | No | `true` | Validate content before insertion |

### Content Processing Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Sanitize HTML** | Boolean | No | `true` | Sanitize HTML content for security |
| **Allowed Tags** | Array | No | `[]` | HTML tags allowed in content |
| **Allowed Attributes** | Array | No | `[]` | HTML attributes allowed in content |
| **Security Level** | String | No | `strict` | Security level: `strict`, `moderate`, `permissive` |
| **Preserve Formatting** | Boolean | No | `true` | Preserve content formatting when possible |
| **Auto Encode** | Boolean | No | `true` | Automatically encode special characters |

### Insertion Behavior Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Replace Existing** | Boolean | No | `false` | Replace existing content instead of inserting |
| **Merge Content** | Boolean | No | `false` | Merge with existing content intelligently |
| **Trigger Events** | Boolean | No | `true` | Fire DOM events after insertion |
| **Focus After Insert** | Boolean | No | `false` | Focus inserted content after insertion |
| **Scroll Into View** | Boolean | No | `false` | Scroll inserted content into viewport |
| **Animate Insertion** | Boolean | No | `false` | Animate content appearance |

### Advanced Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Template Processing** | Boolean | No | `false` | Process content as template with variables |
| **Template Variables** | Object | No | `{}` | Variables for template processing |
| **Conditional Insertion** | Object | No | `{}` | Conditions for insertion |
| **Batch Insertion** | Boolean | No | `false` | Insert multiple content items |
| **Undo Support** | Boolean | No | `false` | Enable undo functionality |
| **Version Control** | Boolean | No | `false` | Track content versions |

### Content-Specific Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Image Options** | Object | No | `{}` | Image-specific options: `{alt: "", loading: "lazy"}` |
| **Media Options** | Object | No | `{}` | Media-specific options: `{controls: true, autoplay: false}` |
| **Link Options** | Object | No | `{}` | Link-specific options: `{target: "_blank", rel: "noopener"}` |
| **Form Options** | Object | No | `{}` | Form element options: `{required: false, validation: true}` |
| **Style Options** | Object | No | `{}` | Styling options: `{classes: [], styles: {}}` |

### Performance Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Insertion Timeout** | Number | No | `5000` | Maximum time for insertion operation |
| **Batch Size** | Number | No | `10` | Items to insert per batch |
| **Defer Rendering** | Boolean | No | `false` | Defer rendering until batch complete |
| **Optimize Performance** | Boolean | No | `true` | Apply performance optimizations |
| **Memory Management** | Boolean | No | `true` | Enable memory cleanup after insertion |

## Usage Examples

### Basic HTML Content Insertion

Insert formatted HTML content into a page:

```javascript
// Configuration for HTML insertion
{
  "content": "<div class='alert alert-success'><h3>Success!</h3><p>Your operation completed successfully.</p></div>",
  "contentType": "html",
  "targetMethod": "element",
  "targetSelector": ".notification-area",
  "position": "end",
  "sanitizeHtml": true,
  "allowedTags": ["div", "h3", "p", "span", "strong", "em"],
  "triggerEvents": true,
  "animateInsertion": true
}

// Result: Formatted success message inserted with animation
// Triggers DOM events for other scripts to respond
```

### Dynamic Template Content

Insert content using template variables:

```javascript
// Configuration for template insertion
{
  "content": "<div class='user-card'><h3>{{userName}}</h3><p>{{userRole}} since {{joinDate}}</p><img src='{{avatar}}' alt='{{userName}} avatar'></div>",
  "contentType": "html",
  "templateProcessing": true,
  "templateVariables": {
    "userName": "John Doe",
    "userRole": "Senior Developer", 
    "joinDate": "January 2020",
    "avatar": "https://example.com/avatars/john.jpg"
  },
  "targetSelector": ".team-members",
  "position": "end",
  "imageOptions": {
    "loading": "lazy",
    "width": 64,
    "height": 64
  }
}

// Result: Personalized user card with processed template variables
```

### Interactive Component Insertion

Insert interactive components with event handlers:

```javascript
// Configuration for interactive content
{
  "content": {
    "type": "component",
    "template": "<button class='interactive-btn' data-action='{{action}}'>{{label}}</button>",
    "variables": {
      "action": "subscribe",
      "label": "Subscribe to Newsletter"
    },
    "events": {
      "click": "handleSubscription",
      "mouseenter": "showTooltip"
    },
    "styles": {
      "backgroundColor": "#007bff",
      "color": "white",
      "padding": "10px 20px",
      "border": "none",
      "borderRadius": "5px"
    }
  },
  "contentType": "component",
  "targetSelector": ".cta-section",
  "position": "end",
  "triggerEvents": true,
  "focusAfterInsert": true
}

// Result: Interactive button with event handlers and styling
```

### Conditional Content Insertion

Insert content based on page conditions:

```javascript
// Configuration for conditional insertion
{
  "content": "<div class='premium-banner'><h3>Upgrade to Premium</h3><p>Unlock advanced features</p><button>Upgrade Now</button></div>",
  "contentType": "html",
  "conditionalInsertion": {
    "conditions": [
      {
        "type": "element-exists",
        "selector": ".free-user-indicator",
        "required": true
      },
      {
        "type": "element-missing",
        "selector": ".premium-banner",
        "required": true
      },
      {
        "type": "page-url",
        "pattern": "/dashboard",
        "required": true
      }
    ],
    "logic": "all" // all, any, none
  },
  "targetSelector": ".main-content",
  "position": "before"
}

// Result: Premium banner only shown to free users on dashboard
```

### Batch Content Insertion

Insert multiple content items efficiently:

```javascript
// Configuration for batch insertion
{
  "content": [
    {
      "type": "html",
      "content": "<div class='news-item'>{{title}}</div>",
      "variables": {"title": "Breaking News 1"},
      "target": ".news-feed"
    },
    {
      "type": "html", 
      "content": "<div class='news-item'>{{title}}</div>",
      "variables": {"title": "Breaking News 2"},
      "target": ".news-feed"
    },
    {
      "type": "html",
      "content": "<div class='news-item'>{{title}}</div>",
      "variables": {"title": "Breaking News 3"},
      "target": ".news-feed"
    }
  ],
  "contentType": "batch",
  "batchInsertion": true,
  "batchSize": 5,
  "deferRendering": true,
  "animateInsertion": true
}

// Result: Multiple news items inserted efficiently with batch processing
```

### Media Content Insertion

Insert media content with proper attributes:

```javascript
// Configuration for media insertion
{
  "content": {
    "type": "video",
    "src": "https://example.com/video.mp4",
    "poster": "https://example.com/poster.jpg",
    "title": "Product Demo Video"
  },
  "contentType": "media",
  "targetSelector": ".video-container",
  "position": "replace",
  "mediaOptions": {
    "controls": true,
    "autoplay": false,
    "muted": true,
    "loop": false,
    "preload": "metadata",
    "width": 800,
    "height": 450
  },
  "triggerEvents": true,
  "scrollIntoView": true
}

// Result: Video element with proper attributes and controls
```

### Form Element Insertion

Insert form elements with validation:

```javascript
// Configuration for form insertion
{
  "content": {
    "type": "form-field",
    "fieldType": "email",
    "name": "newsletter-email",
    "label": "Email Address",
    "placeholder": "Enter your email",
    "required": true
  },
  "contentType": "component",
  "targetSelector": ".newsletter-form",
  "position": "before",
  "formOptions": {
    "required": true,
    "validation": true,
    "autocomplete": "email",
    "pattern": "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
  },
  "styleOptions": {
    "classes": ["form-control", "email-input"],
    "styles": {
      "width": "100%",
      "padding": "10px",
      "marginBottom": "15px"
    }
  }
}

// Result: Email input field with validation and styling
```

## Integration Patterns

### With Content Management Systems

```javascript
// Pattern: Content creation → Processing → Insertion → Publishing
Create Content → Process Template → Insert Content → Publish Changes
```

### With Dynamic User Interfaces

```javascript
// Pattern: User action → Generate content → Insert → Update UI
User Interaction → Generate Response → Insert Content → Update State
```

### With A/B Testing Workflows

```javascript
// Pattern: Test variant → Conditional insertion → Track performance
Determine Variant → Insert Content → Track Engagement → Analyze Results
```

### With Personalization Engines

```javascript
// Pattern: User data → Personalize content → Insert → Monitor engagement
Get User Profile → Personalize Content → Insert Content → Track Interaction
```

## Advanced Content Types

### Rich Text Components

**WYSIWYG Content**
```javascript
{
  "content": {
    "type": "rich-text",
    "html": "<p>Formatted content with <strong>bold</strong> and <em>italic</em> text</p>",
    "metadata": {
      "wordCount": 8,
      "readingTime": "< 1 min",
      "language": "en"
    }
  },
  "preserveFormatting": true,
  "sanitizeHtml": true
}
```

### Interactive Widgets

**Custom Widgets**
```javascript
{
  "content": {
    "type": "widget",
    "widgetType": "countdown-timer",
    "config": {
      "endDate": "2024-12-31T23:59:59Z",
      "format": "days:hours:minutes:seconds",
      "onComplete": "showMessage"
    },
    "styling": {
      "theme": "dark",
      "size": "large"
    }
  }
}
```

### Data Visualizations

**Charts and Graphs**
```javascript
{
  "content": {
    "type": "chart",
    "chartType": "line",
    "data": {
      "labels": ["Jan", "Feb", "Mar", "Apr"],
      "datasets": [{
        "label": "Sales",
        "data": [100, 150, 120, 180]
      }]
    },
    "options": {
      "responsive": true,
      "animation": true
    }
  }
}
```

## Security Considerations

### Content Sanitization

**XSS Prevention**
- Automatic HTML sanitization by default
- Whitelist-based tag and attribute filtering
- Script tag removal and event handler sanitization
- URL validation for links and media sources

**Content Security Policy Compliance**
- Respect CSP restrictions during insertion
- Use safe DOM methods when CSP is strict
- Provide fallback methods for restricted environments
- Generate CSP-compliant content when possible

### Input Validation

**Content Validation**
```javascript
{
  "validation": {
    "maxLength": 10000,
    "allowedProtocols": ["http", "https"],
    "forbiddenPatterns": ["javascript:", "data:text/html"],
    "requireHttps": true,
    "validateUrls": true
  }
}
```

### Permission Management

**Minimal Permissions**
- Request only necessary DOM manipulation permissions
- Use content scripts with minimal privileges
- Validate insertion targets before modification
- Respect page security policies

## Performance Optimization

### Insertion Efficiency

| Content Size | Insertion Time | Memory Usage | Recommendations |
|--------------|----------------|--------------|-----------------|
| < 1KB | < 10ms | Low | Direct insertion |
| 1-10KB | 10-50ms | Moderate | Standard processing |
| 10-100KB | 50-200ms | High | Batch processing |
| > 100KB | > 200ms | Very High | Streaming insertion |

### Memory Management

**Efficient Processing**
- Use DocumentFragment for batch insertions
- Clear references after insertion completion
- Implement garbage collection for large content
- Monitor memory usage during batch operations

**DOM Optimization**
- Minimize DOM queries during insertion
- Cache element references when possible
- Use efficient insertion methods
- Batch DOM modifications

## Error Handling

### Common Insertion Errors

| Error Type | Cause | Solution |
|------------|-------|----------|
| **Target Not Found** | CSS selector doesn't match elements | Validate selector or provide fallback |
| **Invalid Content** | Malformed HTML or unsupported content | Validate and sanitize content |
| **Security Violation** | Content blocked by security policies | Adjust security settings or content |
| **Insertion Failed** | DOM manipulation blocked | Try alternative insertion methods |
| **Memory Limit** | Content too large for processing | Reduce content size or use streaming |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "type": "INSERTION_FAILED",
    "message": "Failed to insert content at specified target",
    "details": {
      "targetSelector": ".non-existent-element",
      "contentType": "html",
      "contentSize": 1024,
      "securityLevel": "strict"
    }
  },
  "partialResults": {
    "contentValidated": true,
    "targetFound": false,
    "securityPassed": true
  },
  "suggestions": [
    "Verify target selector exists",
    "Use fallback insertion method",
    "Check element visibility and accessibility"
  ]
}
```

### Success Response Format

```json
{
  "success": true,
  "insertion": {
    "contentInserted": true,
    "targetElement": "div.notification-area",
    "position": "end",
    "contentType": "html",
    "contentSize": 256,
    "insertionTime": 15
  },
  "effects": {
    "eventsTriggered": ["DOMNodeInserted", "contentInserted"],
    "styleChanges": true,
    "layoutShift": false,
    "focusChanged": false
  },
  "performance": {
    "insertionTime": 15,
    "renderTime": 8,
    "memoryUsed": 2048,
    "domNodesAdded": 3
  },
  "validation": {
    "contentSanitized": true,
    "securityPassed": true,
    "accessibilityChecked": true,
    "performanceOptimized": true
  },
  "metadata": {
    "insertionId": "ins-001",
    "timestamp": "2024-01-15T10:30:00Z",
    "undoSupported": false,
    "versionTracked": false
  }
}
```

## Best Practices

### Content Quality
1. **Validation**: Always validate content before insertion
2. **Sanitization**: Use appropriate sanitization for security
3. **Accessibility**: Ensure inserted content is accessible
4. **Performance**: Optimize content for fast rendering

### User Experience
1. **Visual Feedback**: Provide feedback during insertion
2. **Animation**: Use smooth animations for content appearance
3. **Error Handling**: Handle errors gracefully with user feedback
4. **Undo Support**: Provide undo functionality when appropriate

### Security
1. **Input Sanitization**: Sanitize all user-provided content
2. **CSP Compliance**: Respect Content Security Policy restrictions
3. **Permission Minimization**: Use minimal required permissions
4. **Validation**: Validate all insertion targets and content

### Performance
1. **Batch Operations**: Group multiple insertions for efficiency
2. **Memory Management**: Clean up resources after insertion
3. **DOM Optimization**: Minimize DOM queries and modifications
4. **Caching**: Cache frequently used content and templates

## Related Nodes

- **Insert Text**: Specialized text insertion functionality
- **Get Selected Text**: Extract text for content processing
- **Process HTML**: Process content before insertion
- **Validate Content**: Validate content quality and security
- **Template Engine**: Process dynamic content templates
- **Event Handler**: Handle events from inserted content