---
title: "Data Flow Basics"
description: "Understanding how data moves between nodes in browser workflows with visual examples and practical demonstrations."
---

# Data Flow Basics

Understanding how data flows between nodes is fundamental to creating effective browser automation workflows. This tutorial explains data structures, transformation patterns, and debugging techniques with visual examples.

## What You'll Learn

By the end of this tutorial, you'll understand:
- How data moves between workflow nodes
- Common data structures in browser automation
- Data transformation and processing patterns
- Debugging data flow issues
- Best practices for efficient data handling

## Prerequisites

- Completed [Your First Workflow](/learning/text-courses/beginner/first-workflow/)
- Basic understanding of JSON data structures
- Familiarity with browser extension nodes

## Understanding Data Flow Concepts

### Node-Based Data Processing

In Agentic Workflow Studio, data flows through a network of connected nodes:

```
Input Data → Node 1 → Transformed Data → Node 2 → Final Output
```

Each node:
- **Receives** data from previous nodes
- **Processes** the data according to its configuration
- **Outputs** transformed data to the next nodes

### Data Structure Fundamentals

**Basic Data Types:**
- **String:** Text content extracted from web pages
- **Object:** Structured data with properties
- **Array:** Lists of items (links, images, text blocks)
- **Boolean:** True/false values for conditions
- **Number:** Counts, measurements, calculations

**Example data flow:**
```javascript
// Input: Raw text selection
"Hello World! This is a sample text."

// After GetSelectedText node:
{
  "selectedText": "Hello World! This is a sample text.",
  "context": "...surrounding text...",
  "element": { "tagName": "P", "className": "content" },
  "position": { "start": 0, "end": 37 }
}

// After EditFields processing:
{
  "selectedText": "Hello World! This is a sample text.",
  "cleanedText": "Hello World This is a sample text",
  "wordCount": 7,
  "extractedAt": "2024-01-15T10:30:45.123Z",
  "context": "...surrounding text...",
  "element": { "tagName": "P", "className": "content" }
}
```

## Visual Data Flow Examples

### Example 1: Simple Text Processing

Let's trace data through a simple text extraction workflow:

**Workflow Structure:**
```
GetSelectedText → EditFields → Filter → DownloadAsFile
```

**Step-by-step data transformation:**

1. **GetSelectedText Output:**
   ```json
   {
     "selectedText": "The quick brown fox jumps over the lazy dog.",
     "context": "This is a sample paragraph. The quick brown fox jumps over the lazy dog. It contains all letters of the alphabet.",
     "element": {
       "tagName": "P",
       "id": "sample-text",
       "className": "demo-paragraph"
     },
     "position": {
       "start": 26,
       "end": 70
     }
   }
   ```

2. **EditFields Processing:**
   ```json
   {
     "selectedText": "The quick brown fox jumps over the lazy dog.",
     "wordCount": 9,
     "characterCount": 44,
     "hasNumbers": false,
     "extractedAt": "2024-01-15T10:30:45.123Z",
     "source": "demo-paragraph",
     "context": "This is a sample paragraph. The quick brown fox jumps over the lazy dog. It contains all letters of the alphabet."
   }
   ```

3. **Filter Node (word count > 5):**
   ```json
   {
     "selectedText": "The quick brown fox jumps over the lazy dog.",
     "wordCount": 9,
     "characterCount": 44,
     "passed": true,
     "filterReason": "Word count (9) exceeds minimum (5)"
   }
   ```

4. **DownloadAsFile Output:**
   ```json
   {
     "filename": "text-extraction-2024-01-15.json",
     "content": "{ ... all previous data ... }",
     "size": 245,
     "downloadReady": true
   }
   ```

### Example 2: Multi-Source Data Collection

**Workflow Structure:**
```
GetAllLinks → EditFields → Merge ← GetAllImages → EditFields
     ↓                              ↓
DownloadAsFile ← Filter ← EditFields ← Merge
```

**Data flow explanation:**

1. **Parallel Processing:**
   - GetAllLinks extracts all page links
   - GetAllImages extracts all page images
   - Both process simultaneously

2. **Data Merging:**
   ```javascript
   // Links data:
   {
     "links": [
       {"url": "https://example.com", "text": "Example Link"},
       {"url": "https://test.com", "text": "Test Link"}
     ],
     "linkCount": 2
   }

   // Images data:
   {
     "images": [
       {"src": "image1.jpg", "alt": "Sample Image"},
       {"src": "image2.png", "alt": "Another Image"}
     ],
     "imageCount": 2
   }

   // Merged result:
   {
     "pageAssets": {
       "links": [...],
       "images": [...],
       "totalAssets": 4,
       "extractedAt": "2024-01-15T10:30:45.123Z"
     }
   }
   ```

## Common Data Transformation Patterns

### Pattern 1: Data Enrichment

**Purpose:** Add metadata and calculated fields to extracted data

**Implementation:**
```javascript
// Input: Basic text extraction
{
  "text": "JavaScript is a programming language"
}

// EditFields configuration:
{
  "operations": [
    {
      "field": "wordCount",
      "action": "calculate",
      "expression": "{{$json.text.split(' ').length}}"
    },
    {
      "field": "language",
      "action": "detect",
      "method": "keyword-analysis"
    },
    {
      "field": "category",
      "action": "classify",
      "rules": [
        {"contains": "programming", "category": "technology"},
        {"contains": "recipe", "category": "cooking"}
      ]
    }
  ]
}

// Output: Enriched data
{
  "text": "JavaScript is a programming language",
  "wordCount": 5,
  "language": "english",
  "category": "technology",
  "enrichedAt": "2024-01-15T10:30:45.123Z"
}
```

### Pattern 2: Data Filtering and Validation

**Purpose:** Remove unwanted data and validate content quality

**Implementation:**
```javascript
// Input: Mixed quality links
{
  "links": [
    {"url": "https://example.com", "text": "Good Link"},
    {"url": "javascript:void(0)", "text": ""},
    {"url": "https://spam.com", "text": "Click Here!!!"},
    {"url": "https://quality-site.com", "text": "Quality Content"}
  ]
}

// Filter configuration:
{
  "conditions": [
    {"field": "url", "operator": "not_contains", "value": "javascript:"},
    {"field": "text", "operator": "not_empty"},
    {"field": "text", "operator": "not_contains", "value": "!!!"}
  ]
}

// Output: Filtered data
{
  "validLinks": [
    {"url": "https://example.com", "text": "Good Link"},
    {"url": "https://quality-site.com", "text": "Quality Content"}
  ],
  "filteredCount": 2,
  "removedCount": 2
}
```

### Pattern 3: Data Aggregation

**Purpose:** Combine and summarize data from multiple sources

**Implementation:**
```javascript
// Input: Multiple text extractions
[
  {"text": "First paragraph", "wordCount": 2},
  {"text": "Second paragraph with more words", "wordCount": 5},
  {"text": "Third paragraph", "wordCount": 2}
]

// Aggregation logic:
{
  "totalParagraphs": 3,
  "totalWords": 9,
  "averageWordsPerParagraph": 3,
  "longestParagraph": "Second paragraph with more words",
  "combinedText": "First paragraph. Second paragraph with more words. Third paragraph."
}
```

## Debugging Data Flow

### Using the Execution Panel

**Step-by-step debugging:**

1. **Enable Debug Mode**
   - Click "Settings" in the workflow toolbar
   - Enable "Debug Mode" and "Detailed Logging"
   - Save settings and re-execute workflow

2. **Monitor Node Execution**
   - Watch nodes light up during execution
   - Green = successful processing
   - Yellow = processing in progress
   - Red = error occurred

3. **Inspect Node Data**
   - Click on any executed node
   - View "Input Data" and "Output Data" tabs
   - Compare expected vs. actual data structures

### Common Data Flow Issues

**Issue 1: Undefined or Null Data**

**Symptoms:**
```javascript
// Expected data:
{"text": "Sample text", "wordCount": 2}

// Actual data:
{"text": null, "wordCount": undefined}
```

**Causes:**
- Previous node failed to extract data
- Incorrect field references in expressions
- Missing error handling

**Solutions:**
```javascript
// Add data validation:
{
  "field": "text",
  "action": "validate",
  "rules": [
    {"required": true},
    {"minLength": 1}
  ],
  "fallback": "No text extracted"
}
```

**Issue 2: Data Type Mismatches**

**Symptoms:**
```javascript
// Expected: Number
{"wordCount": 5}

// Actual: String
{"wordCount": "5"}
```

**Solutions:**
```javascript
// Type conversion in EditFields:
{
  "field": "wordCount",
  "action": "convert",
  "toType": "number",
  "fallback": 0
}
```

**Issue 3: Missing Data Properties**

**Symptoms:**
- Nodes expecting certain fields that don't exist
- Workflow fails at specific transformation steps

**Solutions:**
```javascript
// Defensive data handling:
{
  "field": "safeWordCount",
  "action": "calculate",
  "expression": "{{($json.text || '').split(' ').length}}"
}
```

### Data Flow Visualization

**Creating data flow diagrams:**

```
[Web Page] 
    ↓ (HTML content)
[GetAllText]
    ↓ (raw text array)
[EditFields: Clean & Process]
    ↓ (structured text objects)
[Filter: Quality Check]
    ↓ (validated text objects)
[EditFields: Add Metadata]
    ↓ (enriched text objects)
[DownloadAsFile]
    ↓ (JSON file)
[User's Computer]
```

## Best Practices for Data Flow

### 1. Design for Data Consistency

**Standardize data structures:**
```javascript
// Good: Consistent structure
{
  "content": "...",
  "metadata": {
    "extractedAt": "...",
    "source": "...",
    "type": "..."
  },
  "metrics": {
    "wordCount": 0,
    "characterCount": 0
  }
}

// Avoid: Inconsistent structures
{"text": "...", "words": 5}  // First node
{"content": "...", "wordCount": 5}  // Second node
```

### 2. Implement Error Handling

**Graceful failure patterns:**
```javascript
// Add error handling to transformations:
{
  "field": "processedText",
  "action": "process",
  "onError": "continue",
  "fallback": "Processing failed",
  "logError": true
}
```

### 3. Optimize Data Size

**Minimize data transfer:**
```javascript
// Good: Only pass necessary data
{
  "essentialData": {
    "text": "...",
    "wordCount": 5
  }
}

// Avoid: Passing unnecessary large objects
{
  "text": "...",
  "fullPageHTML": "<html>...</html>", // Usually not needed
  "allPageImages": [...] // May be very large
}
```

### 4. Use Meaningful Field Names

**Clear naming conventions:**
```javascript
// Good: Descriptive names
{
  "extractedText": "...",
  "cleanedText": "...",
  "finalProcessedText": "..."
}

// Avoid: Ambiguous names
{
  "text1": "...",
  "text2": "...",
  "result": "..."
}
```

## Practical Exercise: Building a Data Flow

Let's build a workflow that demonstrates complex data flow:

### Exercise: Article Analysis Workflow

**Goal:** Extract and analyze article content with comprehensive data flow

**Workflow Design:**
```
GetAllText → EditFields (clean) → Filter (quality) → EditFields (analyze) → DownloadAsFile
     ↓
GetAllLinks → EditFields (validate) → Merge → EditFields (combine) ↗
```

**Step 1: Set up the workflow**
1. Create a new workflow named "Article Analysis"
2. Add the nodes as shown in the diagram above
3. Connect them according to the flow

**Step 2: Configure data processing**

**GetAllText configuration:**
```json
{
  "includeHidden": false,
  "preserveFormatting": true,
  "excludeNavigation": true
}
```

**EditFields (clean) configuration:**
```json
{
  "operations": [
    {
      "field": "cleanText",
      "action": "clean",
      "removeExtraSpaces": true,
      "removeSpecialChars": false
    },
    {
      "field": "wordCount",
      "action": "calculate",
      "expression": "{{$json.cleanText.split(' ').length}}"
    }
  ]
}
```

**Filter (quality) configuration:**
```json
{
  "conditions": [
    {"field": "wordCount", "operator": "greater_than", "value": 50},
    {"field": "cleanText", "operator": "not_empty"}
  ]
}
```

**Step 3: Test and debug**
1. Execute the workflow on a news article
2. Inspect data at each node
3. Verify data transformations are working correctly

**Expected final output:**
```json
{
  "article": {
    "text": "...",
    "wordCount": 245,
    "readingTime": "2 minutes",
    "quality": "high"
  },
  "links": {
    "internal": 5,
    "external": 12,
    "total": 17
  },
  "analysis": {
    "extractedAt": "2024-01-15T10:30:45.123Z",
    "processingTime": "1.2 seconds",
    "dataQuality": "excellent"
  }
}
```

## Next Steps

You now understand how data flows through browser automation workflows. You're ready to:

1. **[Build Intermediate Workflows](/learning/text-courses/intermediate/multi-step-workflows/)** - Create more complex data processing workflows
2. **[Learn Error Handling](/learning/text-courses/intermediate/error-handling/)** - Handle data flow errors gracefully
3. **[Explore Advanced Patterns](/learning/text-courses/advanced/complex-data-processing/)** - Master advanced data transformation techniques

## Additional Resources

- **[EditFields Node Reference](/integration/builtin/dataTransformation/EditFields/)** - Complete data transformation documentation
- **[Filter Node Guide](/integration/builtin/flow/Filter/)** - Data filtering and validation
- **[Merge Node Documentation](/integration/builtin/flow/Merge/)** - Combining data from multiple sources

---

**Estimated Time:** 35-40 minutes  
**Difficulty:** Beginner  
**Prerequisites:** Completed first workflow tutorial