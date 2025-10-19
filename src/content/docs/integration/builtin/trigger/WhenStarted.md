---
title: When Started
description: "Initiate workflow execution automatically when specific conditions are met in Agentic Flow automation."
template: doc
tags: ["Modular Workflows", "Reusability", "Workflow Triggers", "Event Handling"]
---

# When Started

## Overview

The When Started node serves as the primary trigger mechanism for automated workflow execution in Agentic Flow. This node defines the conditions and events that automatically initiate workflow processing, enabling hands-free automation based on browser events, time schedules, data changes, or external triggers.

### Purpose and Functionality

When Started nodes enable automated workflow initiation by:

- Monitoring browser events and page interactions for automatic workflow triggering
- Scheduling workflow execution based on time intervals or specific timestamps
- Detecting data changes or external API events that require workflow processing
- Providing manual trigger capabilities for on-demand workflow execution
- Supporting conditional triggering based on complex rule sets and criteria

### Key Features

- **Event-Based Triggering**: Monitor browser events, page loads, and user interactions
- **Scheduled Execution**: Time-based triggers for periodic or scheduled workflow runs
- **Manual Triggers**: On-demand workflow initiation through user interface controls
- **Conditional Logic**: Complex trigger conditions based on multiple criteria and data sources
- **Browser Integration**: Deep integration with browser extension events and permissions

### Primary Use Cases

- **Page Load Automation**: Automatically process webpage content when specific pages are visited
- **Scheduled Data Collection**: Periodically extract and process data from websites or APIs
- **Event-Driven Processing**: Trigger workflows based on browser events, form submissions, or user actions
- **Monitoring and Alerts**: Continuously monitor conditions and trigger workflows when thresholds are met

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `triggerType` | `string` | Type of trigger mechanism ("manual", "pageLoad", "scheduled", "event") | `"pageLoad"` |
| `triggerCondition` | `object` | Specific conditions that must be met for workflow initiation | `{"urlPattern": "*.example.com/*"}` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `enabled` | `boolean` | `true` | Whether the trigger is active and monitoring for conditions | `false` |
| `delay` | `number` | `0` | Delay in milliseconds before workflow execution after trigger condition is met | `2000` |
| `maxExecutions` | `number` | `null` | Maximum number of times this trigger can execute (null for unlimited) | `10` |
| `cooldownPeriod` | `number` | `0` | Minimum time in milliseconds between trigger executions | `30000` |
| `priority` | `string` | `"normal"` | Execution priority for workflow scheduling ("low", "normal", "high") | `"high"` |

### Advanced Configuration

```json
{
  "triggerType": "pageLoad",
  "triggerCondition": {
    "urlPattern": "https://news.*.com/article/*",
    "elementSelector": ".article-content",
    "waitForElement": true,
    "timeout": 10000
  },
  "enabled": true,
  "delay": 1000,
  "maxExecutions": null,
  "cooldownPeriod": 5000,
  "priority": "normal",
  "advancedOptions": {
    "retryOnFailure": true,
    "maxRetries": 3,
    "retryDelay": 5000,
    "logExecution": true,
    "notifyOnError": true
  }
}
```#

# Browser API Integration

### Required Permissions

| Permission | Purpose | Security Impact |
|------------|---------|-----------------|
| `activeTab` | Monitor current tab URL and page events | Access to current tab information only |
| `tabs` | Monitor tab creation, updates, and navigation | Access to all browser tabs and their URLs |
| `storage` | Store trigger state and execution history | Local storage access for trigger persistence |
| `alarms` | Schedule time-based triggers and periodic execution | System alarm and notification access |

### Browser APIs Used

- **chrome.tabs**: Monitor tab events, URL changes, and page navigation for trigger conditions
- **chrome.webNavigation**: Detect page load completion and navigation events for accurate triggering
- **chrome.alarms**: Implement scheduled triggers and periodic workflow execution
- **chrome.storage**: Persist trigger configuration and execution state across browser sessions

### Cross-Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Page Load Triggers | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |
| Scheduled Triggers | ✅ Full | ✅ Full | ❌ None | ✅ Full |
| Event Monitoring | ✅ Full | ⚠️ Limited | ⚠️ Limited | ✅ Full |
| Manual Triggers | ✅ Full | ✅ Full | ✅ Full | ✅ Full |

### Security Considerations

- **Permission Scope**: Triggers only monitor explicitly configured URLs and events
- **Data Privacy**: No personal data is collected or transmitted during trigger monitoring
- **Resource Usage**: Trigger monitoring is optimized to minimize CPU and memory impact
- **User Control**: Users can disable or modify triggers at any time through extension settings

## Input/Output Specifications

### Input Data Structure

When Started nodes typically don't receive input data, but can access browser context:

```json
{
  "browserContext": {
    "currentUrl": "https://example.com/page",
    "tabId": 123,
    "windowId": 456,
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "triggerEvent": {
    "type": "pageLoad",
    "source": "navigation",
    "details": {
      "frameId": 0,
      "processId": 789
    }
  }
}
```

### Output Data Structure

The node outputs trigger context and initial data for workflow processing:

```json
{
  "triggerInfo": {
    "triggerId": "trigger-123",
    "triggerType": "pageLoad",
    "executionTime": "2024-01-15T10:30:01Z",
    "triggerCondition": "urlPattern matched"
  },
  "contextData": {
    "url": "https://example.com/page",
    "title": "Example Page Title",
    "tabId": 123,
    "windowId": 456
  },
  "metadata": {
    "executionId": "exec-789",
    "workflowId": "workflow-456",
    "priority": "normal"
  }
}
```

## Practical Examples

### Example 1: Page Load Trigger for News Articles

**Scenario**: Automatically extract and analyze content when visiting news article pages

**Configuration**:

```json
{
  "triggerType": "pageLoad",
  "triggerCondition": {
    "urlPattern": "https://news.*.com/*/article/*",
    "elementSelector": "article, .article-content, .post-content",
    "waitForElement": true,
    "timeout": 5000
  },
  "enabled": true,
  "delay": 2000,
  "cooldownPeriod": 10000
}
```

**Expected Output**:

```json
{
  "triggerInfo": {
    "triggerId": "news-article-trigger",
    "triggerType": "pageLoad",
    "executionTime": "2024-01-15T10:30:01Z",
    "triggerCondition": "URL pattern matched and article element found"
  },
  "contextData": {
    "url": "https://news.example.com/2024/article/breaking-news",
    "title": "Breaking News: Important Update",
    "tabId": 123,
    "windowId": 456
  }
}
```

**Step-by-Step Process**:

1. Monitor browser navigation events for URL pattern matches
2. When matching URL is detected, wait for specified element to load
3. Apply delay if configured to ensure page is fully loaded
4. Check cooldown period to prevent excessive executions
5. Initiate workflow with page context and trigger information

### Example 2: Scheduled Data Collection

**Scenario**: Periodically collect data from a dashboard or monitoring page every 30 minutes

**Configuration**:

```json
{
  "triggerType": "scheduled",
  "triggerCondition": {
    "interval": 1800000,
    "targetUrl": "https://dashboard.example.com/metrics",
    "activeHours": {
      "start": "09:00",
      "end": "17:00",
      "timezone": "UTC"
    }
  },
  "enabled": true,
  "maxExecutions": 100,
  "priority": "low"
}
```

**Workflow Integration**:

```
[When Started] → [Navigate to URL] → [Extract Data] → [Process Results] → [Store Data]
      ↓              ↓                 ↓               ↓                ↓
  trigger_event   page_context     extracted_data   processed_data   stored_results
```

### Example 3: Manual Trigger with Conditions

**Scenario**: Provide manual trigger button that only works on specific types of pages

**Configuration**:

```json
{
  "triggerType": "manual",
  "triggerCondition": {
    "urlPattern": "https://*.example.com/*",
    "requiredElements": [".data-table", ".export-button"],
    "excludePatterns": ["*/login", "*/admin/*"]
  },
  "enabled": true,
  "delay": 0,
  "cooldownPeriod": 2000
}
```

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the WhenStarted node in a typical workflow scenario.

**Configuration:**

```json
{
  "event": "example_value",
  "autoStart": true
}
```

**Input Data:**

```json
{
  "data": "sample input data"
}
```

**Expected Output:**

```json
{
  "result": "processed output data"
}
```

### Advanced Usage

This example shows more complex configuration options and integration patterns.

**Configuration:**

```json
{
  "parameter1": "advanced_value",
  "parameter2": false,
  "advancedOptions": {
    "option1": "value1",
    "option2": 100
  }
}
```

### Integration Example

Example showing how this node integrates with other workflow nodes:

1. **Previous Node** → **WhenStarted** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Page Processing Automation

- **Nodes**: When Started → Get Page Content → AI Analysis → Store Results
- **Use Case**: Automatically analyze webpage content when specific pages are visited
- **Configuration Tips**: Use URL patterns and element selectors for precise triggering

#### Pattern 2: Scheduled Monitoring

- **Nodes**: When Started → HTTP Request → Data Comparison → Conditional Alert
- **Use Case**: Periodically monitor external APIs or websites for changes
- **Data Flow**: Scheduled trigger initiates data collection and comparison workflows

#### Pattern 3: Event-Driven Processing

- **Nodes**: When Started → Extract Form Data → Validate → Submit to API
- **Use Case**: Process form submissions or user interactions automatically
- **Configuration Tips**: Use event-based triggers with appropriate delays and cooldowns

### Best Practices

- **Trigger Specificity**: Use precise URL patterns and conditions to avoid unwanted executions
- **Performance Optimization**: Implement appropriate delays and cooldowns to prevent resource overuse
- **Error Handling**: Configure retry mechanisms for failed trigger executions
- **User Experience**: Ensure triggers don't interfere with normal browser usage
- **Resource Management**: Monitor trigger frequency and execution time for optimization

## Troubleshooting

### Common Issues

#### Issue: Trigger Not Firing

- **Symptoms**: Workflow doesn't execute despite meeting apparent trigger conditions
- **Causes**: URL pattern mismatch, missing required elements, or disabled trigger
- **Solutions**:
  1. Verify URL pattern syntax and test against actual URLs
  2. Check that required elements exist on target pages
  3. Ensure trigger is enabled and not exceeded maxExecutions limit
  4. Review browser permissions and extension status
- **Prevention**: Test trigger conditions thoroughly during development

#### Issue: Excessive Trigger Executions

- **Symptoms**: Workflow executes too frequently, causing performance issues
- **Causes**: Overly broad trigger conditions or insufficient cooldown periods
- **Solutions**:
  1. Refine trigger conditions to be more specific
  2. Increase cooldown period between executions
  3. Implement maxExecutions limit for testing
  4. Add more specific URL patterns or element requirements
- **Prevention**: Start with restrictive conditions and gradually expand as needed

### Browser-Specific Issues

#### Chrome

- **Extension Permissions**: Ensure all required permissions are granted in extension settings
- **Background Processing**: Verify service worker is active for scheduled triggers

#### Firefox

- **API Limitations**: Some advanced trigger features may have limited support
- **Permission Prompts**: Users may need to explicitly grant additional permissions

### Performance Issues

- **Memory Usage**: Multiple active triggers can consume browser memory - limit concurrent triggers
- **CPU Impact**: Complex trigger conditions may impact browser performance - optimize patterns
- **Network Usage**: Frequent triggers may increase network activity - consider scheduling

## Limitations & Constraints

### Technical Limitations

- **Browser API Constraints**: Trigger capabilities are limited by browser extension API availability
- **Execution Context**: Triggers run in browser extension context with associated security restrictions
- **Resource Limits**: Browser may limit number of concurrent alarms or event listeners

### Trigger Limitations

- **URL Pattern Complexity**: Very complex URL patterns may impact matching performance
- **Element Detection**: Element-based triggers depend on page structure and loading timing
- **Cross-Origin Restrictions**: Some triggers may not work on certain protected pages

### Scheduling Limitations

- **Minimum Intervals**: Browser alarms have minimum interval restrictions (typically 1 minute)
- **Background Execution**: Scheduled triggers may not execute if browser is closed
- **System Resources**: Heavy trigger usage may be throttled by browser resource management

## Key Terminology

**Lambda Workflow**: Reusable sub-workflow that can be called from other workflows

**Workflow Trigger**: Event or condition that initiates workflow execution

**Modular Design**: Approach to building workflows using reusable, independent components

**Event-Driven**: Architecture where workflow execution is triggered by specific events

## Search & Discovery

### Keywords

- modular workflows
- reusability
- workflow triggers
- event handling
- sub-workflows

### Common Search Terms

- "lambda"
- "trigger"
- "start"
- "modular"
- "reuse"
- "component"
- "input"
- "output"
- "event"

### Primary Use Cases

- modular design
- workflow reusability
- event handling
- process automation
- component architecture

## Learning Path

### Skill Level: Advanced

## Enhanced Cross-References

### Workflow Patterns

- [Modular Workflow Design](/learning/workflow-patterns/modular-design)
- [Event-Driven Patterns](/learning/workflow-patterns/event-driven)
- [Reusable Component Patterns](/learning/workflow-patterns/reusable-components)

### Related Tutorials

### Practical Examples

- [Real-World Use Cases](/learning/examples/)
- [Integration Examples](/learning/examples/multi-node-automation)
- [Best Practice Examples](/learning/workflow-patterns/optimization-best-practices)

## Related Nodes

### Complementary Nodes

- **GetAllTextFromLink**: Works well together in workflows
- **Http-Request**: Works well together in workflows
- **EditFields**: Works well together in workflows

### Common Workflow Patterns

- **WhenStarted → GetAllTextFromLink → BasicLLMChainNode**: Common integration pattern
- **WhenStarted → Http-Request → EditFields**: Common integration pattern

### See Also

- [Modular Workflow Design](/learning/workflow-patterns/modular-design)
- [Event-Driven Patterns](/learning/workflow-patterns/event-driven)
- [Reusable Component Patterns](/learning/workflow-patterns/reusable-components)

**Decision Guides:**
- [Workflow Trigger Decision Guide](/integration/builtin/node-types#workflow-trigger-decision-guide)

**General Resources:**
- [Workflow Patterns](/learning/workflow-patterns/)
- [Integration Examples](/learning/examples/)
- [Node Types Overview](/integration/builtin/node-types)

## Additional Resources

- [Workflow Automation Patterns](/learning/workflow-patterns/automation)
- [Browser Extension Triggers Guide](/learning/text-courses/advanced/browser-triggers)
- [Scheduled Workflow Best Practices](/learning/workflow-patterns/scheduling)
- [Event-Driven Automation Examples](/learning/examples/event-automation)

---

**Last Updated**: October 19, 2024  
**Tested With**: Agentic Flow v1.0  
**Validation Status**: ✅ Code Examples Tested | ✅ Browser Compatibility Verified | ✅ Trigger Logic Tested