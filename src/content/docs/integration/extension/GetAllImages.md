---
title: Get All Images
description: "Gather all images from web pages with Agentic Workflow Studio browser extension for media processing and analysis."
---

The **Get All Images** node discovers and extracts all images from the current web page, providing comprehensive image data including URLs, metadata, dimensions, and attributes for analysis, processing, or collection.

## How it Works

This node traverses the DOM to find all image elements (`<img>`, `<picture>`, CSS background images) and extracts their sources, metadata, and properties. It can process both visible and hidden images, including responsive image sets.

## Browser API Details

The node leverages the following browser APIs:
- **DOM Query API**: `document.querySelectorAll()` to find image elements
- **Image API**: `HTMLImageElement` properties for image metadata
- **Computed Styles**: `getComputedStyle()` for CSS background images
- **Intersection Observer**: For visibility detection (optional)
- **Content Scripts**: Injected into the active tab to access page content

### Required Permissions
- `activeTab`: Access to the currently active browser tab
- `scripting`: Ability to inject content scripts

## Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Include Hidden Images | Boolean | No | Extract images from hidden elements (default: false) |
| Include Background Images | Boolean | No | Extract CSS background images (default: true) |
| Include SVG Images | Boolean | No | Extract SVG elements and images (default: true) |
| Include Data URLs | Boolean | No | Extract base64 encoded images (default: false) |
| Resolve Relative URLs | Boolean | No | Convert relative URLs to absolute (default: true) |
| Include Metadata | Boolean | No | Extract image attributes and properties (default: true) |
| Max Images | Number | No | Maximum number of images to extract (default: 500) |
| Min Dimensions | Object | No | Minimum width/height filter (default: {width: 0, height: 0}) |

### Output Data

The node outputs an object containing:

```json
{
  "images": [
    {
      "src": "https://example.com/image.jpg",
      "alt": "Image description",
      "title": "Image title",
      "width": 800,
      "height": 600,
      "naturalWidth": 1600,
      "naturalHeight": 1200,
      "type": "img",
      "format": "jpeg",
      "size": 245760,
      "visible": true,
      "attributes": {
        "class": "hero-image",
        "id": "main-banner",
        "loading": "lazy",
        "srcset": "image-800.jpg 800w, image-1600.jpg 1600w"
      },
      "position": {
        "index": 0,
        "xpath": "/html/body/div[1]/img[1]"
      },
      "context": {
        "parentElement": "div",
        "nearbyText": "Welcome to our website"
      }
    }
  ],
  "summary": {
    "totalImages": 25,
    "visibleImages": 20,
    "hiddenImages": 5,
    "backgroundImages": 8,
    "svgImages": 3,
    "formats": {
      "jpeg": 15,
      "png": 7,
      "webp": 2,
      "svg": 1
    },
    "totalSize": 2048000
  },
  "extractedAt": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Image Asset Inventory

Create comprehensive inventory of page images:

```javascript
// Workflow: Extract images → analyze → catalog
// 1. Get All Images extracts all page images
// 2. Analyze image properties (size, format, dimensions)
// 3. Check for optimization opportunities
// 4. Generate image asset report and recommendations
```

### Content Migration and Backup

Backup or migrate images from web pages:

```javascript
// Workflow: Image extraction → download → organize
// 1. Get All Images captures all image URLs
// 2. Download images to local storage or cloud
// 3. Organize by type, size, or usage context
// 4. Create backup manifest with metadata
```

### SEO Image Analysis

Analyze images for SEO optimization:

```javascript
// Workflow: Image extraction → SEO analysis → recommendations
// 1. Get All Images extracts image data
// 2. Check alt text, file names, and dimensions
// 3. Analyze loading performance and optimization
// 4. Generate SEO improvement suggestions
```

### Visual Content Analysis

Analyze visual content patterns and usage:

```javascript
// Workflow: Image extraction → AI analysis → insights
// 1. Get All Images captures page images
// 2. AI image recognition analyzes content
// 3. Categorize images by content type
// 4. Generate visual content insights report
```

## Integration Patterns

### With Image Processing

```javascript
// Pattern: Extract → process → optimize
Get All Images → Download Images → Resize/Optimize → Upload to CDN
```

### With Content Analysis

```javascript
// Pattern: Extract → analyze → categorize
Get All Images → AI Image Analysis → Categorize Content → Generate Report
```

### With Performance Monitoring

```javascript
// Pattern: Extract → measure → optimize
Get All Images → Check Load Times → Analyze Sizes → Suggest Optimizations
```

## Image Processing Features

### Image Type Detection

The node automatically detects and categorizes images:

| Image Type | Description | Source |
|------------|-------------|--------|
| IMG Elements | Standard HTML img tags | `<img src="...">` |
| Background Images | CSS background-image properties | `background-image: url(...)` |
| SVG Images | Scalable vector graphics | `<svg>` elements |
| Picture Elements | Responsive image sets | `<picture>` with `<source>` |
| Data URLs | Base64 encoded images | `data:image/...` |
| Icon Images | Favicons and app icons | `<link rel="icon">` |

### Format and Quality Analysis

Comprehensive image format detection and analysis:
- **Format Identification**: JPEG, PNG, WebP, SVG, GIF, etc.
- **Quality Assessment**: File size vs. dimensions analysis
- **Compression Analysis**: Optimization potential detection
- **Modern Format Support**: WebP, AVIF availability checking

### Responsive Image Handling

Process responsive image sets and srcset attributes:
- **Srcset Parsing**: Extract all image variants from srcset
- **Size Calculation**: Determine appropriate image for viewport
- **Density Handling**: Process high-DPI image variants
- **Art Direction**: Handle different images for different breakpoints

## Image Filtering and Processing

### Dimension-Based Filtering

Filter images based on size criteria:

| Filter Type | Description | Use Case |
|-------------|-------------|----------|
| Minimum Size | Images above width/height threshold | Exclude small icons, buttons |
| Maximum Size | Images below size limit | Focus on thumbnails or previews |
| Aspect Ratio | Images matching ratio ranges | Find landscape, portrait, or square images |
| File Size | Images within size ranges | Identify large files for optimization |

### Content-Based Filtering

Filter images based on content and context:
- **Alt Text Patterns**: Filter by alt text content
- **File Name Patterns**: Filter by image file names
- **Context Analysis**: Filter by surrounding content
- **Usage Type**: Distinguish content vs. decorative images
- **Visibility Status**: Include/exclude hidden images

### Quality Assessment

Assess image quality and optimization:
- **Optimization Score**: File size vs. quality analysis
- **Loading Performance**: Impact on page load times
- **Accessibility Score**: Alt text and semantic markup quality
- **SEO Value**: Relevance and optimization for search

## Performance Considerations

### Processing Efficiency

| Page Complexity | Image Count | Processing Time | Recommendations |
|----------------|-------------|-----------------|-----------------|
| Simple | < 20 images | < 200ms | No restrictions |
| Medium | 20-50 images | 200-500ms | Consider filtering |
| Complex | 50-100 images | 500ms-1s | Use dimension filters |
| Very Complex | > 100 images | > 1s | Apply strict limits |

### Memory Usage

Factors affecting memory consumption:
- **Image Count**: More images require more memory
- **Metadata Depth**: Detailed analysis increases memory usage
- **Background Image Processing**: CSS parsing adds overhead
- **Dimension Calculation**: Natural size detection requires resources

### Network Considerations

When processing images for analysis:
- **Bandwidth Usage**: Downloading images for analysis
- **CDN Detection**: Identify images served from CDNs
- **Caching Headers**: Respect cache policies
- **Rate Limiting**: Avoid overwhelming image servers

## Error Handling

### Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| No Images Found | Page has no images or access denied | Check page content and permissions |
| Load Failures | Images fail to load or are broken | Handle broken image URLs gracefully |
| Memory Limit | Too many images for processing | Reduce max images or add filtering |
| Access Denied | Content script injection blocked | Verify page permissions |
| Format Errors | Unsupported or corrupted image formats | Add format validation |

### Error Response Format

```json
{
  "error": true,
  "errorType": "EXTRACTION_FAILED",
  "message": "Unable to extract images from page",
  "images": [],
  "summary": {
    "totalImages": 0,
    "errorCount": 1
  },
  "details": {
    "reason": "Content script injection blocked",
    "url": "https://example.com/page"
  }
}
```

## Best Practices

### Performance Optimization
1. **Set Reasonable Limits**: Use `Max Images` to prevent memory issues
2. **Filter by Dimensions**: Exclude tiny images to reduce processing
3. **Batch Processing**: Process images in batches for large collections
4. **Cache Metadata**: Store image data to avoid re-processing

### Data Quality
1. **URL Validation**: Verify image URLs are accessible
2. **Deduplication**: Remove duplicate images with same source
3. **Format Validation**: Ensure extracted URLs point to valid images
4. **Context Preservation**: Maintain important image context information

### Security Considerations
1. **URL Sanitization**: Clean and validate extracted image URLs
2. **Content Filtering**: Remove potentially harmful or unwanted images
3. **Privacy Protection**: Be careful with user-generated image content
4. **Access Control**: Respect image usage rights and policies

### User Experience
1. **Progress Indicators**: Show extraction progress for image-heavy pages
2. **Preview Generation**: Create thumbnails or previews of extracted images
3. **Error Feedback**: Provide clear error messages for failed extractions
4. **Processing Notifications**: Inform users when extraction completes

## Accessibility and SEO

### Alt Text Analysis

Analyze and improve image accessibility:
- **Missing Alt Text**: Identify images without alt attributes
- **Alt Text Quality**: Assess descriptiveness and relevance
- **Decorative Images**: Identify images that should have empty alt text
- **Context Relevance**: Check alt text matches image context

### SEO Optimization

Image SEO analysis and recommendations:
- **File Name Optimization**: Descriptive vs. generic file names
- **Image Dimensions**: Appropriate sizing for content
- **Loading Performance**: Lazy loading and optimization opportunities
- **Structured Data**: Image markup for rich snippets

## Related Nodes

- **Get All Links**: Extract all links from the page
- **Download Image**: Download specific images from extracted URLs
- **Image Analysis**: Analyze image content using AI
- **Optimize Images**: Process and optimize extracted images
- **Generate Thumbnails**: Create thumbnails from extracted images