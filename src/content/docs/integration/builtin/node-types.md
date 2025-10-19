---
title: Built-in Node Types
description: Comprehensive guide to all built-in node categories in Agentic Flow, with selection guidance and use case examples.
---

## Overview

This document provides a comprehensive guide to the different types of nodes available in Agentic Flow, helping you understand their categories, purposes, and when to use each type in your workflows.

# Built-in Node Types

Agentic Flow provides a comprehensive library of built-in nodes organized into six main categories. Each category serves specific workflow automation needs, from basic web interactions to advanced AI-powered processing.

## Prerequisites

Before using this node, ensure you have:

- Basic understanding of workflow creation in Agentic Flow
- Appropriate browser permissions configured (if applicable)
- Required dependencies installed and configured

## Decision Guides

Use these guides to choose the right node for your specific needs:

## Text Extraction Decision Guide

Choose the right node for your specific needs:

**Extract all visible text from a webpage**
→ Use **GetAllTextFromLink**
*Provides clean, readable text content filtered from HTML*

**Get full HTML structure for parsing**
→ Use **GetHTMLFromLink**
*Preserves HTML structure for custom processing*

**Extract specific images from a page**
→ Use **GetImagesFromLink**
*Specialized for image extraction with metadata*

**Collect all links for crawling**
→ Use **GetLinksFromLink**
*Optimized for link discovery and validation*

## AI Processing Decision Guide

Choose the right node for your specific needs:

**Simple text processing with AI**
→ Use **BasicLLMChainNode**
*Direct LLM integration for straightforward AI tasks*

**Question-answering with knowledge base**
→ Use **QANode**
*Optimized for Q&A scenarios with context retrieval*

**Advanced retrieval with source attribution**
→ Use **RAGNode**
*Combines vector search with AI for accurate, sourced responses*

**AI with external tool integration**
→ Use **ToolsAgentNode**
*Enables AI to use external APIs and browser functions*

## Data Transformation Decision Guide

Choose the right node for your specific needs:

**Rename, convert, or validate fields**
→ Use **EditFields**
*Comprehensive field manipulation with validation*

**Select specific fields only**
→ Use **PickField**
*Simple field selection without transformation*

**Complex custom transformations**
→ Use **Code**
*Full JavaScript flexibility for complex logic*

**Save processed data as file**
→ Use **DownloadAsFile**
*Converts data to downloadable file formats*

## Flow Control Decision Guide

Choose the right node for your specific needs:

**Route workflow based on conditions**
→ Use **IFNode**
*Boolean logic for branching workflow paths*

**Filter arrays of data**
→ Use **Filter**
*Specialized for array filtering and validation*

**Combine multiple data streams**
→ Use **Merge**
*Merges data from multiple workflow branches*

**Handle errors gracefully**
→ Use **StopAndError**
*Controlled error handling and workflow termination*

**Add delays or timing control**
→ Use **WaitNode**
*Timing control for rate limiting and delays*

## Decision Guides

Use these guides to choose the right node for your specific needs:

## Text Extraction Decision Guide

Choose the right node for your specific needs:

**Extract all visible text from a webpage**
→ Use **GetAllTextFromLink**
*Provides clean, readable text content filtered from HTML*

**Get full HTML structure for parsing**
→ Use **GetHTMLFromLink**
*Preserves HTML structure for custom processing*

**Extract specific images from a page**
→ Use **GetImagesFromLink**
*Specialized for image extraction with metadata*

**Collect all links for crawling**
→ Use **GetLinksFromLink**
*Optimized for link discovery and validation*

## AI Processing Decision Guide

Choose the right node for your specific needs:

**Simple text processing with AI**
→ Use **BasicLLMChainNode**
*Direct LLM integration for straightforward AI tasks*

**Question-answering with knowledge base**
→ Use **QANode**
*Optimized for Q&A scenarios with context retrieval*

**Advanced retrieval with source attribution**
→ Use **RAGNode**
*Combines vector search with AI for accurate, sourced responses*

**AI with external tool integration**
→ Use **ToolsAgentNode**
*Enables AI to use external APIs and browser functions*

## Data Transformation Decision Guide

Choose the right node for your specific needs:

**Rename, convert, or validate fields**
→ Use **EditFields**
*Comprehensive field manipulation with validation*

**Select specific fields only**
→ Use **PickField**
*Simple field selection without transformation*

**Complex custom transformations**
→ Use **Code**
*Full JavaScript flexibility for complex logic*

**Save processed data as file**
→ Use **DownloadAsFile**
*Converts data to downloadable file formats*

## Flow Control Decision Guide

Choose the right node for your specific needs:

**Route workflow based on conditions**
→ Use **IFNode**
*Boolean logic for branching workflow paths*

**Filter arrays of data**
→ Use **Filter**
*Specialized for array filtering and validation*

**Combine multiple data streams**
→ Use **Merge**
*Merges data from multiple workflow branches*

**Handle errors gracefully**
→ Use **StopAndError**
*Controlled error handling and workflow termination*

**Add delays or timing control**
→ Use **WaitNode**
*Timing control for rate limiting and delays*

## Node Category Overview

### AI Nodes

**Purpose**: Integrate artificial intelligence capabilities into your workflows
- **AI Agents**: Complete AI workflow components (LLM chains, RAG, Q&A systems, tool-based agents)
- **AI Dependencies**: Supporting components (memory, embeddings, text splitters, vector stores)
- **Best for**: Content analysis, intelligent automation, natural language processing, knowledge retrieval

### Core Nodes

**Purpose**: Essential browser and web interaction functionality
- **Web Scraping**: Extract text, HTML, images, and links from web pages
- **HTTP Operations**: Make API calls and handle web requests
- **Code Execution**: Run custom JavaScript within browser context
- **Best for**: Data collection, API integration, custom logic implementation

### Data Transformation Nodes

**Purpose**: Process, format, and manipulate data within workflows
- **Field Operations**: Edit, pick, and restructure data fields
- **Date/Time Processing**: Comprehensive date arithmetic and formatting
- **File Operations**: Generate and download files from workflow data
- **Best for**: Data cleaning, format conversion, report generation

### Flow Control Nodes

**Purpose**: Control workflow execution logic and data routing
- **Conditional Logic**: IF statements, filters, and decision points
- **Data Merging**: Combine data from multiple sources
- **Error Handling**: Manage workflow failures and exceptions
- **Timing Control**: Add delays and manage asynchronous operations
- **Best for**: Complex workflow logic, error management, data orchestration

### Lambda Nodes

**Purpose**: Create reusable, modular workflow components
- **Input/Output Management**: Define interfaces for sub-workflows
- **Workflow Modularity**: Build composable workflow patterns
- **Best for**: Reusable components, complex workflow organization

### Trigger Nodes

**Purpose**: Initiate workflow execution
- **Manual Triggers**: User-initiated workflow starts
- **Event-Based Triggers**: Respond to specific conditions or events
- **Best for**: Workflow automation, scheduled tasks, event-driven processes

## Node Selection Guide

### For Web Automation

1. **Start with Core nodes** for basic web interactions
2. **Add Flow Control** for complex navigation logic
3. **Use Data Transformation** to process extracted content
4. **Integrate AI nodes** for intelligent content analysis

### For Data Processing

1. **Begin with Data Transformation** nodes for basic operations
2. **Add Flow Control** for conditional processing
3. **Use Core nodes** for external data sources
4. **Apply AI nodes** for advanced analysis and insights

### For AI-Powered Workflows

1. **Start with AI Agent nodes** for main AI functionality
2. **Configure AI Dependencies** for supporting services
3. **Use Core nodes** for data input and output
4. **Add Flow Control** for complex AI workflow logic

### For Modular Workflows

1. **Design with Lambda nodes** for reusable components
2. **Use Trigger nodes** for flexible initiation
3. **Combine with other categories** based on functionality needs

## Browser Extension Considerations

### Performance Guidelines

- **Core nodes** are optimized for browser performance
- **AI nodes** may require additional processing time
- **Data Transformation** nodes handle large datasets efficiently
- **Flow Control** nodes minimize execution overhead

### Security Features

- All nodes respect browser security policies
- **Core nodes** handle cross-origin requests safely
- **AI nodes** process data locally when possible
- **Data Transformation** nodes maintain data privacy

### Browser Compatibility

- All node categories support Chrome and Firefox
- **Core nodes** leverage native browser APIs
- **AI nodes** use browser-compatible AI libraries
- **Flow Control** nodes work across all browser environments

## Credentials

External services need a way to identify and authenticate users. This data can range from an API key over an email/password combination to a long multi-line private key. You can save these in Agentic Workflow Studio as [credentials](/glossary.md#credential-Agentic Workflow Studio).

Nodes in Agentic Workflow Studio can then request that credential information. As another layer of security, only node types with specific access rights can access the credentials.

To make sure that the data is secure, credentials are stored encrypted within the browser extension's secure storage. Agentic Workflow Studio uses browser-native encryption mechanisms to protect sensitive authentication data.

To learn more about creating, managing, and sharing credentials, refer to [Manage credentials](/credentials/index.md).

## Community nodes

Agentic Workflow Studio supports custom nodes built by the community. These nodes extend the browser extension's capabilities with additional browser interactions and integrations.

For information about contributing new browser extension nodes or workflow templates, connect with the Agentic Workflow Studio community through our official channels.

## See Also

- [Node Types Overview](/integration/builtin/node-types) - Understanding different node categories
- [Workflow Patterns](/learning/workflow-patterns) - Common workflow design patterns
- [Integration Examples](/learning/examples) - Practical integration examples

