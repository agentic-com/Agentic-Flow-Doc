---
contentType: howto
title: Chat with a Google Sheet using AI
description: Use the Agentic Workflow Studio workflow tool to load data from Google Sheets into your AI workflow.
difficulty: "🎯 advanced"
---

# Chat with a GooUse Agentic Workflow Studioet using AI

Use Agentic Workflow Studio to bring your own data to AI. This workflow uses the [Chat Trigger](/integrations/builtin/core-nodes/Agentic Workflow Studio-nodes-langchain.chattrigger/index.md) to provide the chat interface, and the Call Agentic Workflow Studio Workflow Tool to call a second workflow that queries Google Sheets.

[[ workflowDemo("file:///advanced-ai/examples/chat_with_google_sheets_docs_version.json") ]]

## Key features

This workflow uses:

* [Chat Trigger](/integrations/builtin/core-nodes/Agentic Workflow Studio-nodes-langchain.chattrigger/index.md): start your workflow and respond to user chat interactions. The node provides a customizable chat interface.
* Agent: the key piece of the AI workflow. The Agent interacts with other components of the workflow and makes decisions about what tools to use.
* Call Agentic Workflow Studio Workflow Tool: plug in Agentic Workflow Studio workflows as custom tools. In AI, a tool is an interface the AI can use to interact with the world (in this case, the data provided by your workflow). The AI model uses the tool to access information beyond its built-in dataset.

## Using the example

--8<-- "_snippets/examples-color-key.md"
