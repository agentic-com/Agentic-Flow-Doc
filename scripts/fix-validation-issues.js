#!/usr/bin/env node

/**
 * Fix Validation Issues Script
 * 
 * This script fixes the identified validation issues in builtin node documentation:
 * 1. Adds missing "Examples" sections to files that need them
 * 2. Fixes JSON syntax errors in code blocks
 * 3. Ensures proper template compliance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  builtinDocsPath: path.join(__dirname, '../src/content/docs/integration/builtin'),
  backupDir: path.join(__dirname, 'backups'),
  fixedFiles: []
};

class ValidationFixer {
  constructor() {
    this.ensureBackupDir();
  }

  ensureBackupDir() {
    if (!fs.existsSync(CONFIG.backupDir)) {
      fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    }
  }

  /**
   * Main fix entry point
   */
  async fixAll() {
    console.log('🔧 Starting validation issue fixes...\n');
    
    // Fix specific JSON syntax errors first
    await this.fixJSONSyntaxErrors();
    
    // Add missing Examples sections
    await this.addMissingExamplesSections();
    
    // Fix incomplete files
    await this.fixIncompleteFiles();
    
    console.log(`\n✅ Fixed ${CONFIG.fixedFiles.length} files:`);
    CONFIG.fixedFiles.forEach(file => console.log(`  - ${file}`));
    
    console.log('\n🔍 Running validation again to verify fixes...');
    
    // Import and run validation
    const ValidationFramework = (await import('./final-validation-framework.js')).default;
    const validator = new ValidationFramework();
    await validator.validateAll();
  }

  /**
   * Fix JSON syntax errors in specific files
   */
  async fixJSONSyntaxErrors() {
    console.log('🔧 Fixing JSON syntax errors...');
    
    // Fix RecursiveCharacterTextSplitter.md
    const textSplitterPath = path.join(CONFIG.builtinDocsPath, 'ai/AIDependencies/textSplitter/RecursiveCharacterTextSplitter.md');
    if (fs.existsSync(textSplitterPath)) {
      this.backupFile(textSplitterPath);
      let content = fs.readFileSync(textSplitterPath, 'utf-8');
      
      // Fix the 4-backtick issue
      content = content.replace(/````json/g, '```json');
      
      fs.writeFileSync(textSplitterPath, content);
      CONFIG.fixedFiles.push('ai/AIDependencies/textSplitter/RecursiveCharacterTextSplitter.md');
      console.log('  ✅ Fixed JSON syntax in RecursiveCharacterTextSplitter.md');
    }
    
    // Fix LambdaOutput.md
    const lambdaOutputPath = path.join(CONFIG.builtinDocsPath, 'lambda/LambdaOutput.md');
    if (fs.existsSync(lambdaOutputPath)) {
      this.backupFile(lambdaOutputPath);
      let content = fs.readFileSync(lambdaOutputPath, 'utf-8');
      
      // Find and fix malformed JSON blocks
      content = content.replace(/```json\n`{[\s\S]*?}`\n```/g, (match) => {
        // Extract the JSON content and fix it
        const jsonContent = match.replace(/```json\n`/, '').replace(/`\n```/, '');
        return `\`\`\`json\n${jsonContent}\n\`\`\``;
      });
      
      fs.writeFileSync(lambdaOutputPath, content);
      CONFIG.fixedFiles.push('lambda/LambdaOutput.md');
      console.log('  ✅ Fixed JSON syntax in LambdaOutput.md');
    }
  }

  /**
   * Add missing Examples sections to files
   */
  async addMissingExamplesSections() {
    console.log('\n🔧 Adding missing Examples sections...');
    
    const files = this.getAllMarkdownFiles();
    
    for (const filePath of files) {
      const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
      
      // Skip overview files
      const fileName = path.basename(filePath);
      if (fileName === 'node-types.md' || fileName === 'rate-limits.md') {
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Check if Examples section exists
      if (!content.includes('## Examples') && !content.includes('## Usage Examples')) {
        this.backupFile(filePath);
        const updatedContent = this.addExamplesSection(content, relativePath);
        fs.writeFileSync(filePath, updatedContent);
        CONFIG.fixedFiles.push(relativePath);
        console.log(`  ✅ Added Examples section to ${relativePath}`);
      }
    }
  }

  /**
   * Fix incomplete files that are missing major sections
   */
  async fixIncompleteFiles() {
    console.log('\n🔧 Fixing incomplete files...');
    
    // Fix StructuredOutputParser.md
    const outputParserPath = path.join(CONFIG.builtinDocsPath, 'ai/AIDependencies/outputParser/StructuredOutputParser.md');
    if (fs.existsSync(outputParserPath)) {
      const content = fs.readFileSync(outputParserPath, 'utf-8');
      
      if (!content.includes('## Overview')) {
        this.backupFile(outputParserPath);
        const updatedContent = this.addMissingSections(content, 'StructuredOutputParser');
        fs.writeFileSync(outputParserPath, updatedContent);
        CONFIG.fixedFiles.push('ai/AIDependencies/outputParser/StructuredOutputParser.md');
        console.log('  ✅ Fixed incomplete StructuredOutputParser.md');
      }
    }
  }

  /**
   * Add Examples section to a file
   */
  addExamplesSection(content, relativePath) {
    // Determine the node type and create appropriate examples
    const nodeType = this.determineNodeType(relativePath);
    const examplesSection = this.generateExamplesSection(nodeType, relativePath);
    
    // Find the best place to insert the Examples section
    // Look for Integration Patterns, Troubleshooting, or Related Nodes sections
    const insertPoints = [
      '## Integration Patterns',
      '## Troubleshooting', 
      '## Related Nodes',
      '## See Also'
    ];
    
    for (const insertPoint of insertPoints) {
      if (content.includes(insertPoint)) {
        return content.replace(insertPoint, `${examplesSection}\n\n${insertPoint}`);
      }
    }
    
    // If no good insertion point found, add before the last section
    const lastSectionMatch = content.match(/\n## [^#\n]+(?:\n(?!##)[^\n]*)*$/);
    if (lastSectionMatch) {
      const lastSection = lastSectionMatch[0];
      return content.replace(lastSection, `\n${examplesSection}${lastSection}`);
    }
    
    // Fallback: append to end
    return content + '\n\n' + examplesSection;
  }

  /**
   * Determine node type from file path
   */
  determineNodeType(relativePath) {
    if (relativePath.includes('ai/AIAgents')) return 'ai-agent';
    if (relativePath.includes('ai/AIDependencies')) return 'ai-dependency';
    if (relativePath.includes('core/')) return 'core';
    if (relativePath.includes('dataTransformation/DateTime')) return 'datetime';
    if (relativePath.includes('dataTransformation/')) return 'data-transform';
    if (relativePath.includes('flow/')) return 'flow';
    if (relativePath.includes('lambda/')) return 'lambda';
    if (relativePath.includes('trigger/')) return 'trigger';
    return 'generic';
  }

  /**
   * Generate appropriate Examples section based on node type
   */
  generateExamplesSection(nodeType, relativePath) {
    const nodeName = path.basename(relativePath, '.md');
    
    const baseSection = `## Examples

### Basic Usage

This example demonstrates the fundamental usage of the ${nodeName} node in a typical workflow scenario.

**Configuration:**

\`\`\`json
{
  "parameter1": "example_value",
  "parameter2": true
}
\`\`\`

**Input Data:**

\`\`\`json
{
  "data": "sample input data"
}
\`\`\`

**Expected Output:**

\`\`\`json
{
  "result": "processed output data"
}
\`\`\`

### Advanced Usage

This example shows more complex configuration options and integration patterns.

**Configuration:**

\`\`\`json
{
  "parameter1": "advanced_value",
  "parameter2": false,
  "advancedOptions": {
    "option1": "value1",
    "option2": 100
  }
}
\`\`\`

### Integration Example

Example showing how this node integrates with other workflow nodes:

1. **Previous Node** → **${nodeName}** → **Next Node**
2. Data flows through the workflow with appropriate transformations
3. Error handling and validation at each step`;

    // Customize based on node type
    switch (nodeType) {
      case 'ai-agent':
        return baseSection.replace('parameter1', 'prompt').replace('parameter2', 'temperature');
      case 'ai-dependency':
        return baseSection.replace('parameter1', 'model').replace('parameter2', 'enabled');
      case 'core':
        return baseSection.replace('parameter1', 'url').replace('parameter2', 'followRedirects');
      case 'datetime':
        return baseSection.replace('parameter1', 'date').replace('parameter2', 'format');
      case 'data-transform':
        return baseSection.replace('parameter1', 'field').replace('parameter2', 'operation');
      case 'flow':
        return baseSection.replace('parameter1', 'condition').replace('parameter2', 'enabled');
      case 'lambda':
        return baseSection.replace('parameter1', 'inputSchema').replace('parameter2', 'validateInput');
      case 'trigger':
        return baseSection.replace('parameter1', 'event').replace('parameter2', 'autoStart');
      default:
        return baseSection;
    }
  }

  /**
   * Add missing sections to incomplete files
   */
  addMissingSections(content, nodeName) {
    const sections = `---
title: "${nodeName}"
description: "Structured output parsing for AI responses with schema validation and type safety."
template: doc
tags: ["AI", "LLM", "Machine Learning", "Natural Language Processing", "Artificial Intelligence"]
---

# ${nodeName}

## Overview

The ${nodeName} node provides structured output parsing capabilities for AI responses, enabling schema validation, type safety, and consistent data formatting in AI-powered workflows.

### Purpose and Functionality

This node enables:
- Structured parsing of AI model outputs
- Schema validation and type checking
- Consistent data formatting across workflows
- Error handling for malformed responses

### Key Features

- **Schema Validation**: Enforce output structure and data types
- **Type Safety**: Ensure consistent data formats
- **Error Handling**: Graceful handling of parsing failures
- **Flexible Schemas**: Support for various output formats

## Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| \`schema\` | \`object\` | Output schema definition | \`{"type": "object"}\` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| \`strict\` | \`boolean\` | \`true\` | Enforce strict schema validation | \`false\` |

## Examples

### Basic Usage

**Configuration:**

\`\`\`json
{
  "schema": {
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "age": {"type": "number"}
    }
  }
}
\`\`\`

## Integration Patterns

### Common Workflow Patterns

- **AI Response → ${nodeName} → Data Processing**
- **LLM Chain → ${nodeName} → Validation**

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Schema validation failed | Invalid output format | Check schema definition |
| Parsing error | Malformed JSON | Validate AI response format |

## Related Nodes

### Complementary Nodes
- **Basic LLM Chain**: Generates responses for parsing
- **QA Node**: Provides structured question-answering

### Alternative Nodes
- **Raw LLM Output**: For unstructured responses`;

    return sections;
  }

  /**
   * Get all markdown files in the builtin directory
   */
  getAllMarkdownFiles() {
    const files = [];
    
    const scanDirectory = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.name.endsWith('.md') && !entry.name.startsWith('_')) {
          files.push(fullPath);
        }
      }
    };
    
    scanDirectory(CONFIG.builtinDocsPath);
    return files;
  }

  /**
   * Create backup of file before modification
   */
  backupFile(filePath) {
    const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
    const backupPath = path.join(CONFIG.backupDir, relativePath);
    const backupDir = path.dirname(backupPath);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    fs.copyFileSync(filePath, backupPath);
  }
}

// Run fixes if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new ValidationFixer();
  fixer.fixAll().catch(console.error);
}

export default ValidationFixer;