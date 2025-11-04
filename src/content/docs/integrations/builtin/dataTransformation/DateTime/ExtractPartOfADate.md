---
title: "Extract Part Of A Date"
description: "Extract specific components from dates including year, month, day, time parts, and timezone information with flexible parsing and formatting options."
template: doc
tags: ["Data Processing", "Field Manipulation", "Type Conversion", "Validation", "Formatting"]
---

# Extract Part Of A Date

## Prerequisites

Before using this node, ensure you have:

- Basic understanding of workflow creation in `Agentic Workflow Studio`
- Appropriate browser permissions configured (if applicable)
- Required dependencies installed and configured

## Overview

The Extract Part Of A Date node provides comprehensive date parsing and component extraction capabilities for breaking down dates into their constituent parts. This node handles multiple date formats including ISO 8601, locale-specific, and custom formats, timezone conversions, and specialized date components, making it essential for date analysis, filtering, and conditional workflow logic based on temporal data.

### Purpose and Functionality

Extract Part Of A Date serves as a powerful date parsing tool that allows you to:
- Extract individual components like year, month, day, hour, minute, second
- Parse dates from multiple input formats and string representations
- Handle timezone information and convert between timezones
- Calculate derived values like day of week, quarter, week number
- Support batch extraction from multiple dates simultaneously

### Key Features

- **Comprehensive Component Extraction**: Extract any date/time component including derived values
- **Multi-Format Parsing**: Handle multiple date string formats and automatic format detection
- **Timezone Processing**: Extract and convert timezone information
- **Derived Calculations**: Calculate day of week, quarter, week of year, and more
- **Batch Processing**: Extract components from multiple dates in one operation

### Primary Use Cases

- **Date Filtering**: Extract components for conditional workflow logic
- **Analytics and Reporting**: Break down dates for time-based analysis
- **Data Validation**: Verify date components meet specific criteria
- **Scheduling Logic**: Extract time components for scheduling decisions

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `input_date` | `string/date` | Date to extract components from | `"2024-01-15T14:30:45Z"` |
| `components` | `array` | List of components to extract | `["year", "month", "day", "hour"]` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `input_format` | `string` | `"auto"` | Expected input format or "auto" for detection | `"YYYY-MM-DD HH:mm:ss"` |
| `timezone` | `string` | `"UTC"` | Timezone for extraction | `"America/New_York"` |
| `locale` | `string` | `"en-US"` | Locale for text-based components | `"fr-FR"` |
| `output_format` | `string` | `"object"` | Output format: "object", "array", or "flat" | `"flat"` |

### Available Components

| Component | Description | Example Output |
|-----------|-------------|----------------|
| `year` | Four-digit year | `2024` |
| `month` | Month number (1-12) | `1` |
| `month_name` | Full month name | `"January"` |
| `month_short` | Abbreviated month name | `"Jan"` |
| `day` | Day of month (1-31) | `15` |
| `day_of_week` | Day of week (0=Sunday, 6=Saturday) | `1` |
| `day_name` | Full day name | `"Monday"` |
| `day_short` | Abbreviated day name | `"Mon"` |
| `hour` | Hour (0-23) | `14` |
| `minute` | Minute (0-59) | `30` |
| `second` | Second (0-59) | `45` |
| `millisecond` | Millisecond (0-999) | `123` |
| `quarter` | Quarter of year (1-4) | `1` |
| `week_of_year` | Week number in year | `3` |
| `day_of_year` | Day number in year (1-366) | `15` |
| `timezone_offset` | Timezone offset in minutes | `-300` |
| `timezone_name` | Timezone abbreviation | `"EST"` |
| `is_weekend` | Boolean indicating weekend | `false` |
| `is_leap_year` | Boolean indicating leap year | `true` |

### Advanced Configuration

```json
{
  "input_date": "2024-01-15T14:30:45.123Z",
  "components": [
    "year", "month", "day", "hour", "minute",
    "day_name", "quarter", "week_of_year", "is_weekend"
  ],
  "timezone": "America/New_York",
  "locale": "en-US",
  "output_format": "object",
  "custom_components": {
    "fiscal_year": {
      "start_month": 4,
      "calculation": "year + (month >= 4 ? 0 : -1)"
    },
    "business_quarter": {
      "q1_start": 4,
      "calculation": "custom"
    }
  }
}
```

## Input/Output Specifications

### Input Data Structure

```json
{
  "date": "2024-01-15T14:30:45.123Z",
  "extraction_config": {
    "components": ["year", "month", "day", "day_name", "quarter"],
    "timezone": "America/New_York",
    "locale": "en-US"
  }
}
```

### Output Data Structure

```json
{
  "original_date": "2024-01-15T14:30:45.123Z",
  "extracted_components": {
    "year": 2024,
    "month": 1,
    "day": 15,
    "hour": 9,
    "minute": 30,
    "day_name": "Monday",
    "quarter": 1,
    "week_of_year": 3,
    "is_weekend": false,
    "timezone_name": "EST",
    "timezone_offset": -300
  },
  "metadata": {
    "input_timezone": "UTC",
    "output_timezone": "America/New_York",
    "locale_used": "en-US",
    "parsing_time": 8,
    "components_extracted": 10
  }
}
```

## Practical Examples

### Example 1: Basic Component Extraction

**Scenario**: Extract year, month, and day from a timestamp for date-based filtering

**Configuration**:
```json
{
  "input_date": "2024-01-15T14:30:45Z",
  "components": ["year", "month", "day"],
  "output_format": "flat"
}
```

**Input Data**:
```json
{
  "event_timestamp": "2024-01-15T14:30:45Z"
}
```

**Expected Output**:
```json
{
  "year": 2024,
  "month": 1,
  "day": 15,
  "metadata": {
    "components_extracted": 3,
    "parsing_time": 5
  }
}
```

### Example 2: Comprehensive Date Analysis

**Scenario**: Extract multiple components for analytics dashboard

**Configuration**:
```json
{
  "input_date": "2024-01-15T14:30:45Z",
  "components": [
    "year", "month", "month_name", "day", "day_name",
    "quarter", "week_of_year", "is_weekend", "hour"
  ],
  "timezone": "America/New_York",
  "locale": "en-US"
}
```

**Workflow Integration**:
```
Data Source → Extract Part Of A Date → Analytics Filter
     ↓              ↓                      ↓
  timestamps    date_components      filtered_data
```

**Complete Example**:
```json
{
  "input": {
    "user_activity": [
      {"timestamp": "2024-01-15T14:30:45Z", "action": "login"},
      {"timestamp": "2024-01-15T16:45:30Z", "action": "purchase"}
    ]
  },
  "processing": {
    "extract_from_each": "timestamp",
    "components": ["hour", "day_name", "is_weekend"]
  },
  "output": {
    "enriched_activity": [
      {
        "timestamp": "2024-01-15T14:30:45Z",
        "action": "login",
        "hour": 9,
        "day_name": "Monday",
        "is_weekend": false
      },
      {
        "timestamp": "2024-01-15T16:45:30Z",
        "action": "purchase",
        "hour": 11,
        "day_name": "Monday",
        "is_weekend": false
      }
    ]
  }
}
```

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the ExtractPartOfADate node in a typical workflow scenario.

**Configuration:**

```json
{
  "date": "example_value",
  "format": true
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

1. **Previous Node** → **ExtractPartOfADate** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Date-Based Filtering

- **Nodes**: Data Source → Extract Part Of A Date → Filter → Processing
- **Use Case**: Filter data based on specific date components
- **Configuration Tips**: Extract only the components needed for filtering to optimize performance

#### Pattern 2: Analytics Enrichment

- **Nodes**: Raw Data → Extract Part Of A Date → Edit Fields → Analytics Dashboard
- **Use Case**: Enrich data with temporal components for analysis
- **Data Flow**: Raw timestamps → date components → structured data → visualizations

### Best Practices

- **Performance**: Extract only the components you need to minimize processing time
- **Error Handling**: Validate date formats before extraction to prevent parsing errors
- **Data Validation**: Check for null or invalid dates in input data
- **Resource Management**: Use batch processing for large datasets

## Troubleshooting

### Common Issues

#### Issue: Date Parsing Failures

- **Symptoms**: Node fails to parse input dates or returns null values
- **Causes**: Unsupported date format or invalid date strings
- **Solutions**:
  1. Specify input_format explicitly instead of using "auto"
  2. Validate date strings before extraction
  3. Use standard ISO date formats when possible
- **Prevention**: Standardize date formats in your data pipeline

#### Issue: Timezone Conversion Problems

- **Symptoms**: Incorrect time components or unexpected timezone results
- **Causes**: Invalid timezone identifiers or daylight saving time issues
- **Solutions**:
  1. Use valid IANA timezone identifiers
  2. Check timezone_offset in output for verification
  3. Test around DST transition dates
- **Prevention**: Validate timezone strings and handle DST transitions

### Performance Issues

- **Slow Extraction**: Reduce the number of components or use batch processing
- **Memory Usage**: Process large date arrays in chunks
- **Locale Loading**: Cache locale data for frequently used locales

## Limitations & Constraints

### Technical Limitations

- **Date Range**: Supports dates from 1900-01-01 to 2100-12-31
- **Component Limit**: Maximum 20 components per extraction operation

### Format Limitations

- **Auto-Detection**: May not correctly identify all custom date formats
- **Ambiguous Dates**: MM/DD/YYYY vs DD/MM/YYYY requires explicit format specification
- **Locale Support**: Some locales may have limited component name translations

### Data Limitations

- **Input Size**: Maximum 1000 dates per batch operation
- **Processing Time**: Complex extractions timeout after 30 seconds
- **Memory Usage**: Large component extractions may require chunking

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

- **AddToADate**: Use when you need different approach to similar functionality
- **SubstractFromDate**: Use when you need different approach to similar functionality

### Complementary Nodes

- **FormatDate**: Works well together in workflows
- **GetCurrentDate**: Works well together in workflows
- **EditFields**: Works well together in workflows

### Common Workflow Patterns

- **GetCurrentDate → ExtractPartOfADate → EditFields**: Common integration pattern
- **Http-Request → ExtractPartOfADate → Filter**: Common integration pattern

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

- [Date Component Analysis Tutorial](/learning/workflow-patterns/data-processing-patterns)
- [Timezone Handling Guide](/usage/key-concepts/data/date-time-handling)
- [Analytics Dashboard Examples](/learning/examples/data-analytics-workflows)