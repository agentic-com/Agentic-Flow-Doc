---
title: Content Manipulation Patterns
description: Simple patterns for automatically filling forms, inserting content, and modifying web pages to save time and reduce errors
---

# Content Manipulation Patterns

Automate repetitive tasks like filling forms, updating content, and modifying web pages. These workflow patterns help you work faster and avoid manual errors when dealing with web content.

**Related patterns:** [Data Processing Patterns](/learning/workflow-patterns/data-processing-patterns/) • [Web Extraction Patterns](/learning/workflow-patterns/web-extraction-patterns/) • [Integration Patterns](/learning/workflow-patterns/integration-patterns/)

## Why This Matters

Manual form filling and content updates are time-consuming and error-prone. Content manipulation patterns automate these tasks, letting you focus on more important work while ensuring consistency and accuracy.

## Pattern 1: Automatic Form Filling

**What it does:** Automatically fills out web forms with your information, saving time and reducing typing errors.

**Perfect for:** Job applications, contact forms, surveys, registration forms, and checkout processes.

**Key nodes:** [Form Filler](/nodes/extension/FormFiller/) • [Insert Text](/nodes/extension/InsertText/) • [Navigate to Link](/nodes/extension/NavigateToLink/)

### Simple Workflow Example

```mermaid
graph LR
    A[🌐 Navigate to Form] --> B[📝 Fill Fields]
    B --> C[✅ Submit Form]
    C --> D[📋 Confirm Success]

    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#e8f5e8
    style D fill:#f3e5f5
```

### Copy-Paste Ready Configuration

```json
{
  "name": "Auto Form Filler",
  "nodes": [
    {
      "id": "fill_form",
      "type": "FormFiller",
      "name": "Fill Contact Form",
      "settings": {
        "firstName": "Alex",
        "lastName": "Johnson",
        "email": "alex.johnson@email.com",
        "phone": "555-0123",
        "company": "Your Company Name",
        "message": "I'm interested in learning more about your services."
      }
    }
  ]
}
```

**Business Impact:** What used to take 5 minutes of careful typing now takes 10 seconds. Perfect for filling out multiple similar forms quickly and accurately.

## Pattern 2: Smart Content Insertion

**What it does:** Adds custom content, messages, or widgets to web pages automatically.

**Perfect for:** Adding notes to websites, inserting custom information, enhancing pages with additional data.

### Simple Workflow Example

```mermaid
graph LR
    A[🔍 Find Target Location] --> B[📝 Prepare Content]
    B --> C[➕ Insert Content]
    C --> D[✅ Verify Success]

    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#e8f5e8
    style D fill:#f3e5f5
```

### Copy-Paste Ready Configuration

```json
{
  "name": "Content Inserter",
  "nodes": [
    {
      "id": "insert_content",
      "type": "InsertContent",
      "name": "Add Custom Message",
      "settings": {
        "target": ".main-content",
        "position": "top",
        "content": "<div style='background: #f0f8ff; padding: 10px; border-radius: 5px; margin-bottom: 15px;'>📌 <strong>Note:</strong> This information was last updated on {{current_date}}</div>"
      }
    }
  ]
}
```

**Business Impact:** Automatically add important notices, updates, or custom information to web pages without manual editing.

## Pattern 3: Content Replacement and Updates

**What it does:** Automatically replaces or updates existing content on web pages with new information.

**Perfect for:** Updating outdated information, replacing placeholder text, customizing content for different audiences.

### Simple Workflow Example

```mermaid
graph LR
    A[🎯 Find Content] --> B[🔄 Replace Text]
    B --> C[✅ Verify Changes]

    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#e8f5e8
```

### Copy-Paste Ready Configuration

```json
{
  "name": "Content Replacer",
  "nodes": [
    {
      "id": "replace_content",
      "type": "ContentReplacer",
      "name": "Update Product Prices",
      "settings": {
        "replacements": [
          {
            "target": ".old-price",
            "newContent": "$99.99",
            "backup": true
          },
          {
            "target": ".contact-email",
            "newContent": "support@yourcompany.com"
          }
        ]
      }
    }
  ]
}
```

**Business Impact:** Keep website content current without manual editing. Perfect for price updates, contact information changes, or seasonal content modifications.

## Quick Troubleshooting

**Form fields not filling:** Check field names match the actual form. Use browser developer tools to find correct identifiers.

**Content insertion failing:** Ensure target element exists. Use specific CSS selectors and wait for page to load.

**Changes being overwritten:** Some sites update content dynamically. Insert after page loads or use monitoring to re-apply changes.

## Related Resources

**Learn the basics:** [First Workflow Tutorial](/learning/text-courses/beginner/first-workflow/) • [Browser Permissions](/learning/text-courses/beginner/browser-permissions/)

**Node documentation:** [Form Filler](/nodes/extension/FormFiller/) • [Insert Content](/nodes/extension/InsertContent/) • [Content Replacer](/nodes/extension/ContentReplacer/)

**More patterns:** [Data Processing](/learning/workflow-patterns/data-processing-patterns/) • [Web Extraction](/learning/workflow-patterns/web-extraction-patterns/) • [Real-World Examples](/learning/workflow-patterns/real-world-examples/)

**Need help?** [Troubleshooting Guide](/advanced-ai/troubleshooting-guide/) • [Community Support](/usage/help-and-community/help/)