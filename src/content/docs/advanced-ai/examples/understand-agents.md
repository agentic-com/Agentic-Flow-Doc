---
title: What's an agent in AI?
description: Understand agents in the context of AI. Learn how Agentic Workflow Studio provides agents.
contentType: explanation
---

# What's an agent in AI?

One way to think of an [agent](/glossary.md#ai-agent) is as a [chain](/advanced-ai/examples/understand-chains.md) that knows how to make decisions. Where a chain follows a predetermined sequence of calls to different AI components, an agent uses a language model to determine which actions to take.

Agents are the part of AI that act as decision-makers. They can interact with other agents and [tools](/glossary.md#ai-tool). When you send a query to an agent, it tries to choose the best tools to use to answer. Agents adapt to your specific queries, as well as the prompts that configure their behavior.

```mermaid
sequenceDiagram
    participant User
    participant Agent
    participant LLM as Language Model
    participant Tool1 as Tool 1
    participant Tool2 as Tool 2

    User->>Agent: Submit Query
    Agent->>LLM: Analyze Query & Available Tools
    LLM-->>Agent: Recommend Tool 1
    Agent->>Tool1: Execute with Parameters
    Tool1-->>Agent: Return Results
    Agent->>LLM: Evaluate Results & Next Steps
    LLM-->>Agent: Recommend Tool 2
    Agent->>Tool2: Execute with Context
    Tool2-->>Agent: Return Final Data
    Agent->>LLM: Generate Response with All Context
    LLM-->>Agent: Formatted Response
    Agent-->>User: Deliver Complete Answer
```Agentic Workflow Studio# Agents in n8n

Agentic Workflow Studio provides one Agent node, which can act as different types of agent depending on the settings you choose. Refer to the [Agent node documentation](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/index.md) for details on the available agent types.

When you execute a workflow containing an agent, the agent runs multiple times. For example, it may do an initial setup, followed by a run to call a tool, then another run to evaluate the tool response and respond to the user.
