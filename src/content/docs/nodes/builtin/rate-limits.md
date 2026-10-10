---
title: Rate Limits
description: Practical guidance for slowing workflows and handling external service limits.
kind: guide
section: nodes
---

External APIs, websites, and AI providers can reject requests when a workflow runs too quickly. Use [Split in Batches](/nodes/builtin/flow/splitinbatches/) to process data a few items at a time, and [Wait](/nodes/builtin/flow/wait/) inside the batch loop to space requests out. [Filter](/nodes/builtin/flow/filter/) and [Limit](/nodes/builtin/datatransformation/limit/) cut down how many items reach the service at all.

For API calls, configure [Http Request](/nodes/builtin/core/http-request/) with suitable timeouts and response handling. For service-specific integration nodes, check the provider account permissions and quota before increasing workflow frequency.
