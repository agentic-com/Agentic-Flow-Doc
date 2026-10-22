---
title: Glossary
description: "Short definitions of the words used across the AWFlow docs, each linked to the page that explains it."
section: concepts
---

Each term links to the page that explains it in full. The app uses one plain word for each thing (step, Run, Runs, On/Off, Connections); the docs' node reference keeps the technical word *node*.

#### Add a note

Write a note on a step so whoever reads the workflow later understands it (called *Annotate this step* before 0.9; *Explain this step* drafts it with AI). Notes show on the canvas and in the workflow's story. See [Notes & story](/app/workflows/narration/).

#### Agent

An AI node that decides what to do next: call a tool, read the result, and try again until it has an answer. Compare with a [chain](#chain). See [Agents and tools](/concepts/ai/ai-agents/). For agents you chat with, see [Agents in the chat](/app/chat-and-agents/agents/).

#### Behaviour version

How a whole workflow handles items and expressions: **Classic** for workflows made before AWFlow 0.9, **New** for workflows made since. A workflow keeps its behaviour until you upgrade it. See [Workflow behaviour versions](/app/workflows/behaviour-versions/).

#### Branch

One of the paths a run can take after a node such as IF or Switch. Each branch starts at a named output port. See [Splitting and branching](/concepts/flow/splitting/).

#### Canvas

The editor where you add nodes and connect them into a workflow. See [Nodes](/app/workflows/components/nodes/) and [Links](/app/workflows/components/connections/).

#### Chain

An AI node that sends your input to the model once and returns the answer, with no tools. Basic LLM Chain, Summarization and Text Classifier are chains. See [Agents and tools](/concepts/ai/ai-agents/#which-ai-node-to-use).

#### Connection

A saved login, API key or token that lets a step use an outside service (called a *credential* before AWFlow 0.9). Add it once on the Connections page or from a step, then pick it in any step. See [Add a connection](/app/connections/create/). The lines between steps are called [links](#link).

#### Content Security Policy (CSP)

Rules a website sets that can block some actions from browser extensions on that site. See [Browser context](/concepts/flow/browser-context/).

#### Credential

The earlier name of a [connection](#connection), still used in the node reference.

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

#### Installed

A workflow you installed from the Marketplace (called *downloaded* before 0.9). Listed under **Workflows › Installed**. See [Manage the list](/app/workflows/manage-list/).

#### Item

One record passed between nodes, made of named fields, like a row in a table. A node receives a list of items and usually runs once per item. See [Items](/concepts/data/data-structure/).

#### Item linking

How a value read from another step lines up with the item being processed. See [Item linking](/concepts/data/item-linking/).

#### Knowledge base

A collection of your documents (files, web pages, tabs, text) cut into passages and searchable by meaning. AI nodes use it through the Local Knowledge node. See [Knowledge bases](/app/knowledge-bases/overview/) and [RAG](/concepts/ai/rag/).

#### Lambda workflow

Now called a **reusable workflow** in the app. A workflow built to be reused as a single step inside other workflows. See [Lambda workflows](/concepts/flow/lambdaworkflows/).

#### Large language model (LLM)

A model trained on a lot of text that reads and writes language. In AWFlow, you connect one to an AI node as its model. See [Models and where they run](/concepts/ai/model-dependencies/).

#### Link

A line between two steps: it says what runs next and carries the items of one output. See [Links](/app/workflows/components/connections/).

#### Loop

A part of a workflow that repeats, built with the Loop or Split in Batches node. Most nodes already run once per item, so you need a loop less often than you might think. See [Looping](/concepts/flow/looping/).

#### Mapping

Putting a value from an earlier step into a node's setting, usually by dragging it from the Input panel. See [Mapping in the UI](/concepts/data/data-mapping/data-mapping-ui/).

#### Marketplace page

The page of a shared workflow on the Marketplace, with its description, steps and setup (called a *listing* before 0.9, a word admin screens still use). See [Publishing](/app/workflows/publishing/).

#### Memory

The conversation so far, kept by a Chat Memory node so an agent can follow up on earlier messages. See [Memory and context](/concepts/ai/memory-context/).

#### Node

The technical word for a [step](#step), used in the [node reference](/nodes/).

#### On / Off

A workflow that is **On** runs by itself when its trigger fires; **Off**, it only runs when you press Run (called *active* / *inactive* before AWFlow 0.9). See [Manage the list](/app/workflows/manage-list/#turn-a-workflow-on-or-off).

#### On this device / In your account

Where a workflow, connection or variable is stored: **On this device** (in this browser only) or **In your account (cloud)** (with your AWFlow account). Called *Local* and *Cloud* before 0.9. See [Local or cloud](/app/account/local-vs-cloud/).

#### Output parser

A node you plug into an AI node so its answer comes out as fields or a list instead of free text. See [Prompting and outputs](/concepts/ai/prompting-and-outputs/).

#### Polling trigger

A trigger that checks an app on a timer for something new (an email, a row, an issue) and starts one run with what it finds. See [Polling triggers](/concepts/flow/polling-triggers/).

#### Project

A folder for chats in the assistant. Every conversation in a project shares its instructions, memory and files. Projects group chats, not workflows. See [Projects](/app/chat-and-agents/projects/).

#### RAG (retrieval-augmented generation)

Searching your documents first and giving the best passages to the model with the question, so the answer comes from your sources. See [RAG](/concepts/ai/rag/).

#### Raw (JSON)

The view of a step's data, or of a field, as JSON text (the tab was called *JSON* before 0.9). See [Steps](/app/workflows/components/nodes/#read-the-output).

#### Run

One execution of a workflow, from the trigger to the last step. **Run** is also the button that starts one, and **Runs** lists the past ones (called *Executions* before AWFlow 0.9). See [Workflow lifecycle](/concepts/flow/workflow-lifecycle/) and [Runs](/app/workflows/run-history/).

#### Run variable

A value stored during a run by the Set Variable node and read later as `{{ $run.name }}`. See [Mapping with expressions](/concepts/data/data-mapping/data-mapping-expressions/#what-you-can-read).

#### Slot

A connection point on an AI node where you plug in a model, memory, knowledge, tools or an output parser. See [Models and where they run](/concepts/ai/model-dependencies/).

#### Step

One thing a workflow does, such as Get All Text, If or HTTP Request. The node reference calls steps *nodes*. See [Steps](/app/workflows/components/nodes/).

#### Step version

The version of a step's behaviour. A saved step keeps its version; **Update step** moves it to the newest. See [Step versions](/app/workflows/step-versions/).

#### Template

A ready-made workflow you can copy and adapt, for example from the Marketplace. See [Publishing](/app/workflows/publishing/).

#### Test run

An evaluation: the workflow runs once per row of a test dataset and each answer is scored. Not the same as a plain Run. See [Test runs](/app/workflows/test-runs/).

#### Tool

A node an agent can choose to call, such as Web Search, Wikipedia or Browser. See [Tool selection](/concepts/ai/tool-selection/).

#### Trigger

The node that starts a workflow: a hotkey, a schedule, a page load, a chat message and so on. See [Workflow lifecycle](/concepts/flow/workflow-lifecycle/).

#### Variable

A named value you set once on the Variables page and read in any step as `{{ $vars.NAME }}`. Not the same as a [run variable](#run-variable). See [Variables](/app/variables/).

#### Vector store

Where embeddings are stored and searched. In AWFlow, that's your knowledge bases, used through the Local Knowledge node. See [Embeddings and vectors](/concepts/ai/embeddings-vectors/).

#### Workflow

Nodes connected together to do a job, from a trigger to the last step. See [Workflow lifecycle](/concepts/flow/workflow-lifecycle/).
