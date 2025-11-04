---
title: Insert Text
description: "Add text content to webpages at specific locations for dynamic content updates, annotations, or interactive modifications."
---

# Insert Text

**What it does:** Adds text content to webpages at specific locations, allowing you to create dynamic content updates, add annotations, or make interactive modifications.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Text Content | String | The text you want to insert | Yes | `""` |
| Target Element | String | CSS selector for where to insert (optional) | No | `body` |
| Insert Position | String | Where to place text: `before`, `after`, `inside` | No | `inside` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| success | Boolean | Whether the text was inserted successfully |
| insertedText | String | The text that was inserted |
| targetElement | String | Where the text was inserted |
| position | String | The insertion position used |

## Real-World Examples

**Content Enhancement**
Add helpful annotations or explanations to existing webpage content for better understanding.

**Dynamic Updates**
Insert real-time information like current prices, status updates, or personalized messages.

**Form Assistance**
Add helpful hints or validation messages next to form fields to guide users.

## How to Use It

1. **Prepare your text** - the content you want to add to the page
2. **Choose the location** - specify where on the page to insert the text
3. **Set the position** - before, after, or inside the target element
4. **Run the workflow** - the text gets added to the page

**Simple Example:**
```json
{
  "textContent": "✅ This information has been verified",
  "targetElement": ".article-content",
  "insertPosition": "after"
}
```

<details>
<summary>🔍 Technical Details</summary>

**Element Targeting:** Use CSS selectors to specify exactly where to insert text (like `.class-name` or `#element-id`).

**Position Options:**
- **Before:** Adds text before the target element
- **After:** Adds text after the target element
- **Inside:** Adds text inside the target element

**Text Formatting:** The inserted text appears as plain text. For formatted content, use HTML insertion methods.

**Limitations:**
- Changes are temporary and disappear when you refresh the page
- Some websites may prevent content modification
- Cannot insert into protected or secure elements

</details>

## Try It Yourself

**Add Verification Badge:**
```json
{
  "textContent": "✅ Verified Information",
  "targetElement": "h1",
  "insertPosition": "after"
}
```

**Insert Helper Text:**
```json
{
  "textContent": "💡 Tip: This field is required",
  "targetElement": "#email-input",
  "insertPosition": "after"
}
```

**Add Status Update:**
```json
{
  "textContent": "🔄 Last updated: Today",
  "targetElement": ".content-header",
  "insertPosition": "inside"
}
```

**Common Issues:**
- **Text not appearing?** Check that the target element exists on the page
- **Text in wrong location?** Verify the CSS selector and try different position options
- **Formatting lost?** This node inserts plain text - use HTML insertion for formatted content

## What's Next?

- **[Content Replacer](./ContentReplacer.md)** - Replace existing text instead of adding new text
- **[Get Selected Text](./GetSelectedText.md)** - Extract text to process before inserting
- **[Form Filler](./FormFiller.md)** - Fill form fields with text content