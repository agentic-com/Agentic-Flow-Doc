# Content Analysis and Transformation Infrastructure

This directory contains the infrastructure for analyzing and transforming the documentation from n8n.io format to `Agentic WorkFlow` browser extension format.

## Scripts Overview

### 1. Content Analysis (`content-analysis.js`)
Scans all documentation files and creates a comprehensive inventory with categorization.

**Features:**
- Recursive scanning of all markdown files
- Content type classification (usage, integration, advanced-ai, learning)
- Priority calculation based on transformation needs
- Detection of n8n references, server-specific content, and browser extension nodes
- Statistical analysis and reporting

**Usage:**
```bash
bun run analyze-content
# or
node scripts/content-analysis.js
```

**Output:** `content-analysis-results.json`

### 2. Pattern Detection (`pattern-detection.js`)
Automated detection of n8n references and server-specific content with transformation suggestions.

**Features:**
- Pattern matching for product names, server-specific terms, and browser extension content
- Transformation rule suggestions with confidence scores
- Risk assessment for complex transformations
- Priority calculation for transformation order

**Usage:**
```bash
bun run detect-patterns
# or
node scripts/pattern-detection.js
```

**Output:** `pattern-detection-results.json`

### 3. Validation Framework (`validation-framework.js`)
Comprehensive validation of content accuracy and consistency.

**Features:**
- Terminology consistency checking
- Browser extension context validation
- Link validity verification
- Code example browser compatibility checking
- Frontmatter schema validation
- Security considerations validation

**Usage:**
```bash
bun run validate-content
# or
node scripts/validation-framework.js
```

**Output:** `validation-results.json`

### 4. Content Transformation Orchestrator (`content-transformation.js`)
Main orchestration script that runs all analysis components and generates comprehensive reports.

**Features:**
- Coordinates all analysis tools
- Generates comprehensive transformation summary
- Provides actionable recommendations
- Creates detailed next steps plan
- Exports timestamped results

**Usage:**
```bash
bun run transform-analysis
# or
node scripts/content-transformation.js
```

**Output:** Multiple timestamped JSON files with complete analysis

## Analysis Results Structure

### Content Analysis Results
```json
{
  "inventory": [
    {
      "path": "src/content/docs/usage/index.md",
      "title": "Usage Guide",
      "description": "How to use the platform",
      "contentType": "usage",
      "transformationPriority": "high",
      "browserSpecific": false,
      "hasCodeExamples": true,
      "requiresAssetUpdate": false,
      "n8nReferences": ["n8n", "n8n.io"],
      "serverSpecificContent": ["server deployment"],
      "browserExtensionNodes": [],
      "customizationStatus": "pending",
      "wordCount": 1250,
      "lastModified": "2024-01-15T10:30:00Z"
    }
  ],
  "statistics": {
    "totalFiles": 150,
    "markdownFiles": 145,
    "highPriority": 25,
    "mediumPriority": 60,
    "lowPriority": 60
  }
}
```

### Pattern Detection Results
```json
[
  {
    "filePath": "src/content/docs/usage/index.md",
    "n8nReferences": [
      {
        "text": "n8n",
        "pattern": "\\bn8n\\b",
        "line": 15
      }
    ],
    "serverSpecificContent": [...],
    "browserExtensionContent": [...],
    "suggestedTransformations": [
      {
        "pattern": "\\bn8n\\b",
        "replacement": "`Agentic WorkFlow`",
        "category": "product-name",
        "context": "global",
        "matches": 5,
        "confidence": 0.9
      }
    ],
    "riskAssessment": [...],
    "priority": "high"
  }
]
```

### Validation Results
```json
{
  "validationResults": [
    {
      "filePath": "src/content/docs/usage/index.md",
      "passed": false,
      "errors": [
        {
          "message": "Deprecated term 'n8n' found",
          "line": 15,
          "suggestion": "Use '`Agentic WorkFlow`' instead"
        }
      ],
      "warnings": [...],
      "validationResults": [...]
    }
  ],
  "summary": {
    "totalFiles": 150,
    "passedValidation": 120,
    "failedValidation": 30,
    "warnings": 45,
    "errors": 15
  }
}
```

## Transformation Priority Levels

### Critical Priority
- Main landing pages (index.mdx, usage/index.md)
- Getting started guides
- Installation documentation
- Files with >10 n8n references

### High Priority
- Integration documentation
- Browser extension node documentation
- Tutorial and example content
- Files with 5-10 n8n references

### Medium Priority
- Advanced AI documentation
- Learning materials
- Files with 1-5 n8n references
- Files with server-specific content

### Low Priority
- Reference documentation
- Release notes
- Community guidelines
- Files with minimal transformation needs

## Validation Rules

### Error-Level Rules
1. **Terminology Consistency**: No deprecated terms (n8n, server deployment, etc.)
2. **Browser Context**: Content appropriate for browser extension context
3. **Code Examples**: Browser-compatible code patterns
4. **Browser Nodes**: Accurate documentation of extension capabilities

### Warning-Level Rules
1. **Link Validity**: Internal links and references work correctly
2. **Frontmatter**: Proper schema and required fields
3. **Security**: Appropriate security considerations documented
4. **Completeness**: Adequate content depth and coverage

## Usage Workflow

1. **Initial Analysis**: Run the complete transformation analysis
   ```bash
   bun run transform-analysis
   ```

2. **Review Results**: Examine the generated JSON files and console output

3. **Prioritize Work**: Use the priority classifications to plan transformation order

4. **Validate Progress**: Re-run validation as you make changes
   ```bash
   bun run validate-content
   ```

5. **Monitor Quality**: Use the analysis tools to track transformation progress

## Integration with Development Workflow

These scripts are designed to integrate with the existing Astro/Starlight documentation build process:

- Run before major content updates
- Use in CI/CD pipelines for quality assurance
- Generate reports for content review processes
- Track transformation progress over time

## Extending the Framework

### Adding New Validation Rules
Add rules to the `validationRules` array in `validation-framework.js`:

```javascript
{
  name: 'custom-rule',
  description: 'Custom validation rule',
  severity: 'error',
  validator: this.customValidator.bind(this)
}
```

### Adding New Pattern Detection
Add patterns to the `transformationRules` array in `pattern-detection.js`:

```javascript
{
  pattern: /custom-pattern/g,
  replacement: 'replacement-text',
  context: 'global',
  category: 'custom-category',
  validation: (content) => true
}
```

### Custom Analysis Metrics
Extend the `ContentAnalyzer` class to add custom metrics and categorization logic.

## Troubleshooting

### Common Issues

1. **File Permission Errors**: Ensure scripts have execute permissions
2. **Module Import Errors**: Verify Node.js version supports ES modules
3. **Memory Issues**: For large documentation sets, consider processing in batches
4. **Path Resolution**: Ensure scripts are run from project root directory

### Performance Optimization

- Use the individual scripts for targeted analysis
- Process high-priority files first
- Cache analysis results for incremental updates
- Use the batch processing features for large file sets
##
 Additional Maintenance Scripts

### Cross-Reference Validation (`cross-reference-validation.js`)
Validates internal links and navigation consistency across the documentation.

**Features:**
- Discovers all documentation files
- Extracts and validates internal links
- Checks navigation consistency
- Validates meta files and structure
- Identifies browser extension specific content issues

**Usage:**
```bash
node scripts/cross-reference-validation.js
```

**Output:** `cross-reference-validation-[timestamp].json`

### Build Validation (`build-validation.js`)
Tests the site build process and validates deployment readiness.

**Features:**
- Cleans and rebuilds the site
- Validates build output structure
- Analyzes build warnings and errors
- Checks critical files existence
- Validates asset optimization

**Usage:**
```bash
node scripts/build-validation.js
```

**Output:** `build-validation-[timestamp].json`

### Frontmatter Fix (`fix-frontmatter-issues.js`)
Automatically fixes frontmatter issues and missing metadata.

**Features:**
- Detects missing frontmatter
- Fixes corrupted frontmatter from text replacement
- Adds missing required fields
- Generates titles from file paths
- Maintains content schema compliance

**Usage:**
```bash
node scripts/fix-frontmatter-issues.js
```

### Maintenance Runner (`maintenance-runner.js`)
Unified interface for orchestrating all maintenance tasks.

**Features:**
- Runs tasks by frequency (daily, weekly, monthly)
- Supports critical-only task execution
- Provides dry-run capability
- Generates comprehensive reports
- CLI interface with multiple options

**Usage:**
```bash
# Run critical tasks only
node scripts/maintenance-runner.js --critical

# Run daily maintenance
node scripts/maintenance-runner.js --frequency daily

# Run specific tasks
node scripts/maintenance-runner.js --tasks cross-reference-validation,build-validation

# List available tasks
node scripts/maintenance-runner.js --list
```

**Output:** `maintenance-report-[timestamp].json`

## Maintenance Schedule

### Daily Tasks
- Cross-reference validation
- Build validation

### Weekly Tasks  
- Content analysis
- Technical accuracy review
- Link checking

### Monthly Tasks
- Comprehensive validation
- Full content audit

### As-Needed Tasks
- Frontmatter fixes
- Content transformation
- Asset updates

## Content Maintenance Guidelines

For detailed maintenance procedures and guidelines, see `CONTENT_MAINTENANCE_GUIDELINES.md` in the project root directory. This document provides:

- Content update processes
- Guidelines for adding new features
- Review processes and quality standards
- Troubleshooting common issues
- Tool usage instructions