---
title: Rate Limits and Performance
description: "Avoid hitting limits and keep your workflows running smoothly with smart rate limiting and performance optimization."
---

**What this covers:** How to avoid hitting API limits and keep your workflows running fast and reliably.

**Perfect for:** API-heavy workflows • Large data processing • Performance optimization • Avoiding errors

## Why This Matters

Browser workflows can hit limits that cause failures:
- **API rate limits** - Too many requests too fast
- **Browser memory limits** - Processing too much data at once
- **Network timeouts** - Requests taking too long
- **Extension limits** - Browser restricting background processing

## Common Rate Limits

**API Limits**
- **Per minute:** 60 requests per minute (1 per second)
- **Per day:** 1000 requests per 24 hours
- **Concurrent:** 5 requests at the same time
- **Data size:** 10MB maximum per request

**Browser Limits**
- **Memory:** ~2GB for extension processing
- **Background processing:** Slower when tab is inactive
- **Network:** 6 connections per domain
- **Storage:** 10MB local storage quota

## Spotting Rate Limit Problems

**Error messages you'll see:**
- **"Too Many Requests" (429)** - You're going too fast
- **"Service Unavailable" (503)** - API is overloaded
- **"Request timeout"** - Taking too long to respond
- **"Out of memory"** - Browser can't handle the data size

**Warning signs:**
- Workflows suddenly start failing
- Requests taking much longer than usual
- Browser becoming slow or unresponsive
- Getting partial or empty responses

## How to Avoid Rate Limits

### Add Delays Between Requests

Use the [Wait node](/nodes/builtin/flow/wait/) to slow down:
```json
{"amount": 2, "unit": "seconds"}
```
**Result:** 2-second pause between each request

### Process Data in Batches

1. **[Filter](/nodes/builtin/flow/Filter/)** your data into small groups (5-10 items)
2. **Process** each group with delays
3. **[Merge](/nodes/builtin/flow/Merge/)** results back together

### Smart HTTP Requests

Configure [HTTP Request](/nodes/builtin/core/Http-Request/) for reliability:
```json
{
  "timeout": 30000,        // 30-second timeout
  "retryOnFail": true,     // Retry failed requests
  "maxRetries": 3,         // Try up to 3 times
  "retryDelay": 5000       // 5-second delay between retries
}
```

## Performance Tips by Node Type

### 🤖 AI Nodes
- **Process in batches** - Send multiple items to AI at once
- **Use local models** when possible to avoid API limits
- **Clear memory** between large AI operations

### 🌐 Web Extraction Nodes
- **Add 1-2 second delays** between page requests
- **Keep active tab open** for faster processing
- **Process smaller chunks** of data at a time

### Data Processing Nodes
- **Break large datasets** into smaller pieces (1000 items max)
- **Use streaming** for very large files
- **Cache repeated operations** to save time

### 🔗 HTTP Request Nodes
- **Respect API limits** - check documentation for limits
- **Use exponential backoff** - wait longer after each failure
- **Batch similar requests** together when possible

## Smart Retry Strategies

**Exponential Backoff** (recommended)
- Try 1: Wait 1 second
- Try 2: Wait 2 seconds
- Try 3: Wait 4 seconds
- Try 4: Wait 8 seconds (max)

**Simple Retry**
```json
{
  "maxRetries": 3,
  "retryDelay": 5000
}
```

## Best Practices

### ✅ Do This
- **Start slow** - Begin with longer delays, speed up if needed
- **Cache results** - Store data locally to avoid repeat requests
- **Monitor usage** - Track how many requests you're making
- **Plan for failures** - Always have retry logic
- **Test with real data** - Use realistic data sizes when testing

### ❌ Avoid This
- **Rapid-fire requests** - Don't send requests as fast as possible
- **Ignoring errors** - Always handle rate limit responses
- **Processing huge datasets** at once
- **Running workflows in background** without monitoring
- **Assuming APIs are always available**

## Quick Troubleshooting

**"Too Many Requests" errors**
→ Add [Wait nodes](/nodes/builtin/flow/wait/) between requests (2-5 seconds)

**Browser running slow/crashing**
→ Process smaller batches of data (100-500 items max)

**Workflows timing out**
→ Increase timeout settings and add retry logic

**Inconsistent results**
→ Add delays and check for proper error handling

**API quota exceeded**
→ Spread requests across longer time periods or upgrade API plan

## What's Next?

**Related guides:** [HTTP Request Node](/nodes/builtin/core/Http-Request/) • [Wait Node](/nodes/builtin/flow/wait/) • [Error Handling](/nodes/builtin/flow/StopAndError/)

**Workflow patterns:** [Data Processing Patterns](/learning/workflow-patterns/data-processing-patterns/) • [API Integration Patterns](/learning/workflow-patterns/integration-patterns/) • [Performance Optimization](/learning/workflow-patterns/optimization-best-practices/)

**Learn more:** [Multi-Step Workflows](/learning/text-courses/intermediate/multi-step-workflows/) • [Workflow Debugging](/learning/text-courses/intermediate/workflow-debugging/)

