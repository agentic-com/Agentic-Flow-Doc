---
title: Built-in Node Types
description: "Quick guide to choosing the right nodes for your workflows - from web extraction to AI processing to data transformation."
---

# Built-in Node Types

**What this covers:** All the different types of nodes available and how to choose the right ones for your workflows.

**Perfect for:** New users • Node selection • Workflow planning • Understanding capabilities

## Node Categories Overview

`Agentic WorkFlow` organizes nodes into six main categories to help you find what you need:

🤖 **AI Nodes** - Add intelligence to your workflows
🌐 **Core Nodes** - Essential web and API interactions
🔄 **Data Transformation** - Process and format your data
⚡ **Flow Control** - Control how your workflow runs
📦 **Lambda Nodes** - Create reusable workflow components
🚀 **Trigger Nodes** - Start your workflows automatically

## Quick Decision Guides

### 🌐 Web Extraction & Data Collection
**Extract text from webpages** → Use [GetAllText](/nodes/builtin/extension/GetAllText/)
**Get page HTML** → Use [GetAllHTML](/nodes/builtin/extension/GetAllHTML/)
**Extract images** → Use [GetAllImages](/nodes/builtin/extension/GetAllImages/)
**Collect links** → Use [GetAllLinks](/nodes/builtin/extension/GetAllLinks/)
**Make API calls** → Use [HTTP Request](/nodes/builtin/core/Http-Request/)

### 🤖 AI Processing
**Simple AI text processing** → Use [Basic LLM Chain](/nodes/builtin/ai/AIAgents/BasicLLMChainNode/)
**Question answering** → Use [QA Node](/nodes/builtin/ai/AIAgents/QANode/)
**Advanced AI with sources** → Use [RAG Node](/nodes/builtin/ai/AIAgents/RAGNode/)
**AI with tools** → Use [Tools Agent](/nodes/builtin/ai/AIAgents/ToolsAgentNode/)

### 🔄 Data Processing
**Edit/rename fields** → Use [Edit Fields](/nodes/builtin/dataTransformation/EditFields/)
**Select specific fields** → Use [Pick Field](/nodes/builtin/dataTransformation/PickField/)
**Custom JavaScript** → Use [Code](/nodes/builtin/core/Code/)
**Save as file** → Use [Download As File](/nodes/builtin/dataTransformation/DownloadAsFile/)

### ⚡ Workflow Control
**If/then logic** → Use [If](/nodes/builtin/flow/If/)
**Filter data** → Use [Filter](/nodes/builtin/flow/Filter/)
**Combine data** → Use [Merge](/nodes/builtin/flow/Merge/)
**Handle errors** → Use [Stop & Error](/nodes/builtin/flow/StopAndError/)
**Add delays** → Use [Wait](/nodes/builtin/flow/wait/)

## Detailed Category Guide

### 🤖 AI Nodes
**What they do:** Add artificial intelligence to your workflows
**Common uses:** Analyze text, answer questions, summarize content, extract insights
**Popular nodes:** Basic LLM Chain, QA Node, RAG Node, Tools Agent
**Best for:** Content analysis, intelligent automation, natural language processing

### 🌐 Core Nodes
**What they do:** Essential web interactions and API calls
**Common uses:** Scrape websites, make HTTP requests, run custom code
**Popular nodes:** Get All Text, HTTP Request, Code, Get All HTML
**Best for:** Data collection, API integration, custom logic

### 🔄 Data Transformation Nodes
**What they do:** Process, clean, and format your data
**Common uses:** Edit fields, pick specific data, convert formats, save files
**Popular nodes:** Edit Fields, Pick Field, Download As File
**Best for:** Data cleaning, format conversion, report generation

### ⚡ Flow Control Nodes
**What they do:** Control how your workflow runs
**Common uses:** Add conditions, filter data, handle errors, add delays
**Popular nodes:** If, Filter, Merge, Stop & Error, Wait
**Best for:** Complex workflow logic, error handling, data routing

### 📦 Lambda Nodes
**What they do:** Create reusable workflow components
**Common uses:** Build modular workflows, create templates
**Popular nodes:** Lambda Input, Lambda Output
**Best for:** Reusable components, complex workflow organization

### 🚀 Trigger Nodes
**What they do:** Start your workflows automatically
**Common uses:** Page load triggers, scheduled runs, manual buttons
**Popular nodes:** When Started
**Best for:** Automation, scheduled tasks, event-driven workflows

## Common Workflow Patterns

### 🌐 Web Extraction Workflow
```
[When Started] → [Get All Text] → [Edit Fields] → [Download As File]
```
**Perfect for:** Extracting and saving website content

### 🤖 AI Content Analysis
```
[Get All Text] → [Basic LLM Chain] → [Edit Fields] → [Save Results]
```
**Perfect for:** Analyzing and summarizing web content

### 🔄 Data Processing Pipeline
```
[HTTP Request] → [Filter] → [Edit Fields] → [If] → [Multiple Outputs]
```
**Perfect for:** Processing API data with conditions

### 📦 Reusable Component
```
[Lambda Input] → [Processing Nodes] → [Lambda Output]
```
**Perfect for:** Creating workflows you can reuse in other workflows

## Getting Started Tips

### 🎯 Start Simple
Begin with basic nodes like Get All Text or HTTP Request before moving to complex AI workflows.

### 🔗 Chain Nodes Together
Most workflows use 3-5 nodes connected together. Start with a trigger, process data, then save or display results.

### 🧪 Test Frequently
Test your workflow after adding each node to make sure it works as expected.

### 📚 Use Templates
Look at existing workflow patterns and examples to learn how nodes work together.

## What's Next?

**Explore specific nodes:** Browse the individual node documentation to learn about specific capabilities and configuration options.

**Learn workflow patterns:** Check out [Workflow Patterns](/learning/workflow-patterns/) to see how nodes work together in real scenarios.

**Try examples:** Start with [Integration Examples](/learning/examples/) to see complete workflows in action.

**Get help:** Visit the [Learning Center](/learning/) for tutorials and guides on building effective workflows.

