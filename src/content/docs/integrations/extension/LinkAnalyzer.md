---
title: Link Analyzer
description: "Analyze link patterns and extract metadata using Agentic Workflow Studio browser extension for comprehensive link intelligence and SEO insights."
---

The **Link Analyzer** node provides advanced analysis of link patterns, metadata extraction, and comprehensive link intelligence for SEO optimization, content strategy, and competitive analysis workflows.

## How it Works

This node takes link data (from Get All Links or other sources) and performs deep analysis including pattern recognition, metadata extraction, quality assessment, SEO evaluation, and relationship mapping to provide actionable insights about link structures and strategies.

## Browser API Details

The node leverages multiple browser APIs for comprehensive link analysis:

### Core APIs Used

**URL Analysis API**
- `URL()`: Parse and analyze URL components
- `URLSearchParams()`: Analyze query parameters and tracking
- `fetch()`: Retrieve link metadata and headers
- `Response.headers`: Extract HTTP headers and metadata

**DOM Analysis API**
- `Document.querySelector()`: Analyze link context and placement
- `Element.getBoundingClientRect()`: Analyze link positioning
- `getComputedStyle()`: Analyze link styling and visibility
- `IntersectionObserver`: Monitor link visibility and engagement

**Network Analysis API**
- `Performance.getEntriesByType()`: Analyze navigation and resource timing
- `Navigator.connection`: Analyze network conditions affecting links
- `fetch()` with timing: Measure link response times and performance

**Content Analysis API**
- `TextEncoder/TextDecoder`: Analyze text content and encoding
- `DOMParser`: Parse and analyze linked content
- `MutationObserver`: Monitor dynamic link changes

### Required Permissions

| Permission | Purpose | Scope |
|------------|---------|-------|
| `activeTab` | Access current tab for link analysis | Current tab only |
| `scripting` | Inject analysis scripts | Active tab content |
| `storage` | Cache analysis results and patterns | Extension storage |
| `host_permissions` | Access external links for metadata | Specified domains |

## Configuration

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Link Data** | Array/Object | Yes | `[]` | Link data to analyze (from Get All Links or manual input) |
| **Analysis Depth** | String | No | `comprehensive` | Analysis depth: `basic`, `standard`, `comprehensive`, `deep` |
| **Include Metadata** | Boolean | No | `true` | Extract metadata from linked pages |
| **Pattern Detection** | Boolean | No | `true` | Detect and analyze link patterns |
| **Quality Assessment** | Boolean | No | `true` | Assess link quality and relevance |
| **SEO Analysis** | Boolean | No | `true` | Perform SEO-focused link analysis |

### Analysis Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Analyze Anchor Text** | Boolean | No | `true` | Analyze anchor text patterns and quality |
| **Analyze URL Structure** | Boolean | No | `true` | Analyze URL patterns and structure |
| **Analyze Link Context** | Boolean | No | `true` | Analyze surrounding content and context |
| **Analyze Link Relationships** | Boolean | No | `true` | Map relationships between links |
| **Analyze Temporal Patterns** | Boolean | No | `false` | Analyze link patterns over time |
| **Analyze User Behavior** | Boolean | No | `false` | Analyze user interaction with links |

### Metadata Extraction Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Extract Page Titles** | Boolean | No | `true` | Extract titles from linked pages |
| **Extract Meta Descriptions** | Boolean | No | `true` | Extract meta descriptions |
| **Extract Open Graph Data** | Boolean | No | `true` | Extract Open Graph metadata |
| **Extract Schema Markup** | Boolean | No | `true` | Extract structured data |
| **Extract Social Signals** | Boolean | No | `false` | Extract social media engagement data |
| **Extract Performance Metrics** | Boolean | No | `false` | Extract page performance data |

### Pattern Analysis Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Domain Clustering** | Boolean | No | `true` | Group and analyze links by domain |
| **Path Pattern Analysis** | Boolean | No | `true` | Analyze URL path patterns |
| **Parameter Pattern Analysis** | Boolean | No | `true` | Analyze URL parameter patterns |
| **Anchor Text Clustering** | Boolean | No | `true` | Group similar anchor text patterns |
| **Temporal Pattern Analysis** | Boolean | No | `false` | Analyze patterns over time |
| **Hierarchical Analysis** | Boolean | No | `true` | Analyze link hierarchy and structure |

### Quality Assessment Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Authority Assessment** | Boolean | No | `true` | Assess domain and page authority |
| **Relevance Scoring** | Boolean | No | `true` | Score link relevance to content |
| **Trust Signals** | Boolean | No | `true` | Analyze trust indicators |
| **Spam Detection** | Boolean | No | `true` | Detect potential spam or low-quality links |
| **Broken Link Detection** | Boolean | No | `true` | Identify broken or problematic links |
| **Duplicate Detection** | Boolean | No | `true` | Find duplicate or near-duplicate links |

### Performance Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Concurrent Requests** | Number | No | `5` | Maximum concurrent metadata requests |
| **Request Timeout** | Number | No | `10000` | Timeout for metadata requests (milliseconds) |
| **Cache Duration** | Number | No | `3600000` | Cache analysis results (milliseconds) |
| **Batch Size** | Number | No | `50` | Links to process per batch |
| **Rate Limiting** | Boolean | No | `true` | Enable rate limiting for external requests |

## Usage Examples

### Comprehensive SEO Link Analysis

Analyze all links for SEO optimization opportunities:

```javascript
// Configuration for SEO analysis
{
  "linkData": [], // From Get All Links node
  "analysisDepth": "comprehensive",
  "seoAnalysis": true,
  "qualityAssessment": true,
  "patternDetection": true,
  "extractPageTitles": true,
  "extractMetaDescriptions": true
}

// Output includes:
// - Link authority scores
// - Anchor text optimization suggestions
// - Internal linking opportunities
// - External link quality assessment
// - SEO compliance issues and recommendations
```

### Competitive Link Strategy Analysis

Analyze competitor link patterns and strategies:

```javascript
// Configuration for competitive analysis
{
  "linkData": [], // Links from competitor pages
  "analysisDepth": "deep",
  "domainClustering": true,
  "anchorTextClustering": true,
  "authorityAssessment": true,
  "extractSocialSignals": true,
  "temporalPatternAnalysis": true
}

// Workflow: Competitor pages → Get All Links → Link Analyzer → Strategy insights
// 1. Extract links from competitor pages
// 2. Analyze linking patterns and strategies
// 3. Identify high-value link targets
// 4. Generate competitive intelligence report
```

### Content Strategy Link Analysis

Analyze internal linking for content strategy optimization:

```javascript
// Configuration for content strategy
{
  "linkData": [], // Internal links only
  "analysisDepth": "standard",
  "analyzeUrlStructure": true,
  "analyzeLinkContext": true,
  "hierarchicalAnalysis": true,
  "relevanceScoring": true,
  "pathPatternAnalysis": true
}

// Output provides:
// - Content hub identification
// - Internal linking gaps
// - Content relationship mapping
// - Navigation optimization suggestions
```

### Link Quality Audit

Comprehensive audit of link quality and health:

```javascript
// Configuration for quality audit
{
  "linkData": [], // All site links
  "analysisDepth": "comprehensive",
  "qualityAssessment": true,
  "brokenLinkDetection": true,
  "spamDetection": true,
  "duplicateDetection": true,
  "trustSignals": true,
  "extractPerformanceMetrics": true
}

// Workflow: Site crawl → Link extraction → Quality audit → Cleanup recommendations
// 1. Extract all links from site
// 2. Analyze quality and health
// 3. Identify issues and opportunities
// 4. Generate cleanup and optimization plan
```

### Link Pattern Discovery

Discover and analyze link patterns for insights:

```javascript
// Configuration for pattern discovery
{
  "linkData": [], // Large dataset of links
  "analysisDepth": "deep",
  "patternDetection": true,
  "domainClustering": true,
  "pathPatternAnalysis": true,
  "parameterPatternAnalysis": true,
  "anchorTextClustering": true,
  "temporalPatternAnalysis": true
}

// Output includes:
// - Common linking patterns
// - Emerging trends
// - Anomaly detection
// - Pattern-based recommendations
```

### Social Media Link Analysis

Analyze social media and sharing patterns:

```javascript
// Configuration for social analysis
{
  "linkData": [], // Social media links
  "analysisDepth": "standard",
  "extractSocialSignals": true,
  "extractOpenGraphData": true,
  "analyzeUserBehavior": true,
  "temporalPatternAnalysis": true,
  "qualityAssessment": true
}

// Workflow: Social links → Analyze engagement → Optimize sharing strategy
// 1. Extract social media links and shares
// 2. Analyze engagement patterns
// 3. Identify high-performing content
// 4. Optimize social sharing strategy
```

## Output Data Structure

### Comprehensive Analysis Output

```json
{
  "summary": {
    "totalLinks": 245,
    "analyzedLinks": 240,
    "failedAnalysis": 5,
    "processingTime": 45000,
    "analysisDepth": "comprehensive",
    "cacheHitRate": 0.65
  },
  "patterns": {
    "domains": {
      "totalUniqueDomains": 45,
      "topDomains": [
        {
          "domain": "example.com",
          "count": 23,
          "authority": 85,
          "trustScore": 0.92,
          "categories": ["reference", "authority"],
          "avgResponseTime": 245
        }
      ],
      "domainClusters": [
        {
          "cluster": "news-media",
          "domains": ["cnn.com", "bbc.com", "reuters.com"],
          "commonCharacteristics": ["high-authority", "news-content"]
        }
      ]
    },
    "urlStructure": {
      "commonPaths": ["/about", "/contact", "/blog"],
      "pathDepthDistribution": {"1": 45, "2": 89, "3": 67},
      "parameterPatterns": [
        {
          "parameter": "utm_source",
          "frequency": 34,
          "values": ["google", "facebook", "twitter"]
        }
      ],
      "fileTypeDistribution": {"html": 180, "pdf": 25, "jpg": 40}
    },
    "anchorText": {
      "totalUniqueTexts": 156,
      "commonPatterns": [
        {
          "pattern": "read more",
          "frequency": 23,
          "quality": "poor",
          "recommendation": "Use descriptive text"
        }
      ],
      "lengthDistribution": {"1-10": 45, "11-30": 89, "31-50": 67},
      "qualityScore": 0.73,
      "semanticClusters": [
        {
          "cluster": "navigation",
          "texts": ["home", "about", "contact"],
          "purpose": "site-navigation"
        }
      ]
    }
  },
  "quality": {
    "overallScore": 0.82,
    "factors": {
      "authorityScore": 0.85,
      "relevanceScore": 0.78,
      "trustScore": 0.89,
      "diversityScore": 0.76,
      "freshnessScore": 0.82
    },
    "issues": [
      {
        "type": "broken-links",
        "severity": "high",
        "count": 5,
        "links": ["https://broken.example.com", "..."],
        "recommendation": "Fix or remove broken links"
      },
      {
        "type": "generic-anchor-text",
        "severity": "medium",
        "count": 23,
        "examples": ["click here", "read more"],
        "recommendation": "Use descriptive anchor text"
      }
    ],
    "opportunities": [
      {
        "type": "internal-linking",
        "description": "Add internal links to improve content connectivity",
        "impact": "medium",
        "effort": "low"
      }
    ]
  },
  "seo": {
    "score": 0.79,
    "factors": {
      "internalLinkingScore": 0.82,
      "externalLinkQuality": 0.85,
      "anchorTextOptimization": 0.73,
      "linkDiversity": 0.76,
      "followVsNofollow": 0.88
    },
    "recommendations": [
      {
        "category": "internal-linking",
        "priority": "high",
        "description": "Improve internal linking structure",
        "actions": [
          "Add contextual internal links",
          "Create topic clusters",
          "Optimize anchor text diversity"
        ]
      }
    ],
    "compliance": {
      "googleGuidelines": "good",
      "bestPractices": "needs-improvement",
      "technicalSeo": "excellent"
    }
  },
  "metadata": {
    "extractedPages": 156,
    "successRate": 0.89,
    "avgExtractionTime": 1250,
    "pageData": [
      {
        "url": "https://example.com/page",
        "title": "Page Title",
        "description": "Meta description",
        "openGraph": {
          "title": "OG Title",
          "description": "OG Description",
          "image": "https://example.com/og-image.jpg"
        },
        "schema": [
          {"@type": "Article", "headline": "Article Title"}
        ],
        "performance": {
          "loadTime": 1200,
          "firstContentfulPaint": 800,
          "cumulativeLayoutShift": 0.05
        },
        "socialSignals": {
          "shares": 245,
          "likes": 1200,
          "comments": 89
        }
      }
    ]
  },
  "relationships": {
    "linkGraph": {
      "nodes": 245,
      "edges": 389,
      "clusters": 12,
      "centralityScores": {
        "homepage": 0.95,
        "about": 0.67,
        "contact": 0.45
      }
    },
    "contentHubs": [
      {
        "hub": "blog-section",
        "pages": 45,
        "internalLinks": 123,
        "authority": 0.78,
        "topics": ["technology", "innovation"]
      }
    ],
    "orphanPages": [
      {
        "url": "https://example.com/orphan",
        "inboundLinks": 0,
        "recommendation": "Add internal links or remove page"
      }
    ]
  },
  "temporal": {
    "linkAgeDistribution": {"0-30d": 23, "31-90d": 45, "91-365d": 89},
    "growthTrends": {
      "newLinksPerMonth": 12,
      "lostLinksPerMonth": 3,
      "netGrowth": 9
    },
    "seasonalPatterns": [
      {
        "period": "holiday-season",
        "linkingIncrease": 0.34,
        "topCategories": ["shopping", "gifts"]
      }
    ]
  },
  "competitive": {
    "benchmarks": {
      "industryAverage": {
        "linksPerPage": 25,
        "externalLinkRatio": 0.15,
        "authorityScore": 0.65
      },
      "topCompetitors": [
        {
          "competitor": "competitor1.com",
          "linkingStrategy": "content-focused",
          "strengths": ["high-authority-links", "diverse-anchor-text"],
          "opportunities": ["internal-linking", "social-signals"]
        }
      ]
    },
    "gapAnalysis": {
      "missingLinkTargets": ["authority-site1.com", "industry-leader.com"],
      "underutilizedOpportunities": ["guest-posting", "resource-pages"],
      "competitiveAdvantages": ["unique-content-links", "brand-mentions"]
    }
  },
  "recommendations": {
    "immediate": [
      {
        "action": "Fix broken links",
        "priority": "critical",
        "effort": "low",
        "impact": "high",
        "timeline": "1-2 days"
      }
    ],
    "shortTerm": [
      {
        "action": "Optimize anchor text",
        "priority": "high",
        "effort": "medium",
        "impact": "medium",
        "timeline": "1-2 weeks"
      }
    ],
    "longTerm": [
      {
        "action": "Build authority links",
        "priority": "medium",
        "effort": "high",
        "impact": "high",
        "timeline": "3-6 months"
      }
    ]
  },
  "analysisMetadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "2.1.0",
    "processingTime": 45000,
    "cacheUtilization": 0.65,
    "apiCallsMade": 156,
    "dataFreshness": "2024-01-15T09:00:00Z"
  }
}
```

## Integration Patterns

### With SEO Optimization Workflows

```javascript
// Pattern: Link extraction → Analysis → Optimization → Monitoring
Get All Links → Link Analyzer → Optimize Links → Monitor Performance
```

### With Competitive Intelligence

```javascript
// Pattern: Competitor research → Link analysis → Strategy development
Crawl Competitors → Extract Links → Link Analyzer → Strategy Report
```

### With Content Strategy

```javascript
// Pattern: Content audit → Link analysis → Content planning
Content Audit → Link Analyzer → Identify Gaps → Plan Content
```

### With Link Building Campaigns

```javascript
// Pattern: Opportunity identification → Outreach → Monitoring
Link Analyzer → Identify Targets → Outreach Campaign → Track Results
```

## Advanced Analysis Features

### Machine Learning Integration

**Pattern Recognition**
- Automatic detection of linking patterns
- Anomaly detection for unusual link behavior
- Predictive modeling for link performance
- Clustering algorithms for link categorization

**Natural Language Processing**
- Semantic analysis of anchor text
- Content relevance scoring
- Topic modeling for link context
- Sentiment analysis of linked content

### Real-Time Monitoring

**Link Health Monitoring**
- Continuous broken link detection
- Performance degradation alerts
- Authority score changes
- Competitive link monitoring

**Trend Analysis**
- Emerging link patterns
- Industry trend identification
- Seasonal pattern recognition
- Competitive movement tracking

## Performance Optimization

### Analysis Speed

| Link Count | Analysis Time | Memory Usage | Recommendations |
|------------|---------------|--------------|-----------------|
| < 100 | < 5s | Low | Full analysis enabled |
| 100-500 | 5-30s | Moderate | Standard analysis |
| 500-1000 | 30s-2m | High | Basic analysis, batch processing |
| > 1000 | > 2m | Very High | Selective analysis, caching |

### Resource Management

**Memory Optimization**
- Streaming analysis for large datasets
- Garbage collection for processed data
- Efficient data structures for pattern storage
- Progressive analysis with intermediate results

**Network Optimization**
- Intelligent request batching
- Adaptive rate limiting
- Connection pooling for metadata extraction
- CDN utilization for common data

## Best Practices

### Analysis Strategy
1. **Scope Definition**: Clearly define analysis scope and objectives
2. **Data Quality**: Ensure high-quality input data for accurate analysis
3. **Performance Balance**: Balance analysis depth with processing time
4. **Result Validation**: Validate analysis results with manual spot checks

### Implementation
1. **Incremental Analysis**: Process large datasets incrementally
2. **Caching Strategy**: Implement intelligent caching for repeated analysis
3. **Error Handling**: Handle network errors and data inconsistencies gracefully
4. **Progress Tracking**: Provide clear progress indicators for long analyses

### Actionability
1. **Prioritized Recommendations**: Provide actionable, prioritized recommendations
2. **Impact Assessment**: Quantify potential impact of recommended actions
3. **Implementation Guidance**: Provide clear guidance for implementing recommendations
4. **Success Metrics**: Define measurable success criteria for improvements

## Related Nodes

- **Get All Links**: Extract links for analysis input
- **HTTP Request**: Validate links and extract metadata
- **Content Analyzer**: Analyze linked content quality
- **SEO Analyzer**: Comprehensive SEO analysis including links
- **Competitive Analyzer**: Compare link strategies across competitors
- **Report Generator**: Create comprehensive link analysis reports