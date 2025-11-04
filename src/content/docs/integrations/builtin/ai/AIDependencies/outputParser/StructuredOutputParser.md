---
title: "Structured Output Parser"
description: "Make sure AI gives you data in exactly the format you need - no messy, inconsistent responses."
template: doc
tags: ["AI", "LLM", "Machine Learning", "Natural Language Processing", "Artificial Intelligence"]
---

# Structured Output Parser (Format AI Responses)

## What It Does

The Structured Output Parser makes sure AI gives you data in exactly the format you want. Instead of getting messy, unpredictable text, you get clean, organized data that's ready to use in your workflows.

## What Goes In, What Comes Out

### Input
| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| `ai_response` | Text | Raw AI response to format | Yes | - |
| `format_type` | Text | How you want the data formatted | Yes | - |
| `required_fields` | Array | What information must be included | No | [] |

### Output
| Name | Type | Description |
|------|------|-------------|
| `structured_data` | Object | Clean, formatted data |
| `validation_status` | Text | Whether formatting was successful |
| `missing_fields` | Array | Any required information that wasn't found |

## Perfect For

**📊 Data Extraction**: Turn messy AI responses into clean spreadsheet data  
**🔄 Workflow Integration**: Get data in the exact format your next step needs  
**✅ Quality Control**: Make sure AI responses always include required information  
**📋 Report Generation**: Format AI analysis into consistent report structures

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