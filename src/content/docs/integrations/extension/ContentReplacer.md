---
title: Content Replacer
description: "Replace and modify existing content on web pages using Agentic Workflow Studio browser extension for advanced content transformation workflows."
---

The **Content Replacer** node provides comprehensive content replacement and modification capabilities, enabling sophisticated find-and-replace operations, content transformation, and selective content updates with advanced pattern matching and preservation techniques.

## How it Works

This node analyzes web page content, identifies target elements or text patterns, and replaces them with new content while preserving important structural and contextual information. It supports various replacement strategies, content validation, and rollback capabilities.

## Browser API Details

The node leverages multiple browser APIs for comprehensive content replacement:

### Core APIs Used

**DOM Manipulation API**
- `Element.replaceChild()`: Replace DOM elements
- `Node.replaceData()`: Replace text node content
- `Element.innerHTML`: Replace HTML content
- `Element.textContent`: Replace text content

**Text Processing API**
- `String.replace()`: Pattern-based text replacement
- `RegExp`: Advanced pattern matching
- `TextEncoder/TextDecoder`: Handle text encoding
- `DOMParser`: Parse replacement content

**Selection and Range API**
- `Selection.getRangeAt()`: Get content ranges for replacement
- `Range.deleteContents()`: Remove existing content
- `Range.insertNode()`: Insert replacement content
- `Range.surroundContents()`: Wrap content with new elements

**Mutation and Observation API**
- `MutationObserver`: Monitor content changes
- `IntersectionObserver`: Track replaced content visibility
- `ResizeObserver`: Monitor layout changes after replacement
- `PerformanceObserver`: Track replacement performance

### Required Permissions

| Permission | Purpose | Scope |
|------------|---------|-------|
| `activeTab` | Access current tab for content replacement | Current tab only |
| `scripting` | Inject content replacement scripts | Active tab content |
| `storage` | Store replacement patterns and history | Extension storage |
| `clipboardWrite` | Copy replaced content to clipboard | System clipboard |

## Configuration

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Target Content** | String/RegExp | Yes | `""` | Content to find and replace |
| **Replacement Content** | String | Yes | `""` | New content to insert |
| **Replacement Mode** | String | No | `text` | Mode: `text`, `html`, `element`, `attribute` |
| **Target Scope** | String | No | `page` | Scope: `page`, `selection`, `element` |
| **Target Selector** | String | No | `""` | CSS selector to limit replacement scope |
| **Case Sensitive** | Boolean | No | `false` | Case-sensitive matching |

### Pattern Matching Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Match Type** | String | No | `exact` | Match type: `exact`, `partial`, `regex`, `fuzzy` |
| **Whole Words Only** | Boolean | No | `false` | Match whole words only |
| **Multiple Matches** | Boolean | No | `true` | Replace all matches or first only |
| **Pattern Flags** | String | No | `"gi"` | RegExp flags for pattern matching |
| **Fuzzy Threshold** | Number | No | `0.8` | Similarity threshold for fuzzy matching (0-1) |
| **Context Matching** | Boolean | No | `false` | Consider surrounding context in matching |

### Replacement Strategy Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Preserve Structure** | Boolean | No | `true` | Preserve HTML structure during replacement |
| **Preserve Attributes** | Boolean | No | `true` | Preserve element attributes |
| **Preserve Styling** | Boolean | No | `true` | Preserve CSS styling |
| **Merge Content** | Boolean | No | `false` | Merge with existing content instead of replacing |
| **Smart Replacement** | Boolean | No | `true` | Use intelligent replacement strategies |
| **Maintain References** | Boolean | No | `true` | Maintain links and references |

### Content Processing Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Sanitize Content** | Boolean | No | `true` | Sanitize replacement content |
| **Validate Content** | Boolean | No | `true` | Validate content before replacement |
| **Process Templates** | Boolean | No | `false` | Process template variables in replacement |
| **Template Variables** | Object | No | `{}` | Variables for template processing |
| **Content Encoding** | String | No | `utf-8` | Text encoding for content |
| **Normalize Whitespace** | Boolean | No | `false` | Normalize whitespace in replacement |

### Advanced Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Backup Original** | Boolean | No | `true` | Backup original content for rollback |
| **Track Changes** | Boolean | No | `false` | Track all replacement changes |
| **Undo Support** | Boolean | No | `false` | Enable undo functionality |
| **Batch Processing** | Boolean | No | `false` | Process multiple replacements in batch |
| **Progressive Replacement** | Boolean | No | `false` | Replace content progressively |
| **Animation Effects** | Boolean | No | `false` | Animate content replacement |

### Validation Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Validate Before Replace** | Boolean | No | `true` | Validate target content exists |
| **Validate After Replace** | Boolean | No | `true` | Validate replacement was successful |
| **Content Integrity Check** | Boolean | No | `true` | Check content integrity after replacement |
| **Link Validation** | Boolean | No | `false` | Validate links in replacement content |
| **Accessibility Check** | Boolean | No | `false` | Check accessibility of replacement content |
| **Performance Impact** | Boolean | No | `false` | Assess performance impact of replacement |

### Error Handling Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Error Strategy** | String | No | `continue` | Error handling: `stop`, `continue`, `rollback` |
| **Max Replacements** | Number | No | `0` | Maximum number of replacements (0 = unlimited) |
| **Timeout** | Number | No | `10000` | Maximum time for replacement operation |
| **Retry Failed** | Boolean | No | `true` | Retry failed replacements |
| **Fallback Content** | String | No | `""` | Fallback content if replacement fails |

## Usage Examples

### Basic Text Replacement

Replace simple text content on a page:

```javascript
// Configuration for basic text replacement
{
  "targetContent": "Old Company Name",
  "replacementContent": "New Company Name",
  "replacementMode": "text",
  "targetScope": "page",
  "caseSensitive": false,
  "multipleMatches": true,
  "preserveStructure": true
}

// Result: All instances of "Old Company Name" replaced with "New Company Name"
// Preserves HTML structure and formatting
```

### Advanced Pattern Replacement

Use regular expressions for complex replacements:

```javascript
// Configuration for regex replacement
{
  "targetContent": "\\b\\d{3}-\\d{3}-\\d{4}\\b",
  "replacementContent": "<a href='tel:$&'>$&</a>",
  "replacementMode": "html",
  "matchType": "regex",
  "patternFlags": "g",
  "targetScope": "page",
  "sanitizeContent": true,
  "validateContent": true
}

// Result: Phone numbers converted to clickable tel: links
// Pattern: 123-456-7890 → <a href='tel:123-456-7890'>123-456-7890</a>
```

### Content Localization

Replace content for localization:

```javascript
// Configuration for localization replacement
{
  "replacements": [
    {
      "targetContent": "Welcome",
      "replacementContent": "Bienvenido",
      "context": "greeting"
    },
    {
      "targetContent": "Sign In",
      "replacementContent": "Iniciar Sesión",
      "context": "navigation"
    },
    {
      "targetContent": "Contact Us",
      "replacementContent": "Contáctanos",
      "context": "footer"
    }
  ],
  "replacementMode": "text",
  "batchProcessing": true,
  "preserveStructure": true,
  "trackChanges": true,
  "undoSupport": true
}

// Result: Page content localized to Spanish
// Changes tracked for potential rollback
```

### Dynamic Content Updates

Replace content with dynamic data:

```javascript
// Configuration for dynamic content replacement
{
  "targetContent": "{{CURRENT_DATE}}",
  "replacementContent": "{{currentDate}}",
  "processTemplates": true,
  "templateVariables": {
    "currentDate": new Date().toLocaleDateString(),
    "userName": "John Doe",
    "userRole": "Administrator"
  },
  "replacementMode": "text",
  "targetScope": "page",
  "multipleMatches": true
}

// Result: Template variables replaced with actual values
// {{CURRENT_DATE}} → January 15, 2024
```

### Selective Element Replacement

Replace content within specific elements:

```javascript
// Configuration for selective replacement
{
  "targetContent": "<span class='old-badge'>Legacy</span>",
  "replacementContent": "<span class='new-badge updated'>Updated</span>",
  "replacementMode": "html",
  "targetSelector": ".product-list .product-item",
  "targetScope": "element",
  "preserveAttributes": false,
  "sanitizeContent": true,
  "animationEffects": true
}

// Result: Legacy badges replaced with updated badges in product list
// Animated transition for visual feedback
```

### Content Enhancement

Enhance existing content with additional information:

```javascript
// Configuration for content enhancement
{
  "targetContent": "([A-Z]{2,})",
  "replacementContent": "$1 <span class='tooltip' title='{{acronymDefinition}}'>ⓘ</span>",
  "matchType": "regex",
  "replacementMode": "html",
  "processTemplates": true,
  "templateVariables": {
    "acronymDefinition": "Hover for definition"
  },
  "targetScope": "page",
  "preserveStructure": true,
  "contextMatching": true
}

// Result: Acronyms enhanced with tooltip indicators
// API → API <span class='tooltip' title='Hover for definition'>ⓘ</span>
```

### Link Transformation

Transform and update links:

```javascript
// Configuration for link transformation
{
  "targetContent": "href=\"http://",
  "replacementContent": "href=\"https://",
  "replacementMode": "attribute",
  "targetSelector": "a[href^='http://']",
  "targetScope": "element",
  "linkValidation": true,
  "preserveAttributes": true,
  "validateAfterReplace": true,
  "trackChanges": true
}

// Result: HTTP links upgraded to HTTPS
// Links validated for accessibility
```

### Content Sanitization

Clean and sanitize content:

```javascript
// Configuration for content sanitization
{
  "targetContent": "<script[^>]*>.*?</script>",
  "replacementContent": "",
  "matchType": "regex",
  "patternFlags": "gis",
  "replacementMode": "html",
  "targetScope": "page",
  "sanitizeContent": true,
  "contentIntegrityCheck": true,
  "backupOriginal": true
}

// Result: Script tags removed for security
// Original content backed up for potential restoration
```

### Responsive Content Replacement

Replace content based on viewport or device:

```javascript
// Configuration for responsive replacement
{
  "conditionalReplacements": [
    {
      "condition": "viewport.width < 768",
      "targetContent": "Download our desktop application",
      "replacementContent": "Get our mobile app"
    },
    {
      "condition": "viewport.width >= 768",
      "targetContent": "Tap here",
      "replacementContent": "Click here"
    }
  ],
  "replacementMode": "text",
  "targetScope": "page",
  "preserveStructure": true,
  "trackChanges": true
}

// Result: Content adapted for different screen sizes
// Mobile-friendly language on small screens
```

## Output Data Structure

### Replacement Results

```json
{
  "success": true,
  "replacement": {
    "totalMatches": 15,
    "successfulReplacements": 14,
    "failedReplacements": 1,
    "processingTime": 245,
    "backupCreated": true,
    "changesTracked": true
  },
  "replacements": [
    {
      "id": "repl-001",
      "originalContent": "Old Company Name",
      "replacementContent": "New Company Name",
      "element": "h1.company-title",
      "position": {
        "xpath": "/html/body/header/h1",
        "selector": "h1.company-title",
        "textOffset": 0,
        "length": 16
      },
      "success": true,
      "processingTime": 15,
      "preservedAttributes": ["class", "id"],
      "preservedStyling": true,
      "validation": {
        "beforeReplace": true,
        "afterReplace": true,
        "contentIntegrity": true,
        "accessibilityCheck": "passed"
      }
    },
    {
      "id": "repl-002",
      "originalContent": "Contact: info@oldcompany.com",
      "replacementContent": "Contact: info@newcompany.com",
      "element": "footer .contact-info",
      "position": {
        "xpath": "/html/body/footer/div/p",
        "selector": "footer .contact-info p",
        "textOffset": 9,
        "length": 20
      },
      "success": true,
      "processingTime": 12,
      "linkValidation": {
        "emailValid": true,
        "domainResolvable": true
      }
    },
    {
      "id": "repl-003",
      "originalContent": "Legacy System",
      "replacementContent": "Modern Platform",
      "element": "div.feature-list li:nth-child(3)",
      "success": false,
      "error": "Element not found after DOM change",
      "retryAttempts": 2,
      "fallbackUsed": false
    }
  ],
  "contentAnalysis": {
    "originalContentSize": 45600,
    "newContentSize": 46200,
    "sizeChange": 600,
    "structuralChanges": 0,
    "attributeChanges": 2,
    "linkChanges": 3,
    "imageChanges": 0
  },
  "performance": {
    "domQueries": 28,
    "domModifications": 14,
    "renderingTime": 85,
    "memoryUsage": 2400000,
    "layoutShifts": 0,
    "performanceScore": 92
  },
  "validation": {
    "htmlValid": true,
    "accessibilityScore": 95,
    "linkIntegrity": "all-valid",
    "contentIntegrity": "maintained",
    "seoImpact": "neutral"
  },
  "backup": {
    "created": true,
    "backupId": "backup-001",
    "timestamp": "2024-01-15T10:30:00Z",
    "size": 45600,
    "compressionRatio": 0.65,
    "restoreAvailable": true
  },
  "changeTracking": {
    "enabled": true,
    "changeId": "change-001",
    "reversible": true,
    "changeLog": [
      {
        "timestamp": "2024-01-15T10:30:15Z",
        "action": "replace",
        "element": "h1.company-title",
        "before": "Old Company Name",
        "after": "New Company Name"
      }
    ]
  },
  "errors": [
    {
      "type": "ELEMENT_NOT_FOUND",
      "replacementId": "repl-003",
      "message": "Target element became unavailable during replacement",
      "suggestion": "Use more stable selectors or retry with updated DOM"
    }
  ],
  "recommendations": [
    {
      "type": "performance",
      "description": "Consider batching similar replacements for better performance",
      "impact": "medium"
    },
    {
      "type": "accessibility",
      "description": "Verify color contrast after text replacements",
      "impact": "low"
    }
  ],
  "metadata": {
    "replacementId": "repl-session-001",
    "timestamp": "2024-01-15T10:30:00Z",
    "pageUrl": "https://example.com/page",
    "userAgent": "Chrome/120.0.0.0",
    "undoSupported": true,
    "rollbackAvailable": true
  }
}
```

## Integration Patterns

### With Content Management Systems

```javascript
// Pattern: Content update → Replace → Validate → Publish
Content Update → Content Replacer → Validate Changes → Publish Page
```

### With Localization Workflows

```javascript
// Pattern: Detect language → Load translations → Replace content → Verify
Language Detection → Load Translations → Content Replacer → Quality Check
```

### With A/B Testing

```javascript
// Pattern: Test variant → Replace content → Track performance → Analyze
Determine Variant → Content Replacer → Track Metrics → Analyze Results
```

### With SEO Optimization

```javascript
// Pattern: SEO analysis → Content optimization → Replace → Monitor
SEO Analysis → Optimize Content → Content Replacer → Monitor Rankings
```

## Advanced Features

### Intelligent Content Matching

**Context-Aware Matching**
- Semantic similarity matching
- Contextual relevance scoring
- Fuzzy string matching with configurable thresholds
- Multi-language content detection

**Smart Replacement Strategies**
- Preserve formatting and structure
- Maintain semantic meaning
- Handle nested content intelligently
- Respect content boundaries

### Batch Processing Optimization

**Efficient Batch Operations**
- Group similar replacements
- Minimize DOM queries and modifications
- Optimize rendering performance
- Reduce layout thrashing

**Progressive Enhancement**
- Incremental content replacement
- Priority-based processing
- Background processing for large operations
- User feedback during long operations

### Change Management

**Version Control**
- Track all content changes
- Maintain change history
- Enable selective rollback
- Compare content versions

**Undo/Redo Functionality**
- Full undo support for all changes
- Granular undo for specific replacements
- Redo capability for undone changes
- Change preview before application

## Performance Optimization

### Replacement Speed

| Content Size | Replacement Time | Memory Usage | Recommendations |
|--------------|------------------|--------------|-----------------|
| < 1KB | < 10ms | Low | Direct replacement |
| 1-10KB | 10-50ms | Moderate | Standard processing |
| 10-100KB | 50-200ms | High | Batch processing |
| > 100KB | > 200ms | Very High | Progressive replacement |

### Memory Management

**Efficient Processing**
- Use DocumentFragment for batch operations
- Clear references after replacement
- Implement garbage collection for large operations
- Monitor memory usage during processing

**DOM Optimization**
- Minimize DOM queries
- Cache element references
- Use efficient selectors
- Batch DOM modifications

## Error Handling

### Common Replacement Errors

| Error Type | Cause | Solution |
|------------|-------|----------|
| **Target Not Found** | Content or element doesn't exist | Verify selectors and content existence |
| **Invalid Replacement** | Malformed replacement content | Validate and sanitize replacement content |
| **Permission Denied** | Cannot modify protected content | Check content editability and permissions |
| **Memory Limit** | Operation exceeds memory limits | Use progressive replacement or reduce scope |
| **Timeout Error** | Operation takes too long | Increase timeout or optimize processing |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "type": "REPLACEMENT_FAILED",
    "message": "Failed to replace content due to validation errors",
    "details": {
      "targetContent": "Old Company Name",
      "replacementContent": "New Company Name",
      "targetSelector": ".company-title",
      "matchesFound": 0,
      "replacementsAttempted": 0
    }
  },
  "partialResults": {
    "successfulReplacements": 5,
    "failedReplacements": 1,
    "backupCreated": true,
    "rollbackAvailable": true
  },
  "suggestions": [
    "Verify target content exists on page",
    "Check CSS selector accuracy",
    "Consider using fuzzy matching for similar content"
  ]
}
```

## Best Practices

### Content Preparation
1. **Validation**: Validate both target and replacement content
2. **Sanitization**: Sanitize replacement content for security
3. **Testing**: Test replacements on sample content first
4. **Backup**: Always create backups before major replacements

### Replacement Strategy
1. **Scope Limitation**: Limit replacement scope when possible
2. **Progressive Processing**: Use progressive replacement for large operations
3. **Performance Monitoring**: Monitor performance impact of replacements
4. **Error Handling**: Implement robust error handling and recovery

### User Experience
1. **Visual Feedback**: Provide feedback during replacement operations
2. **Undo Support**: Enable undo functionality for user confidence
3. **Preview Mode**: Show preview of changes before applying
4. **Progress Tracking**: Show progress for long-running operations

### Security
1. **Content Validation**: Validate all replacement content
2. **XSS Prevention**: Prevent cross-site scripting through content
3. **Permission Checking**: Verify replacement permissions
4. **Audit Trail**: Maintain logs of all content changes

## Related Nodes

- **Get Selected Text**: Extract content for replacement analysis
- **Insert Content**: Insert new content after replacement
- **Validate Content**: Validate content before and after replacement
- **Backup Content**: Create backups before content modification
- **Search Content**: Find content patterns for replacement
- **Transform Content**: Transform content before replacement