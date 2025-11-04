---
title: "Extract Product Prices from E-commerce Sites"
description: "Learn to automatically collect product prices from shopping websites in just 5 minutes"
template: doc
difficulty: "🌱 beginner"
time: "5 min"
tags: ["ecommerce", "data-extraction", "automation", "quick-win"]
---

# Extract Product Prices from E-commerce Sites

## What You'll Build

In 5 minutes, you'll create a workflow that automatically extracts product prices from any e-commerce website. Perfect for price monitoring, comparison shopping, or market research.

**⏱️ Time**: 5 minutes  
**🎯 Difficulty**: Beginner  
**✅ Result**: Working price extraction workflow

## Why This Matters

- **Save Time**: No more manual price checking across multiple sites
- **Stay Competitive**: Monitor competitor pricing automatically  
- **Make Better Decisions**: Track price trends to find the best deals
- **Scale Your Research**: Extract prices from hundreds of products quickly

## What Goes In, What Comes Out

| Input | Output |
|-------|--------|
| Product page URL | Clean price data with currency |
| Website to monitor | Structured price information |

**Example**: `https://shop.example.com/laptop` → `$1,299.99 USD`

## Step-by-Step Guide

### Step 1: Set Up Your Workflow

1. Open Agentic Workflow Studio in your browser
2. Create a new workflow and name it "Price Extractor"
3. Add these nodes to your canvas:
   - **Get All Text From Link** (for extracting page content)
   - **Edit Fields** (for cleaning price data)
   - **Download as File** (for saving results)

```mermaid
flowchart LR
    A[🌐 Product URL] --> B[📝 Get All Text]
    B --> C[✂️ Edit Fields]
    C --> D[💾 Save Results]
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#f3e5f5
```

### Step 2: Configure Text Extraction

**Get All Text From Link Node Settings:**
- **URL**: Enter your target product page
- **Text Filters**: Add `.navigation, .footer, .reviews` to focus on product info
- **Wait for Load**: Enable to catch dynamic pricing

**✅ You should see**: Raw text content from the product page

### Step 3: Extract and Clean Price Data

**Edit Fields Node Configuration:**
```json
{
  "operations": [
    {
      "field": "text",
      "operation": "extract_regex",
      "pattern": "\\$[0-9,]+\\.?[0-9]*",
      "output_field": "price"
    }
  ]
}
```

**✅ You should see**: Clean price like `$1,299.99`

### Step 4: Save Your Results

**Download as File Node:**
- **Format**: CSV or JSON
- **Filename**: `prices_{{date}}.csv`
- **Include timestamp**: Yes

## Real-World Example

**Target**: Amazon laptop listing  
**Input URL**: `https://amazon.com/laptop-example`  
**Extracted Price**: `$1,299.99`  
**Processing Time**: 3 seconds

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No price found | Check if site uses dynamic loading - increase timeout |
| Wrong price extracted | Adjust regex pattern for site's price format |
| Access blocked | Some sites block automation - try different approach |

## What's Next?

Ready to level up your price monitoring? Try these tutorials:

- **[Monitor Competitor Prices](monitor-competitor-prices)** - Set up automated price tracking
- **[Automate Form Filling](automate-form-filling)** - Speed up repetitive data entry
- **[Build a Price Monitoring System](/usage/how-to/build-price-monitoring-system)** - Complete project guide

## Copy-Paste Ready Workflow

```json
{
  "workflow": {
    "name": "Price Extractor",
    "nodes": [
      {
        "type": "GetAllTextFromLink",
        "config": {
          "textFilters": [".navigation", ".footer", ".reviews"],
          "waitForLoad": true,
          "timeout": 15000
        }
      },
      {
        "type": "EditFields", 
        "config": {
          "operations": [{
            "field": "text",
            "operation": "extract_regex", 
            "pattern": "\\$[0-9,]+\\.?[0-9]*",
            "output_field": "price"
          }]
        }
      },
      {
        "type": "DownloadAsFile",
        "config": {
          "format": "csv",
          "filename": "prices_{{date}}.csv"
        }
      }
    ]
  }
}
```

---

**💡 Pro Tip**: Start with one product page to test your workflow, then scale to multiple URLs using a URL list input.