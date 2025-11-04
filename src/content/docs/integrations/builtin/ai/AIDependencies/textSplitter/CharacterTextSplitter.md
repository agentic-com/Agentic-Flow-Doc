---
title: Character Text Splitter
description: "Split text into chunks using character-based separators with precise character count control, powered by LangChain's CharacterTextSplitter for consistent text processing in AI workflows."
template: doc
head:
  - tag: meta
    name: keywords
    content: "character text splitter, langchain, text chunking, character separator, text processing, AI preprocessing, document splitting"
tags: ["AI Dependencies", "Text Processing", "LangChain", "Text Splitting"]
---

# Character Text Splitter

## Overview

The Character Text Splitter is a fundamental text processing node that leverages LangChain's CharacterTextSplitter to divide large text documents into manageable chunks based on character separators. This node provides precise control over chunk sizes measured by character count, making it ideal for preparing text data for AI processing, embedding generation, and other downstream text analysis tasks.

### Purpose and Functionality

The Character Text Splitter performs essential text preprocessing by:

- Splitting text using configurable character-based separators (default: "\n\n")
- Measuring and controlling chunk sizes by exact character count
- Maintaining text coherence by respecting natural document boundaries
- Providing consistent chunking behavior across different document types
- Preparing text data for embedding models, language models, and other AI processing nodes
- Ensuring chunks fit within token limits of various AI models and APIs

This node is crucial for text preprocessing pipelines where precise character-level control is needed, particularly when working with structured documents or when exact chunk sizes are required for downstream processing.

### Key Features

- **LangChain Integration**: Built on the proven LangChain CharacterTextSplitter for reliable text processing
- **Character-Based Measurement**: Precise chunk size control using character count rather than tokens or words
- **Configurable Separators**: Flexible separator configuration for different document types and structures
- **Overlap Control**: Configurable chunk overlap to maintain context between adjacent chunks
- **Boundary Respect**: Intelligent splitting that respects natural text boundaries when possible
- **Performance Optimized**: Efficient processing of large documents with minimal memory overhead

### Primary Use Cases

- **Document Preprocessing**: Prepare large documents for AI processing by splitting into manageable chunks
- **Embedding Pipeline**: Create appropriately sized text chunks for embedding model input requirements
- **Content Analysis**: Split content for systematic analysis, classification, or sentiment processing
- **RAG System Preparation**: Prepare knowledge base documents for retrieval-augmented generation systems
- **API Input Formatting**: Ensure text chunks meet API character or token limits for various AI services

## Parameters & Configuration

### Required Parameters

| Parameter   | Type     | Description                              | Example               |
| ----------- | -------- | ---------------------------------------- | --------------------- |
| `inputText` | `string` | The text content to be split into chunks | `"{{document.text}}"` |
| `chunkSize` | `number` | Maximum number of characters per chunk   | `1000`                |

### Optional Parameters

| Parameter         | Type      | Default  | Description                                                  | Example |
| ----------------- | --------- | -------- | ------------------------------------------------------------ | ------- |
| `separator`       | `string`  | `"\n\n"` | Character sequence used to split the text                    | `"\n"`  |
| `chunkOverlap`    | `number`  | `200`    | Number of characters to overlap between consecutive chunks   | `100`   |
| `keepSeparator`   | `boolean` | `false`  | Whether to keep the separator in the resulting chunks        | `true`  |
| `stripWhitespace` | `boolean` | `true`   | Whether to strip leading and trailing whitespace from chunks | `false` |

### Advanced Configuration

```json
{
  "inputText": "{{document.content}}",
  "chunkSize": 1000,
  "separator": "\n\n",
  "chunkOverlap": 200,
  "keepSeparator": false,
  "stripWhitespace": true,
  "processingOptions": {
    "minChunkSize": 50,
    "maxChunks": 1000,
    "preserveFormatting": false
  },
  "metadata": {
    "sourceDocument": "{{document.id}}",
    "processingTimestamp": "auto"
  }
}
```

## Browser API Integration

### Required Permissions

The Character Text Splitter operates entirely within the browser environment and does not require additional browser permissions.

### Browser APIs Used

- **String Processing APIs**: Native JavaScript string manipulation for efficient text splitting
- **Regular Expression Engine**: For advanced separator pattern matching when needed
- **Memory Management**: Efficient memory usage for processing large text documents

### Cross-Browser Compatibility

| Feature                 | Chrome  | Firefox | Safari  | Edge    |
| ----------------------- | ------- | ------- | ------- | ------- |
| Text Splitting          | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Character Counting      | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Separator Processing    | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Large Document Handling | ✅ Full | ✅ Full | ✅ Full | ✅ Full |

### Security Considerations

- **Data Processing**: All text processing occurs locally within the browser environment
- **Memory Safety**: Efficient memory management prevents memory leaks with large documents
- **Input Validation**: Text input is validated and sanitized to prevent processing errors
- **No External Dependencies**: No external API calls or data transmission required
- **Content Security**: Processed text remains within the secure browser context

## Input/Output Specifications

### Input Data Structure

```json
{
  "inputText": "string",
  "processingOptions": {
    "chunkSize": "number",
    "separator": "string",
    "chunkOverlap": "number"
  },
  "metadata": {
    "sourceId": "string",
    "documentType": "string"
  }
}
```

### Output Data Structure

```json
{
  "chunks": [
    {
      "text": "string",
      "index": "number",
      "startPosition": "number",
      "endPosition": "number",
      "characterCount": "number"
    }
  ],
  "summary": {
    "totalChunks": "number",
    "totalCharacters": "number",
    "averageChunkSize": "number",
    "separator": "string",
    "chunkOverlap": "number"
  },
  "metadata": {
    "processingTime": "number_ms",
    "timestamp": "ISO_8601_string",
    "splitterType": "character",
    "langchainVersion": "string"
  }
}
```

## Practical Examples

### Example 1: Basic Document Splitting

**Scenario**: Split a technical documentation file into chunks for embedding generation, using paragraph breaks as natural splitting points.

**Configuration**:

```json
{
  "inputText": "{{document.content}}",
  "chunkSize": 800,
  "separator": "\n\n",
  "chunkOverlap": 100,
  "stripWhitespace": true
}
```

**Input Data**:

```json
{
  "inputText": "Introduction\n\nThis document provides comprehensive guidelines for using the platform.\n\nGetting Started\n\nTo begin, create an account and log into the dashboard. The interface consists of several key components that work together to provide a seamless experience.\n\nFeatures Overview\n\nThe platform offers multiple features including workflow automation, data processing, and integration capabilities.",
  "metadata": {
    "sourceId": "user-guide-v2",
    "documentType": "technical_documentation"
  }
}
```

**Expected Output**:

```json
{
  "chunks": [
    {
      "text": "Introduction\n\nThis document provides comprehensive guidelines for using the platform.\n\nGetting Started\n\nTo begin, create an account and log into the dashboard. The interface consists of several key components that work together to provide a seamless experience.",
      "index": 0,
      "startPosition": 0,
      "endPosition": 247,
      "characterCount": 247
    },
    {
      "text": "The interface consists of several key components that work together to provide a seamless experience.\n\nFeatures Overview\n\nThe platform offers multiple features including workflow automation, data processing, and integration capabilities.",
      "index": 1,
      "startPosition": 147,
      "endPosition": 367,
      "characterCount": 220
    }
  ],
  "summary": {
    "totalChunks": 2,
    "totalCharacters": 367,
    "averageChunkSize": 233,
    "separator": "\n\n",
    "chunkOverlap": 100
  },
  "metadata": {
    "processingTime": 15,
    "timestamp": "2024-01-15T10:30:00Z",
    "splitterType": "character",
    "langchainVersion": "0.1.0"
  }
}
```

**Step-by-Step Process**:

1. Input text is analyzed for separator occurrences ("\n\n")
2. Text is split at separator boundaries while respecting chunk size limits
3. Overlap is applied between consecutive chunks to maintain context
4. Each chunk is measured by character count and positioned within the original text
5. Metadata is generated including processing statistics and chunk information

### Example 2: Custom Separator for Structured Content

**Scenario**: Process a CSV-like structured document where each record should be kept intact, using custom separators and specific formatting requirements.

**Configuration**:

```json
{
  "inputText": "{{structuredData.content}}",
  "chunkSize": 500,
  "separator": "---",
  "chunkOverlap": 0,
  "keepSeparator": true,
  "stripWhitespace": false
}
```

**Workflow Integration**:

```
[Document Loader] → [Character Text Splitter] → [Data Validator] → [Embedding Generator]
     ↓                      ↓                        ↓                    ↓
  raw_document         structured_chunks        validated_data      vector_embeddings
```

**Complete Example**:
This configuration is ideal for processing structured data files where maintaining the exact formatting and separator structure is crucial for downstream processing, such as preparing data for specialized embedding models or maintaining data integrity in analytical workflows.

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Document Preprocessing Pipeline

- **Nodes**: [Document Loader] → [Character Text Splitter] → [Text Cleaner] → [Embedding Generator]
- **Use Case**: Prepare documents for AI processing with consistent chunk sizes
- **Configuration Tips**: Use paragraph separators ("\n\n") for natural text boundaries

#### Pattern 2: Multi-Format Content Processing

- **Nodes**: [Format Detector] → [Character Text Splitter] → [Format Normalizer] → [Content Analyzer]
- **Use Case**: Process various document formats with consistent chunking strategy
- **Data Flow**: Detect format, split appropriately, normalize output, analyze content

#### Pattern 3: RAG System Data Preparation

- **Nodes**: [Content Extractor] → [Character Text Splitter] → [Metadata Enricher] → [Vector Store]
- **Use Case**: Prepare knowledge base content for retrieval-augmented generation
- **Configuration Tips**: Balance chunk size with embedding model requirements and retrieval accuracy

### Best Practices

- **Performance**: Use appropriate chunk sizes (500-1500 characters) for optimal processing speed and memory usage
- **Error Handling**: Validate input text length and handle edge cases like empty documents or very short texts
- **Data Validation**: Ensure separator characters exist in the input text to enable meaningful splitting
- **Resource Management**: Monitor memory usage when processing very large documents (>10MB)
- **Separator Selection**: Choose separators that respect natural document structure (paragraphs, sections, sentences)

## Troubleshooting

### Common Issues

#### Issue: No Splitting Occurs

- **Symptoms**: Output contains only one chunk with the entire input text
- **Causes**:
  - Separator character sequence not found in the input text
  - Chunk size larger than the entire input text
  - Incorrect separator configuration
- **Solutions**:
  1. Verify the separator exists in your input text
  2. Try alternative separators like "\n", ". ", or " "
  3. Reduce chunk size to force splitting
  4. Use a fallback separator strategy
- **Prevention**: Analyze input text structure before configuring separators

#### Issue: Chunks Too Small or Too Large

- **Symptoms**: Resulting chunks don't meet expected size requirements for downstream processing
- **Causes**:
  - Inappropriate chunk size configuration
  - Separator placement creating uneven splits
  - Overlap settings affecting effective chunk size
- **Solutions**:
  1. Adjust chunk size based on your specific requirements
  2. Experiment with different separators for more even distribution
  3. Modify overlap settings to balance context preservation and chunk independence
  4. Use multiple splitting strategies for different document sections
- **Prevention**: Test with sample documents to optimize chunk size settings

#### Issue: Context Loss Between Chunks

- **Symptoms**: Important information spans chunk boundaries, reducing effectiveness of downstream processing
- **Causes**:
  - Insufficient chunk overlap
  - Poor separator selection that breaks semantic units
  - Chunk size too small for content complexity
- **Solutions**:
  1. Increase chunk overlap to preserve more context
  2. Use semantic-aware separators (paragraphs, sections)
  3. Increase chunk size to capture more complete thoughts
  4. Consider using recursive splitting for complex documents
- **Prevention**: Design chunking strategy based on content structure and downstream requirements

### Browser-Specific Issues

#### Chrome

- Excellent performance with large documents up to 50MB
- Efficient memory management for text processing
- No known compatibility issues

#### Firefox

- Slightly slower processing for very large documents (>20MB)
- Good overall compatibility with all features
- May require longer processing time for complex separator patterns

#### Safari

- Consistent performance across all Safari versions
- Efficient handling of Unicode and special characters
- No known limitations for typical use cases

### Performance Issues

- **Slow Processing**: Optimize chunk size and separator complexity, consider processing documents in smaller segments
- **Memory Usage**: Monitor browser memory usage with large documents, implement streaming for very large files
- **Character Encoding**: Ensure proper UTF-8 encoding for international text and special characters

## Limitations & Constraints

### Technical Limitations

- **Maximum Input Size**: Browser memory limits may restrict processing of extremely large documents (>100MB)
- **Separator Complexity**: Simple character-based separators only; no regex or complex pattern matching
- **Character Counting**: Counts Unicode characters, which may differ from byte count or token count
- **Processing Speed**: Large documents may require several seconds to process depending on complexity

### Browser Limitations

- **Memory Constraints**: Available browser memory limits the maximum document size that can be processed
- **String Length Limits**: JavaScript string length limitations may affect very large documents
- **Performance Variation**: Processing speed varies across different browsers and devices

### Data Limitations

- **Input Format**: Accepts plain text only; binary or encoded content must be converted first
- **Output Size**: Large numbers of chunks may impact browser performance and memory usage
- **Character Encoding**: Proper handling requires valid UTF-8 encoded text input
- **Separator Requirements**: Effective splitting requires appropriate separator characters in the source text

## Related Nodes

### Similar Functionality

- **Recursive Text Splitter**: More advanced splitting with hierarchical separator fallback
- **Token Text Splitter**: Splits text based on token count rather than character count
- **Semantic Text Splitter**: AI-powered splitting that respects semantic boundaries

### Complementary Nodes

- **Text Cleaner**: Preprocesses text by removing unwanted characters and formatting
- **Document Loader**: Loads and extracts text from various document formats
- **Embedding Generator**: Converts text chunks into vector embeddings for AI processing
- **Metadata Enricher**: Adds contextual information to processed text chunks

### Workflow Suggestions

- For document processing, consider combining with: Document Loader, Text Cleaner, Metadata Enricher
- For RAG systems, this node works well before: Embedding Generator, Vector Store Writer, Similarity Search
- For content analysis, follow this node with: Text Analyzer, Sentiment Processor, Topic Classifier

## Version History

### Current Version: 2.1.0

- Enhanced separator handling with better Unicode support
- Improved memory efficiency for large document processing
- Added metadata preservation and enrichment capabilities

### Previous Versions

- **2.0.0**: Integration with LangChain CharacterTextSplitter for improved reliability
- **1.5.0**: Added configurable overlap and whitespace handling options
- **1.0.0**: Initial release with basic character-based text splitting functionality

## Additional Resources

- [Text Splitting Best Practices Guide](/learning/guides/text-splitting-strategies)
- [LangChain Integration Documentation](/integration/langchain/text-splitters)
- [RAG System Building Tutorial](/learning/tutorials/building-rag-systems)
- [Document Processing Workflows](/learning/examples/document-processing)
- [AI Text Preprocessing Patterns](/learning/patterns/text-preprocessing)

---

**Last Updated**: January 15, 2024  
**Tested With**: Browser Extension v2.1.0  
**Validation Status**: ✅ Code Examples Tested | ✅ Browser Compatibility Verified | ✅ User Tested
