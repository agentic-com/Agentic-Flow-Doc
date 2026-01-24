---
title: Lambda Workflow
description: "Run other workflows inside your main workflow to create reusable, modular automation components."
---

# Lambda Workflow

**What it does:** Runs other workflows inside your main workflow to create reusable, modular automation components.

**Perfect for:** Reusable components • Complex workflows • Shared logic • Modular design

## What It Does

- **Run sub-workflows** - Execute complete workflows as single steps
- **Pass data between workflows** - Send data in and get results back
- **Create reusable components** - Build workflows you can use in multiple places
- **Organize complex logic** - Break big workflows into smaller, manageable pieces

### Purpose and Functionality

The Lambda Workflow node acts as a bridge between workflows, allowing you to:

- Execute complete workflows as individual processing steps
- Pass data from the parent workflow to the sub-workflow through defined inputs
- Receive processed results back through defined outputs
- Create reusable workflow components that can be shared across multiple projects
- Build complex workflow hierarchies with clear separation of concerns

This node is essential for creating scalable workflow architectures where common processing patterns can be abstracted into reusable components, reducing duplication and improving maintainability.

### Key Features

- **Workflow Composition**: Execute any workflow as a sub-component within another workflow
- **Typed Input/Output**: Strict data contracts through LambdaInput and LambdaOutput nodes
- **Parameter Passing**: Pass configuration and data from parent to child workflow
- **Result Integration**: Seamlessly integrate sub-workflow results into parent workflow data flow
- **Execution Isolation**: Sub-workflows execute in their own context with clear boundaries
- **Error Propagation**: Proper error handling and propagation from sub-workflows to parent

### Primary Use Cases

- **Data Processing Pipelines**: Break complex data transformations into reusable processing stages
- **Multi-Step Validation**: Create reusable validation workflows that can be applied to different data types
- **Content Generation**: Compose content creation workflows from smaller, specialized sub-workflows
- **API Integration Patterns**: Create reusable API interaction patterns that can be used across multiple workflows
- **Business Logic Modules**: Encapsulate specific business rules and logic into callable workflow components

## Parameters & Configuration

### Required Parameters

| Parameter    | Type     | Description                                                                          | Example                   |
| ------------ | -------- | ------------------------------------------------------------------------------------ | ------------------------- |
| `workflowId` | `string` | The unique identifier of the workflow to execute as a lambda function                | `"data-processor-v2"`     |
| `inputData`  | `object` | Data object containing all inputs required by the target workflow's LambdaInput node | `{"text": "Hello World"}` |

### Optional Parameters

| Parameter        | Type      | Default | Description                                                  | Example |
| ---------------- | --------- | ------- | ------------------------------------------------------------ | ------- |
| `timeout`        | `number`  | `30000` | Maximum execution time in milliseconds before timeout        | `60000` |
| `retryAttempts`  | `number`  | `1`     | Number of retry attempts if the sub-workflow execution fails | `3`     |
| `asyncExecution` | `boolean` | `false` | Whether to execute the sub-workflow asynchronously           | `true`  |

### Advanced Configuration

```json
{
  "workflowId": "content-analyzer",
  "inputData": {
    "content": "Sample text to analyze",
    "analysisType": "sentiment",
    "options": {
      "includeKeywords": true,
      "language": "en"
    }
  },
  "timeout": 45000,
  "retryAttempts": 2,
  "asyncExecution": false,
  "errorHandling": {
    "continueOnError": false,
    "defaultOutput": null
  }
}
```

## Browser API Integration

### Required Permissions

The Lambda Workflow node operates entirely within the `Agentic WorkFlow` environment and does not require additional browser permissions beyond those already granted to the main application.

### Browser APIs Used

- **Workflow Engine API**: Internal API for workflow execution and management
- **Data Serialization**: JSON serialization for data passing between workflows
- **Event System**: Internal event system for workflow lifecycle management

### Cross-Browser Compatibility

| Feature            | Chrome  | Firefox | Safari  | Edge    |
| ------------------ | ------- | ------- | ------- | ------- |
| Workflow Execution | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Data Serialization | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Error Handling     | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Async Execution    | ✅ Full | ✅ Full | ✅ Full | ✅ Full |

### Security Considerations

- **Execution Isolation**: Sub-workflows execute in isolated contexts to prevent data leakage
- **Input Validation**: All input data is validated against the target workflow's input schema
- **Access Control**: Sub-workflows inherit the security context of the parent workflow
- **Resource Limits**: Execution time and resource usage are monitored and limited
- **Data Privacy**: No data is persisted between workflow executions unless explicitly configured

## Input/Output Specifications

### Input Data Structure

```json
{
  "workflowId": "string",
  "inputData": {
    "field1": "any_type",
    "field2": "any_type",
    "nested_object": {
      "property": "value"
    }
  },
  "executionOptions": {
    "timeout": "number",
    "retryAttempts": "number"
  }
}
```

### Output Data Structure

```json
{
  "result": {
    "output_field1": "any_type",
    "output_field2": "any_type",
    "processed_data": "any_type"
  },
  "execution": {
    "workflowId": "string",
    "executionTime": "number_ms",
    "status": "success|error",
    "nodeCount": "number"
  },
  "metadata": {
    "timestamp": "ISO_8601_string",
    "parentWorkflowId": "string",
    "executionId": "string"
  }
}
```

## Practical Examples

### Example 1: Text Processing Pipeline

**Scenario**: Execute a reusable text analysis workflow that performs sentiment analysis, keyword extraction, and content summarization.

**Configuration**:

```json
{
  "workflowId": "text-analyzer-v1",
  "inputData": {
    "text": "The new product launch exceeded all expectations with overwhelmingly positive customer feedback.",
    "analysisType": "comprehensive"
  },
  "timeout": 30000
}
```

**Input Data**:

```json
{
  "text": "The new product launch exceeded all expectations with overwhelmingly positive customer feedback.",
  "analysisType": "comprehensive"
}
```

**Expected Output**:

```json
{
  "result": {
    "sentiment": {
      "score": 0.85,
      "label": "positive"
    },
    "keywords": ["product", "launch", "positive", "feedback"],
    "summary": "Successful product launch with positive reception"
  },
  "execution": {
    "workflowId": "text-analyzer-v1",
    "executionTime": 2500,
    "status": "success",
    "nodeCount": 8
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "parentWorkflowId": "main-content-processor",
    "executionId": "exec_12345"
  }
}
```

**Step-by-Step Process**:

1. Lambda Workflow node receives input data and target workflow ID
2. System validates that the target workflow exists and is accessible
3. Input data is validated against the target workflow's LambdaInput schema
4. Sub-workflow is executed with the provided input data
5. Results are collected from the sub-workflow's LambdaOutput node
6. Formatted response is returned to the parent workflow

### Example 2: Data Validation and Enrichment

**Scenario**: Use a specialized validation workflow to check and enrich customer data before processing in the main workflow.

**Configuration**:

```json
{
  "workflowId": "customer-data-validator",
  "inputData": {
    "customerData": {
      "email": "john.doe@example.com",
      "phone": "+1-555-0123",
      "address": "123 Main St, Anytown, USA"
    },
    "validationLevel": "strict",
    "enrichmentOptions": {
      "includeGeolocation": true,
      "validateEmail": true
    }
  },
  "retryAttempts": 2
}
```

**Workflow Integration**:

```
[Data Input] → [Lambda Workflow] → [Customer Processing]
     ↓              ↓                    ↓
  raw_data    validated_data      processed_customer
```

**Complete Example**:

This example shows how to integrate the Lambda Workflow node into a customer onboarding process where data validation and enrichment are handled by a specialized sub-workflow, keeping the main workflow focused on business logic.

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Sequential Processing Chain

- **Nodes**: [Data Input] → [Lambda Workflow] → [Result Processor]
- **Use Case**: When you need to apply a standardized processing step in multiple workflows
- **Configuration Tips**: Ensure the Lambda Workflow's output format matches the next node's expected input

#### Pattern 2: Parallel Sub-Workflow Execution

- **Nodes**: [Data Splitter] → [Multiple Lambda Workflows] → [Result Merger]
- **Use Case**: When different aspects of data need specialized processing
- **Data Flow**: Split input data, process each part with specialized sub-workflows, merge results

#### Pattern 3: Conditional Sub-Workflow Selection

- **Nodes**: [Condition Check] → [Lambda Workflow A/B] → [Result Handler]
- **Use Case**: When different processing logic is needed based on input characteristics
- **Configuration Tips**: Use conditional nodes to select the appropriate sub-workflow based on data properties

### Best Practices

- **Performance**: Cache frequently used sub-workflows to reduce initialization overhead
- **Error Handling**: Always configure appropriate timeout values and retry attempts for sub-workflows
- **Data Validation**: Validate input data format before passing to sub-workflows to prevent execution errors
- **Resource Management**: Monitor sub-workflow execution times and optimize complex workflows
- **Version Management**: Use versioned workflow IDs to ensure consistent behavior across deployments

## Troubleshooting

### Common Issues

#### Issue: Sub-Workflow Not Found

- **Symptoms**: Error message "Workflow with ID 'xxx' not found" during execution
- **Causes**:
  - Incorrect workflow ID specified
  - Target workflow has been deleted or renamed
  - Insufficient permissions to access the target workflow
- **Solutions**:
  1. Verify the workflow ID exists in your workspace
  2. Check that the workflow is published and accessible
  3. Ensure you have execution permissions for the target workflow
- **Prevention**: Use workflow management tools to track workflow IDs and maintain an inventory

#### Issue: Input Data Validation Errors

- **Symptoms**: "Input validation failed" errors when executing the sub-workflow
- **Causes**:
  - Input data doesn't match the LambdaInput node schema in the target workflow
  - Missing required fields in the input data
  - Incorrect data types for input fields
- **Solutions**:
  1. Review the target workflow's LambdaInput node configuration
  2. Ensure all required fields are provided with correct data types
  3. Validate input data structure before passing to the Lambda Workflow node
- **Prevention**: Document input schemas for all lambda workflows and validate data early in the parent workflow

#### Issue: Sub-Workflow Timeout

- **Symptoms**: "Workflow execution timeout" errors after the specified timeout period
- **Causes**:
  - Sub-workflow contains long-running operations
  - Network delays in API calls within the sub-workflow
  - Inefficient workflow design causing slow execution
- **Solutions**:
  1. Increase the timeout value for complex sub-workflows
  2. Optimize the sub-workflow for better performance
  3. Consider breaking complex sub-workflows into smaller components
- **Prevention**: Profile sub-workflow execution times and set appropriate timeout values

### Browser-Specific Issues

#### Chrome

- Memory usage may increase with deeply nested workflow hierarchies
- Use Chrome DevTools to monitor memory usage during complex workflow executions

#### Firefox

- Slightly slower JSON serialization for large data objects
- Consider data size optimization for Firefox deployments

### Performance Issues

- **Slow Processing**: Optimize sub-workflows by reducing unnecessary nodes and API calls
- **Memory Usage**: Limit the depth of nested Lambda Workflow calls to prevent memory issues
- **Execution Queuing**: Monitor concurrent sub-workflow executions to prevent resource contention

## Limitations & Constraints

### Technical Limitations

- **Nesting Depth**: Maximum of 5 levels of nested Lambda Workflow calls to prevent infinite recursion
- **Execution Time**: Individual sub-workflow execution is limited to 5 minutes maximum
- **Data Size**: Input and output data is limited to 10MB per execution
- **Concurrent Executions**: Maximum of 10 concurrent sub-workflow executions per parent workflow

### Browser Limitations

- **Memory Constraints**: Large data objects may cause memory issues in resource-constrained environments
- **Storage Limits**: Temporary data storage during execution is subject to browser storage limits

### Data Limitations

- **Input Size**: Maximum input data size of 10MB per Lambda Workflow execution
- **Output Format**: Output must be JSON-serializable data structures
- **Processing Time**: Sub-workflows must complete within the specified timeout period

## Related Nodes

### Similar Functionality

- **HTTP Request Node**: For calling external APIs instead of internal workflows
- **Code Execution Node**: For running custom code instead of predefined workflows

### Complementary Nodes

- **LambdaInput Node**: Defines the input interface for workflows that will be called by Lambda Workflow nodes
- **LambdaOutput Node**: Defines the output interface for workflows that will be called by Lambda Workflow nodes
- **Conditional Node**: For selecting which sub-workflow to execute based on conditions
- **Data Transformer Node**: For preparing data before passing to sub-workflows

### Workflow Suggestions

- For data processing pipelines, consider combining with: Data Transformer, Validator, Result Merger
- For complex business logic, this node works well after: Conditional Logic, Data Preparation
- For result processing, follow this node with: Data Transformer, Result Validator, Output Formatter

## Version History

### Current Version: 2.1.0

- Added support for asynchronous sub-workflow execution
- Improved error handling and propagation from sub-workflows
- Enhanced input validation with detailed error messages

### Previous Versions

- **2.0.0**: Added retry mechanism and timeout configuration
- **1.5.0**: Introduced execution metadata in output
- **1.0.0**: Initial release with basic sub-workflow execution

## Additional Resources

- [Creating Lambda Workflows Tutorial](/learning/tutorials/lambda-workflows)
- [Workflow Composition Best Practices](/learning/best-practices/workflow-composition)
- [LambdaInput Node Documentation](/nodes/builtin/lambda/LambdaInput)
- [LambdaOutput Node Documentation](/nodes/builtin/lambda/LambdaOutput)

---

**Last Updated**: January 15, 2024
**Tested With**: Browser Extension v2.1.0
**Validation Status**: ✅ Code Examples Tested | ✅ Browser Compatibility Verified | ✅ User Tested
