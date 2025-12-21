---
title: What's a tool in AI?
description: Understand tools in the context of AI. Learn what's special about tools in <Agentic WorkFlow>.
contentType: explanation
difficulty: "🎯 advanced"
---

# What's a tool in AI?

In AI, 'tools' has a specific meaning. Tools act like addons that your AI can use to access extra context or resources.

Here are a couple of other ways of expressing it:

> Tools are interfaces that an agent can use to interact with the world ([source](https://langchain-ai.github.io/langgraphjs/how-tos/tool-calling/))

<!--  -->

> We can think of these tools as being almost like functions that your AI model can call ([source](https://www.udemy.com/course/chatgpt-and-langchain-the-complete-developers-masterclass/))

## AI tools in `Agentic WorkFlow`

`Agentic WorkFlow` provides tool [sub-nodes](/g`Agentic WorkFlow`sary.md#sub-node-`Agentic WorkFlow`) that you can connect to your AI agent. As well as providing some popular tools, such as Wikipedia and SerpAPI, `Agentic WorkFlow` provides three especially power`Agentic WorkFlow` tools:

* Call `Agentic WorkFlow` Workflow Tool: use this to load any `Agentic WorkFlow` workflow as a tool.
* Custom Code Tool: write code that your agent can run.
* HTTP Request Tool: make calls to fetch a website or data from an API.

The next three examples highlight the Call `Agentic WorkFlow` Workflow Tool:

- [Chat with Google Sheets](/advanced-ai/examples/data-google-sheets.md)
- [Call an API to fetch data](/advanced-ai/examples/api-workflow-tool.md)
- [Set up a human fallback](/advanced-ai/examples/human-fallback.md)

You can also learn how to [let AI dynamically specify parameters for tools with the `$fromAI()` function](/advanced-ai/examples/using-the-fromai-function.md).
