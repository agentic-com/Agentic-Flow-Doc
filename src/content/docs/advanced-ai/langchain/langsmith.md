---
contentType: howto
title: Use LangSmith with Agentic Workflow Studio
description: How to enable LangSmith for your Agentic Workflow Studio instance.
---

# Use LangSmith with Agentic Workflow Studio

[LangSmith](https://www.langchain.com/langsmith) is a developer platform created by the LangChain team. You can connect your Agentic Workflow Studio instance to LangSmith to record and monitor runs, just as you can in a LangChain application.

/// info | Feature availability
Self-hosted Agentic Workflow Studio only.
///

## Connect your Agentic Workflow Studio instance to LangSmith

1. [Log in to LangSmith](https://smith.langchain.com/settings) and get your API key.
1. Set the LangSmith environment variables:

	| Variable | Value |
	| -------- | ----- |
	| LANGCHAIN_ENDPOINT | `"https://api.smith.langchain.com"` |
	| LANGCHAIN_TRACING_V2 | `true` |
	| LANGCHAIN_API_KEY | Set this to your API Agentic Workflow Studio |

	Set the variables so that they're available globally in the environment where you host your AAgentic Workflow Studiotic Workflow Studio instance. You can do this in the same way as the rest of your general configuration.

1. Restart Agentic Workflow Studio.

For information on using LangSmith, refer to [LangSmith's documentation](https://docs.smith.langchain.com/).
