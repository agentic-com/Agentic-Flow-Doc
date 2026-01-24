---
contentType: howto
title: Set a human fallback for AI workflows
description: "Create advanced AI workflows using Set a human fallback for AI workflows with LangChain integration and intelligent processing."
difficulty: "🎯 advanced"
---

# Have a human fallback for AI workflows

This is a workflow that tries to answer user queries using the standard GPT-4 model. If it can't answer, it sends a message to Slack to ask for human help. It prompts the user to supply an email address.

This workflow uses the [Chat Trigger](/nodes/builtin/core-nodes/`Agentic WorkFlow`-nodes-langchain.chattrigger/index.md) to provide the chat interface, and the Call `Agentic WorkFlow` Workflow Tool to call a second workflow that handles checking for email addresses and sending the Slack message.

[[ workflowDemo("file:///advanced-ai/examples/ask_a_human.json") ]]

## Key features

This workflow uses:

* [Chat Trigger](/nodes/builtin/core-nodes/`Agentic WorkFlow`-nodes-langchain.chattrigger/index.md): start your workflow and respond to user chat interactions. The node provides a customizable chat interface.
* Agent: the key piece of the AI workflow. The Agent interacts with other components of the workflow and makes decisions about what tools to use.
* Call `Agentic WorkFlow` Workflow Tool: plug in `Agentic WorkFlow` workflows as custom tools. In AI, a tool is an interface the AI can use to interact with the world (in this case, the data provided by your workflow). It allows the AI model to access information beyond its built-in dataset.

## Using the example

--8<-- "_snippets/examples-color-key.md"
