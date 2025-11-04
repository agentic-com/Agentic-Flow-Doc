---
title: Filter
description: "Keep only the data you want by filtering out items that don't meet your criteria."
---

# Filter

**What it does:** Keeps only the data you want by filtering out items that don't meet your criteria.

**Perfect for:** Removing duplicates • Quality control • Selecting specific items • Data cleanup

## How It Works

```mermaid
graph LR
    A[📊 All Data] --> B[🔍 Filter]
    B --> C[✅ Matching Items Only]

    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style C fill:#f3e5f5
```

**Simple process:** All data → Filter checks each item → Only items that match your criteria

## Common Filter Types

**Keep items with specific values**
```json
{"field": "status", "equals": "active"}
```

**Remove short content**
```json
{"field": "content.length", "greaterThan": 100}
```

**Keep recent items**
```json
{"field": "date", "after": "2024-01-01"}
```

**Remove duplicates**
```json
{"field": "id", "unique": true}
```

## Real Example

**Before filtering (all scraped articles):**
```json
[
  {"title": "Great Article", "content": "Long detailed content...", "author": "John"},
  {"title": "", "content": "Short", "author": ""},
  {"title": "Another Good One", "content": "More detailed content...", "author": "Jane"}
]
```

**After filtering (only quality articles):**
```json
[
  {"title": "Great Article", "content": "Long detailed content...", "author": "John"},
  {"title": "Another Good One", "content": "More detailed content...", "author": "Jane"}
]
```

**Filter used:** Keep only articles with titles, content longer than 50 characters, and authors.

## Common Use Cases

**Remove low-quality content** - Filter out articles that are too short or missing key information
**Deduplicate data** - Remove duplicate entries from scraped data
**Select by criteria** - Keep only items that match specific conditions
**Performance optimization** - Reduce data size before expensive processing

## Quick Troubleshooting

**No items pass filter:** Check that your criteria aren't too strict or field names are correct
**Filter too slow:** Simplify your conditions or process smaller batches
**Wrong results:** Verify field names match your data structure exactly

## What's Next?

**Related nodes:** [If](/integrations/builtin/flow/If/) • [Merge](/integrations/builtin/flow/Merge/) • [Edit Fields](/integrations/builtin/dataTransformation/EditFields/)

**Common workflows:** [Data Processing Patterns](/learning/workflow-patterns/data-processing-patterns/) • [Web Extraction Workflows](/learning/workflow-patterns/web-extraction-patterns/) • [Quality Control Workflows](/learning/workflow-patterns/optimization-best-practices/)

**Learn more:** [Flow Control Basics](/learning/text-courses/beginner/data-flow-basics/) • [Multi-Step Workflows](/learning/text-courses/intermediate/multi-step-workflows/)
