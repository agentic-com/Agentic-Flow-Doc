---
contentType: tutorial
title: Smart Text Extraction and Processing
description: "Create intelligent text extraction workflows using Agentic Workflow Studio browser extension with AI-powered content analysis."
---

# Smart Text Extraction and Processing

This example demonstrates how to create intelligent text extraction workflows that go beyond simple text scraping by using AI to understand context, identify relevant content, and process text meaningfully.

## Overview

Smart text extraction combines browser extension capabilities with AI models to:
- Intelligently identify relevant text content
- Extract text with proper context and structure
- Process and analyze extracted text for insights
- Transform text into structured, actionable data

## Workflow Components

### 1. Context-Aware Text Selection
- **GetSelectedText Node**: Captures user-selected text with surrounding context
- **GetAllText Node**: Extracts all page text for comprehensive analysis
- **Agent Node**: Intelligently identifies relevant text sections

### 2. AI-Powered Text Processing
- **Text Splitter**: Breaks text into semantic chunks
- **Summarization Chain**: Creates intelligent summaries
- **Text Classifier**: Categorizes text by type and relevance

### 3. Structured Output Generation
- **Structured Output Parser**: Converts text to structured data
- **Output Formatter**: Formats results for specific use cases
- **Vector Store**: Enables semantic search of extracted text

## Example: Intelligent Article Processing

```javascript
// Workflow: Smart Article Text Extraction
// 1. Extract and analyze page text
const pageText = await GetAllText.execute();

// 2. Use AI to identify article content vs navigation/ads
const relevantContent = await Agent.execute({
  input: pageText,
  tools: [ThinkTool],
  prompt: `Analyze this page text and extract only the main article content.
    Ignore navigation menus, advertisements, sidebars, and footer content.
    Return the clean article text with proper paragraph structure.`
});

// 3. Process the clean content
const processedContent = await StructuredOutputParser.execute({
  input: relevantContent,
  schema: {
    title: "string",
    author: "string", 
    publishDate: "string",
    mainContent: "string",
    keyPoints: "array",
    topics: "array",
    wordCount: "number"
  }
});

// 4. Generate summary and insights
const summary = await SummarizationChain.execute({
  input: processedContent.mainContent,
  maxLength: 200
});
```

## Advanced Text Processing Patterns

### Semantic Text Chunking
Break text into meaningful sections based on content:

```javascript
// AI-guided text segmentation
const textSegments = await Agent.execute({
  input: extractedText,
  prompt: `Divide this text into logical sections based on topics and themes.
    Each section should be coherent and self-contained.
    Return sections with titles and content.`
});

// Process each segment individually
const processedSegments = await Promise.all(
  textSegments.map(segment => 
    TextClassifier.execute({
      input: segment.content,
      categories: ["introduction", "methodology", "results", "conclusion"]
    })
  )
);
```

### Multi-Language Text Processing
Handle content in different languages intelligently:

```javascript
// Detect and process multiple languages
const languageAnalysis = await Agent.execute({
  input: extractedText,
  prompt: "Detect the language(s) in this text and separate content by language"
});

// Process each language appropriately
for (const langContent of languageAnalysis.languages) {
  const translation = await LLMChain.execute({
    input: langContent.text,
    prompt: `Translate this ${langContent.language} text to English and summarize`
  });
}
```

### Context-Preserving Extraction
Maintain important context when extracting text:

```javascript
// Extract with context preservation
const contextualExtraction = await Agent.execute({
  input: {
    selectedText: await GetSelectedText.execute(),
    surroundingHTML: await GetHTMLofSelectedText.execute(),
    pageURL: window.location.href
  },
  prompt: `Extract the selected text while preserving important context:
    - What type of content is this (article, comment, product description, etc.)?
    - What is the broader context on the page?
    - Are there related elements (images, links, metadata)?
    - What is the source and credibility context?`
});
```

## Use Cases

### Research and Note-Taking
Extract and organize research content:

```javascript
// Research content extraction
const researchData = await Agent.execute({
  input: extractedText,
  tools: [VectorStoreTool],
  prompt: `Extract research-relevant information:
    - Key findings and conclusions
    - Methodology details
    - Citations and references
    - Statistical data
    - Author credentials and affiliations`
});

// Store in research database
await VectorStore.execute({
  documents: [{
    content: researchData.summary,
    metadata: {
      type: "research",
      source: currentURL,
      topics: researchData.topics,
      credibility: researchData.credibilityScore
    }
  }]
});
```

### Content Curation
Intelligently curate content for specific audiences:

```javascript
// Audience-specific content curation
const curatedContent = await Agent.execute({
  input: extractedText,
  prompt: `Curate this content for a technical audience:
    - Extract technical details and specifications
    - Identify implementation examples
    - Highlight best practices and recommendations
    - Remove marketing language and fluff`
});
```

### Fact Extraction and Verification
Extract factual claims for verification:

```javascript
// Extract verifiable facts
const factExtraction = await StructuredOutputParser.execute({
  input: extractedText,
  schema: {
    claims: [{
      statement: "string",
      confidence: "number",
      sources: "array",
      verifiable: "boolean"
    }],
    statistics: [{
      metric: "string",
      value: "string",
      context: "string"
    }]
  }
});
```

## Quality Assurance

### Content Validation
Validate extracted text quality:

```javascript
// Quality assessment
const qualityCheck = await Agent.execute({
  input: extractedText,
  prompt: `Assess the quality of this extracted text:
    - Is it complete and coherent?
    - Are there formatting issues?
    - Is important context missing?
    - Rate quality from 1-10 and suggest improvements`
});

if (qualityCheck.score < 7) {
  // Re-extract with different strategy
  const improvedExtraction = await retryWithBetterStrategy();
}
```

### Duplicate Detection
Identify and handle duplicate or similar content:

```javascript
// Check for similar content
const similarityCheck = await VectorStore.execute({
  query: extractedText,
  topK: 3,
  threshold: 0.8
});

if (similarityCheck.length > 0) {
  const deduplication = await Agent.execute({
    input: {
      newContent: extractedText,
      existingContent: similarityCheck
    },
    prompt: "Compare content and identify unique information in the new text"
  });
}
```

## Performance Optimization

### Selective Processing
Process only relevant text sections:

```javascript
// Pre-filter content before expensive AI processing
const relevanceFilter = await TextClassifier.execute({
  input: extractedText,
  categories: ["relevant", "irrelevant"],
  threshold: 0.7
});

if (relevanceFilter.category === "relevant") {
  await performExpensiveAIProcessing(extractedText);
}
```

### Batch Processing
Process multiple text extractions efficiently:

```javascript
// Batch process multiple text extractions
const textBatch = await Promise.all([
  GetAllText.execute({ selector: ".article" }),
  GetAllText.execute({ selector: ".comments" }),
  GetAllText.execute({ selector: ".sidebar" })
]);

const batchResults = await Agent.execute({
  input: textBatch,
  prompt: "Process these text sections and identify the most valuable content"
});
```

This smart text extraction approach enables more intelligent, context-aware, and valuable text processing workflows compared to simple text scraping methods.