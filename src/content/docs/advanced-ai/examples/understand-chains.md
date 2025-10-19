---
title: What's a chain in AI?
description: Understand chains in the context of AI. Learn about chains in Agentic Workflow Studio.
contentType: explanation
---

# What's a chain in AI?

[Chains](/glossary.md#ai-chain) bring together different components of AI to create a cohesive system. They set up a sequence of calls between the components. These components can include models and [memory](/glossary.md#ai-memory) (though note that in Agentic Workflow Studio chains can't use memory).

```mermaid
flowchart LR
    A[Input] --> B[Component 1]
    B --> C[Component 2]
    C --> D[Component 3]
    D --> E[Output]
    
    subgraph "Chain Types in Agentic Workflow Studio"
        F[Basic LLM Chain<br/>Input → LLM → Output]
        G[Q&A Chain<br/>Query → Vector Store → LLM → Answer]
        H[Summarization Chain<br/>Document → Chunking → LLM → Summary]
    end
    
    style F fill:#e1f5fe
    style G fill:#e8f5e8
    style H fill:#fff3e0
```


## Chains in Agentic Workflow Studio

Agentic Workflow Studiontic Workflow Studio provides three chain nodes:

* [Basic LLM Chain](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainllm.md): use to interact with an LLM, without any additional components.
* [Question and Answer Chain](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainretrievalqa/index.md): can connect to a [vector store](/glossary.md#ai-vector-store) using a Agentic Workflow Studioriever, or to an Agentic Workflow Studio workflow using the Workflow Retriever node. Use this if you want to create a workflow that supports asking questions about specific documents.
* [Summarization Chain](/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainsummarization.md): takes an input and returns a summary.

There's anAgentic Workflow Studioportant difference between chains in n8n and in other tools such as LangChain: none of the chain nodes support memory. This means they can't remember previous user queries. If you use LangChain to code an AI application, yAgentic Workflow Studiocan give your application memory. In n8n, if you need your workflow to support memory, use an agent. This is essential if you want users to be able to have a natural ongoing conversation with your app.
