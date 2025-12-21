---
title: Content Replacer
description: "Find and replace text or content on web pages to customize information, fix errors, or update outdated content."
---

# Content Replacer

**What it does:** Finds and replaces text or content on web pages, allowing you to customize information, fix errors, or update outdated content automatically.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Target Content | String | The text or content to find and replace | Yes | `""` |
| Replacement Content | String | The new content to insert | Yes | `""` |
| Case Sensitive | Boolean | Whether to match exact capitalization | No | `false` |
| Replace All | Boolean | Replace all matches or just the first one | No | `true` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| success | Boolean | Whether the replacement was successful |
| replacementCount | Number | How many replacements were made |
| originalContent | String | The content before replacement |
| newContent | String | The content after replacement |

## Real-World Examples

**Content Localization**
Replace English text with translations in other languages for international users.

**Price Updates**
Update outdated pricing information on product pages or marketing materials.

**Brand Consistency**
Replace old company names or product names with updated branding across websites.

## How to Use It

1. **Identify the content** you want to replace on the webpage
2. **Set the target content** - the exact text you want to find
3. **Set the replacement content** - what you want to replace it with
4. **Run the workflow** - the node finds and replaces the content automatically

**Simple Example:**
```json
{
  "targetContent": "Old Company Name",
  "replacementContent": "New Company Name",
  "caseSensitive": false,
  "replaceAll": true
}
```

<details>
<summary>🔍 Technical Details</summary>

**Pattern Matching:** You can use simple text matching or advanced patterns (regular expressions) to find content.

**Selective Replacement:** Target specific areas of the page by using CSS selectors to limit where replacements happen.

**Backup and Undo:** The node can create backups of original content so you can undo changes if needed.

**Limitations:**
- Cannot replace content in password fields or secure elements
- Some websites may prevent content modification
- Changes are temporary and reset when you refresh the page

</details>

## Try It Yourself

**Update Contact Information:**
```json
{
  "targetContent": "contact@oldcompany.com",
  "replacementContent": "contact@newcompany.com",
  "replaceAll": true
}
```

**Fix Typos:**
```json
{
  "targetContent": "recieve",
  "replacementContent": "receive",
  "caseSensitive": false,
  "replaceAll": true
}
```

**Update Pricing:**
```json
{
  "targetContent": "$99.99",
  "replacementContent": "$79.99",
  "replaceAll": true
}
```

**Common Issues:**
- **No replacements made?** Check that the target content exactly matches what's on the page
- **Formatting lost?** The replacement might be changing HTML structure - try simpler text replacements
- **Changes disappear?** Content replacement is temporary - changes reset when you refresh the page

## What's Next?

- **[Get Selected Text](./GetSelectedText.md)** - Select specific content to replace
- **[Insert Text](./InsertText.md)** - Add new content to pages instead of replacing
- **[Get All Text](./GetAllText.md)** - Extract content to analyze before replacing