---
title: Media Extractor
description: "Extract videos, audio files, and documents from webpages for analysis, downloading, or content auditing."
---

# Media Extractor

**What it does:** Finds and extracts all media content (videos, audio, documents) from webpages, giving you URLs and details for downloading or analysis.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Include Videos | Boolean | Extract video files and embedded players | No | `true` |
| Include Audio | Boolean | Extract audio files and players | No | `true` |
| Include Documents | Boolean | Extract PDFs and document links | No | `true` |
| Max Items | Number | Maximum number of media items to extract | No | `100` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| mediaItems | Array | List of all found media with URLs and details |
| videoCount | Number | Number of videos found |
| audioCount | Number | Number of audio files found |
| documentCount | Number | Number of documents found |

## Real-World Examples

**Content Audit**
Extract all media from your website to check for broken links, missing files, or accessibility issues.

**Research Collection**
Gather videos, podcasts, and documents from educational or research websites for offline study.

**Media Inventory**
Catalog all media assets on a website for content management or migration projects.

## How to Use It

1. **Navigate to the webpage** with media you want to extract
2. **Configure extraction options** - choose what types of media to include
3. **Run the workflow** - the node finds all media on the page
4. **Process the results** for downloading, analysis, or cataloging

**Simple Example:**
```json
{
  "includeVideos": true,
  "includeAudio": true,
  "includeDocuments": true,
  "maxItems": 50
}
```

<details>
<summary>🔍 Technical Details</summary>

**What it finds:**
- Embedded videos (YouTube, Vimeo, etc.)
- Direct video files (MP4, WebM, etc.)
- Audio files and players (MP3, WAV, etc.)
- Documents (PDF, DOC, PPT, etc.)
- Streaming media and live content

**Media Information:**
- Direct download URLs
- File formats and sizes
- Duration (for videos and audio)
- Titles and descriptions
- Thumbnail images

**Performance:**
- Processes up to 100 media items efficiently
- Larger collections may take longer
- Streaming media requires additional analysis time

**Limitations:**
- Cannot access media that requires login
- Some streaming services may block extraction
- File sizes are estimates when not directly available

</details>

## Try It Yourself

**Complete Media Audit:**
```json
{
  "includeVideos": true,
  "includeAudio": true,
  "includeDocuments": true,
  "maxItems": 0
}
```

**Video Content Only:**
```json
{
  "includeVideos": true,
  "includeAudio": false,
  "includeDocuments": false,
  "maxItems": 25
}
```

**Document Collection:**
```json
{
  "includeVideos": false,
  "includeAudio": false,
  "includeDocuments": true,
  "maxItems": 50
}
```

**Common Issues:**
- **No media found?** The page might still be loading - try waiting before extraction
- **Missing embedded content?** Some media requires user interaction to load
- **Access denied errors?** Some media may be protected or require authentication

## What's Next?

- **[Get All Images](./GetAllImages.md)** - Extract images along with other media
- **[Navigate to Link](./NavigateToLink.md)** - Visit multiple pages to collect media
- **[Get All Links](./GetAllLinks.md)** - Find links to media-rich pages