---
title: Data Processing Patterns
description: Proven patterns for extracting, transforming, and processing different types of data from web sources
---

# Data Processing Patterns

Data processing is the backbone of effective browser automation workflows. This guide covers comprehensive patterns for handling various data types and transformation scenarios.

## Text Processing Pattern

### Overview
Extract, clean, and transform textual content from web pages with advanced processing capabilities.

### Use Cases
- Article content extraction and cleaning
- Comment and review processing
- Social media text analysis
- Document content extraction

### Implementation

#### Workflow Structure
```
[GetAllText] → [EditFields] → [Filter] → [Transform] → [Output]
```

#### Step-by-Step Implementation

1. **Text Extraction with Context**
   ```javascript
   // GetAllText node configuration
   {
     "selector": "article, .content, .post-body",
     "preserveFormatting": true,
     "includeMetadata": true,
     "excludeSelectors": [".ads", ".sidebar", ".comments"]
   }
   ```

2. **Text Cleaning and Normalization**
   ```javascript
   // EditFields node - text processing
   {
     "operations": [
       {
         "field": "content",
         "operation": "clean",
         "rules": [
           "removeExtraWhitespace",
           "removeSpecialChars",
           "normalizeLineBreaks"
         ]
       },
       {
         "field": "wordCount",
         "operation": "calculate",
         "formula": "content.split(' ').length"
       }
     ]
   }
   ```

3. **Content Analysis**
   ```javascript
   // Advanced text processing
   {
     "operations": [
       {
         "field": "keywords",
         "operation": "extract",
         "pattern": "\\b[A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*\\b",
         "limit": 10
       },
       {
         "field": "sentiment",
         "operation": "analyze",
         "type": "sentiment"
       }
     ]
   }
   ```

### Expected Output
```json
{
  "content": "Clean, processed article content...",
  "wordCount": 1250,
  "keywords": ["Technology", "Innovation", "Future"],
  "sentiment": "positive",
  "metadata": {
    "extractedAt": "2024-01-15T10:30:00Z",
    "source": "https://example.com/article"
  }
}
```

## Structured Data Extraction Pattern

### Overview
Parse and extract structured data from tables, lists, forms, and other organized content.

### Use Cases
- Financial data tables
- Product specification lists
- Directory information
- Form data extraction

### Implementation

#### Workflow Structure
```
[GetAllHTML] → [ProcessHTML] → [ParseStructure] → [Validate] → [Output]
```

#### Step-by-Step Implementation

1. **HTML Structure Extraction**
   ```javascript
   // GetAllHTML with structure preservation
   {
     "selector": "table, .data-grid, .spec-list",
     "preserveStructure": true,
     "includeAttributes": ["class", "id", "data-*"]
   }
   ```

2. **Table Processing**
   ```javascript
   // ProcessHTML for table data
   {
     "tableProcessing": {
       "headerRow": 0,
       "skipRows": [],
       "columnMapping": {
         "0": "product_name",
         "1": "price", 
         "2": "availability",
         "3": "rating"
       },
       "dataTypes": {
         "price": "currency",
         "rating": "number",
         "availability": "boolean"
       }
     }
   }
   ```

3. **List Structure Processing**
   ```javascript
   // ProcessHTML for list data
   {
     "listProcessing": {
       "itemSelector": "li, .list-item",
       "extractionRules": [
         {
           "field": "title",
           "selector": ".item-title, h3"
         },
         {
           "field": "description",
           "selector": ".item-desc, p"
         },
         {
           "field": "metadata",
           "selector": ".item-meta",
           "parseAs": "keyValue"
         }
       ]
     }
   }
   ```

### Data Validation
```javascript
// Validation rules
{
  "validationRules": [
    {
      "field": "price",
      "type": "number",
      "min": 0,
      "required": true
    },
    {
      "field": "email",
      "type": "email",
      "pattern": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
    }
  ]
}
```

## Media Processing Pattern

### Overview
Extract, process, and analyze images, videos, and other media content from web pages.

### Use Cases
- Image gallery extraction
- Video metadata collection
- Media file processing
- Visual content analysis

### Implementation

#### Workflow Structure
```
[GetAllImages] → [ImageProcessor] → [MediaExtractor] → [Analysis] → [Output]
```

#### Step-by-Step Implementation

1. **Image Collection**
   ```javascript
   // GetAllImages with filtering
   {
     "selector": "img, picture source",
     "minWidth": 200,
     "minHeight": 200,
     "excludeTypes": ["svg", "gif"],
     "includeMetadata": true
   }
   ```

2. **Image Processing**
   ```javascript
   // ImageProcessor configuration
   {
     "operations": [
       {
         "type": "resize",
         "width": 800,
         "height": 600,
         "maintainAspect": true
       },
       {
         "type": "format",
         "outputFormat": "webp",
         "quality": 85
       },
       {
         "type": "analyze",
         "extractColors": true,
         "detectObjects": true
       }
     ]
   }
   ```

3. **Media Metadata Extraction**
   ```javascript
   // MediaExtractor for comprehensive metadata
   {
     "extractionTypes": [
       "dimensions",
       "fileSize",
       "format",
       "colorProfile",
       "exifData"
     ],
     "analysisOptions": {
       "detectFaces": true,
       "extractText": true,
       "classifyContent": true
     }
   }
   ```

### Expected Output
```json
{
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "processedUrl": "data:image/webp;base64,UklGRiIAAABXRUJQVlA4...",
      "metadata": {
        "width": 800,
        "height": 600,
        "format": "webp",
        "size": 45678,
        "colors": ["#FF5733", "#33FF57", "#3357FF"],
        "objects": ["person", "car", "building"]
      }
    }
  ]
}
```

## Real-time Data Streaming Pattern

### Overview
Process continuous data feeds and real-time updates from dynamic web sources.

### Use Cases
- Live chat monitoring
- Stock price tracking
- Social media feeds
- Real-time notifications

### Implementation

#### Workflow Structure
```
[Monitor] → [Detect Changes] → [Extract Delta] → [Process] → [Stream Output]
```

#### Step-by-Step Implementation

1. **Change Detection Setup**
   ```javascript
   // Monitor configuration
   {
     "watchSelector": ".live-data, .feed-item",
     "pollInterval": 5000,
     "changeDetection": "content",
     "maxItems": 100
   }
   ```

2. **Delta Processing**
   ```javascript
   // Process only new/changed content
   {
     "deltaProcessing": {
       "trackBy": "id",
       "compareFields": ["content", "timestamp"],
       "onNew": "process",
       "onChange": "update",
       "onDelete": "archive"
     }
   }
   ```

3. **Stream Processing**
   ```javascript
   // Real-time data processing
   {
     "streamConfig": {
       "bufferSize": 50,
       "flushInterval": 10000,
       "processingMode": "batch",
       "errorHandling": "continue"
     }
   }
   ```

## Advanced Data Transformation Patterns

### Data Aggregation
```javascript
// Aggregate extracted data
{
  "aggregations": [
    {
      "field": "price",
      "operations": ["min", "max", "avg", "sum"]
    },
    {
      "field": "category",
      "operation": "groupBy",
      "subAggregations": ["count", "avg:price"]
    }
  ]
}
```

### Data Enrichment
```javascript
// Enrich data with external sources
{
  "enrichmentRules": [
    {
      "field": "location",
      "source": "geocoding_api",
      "mapping": {
        "input": "address",
        "output": ["latitude", "longitude", "timezone"]
      }
    }
  ]
}
```

### Data Normalization
```javascript
// Normalize data formats
{
  "normalizationRules": [
    {
      "field": "date",
      "inputFormat": "MM/DD/YYYY",
      "outputFormat": "ISO8601"
    },
    {
      "field": "currency",
      "baseCurrency": "USD",
      "conversionAPI": "exchange_rates_api"
    }
  ]
}
```

## Performance Optimization

### Batch Processing
- Process data in chunks to manage memory usage
- Implement parallel processing for independent operations
- Use streaming for large datasets

### Caching Strategies
- Cache processed results to avoid recomputation
- Implement intelligent cache invalidation
- Use persistent storage for long-term caching

### Memory Management
- Clean up temporary data regularly
- Use efficient data structures
- Implement garbage collection triggers

## Error Handling and Recovery

### Data Validation
- Implement comprehensive validation rules
- Handle malformed data gracefully
- Provide detailed error reporting

### Recovery Strategies
- Implement automatic retry mechanisms
- Provide fallback processing methods
- Maintain processing state for recovery

### Quality Assurance
- Monitor data quality metrics
- Implement anomaly detection
- Provide data quality reports