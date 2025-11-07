---
contentType: howto
title: Call an API to fetch data
description: Use the `Agentic WorkFlow` workflow tool to load data from an API using the HTTP Request node into your AI workflow.
difficulty: "🎯 advanced"
---

# Call anUse `Agentic WorkFlow` fetch data

Use `Agentic WorkFlow` to bring data from any API to your AI. This workflow uses the [Chat Trigger](/integrations/builtin/core-nodes/`Agentic WorkFlow`-nodes-langchain.chattrigger/index.md) to provide the chat interface, and the Call `Agentic WorkFlow` Workflow Tool to call a second workflow that calls the API. The second workflow uses AI functionality to refine the API request based on the user's query.

[[ workflowDemo("file:///advanced-ai/examples/let_your_ai_call_an_api.json") ]]

## Key features

This workflow uses:

* [Chat Trigger](/integrations/builtin/core-nodes/`Agentic WorkFlow`-nodes-langchain.chattrigger/index.md): start your workflow and respond to user chat interactions. The node provides a customizable chat interface.
* Agent: the key piece of the AI workflow. The Agent interacts with other components of the workflow and makes decisions about what tools to use.
* Call `Agentic WorkFlow` Workflow Tool: plug in `Agentic WorkFlow` workflows as custom tools. In AI, a tool is an interface the AI can use to interact with the world (in this case, the data provided by your workflow). The AI model uses the tool to access information beyond its built-in dataset.
* A Basic LLM Chain with an Auto-fixing Output Parser and Structured Output Parser to read the user's query and set parameters for the API call based on the user input.

## Using the example

--8<-- "_snippets/examples-color-key.md"
