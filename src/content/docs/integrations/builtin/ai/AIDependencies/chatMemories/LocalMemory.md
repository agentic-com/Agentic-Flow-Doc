---
title: Local Memory
description: "Give your AI a memory - stores conversation history locally so AI remembers previous interactions and maintains context."
template: doc
tags: ["AI", "LLM", "Machine Learning", "Natural Language Processing", "Artificial Intelligence"]
---

# Local Memory (AI Memory)

## What It Does

Local Memory gives your AI workflows the ability to remember previous conversations and maintain context over time. It's like giving your AI assistant a notebook to remember what you've talked about before.

## What Goes In, What Comes Out

### Input
| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| `memory_key` | Text | Unique identifier for this conversation | Yes | - |
| `action` | Text | What to do: store, retrieve, clear | Yes | - |
| `message` | Object | Message to store (for store action) | No | - |
| `max_messages` | Number | Maximum messages to remember | No | 50 |

### Output
| Name | Type | Description |
|------|------|-------------|
| `conversation_history` | Array | Previous messages in the conversation |
| `context` | Text | Formatted context for AI |
| `memory_stats` | Object | Information about stored messages |

## Why Use AI Memory?

**🧠 Maintains Context**: AI remembers what you've discussed before  
**🔒 Private Storage**: All conversation history stays in your browser  
**💬 Better Conversations**: AI can reference previous interactions  
**⚡ Fast Access**: Instant retrieval of conversation history  
**🗂️ Organized**: Separate memory for different conversations or topics

## How It Works

```mermaid
flowchart LR
    A[💬 Conversation] --> B[💾 Store Memory]
    B --> C[🧠 Remember Context]
    C --> D[🤖 Smarter AI]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e8
```

**Simple Process:**
1. **Save Conversations**: Stores what you and the AI have discussed
2. **Remember Context**: Keeps track of the conversation flow
3. **Retrieve When Needed**: AI can look back at previous messages
4. **Better Responses**: AI gives more relevant answers based on history

## Perfect For

**💬 Chatbots**: AI assistants that remember your preferences  
**🎓 Learning Systems**: AI tutors that track your progress  
**🛠️ Support Systems**: Help systems that remember your previous issues  
**📝 Content Creation**: AI writers that maintain consistent tone and context

- **IndexedDB Storage**: Utilizes browser's IndexedDB for efficient, persistent local storage
- **Conversation Context**: Maintains conversation threads and context for AI interactions
- **Memory Retrieval**: Provides relevant conversation history for AI context enhancement
- **Privacy Protection**: All memory data stays local in the user's browser
- **Automatic Cleanup**: Configurable memory retention and cleanup policies

### Primary Use Cases

- **Persistent AI Conversations**: Maintain context across multiple AI interactions
- **Workflow State Management**: Store intermediate results and context between workflow steps
- **User Preference Storage**: Remember user preferences and interaction patterns
- **Session Continuity**: Restore conversation context after browser restarts
- **Multi-Turn Dialogues**: Enable complex, context-aware AI conversations

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `memory_key` | `string` | Unique identifier for this memory instance | `"user_chat_session"` |
| `storage_name` | `string` | Name of the IndexedDB database to use | `"ai_memory_db"` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `max_messages` | `number` | `100` | Maximum number of messages to store | `50` |
| `retention_days` | `number` | `30` | Days to retain memory before cleanup | `7` |
| `context_window` | `number` | `10` | Number of recent messages to include in context | `5` |
| `auto_cleanup` | `boolean` | `true` | Enable automatic cleanup of old memories | `false` |
| `compression` | `boolean` | `false` | Compress stored messages to save space | `true` |

### Advanced Configuration

```json
{
  "memory_key": "customer_support_session",
  "storage_name": "support_memory_db",
  "max_messages": 200,
  "retention_days": 14,
  "context_window": 8,
  "auto_cleanup": true,
  "compression": true,
  "metadata_storage": true,
  "encryption": {
    "enabled": false,
    "key_derivation": "pbkdf2"
  }
}
```

## Browser API Integration

### Required Permissions

| Permission | Purpose | Security Impact |
|------------|---------|-----------------|
| `storage` | Access IndexedDB for persistent memory storage | Stores conversation data locally in browser |
| `unlimitedStorage` | Store large amounts of conversation history | Allows storage beyond normal quota limits |

### Browser APIs Used

- **IndexedDB API**: Primary storage mechanism for conversation memory and context
- **Web Workers**: Background processing for memory operations without UI blocking
- **Compression API**: Optional data compression to optimize storage usage

### Cross-Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| IndexedDB Storage | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Memory Compression | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |
| Background Processing | ✅ Full | ✅ Full | ✅ Full | ✅ Full |

### Security Considerations

- **Local Data Protection**: All memory data is stored locally and never transmitted
- **Data Encryption**: Optional encryption for sensitive conversation data
- **Access Control**: Memory access is restricted to the originating workflow
- **Automatic Cleanup**: Configurable data retention prevents indefinite storage
- **Privacy Compliance**: No external data transmission ensures privacy compliance

## Input/Output Specifications

### Input Data Structure

```json
{
  "action": "string - Action to perform: store, retrieve, clear, update",
  "message": {
    "role": "string - Message role: user, assistant, system",
    "content": "string - Message content",
    "timestamp": "string - Message timestamp",
    "metadata": "object - Additional message metadata"
  },
  "query": {
    "context_length": "number - Number of messages to retrieve",
    "filter": "object - Filters for message retrieval",
    "search_term": "string - Search within stored messages"
  }
}
```

### Output Data Structure

```json
{
  "success": "boolean - Whether the operation completed successfully",
  "messages": [
    {
      "id": "string - Unique message identifier",
      "role": "string - Message role (user, assistant, system)",
      "content": "string - Message content",
      "timestamp": "2024-01-15T10:30:00Z",
      "metadata": {
        "source": "string - Message source",
        "tokens": "number - Token count if applicable",
        "confidence": "number - Confidence score if applicable"
      }
    }
  ],
  "context": "string - Formatted context for AI consumption",
  "statistics": {
    "total_messages": "number - Total messages in memory",
    "storage_used": "number - Storage space used in bytes",
    "oldest_message": "string - Timestamp of oldest message",
    "newest_message": "string - Timestamp of newest message"
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "processing_time": 45,
    "source": "local_memory"
  }
}
```

## Practical Examples

### Example 1: Storing AI Conversation

**Scenario**: Store a user question and AI response for future context

**Configuration**:
```json
{
  "memory_key": "user_chat_session",
  "storage_name": "ai_chat_db",
  "max_messages": 50,
  "context_window": 5,
  "auto_cleanup": true
}
```

**Input Data**:
```json
{
  "action": "store",
  "message": {
    "role": "user",
    "content": "What are the benefits of using AI in customer service?",
    "timestamp": "2024-01-15T10:00:00Z",
    "metadata": {
      "source": "web_chat",
      "session_id": "session_123"
    }
  }
}
```

**Expected Output**:
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg_001",
      "role": "user",
      "content": "What are the benefits of using AI in customer service?",
      "timestamp": "2024-01-15T10:00:00Z",
      "metadata": {
        "source": "web_chat",
        "session_id": "session_123"
      }
    }
  ],
  "context": "User: What are the benefits of using AI in customer service?",
  "statistics": {
    "total_messages": 1,
    "storage_used": 156,
    "oldest_message": "2024-01-15T10:00:00Z",
    "newest_message": "2024-01-15T10:00:00Z"
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "processing_time": 45,
    "source": "local_memory"
  }
}
```

**Step-by-Step Process**:
1. Message is validated and formatted for storage
2. IndexedDB transaction is created for the specified memory key
3. Message is stored with automatic ID generation and indexing
4. Storage statistics are updated and returned
5. Context is formatted for potential AI consumption

### Example 2: Retrieving Conversation Context

**Scenario**: Retrieve recent conversation history to provide context for AI response

**Configuration**:
```json
{
  "memory_key": "user_chat_session",
  "storage_name": "ai_chat_db",
  "context_window": 5
}
```

**Input Data**:
```json
{
  "action": "retrieve",
  "query": {
    "context_length": 5,
    "filter": {
      "role": ["user", "assistant"]
    }
  }
}
```

**Workflow Integration**:
```
Local Memory → Basic LLM Chain → Local Memory
     ↓              ↓               ↓
retrieve_context  ai_processing  store_response
```

**Complete Example**:
This pattern enables persistent AI conversations where each interaction builds on previous context, creating more natural and coherent dialogue experiences.

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the LocalMemory node in a typical workflow scenario.

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

1. **Previous Node** → **LocalMemory** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Persistent AI Chat

- **Nodes**: Local Memory → Basic LLM Chain → Local Memory
- **Use Case**: Maintain conversation context across AI interactions
- **Configuration Tips**: Use appropriate context_window size for your AI model's capabilities

#### Pattern 2: Workflow State Management

- **Nodes**: GetAllTextFromLink → Local Memory → RAG Node → Local Memory
- **Use Case**: Store intermediate results and maintain workflow state
- **Data Flow**: Content extraction → State storage → AI processing → Result storage

### Best Practices

- **Performance**: Use appropriate max_messages limits to balance context and performance
- **Error Handling**: Implement fallback strategies for IndexedDB failures
- **Data Validation**: Validate message format and content before storage
- **Resource Management**: Monitor storage usage and implement cleanup policies

## Troubleshooting

### Common Issues

#### Issue: IndexedDB Storage Failures

- **Symptoms**: Memory operations fail with storage errors or quota exceeded messages
- **Causes**: Browser storage quota exceeded, IndexedDB corruption, or permission issues
- **Solutions**:
  1. Implement automatic cleanup to manage storage usage
  2. Reduce max_messages or enable compression
  3. Clear browser data and reinitialize storage
  4. Check browser storage permissions and quotas
- **Prevention**: Monitor storage usage and implement proactive cleanup policies

#### Issue: Memory Context Too Large

- **Symptoms**: AI responses are slow or fail due to context size limits
- **Causes**: Context window too large for AI model token limits
- **Solutions**:
  1. Reduce context_window parameter
  2. Implement intelligent context summarization
  3. Filter messages by relevance or recency
  4. Use compression to reduce context size
- **Prevention**: Match context window size to AI model capabilities

### Browser-Specific Issues

#### Chrome

- Storage quota management may require user permission for unlimited storage
- Use chrome.storage.local as fallback for extension-specific storage

#### Firefox

- IndexedDB performance may vary; implement timeout handling
- Consider storage.local API for smaller memory requirements

### Performance Issues

- **Slow Retrieval**: Large message histories may slow context retrieval; implement indexing
- **Memory Usage**: Uncompressed storage may consume significant browser memory
- **Cleanup Performance**: Large cleanup operations may block UI; use background processing

## Limitations & Constraints

### Technical Limitations

- **Storage Quotas**: Browser storage limits may restrict memory capacity
- **Context Size**: Large conversation histories may exceed AI model token limits
- **Performance Impact**: Frequent memory operations may affect browser performance

### Browser Limitations

- **Storage Persistence**: Browser data clearing will remove all stored memories
- **Cross-Tab Sharing**: Memory is isolated per browser tab/window by default
- **Offline Access**: Requires browser storage APIs to be available

### Data Limitations

- **Message Size**: Very large messages may impact storage and retrieval performance
- **Retention Limits**: Automatic cleanup may remove important conversation context
- **Search Capabilities**: Basic search functionality compared to dedicated databases

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

