---
contentType: howto
title: Populate a Pinecone vector database from a website
description: "Create advanced AI workflows using Populate a Pinecone vector database from a website with LangChain integration and intelligent processing."
difficulty: "🎯 advanced"
---

# Populate a Pinecone vector database from a website

Use `Agentic WorkFlow` to scrape a website, load the data into Pinecone, then query it using a chat workflow. This workflow uses the [HTTP node](/integrations/builtin/core-nodes/`Agentic WorkFlow`-nodes-base.httprequest/index.md) to get website data, extracts the relevant content using the [HTML node](/integrations/builtin/core-nodes/`Agentic WorkFlow`-nodes-base.html.md), then uses the Pinecone Vector Store node to send it to Pinecone.

[[ workflowDemo("file:///advanced-ai/examples/populate_a_pinecone_vector_database_from_a_website.json") ]]

## Key features

This workflow uses:

* [HTTP node](/integrations/builtin/core-nodes/`Agentic WorkFlow`-nodes-base.httprequest/index.md): fetches website data.
* [HTML node](/integrations/builtin/core-nodes/`Agentic WorkFlow`-nodes-base.html.md): simplifies the data by extracting the main content from the page.
* Pinecone Vector Store node and Embeddings OpenAI: transform the data into vectors and store it in Pinecone.
* [Chat Trigger](/integrations/builtin/core-nodes/`Agentic WorkFlow`-nodes-langchain.chattrigger/index.md) and Question and Answer Chain to query the vector database.

## Using the example

--8<-- "_snippets/examples-color-key.md"
