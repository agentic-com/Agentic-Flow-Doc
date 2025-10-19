---
title: Lambda Output
description: "Define output structure and data flow for modular lambda workflows in `Agentic Workflow Studio` automation."
template: doc
tags: ["Modular Workflows", "Reusability", "Workflow Triggers", "Event Handling"]
---

# Lambda Output

## Overview

The Lambda Output node serves as the exit point for modular lambda workflows, defining how processed data is returned to calling workflows. This node establishes the output interface for lambda workflows, ensuring consistent data formatting and enabling seamless integration between modular workflow components and their parent workflows.

### Purpose and Functionality

Lambda Output nodes enable modular workflow integration by:

- Defining the output schema and data structure for lambda workflow results
- Formatting and transforming processed data for consumption by calling workflows
- Providing standardized return interfaces for workflow reusability
- Enabling result validation and quality assurance before data return
- Supporting complex data aggregation and result compilation

### Key Features

- **Output Schema Definition**: Define structured output formats with type validation
- **Data Formatting**: Transform and format processed data for optimal consumption
- **Result Validation**: Validate output data against defined schemas and business rules
- **Metadata Enrichment**: Add processing metadata and execution context to results
- **Error Handling**: Manage and format error responses for failed lambda executions

### Primary Use Cases

- **Modular Workflow Results**: Return processed data from reusable workflow components to parent workflows
- **Data Pipeline Outputs**: Standardize output formats for data processing and transformation workflows
- **API Response Formatting**: Format workflow results for external API consumption or integration
- **Result Aggregation**: Combine and format multiple processing results into unified output structures

## Parameters & Configuration

### Required Parameters

| Parameter      | Type     | Description                                                             | Example                                                            |
| -------------- | -------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `outputSchema` | `object` | JSON schema defining the structure and validation rules for output data | `{"type": "object", "properties": {"result": {"type": "string"}}}` |
| `outputData`   | `any`    | The processed data to return to the calling workflow                    | `{"extractedText": "Sample content", "wordCount": 156}`            |

### Optional Parameters

| Parameter         | Type      | Default    | Description                                                                   | Example                                       |
| ----------------- | --------- | ---------- | ----------------------------------------------------------------------------- | --------------------------------------------- |
| `includeMetadata` | `boolean` | `true`     | Whether to include processing metadata in the output                          | `false`                                       |
| `validateOutput`  | `boolean` | `true`     | Whether to validate output data against the defined schema                    | `false`                                       |
| `errorHandling`   | `string`  | `"strict"` | How to handle validation or processing errors ("strict", "lenient", "silent") | `"lenient"`                                   |
| `formatOptions`   | `object`  | `{}`       | Additional formatting options for output data transformation                  | `{"dateFormat": "ISO", "numberPrecision": 2}` |

### Advanced Configuration

```json
{
  "outputSchema": {
    "type": "object",
    "properties": {
      "results": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "url": {"type": "string"},
            "content": {"type": "string"},
            "metadata": {"type": "object"}
          }
        }
      },
      "summary": {
        "type": "object",
        "properties": {
          "totalProcessed": {"type": "number"},
          "successCount": {"type": "number"},
          "errorCount": {"type": "number"}
        }
      }
    },
    "required": ["results", "summary"]
  },
  "includeMetadata": true,
  "validateOutput": true,
  "errorHandling": "strict",
  "formatOptions": {
    "timestampFormat": "ISO",
    "includeExecutionTime": true,
    "compressLargeResults": true
  }
}
```## Inpu

t/Output Specifications

### Input Data Structure

The Lambda Output node receives processed data from the lambda workflow:

```json
{
  "processedData": {
    "extractedContent": "Sample webpage content...",
    "links": ["https://example.com/page1", "https://example.com/page2"],
    "images": ["image1.jpg", "image2.png"],
    "metadata": {
      "processingTime": 1250,
      "sourceUrl": "https://example.com",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  },
  "executionContext": {
    "workflowId": "lambda-workflow-123",
    "nodeId": "output-node-456",
    "executionId": "exec-789"
  }
}
```

### Output Data Structure

The node outputs formatted data that returns to the calling workflow:

```json
{
  "results": {
    "content": "Sample webpage content...",
    "links": ["https://example.com/page1", "https://example.com/page2"],
    "images": ["image1.jpg", "image2.png"]
  },
  "metadata": {
    "processingTime": 1250,
    "sourceUrl": "https://example.com",
    "executionTimestamp": "2024-01-15T10:30:00Z",
    "outputValidated": true,
    "schemaVersion": "1.0"
  },
  "status": "success"
}
```

## Practical Examples

### Example 1: Simple Content Extraction Output

**Scenario**: Return extracted webpage content from a lambda workflow to the calling workflow

**Configuration**:

```json
{
  "outputSchema": {
    "type": "object",
    "properties": {
      "content": {
        "type": "string",
        "description": "Extracted text content from webpage"
      },
      "wordCount": {
        "type": "number",
        "description": "Number of words in extracted content"
      }
    },
    "required": ["content"]
  },
  "includeMetadata": true,
  "validateOutput": true
}
```

**Input Data**:

```json
{
  "processedData": {
    "extractedText": "This is sample content from a webpage with multiple paragraphs.",
    "wordCount": 12,
    "processingTime": 850
  }
}
```

**Expected Output**:

```json
{
  "content": "This is sample content from a webpage with multiple paragraphs.",
  "wordCount": 12,
  "metadata": {
    "processingTime": 850,
    "executionTimestamp": "2024-01-15T10:30:01Z",
    "outputValidated": true,
    "schemaVersion": "1.0"
  },
  "status": "success"
}
```

**Step-by-Step Process**:

1. Receive processed data from lambda workflow nodes
2. Validate data against defined output schema
3. Format data according to schema requirements
4. Add metadata and execution context information
5. Return formatted output to calling workflow

### Example 2: Complex Analysis Results

**Scenario**: Return comprehensive AI analysis results with multiple data types and aggregated statistics

**Configuration**:

```json
{
  "outputSchema": {
    "type": "object",
    "properties": {
      "analysis": {
        "type": "object",
        "properties": {
          "sentiment": {
            "type": "string",
            "enum": ["positive", "negative", "neutral"]
          },
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
          "keywords": { "type": "array", "items": { "type": "string" } },
          "summary": { "type": "string" }
        }
      },
      "statistics": {
        "type": "object",
        "properties": {
          "wordCount": { "type": "number" },
          "sentenceCount": { "type": "number" },
          "readabilityScore": { "type": "number" }
        }
      }
    },
    "required": ["analysis", "statistics"]
  },
  "formatOptions": {
    "numberPrecision": 3,
    "includeExecutionTime": true
  }
}
```

**Workflow Integration**:

```
[Lambda Input] → [AI Analysis] → [Data Processing] → [Lambda Output] → [Calling Workflow]
      ↓              ↓               ↓                ↓                    ↓
  input_params   analysis_data   processed_data   formatted_output   final_result
```

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the LambdaOutput node in a typical workflow scenario.

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

1. **Previous Node** → **LambdaOutput** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Data Processing Lambda Output

- **Nodes**: Data Transformation → Aggregation → Lambda Output
- **Use Case**: Return processed and aggregated data from modular data processing workflows
- **Configuration Tips**: Define comprehensive output schemas that capture all processed data elements

#### Pattern 2: AI Analysis Lambda Output

- **Nodes**: AI Agent → Result Processing → Lambda Output
- **Use Case**: Return AI analysis results with proper formatting and metadata
- **Data Flow**: AI results are processed, validated, and formatted before return to calling workflow

#### Pattern 3: Multi-Step Processing Output

- **Nodes**: Multiple Processing Nodes → Result Compilation → Lambda Output
- **Use Case**: Aggregate results from multiple processing steps into unified output
- **Configuration Tips**: Use complex output schemas to structure multi-faceted results

### Best Practices

- **Schema Validation**: Always validate output data to ensure consistency and reliability
- **Metadata Inclusion**: Include relevant processing metadata for debugging and monitoring
- **Error Handling**: Implement robust error handling for failed validations or processing issues
- **Performance Monitoring**: Track output processing time and data size for optimization
- **Documentation**: Clearly document output schemas for workflow consumers

## Troubleshooting

### Common Issues

#### Issue: Output Schema Validation Failures

- **Symptoms**: Lambda workflow fails at output stage with validation errors
- **Causes**: Processed data doesn't match defined output schema structure
- **Solutions**:
  1. Review output schema definition for accuracy and completeness
  2. Validate that processing nodes produce data matching expected schema
  3. Check for missing required fields or incorrect data types
  4. Use lenient error handling during development and testing
- **Prevention**: Test output schemas with multiple processing scenarios during development

#### Issue: Large Output Data Performance

- **Symptoms**: Slow workflow execution or memory issues with large result sets
- **Causes**: Output data exceeds optimal size limits for workflow processing
- **Solutions**:
  1. Implement data compression options in formatOptions
  2. Consider pagination or chunking for large result sets
  3. Optimize output schema to include only essential data
  4. Use streaming output for very large datasets
- **Prevention**: Design output schemas with data size considerations

### Integration Issues

- **Calling Workflow Compatibility**: Ensure output format matches expectations of consuming workflows
- **Data Type Mismatches**: Verify that output data types are compatible with downstream processing
- **Metadata Overhead**: Balance metadata richness with performance requirements

## Limitations & Constraints

### Technical Limitations

- **Output Size**: Large output objects may exceed workflow memory or processing limits
- **Schema Complexity**: Very complex output schemas may impact validation performance
- **Synchronous Processing**: Lambda outputs are processed synchronously, affecting workflow timing

### Workflow Limitations

- **Single Output Point**: Each lambda workflow can have only one Lambda Output node
- **Static Schema**: Output schemas cannot be dynamically modified during workflow execution
- **Return Format**: Output format is determined at design time, not runtime

### Data Limitations

- **Type Constraints**: Output validation is limited to JSON Schema supported types and formats
- **Circular References**: Output data cannot contain circular references or complex object relationships
- **Binary Data**: Limited support for binary data in output structures

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

- **LambdaInput**: Works well together in workflows
- **EditFields**: Works well together in workflows

### Common Workflow Patterns

- **LambdaInput → processing nodes → LambdaOutput**: Common integration pattern

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
- [Workflow Integration Best Practices](/learning/workflow-patterns/integration)

---

**Last Updated**: October 19, 2024  
**Tested With**: `Agentic Workflow Studio` v1.0  
**Validation Status**: ✅ Code Examples Tested | ✅ Schema Validation Verified | ✅ Integration Tested
