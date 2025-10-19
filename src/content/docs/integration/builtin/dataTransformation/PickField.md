---
title: "Pick Field"
description: "Select and extract specific fields from complex data structures with advanced filtering and nested field access capabilities."
template: doc
tags: ["Data Processing", "Field Manipulation", "Type Conversion", "Validation", "Formatting"]
---

# Pick Field

## Overview

The Pick Field node enables precise data selection by extracting specific fields from complex data structures. This node is essential for data filtering, reducing payload sizes, and preparing focused datasets for downstream processing. It provides powerful field selection capabilities with support for nested objects, arrays, and conditional field picking.

### Purpose and Functionality

Pick Field serves as a data filtering and selection tool that allows you to:
- Extract specific fields from large data objects
- Reduce data payload sizes for performance optimization
- Create focused datasets for specific workflow requirements
- Handle nested object structures and array elements
- Apply conditional field selection based on data content

```mermaid
graph TD
    A[Large Input Object] --> B[Pick Field Node]
    B --> C{Selection Mode}
    
    C -->|Include Mode| D[Select Specified Fields]
    C -->|Exclude Mode| E[Remove Specified Fields]
    
    D --> F[Field Path Resolution]
    E --> F
    
    F --> G[Nested Object Handling]
    G --> H[Array Element Processing]
    H --> I[Structure Preservation]
    I --> J[Filtered Output Object]
    
    subgraph "Field Selection"
        K[user.name]
        L[profile.email]
        M[posts[*].title]
        N[metadata.tags]
    end
    
    B --> K
    B --> L
    B --> M
    B --> N
    
    style B fill:#fff3e0
    style J fill:#e8f5e8
    style A fill:#ffebee
```

### Key Features

- **Selective Field Extraction**: Choose exactly which fields to include or exclude
- **Nested Field Support**: Access deeply nested object properties with dot notation
- **Array Element Selection**: Pick specific elements or ranges from arrays
- **Conditional Picking**: Apply rules to determine which fields to select
- **Performance Optimization**: Reduce memory usage by selecting only needed data

### Primary Use Cases

- **API Response Filtering**: Extract relevant data from large API responses
- **Data Privacy**: Remove sensitive fields before passing data to external services
- **Performance Optimization**: Reduce data size for faster processing and transmission
- **Focused Data Processing**: Create specialized datasets for specific workflow branches

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `fields` | `array` | List of field paths to pick from input data | `["name", "email", "profile.avatar"]` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `mode` | `string` | `"include"` | Selection mode: "include" or "exclude" | `"exclude"` |
| `preserve_structure` | `boolean` | `true` | Maintain original object structure for nested fields | `false` |
| `handle_missing` | `string` | `"ignore"` | How to handle missing fields: "ignore", "null", or "error" | `"null"` |
| `array_handling` | `string` | `"all"` | Array processing: "all", "first", "last", or index number | `"first"` |

### Advanced Configuration

```json
{
  "fields": [
    "user.id",
    "user.profile.name",
    "user.profile.email",
    "posts[0].title",
    "posts[*].created_date",
    "metadata.tags"
  ],
  "mode": "include",
  "preserve_structure": true,
  "handle_missing": "null",
  "array_handling": "all",
  "conditional_rules": [
    {
      "condition": "user.role === 'admin'",
      "additional_fields": ["admin_settings", "permissions"]
    }
  ]
}
```

## Input/Output Specifications

### Input Data Structure

```json
{
  "user": {
    "id": "user123",
    "profile": {
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "phone": "+1234567890"
    },
    "role": "admin",
    "settings": {
      "theme": "dark",
      "notifications": true
    }
  },
  "posts": [
    {
      "id": "post1",
      "title": "First Post",
      "content": "Lorem ipsum...",
      "created_date": "2024-01-15T10:00:00Z"
    },
    {
      "id": "post2",
      "title": "Second Post",
      "content": "More content...",
      "created_date": "2024-01-16T14:30:00Z"
    }
  ],
  "metadata": {
    "tags": ["tech", "tutorial"],
    "category": "blog"
  }
}
```

### Output Data Structure

```json
{
  "user": {
    "id": "user123",
    "profile": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "posts": [
    {
      "title": "First Post",
      "created_date": "2024-01-15T10:00:00Z"
    },
    {
      "title": "Second Post",
      "created_date": "2024-01-16T14:30:00Z"
    }
  ],
  "metadata": {
    "tags": ["tech", "tutorial"]
  },
  "selection_info": {
    "fields_selected": 5,
    "fields_missing": 0,
    "structure_preserved": true,
    "processing_time": 12
  }
}
```

## Practical Examples

### Example 1: Basic Field Selection

**Scenario**: Extract user contact information from a comprehensive user profile

**Configuration**:
```json
{
  "fields": ["name", "email", "phone"],
  "mode": "include",
  "handle_missing": "null"
}
```

**Input Data**:
```json
{
  "name": "Alice Johnson",
  "email": "alice@company.com",
  "phone": "+1987654321",
  "address": "123 Main St",
  "preferences": {"theme": "light"},
  "internal_id": "emp_456"
}
```

**Expected Output**:
```json
{
  "name": "Alice Johnson",
  "email": "alice@company.com",
  "phone": "+1987654321",
  "selection_info": {
    "fields_selected": 3,
    "fields_missing": 0,
    "structure_preserved": true,
    "processing_time": 8
  }
}
```

### Example 2: Nested Field Selection with Array Handling

**Scenario**: Extract specific product information from an e-commerce API response

**Configuration**:
```json
{
  "fields": [
    "product.name",
    "product.price",
    "reviews[*].rating",
    "reviews[*].comment",
    "inventory.stock_count"
  ],
  "preserve_structure": true,
  "array_handling": "all"
}
```

**Workflow Integration**:

```mermaid
flowchart LR
    A[API Request] --> B[Full Product Data]
    B --> C[Pick Field Node]
    C --> D[Selected Data]
    D --> E[Price Calculator]
    E --> F[Processed Results]
    
    subgraph "Data Reduction"
        G[Complete API Response<br/>~50KB]
        H[Selected Fields<br/>~5KB]
    end
    
    B --> G
    D --> H
    
    subgraph "Selected Fields"
        I[product.name]
        J[product.price]
        K[reviews[*].rating]
        L[inventory.stock_count]
    end
    
    C --> I
    C --> J
    C --> K
    C --> L
    
    style C fill:#fff3e0
    style H fill:#e8f5e8
    style G fill:#ffebee
```

**Complete Example**:
```json
{
  "input": {
    "product": {
      "id": "prod123",
      "name": "Wireless Headphones",
      "price": 99.99,
      "description": "High-quality wireless headphones...",
      "specifications": {"battery": "20h", "weight": "250g"}
    },
    "reviews": [
      {"id": "rev1", "rating": 5, "comment": "Excellent!", "user": "user1"},
      {"id": "rev2", "rating": 4, "comment": "Good quality", "user": "user2"}
    ],
    "inventory": {
      "stock_count": 15,
      "warehouse": "WH001",
      "last_updated": "2024-01-15T10:00:00Z"
    }
  },
  "output": {
    "product": {
      "name": "Wireless Headphones",
      "price": 99.99
    },
    "reviews": [
      {"rating": 5, "comment": "Excellent!"},
      {"rating": 4, "comment": "Good quality"}
    ],
    "inventory": {
      "stock_count": 15
    }
  }
}
```

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the PickField node in a typical workflow scenario.

**Configuration:**

```json
{
  "field": "example_value",
  "operation": true
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

1. **Previous Node** → **PickField** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: API Response Processing

- **Nodes**: HTTP Request → Pick Field → Edit Fields → Database Insert
- **Use Case**: Clean and filter API responses before storage
- **Configuration Tips**: Use Pick Field first to reduce data size, then Edit Fields for transformation

#### Pattern 2: Data Privacy Pipeline

- **Nodes**: Database Query → Pick Field → External API → Response Handler
- **Use Case**: Remove sensitive data before sending to external services
- **Data Flow**: Full data → filtered data → external processing → results

### Best Practices

- **Performance**: Use Pick Field early in workflows to reduce data processing overhead
- **Error Handling**: Set handle_missing to "null" for optional fields, "error" for required fields
- **Data Validation**: Combine with validation nodes to ensure selected fields meet requirements
- **Resource Management**: Use exclude mode when you need most fields except a few sensitive ones

## Troubleshooting

### Common Issues

#### Issue: Missing Field Errors

- **Symptoms**: Node fails when specified fields don't exist in input data
- **Causes**: Inconsistent input data structure or incorrect field paths
- **Solutions**: 
  1. Set handle_missing to "ignore" or "null"
  2. Verify field paths using dot notation correctly
  3. Check input data structure before field selection
- **Prevention**: Use conditional field selection for optional fields

#### Issue: Nested Field Access Problems

- **Symptoms**: Nested fields not being selected correctly
- **Causes**: Incorrect dot notation syntax or array index specification
- **Solutions**: 
  1. Use correct dot notation: "object.property.subproperty"
  2. For arrays, use [*] for all elements or [0] for specific index
  3. Enable preserve_structure for nested object maintenance
- **Prevention**: Test field paths with sample data

### Performance Issues

- **Slow Processing**: Reduce the number of fields or use exclude mode for large objects
- **Memory Usage**: Process large arrays in chunks using array_handling options
- **Deep Nesting**: Limit nesting depth to avoid performance degradation

## Limitations & Constraints

### Technical Limitations

- **Field Path Depth**: Maximum 10 levels of nesting supported
- **Array Size**: Performance degrades with arrays larger than 10,000 elements

### Data Limitations

- **Input Size**: Maximum 50MB per input object
- **Field Count**: Maximum 500 field paths per selection operation
- **Processing Time**: Complex selections timeout after 60 seconds

## Key Terminology

**Field Transformation**: Process of modifying data field names, types, or values

**Type Conversion**: Converting data from one type to another (string, number, boolean, etc.)

**Data Validation**: Process of ensuring data meets specified criteria and constraints

**Schema**: Structure definition that describes the format and constraints of data

**Serialization**: Process of converting data structures into a format for storage or transmission

## Search & Discovery

### Keywords

- data processing
- field manipulation
- type conversion
- data validation
- formatting
- transformation

### Common Search Terms

- "transform"
- "convert"
- "format"
- "edit"
- "modify"
- "process"
- "validate"
- "clean"
- "restructure"

### Primary Use Cases

- data cleaning
- format conversion
- field manipulation
- data validation
- report generation
- data processing

## Learning Path

### Skill Level: Beginner

## Enhanced Cross-References

### Workflow Patterns

- [Data Processing Patterns](/learning/workflow-patterns/data-processing-patterns)
- [Content Manipulation Patterns](/learning/workflow-patterns/content-manipulation-patterns)
- [Data Validation Workflows](/learning/workflow-patterns/validation-patterns)

### Related Tutorials

- [Data Processing Fundamentals](/learning/text-courses/intermediate/data-transformation)
- [Advanced Data Manipulation](/learning/text-courses/advanced/data-processing)

### Practical Examples

- [Real-World Use Cases](/learning/examples/)
- [Integration Examples](/learning/examples/multi-node-automation)
- [Best Practice Examples](/learning/workflow-patterns/optimization-best-practices)

## Related Nodes

### Similar Functionality

- **EditFields**: Use when you need different approach to similar functionality
- **Code**: Use when you need different approach to similar functionality

### Complementary Nodes

- **Filter**: Works well together in workflows
- **EditFields**: Works well together in workflows

### Common Workflow Patterns

- **Http-Request → PickField → EditFields**: Common integration pattern
- **PickField → Filter → DownloadAsFile**: Common integration pattern

### See Also

- [Data Processing Patterns](/learning/workflow-patterns/data-processing-patterns)
- [Data Transformation Guide](/usage/key-concepts/data/transforming-data)
- [Data Mapping Expressions](/usage/key-concepts/data/data-mapping/data-mapping-expressions)
- [Field Validation Examples](/learning/examples/data-validation-workflows)

**Decision Guides:**
- [Data Transformation Decision Guide](#data-transformation-decision-guide)

**General Resources:**
- [Workflow Patterns](/learning/workflow-patterns/)
- [Integration Examples](/learning/examples/)
- [Node Types Overview](/integration/builtin/node-types)

## Additional Resources

- [Data Selection Patterns Tutorial](/learning/workflow-patterns/data-processing-patterns)
- [API Response Processing Guide](/advanced-ai/examples/api-workflow-tool)
- [Performance Optimization Best Practices](/learning/workflow-patterns/optimization-best-practices)