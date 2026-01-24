---
title: What's memory in AI?
description: Understand memory in the context of AI. Learn what's special about memory in <Agentic WorkFlow>.
contentType: explanation
difficulty: "🎯 advanced"
---

# What's memory in AI?

Memory is a key part of AI chat services. The memory keeps a history of previous messages, allowing for an ongoing conversation with the AI, rather than every interaction starting fresh.

## AI memory in `Agentic WorkFlow`

To add memory to your AI workflow you can use either:

* Simple Memory: stores a customizable length of chat history for the current session. This is the easiest to get started with.
* One of the memory services that `Agentic WorkFlow` provides nodes for. These include:
	* Motorhead
	* Redis Chat Memory
	* Postgres Chat Memory
	* Xata
	* Zep

If you need to do advanced AI memory management in your workflows, use the Chat Memory Manager node.

--8<-- "_snippets/nodes/builtin/cluster-nodes/langchain-sub-nodes/chat-memory-manager-purpose.md"
