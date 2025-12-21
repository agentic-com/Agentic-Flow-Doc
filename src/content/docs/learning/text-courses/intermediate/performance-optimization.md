---
title: "Performance Optimization for Complex Workflows"
description: "Master performance optimization techniques for browser automation workflows with best practices and real-world examples."
difficulty: "🚀 intermediate"
---

# Performance Optimization for Complex Workflows

Learn to optimize browser automation workflows for maximum speed, efficiency, and resource utilization. This tutorial covers performance analysis, bottleneck identification, and optimization strategies for production-ready workflows.

## What You'll Learn

By the end of this tutorial, you'll master:
- Performance profiling and bottleneck identification
- Memory management and resource optimization
- Parallel processing and workflow optimization
- Caching strategies and data optimization
- Browser-specific performance considerations

## Prerequisites

- Completed [Workflow Debugging & Error Handling](/learning/text-courses/intermediate/workflow-debugging/)
- Experience with complex multi-node workflows
- Understanding of browser performance concepts
- Familiarity with JavaScript performance optimization

## Performance Optimization Framework

### The SPEED Methodology

**S**cale - Design for scalability from the start
**P**arallel - Leverage parallel processing where possible
**E**fficient - Optimize algorithms and data structures
**E**liminate - Remove unnecessary operations and data
**D**efer - Delay non-critical operations

### Performance Metrics Hierarchy

```
User Experience (< 3s total execution)
    ↓
Workflow Execution Time (< 30s per workflow)
    ↓
Node Processing Time (< 5s per node)
    ↓
Individual Operations (< 1s per operation)
```

## Step 1: Performance Profiling Setup

### Comprehensive Performance Monitor

**Performance Tracking Node:**
```javascript
{
  "nodeName": "Performance Profiler",
  "nodeType": "Code",
  "code": `
    class WorkflowProfiler {
      constructor() {
        this.metrics = {
          startTime: performance.now(),
          memoryStart: this.getMemoryUsage(),
          nodeMetrics: new Map(),
          resourceUsage: []
        };
      }

      getMemoryUsage() {
        return performance.memory ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        } : null;
      }

      profileNode(nodeName, operation) {
        const start = performance.now();
        const memBefore = this.getMemoryUsage();

        const result = operation();

        const end = performance.now();
        const memAfter = this.getMemoryUsage();

        this.metrics.nodeMetrics.set(nodeName, {
          executionTime: end - start,
          memoryDelta: memAfter ? memAfter.used - memBefore.used : 0,
          timestamp: new Date().toISOString()
        });

        return result;
      }

      generateReport() {
        const totalTime = performance.now() - this.metrics.startTime;
        const memoryEnd = this.getMemoryUsage();

        return {
          summary: {
            totalExecutionTime: totalTime,
            totalMemoryUsed: memoryEnd ? memoryEnd.used - this.metrics.memoryStart.used : 0,
            nodeCount: this.metrics.nodeMetrics.size,
            averageNodeTime: totalTime / this.metrics.nodeMetrics.size
          },
          nodeBreakdown: Object.fromEntries(this.metrics.nodeMetrics),
          recommendations: this.generateRecommendations()
        };
      }

      generateRecommendations() {
        const recommendations = [];
        const nodeMetrics = Array.from(this.metrics.nodeMetrics.entries());

        // Identify slow nodes
        const slowNodes = nodeMetrics.filter(([name, metrics]) => metrics.executionTime > 5000);
        if (slowNodes.length > 0) {
          recommendations.push({
            type: 'performance',
            priority: 'high',
            message: \`Slow nodes detected: \${slowNodes.map(([name]) => name).join(', ')}\`,
            suggestion: 'Consider optimizing these nodes or implementing caching'
          });
        }

        // Check memory usage
        const highMemoryNodes = nodeMetrics.filter(([name, metrics]) => metrics.memoryDelta > 10000000); // 10MB
        if (highMemoryNodes.length > 0) {
          recommendations.push({
            type: 'memory',
            priority: 'medium',
            message: \`High memory usage in: \${highMemoryNodes.map(([name]) => name).join(', ')}\`,
            suggestion: 'Implement data streaming or reduce data retention'
          });
        }

        return recommendations;
      }
    }

    const profiler = new WorkflowProfiler();
    const inputData = $input.all();

    // Profile the current operation
    const result = profiler.profileNode($node.name, () => {
      // Your node logic here
      return inputData.map(item => ({
        ...item,
        processedAt: new Date().toISOString()
      }));
    });

    // Add profiling data to output
    return result.map(item => ({
      ...item,
      _profiling: profiler.generateReport()
    }));
  `
}
```

### Browser Performance API Integration

**Resource Timing Monitor:**
```javascript
{
  "nodeName": "Resource Monitor",
  "code": `
    class ResourceMonitor {
      static getResourceTiming() {
        const entries = performance.getEntriesByType('resource');
        return entries.map(entry => ({
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize,
          type: entry.initiatorType,
          startTime: entry.startTime
        }));
      }

      static getNavigationTiming() {
        const nav = performance.getEntriesByType('navigation')[0];
        return nav ? {
          domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
          loadComplete: nav.loadEventEnd - nav.loadEventStart,
          totalTime: nav.loadEventEnd - nav.fetchStart
        } : null;
      }

      static analyzePerformance() {
        const resources = this.getResourceTiming();
        const navigation = this.getNavigationTiming();

        return {
          resourceCount: resources.length,
          totalResourceSize: resources.reduce((sum, r) => sum + (r.size || 0), 0),
          slowestResource: resources.reduce((slowest, current) =>
            current.duration > (slowest?.duration || 0) ? current : slowest, null),
          navigation,
          recommendations: this.generateResourceRecommendations(resources)
        };
      }

      static generateResourceRecommendations(resources) {
        const recommendations = [];

        // Large resources
        const largeResources = resources.filter(r => r.size > 1000000); // 1MB
        if (largeResources.length > 0) {
          recommendations.push({
            type: 'resource_size',
            message: \`Large resources detected: \${largeResources.length} files > 1MB\`,
            impact: 'high'
          });
        }

        // Slow resources
        const slowResources = resources.filter(r => r.duration > 3000); // 3s
        if (slowResources.length > 0) {
          recommendations.push({
            type: 'resource_speed',
            message: \`Slow loading resources: \${slowResources.length} files > 3s\`,
            impact: 'medium'
          });
        }

        return recommendations;
      }
    }

    const performanceData = ResourceMonitor.analyzePerformance();
    const inputData = $input.all();

    return inputData.map(item => ({
      ...item,
      _performance: performanceData
    }));
  `
}
```

## Step 2: Memory Management Optimization

### Efficient Data Structures

**Memory-Optimized Data Processing:**
```javascript
{
  "nodeName": "Memory Efficient Processor",
  "code": `
    class MemoryOptimizer {
      static processLargeDataset(data, batchSize = 100) {
        const results = [];

        // Process in batches to avoid memory spikes
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          const processedBatch = this.processBatch(batch);
          results.push(...processedBatch);

          // Force garbage collection hint
          if (i % (batchSize * 10) === 0) {
            this.suggestGarbageCollection();
          }
        }

        return results;
      }

      static processBatch(batch) {
        return batch.map(item => {
          // Create new object instead of modifying existing
          const processed = {
            id: item.id,
            processedData: this.optimizeDataStructure(item.data),
            timestamp: Date.now()
          };

          // Clear references to original data
          item = null;

          return processed;
        });
      }

      static optimizeDataStructure(data) {
        // Remove unnecessary properties
        const optimized = {};
        const essentialFields = ['name', 'value', 'type', 'id'];

        essentialFields.forEach(field => {
          if (data[field] !== undefined) {
            optimized[field] = data[field];
          }
        });

        return optimized;
      }

      static suggestGarbageCollection() {
        // Hint for garbage collection (browser-dependent)
        if (window.gc) {
          window.gc();
        }
      }

      static getMemoryStats() {
        if (performance.memory) {
          return {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
          };
        }
        return null;
      }
    }

    const inputData = $input.all();
    const memoryBefore = MemoryOptimizer.getMemoryStats();

    const processedData = MemoryOptimizer.processLargeDataset(inputData);

    const memoryAfter = MemoryOptimizer.getMemoryStats();

    return [{
      processedItems: processedData,
      memoryUsage: {
        before: memoryBefore,
        after: memoryAfter,
        delta: memoryAfter ? memoryAfter.used - memoryBefore.used : 0
      }
    }];
  `
}
```

### Streaming Data Processing

**Stream-Based Processing Node:**
```javascript
{
  "nodeName": "Stream Processor",
  "code": `
    class StreamProcessor {
      constructor(chunkSize = 50) {
        this.chunkSize = chunkSize;
        this.processed = 0;
        this.errors = 0;
      }

      async *processStream(dataArray) {
        for (let i = 0; i < dataArray.length; i += this.chunkSize) {
          const chunk = dataArray.slice(i, i + this.chunkSize);

          try {
            const processedChunk = await this.processChunk(chunk);
            this.processed += processedChunk.length;
            yield processedChunk;
          } catch (error) {
            this.errors++;
            console.error('Chunk processing error:', error);
            yield []; // Continue with empty chunk
          }

          // Allow other operations to run
          await this.yield();
        }
      }

      async processChunk(chunk) {
        return chunk.map(item => ({
          ...item,
          processed: true,
          chunkId: Math.random().toString(36).substr(2, 9)
        }));
      }

      async yield() {
        return new Promise(resolve => setTimeout(resolve, 0));
      }

      getStats() {
        return {
          processed: this.processed,
          errors: this.errors,
          successRate: this.processed / (this.processed + this.errors)
        };
      }
    }

    const inputData = $input.all();
    const processor = new StreamProcessor();
    const results = [];

    // Process data in streams
    for await (const chunk of processor.processStream(inputData)) {
      results.push(...chunk);
    }

    return [{
      streamResults: results,
      processingStats: processor.getStats()
    }];
  `
}
```

## Step 3: Parallel Processing Optimization

### Concurrent Node Execution

**Parallel Processing Configuration:**
```json
{
  "workflowConfig": {
    "parallelExecution": {
      "enabled": true,
      "maxConcurrentNodes": 4,
      "nodeGroups": [
        {
          "name": "data_extraction",
          "nodes": ["GetAllText", "GetAllImages", "GetAllLinks"],
          "executionMode": "parallel",
          "waitForAll": true
        },
        {
          "name": "api_calls",
          "nodes": ["PriceAPI", "ReviewAPI", "InventoryAPI"],
          "executionMode": "parallel",
          "maxConcurrent": 2,
          "rateLimiting": true
        }
      ]
    }
  }
}
```

### Web Worker Integration

**Background Processing Node:**
```javascript
{
  "nodeName": "Background Processor",
  "code": `
    class WorkerManager {
      constructor() {
        this.workers = new Map();
        this.maxWorkers = navigator.hardwareConcurrency || 4;
      }

      createWorker(taskType) {
        const workerCode = \`
          self.onmessage = function(e) {
            const { taskType, data, taskId } = e.data;

            try {
              let result;
              switch(taskType) {
                case 'textProcessing':
                  result = processText(data);
                  break;
                case 'dataValidation':
                  result = validateData(data);
                  break;
                case 'calculation':
                  result = performCalculations(data);
                  break;
                default:
                  throw new Error('Unknown task type: ' + taskType);
              }

              self.postMessage({ taskId, result, success: true });
            } catch (error) {
              self.postMessage({ taskId, error: error.message, success: false });
            }
          };

          function processText(data) {
            return data.map(item => ({
              ...item,
              wordCount: item.text ? item.text.split(' ').length : 0,
              processed: true
            }));
          }

          function validateData(data) {
            return data.filter(item =>
              item.name && item.name.length > 0 &&
              item.value !== null && item.value !== undefined
            );
          }

          function performCalculations(data) {
            return data.map(item => ({
              ...item,
              score: Math.random() * 100,
              category: item.value > 50 ? 'high' : 'low'
            }));
          }
        \`;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));

        this.workers.set(taskType, worker);
        return worker;
      }

      async processInBackground(taskType, data) {
        return new Promise((resolve, reject) => {
          let worker = this.workers.get(taskType);

          if (!worker) {
            worker = this.createWorker(taskType);
          }

          const taskId = Math.random().toString(36).substr(2, 9);

          const timeout = setTimeout(() => {
            reject(new Error('Worker timeout'));
          }, 30000);

          worker.onmessage = (e) => {
            const { taskId: responseTaskId, result, error, success } = e.data;

            if (responseTaskId === taskId) {
              clearTimeout(timeout);

              if (success) {
                resolve(result);
              } else {
                reject(new Error(error));
              }
            }
          };

          worker.postMessage({ taskType, data, taskId });
        });
      }

      cleanup() {
        this.workers.forEach(worker => {
          worker.terminate();
        });
        this.workers.clear();
      }
    }

    const inputData = $input.all();
    const workerManager = new WorkerManager();

    try {
      // Process different types of data in parallel
      const textProcessingPromise = workerManager.processInBackground('textProcessing',
        inputData.filter(item => item.text));

      const validationPromise = workerManager.processInBackground('dataValidation',
        inputData);

      const calculationPromise = workerManager.processInBackground('calculation',
        inputData.filter(item => item.value !== undefined));

      // Wait for all background tasks to complete
      const [textResults, validationResults, calculationResults] = await Promise.all([
        textProcessingPromise,
        validationPromise,
        calculationPromise
      ]);

      return [{
        textProcessing: textResults,
        validation: validationResults,
        calculations: calculationResults,
        processingMode: 'parallel_workers'
      }];

    } finally {
      workerManager.cleanup();
    }
  `
}
```

## Step 4: Caching and Data Optimization

### Intelligent Caching System

**Multi-Level Cache Implementation:**
```javascript
{
  "nodeName": "Smart Cache Manager",
  "code": `
    class CacheManager {
      constructor() {
        this.memoryCache = new Map();
        this.sessionCache = sessionStorage;
        this.persistentCache = localStorage;
        this.maxMemoryItems = 100;
        this.defaultTTL = 300000; // 5 minutes
      }

      generateKey(data) {
        // Create deterministic key from data
        const keyData = {
          url: data.url || window.location.href,
          selector: data.selector,
          timestamp: Math.floor(Date.now() / this.defaultTTL) // Round to TTL intervals
        };
        return btoa(JSON.stringify(keyData));
      }

      get(key, level = 'memory') {
        switch (level) {
          case 'memory':
            const memItem = this.memoryCache.get(key);
            if (memItem && memItem.expires > Date.now()) {
              return memItem.data;
            }
            break;

          case 'session':
            const sessionItem = this.sessionCache.getItem(key);
            if (sessionItem) {
              const parsed = JSON.parse(sessionItem);
              if (parsed.expires > Date.now()) {
                return parsed.data;
              }
            }
            break;

          case 'persistent':
            const persistentItem = this.persistentCache.getItem(key);
            if (persistentItem) {
              const parsed = JSON.parse(persistentItem);
              if (parsed.expires > Date.now()) {
                return parsed.data;
              }
            }
            break;
        }
        return null;
      }

      set(key, data, ttl = this.defaultTTL, level = 'memory') {
        const item = {
          data,
          expires: Date.now() + ttl,
          created: Date.now()
        };

        switch (level) {
          case 'memory':
            // Implement LRU eviction
            if (this.memoryCache.size >= this.maxMemoryItems) {
              const firstKey = this.memoryCache.keys().next().value;
              this.memoryCache.delete(firstKey);
            }
            this.memoryCache.set(key, item);
            break;

          case 'session':
            try {
              this.sessionCache.setItem(key, JSON.stringify(item));
            } catch (e) {
              console.warn('Session storage full, clearing old items');
              this.clearExpired('session');
              this.sessionCache.setItem(key, JSON.stringify(item));
            }
            break;

          case 'persistent':
            try {
              this.persistentCache.setItem(key, JSON.stringify(item));
            } catch (e) {
              console.warn('Local storage full, clearing old items');
              this.clearExpired('persistent');
              this.persistentCache.setItem(key, JSON.stringify(item));
            }
            break;
        }
      }

      clearExpired(level = 'all') {
        const now = Date.now();

        if (level === 'all' || level === 'memory') {
          for (const [key, item] of this.memoryCache.entries()) {
            if (item.expires <= now) {
              this.memoryCache.delete(key);
            }
          }
        }

        if (level === 'all' || level === 'session') {
          for (let i = 0; i < this.sessionCache.length; i++) {
            const key = this.sessionCache.key(i);
            const item = JSON.parse(this.sessionCache.getItem(key) || '{}');
            if (item.expires && item.expires <= now) {
              this.sessionCache.removeItem(key);
            }
          }
        }

        if (level === 'all' || level === 'persistent') {
          for (let i = 0; i < this.persistentCache.length; i++) {
            const key = this.persistentCache.key(i);
            const item = JSON.parse(this.persistentCache.getItem(key) || '{}');
            if (item.expires && item.expires <= now) {
              this.persistentCache.removeItem(key);
            }
          }
        }
      }

      getStats() {
        return {
          memoryItems: this.memoryCache.size,
          sessionItems: this.sessionCache.length,
          persistentItems: this.persistentCache.length,
          memoryUsage: JSON.stringify([...this.memoryCache.values()]).length
        };
      }
    }

    const cacheManager = new CacheManager();
    const inputData = $input.all();

    // Try to get cached results first
    const cacheKey = cacheManager.generateKey(inputData[0] || {});
    let cachedResult = cacheManager.get(cacheKey, 'memory') ||
                      cacheManager.get(cacheKey, 'session');

    if (cachedResult) {
      return [{
        ...cachedResult,
        fromCache: true,
        cacheStats: cacheManager.getStats()
      }];
    }

    // Process data if not cached
    const processedData = inputData.map(item => ({
      ...item,
      processed: true,
      processedAt: new Date().toISOString(),
      processingTime: Math.random() * 1000 // Simulate processing time
    }));

    // Cache the results
    cacheManager.set(cacheKey, processedData[0], 300000, 'memory'); // 5 min cache

    return [{
      ...processedData[0],
      fromCache: false,
      cacheStats: cacheManager.getStats()
    }];
  `
}
```

### Data Compression and Optimization

**Data Compression Node:**
```javascript
{
  "nodeName": "Data Compressor",
  "code": `
    class DataOptimizer {
      static compressText(text) {
        // Simple text compression using common patterns
        const compressionMap = {
          'the ': 'þ',
          'and ': '&',
          'that ': 'ð',
          'with ': 'w/',
          'have ': 'hv',
          'this ': 'ths',
          'will ': 'wl',
          'your ': 'yr',
          'from ': 'frm',
          'they ': 'thy',
          'know ': 'kw',
          'want ': 'wnt',
          'been ': 'bn',
          'good ': 'gd',
          'much ': 'mch',
          'some ': 'sm',
          'time ': 'tm',
          'very ': 'vy',
          'when ': 'whn',
          'come ': 'cm',
          'here ': 'hr',
          'just ': 'jst',
          'like ': 'lk',
          'long ': 'lng',
          'make ': 'mk',
          'many ': 'mny',
          'over ': 'ovr',
          'such ': 'sch',
          'take ': 'tk',
          'than ': 'thn',
          'them ': 'thm',
          'well ': 'wl',
          'were ': 'wr'
        };

        let compressed = text;
        for (const [original, replacement] of Object.entries(compressionMap)) {
          compressed = compressed.replace(new RegExp(original, 'gi'), replacement);
        }

        return {
          compressed,
          originalSize: text.length,
          compressedSize: compressed.length,
          compressionRatio: (1 - compressed.length / text.length) * 100
        };
      }

      static decompressText(compressedData) {
        const decompressionMap = {
          'þ': 'the ',
          '&': 'and ',
          'ð': 'that ',
          'w/': 'with ',
          'hv': 'have ',
          'ths': 'this ',
          'wl': 'will ',
          'yr': 'your ',
          'frm': 'from ',
          'thy': 'they ',
          'kw': 'know ',
          'wnt': 'want ',
          'bn': 'been ',
          'gd': 'good ',
          'mch': 'much ',
          'sm': 'some ',
          'tm': 'time ',
          'vy': 'very ',
          'whn': 'when ',
          'cm': 'come ',
          'hr': 'here ',
          'jst': 'just ',
          'lk': 'like ',
          'lng': 'long ',
          'mk': 'make ',
          'mny': 'many ',
          'ovr': 'over ',
          'sch': 'such ',
          'tk': 'take ',
          'thn': 'than ',
          'thm': 'them ',
          'wl': 'well ',
          'wr': 'were '
        };

        let decompressed = compressedData.compressed;
        for (const [compressed, original] of Object.entries(decompressionMap)) {
          decompressed = decompressed.replace(new RegExp(compressed, 'g'), original);
        }

        return decompressed;
      }

      static optimizeDataStructure(data) {
        // Remove null/undefined values
        const cleaned = {};
        for (const [key, value] of Object.entries(data)) {
          if (value !== null && value !== undefined && value !== '') {
            if (typeof value === 'object' && !Array.isArray(value)) {
              const optimizedValue = this.optimizeDataStructure(value);
              if (Object.keys(optimizedValue).length > 0) {
                cleaned[key] = optimizedValue;
              }
            } else {
              cleaned[key] = value;
            }
          }
        }

        return cleaned;
      }

      static calculateDataEfficiency(original, optimized) {
        const originalSize = JSON.stringify(original).length;
        const optimizedSize = JSON.stringify(optimized).length;

        return {
          originalSize,
          optimizedSize,
          spaceSaved: originalSize - optimizedSize,
          efficiencyGain: ((originalSize - optimizedSize) / originalSize) * 100
        };
      }
    }

    const inputData = $input.all();
    const results = [];

    for (const item of inputData) {
      const optimizedStructure = DataOptimizer.optimizeDataStructure(item);

      let textCompression = null;
      if (item.text && typeof item.text === 'string') {
        textCompression = DataOptimizer.compressText(item.text);
      }

      const efficiency = DataOptimizer.calculateDataEfficiency(item, optimizedStructure);

      results.push({
        original: item,
        optimized: optimizedStructure,
        textCompression,
        efficiency,
        optimizationApplied: true
      });
    }

    return results;
  `
}
```

## Step 5: Browser-Specific Optimizations

### DOM Manipulation Optimization

**Efficient DOM Operations:**
```javascript
{
  "nodeName": "DOM Optimizer",
  "code": `
    class DOMOptimizer {
      static batchDOMOperations(operations) {
        // Use DocumentFragment for batch operations
        const fragment = document.createDocumentFragment();
        const results = [];

        // Disable layout thrashing
        const originalDisplay = document.body.style.display;
        document.body.style.display = 'none';

        try {
          operations.forEach(operation => {
            switch (operation.type) {
              case 'extract':
                results.push(this.extractFromElement(operation.selector));
                break;
              case 'modify':
                this.modifyElement(operation.selector, operation.changes);
                break;
              case 'create':
                const element = this.createElement(operation.config);
                fragment.appendChild(element);
                break;
            }
          });

          // Apply all changes at once
          if (fragment.children.length > 0) {
            document.body.appendChild(fragment);
          }

        } finally {
          // Re-enable layout
          document.body.style.display = originalDisplay;
        }

        return results;
      }

      static extractFromElement(selector) {
        const elements = document.querySelectorAll(selector);
        const results = [];

        // Use faster iteration methods
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          results.push({
            text: element.textContent,
            html: element.innerHTML,
            attributes: this.getElementAttributes(element),
            position: this.getElementPosition(element)
          });
        }

        return results;
      }

      static getElementAttributes(element) {
        const attributes = {};
        const attrs = element.attributes;

        for (let i = 0; i < attrs.length; i++) {
          attributes[attrs[i].name] = attrs[i].value;
        }

        return attributes;
      }

      static getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          visible: this.isElementVisible(element)
        };
      }

      static isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0' &&
               element.offsetWidth > 0 &&
               element.offsetHeight > 0;
      }

      static optimizeSelectors(selectors) {
        // Optimize CSS selectors for performance
        return selectors.map(selector => {
          // Prefer ID selectors (fastest)
          if (selector.includes('#')) {
            return selector;
          }

          // Add performance hints
          if (selector.includes('.')) {
            return selector; // Class selectors are reasonably fast
          }

          // Optimize complex selectors
          if (selector.includes(' ')) {
            const parts = selector.split(' ');
            // Try to add more specific selectors
            return parts.map(part => {
              if (!part.includes('.') && !part.includes('#')) {
                return part + ':not([style*="display: none"])';
              }
              return part;
            }).join(' ');
          }

          return selector;
        });
      }
    }

    const inputData = $input.all();
    const optimizer = new DOMOptimizer();

    // Batch DOM operations for better performance
    const operations = inputData.map(item => ({
      type: 'extract',
      selector: item.selector || 'p, h1, h2, h3, h4, h5, h6'
    }));

    const startTime = performance.now();
    const extractedData = optimizer.batchDOMOperations(operations);
    const endTime = performance.now();

    return [{
      extractedData,
      performance: {
        executionTime: endTime - startTime,
        operationCount: operations.length,
        averageTimePerOperation: (endTime - startTime) / operations.length
      },
      optimization: 'batch_dom_operations'
    }];
  `
}
```

### Network Request Optimization

**Request Batching and Optimization:**
```javascript
{
  "nodeName": "Network Optimizer",
  "code": `
    class NetworkOptimizer {
      constructor() {
        this.requestQueue = [];
        this.batchSize = 5;
        this.batchDelay = 100; // ms
        this.cache = new Map();
      }

      async batchRequests(requests) {
        const batches = [];

        // Group requests into batches
        for (let i = 0; i < requests.length; i += this.batchSize) {
          batches.push(requests.slice(i, i + this.batchSize));
        }

        const results = [];

        // Process batches with delay
        for (const batch of batches) {
          const batchPromises = batch.map(request => this.makeOptimizedRequest(request));
          const batchResults = await Promise.allSettled(batchPromises);

          results.push(...batchResults.map(result =>
            result.status === 'fulfilled' ? result.value : { error: result.reason }
          ));

          // Add delay between batches to avoid rate limiting
          if (batches.indexOf(batch) < batches.length - 1) {
            await this.delay(this.batchDelay);
          }
        }

        return results;
      }

      async makeOptimizedRequest(request) {
        const cacheKey = this.generateCacheKey(request);

        // Check cache first
        if (this.cache.has(cacheKey)) {
          const cached = this.cache.get(cacheKey);
          if (cached.expires > Date.now()) {
            return { ...cached.data, fromCache: true };
          }
        }

        // Optimize request headers
        const optimizedRequest = {
          ...request,
          headers: {
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'max-age=300',
            ...request.headers
          }
        };

        try {
          const response = await fetch(optimizedRequest.url, {
            method: optimizedRequest.method || 'GET',
            headers: optimizedRequest.headers,
            body: optimizedRequest.body,
            signal: AbortSignal.timeout(optimizedRequest.timeout || 10000)
          });

          if (!response.ok) {
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
          }

          const data = await response.json();

          // Cache successful responses
          this.cache.set(cacheKey, {
            data,
            expires: Date.now() + (request.cacheTTL || 300000) // 5 min default
          });

          return { ...data, fromCache: false };

        } catch (error) {
          console.error('Request failed:', error);
          throw error;
        }
      }

      generateCacheKey(request) {
        const keyData = {
          url: request.url,
          method: request.method || 'GET',
          body: request.body
        };
        return btoa(JSON.stringify(keyData));
      }

      async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      clearExpiredCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
          if (value.expires <= now) {
            this.cache.delete(key);
          }
        }
      }

      getStats() {
        return {
          cacheSize: this.cache.size,
          queueLength: this.requestQueue.length,
          batchSize: this.batchSize
        };
      }
    }

    const inputData = $input.all();
    const optimizer = new NetworkOptimizer();

    // Extract API requests from input data
    const requests = inputData.filter(item => item.apiUrl).map(item => ({
      url: item.apiUrl,
      method: item.method || 'GET',
      headers: item.headers || {},
      body: item.body,
      timeout: item.timeout || 10000,
      cacheTTL: item.cacheTTL || 300000
    }));

    if (requests.length === 0) {
      return inputData;
    }

    const startTime = performance.now();
    const results = await optimizer.batchRequests(requests);
    const endTime = performance.now();

    // Clean up expired cache entries
    optimizer.clearExpiredCache();

    return [{
      apiResults: results,
      performance: {
        totalTime: endTime - startTime,
        requestCount: requests.length,
        averageTimePerRequest: (endTime - startTime) / requests.length,
        cacheHitRate: results.filter(r => r.fromCache).length / results.length
      },
      networkStats: optimizer.getStats()
    }];
  `
}
```

## Step 6: Performance Monitoring Dashboard

### Real-Time Performance Metrics

**Performance Dashboard Node:**
```javascript
{
  "nodeName": "Performance Dashboard",
  "code": `
    class PerformanceDashboard {
      constructor() {
        this.metrics = {
          workflow: new Map(),
          system: new Map(),
          network: new Map()
        };
        this.startTime = performance.now();
      }

      collectWorkflowMetrics(nodeData) {
        const metrics = {
          timestamp: Date.now(),
          nodeCount: nodeData.length,
          dataSize: JSON.stringify(nodeData).length,
          processingTime: performance.now() - this.startTime,
          memoryUsage: this.getMemoryUsage(),
          cpuUsage: this.estimateCPUUsage()
        };

        this.metrics.workflow.set('current', metrics);
        return metrics;
      }

      collectSystemMetrics() {
        const metrics = {
          timestamp: Date.now(),
          memory: this.getMemoryUsage(),
          connection: this.getConnectionInfo(),
          battery: this.getBatteryInfo(),
          hardware: this.getHardwareInfo()
        };

        this.metrics.system.set('current', metrics);
        return metrics;
      }

      getMemoryUsage() {
        if (performance.memory) {
          return {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
            percentage: Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100)
          };
        }
        return null;
      }

      estimateCPUUsage() {
        // Rough CPU usage estimation based on timing
        const start = performance.now();
        let iterations = 0;
        const endTime = start + 10; // 10ms sample

        while (performance.now() < endTime) {
          iterations++;
        }

        // Normalize based on expected iterations (rough estimate)
        const expectedIterations = 100000; // Baseline for comparison
        return Math.min(100, Math.max(0, 100 - (iterations / expectedIterations * 100)));
      }

      getConnectionInfo() {
        if (navigator.connection) {
          return {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
            saveData: navigator.connection.saveData
          };
        }
        return null;
      }

      getBatteryInfo() {
        // Note: Battery API is deprecated in many browsers
        if (navigator.getBattery) {
          return navigator.getBattery().then(battery => ({
            charging: battery.charging,
            level: Math.round(battery.level * 100),
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          }));
        }
        return null;
      }

      getHardwareInfo() {
        return {
          cores: navigator.hardwareConcurrency || 'unknown',
          platform: navigator.platform,
          userAgent: navigator.userAgent.substring(0, 100) + '...',
          language: navigator.language,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine
        };
      }

      generatePerformanceReport() {
        const workflowMetrics = this.metrics.workflow.get('current');
        const systemMetrics = this.metrics.system.get('current');

        const report = {
          summary: {
            overallHealth: this.calculateOverallHealth(workflowMetrics, systemMetrics),
            recommendations: this.generateRecommendations(workflowMetrics, systemMetrics)
          },
          workflow: workflowMetrics,
          system: systemMetrics,
          generatedAt: new Date().toISOString()
        };

        return report;
      }

      calculateOverallHealth(workflow, system) {
        let score = 100;

        // Deduct points for performance issues
        if (workflow && workflow.processingTime > 10000) score -= 20; // Slow processing
        if (system && system.memory && system.memory.percentage > 80) score -= 15; // High memory
        if (workflow && workflow.dataSize > 1000000) score -= 10; // Large data

        return Math.max(0, score);
      }

      generateRecommendations(workflow, system) {
        const recommendations = [];

        if (workflow && workflow.processingTime > 10000) {
          recommendations.push({
            type: 'performance',
            priority: 'high',
            message: 'Workflow processing time is high',
            suggestion: 'Consider implementing parallel processing or data streaming'
          });
        }

        if (system && system.memory && system.memory.percentage > 80) {
          recommendations.push({
            type: 'memory',
            priority: 'medium',
            message: 'Memory usage is high',
            suggestion: 'Implement data cleanup and garbage collection'
          });
        }

        if (workflow && workflow.dataSize > 1000000) {
          recommendations.push({
            type: 'data',
            priority: 'medium',
            message: 'Large data size detected',
            suggestion: 'Consider data compression or pagination'
          });
        }

        return recommendations;
      }
    }

    const inputData = $input.all();
    const dashboard = new PerformanceDashboard();

    // Collect comprehensive metrics
    const workflowMetrics = dashboard.collectWorkflowMetrics(inputData);
    const systemMetrics = dashboard.collectSystemMetrics();

    // Generate performance report
    const performanceReport = dashboard.generatePerformanceReport();

    return [{
      originalData: inputData,
      performanceReport,
      optimizationSuggestions: performanceReport.summary.recommendations,
      healthScore: performanceReport.summary.overallHealth
    }];
  `
}
```

## Best Practices Summary

### Performance Design Principles
- **Measure First:** Always profile before optimizing
- **Optimize Bottlenecks:** Focus on the slowest components
- **Parallel Processing:** Leverage browser capabilities for concurrent operations
- **Smart Caching:** Implement multi-level caching strategies
- **Resource Management:** Monitor and optimize memory usage

### Browser-Specific Optimizations
- **DOM Batching:** Group DOM operations to minimize reflows
- **Network Efficiency:** Batch API requests and implement intelligent caching
- **Memory Management:** Use streaming for large datasets
- **Background Processing:** Leverage Web Workers for CPU-intensive tasks

### Monitoring and Maintenance
- **Continuous Monitoring:** Track performance metrics in production
- **Automated Optimization:** Implement self-optimizing workflows
- **Regular Audits:** Periodically review and optimize workflow performance
- **User Experience Focus:** Prioritize user-perceived performance

## Next Steps

You've mastered performance optimization for browser automation workflows! Continue with:

1. **[Data Transformation Mastery](/learning/text-courses/intermediate/data-transformation/)** - Advanced data processing techniques
2. **[Advanced AI Integration](/learning/text-courses/advanced/ai-powered-analysis/)** - Optimize AI-powered workflows
3. **[Enterprise Workflow Patterns](/learning/text-courses/advanced/enterprise-patterns/)** - Scale workflows for enterprise use

## Additional Resources

- **[Web Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)** - Browser performance measurement tools
- **[Memory Management Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)** - JavaScript memory optimization
- **[Web Workers Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)** - Background processing techniques

---

**Estimated Time:** 70-85 minutes
**Difficulty:** Intermediate
**Prerequisites:** Advanced workflow experience, performance concepts knowledge