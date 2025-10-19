---
title: Basic LLM Chain
description: "Create simple AI-powered workflows with direct LLM integration for text processing and content generation in browser contexts."
template: doc
tags: ["AI", "LLM", "Machine Learning", "Natural Language Processing", "Artificial Intelligence"]
---

# Basic LLM Chain

## Overview

The Basic LLM Chain node provides a straightforward interface for integrating Large Language Models (LLMs) into your browser-based workflows. This node serves as the foundation for AI-powered text processing, content generation, and intelligent automation tasks that leverage the power of modern language models directly within web contexts.

### Purpose and Functionality

The Basic LLM Chain node creates a direct connection between your workflow data and LLM capabilities, enabling:

- Direct text processing and transformation using AI models
- Content generation based on structured prompts and input data
- Integration of AI reasoning into browser automation workflows
- Simple prompt-response patterns for various text-based tasks
- Browser context-aware AI processing with web page data integration

### Key Features

- **Direct LLM Integration**: Connect to various LLM providers with minimal configuration
- **Prompt Template System**: Use dynamic prompts with variable substitution from workflow data
- **Browser Context Awareness**: Process web page content and user interactions with AI
- **Flexible Output Formatting**: Configure response structure and data types
- **Error Handling**: Robust error management for API failures and rate limiting

### Primary Use Cases

- **Content Summarization**: Process web page content and generate concise summaries
- **Data Extraction**: Use AI to extract structured information from unstructured text
- **Content Generation**: Create new content based on templates and input parameters
- **Text Classification**: Categorize and analyze text content from web sources
- **Language Translation**: Translate content extracted from web pages

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `llm` | `LLM Connection` | The LLM model connection to use for processing | `OpenAI GPT-4` |
| `prompt` | `string` | The prompt template with variable placeholders | `"Summarize this text: {input_text}"` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `temperature` | `number` | `0.7` | Controls randomness in AI responses (0.0-1.0) | `0.3` |
| `max_tokens` | `number` | `1000` | Maximum number of tokens in the response | `500` |
| `system_message` | `string` | `""` | System-level instructions for the AI model | `"You are a helpful assistant"` |
| `output_format` | `string` | `"text"` | Expected output format (text, json, markdown) | `"json"` |

### Advanced Configuration

```json
{
  "llm": "OpenAI GPT-4",
  "prompt": "Analyze this web content and extract key information: {content}",
  "temperature": 0.3,
  "max_tokens": 800,
  "system_message": "You are an expert content analyzer. Provide structured, accurate analysis.",
  "output_format": "json",
  "retry_attempts": 3,
  "timeout": 30000
}
```

## Browser API Integration

### Required Permissions

| Permission | Purpose | Security Impact |
|------------|---------|-----------------|
| `activeTab` | Access current tab content for AI processing | Can read content from the active browser tab |
| `storage` | Cache AI responses and configuration | Stores data locally in browser extension storage |

### Browser APIs Used

- **Chrome Extension APIs**: Utilizes chrome.tabs and chrome.storage for content access and caching
- **Fetch API**: Makes secure HTTPS requests to LLM provider endpoints
- **Web Workers**: Processes large text content without blocking the browser UI

### Cross-Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| LLM Integration | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |
| Content Processing | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Response Caching | ✅ Full | ✅ Full | ❌ None | ✅ Full |

### Security Considerations

- **API Key Protection**: LLM API keys are stored securely in browser extension storage
- **Content Privacy**: Web page content is processed through secure HTTPS connections
- **Cross-Origin Restrictions**: Respects CORS policies when accessing external LLM services
- **Data Retention**: AI responses can be configured to not persist sensitive information
- **Rate Limiting**: Built-in protection against API abuse and excessive requests

## Input/Output Specifications

### Input Data Structure

```json
{
  "input_text": "string - The main text content to process",
  "variables": {
    "custom_var1": "string - Additional variables for prompt substitution",
    "custom_var2": "string - Context-specific data"
  },
  "metadata": {
    "source_url": "string - URL of the source page (if applicable)",
    "timestamp": "string - When the content was extracted"
  }
}
```

### Output Data Structure

```json
{
  "response": "string - The AI-generated response text",
  "tokens_used": "number - Number of tokens consumed in the request",
  "model_info": {
    "model_name": "string - The specific model used",
    "temperature": "number - Temperature setting used",
    "max_tokens": "number - Token limit applied"
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "processing_time": 1250,
    "source": "basic_llm_chain"
  }
}
```

## Practical Examples

### Example 1: Web Content Summarization

**Scenario**: Extract and summarize the main content from a web page for quick review

**Configuration**:
```json
{
  "llm": "OpenAI GPT-4",
  "prompt": "Summarize the following web content in 3-4 sentences, focusing on key points: {content}",
  "temperature": 0.3,
  "max_tokens": 200,
  "system_message": "You are a content summarization expert. Provide clear, concise summaries."
}
```

**Input Data**:
```json
{
  "input_text": "The latest developments in artificial intelligence have shown remarkable progress in natural language processing. Companies are increasingly adopting AI solutions for customer service, content creation, and data analysis. However, concerns about AI safety and ethical implications continue to grow among researchers and policymakers.",
  "metadata": {
    "source_url": "https://example.com/ai-news",
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

**Expected Output**:
```json
{
  "response": "Recent AI advances have significantly improved natural language processing capabilities. Businesses are widely implementing AI for customer service, content creation, and data analysis. Despite these benefits, growing concerns about AI safety and ethics persist among experts and regulators.",
  "tokens_used": 45,
  "model_info": {
    "model_name": "gpt-4",
    "temperature": 0.3,
    "max_tokens": 200
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "processing_time": 1250,
    "source": "basic_llm_chain"
  }
}
```

**Step-by-Step Process**:
1. Web content is extracted using a content extraction node
2. Content is passed to the Basic LLM Chain with summarization prompt
3. AI processes the content and generates a concise summary
4. Summary is returned with metadata for further workflow processing

### Example 2: Structured Data Extraction

**Scenario**: Extract contact information from a business website in structured format

**Configuration**:
```json
{
  "llm": "OpenAI GPT-4",
  "prompt": "Extract contact information from this text and return as JSON with fields: name, email, phone, address. If any field is not found, use null: {content}",
  "temperature": 0.1,
  "max_tokens": 300,
  "output_format": "json"
}
```

**Workflow Integration**:
```
GetHTMLFromLink → Basic LLM Chain → EditFields
     ↓                    ↓              ↓
  raw_html         structured_data   formatted_output
```

**Complete Example**:
This pattern is commonly used for lead generation workflows where business information needs to be extracted and formatted for CRM systems.

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Content Analysis Pipeline
- **Nodes**: GetAllTextFromLink → Basic LLM Chain → EditFields
- **Use Case**: Extract and analyze web content for insights and structured data
- **Configuration Tips**: Use low temperature (0.1-0.3) for consistent extraction results

#### Pattern 2: Multi-Step AI Processing
- **Nodes**: Basic LLM Chain → Filter → Basic LLM Chain (second instance)
- **Use Case**: First chain extracts data, filter validates, second chain refines output
- **Data Flow**: Raw content → Initial processing → Validation → Final refinement

### Best Practices

- **Performance**: Use appropriate max_tokens limits to balance response quality and speed
- **Error Handling**: Implement retry logic for API failures and rate limiting scenarios
- **Data Validation**: Validate AI responses before passing to subsequent nodes
- **Resource Management**: Monitor token usage to manage API costs effectively

## Troubleshooting

### Common Issues

#### Issue: API Rate Limiting

- **Symptoms**: Requests failing with 429 status codes or rate limit errors
- **Causes**: Too many requests in a short time period, exceeded quota limits
- **Solutions**:
  1. Implement exponential backoff retry logic
  2. Reduce request frequency in workflow timing
  3. Check API quota and upgrade plan if necessary
- **Prevention**: Monitor API usage and implement request throttling

#### Issue: Inconsistent AI Responses

- **Symptoms**: Varying output formats or quality between similar inputs
- **Causes**: High temperature settings, ambiguous prompts, insufficient context
- **Solutions**:
  1. Lower temperature to 0.1-0.3 for consistent results
  2. Refine prompt with specific format instructions
  3. Add system message with clear guidelines
- **Prevention**: Test prompts thoroughly and use structured output formats

### Browser-Specific Issues

#### Chrome
- Content Security Policy may block some LLM provider connections
- Use manifest v3 compatible API calls for extension integration

#### Firefox
- WebRequest API differences may affect request monitoring
- Ensure proper CORS handling for cross-origin LLM requests

### Performance Issues

- **Slow Processing**: Large content may exceed token limits; implement text chunking
- **Memory Usage**: Cache frequently used responses to reduce API calls
- **Rate Limiting**: Implement queue system for high-volume workflows

## Limitations & Constraints

### Technical Limitations

- **Token Limits**: Most LLMs have maximum token limits per request (typically 4K-32K)
- **Response Time**: AI processing can take 1-10 seconds depending on complexity
- **API Dependencies**: Requires stable internet connection and LLM service availability

### Browser Limitations

- **Content Security Policy**: Some websites may block AI service connections
- **Cross-Origin Requests**: CORS policies may limit access to certain LLM providers
- **Storage Limits**: Browser extension storage has size constraints for caching

### Data Limitations

- **Input Size**: Large documents may need to be chunked before processing
- **Output Format**: AI responses may not always follow exact format specifications
- **Processing Time**: Complex analysis tasks may timeout in browser environments

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

### Skill Level: Beginner

**Next Steps:**
- Explore [QANode](/integration/builtin/ai/qanode)
- Explore [RAGNode](/integration/builtin/ai/ragnode)
- Explore [ToolsAgentNode](/integration/builtin/ai/toolsagentnode)

**Alternatives to Consider:**
- QANode
- RAGNode


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

- **QANode**: Use when you need question-answering with knowledge base integration
- **RAGNode**: Use when you need retrieval-augmented generation with vector search

### Complementary Nodes

- **GetAllTextFromLink**: Provides web content for AI processing
- **EditFields**: Formats and structures AI responses for further use
- **Filter**: Validates AI responses before downstream processing

### Required Dependencies

- **Ollama**: Local LLM provider for AI processing
- **WbeLLM**: Web-based LLM provider for cloud AI services

### Common Workflow Patterns

- **GetAllTextFromLink → BasicLLMChainNode → EditFields**: Extract web content, process with AI, and format results
- **Http-Request → BasicLLMChainNode → DownloadAsFile**: Common integration pattern

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

### Current Version: 1.2.0

- Added support for multiple LLM providers
- Improved error handling and retry logic
- Enhanced browser compatibility

### Previous Versions

- **1.1.0**: Added system message support and output formatting
- **1.0.0**: Initial release with basic LLM integration

## Additional Resources

- [AI Workflow Builder Tutorial](/advanced-ai/basics/ai-workflow-builder)
- [LangChain Integration Guide](/advanced-ai/langchain/langchain-n8n)
- [Browser AI Limitations](/advanced-ai/browser-ai-limitations)
- [AI Performance Optimization](/advanced-ai/performance-optimization)

---

**Last Updated**: October 19, 2024  
**Tested With**: Browser Extension v2.1.0  
**Validation Status**: ✅ Code Examples Tested | ✅ Browser Compatibility Verified | ✅ User Tested