---
title: Rate Limits
description: Keep a workflow under an app's or an AI provider's rate limit with Split in Batches and Wait.
kind: guide
section: nodes
---

APIs, websites and AI providers reject requests when a workflow sends too many too fast. You usually see it as an error such as **429 Too Many Requests**, "rate limited" or "quota exceeded", often only after the first few items worked.

## Use Split in Batches

The fix is almost always [Split in Batches](/nodes/builtin/flow/splitinbatches/): it sends the items through the next steps a few at a time instead of all at once.

1. Put **Split in Batches** right before the node that calls the service (for example [Slack](/nodes/builtin/integration/slack/), [Google Sheets](/nodes/builtin/integration/google-sheets/) or [HTTP Request](/nodes/builtin/core/http-request/)).
2. Set **Batch size** below the service's limit, for example 10. The repeated steps start from its **Loop** output.
3. Add a [Wait](/nodes/builtin/flow/wait/) inside the batch loop to space the batches out, for example 1 second.
4. Connect the last repeated step to the **Loop Back** input, and continue the workflow from the **Done** output.

## Send fewer requests

- [Filter](/nodes/builtin/flow/filter/) and [Limit](/nodes/builtin/datatransformation/limit/) cut down how many items reach the service at all.
- [Aggregate](/nodes/builtin/datatransformation/aggregate/) combines items into one, so you send one message or row instead of many.
- Run scheduled workflows less often: a [Schedule](/nodes/builtin/trigger/schedule/) every hour instead of every minute.

## If it still fails

- Check the account's plan and quota with the provider. Free tiers often have much lower limits.
- For [HTTP Request](/nodes/builtin/core/http-request/), set a timeout and decide what happens on an error, so one rejected call doesn't stop the run.
- AI providers limit tokens as well as requests: shorter prompts and smaller inputs help, or use an on-device model, which has no rate limit.
