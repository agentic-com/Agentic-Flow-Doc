---
contentType: explanation
title: Agents vs chains
description: "Create advanced AI workflows using Agents vs chains with LangChain integration and intelligent processing."
difficulty: "🎯 advanced"
---

# Demonstration of key differences between agents and chains

In this workflow you can choose whether your chat query goes to an agent or chain. It shows some of the ways that agents are more powerful than chains.

```mermaid
graph TB
    subgraph "Agent Workflow"
        A1[User Query] --> A2[Agent Node]
        A2 --> A3{Decision Making}
        A3 --> A4[Tool Selection]
        A4 --> A5[Execute Tools]
        A5 --> A6[Evaluate Results]
        A6 --> A7{Need More Tools?}
        A7 -->|Yes| A4
        A7 -->|No| A8[Final Response]
    end

    subgraph "Chain Workflow"
        B1[User Query] --> B2[Basic LLM Chain]
        B2 --> B3[Predetermined Sequence]
        B3 --> B4[Direct LLM Response]
    end

    style A2 fill:#e8f5e8
    style A3 fill:#fff3e0
    style B2 fill:#e1f5fe
    style B3 fill:#f3e5f5
```

[[ workflowDemo("file:///advanced-ai/examples/agents_vs_chains.json") ]]

## Key features

This workflow uses:

* [Chat Trigger](/nodes/builtin/core-nodes/`Agentic WorkFlow`-nodes-langchain.chattrigger/index.md): start your workflow and respond to user chat interactions. The node provides a customizable chat interface.
* [Switch node](/nodes/builtin/core-nodes/`Agentic WorkFlow`-nodes-base.switch.md): directs your query to either the agent or chain, depending on which you specify in your query. If you say "agent" it sends it to the agent. If you say "chain" it sends it to the chain.
* Agent: the Agent node interacts with other components of the workflow and makes decisions about what tools to use.
* Basic LLM Chain: the Basic LLM Chain node supports chatting with a connected LLM, but doesn't support memory or tools.

## Using the example

--8<-- "_snippets/examples-color-key.md"
