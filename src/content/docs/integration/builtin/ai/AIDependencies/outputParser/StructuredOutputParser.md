---
title: "StructuredOutputParser"
description: "Structured output parsing for AI responses with schema validation and type safety."
template: doc
tags: ["AI", "LLM", "Machine Learning", "Natural Language Processing", "Artificial Intelligence"]
---

# StructuredOutputParser

## Prerequisites

Before using this node, ensure you have:

- Basic understanding of workflow creation in Agentic Flow
- Appropriate browser permissions configured (if applicable)
- Required dependencies installed and configured

## Overview

The StructuredOutputParser node provides structured output parsing capabilities for AI responses, enabling schema validation, type safety, and consistent data formatting in AI-powered workflows.

### Purpose and Functionality

This node enables:
- Structured parsing of AI model outputs
- Schema validation and type checking
- Consistent data formatting across workflows
- Error handling for malformed responses

### Key Features

- **Schema Validation**: Enforce output structure and data types
- **Type Safety**: Ensure consistent data formats
- **Error Handling**: Graceful handling of parsing failures
- **Flexible Schemas**: Support for multiple output formats including JSON, XML, and structured text

## Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `schema` | `object` | Output schema definition | `{"type": "object"}` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `strict` | `boolean` | `true` | Enforce strict schema validation | `false` |

## Examples

### Basic Usage

**Configuration:**

```json
{
  "schema": {
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "age": {"type": "number"}
    }
  }
}
```

## Integration Patterns

### Common Workflow Patterns

- **AI Response → StructuredOutputParser → Data Processing**
- **LLM Chain → StructuredOutputParser → Validation**

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Schema validation failed | Invalid output format | Check schema definition |
| Parsing error | Malformed JSON | Validate AI response format |

## Related Nodes

### Complementary Nodes

- **Basic LLM Chain**: Generates responses for parsing
- **QA Node**: Provides structured question-answering

### Alternative Nodes

- **Raw LLM Output**: For unstructured responses