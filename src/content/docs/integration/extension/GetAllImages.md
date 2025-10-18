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

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Include Hidden Images** | Boolean | No | `false` | Extract images from hidden elements |
| **Include Background Images** | Boolean | No | `true` | Extract CSS background images |
| **Include SVG Images** | Boolean | No | `true` | Extract SVG elements and images |
| **Include Data URLs** | Boolean | No | `false` | Extract base64 encoded images |
| **Resolve Relative URLs** | Boolean | No | `true` | Convert relative URLs to absolute |
| **Include Metadata** | Boolean | No | `true` | Extract image attributes and properties |
| **Max Images** | Number | No | `500` | Maximum number of images to extract |

### Filtering Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Min Dimensions** | Object | No | `{width: 0, height: 0}` | Minimum width/height filter |
| **Max Dimensions** | Object | No | `{width: 0, height: 0}` | Maximum width/height filter (0 = unlimited) |
| **Min File Size** | Number | No | `0` | Minimum file size in bytes |
| **Max File Size** | Number | No | `0` | Maximum file size in bytes (0 = unlimited) |
| **Allowed Formats** | Array | No | `[]` | Image formats to include (e.g., `["jpg", "png", "webp"]`) |
| **Excluded Formats** | Array | No | `[]` | Image formats to exclude |
| **Aspect Ratio Range** | Object | No | `{}` | Aspect ratio filter: `{min: 0.5, max: 2.0}` |
| **Quality Threshold** | Number | No | `0` | Minimum quality score (0-100) |

### Content Filtering Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Content Areas Only** | Boolean | No | `false` | Extract only from main content areas |
| **Exclude Navigation** | Boolean | No | `false` | Exclude navigation images (logos, icons) |
| **Exclude Decorative** | Boolean | No | `false` | Exclude decorative/background images |
| **Exclude Advertisements** | Boolean | No | `false` | Exclude advertising images |
| **Custom Exclude Selectors** | Array | No | `[]` | CSS selectors for elements to exclude |
| **Custom Include Selectors** | Array | No | `[]` | CSS selectors for elements to include only |
| **Alt Text Filters** | Array | No | `[]` | Filter by alt text patterns |
| **File Name Filters** | Array | No | `[]` | Filter by file name patterns |

### Metadata Extraction Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Extract Dimensions** | Boolean | No | `true` | Extract natural and display dimensions |
| **Extract File Info** | Boolean | No | `true` | Extract file size, format, and compression info |
| **Extract Context** | Boolean | No | `false` | Extract surrounding content and context |
| **Extract Responsive Data** | Boolean | No | `true` | Extract srcset and responsive image data |
| **Extract Performance Data** | Boolean | No | `false` | Extract loading performance metrics |
| **Extract Accessibility Data** | Boolean | No | `true` | Extract alt text and accessibility attributes |
| **Extract SEO Data** | Boolean | No | `false` | Extract SEO-relevant image data |
| **Extract Color Analysis** | Boolean | No | `false` | Extract dominant colors and color palette |

### Processing Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Processing Timeout** | Number | No | `30000` | Maximum processing time in milliseconds |
| **Batch Processing** | Boolean | No | `false` | Process large image sets in batches |
| **Batch Size** | Number | No | `50` | Images to process per batch |
| **Parallel Processing** | Boolean | No | `false` | Process image analysis in parallel |
| **Include Processing Stats** | Boolean | No | `false` | Include performance metrics in output |
| **Cache Results** | Boolean | No | `false` | Cache extracted image data |
| **Cache Duration** | Number | No | `300000` | Cache duration in milliseconds |

### Quality Assessment Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Analyze Quality** | Boolean | No | `false` | Perform image quality analysis |
| **Detect Optimization** | Boolean | No | `false` | Detect optimization opportunities |
| **Check Accessibility** | Boolean | No | `false` | Check accessibility compliance |
| **Validate URLs** | Boolean | No | `false` | Validate image URLs are accessible |
| **Detect Duplicates** | Boolean | No | `false` | Identify duplicate images |
| **Performance Analysis** | Boolean | No | `false` | Analyze loading performance impact |

### Output Data

The node outputs a comprehensive object containing:

```json
{
  "images": [
    {
      "id": "img-001",
      "src": "https://example.com/image.jpg",
      "originalSrc": "/images/image.jpg", // Before URL resolution
      "alt": "Image description",
      "title": "Image title",
      "width": 800,
      "height": 600,
      "naturalWidth": 1600,
      "naturalHeight": 1200,
      "aspectRatio": 1.33,
      "type": "img", // img, background, svg, picture
      "format": "jpeg",
      "mimeType": "image/jpeg",
      "fileSize": 245760,
      "fileSizeFormatted": "240 KB",
      "visible": true,
      "loading": "lazy",
      "attributes": {
        "class": "hero-image responsive",
        "id": "main-banner",
        "loading": "lazy",
        "srcset": "image-800.jpg 800w, image-1600.jpg 1600w",
        "sizes": "(max-width: 800px) 100vw, 800px",
        "decoding": "async",
        "fetchpriority": "high"
      },
      "position": {
        "index": 0,
        "xpath": "/html/body/div[1]/img[1]",
        "selector": "div.hero > img.hero-image",
        "offsetTop": 100,
        "offsetLeft": 0,
        "zIndex": 1
      },
      "context": {
        "parentElement": "div",
        "parentClass": "hero-section",
        "nearbyText": "Welcome to our website - Discover amazing products",
        "sectionHeading": "Hero Section",
        "purpose": "hero-image", // hero, content, thumbnail, icon, decoration
        "semanticRole": "presentation"
      },
      "responsive": {
        "hasSrcset": true,
        "variants": [
          {
            "src": "image-400.jpg",
            "width": 400,
            "density": "1x",
            "mediaQuery": "(max-width: 400px)"
          },
          {
            "src": "image-800.jpg", 
            "width": 800,
            "density": "1x",
            "mediaQuery": "(max-width: 800px)"
          },
          {
            "src": "image-1600.jpg",
            "width": 1600,
            "density": "2x"
          }
        ],
        "optimalVariant": "image-800.jpg",
        "currentVariant": "image-800.jpg"
      },
      "quality": {
        "score": 85, // 0-100 quality score
        "factors": {
          "compression": 0.82,
          "dimensions": 0.90,
          "format": 0.85,
          "optimization": 0.78
        },
        "issues": ["could-use-webp", "slightly-overcompressed"],
        "recommendations": ["Convert to WebP", "Reduce compression slightly"]
      },
      "performance": {
        "loadTime": 245,
        "firstPaint": 180,
        "renderTime": 200,
        "cacheStatus": "hit",
        "compressionRatio": 0.15,
        "optimizationPotential": 0.25,
        "criticalResource": false
      },
      "accessibility": {
        "hasAltText": true,
        "altTextQuality": "good", // excellent, good, fair, poor
        "altTextLength": 18,
        "isDecorative": false,
        "colorContrast": "sufficient",
        "focusable": false,
        "ariaLabels": []
      },
      "seo": {
        "fileName": "hero-image-company-products.jpg",
        "fileNameQuality": "excellent",
        "relevanceScore": 0.92,
        "keywordMatch": ["company", "products"],
        "structuredData": {
          "type": "ImageObject",
          "contentUrl": "https://example.com/image.jpg",
          "caption": "Image description"
        }
      },
      "colors": {
        "dominantColor": "#3498db",
        "palette": ["#3498db", "#2c3e50", "#ecf0f1", "#e74c3c"],
        "averageBrightness": 0.65,
        "colorfulness": 0.78,
        "hasTransparency": false
      },
      "metadata": {
        "exif": {
          "camera": "Canon EOS R5",
          "lens": "RF 24-70mm f/2.8L IS USM",
          "focalLength": "35mm",
          "aperture": "f/5.6",
          "iso": 200,
          "shutterSpeed": "1/125",
          "dateTime": "2024-01-10T14:30:00Z"
        },
        "copyright": "© 2024 Example Company",
        "creator": "John Photographer",
        "keywords": ["business", "technology", "innovation"]
      },
      "validation": {
        "isAccessible": true,
        "isValid": true,
        "hasErrors": false,
        "warnings": ["Large file size"],
        "compliance": {
          "wcag": "AA",
          "section508": "compliant"
        }
      }
    }
  ],
  "summary": {
    "totalImages": 25,
    "processedImages": 25,
    "validImages": 24,
    "brokenImages": 1,
    "duplicateImages": 2,
    "visibleImages": 20,
    "hiddenImages": 5,
    "backgroundImages": 8,
    "svgImages": 3,
    "responsiveImages": 12,
    "lazyLoadedImages": 18,
    "totalFileSize": 2048000,
    "totalFileSizeFormatted": "2.0 MB",
    "averageFileSize": 81920,
    "largestImage": {
      "src": "hero-banner.jpg",
      "size": 512000
    },
    "smallestImage": {
      "src": "icon-small.png", 
      "size": 1024
    }
  },
  "formats": {
    "jpeg": {
      "count": 15,
      "totalSize": 1200000,
      "averageSize": 80000,
      "quality": "good"
    },
    "png": {
      "count": 7,
      "totalSize": 560000,
      "averageSize": 80000,
      "quality": "excellent"
    },
    "webp": {
      "count": 2,
      "totalSize": 120000,
      "averageSize": 60000,
      "quality": "excellent"
    },
    "svg": {
      "count": 1,
      "totalSize": 8000,
      "averageSize": 8000,
      "quality": "excellent"
    }
  },
  "categories": {
    "byPurpose": {
      "hero": 3,
      "content": 15,
      "thumbnail": 4,
      "icon": 2,
      "decoration": 1
    },
    "bySize": {
      "small": 8,    // < 50KB
      "medium": 12,  // 50KB - 200KB
      "large": 4,    // 200KB - 500KB
      "xlarge": 1    // > 500KB
    },
    "byDimensions": {
      "thumbnail": 5,  // < 200px
      "medium": 15,    // 200px - 800px
      "large": 4,      // 800px - 1600px
      "xlarge": 1      // > 1600px
    }
  },
  "optimization": {
    "overallScore": 0.78,
    "potentialSavings": 512000, // bytes
    "potentialSavingsFormatted": "500 KB",
    "recommendations": [
      {
        "type": "format-conversion",
        "description": "Convert 15 JPEG images to WebP",
        "impact": "high",
        "savings": 300000
      },
      {
        "type": "compression",
        "description": "Optimize compression for 8 images",
        "impact": "medium", 
        "savings": 150000
      },
      {
        "type": "responsive",
        "description": "Add responsive variants for 10 images",
        "impact": "high",
        "savings": 200000
      }
    ],
    "modernFormatSupport": {
      "webp": 0.85,
      "avif": 0.65,
      "jpegXL": 0.15
    }
  },
  "accessibility": {
    "overallScore": 0.82,
    "issues": [
      {
        "type": "missing-alt-text",
        "count": 3,
        "severity": "high",
        "images": ["icon-1.png", "decoration-bg.jpg", "chart.png"]
      },
      {
        "type": "poor-alt-text",
        "count": 2,
        "severity": "medium",
        "examples": ["image", "photo"]
      }
    ],
    "compliance": {
      "wcag2.1": "AA-partial",
      "section508": "partial"
    }
  },
  "seo": {
    "overallScore": 0.75,
    "factors": {
      "altTextOptimization": 0.82,
      "fileNameOptimization": 0.68,
      "dimensionOptimization": 0.78,
      "loadingOptimization": 0.72
    },
    "issues": [
      {
        "type": "generic-filenames",
        "count": 8,
        "examples": ["image1.jpg", "photo.png", "pic.jpeg"]
      },
      {
        "type": "missing-structured-data",
        "count": 20,
        "recommendation": "Add ImageObject structured data"
      }
    ]
  },
  "performance": {
    "totalLoadTime": 3450,
    "criticalImages": 3,
    "aboveFoldImages": 5,
    "lazyLoadCandidates": 15,
    "cacheHitRate": 0.65,
    "compressionEfficiency": 0.78,
    "renderBlockingImages": 2,
    "layoutShiftRisk": "medium"
  },
  "processing": {
    "timeMs": 2450,
    "method": "dom-traversal",
    "batchesProcessed": 3,
    "cacheHit": false,
    "parallelProcessing": false,
    "analysisEnabled": true,
    "warnings": ["Some images took longer than 5s to analyze"],
    "errors": []
  },
  "extractedAt": "2024-01-15T10:30:00Z",
  "pageInfo": {
    "url": "https://example.com/page",
    "title": "Page Title",
    "domain": "example.com",
    "viewport": {"width": 1920, "height": 1080}
  }
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

### Content Collection Alternatives
- **[Get All Links](/integration/extension/GetAllLinks/)**: Extract all links from the page for navigation analysis
- **[Get All Text](/integration/extension/GetAllText/)**: Extract all text content for comprehensive page analysis
- **[Get All HTML](/integration/extension/GetAllHTML/)**: Extract complete HTML structure including images

### Image Processing & Analysis
- **[Image Processor](/integration/extension/ImageProcessor/)**: Process collected images with resizing and optimization
- **[Media Extractor](/integration/extension/MediaExtractor/)**: Extract various media types beyond images
- **[HTTP Request](/integration/builtin/core/Http-Request/)**: Download images or validate image URLs

### Data Processing
- **[Edit Fields](/integration/builtin/dataTransformation/EditFields/)**: Process and filter extracted image metadata
- **[Filter](/integration/builtin/flow/Filter/)**: Filter images based on size, format, or other criteria

### Common Workflow Patterns
- **Image Collection**: GetAllImages → [Image Processor](/integration/extension/ImageProcessor/) → [Download as File](/integration/builtin/dataTransformation/DownloadAsFile/)
- **Media Analysis**: GetAllImages → [AI Analysis](/integration/builtin/ai/AIAgents/BasicLLMChainNode/) → [Content Classification](/integration/builtin/dataTransformation/EditFields/)
- **Asset Optimization**: GetAllImages → [Image Processor](/integration/extension/ImageProcessor/) → [Performance Analysis](/learning/workflow-patterns/optimization-best-practices/)

### Learning Resources
- **[Content Manipulation Patterns](/learning/workflow-patterns/content-manipulation-patterns/)**: Advanced image collection and processing techniques
- **[E-commerce Automation](/learning/workflow-patterns/real-world-examples/ecommerce-automation/)**: Using image collection for product analysis
- **[AI-Powered Analysis](/learning/text-courses/advanced/ai-powered-analysis/)**: Using AI to analyze collected images
- **Download Image**: Download specific images from extracted URLs
- **Image Analysis**: Analyze image content using AI
- **Optimize Images**: Process and optimize extracted images
- **Generate Thumbnails**: Create thumbnails from extracted images