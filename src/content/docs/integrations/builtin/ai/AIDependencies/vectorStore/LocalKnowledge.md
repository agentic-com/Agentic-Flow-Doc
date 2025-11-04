---
title: Local Knowledge
description: "Store and search through your documents locally in the browser - create smart knowledge bases that work offline and keep your data private."
template: doc
tags: ["AI", "LLM", "Machine Learning", "Natural Language Processing", "Artificial Intelligence"]
---

# Local Knowledge (Document Storage)

## What It Does

Local Knowledge creates a smart document database right in your browser. Think of it as a personal search engine for your documents - you can store articles, PDFs, notes, and then ask questions or search for specific information using natural language.

## What Goes In, What Comes Out

### Input
| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| `database_name` | Text | Name for your knowledge base | Yes | - |
| `action` | Text | What to do: create, insert, search, update, delete | Yes | - |
| `document` | Object | Document content and metadata | For insert | - |
| `query` | Object | Search query and filters | For search | - |
| `embedding_dimension` | Number | Vector size for search | No | 768 |

### Output
| Name | Type | Description |
|------|------|-------------|
| `success` | Boolean | Whether the operation worked |
| `results` | Array | Found documents or operation results |
| `statistics` | Object | Database size and performance info |
| `metadata` | Object | Operation details and timing |

## Why Use Local Knowledge?

**🔒 Complete Privacy**: All documents stay in your browser, never uploaded anywhere  
**🌐 Works Offline**: Search your documents even without internet  
**🔍 Smart Search**: Find documents by meaning, not just keywords  
**💾 No Storage Limits**: Store as many documents as your browser allows  
**⚡ Fast Search**: Instant results from your local database

## How It Works

```mermaid
flowchart LR
    A[📄 Your Documents] --> B[💾 Local Storage]
    B --> C[🔍 Smart Search]
    C --> D[📋 Relevant Results]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e8
```

**Simple Process:**
1. **Store Documents**: Add articles, notes, or any text content
2. **Create Embeddings**: Convert text to searchable vectors (automatic)
3. **Search by Meaning**: Ask questions or search with natural language
4. **Get Smart Results**: Find relevant documents even if they don't contain exact keywords

## Perfect For

**📚 Personal Research**: Store and search through research papers, articles, and notes  
**💼 Company Knowledge**: Create searchable databases of policies, procedures, and documentation  
**🎓 Study Materials**: Organize and search through educational content  
**📝 Content Collections**: Build searchable libraries of any text content  
**🔍 Smart FAQ Systems**: Create question-answering systems from your documents

## Quick Setup Guide

### 1. Create a Knowledge Base
- **Database Name**: Choose a descriptive name like "research_docs" or "company_kb"
- **Action**: Set to "create" for first-time setup

### 2. Add Documents
- **Action**: Set to "insert"
- **Document**: Include title, content, and any metadata
- **Embedding**: Usually generated automatically by other nodes

### 3. Search Your Documents
- **Action**: Set to "search"
- **Query**: Ask questions or search terms
- **Max Results**: How many documents to return (5-10 is usually good)

## Configuration Tips

**For General Knowledge Base**:
```json
{
  "database_name": "my_knowledge_base",
  "action": "search",
  "similarity_threshold": 0.7,
  "max_results": 5
}
```

**For Precise Technical Search**:
```json
{
  "database_name": "technical_docs",
  "action": "search", 
  "similarity_threshold": 0.8,
  "max_results": 3
}
```

**For Broad Research**:
```json
{
  "database_name": "research_collection",
  "action": "search",
  "similarity_threshold": 0.6,
  "max_results": 10
}
```

## Browser Compatibility

Works in all major browsers:
- ✅ **Chrome**: Full support with large storage
- ✅ **Firefox**: Full support  
- ⚠️ **Safari**: Limited large storage support
- ✅ **Edge**: Full support

## Storage & Privacy

**🔒 Complete Privacy**: All documents stored locally in your browser  
**💾 Browser Storage**: Uses IndexedDB for reliable, persistent storage  
**🔐 Optional Encryption**: Can encrypt sensitive documents  
**🚫 No External Access**: Data never leaves your device  
**♻️ Easy Cleanup**: Delete knowledge bases anytime

## Try It Yourself

### Example 1: Personal Research Database

**What you'll build**: Searchable collection of research articles and notes

**Workflow**:
```
Get All Text From Link → Recursive Character Text Splitter → Ollama Embeddings → Local Knowledge
```

**Setup**:
1. **Create Database**: Name it "research_db"
2. **Add Documents**: Insert articles with titles and content
3. **Search**: Ask questions like "What are the benefits of renewable energy?"

**Result**: Smart search through all your research materials.

### Example 2: Company Knowledge Base

**What you'll build**: Searchable company documentation and policies

**Workflow**:
```
Get HTML From Link → Local Knowledge → RAG Node → Edit Fields
```

**Setup**:
1. **Build Collection**: Add company docs, policies, procedures
2. **Enable Search**: Connect to RAG node for question-answering
3. **Ask Questions**: "What's our vacation policy?" → Get accurate answers

**Result**: Smart company FAQ system with source citations.

### Example 3: Study Materials Library

**What you'll build**: Searchable collection of educational content

**Workflow**:
```
Upload Documents → Local Knowledge → Q&A Node → Download As File
```

**Setup**:
- **Database Name**: "study_materials"
- **Content**: Textbooks, lecture notes, articles
- **Search**: Find information by topic or concept

**Result**: Personal study assistant that finds relevant information instantly.

<details>
<summary>🔍 Advanced Example: Multi-Topic Knowledge Base</summary>

**What you'll build**: Organized knowledge base with categories

**Setup**:
- Use metadata fields to categorize documents (topic, difficulty, source)
- Filter searches by category
- Create specialized collections for different subjects

**Use case**: Comprehensive learning system with organized, searchable content.

</details>



## Best Practices

### ✅ Do This
- **Use descriptive database names**: "research_papers" vs "db1"
- **Add meaningful metadata**: Include titles, dates, categories
- **Start with smaller collections**: Test with 10-20 documents first
- **Use appropriate similarity thresholds**: 0.7 for general search, 0.8+ for precise matches
- **Organize with metadata**: Use categories and tags for better filtering

### ❌ Avoid This
- Storing duplicate documents (wastes space and confuses search)
- Using very low similarity thresholds (returns irrelevant results)
- Forgetting to include document titles and metadata
- Storing extremely long documents without splitting them first

## Troubleshooting

### 💾 "Storage Quota Exceeded"
**Problem**: Can't add more documents to knowledge base  
**Solution**: Delete old documents, enable compression, or request unlimited storage permission

### 🔍 "No Results Found"
**Problem**: Search doesn't return any documents  
**Solution**: Lower similarity threshold to 0.6 or check if documents actually contain related content

### 🐌 Slow Search Performance
**Problem**: Searches take too long  
**Solution**: Reduce max_results, optimize database size, or use more specific search terms

### 📄 "Document Not Inserted"
**Problem**: Documents fail to save  
**Solution**: Check document format, ensure embeddings are included, verify database name is correct

## Keeping Your Knowledge Base Organized

### 🧹 Simple Maintenance
- **Remove old documents** you no longer need
- **Delete test databases** when you're done experimenting  
- **Keep related documents together** for better search results

### 💡 Tips for Better Performance
- **Start small** with 10-20 documents, then add more
- **Use clear document titles** so you know what's stored
- **Group similar content** (like all company policies in one database)

## Related Nodes

### 🔗 Works Great With
- **RAG Node**: Uses Local Knowledge for document retrieval
- **Q&A Node**: Searches through stored documents for answers
- **Recursive Character Text Splitter**: Prepares documents for storage
- **Ollama Embeddings**: Creates searchable vectors from text

### 🔄 Required for RAG Workflows
Local Knowledge is essential for:
- Building smart Q&A systems
- Creating searchable document collections
- Enabling semantic search capabilities

## What's Next?

### 🌱 New to Document Storage?
1. **Start Small**: Create a test database with 5-10 documents
2. **Add Content**: Use Get All Text From Link to collect documents
3. **Try Searching**: Test different similarity thresholds
4. **Build RAG System**: Connect to RAG Node for smart Q&A

### 🚀 Ready for More?
- Explore [RAG Node](/integrations/builtin/ai/AIAgents/RAGNode) for intelligent document search
- Try [Ollama Embeddings](/integrations/builtin/ai/AIDependencies/embeddings/OllamaEmbeddings) for creating document vectors
- Check out [document processing examples](/learning/examples/)

---

**💡 Pro Tip**: Start with a focused collection of related documents (like all your research papers on one topic) rather than mixing different types of content. This gives better search results and helps you understand how the system works.



### Workflow Patterns

- [AI-Powered Analysis Patterns](/learning/workflow-patterns/ai-analysis-patterns)
- [Knowledge Base Integration](/learning/workflow-patterns/knowledge-integration)
- [Intelligent Content Processing](/learning/workflow-patterns/content-processing)

### Related Tutorials

- [Building Your First AI Workflow](/learning/text-courses/beginner/first-ai-workflow)
- [Advanced AI Integration](/learning/text-courses/advanced/ai-powered-analysis)

### Practical Examples

- [Real-World Use Cases](/learning/examples/)
- [Integration Examples](/learning/examples/multi-node-automation)
- [Best Practice Examples](/learning/workflow-patterns/optimization-best-practices)

## Related Nodes

### Complementary Nodes

- **RAGNode**: Works well together in workflows
- **QANode**: Works well together in workflows
- **RecursiveCharacterTextSplitter**: Works well together in workflows
- **OllamaEmbeddings**: Works well together in workflows

