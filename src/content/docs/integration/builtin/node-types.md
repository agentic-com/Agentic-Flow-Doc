---
title: Built-in integrations
description: Reference documentation for every built-in node in Agentic Workflow Studio, and their credentials.
---

This section contains the [node](/glossary.md#node-Agentic Workflow Studio) library: reference documentation for every built-in node in Agentic Workflow Studio, and their credentials.

--8<-- "_snippets/integrations/builtin/node-operations.md"

## Core nodes

Core nodes can be actions or [triggers](/glossary.md#trigger-node-Agentic Workflow Studio). Whereas most nodes connect to a specific external service, core nodes provide functionality such as logic, scheduling, or generic API calls.

## Cluster nodes

--8<-- "_snippets/integrations/builtin/cluster-nodes/cluster-nodes-summary.md"

## Credentials

External services need a way to identify and authenticate users. This data can range from an API key over an email/password combination to a long multi-line private key. You can save these in Agentic Workflow Studio as [credentials](/glossary.md#credential-Agentic Workflow Studio).

Nodes in Agentic Workflow Studio can then request that credential information. As another layer of security, only node types with specific access rights can access the credentials.

To make sure that the data is secure, credentials are stored encrypted within the browser extension's secure storage. Agentic Workflow Studio uses browser-native encryption mechanisms to protect sensitive authentication data.

To learn more about creating, managing, and sharing credentials, refer to [Manage credentials](/credentials/index.md).

## Community nodes

Agentic Workflow Studio supports custom nodes built by the community. These nodes extend the browser extension's capabilities with additional browser interactions and integrations.

For information about contributing new browser extension nodes or workflow templates, connect with the Agentic Workflow Studio community through our official channels.
