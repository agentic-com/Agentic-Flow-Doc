---
title: Get All Images
description: "Extract all images from webpages to analyze visual content, download media, or audit image usage."
---

# Get All Images

**What it does:** Finds and extracts all images from a webpage, giving you URLs, descriptions, and details about every image for analysis or downloading.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Include Hidden Images | Boolean | Extract images that aren't visible | No | `false` |
| Include Background Images | Boolean | Extract CSS background images | No | `true` |
| Max Images | Number | Maximum number of images to extract | No | `500` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| images | Array | List of all found images with URLs and details |
| totalImages | Number | Total number of images found |
| imageTypes | Object | Count of different image formats (JPG, PNG, etc.) |
| totalSize | Number | Estimated total size of all images |

## Real-World Examples

**Content Audit**
Extract all images from your website to check for missing alt text, oversized files, or broken image links.

**Competitor Analysis**
Study what types of images competitors use and how they organize their visual content.

**Media Collection**
Gather images from research sources or inspiration sites for design projects (respecting copyright).

## How to Use It

1. **Navigate to the webpage** with images you want to extract
2. **Configure extraction options** - choose what types of images to include
3. **Run the workflow** - the node finds all images on the page
4. **Process the results** with other nodes for analysis or downloading

**Simple Example:**
```json
{
  "includeHiddenImages": false,
  "includeBackgroundImages": true,
  "maxImages": 100
}
```

<details>
<summary>🔍 Technical Details</summary>

**What it finds:**
- Regular images (`<img>` tags)
- CSS background images
- SVG graphics and icons
- Images in picture elements and responsive sets
- Base64 encoded images (optional)

**Image Information:**
- Full URLs for downloading
- Alt text and descriptions
- Dimensions (width and height)
- File format and estimated size
- Visibility status

**Performance:**
- Processes up to 500 images efficiently
- Larger collections may take longer
- Background images require additional processing time

**Limitations:**
- Cannot access images that require login
- Some dynamically loaded images may be missed
- File sizes are estimates based on dimensions

</details>

## Try It Yourself

**Complete Image Audit:**
```json
{
  "includeHiddenImages": true,
  "includeBackgroundImages": true,
  "maxImages": 0
}
```

**Visible Images Only:**
```json
{
  "includeHiddenImages": false,
  "includeBackgroundImages": false,
  "maxImages": 50
}
```

**Design Research:**
```json
{
  "includeHiddenImages": false,
  "includeBackgroundImages": true,
  "maxImages": 200
}
```

**Common Issues:**
- **No images found?** The page might still be loading - try waiting before extraction
- **Missing some images?** Enable "Include Hidden Images" and "Include Background Images"
- **Too many results?** Set a lower "Max Images" limit or filter by image type

## What's Next?

- **[Image Processor](./ImageProcessor.md)** - Process and analyze the extracted images
- **[Get All Text](./GetAllText.md)** - Extract text content to go with the images
- **[Navigate to Link](./NavigateToLink.md)** - Visit multiple pages to collect images