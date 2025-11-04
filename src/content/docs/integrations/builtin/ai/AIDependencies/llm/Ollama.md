---
title: Ollama
description: "Run AI models locally on your computer for complete privacy - no data sent to external services, no usage fees."
template: doc
tags: ["AI", "LLM", "Machine Learning", "Natural Language Processing", "Artificial Intelligence"]
---

# Ollama (Local AI Models)

## What It Does

Ollama lets you run powerful AI models directly on your computer instead of using cloud services. This means complete privacy (your data never leaves your machine), no ongoing costs, and the ability to work offline.

## What Goes In, What Comes Out

### Input
| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| `ollama_url` | Text | Where Ollama is running | Yes | "http://localhost:11434" |
| `model` | Text | Which AI model to use | Yes | - |
| `prompt` | Text | Instructions for the AI | Yes | - |
| `temperature` | Number | How creative the AI should be (0-1) | No | 0.7 |
| `max_tokens` | Number | Maximum response length | No | 1000 |

### Output
| Name | Type | Description |
|------|------|-------------|
| `response` | Text | AI-generated response |
| `model_info` | Object | Details about the model used |
| `processing_time` | Number | Time taken in milliseconds |
| `tokens_generated` | Number | Length of the response |

## Why Choose Local AI?

**🔒 Complete Privacy**: Your data never leaves your computer  
**💰 No Usage Fees**: No per-token charges or monthly subscriptions  
**🌐 Works Offline**: No internet required once models are downloaded  
**⚡ Fast Processing**: No network delays, just local processing speed  
**🎛️ Full Control**: Choose exactly which models to use

## How It Works

```mermaid
flowchart LR
    A[🖥️ Your Computer] --> B[🤖 Ollama Server]
    B --> C[🧠 AI Model]
    C --> D[✨ Local Response]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e8
```

**Simple Setup Process:**
1. **Install Ollama** on your computer (one-time setup)
2. **Download AI models** you want to use (like Llama2, Mistral)
3. **Connect workflows** to your local Ollama server
4. **Process with privacy** - everything stays on your machine

## Popular Models to Try

**🌱 Beginner-Friendly**:
- **Llama2:7b** - Good balance of speed and quality
- **Mistral:7b** - Fast and efficient for most tasks

**🚀 More Powerful**:
- **Llama2:13b** - Better quality, needs more RAM
- **CodeLlama:7b** - Specialized for code analysis

**🎯 Specialized**:
- **Mistral:instruct** - Great for following instructions
- **Llama2:chat** - Optimized for conversations

## Quick Setup Guide

### 1. Install Ollama
Download from [ollama.com](https://ollama.com) and install on your computer

### 2. Download a Model
Open terminal and run:
```bash
ollama pull llama2:7b
```

### 3. Start Ollama
```bash
ollama serve
```

### 4. Configure in Workflow
- **Ollama URL**: `http://localhost:11434` (default)
- **Model**: `llama2:7b` (or whichever you downloaded)
- **Temperature**: `0.3` for consistent results, `0.7` for creative content

## Configuration Tips

**For Consistent Results** (data extraction, analysis):
```json
{
  "model": "llama2:7b",
  "temperature": 0.1,
  "max_tokens": 500
}
```

**For Creative Content** (writing, brainstorming):
```json
{
  "model": "llama2:7b", 
  "temperature": 0.8,
  "max_tokens": 1000
}
```

**For Code Analysis**:
```json
{
  "model": "codellama:7b",
  "temperature": 0.2,
  "max_tokens": 800
}
```

## Browser Compatibility

Works in all major browsers:
- ✅ **Chrome**: Full support including streaming
- ✅ **Firefox**: Full support  
- ⚠️ **Safari**: Limited streaming support
- ✅ **Edge**: Full support

## System Requirements

**Minimum**:
- 8GB RAM (for 7b models)
- 4GB free disk space
- Modern CPU (2018+)

**Recommended**:
- 16GB+ RAM (for 13b+ models)
- 10GB+ free disk space
- GPU support (optional, for faster processing)

## Try It Yourself

### Example 1: Private Document Analysis

**What you'll build**: Analyze sensitive documents without sending data to external services

**Workflow**:
```
Get All Text From Link → Ollama → Edit Fields → Download As File
```

**Setup**:
- **Model**: `llama2:7b`
- **Prompt**: "Analyze this document and extract the key points: {content}"
- **Temperature**: 0.3

**Result**: Detailed analysis of your documents with complete privacy.

### Example 2: Offline Content Generation

**What you'll build**: Generate content even without internet connection

**Workflow**:
```
Manual Input → Ollama → Edit Fields → Download As File
```

**Setup**:
- **Model**: `mistral:7b`
- **Prompt**: "Write a professional email about: {topic}"
- **Temperature**: 0.7

**Result**: High-quality content generation that works anywhere.

<details>
<summary>🔍 Advanced Example: Code Analysis</summary>

**What you'll build**: Analyze code for bugs and improvements

**Setup**:
- **Model**: `codellama:7b`
- **Prompt**: "Review this code for potential issues and suggest improvements: {code}"
- **Temperature**: 0.2

**Use case**: Private code review without sending proprietary code to external services.

</details>



## Best Practices

### ✅ Do This
- **Start with smaller models** (7b) to test, then upgrade if needed
- **Use appropriate temperature**: 0.1-0.3 for analysis, 0.7+ for creativity
- **Monitor system resources**: Check RAM and CPU usage
- **Keep models updated**: Download newer versions when available

### ❌ Avoid This
- Running multiple large models simultaneously (uses too much RAM)
- Using very high temperatures for factual tasks
- Ignoring system resource warnings
- Trying to run models larger than your RAM capacity

## Troubleshooting

### 🚫 "Connection Failed" Error
**Problem**: Can't connect to Ollama server  
**Solution**: Make sure Ollama is running (`ollama serve`) and check the URL is correct

### 📥 "Model Not Found" Error
**Problem**: Specified model isn't available  
**Solution**: Download the model first: `ollama pull llama2:7b`

### 🐌 Very Slow Processing
**Problem**: AI responses take too long  
**Solution**: Try a smaller model (7b instead of 13b) or check if your system has enough RAM

### 💾 "Out of Memory" Error
**Problem**: System runs out of RAM  
**Solution**: Close other applications or use a smaller model

## Model Recommendations

### 🌱 Getting Started
- **llama2:7b** - Good balance of quality and speed
- **mistral:7b** - Fast and efficient

### 🚀 Better Quality (needs more RAM)
- **llama2:13b** - Higher quality responses
- **mistral:instruct** - Great at following instructions

### 🎯 Specialized Tasks
- **codellama:7b** - Code analysis and generation
- **llama2:chat** - Conversational AI

## Related Nodes

### 🔗 Works Great With
- **Basic LLM Chain**: Uses Ollama as the AI engine
- **RAG Node**: Can use Ollama for local knowledge processing
- **Q&A Node**: Uses Ollama for question answering

### 🔄 Alternative Options
- **WbeLLM**: For cloud-based AI services (OpenAI, Anthropic)

## What's Next?

### 🌱 New to Local AI?
1. **Install Ollama** from [ollama.com](https://ollama.com)
2. **Download a model**: `ollama pull llama2:7b`
3. **Start the server**: `ollama serve`
4. **Try it in a workflow** with Basic LLM Chain

### 🚀 Ready for More?
- Explore [Basic LLM Chain](/integrations/builtin/ai/AIAgents/BasicLLMChainNode) to use Ollama in workflows
- Try [RAG Node](/integrations/builtin/ai/AIAgents/RAGNode) for document-based AI
- Check out [AI workflow examples](/learning/examples/)

---

**💡 Pro Tip**: Start with `llama2:7b` - it's a good balance of quality and system requirements. You can always upgrade to larger models later if you need better performance.

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


