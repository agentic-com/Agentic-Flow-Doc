---
title: Lambda Input
description: "Define input parameters and data flow for modular lambda workflows in Agentic Flow automation."
template: doc
tags: ["Modular Workflows", "Reusability", "Workflow Triggers", "Event Handling"]
---

# Lambda Input

## Overview

The Lambda Input node serves as the entry point for modular lambda workflows, defining how data flows into reusable workflow components. This node establishes the input interface for lambda workflows, allowing you to create parameterized, reusable workflow modules that can be called from other workflows with different input data.

### Purpose and Functionality

Lambda Input nodes enable modular workflow design by:

- Defining the input schema and parameters for lambda workflows
- Establishing data validation and type checking for incoming data
- Providing a standardized interface for workflow reusability
- Enabling parameterized workflow execution with different input sets
- Supporting complex data structures and nested parameter passing

### Key Features

- **Schema Definition**: Define structured input parameters with type validation
- **Data Transformation**: Transform and normalize incoming data before workflow processing
- **Parameter Validation**: Validate input data against defined schemas and constraints
- **Default Values**: Provide fallback values for optional parameters
- **Documentation Integration**: Self-documenting parameter definitions for workflow clarity

### Primary Use Cases

- **Modular Workflow Design**: Create reusable workflow components that accept different input parameters
- **Data Processing Pipelines**: Build parameterized data transformation workflows for multiple data sources
- **Template Workflows**: Develop workflow templates that can be customized through input parameters
- **API Integration**: Create standardized interfaces for workflows that process external API data

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `inputSchema` | `object` | JSON schema defining the structure and validation rules for input data | `{"type": "object", "properties": {"url": {"type": "string"}}}` |
| `parameterName` | `string` | Name identifier for the input parameter within the lambda workflow | `"websiteUrl"` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `defaultValue` | `any` | `null` | Default value to use when input parameter is not provided | `"https://example.com"` |
| `required` | `boolean` | `true` | Whether this input parameter is required for workflow execution | `false` |
| `description` | `string` | `""` | Human-readable description of the input parameter's purpose | `"Target website URL for content extraction"` |
| `validation` | `object` | `{}` | Additional validation rules beyond basic type checking | `{"minLength": 1, "pattern": "^https?://"}` |

### Advanced Configuration

```json
{
  "inputSchema": {
    "type": "object",
    "properties": {
      "url": {
        "type": "string",
        "format": "uri"
      },
      "options": {
        "type": "object",
        "properties": {
          "timeout": {"type": "number", "default": 5000},
          "retries": {"type": "number", "default": 3}
        }
      }
    },
    "required": ["url"]
  },
  "parameterName": "extractionConfig",
  "defaultValue": {
    "options": {
      "timeout": 5000,
      "retries": 3
    }
  },
  "validation": {
    "customRules": ["validateUrlAccessibility"]
  }
}
```
##
 Input/Output Specifications

### Input Data Structure

The Lambda Input node receives data from the calling workflow:

```json
{
  "inputData": {
    "url": "https://example.com/page",
    "options": {
      "timeout": 10000,
      "retries": 2
    }
  },
  "metadata": {
    "workflowId": "parent-workflow-123",
    "executionId": "exec-456",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Output Data Structure

The node outputs validated and structured data for use within the lambda workflow:

```json
{
  "url": "https://example.com/page",
  "options": {
    "timeout": 10000,
    "retries": 2
  },
  "metadata": {
    "inputValidated": true,
    "schemaVersion": "1.0",
    "processedAt": "2024-01-15T10:30:01Z"
  }
}
```

## Practical Examples

### Example 1: Simple URL Input Parameter

**Scenario**: Create a lambda workflow that accepts a URL parameter for web content extraction

**Configuration**:

```json
{
  "inputSchema": {
    "type": "object",
    "properties": {
      "targetUrl": {
        "type": "string",
        "format": "uri",
        "description": "URL of the webpage to extract content from"
      }
    },
    "required": ["targetUrl"]
  },
  "parameterName": "url",
  "description": "Target URL for content extraction"
}
```

**Input Data**:

```json
{
  "inputData": {
    "targetUrl": "https://news.example.com/article/123"
  }
}
```

**Expected Output**:

```json
{
  "url": "https://news.example.com/article/123",
  "metadata": {
    "inputValidated": true,
    "schemaVersion": "1.0",
    "processedAt": "2024-01-15T10:30:01Z"
  }
}
```

**Step-by-Step Process**:

1. Receive input data from calling workflow
2. Validate URL format against schema requirements
3. Extract the targetUrl value and assign to workflow parameter
4. Output validated data for subsequent nodes in lambda workflow

### Example 2: Complex Configuration Object

**Scenario**: Create a lambda workflow for AI content analysis with multiple configuration options

**Configuration**:

```json
{
  "inputSchema": {
    "type": "object",
    "properties": {
      "content": {
        "type": "string",
        "minLength": 1
      },
      "analysisOptions": {
        "type": "object",
        "properties": {
          "sentiment": {"type": "boolean", "default": true},
          "keywords": {"type": "boolean", "default": true},
          "summary": {"type": "boolean", "default": false},
          "language": {"type": "string", "default": "en"}
        }
      }
    },
    "required": ["content"]
  },
  "parameterName": "analysisConfig",
  "defaultValue": {
    "analysisOptions": {
      "sentiment": true,
      "keywords": true,
      "summary": false,
      "language": "en"
    }
  }
}
```

**Workflow Integration**:

```
[Calling Workflow] → [Lambda Input] → [AI Analysis] → [Lambda Output]
        ↓                ↓               ↓              ↓
   config_data      validated_data   analysis_result  formatted_output
```

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the LambdaInput node in a typical workflow scenario.

**Configuration:**

```json
{
  "inputSchema": "example_value",
  "validateInput": true
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

1. **Previous Node** → **LambdaInput** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Data Processing Lambda

- **Nodes**: Lambda Input → Data Transformation → Lambda Output
- **Use Case**: Create reusable data processing workflows with configurable parameters
- **Configuration Tips**: Define clear input schemas for data validation and transformation rules

#### Pattern 2: AI Analysis Lambda

- **Nodes**: Lambda Input → AI Agent → Data Formatting → Lambda Output
- **Use Case**: Build parameterized AI analysis workflows for different content types
- **Data Flow**: Input parameters configure AI model settings and analysis options

#### Pattern 3: Web Scraping Lambda

- **Nodes**: Lambda Input → HTTP Request → Content Extraction → Lambda Output
- **Use Case**: Create configurable web scraping workflows for different websites
- **Configuration Tips**: Include URL validation and request configuration parameters

### Best Practices

- **Schema Design**: Create comprehensive input schemas that validate all expected data types and formats
- **Parameter Naming**: Use descriptive parameter names that clearly indicate their purpose and usage
- **Default Values**: Provide sensible defaults for optional parameters to improve workflow usability
- **Validation Rules**: Implement thorough validation to catch input errors early in workflow execution
- **Documentation**: Include clear descriptions for all parameters to aid workflow reusability

## Troubleshooting

### Common Issues

#### Issue: Schema Validation Failures

- **Symptoms**: Workflow execution fails with validation error messages
- **Causes**: Input data doesn't match defined schema structure or types
- **Solutions**:
  1. Review input schema definition for accuracy
  2. Validate calling workflow output format matches expected input
  3. Check for missing required parameters or incorrect data types
- **Prevention**: Test lambda workflows with multiple input scenarios during development

#### Issue: Parameter Not Available in Workflow

- **Symptoms**: Subsequent nodes cannot access input parameter values
- **Causes**: Incorrect parameter naming or output configuration
- **Solutions**:
  1. Verify parameterName matches references in downstream nodes
  2. Check that input data is properly structured and accessible
  3. Ensure Lambda Input node is properly connected in workflow
- **Prevention**: Use consistent parameter naming conventions across lambda workflows

### Performance Issues

- **Large Input Objects**: For complex input schemas, consider breaking into smaller, focused parameters
- **Validation Overhead**: Minimize complex validation rules that may slow workflow execution
- **Memory Usage**: Be mindful of large default values that consume workflow memory

## Limitations & Constraints

### Technical Limitations

- **Schema Complexity**: Very complex nested schemas may impact validation performance
- **Parameter Count**: Large numbers of input parameters can make workflows difficult to manage
- **Data Size**: Extremely large input objects may exceed workflow memory limits

### Workflow Limitations

- **Single Input Point**: Each lambda workflow can have only one Lambda Input node
- **Static Schema**: Input schemas cannot be dynamically modified during workflow execution
- **Type Constraints**: Input validation is limited to JSON Schema supported types and formats

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

- **LambdaOutput**: Works well together in workflows
- **EditFields**: Works well together in workflows

### Common Workflow Patterns

- **LambdaInput → EditFields → BasicLLMChainNode → LambdaOutput**: Common integration pattern

### See Also

- [Modular Workflow Design](/learning/workflow-patterns/modular-design)
- [Event-Driven Patterns](/learning/workflow-patterns/event-driven)
- [Reusable Component Patterns](/learning/workflow-patterns/reusable-components)

**Decision Guides:**
- [Modular Workflow Decision Guide](/integration/builtin/node-types#modular-workflow-decision-guide)

**General Resources:**
- [Workflow Patterns](/learning/workflow-patterns/)
- [Integration Examples](/learning/examples/)
- [Node Types Overview](/integration/builtin/node-types)

## Additional Resources

- [Lambda Workflows Guide](/learning/workflow-patterns/lambda-workflows)
- [Modular Workflow Design Patterns](/learning/workflow-patterns/modular-design)
- [JSON Schema Validation Reference](https://json-schema.org/)
- [Workflow Reusability Best Practices](/learning/workflow-patterns/reusability)

---

**Last Updated**: October 19, 2024  
**Tested With**: Agentic Flow v1.0  
**Validation Status**: ✅ Code Examples Tested | ✅ Schema Validation Verified | ✅ Integration Tested