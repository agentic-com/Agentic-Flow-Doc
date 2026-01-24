---
title: "Pick Field"
description: "Select only the data fields you need from complex objects to simplify and speed up your workflows."
---

# Pick Field

**What it does:** Selects only the data fields you need from complex objects, making your data simpler and workflows faster.

**Perfect for:** API response filtering • Data privacy • Performance optimization • Focused processing

## What It Does

- **Select specific fields** - Choose exactly which data you want to keep
- **Remove sensitive data** - Exclude private information before sharing
- **Reduce data size** - Make workflows faster by processing less data
- **Handle nested objects** - Access deep data structures easily

## How It Works

```mermaid
graph LR
    A[🗂️ Complex Data] --> B[🎯 Pick Field]
    B --> C[📋 Selected Fields Only]

    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style C fill:#f3e5f5
```

**Simple process:** Complex data → Pick Field selects what you want → Clean, focused data

## Common Field Selections

**Basic fields**
```json
["name", "email", "phone"]
```

**Nested fields**
```json
["user.name", "user.profile.email", "settings.theme"]
```

**Array elements**
```json
["posts[0].title", "reviews[*].rating"]
```

**Exclude sensitive data**
```json
{"mode": "exclude", "fields": ["password", "ssn", "internal_id"]}
```

## Real Example

**Before (large API response):**
```json
{
  "user": {
    "id": "user123",
    "name": "Alice Johnson",
    "email": "alice@company.com",
    "phone": "+1987654321",
    "address": "123 Main St",
    "ssn": "123-45-6789",
    "internal_notes": "VIP customer"
  },
  "preferences": {"theme": "dark", "notifications": true},
  "admin_data": {"created_by": "admin", "last_login": "2024-01-15"}
}
```

**After (only needed fields):**
```json
{
  "user": {
    "name": "Alice Johnson",
    "email": "alice@company.com",
    "phone": "+1987654321"
  },
  "preferences": {"theme": "dark"}
}
```

**Fields selected:** `["user.name", "user.email", "user.phone", "preferences.theme"]`

## Common Use Cases

**API response filtering** - Extract only relevant data from large API responses
**Data privacy** - Remove sensitive fields before sharing data externally
**Performance optimization** - Reduce data size to speed up processing
**Focused processing** - Create clean datasets for specific workflow needs

## Quick Troubleshooting

**Missing field errors:** Check field names are spelled correctly and exist in your data
**Nested fields not working:** Use dot notation like "user.profile.name" for nested data
**Array access issues:** Use [0] for first item, [*] for all items in arrays

## What's Next?

**Related nodes:** [Edit Fields](/nodes/builtin/dataTransformation/EditFields/) • [Filter](/nodes/builtin/flow/Filter/) • [HTTP Request](/nodes/builtin/core/Http-Request/)

**Common workflows:** [Data Processing Patterns](/learning/workflow-patterns/data-processing-patterns/) • [API Integration](/learning/workflow-patterns/integration-patterns/) • [Privacy-Safe Workflows](/learning/workflow-patterns/optimization-best-practices/)

**Learn more:** [Data Transformation Guide](/learning/text-courses/intermediate/data-transformation/) • [Multi-Step Workflows](/learning/text-courses/intermediate/multi-step-workflows/)