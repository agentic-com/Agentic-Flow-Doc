---
title: Glossary
description: "Short definitions of the words used across the AWFlow docs, each linked to the page that explains it."
section: concepts
---

Each term links to the page that explains it in full.

#### Agent

An AI node that decides what to do next: call a tool, read the result, and try again until it has an answer. Compare with a [chain](#chain). See [Agents and tools](/concepts/ai/ai-agents/). For agents you chat with, see [Agents in the chat](/app/chat-and-agents/agents/).

#### Branch

One of the paths a run can take after a node such as IF or Switch. Each branch starts at a named output port. See [Splitting and branching](/concepts/flow/splitting/).

#### Canvas

The editor where you add nodes and connect them into a workflow. See [Nodes](/app/workflows/components/nodes/) and [Connections between nodes](/app/workflows/components/connections/).

#### Chain

An AI node that sends your input to the model once and returns the answer, with no tools. Basic LLM Chain, Summarization and Text Classifier are chains. See [Agents and tools](/concepts/ai/ai-agents/#which-ai-node-to-use).

#### Content Security Policy (CSP)

Rules a website sets that can block some actions from browser extensions on that site. See [Browser context](/concepts/flow/browser-context/).

#### Credential

A saved login, API key or token that lets a node use an outside service. Credentials are stored with AWFlow and picked in a node's settings. See [Create credentials](/app/connections/create/).

#### Embedding

A list of numbers that represents the meaning of a piece of text, so texts with similar meaning can be found together. A knowledge base stores one per passage. See [Embeddings and vectors](/concepts/ai/embeddings-vectors/).

#### Error Trigger

A trigger that starts a workflow when another workflow's run fails. See [Error handling](/concepts/flow/error-handling/#hear-about-failed-runs).

#### Expression

Text between double curly braces, such as `{{ $input.title }}`, that AWFlow replaces with a value while a node runs. Expressions are sandboxed: they read values and use a fixed set of helper functions, but don't run JavaScript. See [Mapping with expressions](/concepts/data/data-mapping/data-mapping-expressions/).

#### Grounded answer

An answer whose claims can be traced back to the passages the model was given. RAG aims for grounded answers. See [RAG](/concepts/ai/rag/).

#### Hallucination

When a model states something that sounds right but isn't supported by its input or by the facts. A knowledge base and a clear "not found" fallback reduce it. See [RAG](/concepts/ai/rag/).

#### In-page node

A node that reads or changes the web page in your active tab: get its text, click a button, fill a form. In-page nodes need the browser extension. See [Browser context](/concepts/flow/browser-context/).

#### Item

One record passed between nodes, made of named fields, like a row in a table. A node receives a list of items and usually runs once per item. See [Items](/concepts/data/data-structure/).

#### Item linking

How a value read from another step lines up with the item being processed. See [Item linking](/concepts/data/item-linking/).

#### Knowledge base

A collection of your documents (files, web pages, tabs, text) cut into passages and searchable by meaning. AI nodes use it through the Local Knowledge node. See [Knowledge bases](/app/knowledge-bases/overview/) and [RAG](/concepts/ai/rag/).

#### Lambda workflow

A workflow built to be reused as a single step inside other workflows. See [Lambda workflows](/concepts/flow/lambdaworkflows/).

#### Large language model (LLM)

A model trained on a lot of text that reads and writes language. In AWFlow, you connect one to an AI node as its model. See [Models and where they run](/concepts/ai/model-dependencies/).

#### Loop

A part of a workflow that repeats, built with the Loop or Split in Batches node. Most nodes already run once per item, so you need a loop less often than you might think. See [Looping](/concepts/flow/looping/).

#### Mapping

Putting a value from an earlier step into a node's setting, usually by dragging it from the Input panel. See [Mapping in the UI](/concepts/data/data-mapping/data-mapping-ui/).

#### Memory

The conversation so far, kept by a Chat Memory node so an agent can follow up on earlier messages. See [Memory and context](/concepts/ai/memory-context/).

#### Node

One step in a workflow, such as Get All Text, IF or Summarization. See [Nodes](/app/workflows/components/nodes/) and the [node reference](/nodes/).

#### Output parser

A node you plug into an AI node so its answer comes out as fields or a list instead of free text. See [Prompting and outputs](/concepts/ai/prompting-and-outputs/).

#### Project

A folder for chats in the assistant. Every conversation in a project shares its instructions, memory and files. Projects group chats, not workflows. See [Projects](/app/chat-and-agents/projects/).

#### RAG (retrieval-augmented generation)

Searching your documents first and giving the best passages to the model with the question, so the answer comes from your sources. See [RAG](/concepts/ai/rag/).

#### Run

One execution of a workflow, from the trigger to the last step. Past runs appear in the run history. See [Workflow lifecycle](/concepts/flow/workflow-lifecycle/) and [Run history](/app/workflows/run-history/).

#### Run variable

A value stored during a run by the Set Variable node and read later as `{{ $run.name }}`. See [Mapping with expressions](/concepts/data/data-mapping/data-mapping-expressions/#the-three-things-you-can-read).

#### Slot

A connection point on an AI node where you plug in a model, memory, knowledge, tools or an output parser. See [Models and where they run](/concepts/ai/model-dependencies/).

#### Template

A ready-made workflow you can copy and adapt, for example from the Marketplace. See [Publishing](/app/workflows/publishing/).

#### Tool

A node an agent can choose to call, such as Web Search, Wikipedia or Browser. See [Tool selection](/concepts/ai/tool-selection/).

#### Trigger

The node that starts a workflow: a hotkey, a schedule, a page load, a chat message and so on. See [Workflow lifecycle](/concepts/flow/workflow-lifecycle/).

#### Vector store

Where embeddings are stored and searched. In AWFlow, that's your knowledge bases, used through the Local Knowledge node. See [Embeddings and vectors](/concepts/ai/embeddings-vectors/).

#### Workflow

Nodes connected together to do a job, from a trigger to the last step. See [Workflow lifecycle](/concepts/flow/workflow-lifecycle/).
