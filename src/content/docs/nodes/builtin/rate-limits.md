---
title: Rate Limits
description: Practical guidance for slowing workflows and handling external service limits.
---

# Rate Limits

External APIs, websites, and AI providers can reject requests when a workflow runs too quickly. Use [Wait](/nodes/builtin/flow/wait/), [Filter](/nodes/builtin/flow/filter/), and [Merge](/nodes/builtin/flow/merge/) to process data in smaller batches.

For API calls, configure [Http Request](/nodes/builtin/core/http-request/) with suitable timeouts and response handling. For service-specific integration nodes, check the provider account permissions and quota before increasing workflow frequency.
