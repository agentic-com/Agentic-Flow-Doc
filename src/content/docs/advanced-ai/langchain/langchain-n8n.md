---
contentType: explanation
title: LangChain concepts in Agentic Workflow Studio
description: How LangChain concepts map to Agentic Workflow Studio, and which browser extension nodes to use.
---

# LangChain concepts in Agentic Workflow Studio

This page explains how LangChain concepts and features map to Agentic Workflow Studio nodes for browser-based AI workflows.

This page includes lists of the LangChain-focused nodes in Agentic Workflow Studio. You can use any browser extension node in a workflow where you interact with LangChain, to link LangChain to web content and browser context manipulation. The LangChain features work seamlessly with browser extension capabilities.


/// note | Agentic Workflow Studio implements LangChain JS
This feature is Agentic Workflow Studio's implementation of [LangChain's JavaScript framework](https://js.langchain.com/docs/get_started/introduction) optimized for browser environments.
///

## Browser Extension Integration

Agentic Workflow Studio's LangChain implementation includes specialized browser extension nodes that enable AI workflows to interact with web content:

### Browser Context Nodes
- **Text Extraction Nodes**: Extract selected text or full page content for AI processing
- **HTML Processing Nodes**: Capture and analyze HTML structure with AI models
- **Link Collection Nodes**: Gather and process links for AI-powered navigation
- **Image Processing Nodes**: Collect and analyze images from web pages

### AI + Browser Workflow Patterns
- **Content Analysis**: Use LangChain agents to analyze web page content extracted via browser nodes
- **Smart Extraction**: Combine text splitters with browser content extraction for intelligent data processing
- **Context-Aware AI**: Leverage browser context (current page, selected text) to provide more relevant AI responses
- **Interactive Processing**: Create AI workflows that respond to user interactions with web content
## Browser Extension Trigger Patterns

Browser extension workflows can be triggered by various user interactions:

- **Content Selection**: Trigger AI workflows when users select text on web pages
- **Page Load**: Automatically process page content with AI when pages load
- **User Actions**: Respond to clicks, form submissions, or other browser events
- **Context Menu**: Provide AI-powered options in browser context menus

## AI Workflow Nodes

Agentic Workflow Studio provides AI nodes that work seamlessly with browser extension capabilities. These nodes can process web content extracted through browser context manipulation.

### Primary AI Nodes

These nodes form the core of AI workflows and can process data from browser extension nodes.

#### Chains

A [chain](/glossary.md#ai-chain) is a series of LLMs, and related tools, linked together to support functionality that can't be provided by a single LLM alone.

Available nodes:

* [Basic LLM Chain](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainllm.md)
* [Retrieval Q&A Chain](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainretrievalqa/index.md)
* [Summarization Chain](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainsummarization.md)
* [Sentiment Analysis](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.sentimentanalysis.md)
* [Text Classifier](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.text-classifier.md)

Learn more about [chaining in LangChain](https://js.langchain.com/docs/concepts/lcel).

#### Agents

> An [agent](/glossary.md#ai-agent){ data-preview} has access to a suite of tools, and determines which ones to use depending on the user input. Agents can use multiple tools, and use the output of one tool as the input to the next. [Source](https://github.com/langchain-ai/langchainjs/blob/def3a26c054575e1ed40b9062087e8c0a8899633/docs/core_docs/docs/modules/agents/index.mdx)

Available nodes:

* [Agent](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/index.md)

Learn more about [Agents in LangChain](https://js.langchain.com/docs/concepts/agents).

#### Vector stores

[Vector stores](/glossary.md#ai-vector-store) store embedded data, and perform vector searches on it.

* [Simple Vector Store](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoreinmemory.md)
* [PGVector Vector Store](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstorepgvector.md)
* [Pinecone Vector Store](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstorepinecone.md)
* [Qdrant Vector Store](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoreqdrant.md)
* [Supabase Vector Store](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoresupabase.md)
* [Zep Vector Store](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstorezep.md)

Learn more about [Vector stores in LangChain](https://js.langchain.com/docs/concepts/vectorstores/).

#### Miscellaneous

Utility nodes.

[LangChain Code](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.code.md): import LangChain. This means if there is functionality you need that Agentic Workflow Studio hasn't created a node for, you can still use it.

### Supporting AI Nodes

These nodes provide additional functionality and can be configured to work with browser-extracted content.

#### Document loaders

Document loaders add data to your chain as documents. In browser context, these work seamlessly with browser extension nodes to process web content.

**Browser Integration Patterns**:
- Use browser extension nodes to extract web content, then process with document loaders
- Combine text extraction nodes with document loaders for intelligent content processing
- Process selected text or full page content as documents for AI analysis

Available nodes:

* [Default Document Loader](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.documentdefaultdataloader.md) - Process browser-extracted content as documents
* [GitHub Document Loader](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.documentgithubloader.md) - Load GitHub content for AI processing

Learn more about [Document loaders in LangChain](https://js.langchain.com/docs/concepts/document_loaders).

#### Language models

[LLMs (large language models)](/glossary.md#large-language-model-llm) are programs that analyze datasets. They're the key element of working with AI.

Available nodes:

* [Anthropic Chat Model](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatanthropic.md)
* [AWS Bedrock Chat Model](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatawsbedrock.md)
* [Cohere Model](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmcohere.md)
* [Hugging Face Inference Model](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmopenhuggingfaceinference.md)
* [Mistral Cloud Chat Model](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatmistralcloud.md)
* [Ollama Chat Model](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatollama/index.md)
* [Ollama Model](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmollama/index.md)
* [OpenAI Chat Model](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatopenai/index.md)

Learn more about [Language models in LangChain](https://js.langchain.com/docs/concepts/chat_models).

#### Memory

[Memory](/glossary.md#ai-memory) retains information about previous queries in a series of queries. For example, when a user interacts with a chat model, it's useful if your application can remember and call on the full conversation, not just the most recent query entered by the user.

Available nodes:

* [Motorhead](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorymotorhead.md)
* [Redis Chat Memory](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memoryredischat.md)
* [Postgres Chat Memory](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorypostgreschat.md) 
* [Simple Memory](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorybufferwindow/index.md)
* [Xata](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memoryxata.md)
* [Zep](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memoryzep.md)

Learn more about [Memory in LangChain](https://langchain-ai.github.io/langgraphjs/concepts/memory/).

#### Output parsers

Output parsers take the text generated by an LLM and format it to match the structure you require.

Available nodes:

* [Auto-fixing Output Parser](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.outputparserautofixing.md)
* [Item List Output Parser](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.outputparseritemlist.md)
* [Structured Output Parser](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.outputparserstructured/index.md)

Learn more about [Output parsers in LangChain](https://js.langchain.com/docs/concepts/output_parsers/).

#### Retrievers


* [Contextual Compression Retriever](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.retrievercontextualcompression.md)
* [MultiQuery Retriever](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.retrievermultiquery.md)
* [Vector Store Retriever](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.retrievervectorstore.md)
* [Workflow Retriever](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.retrieverworkflow.md)


#### Text splitters

Text splitters break down data (documents), making it easier for the LLM to process the information and return accurate results.

Available nodes:

* [Character Text Splitter](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.textsplittercharactertextsplitter.md)
* [Recursive Character Text Splitter](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.textsplitterrecursivecharactertextsplitter.md)
* [Token Splitter](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.textsplittertokensplitter.md)

Agentic Workflow Studio's text splitter nodes implements parts of [LangChain's text_splitter API](https://js.langchain.com/docs/concepts/text_splitters/).

#### Tools

Utility [tools](/glossary.md#ai-tool).

* [Calculator](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolcalculator.md)
* [Code Tool](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolcode.md)
* [SerpAPI](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolserpapi.md)
* [Think Tool](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolthink.md)
* [Vector Store Tool](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolvectorstore.md)
* [Wikipedia](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolwikipedia.md)
* [Wolfram|Alpha](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolwolframalpha.md)
* [Workflow Tool](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolworkflow.md)

#### Embeddings

> [Embeddings](/glossary.md#ai-embedding) capture the "relatedness" of text, images, video, or other types of information. ([source](https://supabase.com/docs/guides/ai/concepts))

Available nodes:


* [Embeddings AWS Bedrock](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsawsbedrock.md)
* [Embeddings Cohere](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingscohere.md)
* [Embeddings Google PaLM](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsgooglepalm.md)
* [Embeddings Hugging Face Inference](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingshuggingfaceinference.md)
* [Embeddings Mistral Cloud](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsmistralcloud.md)
* [Embeddings Ollama](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsollama.md)
* [Embeddings OpenAI](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsopenai.md)

Learn more about [Text embeddings in LangChain](https://js.langchain.com/docs/concepts/embedding_models/).


#### Miscellaneous

* [Chat Memory Manager](/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorymanager.md)



