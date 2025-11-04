---
title: Image Processor
description: "Process, resize, optimize, and transform images using Agentic Workflow Studio browser extension for comprehensive image manipulation workflows."
---

The **Image Processor** node provides comprehensive image processing capabilities including resizing, format conversion, optimization, filtering, and transformation operations for automated image manipulation workflows within the browser environment.

## How it Works

This node takes image data (URLs, base64, or file objects) and applies various processing operations using browser-based image processing APIs, Canvas API, and WebAssembly-based image libraries to perform sophisticated image manipulations without requiring external services.

## Browser API Details

The node leverages multiple browser APIs for comprehensive image processing:

### Core APIs Used

**Canvas API**
- `HTMLCanvasElement`: Primary image processing surface
- `CanvasRenderingContext2D`: 2D image manipulation operations
- `ImageData`: Pixel-level image data manipulation
- `createImageBitmap()`: Efficient image loading and processing

**Image Processing APIs**
- `HTMLImageElement`: Load and decode images
- `OffscreenCanvas`: Background image processing
- `ImageBitmap`: High-performance image representation
- `Blob`: Binary image data handling

**File and Data APIs**
- `FileReader`: Read image files and data URLs
- `URL.createObjectURL()`: Create object URLs for processed images
- `fetch()`: Download images for processing
- `ArrayBuffer`: Binary image data manipulation

**WebAssembly Integration**
- Image processing libraries (ImageMagick, OpenCV)
- Advanced filtering and transformation algorithms
- High-performance batch processing
- Custom image processing pipelines

### Required Permissions

| Permission | Purpose | Scope |
|------------|---------|-------|
| `activeTab` | Access current tab for image processing | Current tab only |
| `scripting` | Inject processing scripts | Active tab content |
| `storage` | Cache processed images and settings | Extension storage |
| `downloads` | Save processed images | User downloads folder |

## Configuration

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Image Source** | String/Array | Yes | `""` | Image URL, base64 data, or array of images |
| **Processing Mode** | String | No | `single` | Processing mode: `single`, `batch`, `pipeline` |
| **Output Format** | String | No | `original` | Output format: `original`, `jpeg`, `png`, `webp`, `avif` |
| **Quality** | Number | No | `85` | Output quality for lossy formats (0-100) |
| **Preserve Metadata** | Boolean | No | `false` | Preserve EXIF and other metadata |

### Resize & Transform Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Resize Mode** | String | No | `none` | Resize mode: `none`, `fit`, `fill`, `stretch`, `crop` |
| **Target Width** | Number | No | `0` | Target width in pixels (0 = auto) |
| **Target Height** | Number | No | `0` | Target height in pixels (0 = auto) |
| **Max Width** | Number | No | `0` | Maximum width constraint |
| **Max Height** | Number | No | `0` | Maximum height constraint |
| **Aspect Ratio** | String | No | `preserve` | Aspect ratio handling: `preserve`, `ignore`, `crop` |
| **Upscale** | Boolean | No | `false` | Allow upscaling beyond original size |
| **Rotation** | Number | No | `0` | Rotation angle in degrees |
| **Flip Horizontal** | Boolean | No | `false` | Flip image horizontally |
| **Flip Vertical** | Boolean | No | `false` | Flip image vertically |

### Optimization Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Optimize** | Boolean | No | `true` | Apply optimization algorithms |
| **Progressive** | Boolean | No | `false` | Create progressive JPEG (when applicable) |
| **Strip Metadata** | Boolean | No | `true` | Remove metadata to reduce file size |
| **Lossless** | Boolean | No | `false` | Use lossless compression when possible |
| **Compression Level** | Number | No | `6` | Compression level (0-9, format dependent) |
| **Chroma Subsampling** | String | No | `auto` | Chroma subsampling: `auto`, `444`, `422`, `420` |

### Filter & Enhancement Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Brightness** | Number | No | `0` | Brightness adjustment (-100 to 100) |
| **Contrast** | Number | No | `0` | Contrast adjustment (-100 to 100) |
| **Saturation** | Number | No | `0` | Saturation adjustment (-100 to 100) |
| **Hue** | Number | No | `0` | Hue shift in degrees (-180 to 180) |
| **Gamma** | Number | No | `1.0` | Gamma correction (0.1 to 3.0) |
| **Sharpen** | Number | No | `0` | Sharpening amount (0 to 100) |
| **Blur** | Number | No | `0` | Blur radius in pixels |
| **Noise Reduction** | Number | No | `0` | Noise reduction strength (0 to 100) |

### Advanced Processing Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Color Space** | String | No | `sRGB` | Color space: `sRGB`, `Adobe RGB`, `P3`, `Rec2020` |
| **Bit Depth** | Number | No | `8` | Bit depth: `8`, `16` (format dependent) |
| **Dithering** | Boolean | No | `false` | Apply dithering for color reduction |
| **Background Color** | String | No | `transparent` | Background color for transparency removal |
| **Border** | Object | No | `{}` | Border options: `{width: 5, color: "#000", style: "solid"}` |
| **Watermark** | Object | No | `{}` | Watermark options: `{text: "", position: "bottom-right"}` |

### Batch Processing Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Batch Size** | Number | No | `10` | Images to process simultaneously |
| **Parallel Processing** | Boolean | No | `true` | Process images in parallel |
| **Progress Callback** | Boolean | No | `false` | Enable progress reporting |
| **Error Handling** | String | No | `continue` | Error handling: `stop`, `continue`, `retry` |
| **Output Naming** | String | No | `original` | Naming pattern: `original`, `sequential`, `timestamp` |

### Performance Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Processing Timeout** | Number | No | `30000` | Maximum processing time per image (milliseconds) |
| **Memory Limit** | Number | No | `100` | Maximum memory usage in MB |
| **Use WebAssembly** | Boolean | No | `true` | Use WebAssembly for performance-critical operations |
| **Canvas Size Limit** | Number | No | `4096` | Maximum canvas dimension |
| **Tile Processing** | Boolean | No | `false` | Process large images in tiles |

## Usage Examples

### Basic Image Resizing

Resize images to specific dimensions:

```javascript
// Configuration for image resizing
{
  "imageSource": "https://example.com/large-image.jpg",
  "processingMode": "single",
  "resizeMode": "fit",
  "targetWidth": 800,
  "targetHeight": 600,
  "aspectRatio": "preserve",
  "outputFormat": "webp",
  "quality": 85
}

// Workflow: Large image → Resize → Optimize → Save
// Input: 3000x2000 JPEG (2MB)
// Output: 800x533 WebP (150KB)
```

### Batch Image Optimization

Optimize multiple images for web use:

```javascript
// Configuration for batch optimization
{
  "imageSource": ["image1.jpg", "image2.png", "image3.jpeg"],
  "processingMode": "batch",
  "outputFormat": "webp",
  "quality": 80,
  "maxWidth": 1200,
  "optimize": true,
  "stripMetadata": true,
  "progressive": true,
  "batchSize": 5,
  "parallelProcessing": true
}

// Workflow: Image collection → Batch optimize → Generate variants
// 1. Process multiple images simultaneously
// 2. Convert to modern formats
// 3. Apply consistent optimization
// 4. Generate multiple size variants
```

### Advanced Image Enhancement

Apply filters and enhancements to images:

```javascript
// Configuration for image enhancement
{
  "imageSource": "photo.jpg",
  "processingMode": "single",
  "brightness": 10,
  "contrast": 15,
  "saturation": 5,
  "sharpen": 20,
  "noiseReduction": 10,
  "gamma": 1.1,
  "outputFormat": "jpeg",
  "quality": 90
}

// Workflow: Raw photo → Enhance → Professional output
// 1. Apply brightness and contrast adjustments
// 2. Enhance color saturation
// 3. Apply sharpening and noise reduction
// 4. Output high-quality result
```

### Responsive Image Generation

Generate multiple sizes for responsive design:

```javascript
// Configuration for responsive variants
{
  "imageSource": "hero-image.jpg",
  "processingMode": "pipeline",
  "variants": [
    {
      "name": "mobile",
      "targetWidth": 480,
      "quality": 75,
      "outputFormat": "webp"
    },
    {
      "name": "tablet", 
      "targetWidth": 768,
      "quality": 80,
      "outputFormat": "webp"
    },
    {
      "name": "desktop",
      "targetWidth": 1200,
      "quality": 85,
      "outputFormat": "webp"
    },
    {
      "name": "retina",
      "targetWidth": 2400,
      "quality": 90,
      "outputFormat": "webp"
    }
  ]
}

// Workflow: Source image → Generate variants → Optimize for devices
// Output: Multiple optimized variants for different screen sizes
```

### Watermark and Branding

Add watermarks and branding to images:

```javascript
// Configuration for watermarking
{
  "imageSource": "product-photo.jpg",
  "processingMode": "single",
  "watermark": {
    "type": "text",
    "text": "© 2024 Company Name",
    "position": "bottom-right",
    "opacity": 0.7,
    "fontSize": 24,
    "color": "#ffffff",
    "shadow": true
  },
  "border": {
    "width": 2,
    "color": "#cccccc",
    "style": "solid"
  },
  "outputFormat": "jpeg",
  "quality": 90
}

// Workflow: Product photo → Add branding → Professional output
// 1. Add copyright watermark
// 2. Apply subtle border
// 3. Maintain high quality for marketing use
```

### Format Conversion Pipeline

Convert images between different formats:

```javascript
// Configuration for format conversion
{
  "imageSource": ["image1.png", "image2.bmp", "image3.tiff"],
  "processingMode": "batch",
  "outputFormat": "webp",
  "quality": 85,
  "lossless": false,
  "stripMetadata": true,
  "optimize": true,
  "parallelProcessing": true,
  "progressCallback": true
}

// Workflow: Mixed formats → Standardize → Web-optimized output
// 1. Convert all images to WebP
// 2. Apply consistent optimization
// 3. Remove unnecessary metadata
// 4. Generate web-ready assets
```

### Image Analysis and Processing

Analyze images and apply conditional processing:

```javascript
// Configuration for intelligent processing
{
  "imageSource": "photo.jpg",
  "processingMode": "single",
  "analyzeFirst": true,
  "conditionalProcessing": {
    "lowLight": {
      "condition": "brightness < 30",
      "actions": {
        "brightness": 20,
        "contrast": 10,
        "noiseReduction": 15
      }
    },
    "overexposed": {
      "condition": "brightness > 80",
      "actions": {
        "brightness": -15,
        "contrast": 5
      }
    },
    "lowContrast": {
      "condition": "contrast < 20",
      "actions": {
        "contrast": 15,
        "sharpen": 10
      }
    }
  }
}

// Workflow: Analyze image → Apply conditional enhancements → Optimize
// 1. Analyze image characteristics
// 2. Apply appropriate enhancements based on analysis
// 3. Generate optimized output
```

## Output Data Structure

### Processing Results

```json
{
  "success": true,
  "processed": {
    "count": 3,
    "successful": 3,
    "failed": 0
  },
  "results": [
    {
      "id": "img-001",
      "originalImage": {
        "src": "https://example.com/original.jpg",
        "format": "jpeg",
        "width": 3000,
        "height": 2000,
        "fileSize": 2048000,
        "quality": 95
      },
      "processedImage": {
        "src": "data:image/webp;base64,UklGRiQAAABXRUJQVlA4...",
        "downloadUrl": "blob:https://example.com/processed-image",
        "format": "webp",
        "width": 800,
        "height": 533,
        "fileSize": 156000,
        "quality": 85,
        "compressionRatio": 0.076
      },
      "operations": [
        {
          "type": "resize",
          "parameters": {"width": 800, "height": 533, "mode": "fit"},
          "duration": 45
        },
        {
          "type": "format-conversion",
          "parameters": {"from": "jpeg", "to": "webp", "quality": 85},
          "duration": 120
        },
        {
          "type": "optimization",
          "parameters": {"stripMetadata": true, "progressive": false},
          "duration": 30
        }
      ],
      "performance": {
        "totalProcessingTime": 195,
        "memoryUsed": 24000000,
        "cpuTime": 180,
        "cacheHit": false
      },
      "quality": {
        "score": 88,
        "factors": {
          "compression": 0.85,
          "sharpness": 0.92,
          "colorAccuracy": 0.89,
          "artifactLevel": 0.95
        },
        "recommendations": []
      },
      "metadata": {
        "preserved": false,
        "stripped": ["exif", "icc", "xmp"],
        "added": {
          "processed": "2024-01-15T10:30:00Z",
          "tool": "Agentic Image Processor v2.1"
        }
      }
    }
  ],
  "summary": {
    "totalOriginalSize": 6144000,
    "totalProcessedSize": 468000,
    "totalSavings": 5676000,
    "compressionRatio": 0.076,
    "averageQualityScore": 88,
    "processingTime": 585,
    "memoryPeak": 72000000
  },
  "optimization": {
    "spaceSaved": "5.4 MB",
    "percentageSaved": 92.4,
    "qualityMaintained": 88,
    "formatImprovements": {
      "webpAdoption": 3,
      "modernFormatSavings": "2.1 MB"
    }
  },
  "variants": [
    {
      "name": "thumbnail",
      "width": 200,
      "height": 133,
      "fileSize": 12000,
      "src": "data:image/webp;base64,..."
    },
    {
      "name": "medium",
      "width": 800,
      "height": 533,
      "fileSize": 156000,
      "src": "data:image/webp;base64,..."
    },
    {
      "name": "large",
      "width": 1200,
      "height": 800,
      "fileSize": 300000,
      "src": "data:image/webp;base64,..."
    }
  ],
  "processingMetadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "2.1.0",
    "engine": "canvas-webassembly",
    "parallelProcessing": true,
    "batchSize": 3,
    "cacheUtilization": 0.45
  }
}
```

## Integration Patterns

### With Image Collection Workflows

```javascript
// Pattern: Collect → Process → Optimize → Store
Get All Images → Image Processor → Optimize Results → Save to Storage
```

### With Content Management Systems

```javascript
// Pattern: Upload → Process → Generate Variants → Deploy
Upload Images → Image Processor → Generate Sizes → Update CMS
```

### With E-commerce Workflows

```javascript
// Pattern: Product photos → Standardize → Optimize → Publish
Product Images → Image Processor → Apply Branding → Publish to Store
```

### With Social Media Automation

```javascript
// Pattern: Content → Resize for platforms → Add branding → Post
Source Images → Image Processor → Platform Variants → Social Media API
```

## Advanced Processing Features

### Machine Learning Integration

**Intelligent Enhancement**
- Automatic exposure correction
- Smart noise reduction
- Content-aware resizing
- Object detection for cropping

**Quality Assessment**
- Automatic quality scoring
- Blur detection
- Artifact identification
- Optimization recommendations

### Custom Processing Pipelines

**Pipeline Configuration**
```javascript
{
  "pipeline": [
    {
      "operation": "analyze",
      "parameters": {"detectFaces": true, "detectObjects": true}
    },
    {
      "operation": "crop",
      "parameters": {"mode": "smart", "focusOnFaces": true}
    },
    {
      "operation": "enhance",
      "parameters": {"auto": true, "preserveNaturalLook": true}
    },
    {
      "operation": "resize",
      "parameters": {"width": 800, "mode": "fit"}
    },
    {
      "operation": "optimize",
      "parameters": {"format": "webp", "quality": 85}
    }
  ]
}
```

### Batch Processing Optimization

**Memory Management**
- Streaming processing for large batches
- Automatic memory cleanup
- Progressive loading and processing
- Efficient resource utilization

**Performance Scaling**
- Adaptive batch sizing based on system resources
- Parallel processing with worker threads
- GPU acceleration when available
- Intelligent caching strategies

## Error Handling

### Common Processing Errors

| Error Type | Cause | Solution |
|------------|-------|----------|
| **Memory Limit Exceeded** | Image too large for processing | Reduce image size or use tile processing |
| **Format Not Supported** | Unsupported input format | Convert to supported format first |
| **Processing Timeout** | Operation takes too long | Increase timeout or simplify operations |
| **Invalid Parameters** | Incorrect processing parameters | Validate parameters before processing |
| **Canvas Size Limit** | Image exceeds canvas limitations | Use tile processing or reduce size |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "type": "PROCESSING_FAILED",
    "message": "Image processing failed due to memory constraints",
    "details": {
      "operation": "resize",
      "imageSize": "5000x4000",
      "memoryRequired": 200000000,
      "memoryAvailable": 100000000
    }
  },
  "partialResults": {
    "processedCount": 2,
    "failedCount": 1,
    "completedOperations": ["load", "analyze"]
  },
  "recommendations": [
    "Reduce image size before processing",
    "Use tile processing for large images",
    "Increase memory limit if possible"
  ]
}
```

## Performance Optimization

### Processing Speed

| Image Size | Processing Time | Memory Usage | Recommendations |
|------------|----------------|--------------|-----------------|
| < 1MP | < 100ms | < 10MB | No optimization needed |
| 1-5MP | 100ms-1s | 10-50MB | Standard processing |
| 5-20MP | 1-5s | 50-200MB | Consider tile processing |
| > 20MP | > 5s | > 200MB | Use tile processing, reduce quality |

### Memory Management

**Efficient Processing**
- Use OffscreenCanvas for background processing
- Implement progressive loading for large images
- Clear intermediate results promptly
- Use ImageBitmap for efficient image handling

**Resource Optimization**
- Adaptive quality based on output size
- Intelligent format selection
- Batch size optimization based on available memory
- GPU acceleration when available

## Best Practices

### Quality Preservation
1. **Format Selection**: Choose appropriate formats for content type
2. **Quality Settings**: Balance file size with visual quality
3. **Metadata Handling**: Preserve important metadata when needed
4. **Color Space**: Maintain appropriate color spaces for output use

### Performance
1. **Batch Processing**: Process multiple images efficiently
2. **Memory Management**: Monitor and optimize memory usage
3. **Caching**: Cache processed results for repeated operations
4. **Progressive Enhancement**: Start with basic processing, add advanced features

### User Experience
1. **Progress Feedback**: Provide clear progress indicators
2. **Error Handling**: Handle errors gracefully with helpful messages
3. **Preview Generation**: Show previews before final processing
4. **Cancellation**: Allow users to cancel long-running operations

## Related Nodes

- **Get All Images**: Extract images for processing input
- **Download Image**: Download images before processing
- **Upload Image**: Upload processed images to services
- **Image Analyzer**: Analyze image content and quality
- **Generate Thumbnails**: Create thumbnail variants
- **Optimize Images**: Specialized image optimization workflows