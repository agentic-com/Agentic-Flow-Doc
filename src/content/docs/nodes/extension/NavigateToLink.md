---
title: Navigate to Link
description: "Automatically go to different web pages in your workflow to collect data from multiple sources or continue processes across sites."
---

# Navigate to Link

**What it does:** Automatically navigates to different web pages during your workflow, allowing you to collect data from multiple sources or continue processes across different sites.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Target URL | String | The web address to navigate to | Yes | `""` |
| Navigation Method | String | Where to open: `current-tab`, `new-tab`, `new-window` | No | `current-tab` |
| Wait for Load | Boolean | Wait for page to fully load before continuing | No | `true` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| success | Boolean | Whether navigation was successful |
| finalUrl | String | The final URL after any redirects |
| pageTitle | String | Title of the loaded page |
| loadTime | Number | How long the page took to load (milliseconds) |

## Real-World Examples

**Multi-Site Price Comparison**
Navigate to different e-commerce sites to compare prices for the same product automatically.

**Research Data Collection**
Visit multiple news sources or research sites to gather information on a specific topic.

**Social Media Management**
Navigate between different social platforms to post content or check engagement metrics.

## How to Use It

1. **Set the target URL** - Enter the web address you want to visit
2. **Choose navigation method** - Current tab, new tab, or new window
3. **Run the workflow** - The node navigates to the URL and waits for it to load
4. **Continue processing** - Your workflow continues on the new page

**Simple Example:**
```json
{
  "targetUrl": "https://example.com/products",
  "navigationMethod": "current-tab",
  "waitForLoad": true
}
```

<details>
<summary>🔍 Technical Details</summary>

**Navigation Methods:**
- **Current Tab:** Replaces the current page (like clicking a link)
- **New Tab:** Opens in a new browser tab (keeps original page open)
- **New Window:** Opens in a completely new browser window

**Wait Options:**
- **Wait for Load:** Ensures the page is fully loaded before continuing
- **Wait for Element:** Waits for a specific element to appear (useful for dynamic content)

**Error Handling:** The node automatically retries failed navigation and can use fallback URLs if the primary URL doesn't work.

</details>

## Try It Yourself

**Product Research Workflow:**
1. Start on a product search page
2. Navigate to individual product pages
3. Extract product details and prices
4. Compare across multiple sites

**News Monitoring:**
1. Navigate to different news websites
2. Extract headlines and articles
3. Analyze sentiment and trends
4. Generate daily news summary

**Job Application Process:**
1. Navigate to job listing sites
2. Open individual job postings
3. Extract job requirements
4. Navigate to application forms and fill them

**Common Issues:**
- **Page won't load?** Check the URL is correct and the site is accessible
- **Workflow stops after navigation?** Make sure "Wait for Load" is enabled
- **Getting blocked?** Some sites block automated browsing - try using "new-tab" method

## What's Next?

- **[Get All Links](./GetAllLinks.md)** - Extract links from pages to navigate to
- **[Form Filler](./FormFiller.md)** - Fill out forms on the pages you navigate to
- **[Get All Text](./GetAllText.md)** - Extract content from pages after navigation