---
contentType: overview
title: LangChain in Agentic Workflow Studio
description: Understand how Agentic Workflow Studio uses LangChain to provide advanced AI functionality in browser environments.
hide:
  - toc
---

# LangChain in Agentic Workflow Studio

Agentic Workflow Studio provides a collection of nodes that implement LangChain's functionality optimized for browser environments. The LangChain nodes are configurable, meaning you can choose your preferred agent, LLM, memory, and so on. Alongside the LangChain nodes, you can connect browser extension nodes for web content manipulation: this means you can integrate your LangChain logic with web content, selected text, and browser context data.

* [Learning resources](/advanced-ai/langchain/langchain-learning-resources.md): Agentic Workflow Studio's documentation for LangChain assumes you're familiar with AI and LangChain concepts. This page provides links to learning resources.
* [LangChain concepts and features in Agentic Workflow Studio](/advanced-ai/langchain/langchain-Agentic Workflow Studio.md): how Agentic Workflow Studio represents LangChain concepts and features for browser-based workflows.

## Browser Environment Considerations

When using LangChain in browser environments, there are specific considerations and limitations:

### Browser Security Limitations
- **CORS Restrictions**: Some AI model APIs may have cross-origin restrictions when called from browser extensions
- **API Key Security**: Store API keys securely using browser extension storage APIs
- **Content Security Policy**: Some websites may restrict AI model API calls due to CSP headers

### Browser-Compatible AI Models
- **Client-Side Models**: Use WebAssembly-based models for local processing when possible
- **API-Based Models**: Leverage cloud-based AI services that support browser requests
- **Streaming Support**: Implement streaming responses for better user experience in browser context

### Browser Extension Integration Patterns
- **Content Script Integration**: Use LangChain workflows triggered by content script interactions
- **Background Processing**: Run AI workflows in background scripts for better performance
- **User Context Awareness**: Leverage browser context (current page, selected text) in AI workflows
