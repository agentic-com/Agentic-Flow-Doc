---
title: Insert Content
description: "Add rich content like HTML, images, and media to webpages for dynamic updates, annotations, or content enhancement."
---

# Insert Content

**What it does:** Adds rich content (HTML, images, videos, etc.) to webpages at specific locations, allowing you to enhance pages with dynamic updates and interactive elements.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Content | String/Object | The content to insert (HTML, text, image URL) | Yes | `""` |
| Content Type | String | Type: `html`, `text`, `image`, `video` | No | `html` |
| Target Element | String | CSS selector for where to insert | No | `body` |
| Insert Position | String | Where to place: `before`, `after`, `inside` | No | `inside` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| success | Boolean | Whether the content was inserted successfully |
| insertedContent | String | The content that was added |
| targetElement | String | Where the content was inserted |
| contentType | String | Type of content that was inserted |

## Real-World Examples

**Content Enhancement**
Add interactive elements, videos, or rich media to existing webpages to make them more engaging.

**Dynamic Annotations**
Insert helpful explanations, tooltips, or additional information alongside existing content.

**Live Updates**
Add real-time information like stock prices, weather updates, or news feeds to any webpage.

## How to Use It

1. **Prepare your content** - HTML code, image URLs, or rich media
2. **Choose the location** - specify where on the page to insert
3. **Set the content type** - tell the node what kind of content you're adding
4. **Run the workflow** - the content gets added to the page

**Simple Example:**
```json
{
  "content": "<div class='alert'>🔔 New update available!</div>",
  "contentType": "html",
  "targetElement": ".main-content",
  "insertPosition": "before"
}
```

<details>
<summary>🔍 Technical Details</summary>

**Content Types:**
- **HTML**: Rich formatted content with styling and interactivity
- **Text**: Plain text content (automatically escaped for security)
- **Image**: Image URLs that get converted to `<img>` tags
- **Video**: Video URLs that get converted to `<video>` tags

**Position Options:**
- **Before**: Adds content before the target element
- **After**: Adds content after the target element
- **Inside**: Adds content inside the target element (at the end)

**Security:** All content is automatically sanitized to prevent malicious code injection.

**Limitations:**
- Changes are temporary and disappear when you refresh the page
- Some websites may prevent content modification
- Cannot insert into protected or secure elements

</details>

## Try It Yourself

**Add Alert Banner:**
```json
{
  "content": "<div style='background: #ffeb3b; padding: 10px; text-align: center;'>⚠️ Important Notice</div>",
  "contentType": "html",
  "targetElement": "body",
  "insertPosition": "after"
}
```

**Insert Image:**
```json
{
  "content": "https://example.com/image.jpg",
  "contentType": "image",
  "targetElement": ".article-content",
  "insertPosition": "inside"
}
```

**Add Video:**
```json
{
  "content": "https://example.com/video.mp4",
  "contentType": "video",
  "targetElement": "#media-section",
  "insertPosition": "inside"
}
```

**Common Issues:**
- **Content not appearing?** Check that the target element exists on the page
- **Content in wrong location?** Verify the CSS selector and try different position options
- **Security errors?** Some content may be blocked for security - try simpler HTML

## What's Next?

- **[Insert Text](./InsertText.md)** - Add simple text content instead of rich media
- **[Content Replacer](./ContentReplacer.md)** - Replace existing content instead of adding new
- **[Get All HTML](./GetAllHTML.md)** - Extract existing page structure before inserting