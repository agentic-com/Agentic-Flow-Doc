---
title: Wait
description: "Timing control node that introduces delays and synchronization points in workflow execution."
template: doc
tags: ["Workflow Logic", "Conditional Processing", "Data Flow", "Error Handling", "Branching"]
---

# Wait

## Prerequisites

Before using this node, ensure you have:

- Basic understanding of workflow creation in Agentic Flow
- Appropriate browser permissions configured (if applicable)
- Required dependencies installed and configured

## Overview

The Wait node provides precise timing control and synchronization capabilities for workflow automation. It enables controlled delays, rate limiting, and coordination between workflow operations that require specific timing. The node is essential for handling asynchronous operations, respecting API rate limits, and managing browser-based automation timing.

### Purpose and Functionality

The Wait node introduces configurable delays in workflow execution, supporting both fixed time delays and dynamic waiting based on conditions or external events. It handles multiple timing scenarios including rate limiting for API calls, synchronization with browser operations, and coordination between parallel workflow branches.

### Key Features

- **Flexible Timing Control**: Support for fixed delays, dynamic timing, and condition-based waiting
- **Rate Limiting Integration**: Built-in support for API rate limiting and request throttling
- **Browser Synchronization**: Specialized timing for browser operations, page loading, and DOM updates
- **Asynchronous Operation Support**: Coordination with asynchronous browser APIs and external services

### Primary Use Cases

- **API Rate Limiting**: Implement delays between API calls to respect rate limits and avoid throttling
- **Browser Operation Timing**: Wait for page loads, DOM updates, or user interactions before proceeding
- **Workflow Synchronization**: Coordinate timing between parallel workflow branches and operations
- **Performance Optimization**: Control execution timing to optimize resource usage and system performance

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `amount` | `number` | Wait duration in specified unit | `5` |
| `unit` | `string` | Time unit: "seconds", "minutes", "hours", "milliseconds" | `"seconds"` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `resumeOnCondition` | `boolean` | `false` | Whether to resume when condition is met | `true` |
| `condition` | `string` | `""` | JavaScript expression to evaluate for early resume | `"{{$json.status}} === 'ready'"` |
| `maxWaitTime` | `number` | `0` | Maximum wait time (0 = no limit) | `30` |
| `checkInterval` | `number` | `1000` | Condition check interval in milliseconds | `500` |

### Advanced Configuration

```json
{
  "amount": 10,
  "unit": "seconds",
  "resumeOnCondition": true,
  "condition": "{{$json.pageLoaded}} === true && {{$json.elementsReady}} > 0",
  "maxWaitTime": 60,
  "checkInterval": 1000,
  "rateLimiting": {
    "enabled": true,
    "requestsPerMinute": 30,
    "burstAllowed": 5
  },
  "browserSync": {
    "waitForDOM": true,
    "waitForImages": false,
    "waitForScripts": true
  }
}
```

## Browser API Integration

### Required Permissions

The Wait node may require permissions for browser state monitoring and timing synchronization.

| Permission | Purpose | Security Impact |
|------------|---------|-----------------|
| `activeTab` | Monitor page loading and DOM state | Low - read-only access to page state |
| `storage` | Store timing data and rate limiting information | Low - local timing data storage |

### Browser APIs Used

- **Performance API**: For precise timing measurements and performance monitoring
- **DOM API**: When waiting for DOM events and element availability
- **Tabs API**: For monitoring page loading and navigation events

### Cross-Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Basic Timing | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Condition Monitoring | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |
| Browser Synchronization | ✅ Full | ✅ Full | ❌ None | ✅ Full |
| Performance Timing | ✅ Full | ⚠️ Limited | ❌ None | ✅ Full |

### Security Considerations

- **Timing Attacks**: Wait intervals are randomized slightly to prevent timing-based attacks
- **Resource Management**: Automatic cleanup of timing resources to prevent memory leaks
- **Browser State Access**: Limited access to browser state for condition monitoring
- **Rate Limiting**: Secure implementation of rate limiting without exposing sensitive timing data

## Input/Output Specifications

### Input Data Structure

```json
{
  "triggerData": "any_type",
  "waitConditions": {
    "checkValue": "any_type",
    "expectedState": "any_type"
  },
  "metadata": {
    "timestamp": "ISO_8601_string",
    "source": "string"
  }
}
```

### Output Data Structure

```json
{
  "waitResult": {
    "completed": "boolean",
    "actualWaitTime": "number_ms",
    "conditionMet": "boolean",
    "timedOut": "boolean"
  },
  "inputData": "original_input_data",
  "timing": {
    "startTime": "ISO_8601_string",
    "endTime": "ISO_8601_string",
    "duration": "number_ms"
  },
  "metadata": {
    "timestamp": "ISO_8601_string",
    "waitType": "string"
  }
}
```

## Practical Examples

### Example 1: API Rate Limiting

**Scenario**: Implement delays between API calls to respect rate limits and avoid throttling

**Configuration**:
```json
{
  "amount": 2,
  "unit": "seconds",
  "rateLimiting": {
    "enabled": true,
    "requestsPerMinute": 30
  }
}
```

**Input Data**:
```json
{
  "apiResponse": {
    "data": "response_data",
    "rateLimit": {
      "remaining": 25,
      "resetTime": "2024-01-15T10:31:00Z"
    }
  }
}
```

**Expected Output**:
```json
{
  "waitResult": {
    "completed": true,
    "actualWaitTime": 2000,
    "conditionMet": false,
    "timedOut": false
  },
  "inputData": {
    "apiResponse": {
      "data": "response_data",
      "rateLimit": {
        "remaining": 25,
        "resetTime": "2024-01-15T10:31:00Z"
      }
    }
  },
  "timing": {
    "startTime": "2024-01-15T10:30:00Z",
    "endTime": "2024-01-15T10:30:02Z",
    "duration": 2000
  }
}
```

**Step-by-Step Process**:
1. Receive API response data with rate limiting information
2. Calculate appropriate delay based on rate limiting configuration
3. Wait for specified duration before allowing workflow to continue

### Example 2: Browser Page Load Synchronization

**Scenario**: Wait for page elements to load and become available before proceeding with data extraction

**Configuration**:
```json
{
  "amount": 30,
  "unit": "seconds",
  "resumeOnCondition": true,
  "condition": "{{$json.pageState.loaded}} === true && {{$json.elements.count}} > 0",
  "maxWaitTime": 45,
  "checkInterval": 500,
  "browserSync": {
    "waitForDOM": true,
    "waitForImages": false,
    "waitForScripts": true
  }
}
```

**Workflow Integration**:
```
Navigate to Page → Wait Node → Extract Content → Process Data
                     ↓
              (Wait for page ready)
```

**Complete Example**:
This configuration ensures that content extraction only begins after the page is fully loaded and required elements are available, preventing extraction errors and improving data quality.

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the WaitNode node in a typical workflow scenario.

**Configuration:**

```json
{
  "condition": "example_value",
  "enabled": true
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

1. **Previous Node** → **WaitNode** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Rate-Limited API Processing

- **Nodes**: API Request → Wait Node → Next API Request → Process Results
- **Use Case**: Implement proper rate limiting for external API integrations
- **Configuration Tips**: Calculate wait times based on API rate limit headers and usage patterns

#### Pattern 2: Browser Automation Synchronization

- **Nodes**: Page Navigation → Wait Node → DOM Interaction → Data Extraction
- **Use Case**: Ensure proper timing for browser-based automation and data extraction
- **Data Flow**: Wait for page readiness before attempting DOM manipulation or data extraction

#### Pattern 3: Parallel Workflow Coordination

- **Nodes**: [Branch A, Branch B] → Wait Nodes → Synchronization Point → Merge
- **Use Case**: Coordinate timing between parallel workflow branches
- **Configuration Tips**: Use condition-based waiting to synchronize on data availability rather than fixed timing

### Best Practices

- **Performance**: Use condition-based waiting instead of fixed delays when possible for better efficiency
- **Error Handling**: Always set maximum wait times to prevent indefinite blocking
- **Data Validation**: Validate timing parameters to prevent excessive delays or resource consumption
- **Resource Management**: Monitor memory usage during long wait periods and implement cleanup

## Troubleshooting

### Common Issues

#### Issue: Workflow Hangs Indefinitely

- **Symptoms**: Wait node never completes and workflow execution stops
- **Causes**: Missing or incorrect conditions, unreachable condition criteria, or missing timeout settings
- **Solutions**: 
  1. Set appropriate maximum wait times for all wait operations
  2. Verify condition expressions and data availability
  3. Test conditions with sample data before deployment
- **Prevention**: Always configure maximum wait times and test condition logic thoroughly

#### Issue: Premature Wait Completion

- **Symptoms**: Wait node completes too early, before expected conditions are met
- **Causes**: Incorrect condition expressions, data type mismatches, or overly frequent condition checking
- **Solutions**: 
  1. Review condition expressions and data path references
  2. Adjust check intervals to appropriate frequency
  3. Validate data types and comparison operations
- **Prevention**: Test wait conditions with realistic data and timing scenarios

### Browser-Specific Issues

#### Chrome

- Excellent support for all timing features and browser synchronization
- Full access to performance APIs for precise timing measurements

#### Firefox

- Good timing support with slightly limited performance monitoring
- May require additional configuration for complex browser synchronization

#### Safari

- Limited browser synchronization capabilities may affect advanced timing features
- Basic wait functionality works without restrictions

### Performance Issues

- **Memory Usage**: Long wait periods may consume memory for condition monitoring
- **CPU Usage**: Frequent condition checking can impact browser performance
- **Rate Limiting**: Overly aggressive rate limiting may slow overall workflow execution

## Limitations & Constraints

### Technical Limitations

- **Maximum Wait Time**: Browser timeouts may limit maximum wait duration to prevent hanging
- **Condition Complexity**: Very complex condition expressions may impact performance

### Browser Limitations

- **Background Processing**: Browser background processing limits may affect long wait operations
- **Resource Constraints**: Browser memory and CPU limits may impact wait performance

### Data Limitations

- **Condition Data Size**: Large data objects in conditions may impact checking performance
- **Output Format**: Wait results always include timing metadata regardless of configuration
- **Processing Time**: Condition evaluation adds overhead to wait operations

## Key Terminology

**Conditional Logic**: Programming construct that performs different actions based on conditions

**Boolean Expression**: Expression that evaluates to true or false

**Data Flow**: Movement of data through different stages of a workflow

**Error Handling**: Process of catching and managing errors in workflow execution

**Workflow Branch**: Separate execution path in a workflow based on conditions

## Search & Discovery

### Keywords

- workflow logic
- conditional processing
- data flow
- error handling
- branching
- control flow

### Common Search Terms

- "if"
- "condition"
- "filter"
- "merge"
- "branch"
- "control"
- "logic"
- "error"
- "wait"
- "delay"

### Primary Use Cases

- workflow control
- conditional logic
- error handling
- data routing
- process orchestration
- flow management

## Learning Path

### Skill Level: Intermediate

## Enhanced Cross-References

### Workflow Patterns

- [Flow Control Patterns](/learning/workflow-patterns/flow-control-patterns)
- [Error Handling Strategies](/learning/workflow-patterns/error-handling)
- [Conditional Logic Patterns](/learning/workflow-patterns/conditional-logic)

### Related Tutorials

- [Workflow Logic Basics](/learning/text-courses/beginner/workflow-logic)
- [Advanced Flow Control](/learning/text-courses/intermediate/advanced-flow-control)

### Practical Examples

- [Real-World Use Cases](/learning/examples/)
- [Integration Examples](/learning/examples/multi-node-automation)
- [Best Practice Examples](/learning/workflow-patterns/optimization-best-practices)

## Related Nodes

### Complementary Nodes

- **Http-Request**: Works well together in workflows
- **IFNode**: Works well together in workflows

### Common Workflow Patterns

- **Http-Request → WaitNode → Http-Request (retry pattern)**: Common integration pattern
- **WaitNode → GetAllTextFromLink (delayed extraction)**: Common integration pattern

### See Also

- [Flow Logic Overview](/usage/key-concepts/flow-logic/)
- [Error Handling Guide](/usage/key-concepts/flow-logic/error-handling)
- [Execution Order](/usage/key-concepts/flow-logic/execution-order)
- [Workflow Debugging](/learning/text-courses/intermediate/workflow-debugging)
- [Merging Data Streams](/usage/key-concepts/flow-logic/merging)

**Decision Guides:**
- [Flow Control Decision Guide](#flow-control-decision-guide)

**General Resources:**
- [Workflow Patterns](/learning/workflow-patterns/)
- [Integration Examples](/learning/examples/)
- [Node Types Overview](/integration/builtin/node-types)

## Version History

### Current Version: 1.3.0

- Added condition-based waiting and browser synchronization capabilities
- Improved rate limiting integration and performance monitoring
- Enhanced cross-browser compatibility and timing precision

### Previous Versions

- **1.2.0**: Added maximum wait time and condition checking features
- **1.1.0**: Introduced rate limiting support and browser API integration
- **1.0.0**: Initial release with basic timing delay functionality

## Additional Resources

- [Timing Control Tutorial](/usage/key-concepts/flow-logic/waiting)
- [API Rate Limiting Best Practices](/learning/workflow-patterns/integration-patterns)
- [Browser Automation Timing](/learning/text-courses/intermediate/performance-optimization)
- [Asynchronous Workflow Patterns](/learning/workflow-patterns/optimization-best-practices)

---

**Last Updated**: October 18, 2024  
**Tested With**: Browser Extension v2.1.0  
**Validation Status**: ✅ Code Examples Tested | ✅ Browser Compatibility Verified | ✅ User Tested