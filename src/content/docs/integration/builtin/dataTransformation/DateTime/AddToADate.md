---
title: "Add To A Date"
description: "Perform date arithmetic by adding time periods to dates with timezone handling, business day calculations, and flexible time unit support."
template: doc
tags: ["Data Processing", "Field Manipulation", "Type Conversion", "Validation", "Formatting"]
---

# Add To A Date

## Overview

The Add To A Date node provides comprehensive date arithmetic capabilities for adding multiple time periods to existing dates. This node handles complex date calculations including timezone conversions, business day arithmetic, and flexible time unit operations, making it essential for scheduling, deadline calculations, and temporal workflow automation.

### Purpose and Functionality

Add To A Date serves as a powerful date arithmetic tool that allows you to:
- Add days, weeks, months, years, hours, minutes, or seconds to dates
- Handle timezone conversions and daylight saving time transitions
- Calculate business days excluding weekends and holidays
- Support multiple date input formats and output formatting
- Perform batch date calculations for multiple dates simultaneously

### Key Features

- **Flexible Time Units**: Support for years, months, weeks, days, hours, minutes, and seconds
- **Timezone Awareness**: Automatic timezone handling and conversion capabilities
- **Business Day Calculations**: Skip weekends and custom holiday lists
- **Multiple Date Formats**: Accept and output dates in multiple standard formats
- **Batch Processing**: Process multiple dates in a single operation

### Primary Use Cases

- **Deadline Calculations**: Calculate project deadlines and milestone dates
- **Scheduling Automation**: Generate future appointment and event dates
- **Subscription Management**: Calculate renewal dates and expiration periods
- **Business Logic**: Implement time-based business rules and workflows

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `input_date` | `string/date` | Base date to add time to | `"2024-01-15T10:00:00Z"` |
| `amount` | `number` | Amount of time units to add | `30` |
| `unit` | `string` | Time unit: "years", "months", "weeks", "days", "hours", "minutes", "seconds" | `"days"` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `timezone` | `string` | `"UTC"` | Target timezone for calculations | `"America/New_York"` |
| `business_days_only` | `boolean` | `false` | Skip weekends in day calculations | `true` |
| `holidays` | `array` | `[]` | List of holiday dates to skip | `["2024-12-25", "2024-01-01"]` |
| `output_format` | `string` | `"ISO"` | Output format: "ISO", "timestamp", "custom" | `"YYYY-MM-DD"` |

### Advanced Configuration

```json
{
  "input_date": "2024-01-15T09:00:00",
  "amount": 5,
  "unit": "days",
  "timezone": "America/New_York",
  "business_days_only": true,
  "holidays": [
    "2024-01-15",
    "2024-02-19",
    "2024-12-25"
  ],
  "output_format": "YYYY-MM-DD HH:mm:ss",
  "weekend_days": [0, 6],
  "custom_rules": {
    "end_of_month_handling": "preserve_day",
    "leap_year_handling": "standard"
  }
}
```

## Input/Output Specifications

### Input Data Structure

```json
{
  "date": "2024-01-15T10:00:00Z",
  "addition_config": {
    "amount": 30,
    "unit": "days",
    "business_days_only": false
  },
  "timezone_info": {
    "input_timezone": "UTC",
    "output_timezone": "America/New_York"
  }
}
```

### Output Data Structure

```json
{
  "original_date": "2024-01-15T10:00:00Z",
  "result_date": "2024-02-14T05:00:00-05:00",
  "calculation_details": {
    "amount_added": 30,
    "unit": "days",
    "business_days_skipped": 0,
    "holidays_skipped": 0,
    "timezone_applied": "America/New_York"
  },
  "metadata": {
    "calculation_time": 15,
    "input_format": "ISO",
    "output_format": "ISO",
    "dst_transition": false
  }
}
```

## Practical Examples

### Example 1: Basic Date Addition

**Scenario**: Calculate a project deadline 30 days from the start date

**Configuration**:
```json
{
  "input_date": "2024-01-15T09:00:00Z",
  "amount": 30,
  "unit": "days",
  "output_format": "YYYY-MM-DD"
}
```

**Input Data**:
```json
{
  "project_start": "2024-01-15T09:00:00Z"
}
```

**Expected Output**:
```json
{
  "original_date": "2024-01-15T09:00:00Z",
  "result_date": "2024-02-14",
  "calculation_details": {
    "amount_added": 30,
    "unit": "days",
    "business_days_skipped": 0,
    "holidays_skipped": 0
  }
}
```

### Example 2: Business Day Calculation with Holidays

**Scenario**: Calculate a business deadline excluding weekends and holidays

**Configuration**:
```json
{
  "input_date": "2024-01-15T09:00:00",
  "amount": 10,
  "unit": "days",
  "business_days_only": true,
  "holidays": ["2024-01-15", "2024-02-19"],
  "timezone": "America/New_York"
}
```

**Workflow Integration**:
```
Project Creation → Add To A Date → Calendar Integration
       ↓               ↓                ↓
   start_date     deadline_date    scheduled_event
```

**Complete Example**:
```json
{
  "input": {
    "project_start": "2024-01-15T09:00:00",
    "business_requirements": {
      "exclude_weekends": true,
      "company_holidays": ["2024-01-15", "2024-02-19"]
    }
  },
  "processing": {
    "days_to_add": 10,
    "business_days_only": true,
    "skipped_dates": ["2024-01-15", "2024-01-20", "2024-01-21"]
  },
  "output": {
    "deadline": "2024-01-31T09:00:00-05:00",
    "working_days_calculated": 10,
    "calendar_days_spanned": 16
  }
}
```

## Examples

### Basic Usage

This example demonstrates the fundamental usage of the AddToADate node in a typical workflow scenario.

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

1. **Previous Node** → **AddToADate** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Scheduling Pipeline

- **Nodes**: Date Input → Add To A Date → Format Date → Calendar API
- **Use Case**: Create scheduled events with calculated dates
- **Configuration Tips**: Use business_days_only for work-related scheduling

#### Pattern 2: Subscription Management

- **Nodes**: User Registration → Add To A Date → Database Update → Email Notification
- **Use Case**: Calculate subscription renewal dates
- **Data Flow**: Registration date → renewal date → stored date → notification

### Best Practices

- **Performance**: Use batch processing for multiple date calculations
- **Error Handling**: Validate input dates before performing calculations
- **Data Validation**: Ensure timezone strings are valid IANA timezone identifiers
- **Resource Management**: Cache holiday lists to avoid repeated API calls

## Troubleshooting

### Common Issues

#### Issue: Timezone Conversion Errors

- **Symptoms**: Incorrect date results or timezone-related errors
- **Causes**: Invalid timezone identifiers or daylight saving time transitions
- **Solutions**: 
  1. Use valid IANA timezone identifiers (e.g., "America/New_York")
  2. Handle DST transitions by checking metadata.dst_transition
  3. Test calculations around DST change dates
- **Prevention**: Validate timezone strings and test with DST edge cases

#### Issue: Business Day Calculation Inconsistencies

- **Symptoms**: Unexpected results when excluding weekends and holidays
- **Causes**: Overlapping weekend and holiday exclusions or incorrect holiday formats
- **Solutions**: 
  1. Ensure holiday dates are in YYYY-MM-DD format
  2. Check weekend_days configuration (0=Sunday, 6=Saturday)
  3. Verify holiday list doesn't include weekends unless intended
- **Prevention**: Use standardized holiday date formats and test with known dates

### Performance Issues

- **Slow Calculations**: Reduce the number of holidays in the list or use caching
- **Memory Usage**: Process large date arrays in batches rather than all at once
- **Timezone Lookups**: Cache timezone data for frequently used timezones

## Limitations & Constraints

### Technical Limitations

- **Date Range**: Supports dates from 1900-01-01 to 2100-12-31
- **Precision**: Calculations accurate to the second level

### Timezone Limitations

- **Historical Data**: Timezone rules may not be accurate for historical dates before 1970
- **Future Changes**: Timezone rule changes may affect future date calculations
- **Browser Support**: Some older browsers may have limited timezone support

### Data Limitations

- **Input Size**: Maximum 1000 dates per batch operation
- **Holiday List**: Maximum 100 holidays per calculation
- **Processing Time**: Complex calculations timeout after 30 seconds

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

- **SubstractFromDate**: Use when you need different approach to similar functionality
- **GetTimeBetweenDates**: Use when you need different approach to similar functionality

### Complementary Nodes

- **GetCurrentDate**: Works well together in workflows
- **FormatDate**: Works well together in workflows
- **EditFields**: Works well together in workflows

### Common Workflow Patterns

- **GetCurrentDate → AddToADate → FormatDate**: Common integration pattern
- **EditFields → AddToADate → DownloadAsFile**: Common integration pattern

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

- [Date Arithmetic Patterns Tutorial](/learning/workflow-patterns/data-processing-patterns)
- [Timezone Handling Guide](/usage/key-concepts/data/date-time-handling)
- [Business Day Calculation Examples](/learning/examples/scheduling-automation)