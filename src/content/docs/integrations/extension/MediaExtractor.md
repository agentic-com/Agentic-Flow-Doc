---
title: Media Extractor
description: "Extract and analyze various media types from web pages using Agentic Workflow Studio browser extension for comprehensive media processing workflows."
---

The **Media Extractor** node provides comprehensive extraction and analysis of various media types including videos, audio files, documents, and interactive content from web pages, enabling sophisticated media processing and content analysis workflows.

## How it Works

This node traverses the DOM to identify and extract different types of media content including embedded videos, audio players, downloadable documents, interactive elements, and streaming media. It provides detailed metadata, accessibility information, and processing capabilities for each media type.

## Browser API Details

The node leverages multiple browser APIs for comprehensive media extraction:

### Core APIs Used

**Media Element APIs**
- `HTMLVideoElement`: Video element properties and metadata
- `HTMLAudioElement`: Audio element properties and controls
- `HTMLMediaElement`: Common media element functionality
- `MediaSource`: Media source extensions for streaming content

**DOM Analysis APIs**
- `Document.querySelectorAll()`: Find media elements by selectors
- `Element.getBoundingClientRect()`: Media element positioning
- `getComputedStyle()`: Media element styling and visibility
- `MutationObserver`: Monitor dynamic media content changes

**File and Resource APIs**
- `fetch()`: Retrieve media metadata and headers
- `Response.headers`: Analyze media file headers
- `URL()`: Parse and analyze media URLs
- `Blob`: Handle binary media data

**Streaming and Playback APIs**
- `MediaStream`: Live media stream analysis
- `WebRTC`: Real-time communication media
- `Web Audio API`: Audio analysis and processing
- `MediaRecorder`: Media recording capabilities

### Required Permissions

| Permission | Purpose | Scope |
|------------|---------|-------|
| `activeTab` | Access current tab for media extraction | Current tab only |
| `scripting` | Inject media analysis scripts | Active tab content |
| `storage` | Cache media metadata and analysis | Extension storage |
| `downloads` | Save extracted media files | User downloads folder |

## Configuration

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Media Types** | Array | No | `["video", "audio", "document"]` | Media types to extract |
| **Include Embedded** | Boolean | No | `true` | Extract embedded media (YouTube, Vimeo, etc.) |
| **Include Streaming** | Boolean | No | `true` | Extract streaming media sources |
| **Include Documents** | Boolean | No | `true` | Extract document files (PDF, DOC, etc.) |
| **Include Interactive** | Boolean | No | `false` | Extract interactive media (Flash, WebGL) |
| **Extract Metadata** | Boolean | No | `true` | Extract detailed media metadata |

### Filtering Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Min Duration** | Number | No | `0` | Minimum media duration in seconds |
| **Max Duration** | Number | No | `0` | Maximum media duration in seconds (0 = unlimited) |
| **Min File Size** | Number | No | `0` | Minimum file size in bytes |
| **Max File Size** | Number | No | `0` | Maximum file size in bytes (0 = unlimited) |
| **Allowed Formats** | Array | No | `[]` | Media formats to include (e.g., `["mp4", "webm", "pdf"]`) |
| **Excluded Formats** | Array | No | `[]` | Media formats to exclude |
| **Quality Filters** | Object | No | `{}` | Quality filters: `{minWidth: 720, minHeight: 480}` |
| **Content Filters** | Array | No | `[]` | Content type filters |

### Extraction Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Extract Thumbnails** | Boolean | No | `true` | Extract video thumbnails and previews |
| **Extract Captions** | Boolean | No | `true` | Extract subtitle and caption tracks |
| **Extract Audio Tracks** | Boolean | No | `false` | Extract separate audio tracks |
| **Extract Chapters** | Boolean | No | `false` | Extract chapter information |
| **Extract Playlists** | Boolean | No | `false` | Extract playlist information |
| **Extract Comments** | Boolean | No | `false` | Extract media comments and annotations |

### Analysis Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Analyze Content** | Boolean | No | `false` | Perform content analysis on media |
| **Detect Language** | Boolean | No | `false` | Detect media language |
| **Extract Keywords** | Boolean | No | `false` | Extract keywords from media metadata |
| **Analyze Quality** | Boolean | No | `true` | Analyze media quality metrics |
| **Check Accessibility** | Boolean | No | `true` | Check accessibility features |
| **Performance Analysis** | Boolean | No | `false` | Analyze loading and playback performance |

### Processing Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Processing Timeout** | Number | No | `30000` | Maximum processing time per media item |
| **Concurrent Extractions** | Number | No | `3` | Maximum concurrent media extractions |
| **Include Processing Stats** | Boolean | No | `false` | Include performance metrics in output |
| **Cache Results** | Boolean | No | `true` | Cache extraction results |
| **Cache Duration** | Number | No | `3600000` | Cache duration in milliseconds |

## Usage Examples

### Comprehensive Media Inventory

Extract all media from a webpage for inventory:

```javascript
// Configuration for complete media inventory
{
  "mediaTypes": ["video", "audio", "document", "interactive"],
  "includeEmbedded": true,
  "includeStreaming": true,
  "extractMetadata": true,
  "extractThumbnails": true,
  "extractCaptions": true,
  "analyzeContent": true,
  "checkAccessibility": true
}

// Output: Complete inventory of all media assets
// - Videos with thumbnails and metadata
// - Audio files with duration and quality info
// - Documents with file info and accessibility data
// - Interactive content with technology details
```

### Video Content Analysis

Analyze video content for SEO and accessibility:

```javascript
// Configuration for video analysis
{
  "mediaTypes": ["video"],
  "includeEmbedded": true,
  "extractMetadata": true,
  "extractThumbnails": true,
  "extractCaptions": true,
  "extractChapters": true,
  "analyzeContent": true,
  "detectLanguage": true,
  "checkAccessibility": true,
  "qualityFilters": {
    "minWidth": 480,
    "minHeight": 360,
    "minDuration": 30
  }
}

// Workflow: Video extraction → Content analysis → SEO optimization
// 1. Extract all videos from page
// 2. Analyze content, captions, and metadata
// 3. Check accessibility compliance
// 4. Generate SEO and accessibility recommendations
```

### Document Collection and Analysis

Extract and analyze document files:

```javascript
// Configuration for document extraction
{
  "mediaTypes": ["document"],
  "allowedFormats": ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"],
  "extractMetadata": true,
  "analyzeContent": true,
  "checkAccessibility": true,
  "minFileSize": 1024, // Exclude tiny files
  "maxFileSize": 50000000 // 50MB limit
}

// Workflow: Document extraction → Metadata analysis → Content indexing
// 1. Find all document links and embeds
// 2. Extract metadata (title, author, creation date)
// 3. Analyze accessibility features
// 4. Create searchable content index
```

### Streaming Media Analysis

Analyze streaming and live media content:

```javascript
// Configuration for streaming analysis
{
  "mediaTypes": ["video", "audio"],
  "includeStreaming": true,
  "includeEmbedded": true,
  "extractMetadata": true,
  "analyzeQuality": true,
  "performanceAnalysis": true,
  "extractPlaylists": true,
  "allowedFormats": ["m3u8", "mpd", "webm", "mp4"]
}

// Workflow: Streaming detection → Quality analysis → Performance optimization
// 1. Identify streaming media sources
// 2. Analyze stream quality and bitrates
// 3. Check adaptive streaming capabilities
// 4. Generate performance recommendations
```

### Educational Content Extraction

Extract educational media with learning analytics:

```javascript
// Configuration for educational content
{
  "mediaTypes": ["video", "audio", "document", "interactive"],
  "extractCaptions": true,
  "extractChapters": true,
  "extractComments": true,
  "analyzeContent": true,
  "detectLanguage": true,
  "extractKeywords": true,
  "checkAccessibility": true,
  "contentFilters": ["educational", "tutorial", "lecture"]
}

// Workflow: Educational media → Content analysis → Learning optimization
// 1. Extract all educational media
// 2. Analyze content structure and topics
// 3. Check accessibility for diverse learners
// 4. Generate learning analytics and recommendations
```

### Media Performance Audit

Audit media performance and optimization opportunities:

```javascript
// Configuration for performance audit
{
  "mediaTypes": ["video", "audio"],
  "extractMetadata": true,
  "analyzeQuality": true,
  "performanceAnalysis": true,
  "qualityFilters": {
    "checkCompression": true,
    "checkBitrates": true,
    "checkFormats": true
  },
  "includeProcessingStats": true
}

// Workflow: Media audit → Performance analysis → Optimization recommendations
// 1. Extract all media with performance data
// 2. Analyze file sizes, formats, and quality
// 3. Check loading times and streaming efficiency
// 4. Generate optimization recommendations
```

## Output Data Structure

### Comprehensive Media Extraction Results

```json
{
  "summary": {
    "totalMedia": 15,
    "extractedMedia": 15,
    "failedExtractions": 0,
    "mediaTypes": {
      "video": 8,
      "audio": 3,
      "document": 3,
      "interactive": 1
    },
    "totalSize": 125000000,
    "totalDuration": 3600,
    "processingTime": 5400
  },
  "videos": [
    {
      "id": "video-001",
      "type": "video",
      "element": "video",
      "src": "https://example.com/video.mp4",
      "embedType": "native", // native, youtube, vimeo, etc.
      "title": "Product Demo Video",
      "description": "Comprehensive product demonstration",
      "duration": 180,
      "dimensions": {
        "width": 1920,
        "height": 1080,
        "aspectRatio": "16:9"
      },
      "format": {
        "container": "mp4",
        "videoCodec": "h264",
        "audioCodec": "aac",
        "bitrate": 2500000,
        "framerate": 30
      },
      "fileInfo": {
        "size": 45000000,
        "sizeFormatted": "42.9 MB",
        "url": "https://example.com/video.mp4",
        "mimeType": "video/mp4",
        "lastModified": "2024-01-10T15:30:00Z"
      },
      "thumbnails": [
        {
          "time": 0,
          "url": "https://example.com/thumb-0.jpg",
          "width": 320,
          "height": 180
        },
        {
          "time": 90,
          "url": "https://example.com/thumb-90.jpg", 
          "width": 320,
          "height": 180
        }
      ],
      "captions": [
        {
          "language": "en",
          "label": "English",
          "src": "https://example.com/captions-en.vtt",
          "default": true
        },
        {
          "language": "es",
          "label": "Español",
          "src": "https://example.com/captions-es.vtt",
          "default": false
        }
      ],
      "chapters": [
        {
          "title": "Introduction",
          "startTime": 0,
          "endTime": 30
        },
        {
          "title": "Features Overview",
          "startTime": 30,
          "endTime": 120
        },
        {
          "title": "Conclusion",
          "startTime": 120,
          "endTime": 180
        }
      ],
      "quality": {
        "score": 88,
        "factors": {
          "resolution": 0.95,
          "bitrate": 0.85,
          "compression": 0.82,
          "audioQuality": 0.90
        },
        "issues": ["slightly-overcompressed"],
        "recommendations": ["Consider higher bitrate for better quality"]
      },
      "accessibility": {
        "score": 92,
        "features": {
          "hasCaptions": true,
          "hasAudioDescription": false,
          "hasTranscript": true,
          "keyboardAccessible": true
        },
        "compliance": {
          "wcag2.1": "AA",
          "section508": "compliant"
        },
        "issues": ["Missing audio description"],
        "recommendations": ["Add audio description track"]
      },
      "seo": {
        "score": 78,
        "factors": {
          "titleOptimization": 0.85,
          "descriptionQuality": 0.75,
          "metadataCompleteness": 0.70,
          "structuredData": 0.80
        },
        "structuredData": {
          "type": "VideoObject",
          "name": "Product Demo Video",
          "description": "Comprehensive product demonstration",
          "duration": "PT3M",
          "uploadDate": "2024-01-10"
        }
      },
      "performance": {
        "loadTime": 1200,
        "firstFrame": 800,
        "bufferHealth": 0.95,
        "streamingOptimized": true,
        "adaptiveBitrate": false,
        "preloadStrategy": "metadata"
      },
      "context": {
        "parentElement": "div",
        "parentClass": "video-container",
        "position": {"x": 100, "y": 200},
        "visibility": "visible",
        "autoplay": false,
        "controls": true,
        "loop": false,
        "muted": false
      },
      "analytics": {
        "viewCount": 1250,
        "engagement": 0.78,
        "averageViewDuration": 140,
        "dropoffPoints": [45, 120],
        "popularSegments": [{"start": 30, "end": 90, "engagement": 0.92}]
      }
    }
  ],
  "audio": [
    {
      "id": "audio-001",
      "type": "audio",
      "element": "audio",
      "src": "https://example.com/podcast.mp3",
      "title": "Weekly Podcast Episode 15",
      "description": "Discussion about industry trends",
      "duration": 2400,
      "format": {
        "container": "mp3",
        "codec": "mp3",
        "bitrate": 128000,
        "sampleRate": 44100,
        "channels": 2
      },
      "fileInfo": {
        "size": 38400000,
        "sizeFormatted": "36.6 MB",
        "url": "https://example.com/podcast.mp3",
        "mimeType": "audio/mpeg"
      },
      "metadata": {
        "artist": "Tech Talk Podcast",
        "album": "Season 2",
        "track": 15,
        "genre": "Technology",
        "year": 2024
      },
      "transcript": {
        "available": true,
        "src": "https://example.com/transcript.txt",
        "language": "en",
        "confidence": 0.94
      },
      "quality": {
        "score": 85,
        "factors": {
          "bitrate": 0.80,
          "clarity": 0.88,
          "noiseLevel": 0.92,
          "dynamicRange": 0.85
        }
      },
      "accessibility": {
        "score": 88,
        "features": {
          "hasTranscript": true,
          "hasChapters": true,
          "keyboardAccessible": true
        }
      }
    }
  ],
  "documents": [
    {
      "id": "doc-001",
      "type": "document",
      "element": "a",
      "src": "https://example.com/whitepaper.pdf",
      "title": "Industry Whitepaper 2024",
      "description": "Comprehensive industry analysis",
      "format": "pdf",
      "fileInfo": {
        "size": 2500000,
        "sizeFormatted": "2.4 MB",
        "pages": 25,
        "mimeType": "application/pdf",
        "lastModified": "2024-01-05T10:00:00Z"
      },
      "metadata": {
        "author": "Research Team",
        "creator": "Adobe Acrobat",
        "creationDate": "2024-01-05T10:00:00Z",
        "subject": "Industry Analysis",
        "keywords": ["industry", "analysis", "trends", "2024"]
      },
      "content": {
        "language": "en",
        "wordCount": 8500,
        "hasImages": true,
        "hasCharts": true,
        "hasTables": true,
        "outline": [
          {"title": "Executive Summary", "page": 1},
          {"title": "Market Analysis", "page": 3},
          {"title": "Trends and Predictions", "page": 15},
          {"title": "Conclusions", "page": 23}
        ]
      },
      "accessibility": {
        "score": 75,
        "features": {
          "hasBookmarks": true,
          "hasAltText": false,
          "isTagged": true,
          "isSearchable": true
        },
        "issues": ["Missing alt text for images"],
        "compliance": {
          "pdfUA": "partial",
          "wcag2.1": "A"
        }
      },
      "security": {
        "isEncrypted": false,
        "hasDigitalSignature": true,
        "permissions": {
          "canPrint": true,
          "canCopy": true,
          "canModify": false
        }
      }
    }
  ],
  "interactive": [
    {
      "id": "interactive-001",
      "type": "interactive",
      "element": "canvas",
      "technology": "webgl",
      "title": "3D Product Viewer",
      "description": "Interactive 3D product visualization",
      "dimensions": {
        "width": 800,
        "height": 600
      },
      "features": {
        "hasControls": true,
        "hasAnimation": true,
        "hasSound": false,
        "isFullscreenCapable": true
      },
      "performance": {
        "frameRate": 60,
        "renderTime": 16.7,
        "memoryUsage": 45000000,
        "gpuUtilization": 0.65
      },
      "accessibility": {
        "score": 45,
        "issues": ["No keyboard navigation", "No screen reader support"],
        "recommendations": ["Add keyboard controls", "Provide alternative text description"]
      }
    }
  ],
  "playlists": [
    {
      "id": "playlist-001",
      "type": "video-playlist",
      "title": "Product Tutorial Series",
      "description": "Complete tutorial series",
      "itemCount": 8,
      "totalDuration": 1800,
      "items": [
        {
          "title": "Getting Started",
          "src": "https://example.com/tutorial-1.mp4",
          "duration": 180,
          "order": 1
        }
      ]
    }
  ],
  "streaming": {
    "adaptiveStreams": [
      {
        "id": "stream-001",
        "type": "hls",
        "manifestUrl": "https://example.com/stream.m3u8",
        "qualities": [
          {"resolution": "1080p", "bitrate": 5000000},
          {"resolution": "720p", "bitrate": 2500000},
          {"resolution": "480p", "bitrate": 1000000}
        ],
        "features": {
          "adaptiveBitrate": true,
          "liveStream": false,
          "dvrEnabled": false
        }
      }
    ]
  },
  "analysis": {
    "contentTypes": {
      "educational": 8,
      "marketing": 4,
      "entertainment": 2,
      "documentation": 1
    },
    "languages": {
      "en": 12,
      "es": 2,
      "fr": 1
    },
    "qualityDistribution": {
      "excellent": 3,
      "good": 8,
      "fair": 3,
      "poor": 1
    },
    "accessibilityCompliance": {
      "fullyCompliant": 5,
      "partiallyCompliant": 8,
      "nonCompliant": 2
    }
  },
  "recommendations": {
    "immediate": [
      {
        "priority": "high",
        "type": "accessibility",
        "description": "Add captions to 3 videos missing them",
        "impact": "Improve accessibility compliance"
      }
    ],
    "optimization": [
      {
        "priority": "medium",
        "type": "performance",
        "description": "Convert 5 videos to more efficient formats",
        "impact": "Reduce bandwidth usage by 30%"
      }
    ],
    "enhancement": [
      {
        "priority": "low",
        "type": "seo",
        "description": "Add structured data to all media",
        "impact": "Improve search engine visibility"
      }
    ]
  },
  "extractionMetadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "2.1.0",
    "processingTime": 5400,
    "cacheUtilization": 0.55,
    "concurrentExtractions": 3,
    "totalDataProcessed": 125000000
  }
}
```

## Integration Patterns

### With Content Management Systems

```javascript
// Pattern: Extract → Analyze → Organize → Import
Media Extractor → Content Analysis → Categorize Media → Import to CMS
```

### With Educational Platforms

```javascript
// Pattern: Extract → Accessibility Check → Enhance → Publish
Media Extractor → Accessibility Audit → Add Captions → Publish Course
```

### With SEO Optimization

```javascript
// Pattern: Extract → SEO Analysis → Optimize → Monitor
Media Extractor → SEO Analyzer → Optimize Metadata → Track Performance
```

### With Performance Monitoring

```javascript
// Pattern: Extract → Performance Analysis → Optimize → Deploy
Media Extractor → Performance Audit → Optimize Files → Update CDN
```

## Advanced Features

### AI-Powered Content Analysis

**Content Recognition**
- Automatic content categorization
- Scene detection in videos
- Topic extraction from audio
- Document content summarization

**Quality Assessment**
- Automatic quality scoring
- Compression optimization recommendations
- Accessibility compliance checking
- Performance impact analysis

### Real-Time Processing

**Live Stream Analysis**
- Real-time quality monitoring
- Adaptive bitrate analysis
- Viewer engagement tracking
- Performance optimization

**Dynamic Content Handling**
- Progressive media loading
- Lazy extraction for large pages
- Background processing
- Incremental analysis updates

## Performance Considerations

### Extraction Efficiency

| Media Count | Processing Time | Memory Usage | Recommendations |
|-------------|----------------|--------------|-----------------|
| < 10 items | < 5s | < 50MB | Full analysis enabled |
| 10-50 items | 5-30s | 50-200MB | Standard analysis |
| 50-100 items | 30s-2m | 200-500MB | Basic analysis, batch processing |
| > 100 items | > 2m | > 500MB | Selective analysis, streaming |

### Resource Management

**Memory Optimization**
- Streaming analysis for large media collections
- Progressive loading and processing
- Efficient metadata caching
- Garbage collection for processed items

**Network Optimization**
- Intelligent request batching
- Adaptive timeout handling
- Connection pooling for metadata requests
- CDN-aware processing

## Best Practices

### Extraction Strategy
1. **Scope Definition**: Define clear extraction scope and media types
2. **Performance Balance**: Balance analysis depth with processing time
3. **Error Handling**: Handle network errors and inaccessible media gracefully
4. **Progress Tracking**: Provide clear progress indicators for large extractions

### Quality Assurance
1. **Metadata Validation**: Validate extracted metadata for accuracy
2. **Accessibility Checking**: Ensure media meets accessibility standards
3. **Performance Testing**: Test media loading and playback performance
4. **Content Verification**: Verify extracted content matches expectations

### User Experience
1. **Progressive Loading**: Load and display results progressively
2. **Error Feedback**: Provide clear error messages for failed extractions
3. **Preview Generation**: Create previews and thumbnails for media
4. **Batch Operations**: Support efficient batch processing for large collections

## Related Nodes

- **Get All Images**: Extract images as part of media collection
- **Video Processor**: Process extracted video content
- **Audio Analyzer**: Analyze extracted audio content
- **Document Parser**: Parse extracted document content
- **Media Optimizer**: Optimize extracted media files
- **Accessibility Checker**: Check media accessibility compliance