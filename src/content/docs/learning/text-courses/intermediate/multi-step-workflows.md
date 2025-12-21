---
title: "Multi-Step Workflow Integration"
description: "Build complex workflows combining text extraction, processing, and external API integration with real-world examples."
difficulty: "🚀 intermediate"
---

# Multi-Step Workflow Integration

Learn to build sophisticated workflows that combine browser content extraction with external API processing. This tutorial demonstrates how to create multi-step automation that processes web data and integrates with external services.

## What You'll Build

In this tutorial, you'll create a comprehensive workflow that:
- Extracts product information from e-commerce pages
- Processes and validates the extracted data
- Integrates with external APIs for price comparison
- Generates formatted reports with recommendations
- Handles errors and edge cases gracefully

## Prerequisites

- Completed all [Beginner Tutorials](/learning/text-courses/beginner/)
- Understanding of REST APIs and JSON data
- Basic knowledge of data validation concepts
- Familiarity with HTTP requests and responses

## Learning Objectives

By the end of this tutorial, you'll understand:
- How to design complex multi-step workflows
- Integration patterns for external APIs
- Data validation and error handling strategies
- Performance optimization for complex workflows
- Real-world automation patterns

## Workflow Architecture Overview

### Complete Workflow Structure

```
Trigger → Extract Product Data → Validate Data → API Integration → Generate Report
   ↓              ↓                   ↓              ↓              ↓
WhenStarted → GetAllText → EditFields → Filter → HTTP Request → EditFields → DownloadAsFile
                ↓              ↓         ↓           ↓              ↓
           GetAllImages → EditFields → Merge → Error Handler → Format Data
```

### Data Flow Design

**Stage 1: Content Extraction**
- Extract product names, prices, descriptions
- Collect product images and metadata
- Gather page context and source information

**Stage 2: Data Processing**
- Clean and normalize extracted data
- Validate data completeness and accuracy
- Merge multiple data sources

**Stage 3: External Integration**
- Query price comparison APIs
- Fetch additional product information
- Validate external data responses

**Stage 4: Report Generation**
- Combine internal and external data
- Format results for human consumption
- Generate downloadable reports

## Step 1: Design the Workflow Foundation

### Creating the Base Structure

1. **Create New Workflow**
   - Name: "Product Analysis Pipeline"
   - Category: "Intermediate Tutorials"
   - Description: "Multi-step product data extraction and analysis"

2. **Add Core Nodes**
   ```
   WhenStarted (Trigger)
   GetAllText (Content Extraction)
   GetAllImages (Image Extraction)
   EditFields (Data Processing) x3
   Filter (Data Validation)
   HTTP Request (API Integration)
   Merge (Data Combination)
   DownloadAsFile (Output)
   ```

3. **Plan Data Structure**
   ```javascript
   // Target data structure throughout workflow:
   {
     "product": {
       "name": "Product Name",
       "price": "$99.99",
       "description": "Product description...",
       "images": ["url1", "url2"],
       "source": "https://example-store.com/product"
     },
     "analysis": {
       "extractedAt": "2024-01-15T10:30:45.123Z",
       "dataQuality": "high",
       "completeness": 95
     },
     "comparison": {
       "averagePrice": "$89.99",
       "priceRank": "above-average",
       "competitors": [...]
     }
   }
   ```

## Step 2: Implement Content Extraction

### Configure Product Data Extraction

**GetAllText Node Configuration:**
```json
{
  "nodeName": "Extract Product Text",
  "settings": {
    "includeHidden": false,
    "preserveFormatting": true,
    "excludeElements": ["nav", "footer", "aside", ".advertisement"],
    "focusSelectors": [".product-info", ".product-details", ".price"]
  }
}
```

**GetAllImages Node Configuration:**
```json
{
  "nodeName": "Extract Product Images",
  "settings": {
    "includeDataUrls": false,
    "minWidth": 100,
    "minHeight": 100,
    "excludeSelectors": [".thumbnail", ".icon", ".logo"],
    "includeAltText": true
  }
}
```

### Process Extracted Content

**EditFields Node 1 - Text Processing:**
```json
{
  "nodeName": "Process Product Text",
  "operations": [
    {
      "field": "productName",
      "action": "extract",
      "pattern": "(?i)(product|item)\\s*:?\\s*([^\\n]+)",
      "group": 2
    },
    {
      "field": "price",
      "action": "extract",
      "pattern": "\\$[0-9,]+\\.?[0-9]*",
      "multiple": false
    },
    {
      "field": "description",
      "action": "extract",
      "pattern": "(?i)description\\s*:?\\s*([^\\n]{50,500})",
      "group": 1
    },
    {
      "field": "extractedAt",
      "action": "set",
      "value": "{{new Date().toISOString()}}"
    }
  ]
}
```

**EditFields Node 2 - Image Processing:**
```json
{
  "nodeName": "Process Product Images",
  "operations": [
    {
      "field": "productImages",
      "action": "filter",
      "conditions": [
        {"property": "src", "operator": "not_contains", "value": "logo"},
        {"property": "width", "operator": "greater_than", "value": 200}
      ]
    },
    {
      "field": "primaryImage",
      "action": "select",
      "criteria": "largest",
      "fallback": "first"
    },
    {
      "field": "imageCount",
      "action": "count",
      "source": "productImages"
    }
  ]
}
```

## Step 3: Implement Data Validation

### Quality Assurance Filter

**Filter Node Configuration:**
```json
{
  "nodeName": "Validate Product Data",
  "conditions": [
    {
      "field": "productName",
      "operator": "not_empty",
      "required": true,
      "errorMessage": "Product name is required"
    },
    {
      "field": "price",
      "operator": "matches",
      "pattern": "\\$[0-9,]+\\.?[0-9]*",
      "required": true,
      "errorMessage": "Valid price is required"
    },
    {
      "field": "description",
      "operator": "min_length",
      "value": 20,
      "required": false,
      "errorMessage": "Description too short"
    }
  ],
  "onFailure": "continue_with_warning",
  "logFailures": true
}
```

### Data Enrichment

**EditFields Node 3 - Data Enhancement:**
```json
{
  "nodeName": "Enrich Product Data",
  "operations": [
    {
      "field": "priceNumeric",
      "action": "convert",
      "source": "price",
      "type": "number",
      "removeChars": ["$", ","]
    },
    {
      "field": "category",
      "action": "classify",
      "rules": [
        {"keywords": ["laptop", "computer"], "category": "electronics"},
        {"keywords": ["shirt", "pants", "dress"], "category": "clothing"},
        {"keywords": ["book", "novel"], "category": "books"}
      ],
      "fallback": "general"
    },
    {
      "field": "dataQuality",
      "action": "calculate",
      "expression": "{{($json.productName ? 30 : 0) + ($json.price ? 30 : 0) + ($json.description ? 25 : 0) + ($json.primaryImage ? 15 : 0)}}"
    }
  ]
}
```

## Step 4: External API Integration

### Price Comparison API

**HTTP Request Node Configuration:**
```json
{
  "nodeName": "Price Comparison API",
  "method": "POST",
  "url": "https://api.pricecomparison.com/v1/search",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer {{$env.PRICE_API_KEY}}"
  },
  "body": {
    "query": "{{$json.productName}}",
    "category": "{{$json.category}}",
    "priceRange": {
      "min": "{{Math.max(0, $json.priceNumeric * 0.7)}}",
      "max": "{{$json.priceNumeric * 1.3}}"
    },
    "limit": 10
  },
  "timeout": 10000,
  "retries": 2
}
```

### API Response Processing

**EditFields Node 4 - API Data Processing:**
```json
{
  "nodeName": "Process API Response",
  "operations": [
    {
      "field": "competitorPrices",
      "action": "extract",
      "source": "response.results",
      "mapping": {
        "price": "price",
        "store": "store_name",
        "url": "product_url"
      }
    },
    {
      "field": "averagePrice",
      "action": "calculate",
      "expression": "{{$json.competitorPrices.reduce((sum, item) => sum + item.price, 0) / $json.competitorPrices.length}}"
    },
    {
      "field": "priceRank",
      "action": "classify",
      "rules": [
        {"condition": "$json.priceNumeric < $json.averagePrice * 0.9", "value": "below-average"},
        {"condition": "$json.priceNumeric > $json.averagePrice * 1.1", "value": "above-average"},
        {"default": true, "value": "average"}
      ]
    },
    {
      "field": "savings",
      "action": "calculate",
      "expression": "{{Math.max(0, $json.averagePrice - $json.priceNumeric)}}"
    }
  ]
}
```

## Step 5: Error Handling and Resilience

### Comprehensive Error Handling

**Error Handler Node (IF Node):**
```json
{
  "nodeName": "Handle API Errors",
  "conditions": [
    {
      "field": "response.status",
      "operator": "not_equals",
      "value": 200
    }
  ],
  "onTrue": {
    "action": "set_fallback_data",
    "data": {
      "competitorPrices": [],
      "averagePrice": null,
      "priceRank": "unknown",
      "apiError": true,
      "errorMessage": "Price comparison service unavailable"
    }
  },
  "onFalse": {
    "action": "continue"
  }
}
```

### Retry Logic Implementation

**Custom Retry Pattern:**
```javascript
// Implemented in HTTP Request node settings:
{
  "retryConfig": {
    "maxRetries": 3,
    "retryDelay": 1000,
    "backoffMultiplier": 2,
    "retryOn": [500, 502, 503, 504],
    "timeoutRetry": true
  }
}
```

## Step 6: Data Merging and Final Processing

### Combine All Data Sources

**Merge Node Configuration:**
```json
{
  "nodeName": "Combine All Data",
  "mergeStrategy": "deep_merge",
  "inputs": [
    {
      "source": "product_data",
      "priority": 1
    },
    {
      "source": "api_data",
      "priority": 2
    },
    {
      "source": "enrichment_data",
      "priority": 3
    }
  ],
  "conflictResolution": "highest_priority"
}
```

### Generate Final Report

**EditFields Node 5 - Report Generation:**
```json
{
  "nodeName": "Generate Report",
  "operations": [
    {
      "field": "report",
      "action": "template",
      "template": {
        "productAnalysis": {
          "name": "{{$json.productName}}",
          "currentPrice": "{{$json.price}}",
          "dataQuality": "{{$json.dataQuality}}%",
          "category": "{{$json.category}}"
        },
        "marketComparison": {
          "averageMarketPrice": "{{$json.averagePrice ? '$' + $json.averagePrice.toFixed(2) : 'N/A'}}",
          "pricePosition": "{{$json.priceRank}}",
          "potentialSavings": "{{$json.savings ? '$' + $json.savings.toFixed(2) : '$0.00'}}",
          "competitorCount": "{{$json.competitorPrices.length}}"
        },
        "recommendations": "{{$json.priceRank === 'below-average' ? 'Good deal - price is below market average' : $json.priceRank === 'above-average' ? 'Consider shopping around - price is above market average' : 'Price is in line with market average'}}"
      }
    },
    {
      "field": "metadata",
      "action": "set",
      "value": {
        "generatedAt": "{{new Date().toISOString()}}",
        "workflowVersion": "1.0",
        "processingTime": "{{Date.now() - $json.startTime}}ms"
      }
    }
  ]
}
```

## Step 7: Testing and Optimization

### Comprehensive Testing Strategy

**Test Case 1: E-commerce Product Page**
1. Navigate to Amazon, eBay, or similar product page
2. Execute workflow and verify data extraction
3. Check API integration and response processing
4. Validate final report generation

**Test Case 2: Error Scenarios**
1. Test with invalid product pages
2. Simulate API failures (disconnect internet)
3. Test with pages missing key information
4. Verify error handling and fallback data

**Test Case 3: Performance Testing**
1. Measure execution time for complete workflow
2. Test with different product categories
3. Monitor memory usage during execution
4. Verify timeout handling

### Performance Optimization

**Optimization Strategies:**

1. **Parallel Processing:**
   ```javascript
   // Configure nodes to run in parallel where possible:
   GetAllText + GetAllImages → Process simultaneously
   ```

2. **Caching Strategy:**
   ```json
   {
     "cacheConfig": {
       "enableCache": true,
       "cacheDuration": 300000, // 5 minutes
       "cacheKey": "{{$json.productName}}_{{$json.source}}"
     }
   }
   ```

3. **Resource Management:**
   ```json
   {
     "resourceLimits": {
       "maxConcurrentRequests": 3,
       "requestTimeout": 10000,
       "maxRetries": 2
     }
   }
   ```

## Step 8: Advanced Integration Patterns

### Pattern 1: Conditional API Calls

**Smart API Usage:**
```json
{
  "nodeName": "Conditional Price Check",
  "condition": "{{$json.priceNumeric > 50 && $json.dataQuality > 70}}",
  "onTrue": "call_price_api",
  "onFalse": "skip_api_call"
}
```

### Pattern 2: Data Transformation Pipeline

**Multi-Stage Processing:**
```
Raw Data → Clean → Validate → Enrich → Normalize → Output
```

### Pattern 3: Fallback Chains

**Resilient Data Sources:**
```javascript
// Primary API → Secondary API → Local Processing → Manual Fallback
{
  "fallbackChain": [
    {"source": "primary_api", "timeout": 5000},
    {"source": "secondary_api", "timeout": 10000},
    {"source": "local_processing", "timeout": 2000},
    {"source": "manual_fallback", "data": "default_values"}
  ]
}
```

## Real-World Applications

### E-commerce Price Monitoring

**Use Case:** Monitor product prices across multiple retailers

**Workflow Adaptations:**
- Schedule regular execution
- Store historical price data
- Send alerts for price changes
- Generate trend reports

### Content Research Pipeline

**Use Case:** Research and analyze web content for market intelligence

**Workflow Adaptations:**
- Extract competitor information
- Analyze content quality and SEO
- Generate competitive analysis reports
- Track content changes over time

### Lead Generation Automation

**Use Case:** Extract and qualify leads from business directories

**Workflow Adaptations:**
- Extract contact information
- Validate business data through APIs
- Score lead quality
- Export to CRM systems

## Troubleshooting Complex Workflows

### Common Issues and Solutions

**Issue 1: API Rate Limiting**
```javascript
// Solution: Implement rate limiting
{
  "rateLimiting": {
    "requestsPerMinute": 60,
    "burstLimit": 10,
    "backoffStrategy": "exponential"
  }
}
```

**Issue 2: Data Inconsistency**
```javascript
// Solution: Data validation at each stage
{
  "validation": {
    "required": ["productName", "price"],
    "types": {"priceNumeric": "number"},
    "ranges": {"dataQuality": [0, 100]}
  }
}
```

**Issue 3: Memory Usage**
```javascript
// Solution: Stream processing for large datasets
{
  "processing": {
    "mode": "stream",
    "batchSize": 100,
    "memoryLimit": "512MB"
  }
}
```

## Best Practices Summary

### Workflow Design
- **Modular Architecture:** Break complex workflows into reusable components
- **Error Boundaries:** Implement error handling at each critical stage
- **Data Validation:** Validate data at input, processing, and output stages
- **Performance Monitoring:** Track execution time and resource usage

### API Integration
- **Authentication Security:** Store API keys securely in environment variables
- **Rate Limiting:** Respect API rate limits and implement backoff strategies
- **Error Handling:** Handle API failures gracefully with fallback options
- **Data Transformation:** Normalize API responses to consistent formats

### Testing and Maintenance
- **Comprehensive Testing:** Test all workflow paths and error scenarios
- **Documentation:** Document workflow logic and configuration decisions
- **Version Control:** Track workflow changes and maintain version history
- **Monitoring:** Implement logging and monitoring for production workflows

## Next Steps

You've now mastered multi-step workflow integration! You're ready to:

1. **[Learn Workflow Debugging](/learning/text-courses/intermediate/workflow-debugging/)** - Advanced debugging and troubleshooting techniques
2. **[Explore Performance Optimization](/learning/text-courses/intermediate/performance-optimization/)** - Optimize complex workflows for speed and efficiency
3. **[Build Advanced AI Workflows](/learning/text-courses/advanced/ai-powered-analysis/)** - Integrate AI processing into multi-step workflows

## Additional Resources

- **[HTTP Request Node Documentation](/integration/builtin/core/Http-Request/)** - Complete API integration guide
- **[Error Handling Patterns](/usage/key-concepts/flow-logic/error-handling/)** - Advanced error handling strategies
- **[Workflow Performance Guide](/learning/examples/web-automation-patterns/)** - Performance optimization techniques

---

**Estimated Time:** 60-75 minutes
**Difficulty:** Intermediate
**Prerequisites:** Completed beginner tutorials, basic API knowledge