---
title: Recursive Character Text Splitter
description: "Smart document splitter that breaks long texts into perfect chunks for AI processing - keeps related content together."
template: doc
tags: ["AI", "LLM", "Machine Learning", "Natural Language Processing", "Artificial Intelligence"]
---

# Recursive Character Text Splitter (Smart Chunking)

## What It Does

The Recursive Character Text Splitter intelligently breaks long documents into smaller, manageable chunks while keeping related content together. It's like having a smart librarian who knows exactly where to split a book so each section makes sense on its own.

## What Goes In, What Comes Out

### Input
| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| `text` | Text | Document content to split | Yes | - |
| `chunk_size` | Number | Maximum characters per chunk | Yes | - |
| `chunk_overlap` | Number | Characters to overlap between chunks | No | 200 |
| `separators` | Array | How to split text (paragraphs, sentences) | No | ["\n\n", "\n", ". "] |

### Output
| Name | Type | Description |
|------|------|-------------|
| `chunks` | Array | Smart text chunks ready for AI processing |
| `metadata` | Object | Information about the splitting process |

## Why Use Smart Chunking?

**🧠 Preserves Meaning**: Keeps related sentences and paragraphs together
**📏 Perfect Sizing**: Creates chunks that are just the right size for AI models
**🔗 Maintains Context**: Overlaps chunks so important connections aren't lost
**📚 Format Aware**: Understands different document types (HTML, markdown, plain text)
**⚡ AI Ready**: Outputs chunks perfectly formatted for knowledge bases and AI processing

## How It Works

```mermaid
flowchart LR
    A[📄 Long Document] --> B[✂️ Smart Splitting]
    B --> C[📝 Perfect Chunks]
    C --> D[🤖 AI Ready]

    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e8
```

**Smart Process:**
1. **Analyze Document**: Looks for natural break points (paragraphs, sentences)
2. **Split Intelligently**: Breaks text while keeping related content together
3. **Add Overlap**: Makes sure important connections aren't lost between chunks
4. **Perfect Size**: Creates chunks that are just right for AI processing

## Perfect For

**📚 Preparing Documents for AI**: Get documents ready for knowledge bases
**🔍 Building Search Systems**: Create searchable chunks from long content
**🤖 AI Processing**: Split content into AI-friendly sizes
**📊 Content Organization**: Break large documents into manageable pieces

## Simple Settings

**What You Need to Set** ⚙️
- **Text**: The document you want to split
- **Chunk Size**: How big each piece should be (1000 characters is usually good)

**Optional Settings** 🎛️
- **Chunk Overlap**: How much pieces should overlap (200 characters prevents losing context)
- **Separators**: Where to split (paragraphs work best for most documents)
| `length_function`    | `string`  | `"character"`             | Method to measure chunk length: character, token, word | `"token"`            |

### Advanced Configuration

```json
{
  "text": "{extracted_content}",
  "chunk_size": 1500,
  "chunk_overlap": 300,
  "separators": ["\\n\\n", "\\n", ". ", " ", ""],
  "keep_separator": true,
  "is_separator_regex": false,
  "length_function": "character",
  "metadata_preservation": {
    "source_tracking": true,
    "chunk_numbering": true,
    "overlap_marking": true
  },
  "content_type_handling": {
    "markdown": true,
    "code_blocks": true,
    "html_tags": false
  }
}
```

## Browser API Integration

### Required Permissions

| Permission  | Purpose                                             | Security Impact                           |
| ----------- | --------------------------------------------------- | ----------------------------------------- |
| `storage`   | Cache splitting configurations and processed chunks | Stores text processing data locally       |
| `activeTab` | Access current tab content for text extraction      | Can read content from active browser tabs |

### Browser APIs Used

- **Web Workers**: Processes large text splitting operations without blocking UI
- **IndexedDB**: Caches processed chunks and splitting configurations
- **TextEncoder/TextDecoder**: Handles text encoding and character counting accurately

### Cross-Browser Compatibility

| Feature                 | Chrome  | Firefox | Safari     | Edge    |
| ----------------------- | ------- | ------- | ---------- | ------- |
| Text Processing         | ✅ Full | ✅ Full | ✅ Full    | ✅ Full |
| Background Processing   | ✅ Full | ✅ Full | ✅ Full    | ✅ Full |
| Large Document Handling | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |

### Security Considerations

- **Local Processing**: All text splitting occurs locally without external transmission
- **Memory Management**: Efficient processing of large documents without memory leaks
- **Data Privacy**: Text content remains within browser environment during processing
- **Resource Monitoring**: Tracks processing resources to prevent browser overload
- **Content Validation**: Validates input text format and encoding before processing

## Input/Output Specifications

### Input Data Structure

```json
{
  "text": "string - The text content to split into chunks",
  "splitting_config": {
    "chunk_size": "number - Maximum chunk size",
    "chunk_overlap": "number - Overlap between chunks",
    "separators": "array - List of separators to use",
    "content_type": "string - Type of content (markdown, html, code, text)"
  },
  "metadata": {
    "source_url": "string - URL of source document",
    "document_title": "string - Title of the document",
    "timestamp": "string - When content was extracted"
  }
}
```

### Output Data Structure

```json
{
  "chunks": [
    {
      "text": "string - The chunk text content",
      "metadata": {
        "chunk_id": "string - Unique identifier for this chunk",
        "chunk_index": "number - Position in the original document",
        "start_position": "number - Character position where chunk starts",
        "end_position": "number - Character position where chunk ends",
        "overlap_with_previous": "number - Characters overlapping with previous chunk",
        "overlap_with_next": "number - Characters overlapping with next chunk",
        "source_document": "string - Reference to original document"
      },
      "statistics": {
        "character_count": "number - Number of characters in chunk",
        "word_count": "number - Number of words in chunk",
        "line_count": "number - Number of lines in chunk"
      }
    }
  ],
  "summary": {
    "total_chunks": "number - Total number of chunks created",
    "original_length": "number - Length of original text",
    "total_chunk_length": "number - Combined length of all chunks",
    "average_chunk_size": "number - Average size of chunks",
    "overlap_efficiency": "number - Percentage of content that is overlapped"
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "processing_time": 450,
    "splitting_strategy": "recursive_character",
    "source": "recursive_text_splitter"
  }
}
```

## Practical Examples

### Example 1: Document Preparation for Knowledge Base

**Scenario**: Split a large technical document into chunks for vector storage and RAG system

**Configuration**:

```json
{
  "text": "{technical_document}",
  "chunk_size": 1200,
  "chunk_overlap": 200,
  "separators": ["\\n\\n", "\\n", ". ", " ", ""],
  "keep_separator": true,
  "length_function": "character"
}
```

**Input Data**:

```json
{
  "text": "# API Documentation\\n\\nThe REST API provides programmatic access to system resources. Authentication is required for all endpoints.\\n\\n## Authentication\\n\\nUse Bearer tokens in the Authorization header. Tokens expire after 24 hours and must be refreshed.\\n\\n### Getting a Token\\n\\nSend a POST request to /auth/token with valid credentials. The response includes an access token and refresh token.\\n\\n## Endpoints\\n\\n### Users\\n\\nThe /users endpoint allows management of user accounts. Supports GET, POST, PUT, and DELETE operations.",

  "splitting_config": {
    "chunk_size": 1200,
    "chunk_overlap": 200,
    "separators": ["\\n\\n", "\\n", ". ", " ", ""],
    "content_type": "markdown"
  },
  "metadata": {
    "source_url": "https://docs.example.com/api",
    "document_title": "API Documentation",
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

**Expected Output**:

```json
{
  "chunks": [
    {
      "text": "# API Documentation\\n\\nThe REST API provides programmatic access to system resources. Authentication is required for all endpoints.\\n\\n## Authentication\\n\\nUse Bearer tokens in the Authorization header. Tokens expire after 24 hours and must be refreshed.\\n\\n### Getting a Token\\n\\nSend a POST request to /auth/token with valid credentials. The response includes an access token and refresh token.",

      "metadata": {
        "chunk_id": "chunk_001",
        "chunk_index": 0,
        "start_position": 0,
        "end_position": 387,
        "overlap_with_previous": 0,
        "overlap_with_next": 200,
        "source_document": "API Documentation"
      },
      "statistics": {
        "character_count": 387,
        "word_count": 58,
        "line_count": 9
      }
    },
    {
      "text": "The response includes an access token and refresh token.\\n\\n## Endpoints\\n\\n### Users\\n\\nThe /users endpoint allows management of user accounts. Supports GET, POST, PUT, and DELETE operations.",

      "metadata": {
        "chunk_id": "chunk_002",
        "chunk_index": 1,
        "start_position": 187,
        "end_position": 387,
        "overlap_with_previous": 200,
        "overlap_with_next": 0,
        "source_document": "API Documentation"
      },
      "statistics": {
        "character_count": 200,
        "word_count": 30,
        "line_count": 6
      }
    }
  ],
  "summary": {
    "total_chunks": 2,
    "original_length": 587,
    "total_chunk_length": 587,
    "average_chunk_size": 293,
    "overlap_efficiency": 34.1
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "processing_time": 450,
    "splitting_strategy": "recursive_character",
    "source": "recursive_text_splitter"
  }
}
```

**Step-by-Step Process**:

1. Input text is analyzed for structure and content type
2. Recursive splitting algorithm applies separators in hierarchical order
3. Chunks are created respecting size limits while preserving semantic boundaries
4. Overlap regions are calculated and marked for context continuity
5. Metadata is generated for each chunk including position and statistics

### Example 2: Code Documentation Processing

**Scenario**: Split code documentation with special handling for code blocks and comments

**Configuration**:

```json
{
  "text": "{code_documentation}",
  "chunk_size": 800,
  "chunk_overlap": 150,
  "separators": ["```\\n", "\\n\\n", "\\n", ". ", " "],
  "keep_separator": true,
  "content_type": "code"
}
```

**Workflow Integration**:

```
GetAllTextFromLink → Recursive Character Text Splitter → Ollama Embeddings → LocalKnowledge
     ↓                           ↓                            ↓                  ↓
  raw_documentation         structured_chunks              embeddings        vector_storage
```

**Complete Example**:
This pattern creates a complete pipeline for processing technical documentation, ensuring code blocks remain intact while creating searchable knowledge bases.

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the RecursiveCharacterTextSplitter node in a typical workflow scenario.

**Configuration:**

```json
{
  "model": "example_value",
  "enabled": true
}
```

**Input Data:**

```json
{
  "data": "sample input data"
}
```

**Expected Output:**

```json
{
  "result": "processed output data"
}
```

### Advanced Usage

This example shows more complex configuration options and integration patterns.

**Configuration:**

```json
{
  "parameter1": "advanced_value",
  "parameter2": false,
  "advancedOptions": {
    "option1": "value1",
    "option2": 100
  }
}
```

### Integration Example

Example showing how this node integrates with other workflow nodes:

1. **Previous Node** → **RecursiveCharacterTextSplitter** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Knowledge Base Creation Pipeline

- **Nodes**: GetAllTextFromLink → Recursive Character Text Splitter → Ollama Embeddings → LocalKnowledge
- **Use Case**: Process web documents into searchable knowledge bases with optimal chunking
- **Configuration Tips**: Match chunk sizes to embedding model capabilities and vector store requirements

#### Pattern 2: Batch Document Processing

- **Nodes**: Recursive Character Text Splitter → Basic LLM Chain → EditFields → Merge
- **Use Case**: Process large documents in chunks and combine AI analysis results
- **Data Flow**: Text splitting → Individual chunk processing → Result formatting → Result combination

### Best Practices

- **Performance**: Use appropriate chunk sizes to balance context preservation and processing efficiency
- **Error Handling**: Validate text encoding and handle malformed content gracefully
- **Data Validation**: Ensure chunk sizes are appropriate for downstream AI model requirements
- **Resource Management**: Monitor memory usage when processing very large documents

## Troubleshooting

### Common Issues

#### Issue: Chunks Too Large or Too Small

- **Symptoms**: Downstream AI processing fails due to inappropriate chunk sizes
- **Causes**: Incorrect chunk_size parameter, inappropriate separators, or content type mismatch
- **Solutions**:
  1. Adjust chunk_size parameter based on AI model requirements
  2. Modify separators to better match content structure
  3. Use appropriate length_function (character vs token counting)
  4. Test with sample content to optimize parameters
- **Prevention**: Profile downstream AI model requirements and test with representative content

#### Issue: Poor Semantic Preservation

- **Symptoms**: Related content is split across chunks, breaking context
- **Causes**: Inappropriate separators, insufficient overlap, or aggressive chunk sizing
- **Solutions**:
  1. Increase chunk_overlap to preserve more context
  2. Adjust separators to respect content structure better
  3. Use content-type-specific separator configurations
  4. Implement custom separators for specific document formats
- **Prevention**: Analyze document structure and choose separators that respect semantic boundaries

### Browser-Specific Issues

#### Chrome

- Large document processing may trigger memory warnings; implement chunked processing
- Use Web Workers for background processing of very large documents

#### Firefox

- Memory management may differ; monitor resource usage during large document processing
- Implement progress indicators for long-running splitting operations

### Performance Issues

- **Memory Usage**: Very large documents may consume significant browser memory during processing
- **Processing Time**: Complex documents with many separators may require substantial processing time
- **Storage Impact**: Generated chunks may consume significant browser storage space

## Limitations & Constraints

### Technical Limitations

- **Document Size**: Very large documents may exceed browser memory limits
- **Separator Complexity**: Complex regex separators may impact processing performance
- **Context Preservation**: Perfect semantic preservation may not always be possible with size constraints

### Browser Limitations

- **Memory Constraints**: Browser memory limits may restrict maximum document size
- **Processing Time**: Long-running operations may be interrupted by browser timeouts
- **Storage Limits**: Generated chunks may exceed browser storage quotas

### Data Limitations

- **Content Type Support**: Some specialized document formats may not split optimally
- **Language Support**: Separator effectiveness may vary for different languages
- **Structure Recognition**: Complex document structures may not be perfectly preserved

## Key Terminology

**LLM**: Large Language Model - AI models trained on vast amounts of text data

**RAG**: Retrieval-Augmented Generation - AI technique combining information retrieval with text generation

**Vector Store**: Database optimized for storing and searching high-dimensional vectors

**Embeddings**: Numerical representations of text that capture semantic meaning

**Prompt**: Input text that guides AI model behavior and response generation

**Temperature**: Parameter controlling randomness in AI responses (0.0-1.0)

**Tokens**: Units of text processing used by AI models for input and output measurement

## Search & Discovery

### Keywords

- artificial intelligence
- machine learning
- natural language processing
- LLM
- AI agent
- chatbot
- text generation
- language model

### Common Search Terms

- "ai"
- "llm"
- "gpt"
- "chat"
- "generate"
- "analyze"
- "understand"
- "process text"
- "smart"
- "intelligent"

### Primary Use Cases

- content analysis
- text generation
- question answering
- document processing
- intelligent automation
- knowledge extraction

