---
title: Link Analyzer
description: "Analyze links on webpages to understand site structure, find SEO opportunities, and discover content relationships."
---

# Link Analyzer

**What it does:** Analyzes all the links on a webpage to help you understand site structure, find SEO opportunities, and discover how content is connected.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Link Data | Array | Links to analyze (from Get All Links) | Yes | `[]` |
| Analysis Depth | String | How detailed: `basic`, `standard`, `comprehensive` | No | `standard` |
| Include SEO Analysis | Boolean | Analyze links for SEO opportunities | No | `true` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| linkQuality | Object | Overall quality score and recommendations |
| patterns | Object | Common patterns found in the links |
| seoInsights | Object | SEO opportunities and issues |
| brokenLinks | Array | Links that don't work anymore |

## Real-World Examples

**SEO Audit**
Analyze your website's internal linking structure to find opportunities for better search engine rankings.

**Competitor Research**
Study how competitors organize their content and what external sites they link to for partnership ideas.

**Content Strategy**
Discover which pages are well-connected and which might need more internal links to improve user navigation.

## How to Use It

1. **Get links first** - Use Get All Links to extract links from a webpage
2. **Connect to Link Analyzer** - Feed the extracted links into this node
3. **Choose analysis depth** - Pick how detailed you want the analysis
4. **Review insights** - Get actionable recommendations for improvement

**Simple Example:**
```json
{
  "linkData": [], // From Get All Links node
  "analysisDepth": "standard",
  "includeSEOAnalysis": true
}
```

<details>
<summary>🔍 Technical Details</summary>

**What it analyzes:**
- Link quality and authority scores
- Internal vs external link ratios
- Anchor text optimization opportunities
- Broken or problematic links
- Link patterns and relationships

**SEO Insights:**
- Internal linking opportunities
- Anchor text diversity
- Link authority distribution
- Navigation structure analysis

**Performance:**
- Can analyze up to 1000 links efficiently
- Larger datasets may take longer
- Uses caching to speed up repeated analysis

**Limitations:**
- Requires links from Get All Links node first
- Cannot analyze links that require login
- Some social media links may be restricted

</details>

## Try It Yourself

**Basic SEO Check:**
```json
{
  "analysisDepth": "basic",
  "includeSEOAnalysis": true
}
```

**Comprehensive Site Audit:**
```json
{
  "analysisDepth": "comprehensive",
  "includeSEOAnalysis": true
}
```

**Quick Link Health Check:**
```json
{
  "analysisDepth": "basic",
  "includeSEOAnalysis": false
}
```

**Common Issues:**
- **No analysis results?** Make sure you're feeding link data from Get All Links first
- **Analysis taking too long?** Try "basic" depth for faster results
- **Missing SEO insights?** Enable SEO analysis in the settings

## What's Next?

- **[Get All Links](./GetAllLinks.md)** - Extract links to analyze
- **[Navigate to Link](./NavigateToLink.md)** - Visit the links you've analyzed
- **[Content Replacer](./ContentReplacer.md)** - Fix issues found in the analysis