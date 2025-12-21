---
title: Data Extraction Problems
description: "Troubleshoot content extraction failures, missing data, and formatting issues with step-by-step diagnostic solutions."
---

# Data Extraction Problems

Content extraction is the foundation of most workflows. When extraction fails, your entire workflow stops working. This guide helps you diagnose and fix common extraction issues.

## 🔍 Quick Extraction Diagnostics

**Test these immediately:**
- 🔍 **Check if content exists** - View page source to confirm data is present
- 🔍 **Wait for page load** - Ensure dynamic content has finished loading
- 🔍 **Test CSS selectors** - Use browser console to verify selectors work
- 🔍 **Check for iframes** - Content might be in embedded frames
- 🔍 **Verify element visibility** - Hidden elements may not be extractable

## 📊 Common Extraction Failures

### No Data Extracted

#### Content Not Found

**Symptoms:**
- Extraction returns empty results
- "No elements found" errors
- Workflow completes but with no data

**Diagnostic table:**

| Possible Cause | How to Check | Solution |
|----------------|--------------|----------|
| Wrong CSS selector | Test in browser console | Update selector to match actual elements |
| Content in iframe | Check for `<iframe>` tags | Extract from iframe or parent page |
| Dynamic content loading | Wait and check again | Add delays or wait for specific elements |
| Content hidden by CSS | Check `display` and `visibility` | Use different extraction method |
| JavaScript-generated content | Disable JavaScript and check | Wait for JS execution or use different approach |

**CSS selector testing:**
```javascript
// Test your selector in browser console
const elements = document.querySelectorAll('your-selector-here');
console.log(`Found ${elements.length} elements`);
console.log('First element:', elements[0]);

// Check element content
if (elements.length > 0) {
  console.log('Text content:', elements[0].textContent);
  console.log('HTML content:', elements[0].innerHTML);
}
```

#### Dynamic Content Issues

**Common dynamic content patterns:**

| Content Type | Loading Method | Detection | Solution |
|--------------|----------------|-----------|----------|
| AJAX content | XMLHttpRequest/fetch | Network tab shows requests | Wait for requests to complete |
| Infinite scroll | Scroll-triggered loading | Content appears on scroll | Scroll to trigger loading |
| Lazy images | Intersection Observer | Images load when visible | Scroll to make images visible |
| Single Page Apps | JavaScript routing | URL changes without reload | Wait for route change completion |

**Wait for dynamic content:**
```javascript
// Wait for specific element to appear
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations) => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

// Usage
waitForElement('.dynamic-content').then(element => {
  console.log('Dynamic content loaded:', element);
});
```

### Partial Data Extraction

#### Missing Some Elements

**Symptoms:**
- Only some items extracted from a list
- Inconsistent extraction results
- Random missing data

**Common causes and fixes:**

| Problem | Cause | Solution |
|---------|-------|----------|
| Pagination | Content split across pages | Extract from all pages or use infinite scroll |
| Lazy loading | Content loads on demand | Scroll or trigger loading before extraction |
| Rate limiting | Site blocks rapid requests | Add delays between extractions |
| Inconsistent HTML | Different structure for some items | Use more flexible selectors |

**Handle pagination:**
```javascript
// Extract from multiple pages
async function extractFromAllPages(baseSelector) {
  let allData = [];
  let currentPage = 1;

  while (true) {
    // Extract from current page
    const pageData = Array.from(document.querySelectorAll(baseSelector))
      .map(el => el.textContent.trim());

    if (pageData.length === 0) {
      break; // No more data
    }

    allData.push(...pageData);

    // Try to go to next page
    const nextButton = document.querySelector('.next-page, .pagination-next');
    if (!nextButton || nextButton.disabled) {
      break; // No more pages
    }

    nextButton.click();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for page load
    currentPage++;
  }

  return allData;
}
```

### Incorrect Data Format

#### Malformed or Unexpected Data

**Symptoms:**
- Extracted data contains HTML tags
- Text includes unwanted whitespace or characters
- Numbers extracted as text strings
- Dates in wrong format

**Data cleaning solutions:**

| Issue | Example | Solution |
|-------|---------|----------|
| HTML tags in text | `"<span>Price: $19.99</span>"` | Use `.textContent` instead of `.innerHTML` |
| Extra whitespace | `"  Product Name  \n"` | Use `.trim()` and normalize whitespace |
| Mixed content | `"Price: $19.99 (was $29.99)"` | Use regex to extract specific parts |
| Encoded characters | `"Caf&eacute; Menu"` | Decode HTML entities |

**Data cleaning functions:**
```javascript
// Clean extracted text
function cleanText(text) {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .trim(); // Remove leading/trailing whitespace
}

// Extract and clean prices
function extractPrice(element) {
  const text = element.textContent;
  const priceMatch = text.match(/\$?(\d+(?:\.\d{2})?)/);
  return priceMatch ? parseFloat(priceMatch[1]) : null;
}

// Extract and parse dates
function extractDate(element) {
  const text = element.textContent;
  const date = new Date(text);
  return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
}
```

## 🛠️ Advanced Extraction Techniques

### Handling Complex Page Structures

#### Shadow DOM Content

**Problem:** Content inside Shadow DOM is not accessible with regular selectors.

**Detection:**
```javascript
// Check for Shadow DOM
const elementsWithShadow = document.querySelectorAll('*');
const shadowHosts = Array.from(elementsWithShadow)
  .filter(el => el.shadowRoot);

console.log('Elements with Shadow DOM:', shadowHosts);
```

**Solution:**
```javascript
// Extract from Shadow DOM
function extractFromShadowDOM(hostSelector, contentSelector) {
  const host = document.querySelector(hostSelector);
  if (!host || !host.shadowRoot) {
    return null;
  }

  return host.shadowRoot.querySelector(contentSelector);
}
```

#### Cross-Origin Iframes

**Problem:** Cannot access content in iframes from different domains.

**Detection:**
```javascript
// Check for cross-origin iframes
const iframes = document.querySelectorAll('iframe');
iframes.forEach((iframe, index) => {
  try {
    const doc = iframe.contentDocument;
    console.log(`Iframe ${index}: Accessible`);
  } catch (e) {
    console.log(`Iframe ${index}: Cross-origin (blocked)`);
  }
});
```

**Workarounds:**
- Extract from parent page instead
- Use postMessage API if iframe cooperates
- Use server-side extraction for cross-origin content

### Site-Specific Extraction Challenges

#### Single Page Applications (SPAs)

**Common SPA frameworks and their challenges:**

| Framework | Challenge | Solution |
|-----------|-----------|----------|
| React | Virtual DOM updates | Wait for component mounting |
| Vue.js | Reactive data binding | Wait for data to load |
| Angular | Zone.js async operations | Wait for zone stabilization |
| Svelte | Compiled components | Wait for DOM updates |

**SPA extraction strategy:**
```javascript
// Wait for SPA to stabilize
async function waitForSPAReady() {
  // Wait for common SPA indicators
  await Promise.race([
    waitForElement('[data-reactroot]'), // React
    waitForElement('[data-server-rendered]'), // Vue
    waitForElement('app-root'), // Angular
    new Promise(resolve => setTimeout(resolve, 5000)) // Fallback timeout
  ]);

  // Additional wait for content to load
  await new Promise(resolve => setTimeout(resolve, 2000));
}
```

#### E-commerce Sites

**Common e-commerce extraction challenges:**

| Site Type | Challenge | Solution |
|-----------|-----------|----------|
| Amazon | Anti-bot measures | Use delays, vary selectors |
| eBay | Dynamic pricing | Extract multiple times |
| Shopify stores | Varied themes | Use flexible selectors |
| Custom stores | Unique structures | Analyze each site individually |

**E-commerce extraction patterns:**
```javascript
// Flexible product extraction
function extractProductInfo() {
  const selectors = {
    title: [
      'h1.product-title',
      '.product-name h1',
      '[data-testid="product-title"]',
      'h1' // Fallback
    ],
    price: [
      '.price-current',
      '.product-price',
      '[data-testid="price"]',
      '.price'
    ]
  };

  function findBySelectors(selectorList) {
    for (const selector of selectorList) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
    return null;
  }

  return {
    title: findBySelectors(selectors.title)?.textContent?.trim(),
    price: findBySelectors(selectors.price)?.textContent?.trim()
  };
}
```

## 🔧 Extraction Debugging Tools

### Browser Console Debugging

**Element inspection:**
```javascript
// Comprehensive element analysis
function analyzeElement(selector) {
  const elements = document.querySelectorAll(selector);

  console.log(`Selector: ${selector}`);
  console.log(`Found: ${elements.length} elements`);

  elements.forEach((el, index) => {
    console.log(`Element ${index}:`, {
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      textContent: el.textContent?.substring(0, 100) + '...',
      innerHTML: el.innerHTML?.substring(0, 100) + '...',
      attributes: Object.fromEntries(
        Array.from(el.attributes).map(attr => [attr.name, attr.value])
      ),
      computedStyle: {
        display: getComputedStyle(el).display,
        visibility: getComputedStyle(el).visibility,
        opacity: getComputedStyle(el).opacity
      }
    });
  });
}

// Usage
analyzeElement('.product-price');
```

### Selector Testing Tool

**Interactive selector tester:**
```javascript
// Test multiple selectors
function testSelectors(selectors) {
  const results = {};

  selectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      results[selector] = {
        count: elements.length,
        firstElement: elements[0] ? {
          text: elements[0].textContent?.trim().substring(0, 50),
          tag: elements[0].tagName
        } : null,
        success: elements.length > 0
      };
    } catch (e) {
      results[selector] = {
        error: e.message,
        success: false
      };
    }
  });

  console.table(results);
  return results;
}

// Test multiple price selectors
testSelectors([
  '.price',
  '.product-price',
  '[data-price]',
  '.price-current',
  '.sale-price'
]);
```

### Page Analysis Tool

**Comprehensive page analysis:**
```javascript
// Analyze page structure for extraction opportunities
function analyzePage() {
  const analysis = {
    url: window.location.href,
    title: document.title,
    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,

    // Content analysis
    content: {
      totalElements: document.querySelectorAll('*').length,
      textNodes: document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      ),
      images: document.querySelectorAll('img').length,
      links: document.querySelectorAll('a').length
    },

    // Structure analysis
    structure: {
      hasIframes: document.querySelectorAll('iframe').length > 0,
      hasShadowDOM: Array.from(document.querySelectorAll('*'))
        .some(el => el.shadowRoot),
      frameworks: {
        react: !!document.querySelector('[data-reactroot]'),
        vue: !!document.querySelector('[data-server-rendered]'),
        angular: !!document.querySelector('app-root')
      }
    },

    // Common extraction targets
    commonSelectors: {
      headings: document.querySelectorAll('h1, h2, h3').length,
      paragraphs: document.querySelectorAll('p').length,
      lists: document.querySelectorAll('ul, ol').length,
      tables: document.querySelectorAll('table').length,
      forms: document.querySelectorAll('form').length
    }
  };

  console.log('Page Analysis:', analysis);
  return analysis;
}
```

## 📋 Extraction Best Practices

### Robust Selector Strategies

**Selector priority order:**
1. 🎯 **Semantic selectors** - `[data-testid="price"]`, `[aria-label="product-name"]`
2. 🎯 **Stable class names** - `.product-title`, `.price-display`
3. 🟡 **ID selectors** - `#product-price` (if stable)
4. 🟡 **Structural selectors** - `.product-info > .price`
5. 🔴 **Generic selectors** - `h1`, `.text` (use as last resort)

**Fallback selector chains:**
```javascript
// Use multiple selectors as fallbacks
function robustExtraction(selectorChain, attribute = 'textContent') {
  for (const selector of selectorChain) {
    const element = document.querySelector(selector);
    if (element && element[attribute]) {
      return element[attribute].trim();
    }
  }
  return null;
}

// Example usage
const productTitle = robustExtraction([
  '[data-testid="product-title"]',
  '.product-name h1',
  'h1.title',
  'h1'
]);
```

### Error Handling and Recovery

**Graceful failure handling:**
```javascript
// Extraction with error handling
function safeExtraction(selector, options = {}) {
  const {
    attribute = 'textContent',
    timeout = 5000,
    retries = 3,
    fallbackSelectors = []
  } = options;

  async function attemptExtraction(sel) {
    try {
      const element = await waitForElement(sel, timeout);
      const value = element[attribute];

      if (!value || value.trim() === '') {
        throw new Error('Empty value extracted');
      }

      return value.trim();
    } catch (e) {
      console.warn(`Extraction failed for ${sel}:`, e.message);
      return null;
    }
  }

  async function extractWithRetries() {
    const allSelectors = [selector, ...fallbackSelectors];

    for (const sel of allSelectors) {
      for (let attempt = 1; attempt <= retries; attempt++) {
        const result = await attemptExtraction(sel);
        if (result) {
          return { success: true, data: result, selector: sel, attempt };
        }

        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    return { success: false, data: null, error: 'All extraction attempts failed' };
  }

  return extractWithRetries();
}
```

### Performance-Optimized Extraction

**Efficient extraction patterns:**
```javascript
// Batch extraction for multiple similar elements
function batchExtraction(containerSelector, itemSelector, dataExtractors) {
  const containers = document.querySelectorAll(containerSelector);
  const results = [];

  containers.forEach((container, index) => {
    const item = {};

    // Extract all data points for this item
    Object.entries(dataExtractors).forEach(([key, extractor]) => {
      try {
        if (typeof extractor === 'string') {
          // Simple selector
          const element = container.querySelector(extractor);
          item[key] = element ? element.textContent.trim() : null;
        } else if (typeof extractor === 'function') {
          // Custom extraction function
          item[key] = extractor(container);
        }
      } catch (e) {
        console.warn(`Failed to extract ${key} for item ${index}:`, e);
        item[key] = null;
      }
    });

    results.push(item);
  });

  return results;
}

// Example: Extract product listings
const products = batchExtraction('.product-item', null, {
  title: '.product-title',
  price: '.price',
  rating: (container) => {
    const stars = container.querySelectorAll('.star.filled').length;
    return stars > 0 ? stars : null;
  },
  availability: '.stock-status'
});
```

## 🆘 When Extraction Still Fails

### Alternative Approaches

**If standard extraction doesn't work:**

| Problem | Alternative Method |
|---------|-------------------|
| Content in Shadow DOM | Use browser automation tools |
| Cross-origin iframes | Server-side extraction |
| Heavy JavaScript sites | Headless browser extraction |
| Anti-bot protection | Manual extraction with user interaction |
| Dynamic content | Real-time monitoring and extraction |

### Escalation and Support

**Before seeking help:**
1. **Document the issue** with screenshots and error messages
2. **Test on multiple similar sites** to identify patterns
3. **Try different browsers** to isolate browser-specific issues
4. **Check if the site structure has changed** recently

**Information to include in support requests:**
- Target website URL
- Specific content you're trying to extract
- CSS selectors you've tried
- Error messages or unexpected results
- Browser and extension version
- Screenshots of the target content