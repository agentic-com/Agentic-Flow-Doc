---
title: "Download As File"
description: "Save your workflow data as downloadable files in various formats like CSV, JSON, or text files."
---

# Download As File

**What it does:** Saves your workflow data as downloadable files in various formats like CSV, JSON, or text files.

**Perfect for:** Report generation • Data export • Content delivery • Backup creation

## What It Does

- **Save data as files** - Convert workflow results into downloadable files
- **Multiple formats** - Support for CSV, JSON, TXT, and more
- **Automatic downloads** - Files download directly to your computer
- **Custom naming** - Name files with dates, timestamps, or custom text

## How It Works

```mermaid
graph LR
    A[📊 Workflow Data] --> B[💾 Download As File]
    B --> C[📁 Downloaded File]

    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style C fill:#f3e5f5
```

**Simple process:** Workflow data → Download As File → File saved to your computer

## Common File Formats

**CSV (Spreadsheet data)**
```json
{"format": "csv", "filename": "report.csv"}
```

**JSON (Structured data)**
```json
{"format": "json", "filename": "data_backup.json"}
```

**TXT (Plain text)**
```json
{"format": "txt", "filename": "content.txt"}
```

**Custom filename with date**
```json
{"filename": "report_{{date}}.csv"}
```

## Real Example

**Input data (from your workflow):**
```json
[
  {"name": "Alice Johnson", "email": "alice@company.com", "score": 95},
  {"name": "Bob Smith", "email": "bob@company.com", "score": 87},
  {"name": "Carol Davis", "email": "carol@company.com", "score": 92}
]
```

**Configuration:**
```json
{
  "format": "csv",
  "filename": "user_scores_{{date}}"
}
```

**Downloaded file (user_scores_2024-01-17.csv):**
```
name,email,score
Alice Johnson,alice@company.com,95
Bob Smith,bob@company.com,87
Carol Davis,carol@company.com,92
```

## Common Use Cases

**Generate reports** - Create CSV or Excel files from workflow data
**Export data** - Save processed data for external analysis
**Create backups** - Download JSON files of important data
**Content delivery** - Provide users with generated files

## Quick Troubleshooting

**Download not starting:** Check if browser is blocking downloads or requires user interaction
**File too large:** Enable compression or split data into smaller files
**Wrong format:** Verify your data structure matches the chosen file format

## What's Next?

**Related nodes:** [Edit Fields](/integrations/builtin/dataTransformation/EditFields/) • [Pick Field](/integrations/builtin/dataTransformation/PickField/) • [Filter](/integrations/builtin/flow/Filter/)

**Common workflows:** [Report Generation](/learning/workflow-patterns/real-world-examples/content-management/) • [Data Export Patterns](/learning/workflow-patterns/data-processing-patterns/) • [Backup Workflows](/learning/workflow-patterns/optimization-best-practices/)

**Learn more:** [Data Processing Guide](/learning/text-courses/intermediate/data-transformation/) • [Multi-Step Workflows](/learning/text-courses/intermediate/multi-step-workflows/)