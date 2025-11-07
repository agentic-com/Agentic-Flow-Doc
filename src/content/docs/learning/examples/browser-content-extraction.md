---
title: Complete Web Content Extraction Workflow
description: "Master browser content extraction techniques with `Agentic WorkFlow` extension through practical examples and tutorials."
sidebar:
  order: 1
difficulty: "🌱 beginner"
---

# Complete Web Content Extraction Workflow

This comprehensive example demonstrates how to build a sophisticated browser workflow that extracts various types of content from web pages and processes it intelligently.

## Workflow Overview

This workflow combines multiple browser extension nodes to:
1. Extract text content from user-selected areas
2. Gather all links and images from the current page
3. Process and filter the extracted content
4. Generate a structured summary of the web page

## Required Browser Extension Nodes

- **GetSelectedText**: Extract text from user selection
- **GetAllText**: Extract all text content from the page
- **GetAllLinks**: Collect all links on the page
- **GetAllImages**: Gather all images from the page
- **Filter**: Process and filter extracted data
- **Edit Fields**: Structure the final output

## Step-by-Step Implementation

### Step 1: Initial Content Extraction

Start by setting up parallel extraction of different content types:

```javascript
// Workflow begins when user triggers the browser extension
// Multiple extraction nodes run in parallel for efficiency

// Node 1: GetSelectedText
{
  "node": "GetSelectedText",
  "parameters": {
    "includeFormatting": true,
    "trimWhitespace": true
  }
}

// Node 2: GetAllLinks
{
  "node": "GetAllLinks",
  "parameters": {
    "includeInternal": true,
    "includeExternal": true,
    "filterByDomain": false
  }
}

// Node 3: GetAllImages
{
  "node": "GetAllImages",
  "parameters": {
    "includeAltText": true,
    "includeDimensions": true,
    "filterBySize": false
  }
}
```

### Step 2: Content Processing and Filtering

Process the extracted content to remove noise and focus on valuable information:

```javascript
// Filter links to remove common navigation and footer links
{
  "node": "Filter",
  "parameters": {
    "conditions": {
      "linkText": {
        "not_contains": ["Home", "Contact", "Privacy", "Terms"]
      },
      "href": {
        "not_contains": ["javascript:", "mailto:", "#"]
      }
    }
  }
}

// Filter images to focus on content images
{
  "node": "Filter",
  "parameters": {
    "conditions": {
      "width": { "greater_than": 100 },
      "height": { "greater_than": 100 },
      "alt": { "not_empty": true }
    }
  }
}
```

### Step 3: Content Analysis and Structuring

Analyze the extracted content and create a structured output:

```javascript
// Analyze selected text for key information
{
  "node": "Edit Fields",
  "parameters": {
    "fields": {
      "selectedText": "{{ $node['GetSelectedText'].json.text }}",
      "wordCount": "{{ $node['GetSelectedText'].json.text.split(' ').length }}",
      "hasKeywords": "{{ $node['GetSelectedText'].json.text.toLowerCase().includes('important') }}"
    }
  }
}

// Create summary of page content
{
  "node": "Edit Fields",
  "parameters": {
    "fields": {
      "pageTitle": "{{ $node['GetAllText'].json.title }}",
      "totalLinks": "{{ $node['Filter_Links'].json.length }}",
      "contentImages": "{{ $node['Filter_Images'].json.length }}",
      "extractedAt": "{{ new Date().toISOString() }}",
      "pageUrl": "{{ $node['GetSelectedText'].json.url }}"
    }
  }
}
```

## Advanced Workflow Patterns

### Conditional Content Processing

Use IF nodes to handle different types of web pages:

```javascript
// Check if page has substantial content
{
  "node": "IF",
  "parameters": {
    "conditions": {
      "textLength": "{{ $node['GetAllText'].json.text.length > 1000 }}"
    }
  }
}

// Route to detailed analysis for content-rich pages
// Route to simple extraction for minimal content pages
```

### Error Handling for Browser Constraints

Handle common browser extension limitations:

```javascript
// Handle cases where content extraction fails
{
  "node": "IF",
  "parameters": {
    "conditions": {
      "hasContent": "{{ $node['GetSelectedText'].json.text !== undefined }}"
    }
  }
}

// Fallback to full page text if selection fails
{
  "node": "GetAllText",
  "parameters": {
    "fallbackMode": true
  }
}
```

## Real-World Use Cases

### Research Content Aggregation

Perfect for researchers who need to:
- Extract key quotes and citations from academic papers
- Collect relevant links for further investigation
- Gather supporting images and diagrams
- Create structured research notes

### Content Marketing Analysis

Ideal for marketers analyzing competitor content:
- Extract headline and key messaging
- Analyze link structure and SEO elements
- Collect visual content for inspiration
- Generate competitive analysis reports

### Web Development Auditing

Useful for developers auditing websites:
- Extract all links to check for broken URLs
- Analyze image optimization opportunities
- Review content structure and organization
- Generate technical content reports

## Browser Security Considerations

When implementing this workflow, be aware of:

- **Cross-Origin Restrictions**: Some content may not be accessible due to CORS policies
- **Dynamic Content**: JavaScript-loaded content may require additional handling
- **Rate Limiting**: Avoid overwhelming websites with rapid extraction requests
- **Privacy**: Ensure extracted content handling complies with privacy requirements

## Performance Optimization Tips

1. **Parallel Execution**: Run extraction nodes simultaneously when possible
2. **Selective Extraction**: Only extract content types you actually need
3. **Content Filtering**: Filter early to reduce processing overhead
4. **Batch Processing**: Group similar operations together

## Extending the Workflow

This basic pattern can be extended with:
- **AI Analysis**: Add LangChain nodes to analyze extracted content
- **Data Export**: Save results to external services or local files
- **Notification Systems**: Alert users when specific content is found
- **Automated Actions**: Trigger follow-up workflows based on content analysis

## Troubleshooting Common Issues

### No Content Extracted
- Verify the page has finished loading
- Check if content is within an iframe
- Ensure proper browser permissions are granted

### Partial Content Missing
- Some elements may be dynamically loaded
- Try adding a small delay before extraction
- Check for content security policy restrictions

### Performance Issues
- Reduce the scope of content extraction
- Filter content earlier in the workflow
- Consider processing content in smaller chunks

This comprehensive workflow example demonstrates the power of combining multiple browser extension nodes to create sophisticated web content analysis automation.