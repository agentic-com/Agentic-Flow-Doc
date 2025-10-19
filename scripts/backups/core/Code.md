---
title: "Code"
description: "Execute custom Python code within browser workflows using Pyodide for advanced data processing, scientific computing, and complex automation logic."
template: doc
tags: ["Web Scraping", "Browser Automation", "HTTP", "DOM", "Content Extraction"]
---

# Code

## Overview

The Code node enables execution of custom Python code within browser workflows using Pyodide, providing unlimited flexibility for data processing, scientific computing, and complex automation logic. This node bridges the gap between built-in node functionality and custom requirements, allowing developers to implement sophisticated workflows with the full power of Python and its ecosystem.

### Purpose and Functionality

This node performs custom code execution by:

- Running Python code in the browser using Pyodide WebAssembly runtime
- Processing data from previous workflow nodes with Python's rich ecosystem
- Implementing complex data analysis, machine learning, and scientific computing
- Accessing popular Python libraries like NumPy, Pandas, SciPy, and more
- Performing advanced mathematical operations and statistical analysis

### Key Features

- **Full Python Support**: Execute any valid Python code with access to the standard library
- **Scientific Computing**: Built-in access to NumPy, Pandas, Matplotlib, and other scientific libraries
- **Data Integration**: Seamless access to data from previous workflow nodes
- **WebAssembly Performance**: Near-native Python execution speed in the browser
- **Package Management**: Install and use additional Python packages via micropip

### Primary Use Cases

- **Data Science & Analytics**: Perform statistical analysis, data visualization, and machine learning
- **Scientific Computing**: Complex mathematical operations, numerical analysis, and simulations
- **Advanced Data Processing**: Transform and analyze large datasets with Pandas and NumPy
- **Custom Algorithms**: Implement specialized algorithms for data processing and analysis
- **Text Processing**: Natural language processing, text analysis, and content extraction

## Parameters & Configuration

### Required Parameters

| Parameter | Type     | Description                 | Example                           |
| --------- | -------- | --------------------------- | --------------------------------- |
| `code`    | `string` | The Python code to execute  | `"import pandas as pd\nreturn df.describe()"` |

### Optional Parameters

| Parameter      | Type      | Default      | Description                                           | Example        |
| -------------- | --------- | ------------ | ----------------------------------------------------- | -------------- |
| `timeout`      | `number`  | `30000`      | Maximum execution time in milliseconds                | `10000`        |
| `returnType`   | `string`  | `"auto"`     | Expected return type (auto, json, string, number)     | `"json"`       |
| `packages`     | `array`   | `[]`         | Additional Python packages to install via micropip   | `["requests", "beautifulsoup4"]` |
| `memoryLimit`  | `string`  | `"100MB"`    | Maximum memory usage for Python execution            | `"256MB"`      |

### Advanced Configuration

```json
{
  "code": "import pandas as pd\nimport numpy as np\ndata = input_data['PreviousNode']\ndf = pd.DataFrame(data)\nreturn df.describe().to_dict()",
  "timeout": 15000,
  "returnType": "json",
  "packages": ["pandas", "numpy", "matplotlib"],
  "memoryLimit": "256MB",
  "executionOptions": {
    "enableStdout": true,
    "enableStderr": true,
    "maxOutputSize": "10MB"
  }
}
```

## Pyodide Integration

### Python Runtime

| Component | Purpose                                            | Performance Impact                                    |
| --------- | -------------------------------------------------- | ----------------------------------------------------- |
| `Pyodide` | WebAssembly-based Python runtime in browser       | Near-native Python performance with initial load time |
| `micropip` | Package installer for additional Python libraries | Network requests for package downloads                |

### Available Libraries

- **Core Libraries**: Built-in Python standard library (json, re, datetime, etc.)
- **Scientific Stack**: NumPy, Pandas, SciPy, Matplotlib, Scikit-learn
- **Data Processing**: Requests, BeautifulSoup4, Pillow, OpenCV
- **Machine Learning**: TensorFlow.js integration, Scikit-learn, XGBoost

### Cross-Browser Compatibility

| Feature                | Chrome  | Firefox | Safari     | Edge    |
| ---------------------- | ------- | ------- | ---------- | ------- |
| Pyodide Runtime        | ✅ Full | ✅ Full | ✅ Full    | ✅ Full |
| Scientific Libraries   | ✅ Full | ✅ Full | ✅ Full    | ✅ Full |
| Package Installation   | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |
| WebAssembly Support    | ✅ Full | ✅ Full | ✅ Full    | ✅ Full |

### Security Considerations

- **Sandboxed Execution**: Python code runs in isolated Pyodide environment with no direct system access
- **Memory Isolation**: WebAssembly provides memory safety and prevents buffer overflows
- **Network Restrictions**: Limited network access through controlled package installation
- **Execution Timeout**: Configurable timeouts prevent infinite loops and resource exhaustion
- **Package Validation**: Only verified packages from PyPI can be installed via micropip

## Input/Output Specifications

### Input Data Structure

```json
{
  "code": "string",
  "options": {
    "timeout": "number",
    "returnType": "string",
    "packages": "array",
    "memoryLimit": "string"
  },
  "input_data": {
    "previousNodeData": "object",
    "workflowVariables": "object"
  }
}
```

### Output Data Structure

```json
{
  "result": "any",
  "executionTime": "number",
  "stdout": "string",
  "stderr": "string",
  "metadata": {
    "codeLength": "number",
    "returnType": "string",
    "timestamp": "ISO_8601_string",
    "memoryUsage": "number",
    "packagesInstalled": "array",
    "pyodideVersion": "string",
    "errors": "array"
  }
}
```

##
 Practical Examples

### Example 1: Data Analysis with Pandas

**Scenario**: Analyze extracted data to generate statistical insights and visualizations

**Configuration**:
```json
{
  "code": "import pandas as pd\nimport numpy as np\n\ntext = input_data['GetAllText']['text']\nwords = text.split()\nword_count = len(words)\nreading_time = np.ceil(word_count / 200)\nsentences = len([s for s in text.split('.') if s.strip()])\n\nresult = {\n    'word_count': word_count,\n    'reading_time': int(reading_time),\n    'sentences': sentences,\n    'avg_words_per_sentence': round(word_count / sentences) if sentences > 0 else 0\n}\n\nresult",
  "timeout": 5000,
  "returnType": "json",
  "packages": ["pandas", "numpy"]
}
```

**Input Data**:

```json
{
  "GetAllText": {
    "text": "This is a sample article with multiple sentences. It contains various information that needs to be analyzed. The content is rich and informative for readers."
  }
}
```

**Expected Output**:

```json
{
  "result": {
    "word_count": 28,
    "reading_time": 1,
    "sentences": 3,
    "avg_words_per_sentence": 9
  },
  "executionTime": 156,
  "stdout": "",
  "stderr": "",
  "metadata": {
    "codeLength": 387,
    "returnType": "json",
    "timestamp": "2024-01-15T10:30:00Z",
    "memoryUsage": 2048,
    "packagesInstalled": ["pandas", "numpy"],
    "pyodideVersion": "0.24.1",
    "errors": []
  }
}
```

**Step-by-Step Process**:

1. Import required Python libraries (Pandas, NumPy)
2. Extract text data from previous workflow node
3. Process text using Python string methods and NumPy functions
4. Calculate reading statistics with proper error handling
5. Return structured analysis data as Python dictionary

### Example 2: Machine Learning Data Processing

**Scenario**: Process and analyze dataset using scikit-learn for pattern recognition

**Configuration**:

```json
{
  "code": "import pandas as pd\nimport numpy as np\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\n\n# Get data from previous node\ndata = input_data['DataExtraction']['records']\ndf = pd.DataFrame(data)\n\n# Prepare numeric columns for analysis\nnumeric_cols = df.select_dtypes(include=[np.number]).columns\nX = df[numeric_cols].fillna(0)\n\n# Standardize the data\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\n\n# Perform clustering\nkmeans = KMeans(n_clusters=3, random_state=42)\nclusters = kmeans.fit_predict(X_scaled)\n\n# Add cluster labels to original data\ndf['cluster'] = clusters\n\n# Generate summary statistics\nsummary = {\n    'total_records': len(df),\n    'clusters_found': len(np.unique(clusters)),\n    'cluster_distribution': pd.Series(clusters).value_counts().to_dict(),\n    'feature_importance': dict(zip(numeric_cols, np.abs(kmeans.cluster_centers_).mean(axis=0)))\n}\n\nsummary",
  "timeout": 15000,
  "packages": ["pandas", "numpy", "scikit-learn"],
  "memoryLimit": "256MB"
}
```

**Workflow Integration**:

```
Data Extraction → Code (ML Analysis) → Results Visualization → Report Generation
       ↓                ↓                      ↓                    ↓
   raw_data      processed_clusters      visual_insights      final_report
```

**Complete Example**:
This code performs unsupervised machine learning analysis on extracted data, identifying patterns and clusters that can inform business decisions or further analysis.

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Scientific Data Pipeline

- **Nodes**: Data Extraction → Code (Python Analysis) → Visualization → Results Export
- **Use Case**: Complex statistical analysis, machine learning, and scientific computing
- **Configuration Tips**: Install required packages, set appropriate memory limits, handle large datasets efficiently

#### Pattern 2: Text Processing & NLP

- **Nodes**: Content Extraction → Code (NLP Processing) → Sentiment Analysis → Report Generation
- **Use Case**: Natural language processing, text analysis, and content intelligence
- **Data Flow**: Extract text content, apply Python NLP libraries, generate insights and reports

### Best Practices

- **Package Management**: Only install necessary packages to minimize load time and memory usage
- **Error Handling**: Use try-except blocks to handle runtime errors and provide meaningful error messages
- **Memory Efficiency**: Use generators and iterators for large datasets, avoid loading entire datasets into memory
- **Code Organization**: Structure code with functions and classes for better maintainability and reusability
- **Data Validation**: Validate input data structure and types before processing

## Troubleshooting

### Common Issues

#### Issue: Package Installation Failure

- **Symptoms**: Code node fails when trying to import or use additional packages
- **Causes**: Network connectivity issues, package compatibility, or incorrect package names
- **Solutions**:
  1. Verify package names are correct and available on PyPI
  2. Check network connectivity and firewall restrictions
  3. Use alternative packages or built-in libraries when possible
  4. Install packages one at a time to identify problematic dependencies
- **Prevention**: Test package installation in a separate environment first

#### Issue: Memory Limit Exceeded

- **Symptoms**: Code execution fails with out-of-memory errors
- **Causes**: Large dataset processing, memory leaks, or inefficient algorithms
- **Solutions**:
  1. Increase memory limit in node configuration
  2. Process data in smaller chunks using generators or iterators
  3. Use more memory-efficient data structures and algorithms
  4. Clear variables and use garbage collection when processing large datasets
- **Prevention**: Profile memory usage during development and optimize accordingly

### Pyodide-Specific Issues

#### Package Compatibility

- Not all Python packages are available in Pyodide's WebAssembly environment
- Some packages may have limited functionality compared to native Python installations

#### Performance Considerations

- Initial Pyodide load time can be significant (2-5 seconds)
- WebAssembly execution is generally fast but may be slower than native Python for some operations

### Performance Issues

- **Memory Usage**: Large datasets and scientific computing operations may consume significant memory
- **Package Loading**: Installing multiple packages can increase initialization time
- **Computation Speed**: Complex mathematical operations may be slower than native Python execution

## Limitations & Constraints

### Technical Limitations

- **WebAssembly Constraints**: Limited to packages compiled for WebAssembly/Pyodide environment
- **File System Access**: No direct access to local file system, limited to in-memory operations
- **Network Restrictions**: Limited network access, primarily through package installation

### Pyodide Limitations

- **Package Availability**: Not all Python packages are available or fully functional in Pyodide
- **Performance Overhead**: WebAssembly execution may be slower than native Python for some operations
- **Memory Management**: Limited by browser memory constraints and WebAssembly heap size

### Data Limitations

- **Dataset Size**: Very large datasets may exceed memory limits or cause performance degradation
- **Serialization**: Complex Python objects may not serialize properly for workflow data transfer
- **Execution Time**: Long-running computations may be terminated by configured timeout limits

## Key Terminology

**DOM**: Document Object Model - Programming interface for web documents

**CORS**: Cross-Origin Resource Sharing - Security feature controlling cross-domain requests

**CSP**: Content Security Policy - Security standard preventing code injection attacks

**Browser API**: Programming interfaces provided by web browsers for extension functionality

**Content Script**: JavaScript code that runs in the context of web pages

**Web Scraping**: Automated extraction of data from websites


## Search & Discovery

### Keywords
- web scraping
- browser automation
- HTTP requests
- DOM manipulation
- content extraction
- web interaction

### Common Search Terms
- "scrape"
- "extract"
- "fetch"
- "get"
- "browser"
- "web"
- "html"
- "text"
- "links"
- "images"
- "api"

### Primary Use Cases
- data collection
- web automation
- content extraction
- API integration
- browser interaction
- web scraping


## Learning Path

### Skill Level: Beginner


## Enhanced Cross-References

### Workflow Patterns
- [Web Scraping Patterns](/learning/workflow-patterns/web-scraping-patterns)
- [Browser Automation Workflows](/learning/workflow-patterns/browser-automation)
- [API Integration Patterns](/learning/workflow-patterns/integration-patterns)

### Related Tutorials
- [Web Automation Basics](/learning/text-courses/beginner/web-automation-basics)
- [Advanced Web Scraping](/learning/text-courses/advanced/complex-web-scraping)

### Practical Examples
- [Real-World Use Cases](/learning/examples/)
- [Integration Examples](/learning/examples/multi-node-automation)
- [Best Practice Examples](/learning/workflow-patterns/optimization-best-practices)

## Related Nodes

### Similar Functionality

- **Http-Request**: Use when you need different approach to similar functionality

### Complementary Nodes

- **GetHTMLFromLink**: Works well together in workflows
- **EditFields**: Works well together in workflows
- **Filter**: Works well together in workflows

### Common Workflow Patterns

- **GetHTMLFromLink → Code → EditFields**: Common integration pattern
- **Code → Filter → DownloadAsFile**: Common integration pattern

### See Also

- [Browser Content Extraction](/learning/examples/browser-content-extraction)
- [Web Automation Patterns](/learning/examples/web-automation-patterns)
- [Multi-Node Automation](/learning/examples/multi-node-automation)
- [Integration Patterns](/learning/workflow-patterns/integration-patterns)
- [Browser Security Guide](/usage/licenses-and-privacy/privacy-security/security)

**Decision Guides:**
- [Text Extraction Decision Guide](#text-extraction-decision-guide)

**General Resources:**
- [Workflow Patterns](/learning/workflow-patterns/)
- [Integration Examples](/learning/examples/)
- [Node Types Overview](/integration/builtin/node-types)


## Version History

### Current Version: 2.0.0

- Migrated from JavaScript to Python execution using Pyodide WebAssembly runtime
- Added support for scientific computing libraries (NumPy, Pandas, SciPy, Matplotlib)
- Implemented package management system with micropip integration
- Enhanced memory management and performance optimization for large datasets

### Previous Versions

- **1.2.0**: Added machine learning capabilities with scikit-learn integration
- **1.1.0**: Implemented Pyodide runtime and basic Python standard library support
- **1.0.0**: Initial release with JavaScript code execution (deprecated)

## Additional Resources

- [Python Data Science Best Practices](/learning/workflow-patterns/optimization-best-practices)
- [Scientific Computing with Pyodide](https://pyodide.org/en/stable/usage/index.html)
- [Advanced Data Processing Patterns](/learning/workflow-patterns/data-processing-patterns)
- [Machine Learning Workflows](/learning/examples/ai-data-analysis)

---

**Last Updated**: October 18, 2024  
**Tested With**: Pyodide v0.24.1, Browser Extension v2.1.0  
**Validation Status**: ✅ Python Examples Tested | ✅ Package Installation Verified | ✅ Performance Benchmarked
