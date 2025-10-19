---
title: "Get Time Between Dates"
description: "Calculate precise time differences between dates with multiple unit options, business day calculations, and timezone handling for duration analysis."
template: doc
tags: ["Data Processing", "Field Manipulation", "Type Conversion", "Validation", "Formatting"]
---

# Get Time Between Dates

## Prerequisites

Before using this node, ensure you have:

- Basic understanding of workflow creation in Agentic Flow
- Appropriate browser permissions configured (if applicable)
- Required dependencies installed and configured

## Overview

The Get Time Between Dates node provides comprehensive date difference calculations for determining time spans between two dates. This node handles complex duration calculations including business days, timezone considerations, and multiple output units, making it essential for analytics, scheduling, and time-based business logic.

### Purpose and Functionality

Get Time Between Dates serves as a powerful duration calculation tool that allows you to:
- Calculate precise time differences in multiple units (years, months, days, hours, etc.)
- Handle business day calculations excluding weekends and holidays
- Account for timezone differences between dates
- Provide multiple simultaneous unit calculations
- Support batch processing of multiple date pairs

### Key Features

- **Multi-Unit Calculations**: Get differences in years, months, weeks, days, hours, minutes, seconds
- **Business Day Support**: Calculate working days excluding weekends and custom holidays
- **Timezone Handling**: Account for timezone differences in calculations
- **Precision Control**: Choose calculation precision and rounding methods
- **Batch Processing**: Calculate differences for multiple date pairs simultaneously

### Primary Use Cases

- **Duration Analysis**: Calculate project durations, age calculations, and time spans
- **Business Metrics**: Measure response times, processing durations, and SLA compliance
- **Scheduling Logic**: Determine time remaining until deadlines or events
- **Analytics**: Generate time-based insights and duration statistics

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `start_date` | `string/date` | Starting date for calculation | `"2024-01-15T10:00:00Z"` |
| `end_date` | `string/date` | Ending date for calculation | `"2024-02-15T16:30:00Z"` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `units` | `array` | `["days"]` | Units to calculate: "years", "months", "weeks", "days", "hours", "minutes", "seconds" | `["days", "hours"]` |
| `business_days_only` | `boolean` | `false` | Calculate business days excluding weekends | `true` |
| `holidays` | `array` | `[]` | List of holiday dates to exclude | `["2024-12-25", "2024-01-01"]` |
| `precision` | `number` | `2` | Decimal places for fractional results | `3` |
| `absolute_value` | `boolean` | `true` | Return absolute difference (positive result) | `false` |

### Advanced Configuration

```json
{
  "start_date": "2024-01-15T10:00:00Z",
  "end_date": "2024-02-15T16:30:00Z",
  "units": ["days", "hours", "minutes", "business_days"],
  "business_days_only": false,
  "holidays": [
    "2024-01-15",
    "2024-02-19"
  ],
  "precision": 2,
  "absolute_value": true,
  "timezone_handling": {
    "start_timezone": "UTC",
    "end_timezone": "America/New_York",
    "calculation_timezone": "UTC"
  },
  "weekend_days": [0, 6],
  "rounding_method": "round"
}
```

## Input/Output Specifications

### Input Data Structure

```json
{
  "date_pair": {
    "start": "2024-01-15T10:00:00Z",
    "end": "2024-02-15T16:30:00Z"
  },
  "calculation_config": {
    "units": ["days", "hours", "business_days"],
    "business_days_only": false,
    "holidays": ["2024-01-15"]
  }
}
```

### Output Data Structure

```json
{
  "start_date": "2024-01-15T10:00:00Z",
  "end_date": "2024-02-15T16:30:00Z",
  "time_difference": {
    "days": 31.27,
    "hours": 750.5,
    "minutes": 45030,
    "business_days": 22,
    "total_milliseconds": 2701800000
  },
  "calculation_details": {
    "direction": "forward",
    "weekends_excluded": 8,
    "holidays_excluded": 1,
    "timezone_adjustments": 0,
    "precision_used": 2
  },
  "metadata": {
    "calculation_time": 18,
    "units_calculated": 4,
    "business_day_calculation": true
  }
}
```

## Practical Examples

### Example 1: Basic Duration Calculation

**Scenario**: Calculate project duration in days and hours

**Configuration**:
```json
{
  "start_date": "2024-01-15T09:00:00Z",
  "end_date": "2024-01-20T17:00:00Z",
  "units": ["days", "hours"],
  "precision": 1
}
```

**Input Data**:
```json
{
  "project_start": "2024-01-15T09:00:00Z",
  "project_end": "2024-01-20T17:00:00Z"
}
```

**Expected Output**:
```json
{
  "start_date": "2024-01-15T09:00:00Z",
  "end_date": "2024-01-20T17:00:00Z",
  "time_difference": {
    "days": 5.3,
    "hours": 128.0
  },
  "calculation_details": {
    "direction": "forward",
    "precision_used": 1
  }
}
```

### Example 2: Business Day Calculation with Holidays

**Scenario**: Calculate working days between project milestones excluding holidays

**Configuration**:
```json
{
  "start_date": "2024-01-15T09:00:00",
  "end_date": "2024-01-31T17:00:00",
  "units": ["business_days", "days"],
  "business_days_only": true,
  "holidays": ["2024-01-15", "2024-01-29"]
}
```

**Workflow Integration**:
```
Project Data → Get Time Between Dates → SLA Checker
     ↓                ↓                    ↓
  milestones     working_days         compliance_status
```

**Complete Example**:
```json
{
  "input": {
    "project_milestones": [
      {"name": "Phase 1", "start": "2024-01-15T09:00:00", "end": "2024-01-22T17:00:00"},
      {"name": "Phase 2", "start": "2024-01-22T09:00:00", "end": "2024-01-31T17:00:00"}
    ],
    "company_holidays": ["2024-01-15", "2024-01-29"]
  },
  "processing": {
    "calculate_business_days": true,
    "exclude_holidays": true
  },
  "output": {
    "phase_durations": [
      {
        "name": "Phase 1",
        "business_days": 5,
        "calendar_days": 7,
        "holidays_excluded": 1
      },
      {
        "name": "Phase 2",
        "business_days": 6,
        "calendar_days": 9,
        "holidays_excluded": 1
      }
    ]
  }
}
```

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the GetTimeBetweenDates node in a typical workflow scenario.

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

1. **Previous Node** → **GetTimeBetweenDates** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: SLA Monitoring

- **Nodes**: Data Source → Get Time Between Dates → Filter → Alert System
- **Use Case**: Monitor service level agreement compliance
- **Configuration Tips**: Use business_days_only for SLAs that exclude weekends

#### Pattern 2: Analytics Dashboard

- **Nodes**: Database Query → Get Time Between Dates → Statistics → Chart Generation
- **Use Case**: Generate duration analytics and performance metrics
- **Data Flow**: Raw data → duration calculations → statistical analysis → visualizations

### Best Practices

- **Performance**: Use batch processing for multiple date pairs when possible
- **Error Handling**: Validate date formats and handle null dates gracefully
- **Data Validation**: Ensure end dates are after start dates for meaningful results
- **Resource Management**: Cache holiday lists to avoid repeated processing

## Troubleshooting

### Common Issues

#### Issue: Negative Duration Results

- **Symptoms**: Unexpected negative values in duration calculations
- **Causes**: End date is before start date or absolute_value is set to false
- **Solutions**: 
  1. Verify date order (start should be before end)
  2. Set absolute_value to true for always-positive results
  3. Check for timezone-related date shifts
- **Prevention**: Validate date order before calculation

#### Issue: Business Day Calculation Errors

- **Symptoms**: Incorrect business day counts or unexpected exclusions
- **Causes**: Incorrect weekend_days configuration or overlapping holidays
- **Solutions**: 
  1. Verify weekend_days array (0=Sunday, 6=Saturday)
  2. Check holiday date formats (YYYY-MM-DD)
  3. Ensure holidays don't overlap with configured weekend days
- **Prevention**: Use standardized holiday formats and test with known date ranges

### Performance Issues

- **Slow Calculations**: Reduce the number of units calculated or use simpler calculations
- **Memory Usage**: Process large date arrays in batches
- **Holiday Processing**: Optimize holiday lists by removing past dates

## Limitations & Constraints

### Technical Limitations

- **Date Range**: Supports dates from 1900-01-01 to 2100-12-31
- **Precision**: Maximum precision of 6 decimal places

### Calculation Limitations

- **Month Calculations**: Month differences may vary due to different month lengths
- **Timezone Complexity**: Complex timezone transitions may affect accuracy
- **Leap Year Handling**: Leap year calculations follow standard calendar rules

### Data Limitations

- **Input Size**: Maximum 1000 date pairs per batch operation
- **Holiday List**: Maximum 500 holidays per calculation
- **Processing Time**: Complex calculations timeout after 60 seconds

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

### Skill Level: Intermediate

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

- **GetCurrentDate**: Works well together in workflows
- **EditFields**: Works well together in workflows
- **Filter**: Works well together in workflows

### Common Workflow Patterns

- **EditFields → GetTimeBetweenDates → Filter**: Common integration pattern
- **GetCurrentDate → GetTimeBetweenDates → EditFields**: Common integration pattern

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

- [Duration Calculation Patterns Tutorial](/learning/workflow-patterns/data-processing-patterns)
- [Business Day Handling Guide](/usage/key-concepts/data/date-time-handling)
- [SLA Monitoring Examples](/learning/examples/performance-monitoring-workflows)