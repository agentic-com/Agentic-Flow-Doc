---
title: Troubleshooting Decision Guide
description: "Systematic approach to diagnosing and resolving common workflow issues with step-by-step decision trees and solutions."
---

This guide provides a systematic approach to troubleshooting workflow issues using decision trees, diagnostic steps, and proven solutions for common problems.

## Quick Diagnostic Checklist

Before diving into detailed troubleshooting, run through this quick checklist:

### ✅ Basic System Check

- [ ] Browser extension is installed and enabled
- [ ] Required permissions are granted
- [ ] Page has finished loading completely
- [ ] No browser console errors visible
- [ ] Workflow nodes are properly connected

### ✅ Workflow Validation

- [ ] All required node parameters are configured
- [ ] Data flow connections are correct
- [ ] No missing or invalid input data
- [ ] Workflow execution permissions are granted

### ✅ Content Accessibility

- [ ] Target content is visible on the page
- [ ] No content security policy blocking access
- [ ] Elements are not in cross-origin iframes
- [ ] Dynamic content has finished loading

## Primary Issue Categories

### 🚫 Workflow Execution Issues

Problems with workflow starting, running, or completing

### 📊 Data Extraction Issues

Problems extracting content from web pages

### 🔗 Node Connection Issues

Problems with data flow between nodes

### ⚡ Performance Issues

Slow execution, timeouts, or resource problems

### 🛡️ Security & Permission Issues

Browser security restrictions or permission problems

## Detailed Troubleshooting Decision Trees

### Decision Tree 1: Workflow Won't Start

```
Workflow doesn't execute when triggered?
│
├── Manual Trigger Workflow
│   ├── Button/trigger not responding?
│   │   ├── Check browser console for JavaScript errors
│   │   ├── Verify extension permissions are granted
│   │   └── Try refreshing page and re-triggering
│   │
│   └── Workflow starts but immediately fails?
│       ├── Check first node configuration
│       ├── Verify required input data is available
│       └── Review node parameter validation
│
└── Automated/Scheduled Workflow
    ├── Timer/trigger not firing?
    │   ├── Verify trigger configuration and timing
    │   ├── Check if browser tab is active/visible
    │   └── Confirm no browser sleep/suspend mode
    │
    └── Trigger fires but workflow fails?
        ├── Check workflow permissions for automated execution
        ├── Verify all required data sources are accessible
        └── Review error logs for specific failure points
```

**Common Solutions**:

| Problem                    | Cause                        | Solution                              |
| -------------------------- | ---------------------------- | ------------------------------------- |
| Extension not responding   | Extension disabled/crashed   | Reload extension or restart browser   |
| Permission denied          | Missing required permissions | Grant permissions in browser settings |
| Workflow validation failed | Invalid node configuration   | Review and fix node parameters        |
| Trigger not firing         | Incorrect trigger setup      | Reconfigure trigger conditions        |

### Decision Tree 2: Data Extraction Failures

```
Cannot extract data from web page?
│
├── Text Extraction Issues
│   ├── No text extracted?
│   │   ├── Page content loaded?
│   │   │   ├── Wait for page load completion
│   │   │   └── Check for dynamic content loading
│   │   │
│   │   ├── Content in iframes?
│   │   │   ├── Cannot access cross-origin iframes
│   │   │   └── Try extracting from parent page
│   │   │
│   │   └── Content security policy blocking?
│   │       ├── Check browser console for CSP errors
│   │       └── Try alternative extraction method
│   │
│   └── Partial/incorrect text extracted?
│       ├── Check CSS selectors and filters
│       ├── Verify text visibility and accessibility
│       └── Review extraction parameters
│
├── HTML Extraction Issues
│   ├── HTML structure missing?
│   │   ├── Verify DOM elements exist
│   │   ├── Check for shadow DOM content
│   │   └── Ensure proper element selection
│   │
│   └── Malformed HTML output?
│       ├── Enable HTML sanitization
│       ├── Check for dynamic content changes
│       └── Verify extraction timing
│
└── Selection-Based Extraction
    ├── No selection detected?
    │   ├── Ensure user has selected text
    │   ├── Check selection API compatibility
    │   └── Verify selection timing
    │
    └── Selection lost during processing?
        ├── Process selection immediately
        ├── Store selection before processing
        └── Handle selection change events
```

**Diagnostic Commands**:

```javascript
// Check if content is accessible
console.log(document.body.innerText.length);

// Verify selection exists
console.log(window.getSelection().toString());

// Check for iframe content
console.log(document.querySelectorAll("iframe").length);

// Test CSS selector
console.log(document.querySelectorAll("your-selector").length);
```

### Decision Tree 3: Node Connection Problems

```
Data not flowing between nodes correctly?
│
├── Connection Configuration
│   ├── Nodes not connected?
│   │   ├── Verify visual connections in workflow editor
│   │   ├── Check connection endpoints match
│   │   └── Ensure proper data flow direction
│   │
│   └── Wrong data type/format?
│       ├── Check output format of source node
│       ├── Verify input requirements of target node
│       └── Add data transformation if needed
│
├── Data Validation Issues
│   ├── Empty data passed?
│   │   ├── Check source node execution success
│   │   ├── Verify data extraction completed
│   │   └── Add validation node to check data
│   │
│   └── Invalid data format?
│       ├── Review data structure requirements
│       ├── Add data formatting/cleaning steps
│       └── Implement error handling for invalid data
│
└── Execution Order Problems
    ├── Nodes executing out of order?
    │   ├── Check dependency relationships
    │   ├── Verify execution flow logic
    │   └── Add explicit wait/sync points
    │
    └── Parallel execution conflicts?
        ├── Identify resource conflicts
        ├── Serialize conflicting operations
        └── Implement proper synchronization
```

**Data Flow Validation**:

```javascript
// Add debug nodes to check data flow
Debug Node Configuration:
- Input: Connect to suspect data flow
- Action: Log data to console
- Output: Pass data through unchanged

// Check data at each step
1. After extraction: Verify content exists
2. After processing: Verify transformation success
3. Before final action: Verify data format
```

### Decision Tree 4: Performance Problems

```
Workflow running slowly or timing out?
│
├── Extraction Performance
│   ├── Large page content?
│   │   ├── Set maximum content length limits
│   │   ├── Use CSS selectors to exclude unnecessary content
│   │   └── Process content in smaller chunks
│   │
│   └── Multiple extractions?
│       ├── Combine extractions where possible
│       ├── Cache extracted content for reuse
│       └── Parallelize independent extractions
│
├── Processing Performance
│   ├── AI/API calls slow?
│   │   ├── Optimize prompts and requests
│   │   ├── Implement caching for repeated requests
│   │   └── Use faster/smaller AI models
│   │
│   └── Data transformation slow?
│       ├── Optimize data processing algorithms
│       ├── Reduce data size before processing
│       └── Use more efficient data structures
│
└── Browser Resource Issues
    ├── Memory usage high?
    │   ├── Clear unused data and references
    │   ├── Process data in smaller batches
    │   └── Implement garbage collection points
    │
    └── CPU usage high?
        ├── Add delays between intensive operations
        ├── Use web workers for heavy processing
        └── Optimize algorithms and reduce complexity
```

**Performance Monitoring**:

```javascript
// Add timing measurements
const startTime = performance.now();
// ... workflow execution ...
const endTime = performance.now();
console.log(`Execution time: ${endTime - startTime}ms`);

// Monitor memory usage
console.log(`Memory usage: ${performance.memory?.usedJSHeapSize || "N/A"}`);

// Check for performance bottlenecks
performance.mark("extraction-start");
// ... extraction code ...
performance.mark("extraction-end");
performance.measure("extraction-time", "extraction-start", "extraction-end");
```

### Decision Tree 5: Security & Permission Issues

```
Security or permission errors?
│
├── Browser Permission Issues
│   ├── "Permission denied" errors?
│   │   ├── Check extension permissions in browser settings
│   │   ├── Verify activeTab permission is granted
│   │   └── Ensure scripting permission is available
│   │
│   └── Cross-origin access blocked?
│       ├── Cannot access different domain content
│       ├── Use alternative data sources
│       └── Implement server-side proxy if needed
│
├── Content Security Policy (CSP)
│   ├── Script injection blocked?
│   │   ├── Check browser console for CSP violations
│   │   ├── Use alternative extraction methods
│   │   └── Request CSP exceptions if possible
│   │
│   └── External resource access blocked?
│       ├── Use local processing instead of external APIs
│       ├── Implement CSP-compliant alternatives
│       └── Cache resources locally when possible
│
└── Site-Specific Restrictions
    ├── Anti-automation measures?
    │   ├── Add delays to mimic human behavior
    │   ├── Rotate user agents and headers
    │   └── Respect robots.txt and rate limits
    │
    └── Login/authentication required?
        ├── Handle authentication flows
        ├── Manage session cookies properly
        └── Implement credential management
```

**Permission Verification**:

```javascript
// Check extension permissions
chrome.permissions.contains(
  {
    permissions: ["activeTab", "scripting"],
  },
  (result) => {
    console.log("Permissions granted:", result);
  }
);

// Test content script injection
chrome.scripting.executeScript({
  target: { tabId: tabId },
  func: () => console.log("Content script injected successfully"),
});
```

## Common Error Messages & Solutions

### "Cannot access contents of URL"

**Cause**: Cross-origin security restriction
**Solutions**:

1. Ensure target page is same-origin or allows access
2. Use activeTab permission for current tab access
3. Implement server-side proxy for cross-origin data

### "Extension context invalidated"

**Cause**: Extension was reloaded or updated during execution
**Solutions**:

1. Reload the page and restart workflow
2. Check for extension updates
3. Implement error recovery in workflow

### "Script injection failed"

**Cause**: Content Security Policy or site restrictions
**Solutions**:

1. Check browser console for specific CSP violations
2. Use alternative extraction methods
3. Try different timing for script injection

### "Selection not found"

**Cause**: No text selected or selection lost
**Solutions**:

1. Ensure user has selected text before workflow execution
2. Add user instructions for text selection
3. Implement selection validation before processing

### "Timeout waiting for response"

**Cause**: Operation taking too long or hanging
**Solutions**:

1. Increase timeout limits in node configuration
2. Optimize processing to reduce execution time
3. Add progress indicators for long operations

## Systematic Debugging Approach

### Step 1: Isolate the Problem

1. **Identify Failure Point**: Determine which node or step is failing
2. **Reproduce Consistently**: Ensure the problem occurs reliably
3. **Simplify Workflow**: Remove non-essential nodes to isolate issue
4. **Test Individual Nodes**: Verify each node works independently

### Step 2: Gather Diagnostic Information

1. **Browser Console**: Check for JavaScript errors and warnings
2. **Network Tab**: Monitor network requests and responses
3. **Extension Logs**: Review extension-specific error messages
4. **Workflow Execution Logs**: Analyze step-by-step execution data

### Step 3: Apply Targeted Solutions

1. **Configuration Fixes**: Correct node parameters and settings
2. **Permission Updates**: Grant necessary browser permissions
3. **Code Modifications**: Adjust workflow logic or timing
4. **Alternative Approaches**: Use different nodes or methods

### Step 4: Validate and Monitor

1. **Test Fix**: Verify the solution resolves the issue
2. **Regression Testing**: Ensure fix doesn't break other functionality
3. **Monitor Performance**: Check for any performance impact
4. **Document Solution**: Record fix for future reference

## Prevention Strategies

### Robust Workflow Design

1. **Input Validation**: Always validate data before processing
2. **Error Handling**: Implement comprehensive error handling
3. **Fallback Options**: Provide alternative approaches for failures
4. **Progress Monitoring**: Track workflow execution progress

### Performance Optimization

1. **Resource Management**: Monitor and limit resource usage
2. **Caching**: Cache frequently accessed data and results
3. **Batch Processing**: Group operations for efficiency
4. **Lazy Loading**: Load data only when needed

### Security Best Practices

1. **Minimal Permissions**: Request only necessary permissions
2. **Data Sanitization**: Clean and validate all input data
3. **Secure Communication**: Use HTTPS for external communications
4. **Privacy Protection**: Handle user data responsibly

## Advanced Troubleshooting Tools

### Browser Developer Tools

```javascript
// Enable verbose logging
localStorage.setItem("debug", "true");

// Monitor performance
performance.mark("workflow-start");
// ... workflow execution ...
performance.mark("workflow-end");
performance.measure("workflow-duration", "workflow-start", "workflow-end");

// Check memory leaks
const observer = new PerformanceObserver((list) => {
  console.log("Performance entries:", list.getEntries());
});
observer.observe({ entryTypes: ["measure", "navigation"] });
```

### Extension Debugging

```javascript
// Background script debugging
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);
  // Handle debugging messages
});

// Content script debugging
window.addEventListener("error", (event) => {
  console.error("Content script error:", event.error);
});
```

### Network Monitoring

```javascript
// Monitor fetch requests
const originalFetch = window.fetch;
window.fetch = function (...args) {
  console.log("Fetch request:", args);
  return originalFetch.apply(this, args).then((response) => {
    console.log("Fetch response:", response);
    return response;
  });
};
```

## Getting Additional Help

### Documentation Resources

- **[Node Reference](/integration/)** - Complete node documentation
- **[Workflow Patterns](/learning/workflow-patterns/)** - Proven workflow designs
- **[Performance Guide](/learning/workflow-patterns/optimization-best-practices/)** - Optimization techniques

### Community Support

- **[Help & Community](/usage/help-and-community/help/)** - Get assistance from community
- **[Contributing](/usage/help-and-community/contributing/)** - Report bugs and contribute fixes
- **GitHub Issues**: Report technical issues and bugs

### Professional Support

- **Enterprise Support**: Available for business users
- **Custom Development**: Professional workflow development services
- **Training Programs**: Comprehensive training for teams

## Related Resources

### Troubleshooting Guides

- **[AI Troubleshooting](/advanced-ai/troubleshooting-guide/)** - AI-specific issues
- **[Performance Optimization](/learning/workflow-patterns/optimization-best-practices/)** - Performance problems
- **[Workflow Debugging](/learning/text-courses/intermediate/workflow-debugging/)** - General debugging techniques

### Best Practices

- **[Security Best Practices](/usage/licenses-and-privacy/privacy-security/security/)** - Security guidelines
- **[Performance Best Practices](/learning/workflow-patterns/optimization-best-practices/)** - Performance optimization
- **[Workflow Design Patterns](/learning/workflow-patterns/)** - Proven design approaches
