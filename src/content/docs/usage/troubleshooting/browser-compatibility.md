---
title: Browser Compatibility Problems
description: "Solve browser-specific issues, version conflicts, and compatibility problems that prevent workflows from running properly."
---

# Browser Compatibility Problems

Different browsers and versions can cause workflow execution issues. This guide helps you identify and fix browser-specific problems.

## 🌐 Supported Browsers

| Browser | Minimum Version | Status | Notes |
|---------|----------------|--------|-------|
| Chrome | 88+ | ✅ Fully Supported | Recommended browser |
| Edge | 88+ | ✅ Fully Supported | Chromium-based versions |
| Firefox | 78+ | ⚠️ Limited Support | Some features may not work |
| Safari | 14+ | ❌ Not Supported | WebExtensions limitations |

## 🔍 Common Browser Issues

### Chrome/Edge Issues

#### Extension Not Loading

**Symptoms:**
- Extension icon not visible in toolbar
- No workflow options in right-click menu
- Extension appears disabled

**Solutions:**

| Problem | Cause | Fix |
|---------|-------|-----|
| Extension disabled | User accidentally disabled | Go to `chrome://extensions/` → Enable extension |
| Extension crashed | Memory or code error | Click "Reload" in extension management |
| Outdated version | Old extension version | Update from Chrome Web Store |
| Developer mode conflict | Multiple versions installed | Remove duplicate extensions |

**Step-by-step fix:**
1. Open `chrome://extensions/` in address bar
2. Find "Agentic Workflow Studio" in the list
3. Ensure the toggle switch is **ON** (blue)
4. If not visible, click "Load unpacked" for developer versions
5. Refresh the page where you want to use workflows

#### Manifest V3 Issues

**Symptoms:**
- "Service worker inactive" errors
- Workflows start but don't complete
- Intermittent connection failures

**Solutions:**
```javascript
// Check service worker status
chrome.runtime.getBackgroundPage((backgroundPage) => {
  if (backgroundPage) {
    console.log("Service worker active");
  } else {
    console.log("Service worker inactive - reload extension");
  }
});
```

**Quick fixes:**
1. **Reload extension**: Go to `chrome://extensions/` → Click reload button
2. **Restart browser**: Close all Chrome windows and restart
3. **Clear extension data**: Remove and reinstall extension
4. **Check for updates**: Ensure you have the latest version

### Firefox Issues

#### Limited WebExtensions Support

**Symptoms:**
- Some nodes don't work as expected
- Content script injection failures
- Cross-origin access denied

**Workarounds:**

| Feature | Chrome Behavior | Firefox Limitation | Workaround |
|---------|----------------|-------------------|------------|
| Content Scripts | Full access | Restricted CSP | Use alternative extraction methods |
| Cross-Origin | Configurable | Strict policy | Process data on same domain |
| File Downloads | Direct download | Permission required | Manual download trigger |

**Firefox-specific settings:**
1. Open `about:config` in Firefox
2. Search for `extensions.webextensions.restrictedDomains`
3. Remove restricted domains if needed (advanced users only)
4. Restart Firefox

#### Content Security Policy Conflicts

**Symptoms:**
- "Content Security Policy" errors in console
- Scripts fail to inject
- Workflows stop at extraction nodes

**Solutions:**
1. **Check console errors**: Look for specific CSP violations
2. **Use alternative methods**: Try different extraction approaches
3. **Disable strict CSP**: Use Firefox developer tools to bypass (testing only)

### Safari Issues

#### WebExtensions Not Supported

**Current Status:** Safari uses a different extension system that's not compatible with Chrome-style WebExtensions.

**Alternatives:**
- **Use Chrome or Edge**: Recommended for full functionality
- **Web-based version**: Use browser-based workflow builder (if available)
- **Mobile alternatives**: iOS shortcuts app for basic automation

## 🛠️ Diagnostic Tools

### Browser Console Debugging

**Check Extension Status:**
```javascript
// Verify extension is loaded
if (typeof chrome !== 'undefined' && chrome.runtime) {
  console.log('Extension loaded:', chrome.runtime.id);
} else {
  console.log('Extension not detected');
}

// Check for content script injection
if (window.workflowStudio) {
  console.log('Content scripts loaded');
} else {
  console.log('Content scripts missing');
}
```

**Monitor Extension Messages:**
```javascript
// Listen for extension messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Extension message:', message);
  return true; // Keep message channel open
});
```

### Version Compatibility Check

**Check Browser Version:**
```javascript
// Get browser info
const browserInfo = {
  userAgent: navigator.userAgent,
  vendor: navigator.vendor,
  platform: navigator.platform
};

console.log('Browser info:', browserInfo);

// Check for specific features
const features = {
  serviceWorker: 'serviceWorker' in navigator,
  webExtensions: typeof chrome !== 'undefined',
  contentScripts: typeof chrome?.scripting !== 'undefined'
};

console.log('Feature support:', features);
```

## ⚙️ Browser-Specific Settings

### Chrome Optimization

**Performance Settings:**
1. **Enable hardware acceleration**: Settings → Advanced → System → Use hardware acceleration
2. **Increase memory limit**: Add `--max-old-space-size=4096` to Chrome shortcut
3. **Disable unnecessary extensions**: Keep only essential extensions active

**Security Settings:**
1. **Allow extension on all sites**: Extension details → "Allow on all sites"
2. **Enable developer mode**: For testing and debugging
3. **Manage site permissions**: Ensure target sites allow extension access

### Edge Configuration

**Extension Sync:**
1. **Enable extension sync**: Settings → Profiles → Sync → Extensions
2. **Import from Chrome**: Use built-in Chrome extension importer
3. **Manage permissions**: Edge-specific permission management

### Firefox Adjustments

**Privacy Settings:**
1. **Adjust tracking protection**: May interfere with content extraction
2. **Configure CSP handling**: about:config → security.csp.enable
3. **Extension permissions**: Manage per-site permissions carefully

## 🔧 Advanced Troubleshooting

### Extension Debugging Mode

**Enable Debug Logging:**
```javascript
// Add to extension background script
chrome.storage.local.set({debugMode: true});

// Check debug status
chrome.storage.local.get(['debugMode'], (result) => {
  if (result.debugMode) {
    console.log('Debug mode enabled');
  }
});
```

### Network Debugging

**Monitor Extension Requests:**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Filter by "Extension" or look for extension ID
4. Monitor for failed requests or timeouts

### Memory Debugging

**Check Extension Memory Usage:**
1. Open `chrome://system/` (Chrome) or `about:memory` (Firefox)
2. Look for extension memory usage
3. Restart browser if memory usage is excessive

## 📞 Getting Help

### Before Reporting Issues

**Gather Information:**
- Browser name and version
- Extension version
- Operating system
- Specific error messages
- Steps to reproduce the problem

**Test in Different Browser:**
- Try the same workflow in Chrome/Edge
- Compare behavior across browsers
- Note any differences in functionality

### Reporting Browser-Specific Bugs

**Include in Bug Report:**
1. **Browser details**: Version, platform, settings
2. **Extension version**: Check in extension management
3. **Console errors**: Copy exact error messages
4. **Screenshots**: Show any visual issues
5. **Reproduction steps**: Detailed steps to recreate issue

**Where to Report:**
- **GitHub Issues**: For technical bugs and feature requests
- **Community Forums**: For usage questions and workarounds
- **Extension Store Reviews**: For general feedback (less detailed)

## 🔄 Regular Maintenance

### Keep Everything Updated

**Monthly Checklist:**
- [ ] Update browser to latest version
- [ ] Update extension from store
- [ ] Clear browser cache and cookies
- [ ] Review and clean up extensions
- [ ] Test critical workflows

**Performance Monitoring:**
- Monitor workflow execution times
- Check for new browser console errors
- Verify all features still work as expected
- Update any browser-specific workarounds