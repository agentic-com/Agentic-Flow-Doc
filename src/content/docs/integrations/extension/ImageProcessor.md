---
title: Image Processor
description: "Resize, optimize, and transform images directly in your browser for web optimization and content workflows."
---

# Image Processor

**What it does:** Processes images by resizing, optimizing, converting formats, and applying filters - all directly in your browser without uploading to external services.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Image Data | Array/String | Images to process (from Get All Images or URLs) | Yes | `[]` |
| Operation | String | What to do: `resize`, `optimize`, `convert`, `filter` | No | `optimize` |
| Output Format | String | Format for processed images: `jpg`, `png`, `webp` | No | `jpg` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| processedImages | Array | List of processed images with new URLs |
| originalSize | Number | Total size of original images |
| newSize | Number | Total size after processing |
| compressionRatio | Number | How much space was saved |

## Real-World Examples

**Website Optimization**
Automatically resize and compress images on your website to improve loading speed and user experience.

**Social Media Prep**
Convert and resize images to the perfect dimensions for different social media platforms.

**Content Creation**
Apply filters and effects to images for blog posts, presentations, or marketing materials.

## How to Use It

1. **Get images first** - Use Get All Images or provide image URLs
2. **Choose processing type** - resize, optimize, convert, or apply filters
3. **Set output preferences** - format, quality, and dimensions
4. **Run the workflow** - images are processed in your browser

**Simple Example:**
```json
{
  "imageData": [], // From Get All Images
  "operation": "optimize",
  "outputFormat": "webp"
}
```

<details>
<summary>🔍 Technical Details</summary>

**Processing Options:**
- **Resize**: Change image dimensions while maintaining aspect ratio
- **Optimize**: Reduce file size without losing visual quality
- **Convert**: Change image format (JPG, PNG, WebP)
- **Filter**: Apply effects like blur, brightness, contrast

**Supported Formats:**
- Input: JPG, PNG, WebP, GIF, BMP, SVG
- Output: JPG, PNG, WebP (best compression)

**Performance:**
- Processing happens locally in your browser
- No images are uploaded to external servers
- Can handle multiple images simultaneously
- Large images may take longer to process

**Limitations:**
- Very large images may hit browser memory limits
- Some advanced effects require modern browsers
- Processing speed depends on your device performance

</details>

## Try It Yourself

**Web Optimization:**
```json
{
  "operation": "optimize",
  "outputFormat": "webp",
  "quality": 80
}
```

**Social Media Resize:**
```json
{
  "operation": "resize",
  "width": 1200,
  "height": 630,
  "outputFormat": "jpg"
}
```

**Format Conversion:**
```json
{
  "operation": "convert",
  "outputFormat": "png",
  "quality": 90
}
```

**Common Issues:**
- **Processing failed?** Check that the image URLs are accessible and valid
- **Poor quality results?** Increase the quality setting or try a different format
- **Slow processing?** Reduce image size or process fewer images at once

## What's Next?

- **[Get All Images](./GetAllImages.md)** - Extract images to process
- **[Insert Content](./InsertContent.md)** - Add processed images back to webpages
- **[Navigate to Link](./NavigateToLink.md)** - Process images across multiple pages