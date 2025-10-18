---
title: Text Extraction Node Comparison Guide
description: "Compare different text extraction methods and choose the right approach for your workflow needs."
---

This guide helps you choose the most appropriate text extraction node for your specific use case by comparing capabilities, performance, and ideal scenarios for each option.

## Text Extraction Nodes Overview

Agentic Workflow Studio provides several nodes for extracting text content from web pages, each optimized for different scenarios and use cases.

| Node | Purpose | User Interaction | Content Scope | Best For |
|------|---------|------------------|---------------|----------|
| **[Get Selected Text](/integration/extension/GetSelectedText/)** | Extract user-selected text | Required | User selection only | Focused analysis, user-driven workflows |
| **[Get All Text](/integration/extension/GetAllText/)** | Extract all page text | None | Entire page | Comprehensive analysis, monitoring |
| **[Get HTML of Selected Text](/integration/extension/GetHTMLofSelectedText/)** | Extract HTML from selection | Required | User selection with formatting | Formatted content, structure preservation |
| **[Get All HTML](/integration/extension/GetAllHTML/)** | Extract complete HTML | None | Entire page structure | Full page analysis, archiving |

## Detailed Comparison

### Get Selected Text vs Get All Text

#### When to Use Get Selected Text
**Ideal Scenarios**:
- User wants to analyze specific content they're interested in
- Processing focused excerpts from long articles
- Interactive workflows where user choice matters
- Quality over quantity - analyzing meaningful selections

**Advantages**:
- ✅ User controls what content is processed
- ✅ Smaller data size for faster processing
- ✅ More relevant content for analysis
- ✅ Better user engagement and control

**Limitations**:
- ❌ Requires user interaction to select text
- ❌ Cannot automate without user input
- ❌ May miss important context outside selection
- ❌ Inconsistent data size depending on selection

**Example Use Cases**:
```javascript
// Research workflow: User selects key findings
Get Selected Text → AI Analysis → Citation Generator → Save to Research Database

// Content enhancement: User selects text to improve
Get Selected Text → AI Enhancement → Insert Text → User Review
```

#### When to Use Get All Text
**Ideal Scenarios**:
- Automated content monitoring and analysis
- Comprehensive page analysis without user input
- Batch processing multiple pages
- SEO analysis and content auditing

**Advantages**:
- ✅ Fully automated - no user interaction needed
- ✅ Consistent, complete content extraction
- ✅ Ideal for monitoring and batch processing
- ✅ Captures all available text content

**Limitations**:
- ❌ May include irrelevant content (navigation, ads)
- ❌ Larger data size may impact performance
- ❌ Less focused analysis due to content volume
- ❌ May exceed processing limits on large pages

**Example Use Cases**:
```javascript
// Content monitoring: Check for changes
Get All Text → Compare with Previous → Detect Changes → Send Alert

// SEO analysis: Analyze complete page content
Get All Text → Keyword Analysis → Readability Check → SEO Report
```

### HTML vs Text Extraction

#### When to Choose HTML Extraction
**Get HTML of Selected Text** or **Get All HTML** when you need:

**Structure Preservation**:
- Maintaining formatting (bold, italic, links)
- Preserving document hierarchy (headings, lists)
- Keeping link relationships and references
- Analyzing content structure and organization

**Advanced Processing**:
- Converting to other formats (Markdown, PDF)
- Extracting specific HTML elements
- Analyzing page structure and SEO elements
- Preserving metadata and attributes

**Example Scenarios**:
```javascript
// Content archiving with formatting
Get All HTML → Clean HTML → Convert to Markdown → Save Archive

// Link analysis with context
Get HTML of Selected Text → Extract Links → Analyze Context → Generate Report
```

#### When to Choose Text Extraction
**Get Selected Text** or **Get All Text** when you need:

**Clean Content Analysis**:
- AI processing (LLMs work better with clean text)
- Word count and readability analysis
- Translation and language processing
- Simple content comparison

**Performance Optimization**:
- Faster processing with smaller data size
- Reduced memory usage
- Simpler data structures
- Better compatibility with text-based tools

**Example Scenarios**:
```javascript
// AI content analysis
Get All Text → AI Summarization → Key Points → Generate Insights

// Translation workflow
Get Selected Text → Language Detection → Translation API → Insert Text
```

## Decision Tree

Use this decision tree to quickly choose the right text extraction approach:

```
Start: What type of content extraction do you need?

├── User-Selected Content
│   ├── Need Formatting/Structure?
│   │   ├── Yes → Get HTML of Selected Text
│   │   └── No → Get Selected Text
│   └── Automated Processing?
│       └── No → Get Selected Text (requires user interaction)
│
└── Complete Page Content
    ├── Need Formatting/Structure?
    │   ├── Yes → Get All HTML
    │   └── No → Get All Text
    ├── Performance Critical?
    │   ├── Yes → Get All Text (smaller, faster)
    │   └── No → Either option works
    └── AI Processing?
        ├── Yes → Get All Text (cleaner for AI)
        └── No → Get All HTML (more complete)
```

## Performance Comparison

### Processing Speed

| Node | Small Pages (<50KB) | Medium Pages (50-200KB) | Large Pages (>200KB) |
|------|-------------------|------------------------|-------------------|
| **Get Selected Text** | ~10ms | ~15ms | ~20ms |
| **Get All Text** | ~50ms | ~150ms | ~500ms+ |
| **Get HTML of Selected Text** | ~15ms | ~25ms | ~35ms |
| **Get All HTML** | ~100ms | ~300ms | ~1000ms+ |

### Memory Usage

| Node | Typical Memory | Peak Memory | Recommendations |
|------|---------------|-------------|-----------------|
| **Get Selected Text** | Low (1-10KB) | Moderate | No special considerations |
| **Get All Text** | Moderate (10-100KB) | High | Set max length limits |
| **Get HTML of Selected Text** | Low-Moderate (2-20KB) | Moderate | Monitor selection size |
| **Get All HTML** | High (50KB-1MB+) | Very High | Use exclude selectors |

### Browser Compatibility

| Node | Chrome | Firefox | Edge | Safari | Notes |
|------|--------|---------|------|--------|-------|
| **Get Selected Text** | ✅ Full | ✅ Full | ✅ Full | ⚠️ Limited | Selection API limitations |
| **Get All Text** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | Best compatibility |
| **Get HTML of Selected Text** | ✅ Full | ✅ Full | ✅ Full | ⚠️ Limited | Range API limitations |
| **Get All HTML** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | Universal support |

## Common Workflow Patterns

### Pattern 1: User-Driven Analysis
**Scenario**: User selects content for AI analysis

```javascript
Workflow: Interactive Content Analysis
├── Get Selected Text (user selects interesting content)
├── AI Agent (analyze selected content)
├── Edit Fields (format results)
└── Insert Text (show insights on page)

Best Choice: Get Selected Text
Reason: User engagement and focused analysis
```

### Pattern 2: Automated Monitoring
**Scenario**: Monitor web pages for content changes

```javascript
Workflow: Content Change Detection
├── Get All Text (capture complete page state)
├── Filter (compare with previous version)
├── Edit Fields (identify changes)
└── HTTP Request (send alert if changes detected)

Best Choice: Get All Text
Reason: Automated, comprehensive monitoring
```

### Pattern 3: Content Enhancement
**Scenario**: Improve existing web content with AI

```javascript
Workflow: AI Content Enhancement
├── Get HTML of Selected Text (preserve formatting)
├── AI Agent (enhance content while keeping structure)
├── Content Replacer (replace with enhanced version)
└── Highlight changes for user review

Best Choice: Get HTML of Selected Text
Reason: Structure preservation for enhancement
```

### Pattern 4: Research Data Collection
**Scenario**: Collect research data from multiple sources

```javascript
Workflow: Research Data Collection
├── Navigate to Link (visit research sources)
├── Get All Text (extract complete content)
├── AI Agent (extract key findings)
├── Edit Fields (structure data)
└── Download as File (save to research database)

Best Choice: Get All Text
Reason: Comprehensive, automated data collection
```

## Troubleshooting Guide

### Common Issues and Solutions

#### "No text extracted" Error
**Possible Causes**:
- Page hasn't fully loaded
- Content is in iframes or shadow DOM
- Text is generated by JavaScript after page load

**Solutions by Node**:
- **Get Selected Text**: Ensure user has selected text before workflow execution
- **Get All Text**: Add wait time for dynamic content loading
- **HTML Extraction**: Check for content in iframes or shadow DOM

#### Performance Issues
**Symptoms**: Slow extraction, browser freezing, memory errors

**Solutions**:
- **Large Pages**: Use `maxLength` parameter to limit extraction
- **Get All Text**: Add exclude selectors for navigation, ads, footers
- **HTML Extraction**: Use content area selectors to focus on main content

#### Inconsistent Results
**Symptoms**: Different results on same page, missing content

**Solutions**:
- **Dynamic Content**: Add delays for JavaScript-generated content
- **Selection-Based**: Provide clear user instructions for text selection
- **Cross-Browser**: Test workflows across different browsers

## Best Practices Summary

### Choosing the Right Node
1. **User Interaction**: If users need to choose content → Get Selected Text
2. **Automation**: If fully automated → Get All Text or Get All HTML
3. **AI Processing**: If using AI models → prefer text extraction (cleaner input)
4. **Structure Needed**: If formatting matters → HTML extraction
5. **Performance Critical**: If speed matters → text extraction (smaller data)

### Optimization Tips
1. **Set Limits**: Always configure reasonable length limits for large pages
2. **Use Filters**: Exclude unnecessary content with CSS selectors
3. **Cache Results**: Store extracted content to avoid re-processing
4. **Monitor Performance**: Track extraction times and optimize accordingly
5. **Handle Errors**: Implement fallbacks for extraction failures

### Security Considerations
1. **Content Validation**: Validate extracted content before processing
2. **Size Limits**: Prevent memory issues with reasonable size limits
3. **Sanitization**: Clean HTML content when using innerHTML methods
4. **Privacy**: Be transparent about what content is being extracted

## Related Resources

### Documentation
- **[Get Selected Text](/integration/extension/GetSelectedText/)** - Detailed node documentation
- **[Get All Text](/integration/extension/GetAllText/)** - Complete feature reference
- **[Performance Optimization](/learning/workflow-patterns/optimization-best-practices/)** - Workflow optimization guide

### Learning Materials
- **[Text Extraction Tutorial](/learning/text-courses/beginner/first-workflow/)** - Hands-on learning
- **[Content Manipulation Patterns](/learning/workflow-patterns/content-manipulation-patterns/)** - Advanced techniques
- **[Workflow Debugging](/learning/text-courses/intermediate/workflow-debugging/)** - Troubleshooting guide