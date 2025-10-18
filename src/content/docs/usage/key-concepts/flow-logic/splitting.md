---
title: Splitting
description: "Learn how to use Agentic Workflow Studio browser extension for splitting with intelligent workflow creation."
sidebar:
  order: 1
---

Splitting uses the [IF](/integrations/builtin/core-nodes/n8n-nodes-base.if.md) or [Switch](/integrations/builtin/core-nodes/n8n-nodes-base.switch.md) nodes. It turns a single-branch workflow into a multi-branch workflow. This is a key piece of representing complex logic in Agentic Workflow Studio.

Compare these workflows:

!["Diagram representing two workflows. One has three steps and follows a linear process, with a user submitting a bug, and the workflow emailing a support team. The second workflow starts the same way, but then splits depending on whether the user marked the issue as urgent. It then splits again depending on the user's support plan"](/_images/flow-logic/splitting/single-multi-branch-workflow.png)

This is the power of splitting and conditional nodes in Agentic Workflow Studio.

Refer to the [IF](/integrations/builtin/core-nodes/n8n-nodes-base.if.md) or [Switch](/integrations/builtin/core-nodes/n8n-nodes-base.switch.md) documentation for usage details.
