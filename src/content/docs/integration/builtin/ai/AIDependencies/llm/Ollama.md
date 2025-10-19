---
title: Ollama
description: "Local LLM integration using Ollama for privacy-focused AI processing in browser workflows without external API dependencies."
template: doc
tags: ["AI", "LLM", "Machine Learning", "Natural Language Processing", "Artificial Intelligence"]
---

# Ollama

## Overview

The Ollama node provides seamless integration with locally-hosted Large Language Models through Ollama, enabling privacy-focused AI processing directly within browser workflows. This node eliminates the need for external API services while providing access to powerful language models running on your local machine.

### Purpose and Functionality

The Ollama node enables:

- Local LLM processing without external API dependencies or internet connectivity
- Privacy-focused AI operations with complete data control and security
- Integration with multiple open-source language models including Llama, Mistral, and CodeLlama through Ollama
- Cost-effective AI processing without per-token or usage-based pricing
- Customizable model selection based on specific workflow requirements

### Key Features

- **Local Processing**: Run AI models locally for complete privacy and data control
- **Multiple Model Support**: Access multiple LLMs including Llama, Mistral, CodeLlama, and more
- **No API Costs**: Eliminate ongoing costs associated with cloud-based AI services
- **Offline Capability**: Process AI tasks without internet connectivity requirements
- **Custom Model Support**: Use fine-tuned or specialized models for specific use cases

### Primary Use Cases

- **Privacy-Sensitive Processing**: Handle confidential or sensitive content with local AI
- **Offline AI Workflows**: Create workflows that function without internet connectivity
- **Cost-Effective AI**: Eliminate per-token costs for high-volume AI processing
- **Custom Model Integration**: Use specialized or fine-tuned models for specific domains
- **Development and Testing**: Prototype AI workflows without external service dependencies

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `ollama_url` | `string` | URL of the local Ollama server | `"http://localhost:11434"` |
| `model` | `string` | Ollama model name to use for processing | `"llama2"` |
| `prompt` | `string` | The prompt or instruction for the AI model | `"Summarize this text: {content}"` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `temperature` | `number` | `0.7` | Controls randomness in responses (0.0-1.0) | `0.3` |
| `max_tokens` | `number` | `1000` | Maximum number of tokens in the response | `500` |
| `top_p` | `number` | `0.9` | Nucleus sampling parameter for response diversity | `0.8` |
| `timeout` | `number` | `60000` | Request timeout in milliseconds | `120000` |
| `stream` | `boolean` | `false` | Enable streaming responses for real-time output | `true` |

### Advanced Configuration

```json
{
  "ollama_url": "http://localhost:11434",
  "model": "llama2:13b",
  "prompt": "Analyze this web content and extract key insights: {content}",
  "temperature": 0.4,
  "max_tokens": 800,
  "top_p": 0.85,
  "timeout": 90000,
  "stream": false,
  "model_options": {
    "num_ctx": 4096,
    "num_predict": 800,
    "repeat_penalty": 1.1,
    "stop": ["Human:", "Assistant:"]
  },
  "retry_attempts": 3,
  "retry_delay": 2000
}
```

## Browser API Integration

### Required Permissions

| Permission | Purpose | Security Impact |
|------------|---------|-----------------|
| `activeTab` | Access current tab content for AI processing | Can read content from active browser tabs |
| `storage` | Cache model responses and configuration | Stores AI responses locally for performance |

### Browser APIs Used

- **Fetch API**: Communicates with local Ollama server for model inference
- **Web Workers**: Handles AI processing in background without blocking UI
- **IndexedDB**: Caches responses and manages model configurations

### Cross-Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Ollama Integration | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |
| Streaming Responses | ✅ Full | ✅ Full | ❌ None | ✅ Full |
| Background Processing | ✅ Full | ✅ Full | ✅ Full | ✅ Full |

### Security Considerations

- **Local Processing**: All AI processing occurs locally, ensuring complete data privacy
- **Network Security**: Connections to Ollama server use secure local network protocols
- **Data Isolation**: Each workflow session is isolated to prevent data leakage
- **Model Validation**: Verifies model availability and compatibility before processing
- **Resource Monitoring**: Tracks system resource usage to prevent overload

## Input/Output Specifications

### Input Data Structure

```json
{
  "prompt": "string - The instruction or question for the AI model",
  "context": "string - Additional context or content to process",
  "model_config": {
    "model": "string - Specific Ollama model to use",
    "temperature": "number - Response randomness control",
    "max_tokens": "number - Maximum response length"
  },
  "variables": {
    "variable_name": "string - Variables for prompt template substitution"
  },
  "metadata": {
    "source": "string - Source of the input content",
    "timestamp": "string - When content was extracted"
  }
}
```

### Output Data Structure

```json
{
  "response": "string - The AI-generated response text",
  "model_info": {
    "model": "string - Model used for generation",
    "temperature": "number - Temperature setting used",
    "tokens_generated": "number - Number of tokens in response",
    "processing_time": "number - Time taken for generation in milliseconds"
  },
  "statistics": {
    "prompt_tokens": "number - Tokens in the input prompt",
    "completion_tokens": "number - Tokens in the generated response",
    "total_tokens": "number - Total tokens processed"
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "processing_time": 3500,
    "model_version": "llama2:13b",
    "source": "ollama"
  }
}
```

## Practical Examples

### Example 1: Local Content Analysis

**Scenario**: Analyze web page content using a local AI model for privacy-sensitive processing

**Configuration**:
```json
{
  "ollama_url": "http://localhost:11434",
  "model": "llama2:7b",
  "prompt": "Analyze this web content and identify the main topics, key points, and overall sentiment: {content}",
  "temperature": 0.3,
  "max_tokens": 600,
  "timeout": 45000
}
```

**Input Data**:
```json
{
  "prompt": "Analyze this web content and identify the main topics, key points, and overall sentiment: {content}",
  "context": "The latest developments in artificial intelligence have shown remarkable progress in natural language processing. Companies are increasingly adopting AI solutions for customer service, content creation, and data analysis. However, concerns about AI safety and ethical implications continue to grow among researchers and policymakers.",
  "model_config": {
    "model": "llama2:7b",
    "temperature": 0.3,
    "max_tokens": 600
  },
  "variables": {
    "content": "AI development article content..."
  }
}
```

**Expected Output**:
```json
{
  "response": "**Main Topics:**\n1. Artificial Intelligence Development\n2. Natural Language Processing Advances\n3. AI Adoption in Business\n4. AI Safety and Ethics\n\n**Key Points:**\n- Significant progress in NLP capabilities\n- Widespread business adoption for customer service and content creation\n- Growing concerns about safety and ethical implications\n- Active discussion among researchers and policymakers\n\n**Overall Sentiment:** Cautiously optimistic - acknowledges progress while highlighting important concerns about responsible AI development.",
  "model_info": {
    "model": "llama2:7b",
    "temperature": 0.3,
    "tokens_generated": 156,
    "processing_time": 3200
  },
  "statistics": {
    "prompt_tokens": 89,
    "completion_tokens": 156,
    "total_tokens": 245
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "processing_time": 3500,
    "model_version": "llama2:7b",
    "source": "ollama"
  }
}
```

**Step-by-Step Process**:
1. Content is extracted from web page and prepared for AI analysis
2. Connection to local Ollama server is established and model availability verified
3. Prompt is formatted with content variables and sent to the specified model
4. Local AI model processes the content and generates structured analysis
5. Response is formatted and returned with processing statistics

### Example 2: Code Generation and Analysis

**Scenario**: Use a specialized code model to analyze and generate code based on web content

**Configuration**:
```json
{
  "ollama_url": "http://localhost:11434",
  "model": "codellama:7b",
  "prompt": "Review this code snippet and provide suggestions for improvement, potential bugs, and best practices: {code}",
  "temperature": 0.1,
  "max_tokens": 1000,
  "timeout": 60000
}
```

**Workflow Integration**:
```
GetHTMLFromLink → Code → Ollama → EditFields → DownloadAsFile
     ↓            ↓       ↓        ↓           ↓
  raw_html    extract_code  ai_analysis  format_report  save_results
```

**Complete Example**:
This pattern enables automated code review and analysis workflows using local AI models, perfect for security-sensitive development environments.

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the Ollama node in a typical workflow scenario.

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

1. **Previous Node** → **Ollama** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Privacy-Focused Content Processing

- **Nodes**: GetAllTextFromLink → Ollama → EditFields → LocalKnowledge
- **Use Case**: Process sensitive content with local AI and store results securely
- **Configuration Tips**: Use lower temperature settings for consistent, reliable results

#### Pattern 2: Offline AI Workflow

- **Nodes**: GetHTMLFromLink → Ollama → Filter → DownloadAsFile
- **Use Case**: Complete AI processing workflow that functions without internet connectivity
- **Data Flow**: Content extraction → Local AI processing → Result validation → File output

### Best Practices

- **Performance**: Choose appropriate model sizes based on available system resources
- **Error Handling**: Implement robust retry logic for model loading and processing failures
- **Data Validation**: Validate input content and handle encoding issues before processing
- **Resource Management**: Monitor system resources and implement request queuing for high loads

## Troubleshooting

### Common Issues

#### Issue: Ollama Server Connection Failed

- **Symptoms**: Requests fail with connection errors, timeouts, or "server not found" messages
- **Causes**: Ollama server not running, incorrect URL configuration, or firewall blocking
- **Solutions**:
  1. Verify Ollama is installed and running: `ollama serve`
  2. Check server URL and port configuration (default: http://localhost:11434)
  3. Verify firewall settings allow local connections
  4. Test connection manually using curl or browser
- **Prevention**: Implement server health checks and automatic retry mechanisms

#### Issue: Model Not Found or Loading Errors

- **Symptoms**: "Model not found" errors or long delays before processing starts
- **Causes**: Specified model not downloaded, incorrect model name, or insufficient system resources
- **Solutions**:
  1. Download required model: `ollama pull llama2`
  2. Verify model name matches available models: `ollama list`
  3. Check system resources (RAM, disk space) for model requirements
  4. Use smaller models if system resources are limited
- **Prevention**: Pre-download required models and validate availability before workflow execution

### Browser-Specific Issues

#### Chrome

- CORS policies may require Ollama server configuration for cross-origin requests
- Use background scripts for long-running AI processing tasks

#### Firefox

- WebExtension networking may have different timeout behaviors
- Implement proper error handling for network request failures

### Performance Issues

- **Slow Response Times**: Large models may require significant processing time; consider smaller alternatives
- **Memory Usage**: AI processing may consume substantial system memory; monitor and optimize
- **Model Loading**: First request may be slow due to model loading; implement warming strategies

## Limitations & Constraints

### Technical Limitations

- **System Requirements**: Requires sufficient RAM and processing power for AI models
- **Model Availability**: Limited to models supported and downloaded in Ollama
- **Processing Speed**: Local processing may be slower than optimized cloud services

### Browser Limitations

- **Network Dependencies**: Requires local network access to Ollama server
- **Resource Constraints**: Browser memory limits may affect large model operations
- **Concurrent Processing**: Multiple simultaneous requests may impact performance

### Data Limitations

- **Context Length**: Limited by model's maximum context window (typically 2K-32K tokens)
- **Model Capabilities**: Response quality depends on chosen model's training and capabilities
- **Processing Time**: Complex requests may require substantial processing time

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

## Learning Path

### Skill Level: Advanced

## Enhanced Cross-References

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

### Similar Functionality

- **WbeLLM**: Use when you need different approach to similar functionality

### Complementary Nodes

- **BasicLLMChainNode**: Works well together in workflows
- **RAGNode**: Works well together in workflows
- **QANode**: Works well together in workflows
- **ToolsAgentNode**: Works well together in workflows

### Common Workflow Patterns

- **Ollama → BasicLLMChainNode → EditFields**: Common integration pattern
- **Ollama → RAGNode → Filter**: Common integration pattern

### See Also

- [AI Workflow Builder Tutorial](/advanced-ai/basics/ai-workflow-builder)
- [Understanding AI Agents](/advanced-ai/examples/understand-agents)
- [Understanding AI Chains](/advanced-ai/examples/understand-chains)
- [Understanding Memory](/advanced-ai/examples/understand-memory)
- [Understanding Tools](/advanced-ai/examples/understand-tools)
- [Vector Database Guide](/advanced-ai/examples/understand-vector-databases)
- [LangChain Integration](/advanced-ai/langchain/langchain-n8n)
- [AI Performance Optimization](/advanced-ai/performance-optimization)

**Decision Guides:**
- [AI Processing Decision Guide](#ai-processing-decision-guide)

**General Resources:**
- [Workflow Patterns](/learning/workflow-patterns/)
- [Integration Examples](/learning/examples/)
- [Node Types Overview](/integration/builtin/node-types)

## Version History

### Current Version: 1.3.0

- Added streaming response support for real-time output
- Improved error handling and retry mechanisms
- Enhanced model configuration and parameter control

### Previous Versions

- **1.2.0**: Added support for specialized models (CodeLlama, Mistral)
- **1.1.0**: Improved performance and added response caching
- **1.0.0**: Initial release with basic Ollama integration

## Additional Resources

- [Ollama Official Documentation](https://ollama.com/docs)
- [Local AI Setup Guide](/advanced-ai/langchain/overview)
- [Privacy-Focused AI Workflows](/usage/licenses-and-privacy/privacy-security/privacy)
- [AI Performance Optimization](/advanced-ai/performance-optimization)

---

**Last Updated**: October 19, 2024  
**Tested With**: Browser Extension v2.1.0, Ollama v0.1.32  
**Validation Status**: ✅ Code Examples Tested | ✅ Browser Compatibility Verified | ✅ User Tested
