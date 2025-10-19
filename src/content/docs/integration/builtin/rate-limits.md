---
title: Rate Limits and Performance
description: Understanding and managing rate limits, performance considerations, and browser constraints in `Agentic Workflow Studio` workflows.
---

## Overview

This document explains the rate limiting considerations and best practices for builtin nodes in `Agentic Workflow Studio`, helping you understand how to optimize your workflows for performance and reliability.

# Rate Limits and Performance

Browser-based workflows face unique performance considerations including API rate limits, browser resource constraints, and extension execution limits. Understanding these limitations helps you build efficient, reliable workflows.

## Prerequisites

Before using this node, ensure you have:

- Basic understanding of workflow creation in `Agentic Workflow Studio`
- Appropriate browser permissions configured (if applicable)
- Required dependencies installed and configured

## Understanding Rate Limits

### API Rate Limits

Rate limits restrict request frequency to external services. Common patterns include:
- **Per-minute limits**: Maximum requests per 60-second window
- **Per-day quotas**: Total daily request allowances
- **Concurrent request limits**: Maximum simultaneous connections
- **Data size limits**: Maximum payload size per request

### Browser Extension Limits

Browser extensions have additional constraints:
- **Memory limitations**: Available RAM for workflow execution
- **CPU throttling**: Background processing restrictions
- **Network concurrency**: Browser connection pooling limits
- **Storage quotas**: Local data storage restrictions

## Identifying Rate Limit Issues

### Common Error Indicators

- **HTTP 429 errors**: "Too Many Requests" responses
- **HTTP 503 errors**: "Service Unavailable" due to overload
- **Timeout errors**: Requests exceeding time limits
- **Memory errors**: Browser extension resource exhaustion

### Monitoring Performance

```javascript
// Example: Monitor request timing
const startTime = Date.now();
// ... make request ...
const duration = Date.now() - startTime;
console.log(`Request took ${duration}ms`);
```

## Rate Limit Management Strategies

### Using Wait Node for Delays

The [Wait Node](/integration/builtin/flow/WaitNode/) provides precise timing control:

```javascript
// Wait configuration for rate limiting
{
  "waitTime": 1000,  // 1 second delay
  "unit": "milliseconds"
}
```

### Batch Processing with Flow Control

Combine [Filter](/integration/builtin/flow/Filter/) and [Merge](/integration/builtin/flow/Merge/) nodes for efficient batching:

1. **Filter** data into smaller chunks
2. **Process** each chunk with delays
3. **Merge** results back together

### HTTP Request Optimization

The [HTTP Request](/integration/builtin/core/Http-Request/) node includes built-in rate limiting:

```javascript
// HTTP Request rate limiting configuration
{
  "batchSize": 5,           // Process 5 items at once
  "batchInterval": 2000,    // 2-second delay between batches
  "timeout": 30000,         // 30-second request timeout
  "retryOnFail": true,      // Automatic retry on failure
  "maxRetries": 3           // Maximum retry attempts
}
```

## Browser-Specific Performance Considerations

### Memory Management

- **Large datasets**: Use streaming processing with smaller chunks
- **AI operations**: Monitor memory usage during LLM processing
- **File operations**: Process files incrementally to avoid memory spikes

### Background Processing Limits

- **Active tab priority**: Workflows run faster in active tabs
- **Background throttling**: Inactive tabs may have reduced processing speed
- **Extension lifecycle**: Workflows pause when extension is disabled

### Network Optimization

- **Connection pooling**: Browser limits concurrent connections per domain
- **CORS restrictions**: Cross-origin requests require proper headers
- **Cache utilization**: Leverage browser caching for repeated requests

## Node-Specific Performance Tips

### AI Nodes

- **Local processing**: Use local AI models when possible to avoid API limits
- **Batch inference**: Process multiple items in single AI requests
- **Memory management**: Clear AI model caches between large operations

### Core Nodes

- **Web scraping**: Add delays between page requests to avoid blocking
- **API calls**: Implement exponential backoff for failed requests
- **File operations**: Stream large files instead of loading entirely into memory

### Data Transformation Nodes

- **Large datasets**: Process data in chunks using pagination patterns
- **Complex operations**: Break complex transformations into smaller steps
- **Date operations**: Cache timezone data to improve performance

## Error Handling and Recovery

### Automatic Retry Patterns

```javascript
// Retry configuration example
{
  "maxRetries": 3,
  "retryDelay": 1000,      // Start with 1 second
  "backoffMultiplier": 2,  // Double delay each retry
  "maxRetryDelay": 10000   // Cap at 10 seconds
}
```

### Graceful Degradation

- **Fallback APIs**: Configure alternative services for critical operations
- **Partial processing**: Continue workflow with available data when some requests fail
- **User notification**: Inform users of rate limit issues and expected delays

### Circuit Breaker Pattern

Implement circuit breakers for unreliable services:

1. **Monitor failure rates** across requests
2. **Open circuit** when failure threshold is reached
3. **Retry periodically** to test service recovery
4. **Close circuit** when service is stable again

## Best Practices

### Workflow Design

- **Plan for limits**: Design workflows assuming rate limits will occur
- **Implement delays**: Add appropriate delays between requests
- **Monitor usage**: Track API usage to stay within quotas
- **Cache results**: Store frequently accessed data locally

### Performance Optimization

- **Minimize requests**: Combine multiple operations when possible
- **Optimize payloads**: Send only necessary data in requests
- **Use compression**: Enable compression for large data transfers
- **Parallel processing**: Use concurrent requests within rate limits

### User Experience

- **Progress indicators**: Show users workflow progress during delays
- **Estimated times**: Provide time estimates for long-running workflows
- **Cancellation options**: Allow users to cancel slow operations
- **Error recovery**: Provide clear options when rate limits are hit

## Troubleshooting Common Issues

### High Memory Usage

1. **Identify memory-intensive nodes** in your workflow
2. **Process data in smaller chunks** using batch patterns
3. **Clear intermediate results** that are no longer needed
4. **Monitor browser task manager** for extension memory usage

### Slow Workflow Execution

1. **Profile individual nodes** to identify bottlenecks
2. **Optimize API calls** by reducing request frequency
3. **Use browser developer tools** to monitor network activity
4. **Consider workflow redesign** for better performance

### Rate Limit Exceeded

1. **Implement exponential backoff** in retry logic
2. **Reduce request frequency** with longer delays
3. **Consider alternative APIs** with higher rate limits
4. **Upgrade service plans** if available and cost-effective

## See Also

- [Node Types Overview](/integration/builtin/node-types) - Understanding different node categories
- [Workflow Patterns](/learning/workflow-patterns) - Common workflow design patterns
- [Integration Examples](/learning/examples) - Practical integration examples

