---
title: Indexer Node
description: "Break documents into smart chunks and make them searchable - the essential first step for building AI knowledge bases."
template: doc
tags: ["AI Agents", "RAG", "Text Processing", "Embeddings", "Vector Storage"]
---

# Indexer Node (Document Processor)

## What It Does

The Indexer Node takes long documents and breaks them into smart, searchable chunks. Think of it as a librarian that organizes books into sections and creates a detailed catalog - it makes your documents ready for AI to search through and understand.

## What Goes In, What Comes Out

### Input
| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| `inputText` | Text | Document content to process | Yes | - |
| `embeddingModel` | Text | AI model for creating searchable vectors | Yes | - |
| `chunkSize` | Number | Maximum characters per chunk | Yes | - |
| `chunkOverlap` | Number | Characters to overlap between chunks | No | 200 |
| `separators` | Array | How to split text (paragraphs, sentences) | No | ["\n\n"] |

### Output
| Name | Type | Description |
|------|------|-------------|
| `chunks` | Array | Smart text chunks with embeddings |
| `summary` | Object | Processing statistics and info |
| `metadata` | Object | Document details and timestamps |

## Real-World Examples

**📚 Knowledge Base Builder**: Turn company docs into searchable AI database
- *Input*: Employee handbook, policies, procedures
- *Output*: Searchable chunks ready for Q&A system

**🔍 Research Assistant**: Make academic papers searchable by concept
- *Input*: Research papers and articles
- *Output*: Organized chunks that AI can search through

**💬 Smart Customer Support**: Index help docs for instant answers
- *Input*: FAQ pages, user manuals, troubleshooting guides
- *Output*: Searchable knowledge base for support chatbot

## How It Works

```mermaid
flowchart LR
    A[📄 Long Document] --> B[✂️ Smart Chunking]
    B --> C[🧠 Create Embeddings]
    C --> D[📊 Searchable Chunks]

    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e8
```

**Simple Process:**
1. **Smart Splitting**: Breaks documents at natural points (paragraphs, sections)
2. **Create Embeddings**: Converts text chunks into searchable vectors
3. **Add Metadata**: Keeps track of source, position, and relationships
4. **Ready for Search**: Chunks are ready for AI knowledge systems

## Configuration Options

### Basic Settings

**What to Index** 📄
- **Input Text**: The content you want to make searchable (from documents, web pages, etc.)
- **Embedding Model**: The AI model that creates the searchable format (OpenAI recommended)

**How to Split Content** ✂️
- **Chunk Size**: How big each piece should be (1000 characters works well for most content)
- **Chunk Overlap**: How much pieces should overlap (200 characters prevents losing context)

**Content Organization** 🏷️
- **Metadata**: Extra information like document title, date, category
- **Separators**: Where to split (paragraphs work best for most documents)

## Browser Compatibility

Works in all major browsers:
- ✅ **Chrome**: Full support with fast processing
- ✅ **Firefox**: Full support
- ⚠️ **Safari**: Limited storage for large documents
- ✅ **Edge**: Full support

## Privacy & Security

- 🔒 **API Keys Protected**: Embedding keys stored securely
- 🌐 **Secure Processing**: Uses encrypted connections for AI services
- 💾 **Local Caching**: Processed chunks cached locally for performance
- ✅ **Content Validation**: Input text validated for security

## Try It Yourself

### Example 1: Company Knowledge Base

**What you'll build**: Turn company documents into searchable AI database

**Workflow**:
```
Get All Text From Link → Indexer Node → Local Knowledge → RAG Node
```

**Setup**:
- **Chunk Size**: 1000 (good for general business docs)
- **Chunk Overlap**: 200 (maintains context)
- **Embedding Model**: "text-embedding-ada-002"

**Result**: Smart, searchable knowledge base ready for employee Q&A system.

### Example 2: Research Paper Collection

**What you'll build**: Searchable academic paper database

**Workflow**:
```
Upload Documents → Indexer Node → Local Knowledge → Q&A Node
```

**Setup**:
- **Chunk Size**: 1200 (longer for academic content)
- **Chunk Overlap**: 300 (important for research context)
- **Preserve Format**: true (keeps citations and formatting)

**Result**: AI-powered research assistant that can find relevant papers and concepts.

### Example 3: Customer Support Knowledge Base

**What you'll build**: Smart help documentation system

**Workflow**:
```
Get HTML From Link → Indexer Node → Local Knowledge → RAG Node
```

**Setup**:
- **Chunk Size**: 800 (shorter for quick answers)
- **Separators**: ["\n\n", "\n", "Q:", "A:"] (respects Q&A format)

**Result**: Instant, accurate customer support powered by your documentation.

<details>
<summary>🔍 Advanced Example: Multi-Language Documents</summary>

**What you'll build**: Knowledge base supporting multiple languages

**Setup**:
- Use multilingual embedding models
- Separate chunk processing by language
- Maintain language metadata for each chunk

**Use case**: International company with documentation in multiple languages.

</details>

## Best Practices

### ✅ Do This
- **Test chunk sizes**: Start with 1000 characters, adjust based on your content
- **Use appropriate overlap**: 150-200 characters maintains good context
- **Choose smart separators**: Respect natural document structure (paragraphs, sections)
- **Add meaningful metadata**: Include source, category, date for better organization
- **Process in batches**: Break very large documents into manageable pieces

### ❌ Avoid This
- Making chunks too small (loses context) or too large (reduces precision)
- Using zero overlap (can break important connections between chunks)
- Ignoring document structure (splits sentences or concepts awkwardly)
- Processing without metadata (makes it hard to track sources later)

## Troubleshooting

### 🚫 "Rate Limit Exceeded" Error
**Problem**: Too many embedding API requests
**Solution**: Reduce batch size, add delays between requests, or upgrade API plan

### ✂️ Poor Chunk Quality
**Problem**: Chunks cut off mid-sentence or lose context
**Solution**: Adjust chunk size and overlap, customize separators for your document type

### 💾 "Out of Memory" Error
**Problem**: Browser crashes with very large documents
**Solution**: Process documents in smaller segments, reduce max chunks limit

### 🐌 Slow Processing
**Problem**: Indexing takes too long
**Solution**: Use smaller documents, reduce chunk overlap, or try local embedding models

## Limitations to Know

- **Document Size**: Maximum 100MB per document for browser processing
- **Processing Time**: Large documents may take several minutes to process
- **API Costs**: Cloud embedding services charge per chunk processed
- **Memory Usage**: Large documents require significant browser memory

## Related Nodes

### 🔗 Works Great With
- **Local Knowledge**: Stores the processed chunks for searching
- **RAG Node**: Uses indexed chunks for intelligent question-answering
- **Recursive Character Text Splitter**: Alternative for simpler text splitting
- **Ollama Embeddings**: Creates the searchable vectors from text

### 🔄 Essential for RAG Workflows
Indexer Node is the first step in:
- Building smart knowledge bases
- Creating searchable document collections
- Enabling AI-powered Q&A systems

## What's Next?

**Related nodes:** [Local Knowledge](/integrations/builtin/ai/AIDependencies/vectorStore/LocalKnowledge/) • [RAG Node](/integrations/builtin/ai/AIAgents/RAGNode/) • [Q&A Node](/integrations/builtin/ai/AIAgents/QANode/)

**Common workflows:** [AI Knowledge Base](/advanced-ai/examples/intelligent-content-analysis/) • [Document Search](/advanced-ai/examples/end-to-end-ai-workflows/) • [Smart Research](/learning/workflow-patterns/real-world-examples/research-automation/)

**Learn more:** [AI Workflow Builder](/advanced-ai/basics/ai-workflow-builder/) • [Understanding RAG](/advanced-ai/basics/rag-in-Agentic Workflow Studio/) • [Vector Databases](/advanced-ai/examples/understand-vector-databases/)

---

**💡 Pro Tip**: Start with standard settings (1000 character chunks, 200 overlap) and adjust based on your specific content type. Technical docs might need smaller chunks, while narrative content can handle larger ones.
