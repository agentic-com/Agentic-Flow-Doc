# Code Example Standards

## Overview

This document establishes comprehensive standards for all code examples in the `Agentic WorkFlow` documentation. These standards ensure that all code examples are accurate, testable, and provide real value to users.

## Code Quality Requirements

### Functional Requirements

#### Working Code Only
- **Executable**: All code examples MUST execute without errors
- **Complete**: No pseudo-code or incomplete examples
- **Tested**: Every example MUST be tested in the actual browser extension environment
- **Current**: Examples MUST work with the latest supported browser extension version

#### Real-World Relevance
- **Practical**: Examples MUST solve real problems users face
- **Realistic Data**: Use realistic example data, not placeholder text
- **Production Ready**: Examples should be suitable for production use with minimal modification
- **Best Practices**: Demonstrate current best practices and patterns

### Code Structure Standards

#### JavaScript/TypeScript Examples
```javascript
// ✅ GOOD: Complete, working example with proper structure
const processWebData = async (inputData) => {
  try {
    // Clear comments explaining each step
    const processedData = await transformData(inputData);
    
    // Error handling included
    if (!processedData || processedData.length === 0) {
      throw new Error('No data processed successfully');
    }
    
    return {
      success: true,
      data: processedData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Processing failed:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// ❌ BAD: Incomplete example without error handling
const processData = (data) => {
  return transform(data); // What if transform fails?
};
```

#### JSON Configuration Examples
```json
{
  "// Comment": "All JSON examples must be valid and complete",
  "node_configuration": {
    "parameter1": "realistic_value_not_placeholder",
    "parameter2": {
      "nested_option": true,
      "timeout": 5000
    }
  },
  "validation": {
    "required_fields": ["parameter1"],
    "optional_fields": ["parameter2"]
  }
}
```

#### Workflow Configuration Examples
```json
{
  "workflow": {
    "name": "Web Content Extraction",
    "description": "Extract and process web content with error handling",
    "nodes": [
      {
        "id": "extract_1",
        "type": "GetAllText",
        "config": {
          "selector": "article p",
          "clean_text": true,
          "max_length": 5000
        }
      },
      {
        "id": "process_1", 
        "type": "ProcessText",
        "config": {
          "operations": ["trim", "normalize_whitespace"],
          "output_format": "structured"
        }
      }
    ],
    "connections": [
      {
        "from": "extract_1",
        "to": "process_1",
        "data_mapping": {
          "text_content": "input_text"
        }
      }
    ]
  }
}
```

## Testing Requirements

### Browser Extension Testing

#### Environment Setup
```javascript
// Test environment configuration
const testConfig = {
  browser: 'chrome', // or 'firefox'
  extension_version: '2.1.0',
  test_url: 'https://example.com/test-page',
  permissions: ['activeTab', 'storage']
};
```

#### Test Data Standards
```javascript
// ✅ GOOD: Realistic test data
const testData = {
  webpage_content: {
    title: "Sample Article Title",
    paragraphs: [
      "This is the first paragraph with meaningful content that demonstrates real usage.",
      "This second paragraph shows how the extraction handles multiple elements."
    ],
    links: [
      { text: "Learn More", url: "https://example.com/learn", type: "internal" },
      { text: "External Resource", url: "https://external.com", type: "external" }
    ]
  }
};

// ❌ BAD: Placeholder test data
const badTestData = {
  content: "Lorem ipsum dolor sit amet...",
  links: [{ text: "Link 1", url: "http://example.com" }]
};
```

### Validation Scripts

#### Example Testing Template
```javascript
// Test script template for code examples
async function testCodeExample(exampleFunction, testData) {
  const testResults = {
    passed: 0,
    failed: 0,
    errors: []
  };
  
  try {
    // Test 1: Basic functionality
    const result1 = await exampleFunction(testData.basic);
    if (validateResult(result1, testData.expected.basic)) {
      testResults.passed++;
    } else {
      testResults.failed++;
      testResults.errors.push('Basic functionality test failed');
    }
    
    // Test 2: Error handling
    try {
      await exampleFunction(testData.invalid);
      testResults.failed++;
      testResults.errors.push('Error handling test failed - should have thrown error');
    } catch (expectedError) {
      testResults.passed++;
    }
    
    // Test 3: Edge cases
    const result3 = await exampleFunction(testData.edge_case);
    if (validateEdgeCase(result3)) {
      testResults.passed++;
    } else {
      testResults.failed++;
      testResults.errors.push('Edge case test failed');
    }
    
  } catch (error) {
    testResults.failed++;
    testResults.errors.push(`Unexpected error: ${error.message}`);
  }
  
  return testResults;
}
```

## Documentation Integration

### Code Block Standards

#### Syntax Highlighting
```markdown
<!-- ✅ GOOD: Always specify language -->
```javascript
const example = () => {
  return 'properly highlighted code';
};
```

<!-- ❌ BAD: No language specified -->
```
const example = () => {
  return 'no syntax highlighting';
};
```
```

#### Code Comments
```javascript
// ✅ GOOD: Explanatory comments for complex logic
const extractWebContent = async (url, options = {}) => {
  // Validate URL format before processing
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL format provided');
  }
  
  // Set default options with user overrides
  const config = {
    timeout: 5000,
    retries: 3,
    ...options
  };
  
  // Attempt extraction with retry logic
  for (let attempt = 1; attempt <= config.retries; attempt++) {
    try {
      const content = await performExtraction(url, config);
      
      // Validate extracted content before returning
      if (content && content.length > 0) {
        return {
          success: true,
          data: content,
          metadata: {
            url,
            extracted_at: new Date().toISOString(),
            attempt_number: attempt
          }
        };
      }
    } catch (error) {
      // Log attempt failure, continue to retry
      console.warn(`Extraction attempt ${attempt} failed:`, error.message);
      
      if (attempt === config.retries) {
        throw new Error(`Extraction failed after ${config.retries} attempts`);
      }
    }
  }
};

// ❌ BAD: No comments explaining complex logic
const extractContent = async (url, opts) => {
  if (!isValidUrl(url)) throw new Error('Invalid URL');
  const cfg = { timeout: 5000, retries: 3, ...opts };
  for (let i = 1; i <= cfg.retries; i++) {
    try {
      const content = await performExtraction(url, cfg);
      if (content && content.length > 0) {
        return { success: true, data: content, metadata: { url, extracted_at: new Date().toISOString(), attempt_number: i } };
      }
    } catch (error) {
      console.warn(`Attempt ${i} failed:`, error.message);
      if (i === cfg.retries) throw new Error(`Failed after ${cfg.retries} attempts`);
    }
  }
};
```

### Example Context

#### Before/After Context
```markdown
## Example: Text Extraction with Error Handling

This example demonstrates how to extract text content from a webpage with proper error handling and validation.

**Scenario**: Extract article content from a news website with fallback strategies for different page structures.

**Input Data**:
```json
{
  "url": "https://example-news.com/article/123",
  "selectors": {
    "primary": "article .content",
    "fallback": ".main-content p"
  }
}
```

**Implementation**:
```javascript
// Complete implementation here
```

**Expected Output**:
```json
{
  "success": true,
  "content": {
    "text": "Extracted article content...",
    "word_count": 450,
    "reading_time": "2 minutes"
  },
  "metadata": {
    "selector_used": "primary",
    "extraction_time": 150
  }
}
```
```

## Error Handling Standards

### Comprehensive Error Coverage

#### Input Validation
```javascript
// ✅ GOOD: Comprehensive input validation
function validateWorkflowConfig(config) {
  const errors = [];
  
  // Check required fields
  if (!config.nodes || !Array.isArray(config.nodes)) {
    errors.push('Workflow must contain a nodes array');
  }
  
  if (!config.connections || !Array.isArray(config.connections)) {
    errors.push('Workflow must contain a connections array');
  }
  
  // Validate node structure
  config.nodes?.forEach((node, index) => {
    if (!node.id || typeof node.id !== 'string') {
      errors.push(`Node at index ${index} must have a string id`);
    }
    
    if (!node.type || typeof node.type !== 'string') {
      errors.push(`Node at index ${index} must have a string type`);
    }
  });
  
  // Validate connections
  config.connections?.forEach((conn, index) => {
    if (!conn.from || !conn.to) {
      errors.push(`Connection at index ${index} must have from and to properties`);
    }
  });
  
  if (errors.length > 0) {
    throw new ValidationError('Workflow configuration invalid', errors);
  }
  
  return true;
}

// ❌ BAD: Minimal error handling
function validateConfig(config) {
  if (!config.nodes) throw new Error('No nodes');
  return true;
}
```

#### Runtime Error Handling
```javascript
// ✅ GOOD: Proper runtime error handling
async function executeWorkflowNode(node, inputData) {
  try {
    // Pre-execution validation
    validateNodeConfig(node);
    validateInputData(inputData, node.type);
    
    // Execute with timeout
    const result = await Promise.race([
      executeNode(node, inputData),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Node execution timeout')), 30000)
      )
    ]);
    
    // Post-execution validation
    validateOutputData(result, node.type);
    
    return {
      success: true,
      data: result,
      node_id: node.id,
      execution_time: Date.now() - startTime
    };
    
  } catch (error) {
    // Categorize and handle different error types
    if (error instanceof ValidationError) {
      return {
        success: false,
        error_type: 'validation',
        error_message: error.message,
        node_id: node.id
      };
    } else if (error instanceof TimeoutError) {
      return {
        success: false,
        error_type: 'timeout',
        error_message: 'Node execution exceeded time limit',
        node_id: node.id
      };
    } else {
      return {
        success: false,
        error_type: 'runtime',
        error_message: error.message,
        node_id: node.id,
        stack_trace: error.stack
      };
    }
  }
}
```

## Performance Standards

### Optimization Examples

#### Efficient Data Processing
```javascript
// ✅ GOOD: Optimized for performance
async function processLargeDataset(data, batchSize = 100) {
  const results = [];
  const totalBatches = Math.ceil(data.length / batchSize);
  
  for (let i = 0; i < totalBatches; i++) {
    const batch = data.slice(i * batchSize, (i + 1) * batchSize);
    
    // Process batch in parallel
    const batchResults = await Promise.all(
      batch.map(item => processItem(item))
    );
    
    results.push(...batchResults);
    
    // Progress reporting
    const progress = ((i + 1) / totalBatches) * 100;
    console.log(`Processing progress: ${progress.toFixed(1)}%`);
    
    // Yield control to prevent blocking
    if (i < totalBatches - 1) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  return results;
}

// ❌ BAD: Inefficient processing
async function processData(data) {
  const results = [];
  for (const item of data) {
    results.push(await processItem(item)); // Sequential processing
  }
  return results;
}
```

### Memory Management
```javascript
// ✅ GOOD: Memory-conscious processing
function processStreamData(stream) {
  return new Promise((resolve, reject) => {
    const results = [];
    let processedCount = 0;
    
    stream.on('data', (chunk) => {
      // Process chunk immediately to avoid memory buildup
      const processed = processChunk(chunk);
      
      // Only keep essential data in memory
      results.push({
        id: processed.id,
        summary: processed.summary
        // Don't store full chunk data
      });
      
      processedCount++;
      
      // Periodic cleanup
      if (processedCount % 1000 === 0) {
        // Force garbage collection hint
        if (global.gc) global.gc();
      }
    });
    
    stream.on('end', () => resolve(results));
    stream.on('error', reject);
  });
}
```

## Security Standards

### Secure Code Examples

#### Input Sanitization
```javascript
// ✅ GOOD: Proper input sanitization
function sanitizeUserInput(input) {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  // Remove potentially dangerous characters
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
  
  // Validate length
  if (sanitized.length > 10000) {
    throw new Error('Input exceeds maximum length');
  }
  
  return sanitized;
}

// ❌ BAD: No input sanitization
function processInput(input) {
  return input; // Dangerous - no validation or sanitization
}
```

#### Safe API Usage
```javascript
// ✅ GOOD: Secure API interaction
async function makeSecureAPICall(endpoint, data) {
  // Validate endpoint
  const allowedEndpoints = [
    'https://api.example.com/data',
    'https://api.example.com/process'
  ];
  
  if (!allowedEndpoints.includes(endpoint)) {
    throw new Error('Endpoint not in allowlist');
  }
  
  // Sanitize data
  const sanitizedData = sanitizeApiData(data);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getSecureToken()}`
      },
      body: JSON.stringify(sanitizedData)
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Don't expose internal details
    throw new Error('API call failed');
  }
}
```

## Version Control and Maintenance

### Example Versioning
```javascript
/**
 * Web Content Extractor
 * 
 * @version 2.1.0
 * @since 1.0.0
 * @tested_with Browser Extension v2.1.0
 * @browser_compatibility Chrome 90+, Firefox 88+
 * @last_updated 2024-01-15
 * @author Documentation Team
 */
```

### Deprecation Handling
```javascript
// ✅ GOOD: Clear deprecation notices
/**
 * @deprecated Since version 2.0.0. Use extractContentV2() instead.
 * This method will be removed in version 3.0.0.
 * 
 * Migration guide:
 * - Replace extractContent(url) with extractContentV2({url: url})
 * - Update error handling to use new error format
 */
function extractContent(url) {
  console.warn('extractContent() is deprecated. Use extractContentV2() instead.');
  return extractContentV2({ url });
}

// New recommended method
function extractContentV2(options) {
  // Implementation with improved API
}
```

## Documentation Integration

### Example Metadata
```markdown
---
example_metadata:
  tested_date: "2024-01-15"
  browser_extension_version: "2.1.0"
  browsers_tested: ["Chrome 120", "Firefox 121"]
  validation_status: "passed"
  performance_benchmarks:
    average_execution_time: "150ms"
    memory_usage: "2.5MB"
    success_rate: "99.2%"
---
```

This ensures all code examples meet the highest standards for accuracy, security, and usability.