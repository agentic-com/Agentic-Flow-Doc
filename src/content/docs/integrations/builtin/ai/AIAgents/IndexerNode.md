---
title: Indexer Node
description: "Split text into semantic chunks and generate embeddings for vector storage, enabling efficient retrieval-augmented generation (RAG) workflows and semantic search capabilities."
template: doc
head:
  - tag: meta
    name: keywords
    content: "indexer node, text chunking, embeddings, vector store, RAG, semantic search, text processing, AI retrieval"
tags: ["AI Agents", "RAG", "Text Processing", "Embeddings", "Vector Storage"]
---

# Indexer Node

## Overview

The Indexer Node is a specialized AI processing node that transforms raw text into searchable, semantically meaningful chunks with corresponding vector embeddings. This node serves as the foundation for Retrieval-Augmented Generation (RAG) systems, enabling efficient storage and retrieval of textual information based on semantic similarity rather than simple keyword matching.

### Purpose and Functionality

The Indexer Node performs the critical first step in building knowledge bases for AI applications by:

- Intelligently splitting large text documents into semantically coherent chunks
- Generating high-dimensional vector embeddings for each text chunk using advanced language models
- Preparing data for storage in vector databases for efficient similarity search
- Maintaining metadata and relationships between original documents and their chunks
- Optimizing chunk sizes and overlap for maximum retrieval effectiveness

This node is essential for creating robust RAG systems that can provide contextually relevant information to language models, enabling more accurate and informed AI responses.

### Key Features

- **Intelligent Text Chunking**: Advanced algorithms that respect semantic boundaries and document structure
- **Multiple Embedding Models**: Support for various embedding models including OpenAI, Sentence Transformers, and custom models
- **Configurable Chunk Sizes**: Flexible chunk size and overlap settings optimized for different use cases
- **Metadata Preservation**: Maintains document metadata, source information, and chunk relationships
- **Batch Processing**: Efficient processing of large documents with progress tracking
- **Vector Store Integration**: Direct integration with popular vector databases and storage systems

### Primary Use Cases

- **Knowledge Base Creation**: Build searchable knowledge bases from documentation, manuals, and reference materials
- **Document Q&A Systems**: Enable AI systems to answer questions based on large document collections
- **Content Recommendation**: Create semantic search capabilities for content discovery and recommendation
- **Research Assistant Tools**: Index academic papers, reports, and research materials for intelligent retrieval
- **Customer Support Automation**: Index support documentation and FAQs for automated customer assistance

## Parameters & Configuration

### Required Parameters

| Parameter        | Type     | Description                                                      | Example                    |
| ---------------- | -------- | ---------------------------------------------------------------- | -------------------------- |
| `inputText`      | `string` | The raw text content to be chunked and indexed                   | `"{{document.content}}"`   |
| `embeddingModel` | `string` | The embedding model to use for generating vector representations | `"text-embedding-ada-002"` |
| `chunkSize`      | `number` | Maximum number of characters per chunk                           | `1000`                     |

### Optional Parameters

| Parameter        | Type      | Default    | Description                                                | Example                |
| ---------------- | --------- | ---------- | ---------------------------------------------------------- | ---------------------- |
| `chunkOverlap`   | `number`  | `200`      | Number of characters to overlap between adjacent chunks    | `150`                  |
| `separators`     | `array`   | `["\n\n"]` | List of separators to use for intelligent chunking         | `["\n\n", "\n", ". "]` |
| `metadataFields` | `object`  | `{}`       | Additional metadata to attach to each chunk                | `{"source": "manual"}` |
| `minChunkSize`   | `number`  | `100`      | Minimum chunk size to prevent overly small fragments       | `50`                   |
| `maxChunks`      | `number`  | `1000`     | Maximum number of chunks to generate (for large documents) | `500`                  |
| `preserveFormat` | `boolean` | `false`    | Whether to preserve original formatting in chunks          | `true`                 |

### Advanced Configuration

```json
{
  "inputText": "{{document.content}}",
  "embeddingModel": "text-embedding-ada-002",
  "chunkSize": 1000,
  "chunkOverlap": 200,
  "separators": ["\n\n", "\n", ". ", " "],
  "metadataFields": {
    "source": "user_manual",
    "category": "technical_documentation",
    "version": "2.1.0"
  },
  "minChunkSize": 100,
  "maxChunks": 1000,
  "preserveFormat": false,
  "embeddingOptions": {
    "apiKey": "{{secrets.openai_key}}",
    "batchSize": 100,
    "timeout": 30000
  },
  "processingOptions": {
    "removeEmptyChunks": true,
    "normalizeWhitespace": true,
    "handleSpecialCharacters": true
  }
}
```

## Browser API Integration

### Required Permissions

The Indexer Node operates within the browser environment and may require specific permissions for optimal functionality:

| Permission   | Purpose                                  | Security Impact                                   |
| ------------ | ---------------------------------------- | ------------------------------------------------- |
| `storage`    | Cache embeddings and processing results  | Local storage of processed data for performance   |
| `background` | Handle long-running embedding operations | Background processing for large document indexing |

### Browser APIs Used

- **Web Workers API**: For parallel processing of large documents without blocking the main thread
- **IndexedDB API**: For local caching of embeddings and processed chunks
- **Fetch API**: For communication with embedding model APIs (OpenAI, Hugging Face, etc.)
- **Blob API**: For handling large text files and binary embedding data

### Cross-Browser Compatibility

| Feature              | Chrome  | Firefox | Safari     | Edge    |
| -------------------- | ------- | ------- | ---------- | ------- |
| Text Chunking        | ✅ Full | ✅ Full | ✅ Full    | ✅ Full |
| Embedding Generation | ✅ Full | ✅ Full | ✅ Full    | ✅ Full |
| Web Workers          | ✅ Full | ✅ Full | ✅ Full    | ✅ Full |
| IndexedDB Storage    | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |

### Security Considerations

- **API Key Protection**: Embedding model API keys are securely stored and never exposed in client-side code
- **Data Privacy**: Text content is processed locally when possible, with secure transmission to external APIs
- **Rate Limiting**: Built-in rate limiting to prevent API abuse and ensure fair usage
- **Content Validation**: Input text is validated and sanitized to prevent injection attacks
- **Secure Storage**: Local caching uses encrypted storage mechanisms where available

## Input/Output Specifications

### Input Data Structure

```json
{
  "inputText": "string",
  "documentMetadata": {
    "title": "string",
    "source": "string",
    "author": "string",
    "created_date": "ISO_8601_string"
  },
  "processingOptions": {
    "chunkSize": "number",
    "chunkOverlap": "number",
    "embeddingModel": "string"
  }
}
```

### Output Data Structure

```json
{
  "chunks": [
    {
      "id": "string",
      "text": "string",
      "embedding": "number[]",
      "metadata": {
        "chunk_index": "number",
        "start_position": "number",
        "end_position": "number",
        "source": "string",
        "created_at": "ISO_8601_string"
      }
    }
  ],
  "summary": {
    "total_chunks": "number",
    "total_characters": "number",
    "average_chunk_size": "number",
    "embedding_model": "string",
    "processing_time": "number_ms"
  },
  "metadata": {
    "document_id": "string",
    "processing_timestamp": "ISO_8601_string",
    "node_version": "string"
  }
}
```

## Practical Examples

### Example 1: Basic Document Indexing

**Scenario**: Index a technical documentation file for a customer support RAG system that can answer user questions about product features.

**Configuration**:

```json
{
  "inputText": "{{document.content}}",
  "embeddingModel": "text-embedding-ada-002",
  "chunkSize": 800,
  "chunkOverlap": 150,
  "metadataFields": {
    "source": "product_documentation",
    "category": "user_guide"
  }
}
```

**Input Data**:

```json
{
  "inputText": "Product Overview\n\nOur software platform provides comprehensive workflow automation capabilities. Users can create custom workflows using a visual node-based editor...\n\nGetting Started\n\nTo begin using the platform, first create an account and log in to the dashboard. The main interface consists of three primary sections...",
  "documentMetadata": {
    "title": "User Guide v2.1",
    "source": "product_docs",
    "author": "Documentation Team"
  }
}
```

**Expected Output**:

```json
{
  "chunks": [
    {
      "id": "chunk_001",
      "text": "Product Overview\n\nOur software platform provides comprehensive workflow automation capabilities. Users can create custom workflows using a visual node-based editor that supports drag-and-drop functionality.",
      "embedding": [0.0123, -0.0456, 0.0789, ...],
      "metadata": {
        "chunk_index": 0,
        "start_position": 0,
        "end_position": 187,
        "source": "product_documentation",
        "category": "user_guide",
        "created_at": "2024-01-15T10:30:00Z"
      }
    }
  ],
  "summary": {
    "total_chunks": 15,
    "total_characters": 12450,
    "average_chunk_size": 830,
    "embedding_model": "text-embedding-ada-002",
    "processing_time": 3200
  }
}
```

**Step-by-Step Process**:

1. Input text is analyzed for natural breaking points (paragraphs, sections)
2. Text is split into chunks respecting semantic boundaries and size limits
3. Each chunk is sent to the embedding model API for vector generation
4. Metadata is attached to each chunk including position and source information
5. Final indexed data structure is returned for storage in vector database

### Example 2: Academic Paper Indexing with Custom Separators

**Scenario**: Index research papers for an academic research assistant that needs to maintain citation context and section structure.

**Configuration**:

```json
{
  "inputText": "{{paper.fullText}}",
  "embeddingModel": "sentence-transformers/all-MiniLM-L6-v2",
  "chunkSize": 1200,
  "chunkOverlap": 300,
  "separators": ["\n\n", "\n", ". ", "; "],
  "metadataFields": {
    "paper_id": "{{paper.id}}",
    "authors": "{{paper.authors}}",
    "journal": "{{paper.journal}}",
    "publication_year": "{{paper.year}}"
  },
  "preserveFormat": true
}
```

**Workflow Integration**:

```
[PDF Parser] → [Indexer Node] → [Vector Store] → [RAG Query Engine]
     ↓              ↓              ↓                    ↓
  raw_text    indexed_chunks   stored_vectors    query_results
```

**Complete Example**:
This configuration creates a comprehensive academic paper indexing system that maintains citation context, preserves formatting for mathematical expressions, and enables precise retrieval of relevant research content for AI-powered literature reviews.

## Integration Patterns

### Common Node Combinations

#### Pattern 1: RAG Pipeline Foundation

- **Nodes**: [Document Loader] → [Indexer Node] → [Vector Store Writer]
- **Use Case**: Building the knowledge base component of RAG systems
- **Configuration Tips**: Use consistent chunk sizes across your knowledge base for optimal retrieval performance

#### Pattern 2: Multi-Source Knowledge Integration

- **Nodes**: [Multiple Document Sources] → [Content Merger] → [Indexer Node] → [Unified Vector Store]
- **Use Case**: Combining information from various sources into a single searchable knowledge base
- **Data Flow**: Merge content while preserving source metadata for attribution

#### Pattern 3: Incremental Index Updates

- **Nodes**: [Change Detector] → [Indexer Node] → [Vector Store Updater]
- **Use Case**: Maintaining up-to-date knowledge bases with minimal reprocessing
- **Configuration Tips**: Use document IDs and timestamps to track changes efficiently

### Best Practices

- **Performance**: Use appropriate chunk sizes (800-1200 characters) for optimal embedding quality and retrieval performance
- **Error Handling**: Implement retry logic for embedding API calls and handle rate limiting gracefully
- **Data Validation**: Validate input text quality and remove or flag low-quality content before indexing
- **Resource Management**: Monitor embedding API usage and costs, especially with large document collections
- **Metadata Strategy**: Design comprehensive metadata schemas to enable effective filtering and attribution

## Troubleshooting

### Common Issues

#### Issue: Embedding API Rate Limits

- **Symptoms**: "Rate limit exceeded" errors during processing, slow or failed chunk processing
- **Causes**:
  - Too many concurrent API requests
  - Exceeding daily or monthly API quotas
  - Insufficient API key permissions
- **Solutions**:
  1. Reduce batch size in embedding options
  2. Implement exponential backoff retry logic
  3. Upgrade API plan or request quota increases
  4. Process documents in smaller batches
- **Prevention**: Monitor API usage and implement proper rate limiting from the start

#### Issue: Poor Chunk Quality

- **Symptoms**: Chunks that cut off mid-sentence, lose context, or contain incomplete information
- **Causes**:
  - Inappropriate chunk size settings
  - Poor separator configuration
  - Complex document formatting
- **Solutions**:
  1. Adjust chunk size and overlap parameters
  2. Customize separators for your document type
  3. Enable format preservation for structured documents
  4. Implement custom chunking logic for complex formats
- **Prevention**: Test chunking with sample documents and validate chunk quality before full processing

#### Issue: Memory Issues with Large Documents

- **Symptoms**: Browser crashes, slow performance, or out-of-memory errors when processing large documents
- **Causes**:
  - Documents too large for browser memory
  - Inefficient processing algorithms
  - Too many chunks generated simultaneously
- **Solutions**:
  1. Process documents in smaller segments
  2. Use streaming processing for very large files
  3. Implement garbage collection between chunks
  4. Reduce maximum chunk limits
- **Prevention**: Set appropriate document size limits and implement streaming for large files

### Browser-Specific Issues

#### Chrome

- Excellent performance with Web Workers and IndexedDB
- May hit memory limits with very large documents (>50MB)
- Solution: Implement document segmentation for large files

#### Firefox

- Slightly slower embedding processing due to different JavaScript engine optimizations
- Good overall compatibility with all features
- Solution: Consider slightly larger batch sizes to compensate for processing overhead

#### Safari

- Limited IndexedDB storage capacity may affect caching
- Web Workers performance varies across versions
- Solution: Implement fallback storage mechanisms and test across Safari versions

### Performance Issues

- **Slow Processing**: Optimize chunk sizes, use local embedding models when possible, implement parallel processing
- **Memory Usage**: Monitor memory consumption, implement streaming for large documents, clear processed data promptly
- **API Costs**: Use efficient embedding models, implement caching, batch similar content together

## Limitations & Constraints

### Technical Limitations

- **Maximum Document Size**: Individual documents limited to 100MB for browser processing
- **Embedding Dimensions**: Output vector dimensions depend on chosen embedding model (typically 384-1536 dimensions)
- **Processing Speed**: Large documents may take several minutes to process depending on size and API response times
- **Concurrent Processing**: Limited by browser's concurrent request limits and API rate limits

### Browser Limitations

- **Memory Constraints**: Large documents may exceed browser memory limits, especially on mobile devices
- **Storage Limits**: IndexedDB storage quotas may limit local caching capabilities
- **Network Dependencies**: Requires stable internet connection for embedding API calls

### Data Limitations

- **Input Size**: Maximum input text size of 100MB per processing operation
- **Output Format**: Embeddings are stored as floating-point arrays, requiring significant storage space
- **Processing Time**: Complex documents with many chunks may require extended processing time
- **Language Support**: Embedding quality depends on model's language training data

## Related Nodes

### Similar Functionality

- **Text Splitter Node**: Basic text chunking without embedding generation
- **Document Parser Node**: Extracts text from various document formats before indexing

### Complementary Nodes

- **Vector Store Writer**: Stores indexed chunks and embeddings in vector databases
- **Embedding Query Node**: Retrieves relevant chunks based on semantic similarity
- **RAG Generator Node**: Uses retrieved chunks to generate contextually informed responses
- **Document Loader Node**: Loads and preprocesses documents before indexing

### Workflow Suggestions

- For knowledge base creation, consider combining with: Document Loader, Vector Store Writer, Search Interface
- For RAG systems, this node works well before: Vector Store Writer, Embedding Query Node, Response Generator
- For content analysis, follow this node with: Similarity Analyzer, Topic Classifier, Content Summarizer

## Version History

### Current Version: 2.3.0

- Added support for custom embedding models and local processing options
- Improved chunking algorithms with better semantic boundary detection
- Enhanced metadata handling and preservation capabilities

### Previous Versions

- **2.2.0**: Introduced batch processing and progress tracking for large documents
- **2.1.0**: Added support for multiple embedding providers and improved error handling
- **2.0.0**: Major rewrite with Web Workers support and IndexedDB caching
- **1.5.0**: Initial release with basic text chunking and OpenAI embedding integration

## Additional Resources

- [Building RAG Systems Tutorial](/learning/tutorials/rag-systems)
- [Embedding Models Comparison Guide](/learning/guides/embedding-models)
- [Vector Store Integration Patterns](/integration/patterns/vector-stores)
- [Text Chunking Best Practices](/learning/best-practices/text-chunking)
- [RAG Workflow Examples](/learning/examples/rag-workflows)

---

**Last Updated**: January 15, 2024  
**Tested With**: Browser Extension v2.3.0  
**Validation Status**: ✅ Code Examples Tested | ✅ Browser Compatibility Verified | ✅ User Tested
