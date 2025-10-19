#!/usr/bin/env node

/**
 * Final Validation Framework for Builtin Node Documentation
 * 
 * This script performs comprehensive validation of all builtin node documentation
 * including template compliance, content quality, code examples, and cross-references.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  builtinDocsPath: path.join(__dirname, '../src/content/docs/integration/builtin'),
  outputDir: path.join(__dirname, 'reports'),
  requiredSections: [
    'Overview',
    'Parameters',
    'Examples',
    'Integration Patterns',
    'Troubleshooting',
    'Related Nodes'
  ],
  requiredSubsections: [
    'Purpose and Functionality',
    'Key Features'
  ],
  optionalSections: [
    'Browser-Specific Considerations',
    'Browser Permissions',
    'Performance Considerations',
    'Security Considerations',
    'Input Data Structure',
    'Output Data Structure',
    'Usage Examples'
  ]
};

class ValidationFramework {
  constructor() {
    this.results = {
      templateCompliance: [],
      contentQuality: [],
      codeExamples: [],
      crossReferences: [],
      technicalAccuracy: [],
      summary: {
        totalFiles: 0,
        passedFiles: 0,
        failedFiles: 0,
        warnings: 0,
        errors: 0
      }
    };
    
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
  }

  /**
   * Main validation entry point
   */
  async validateAll() {
    console.log('🔍 Starting comprehensive validation of builtin node documentation...\n');
    
    const files = this.getAllMarkdownFiles();
    this.results.summary.totalFiles = files.length;
    
    console.log(`Found ${files.length} documentation files to validate\n`);
    
    for (const filePath of files) {
      await this.validateFile(filePath);
    }
    
    this.generateSummaryReport();
    this.saveResults();
    
    console.log('\n✅ Validation complete! Check reports directory for detailed results.');
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
   * Validate a single file
   */
  async validateFile(filePath) {
    const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
    console.log(`📄 Validating: ${relativePath}`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fileResult = {
        path: relativePath,
        fullPath: filePath,
        errors: [],
        warnings: [],
        passed: true
      };
      
      // Run all validation checks
      this.validateTemplateCompliance(content, fileResult);
      this.validateContentQuality(content, fileResult);
      this.validateCodeExamples(content, fileResult);
      this.validateCrossReferences(content, fileResult);
      this.validateTechnicalAccuracy(content, fileResult);
      
      // Update summary
      if (fileResult.errors.length > 0) {
        fileResult.passed = false;
        this.results.summary.failedFiles++;
        this.results.summary.errors += fileResult.errors.length;
      } else {
        this.results.summary.passedFiles++;
      }
      
      this.results.summary.warnings += fileResult.warnings.length;
      
      // Store results
      this.results.templateCompliance.push(fileResult);
      
    } catch (error) {
      console.error(`❌ Error validating ${relativePath}: ${error.message}`);
      this.results.summary.failedFiles++;
      this.results.summary.errors++;
    }
  }

  /**
   * Validate template compliance
   */
  validateTemplateCompliance(content, fileResult) {
    // Check frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      fileResult.errors.push('Missing frontmatter');
    } else {
      const frontmatter = frontmatterMatch[1];
      if (!frontmatter.includes('title:')) {
        fileResult.errors.push('Missing title in frontmatter');
      }
      if (!frontmatter.includes('description:')) {
        fileResult.errors.push('Missing description in frontmatter');
      }
    }
    
    // Skip validation for overview files (node-types.md, rate-limits.md)
    const fileName = fileResult.path.split('/').pop();
    if (fileName === 'node-types.md' || fileName === 'rate-limits.md') {
      // These are overview files with different structure
      if (!content.includes('## ')) {
        fileResult.warnings.push('Overview file should have section headers');
      }
      return;
    }
    
    // Check required sections for node documentation
    for (const section of CONFIG.requiredSections) {
      const sectionRegex = new RegExp(`^##\\s+${section}`, 'm');
      if (!sectionRegex.test(content)) {
        fileResult.errors.push(`Missing required section: ${section}`);
      }
    }
    
    // Check required subsections under Overview
    const overviewMatch = content.match(/^##\s+Overview([\s\S]*?)(?=^##|$)/m);
    if (overviewMatch) {
      const overviewContent = overviewMatch[1];
      for (const subsection of CONFIG.requiredSubsections) {
        const subsectionRegex = new RegExp(`^###\\s+${subsection}`, 'm');
        if (!subsectionRegex.test(overviewContent)) {
          fileResult.warnings.push(`Missing recommended subsection under Overview: ${subsection}`);
        }
      }
    }
    
    // Check for proper heading hierarchy
    const headings = content.match(/^#+\s+.+$/gm) || [];
    let previousLevel = 0;
    
    for (const heading of headings) {
      const level = heading.match(/^#+/)[0].length;
      if (level > previousLevel + 1) {
        fileResult.warnings.push(`Heading hierarchy skip detected: ${heading.trim()}`);
      }
      previousLevel = level;
    }
  }

  /**
   * Validate content quality
   */
  validateContentQuality(content, fileResult) {
    // Check for placeholder content
    const placeholders = ['TODO', 'TBD', 'PLACEHOLDER', 'simple', 'basic'];
    for (const placeholder of placeholders) {
      if (content.toLowerCase().includes(placeholder.toLowerCase())) {
        fileResult.warnings.push(`Potential placeholder content found: ${placeholder}`);
      }
    }
    
    // Check content length
    const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    if (contentWithoutFrontmatter.length < 1000) {
      fileResult.warnings.push('Content appears to be very short (< 1000 characters)');
    }
    
    // Check for examples
    if (!content.includes('```') && !content.includes('Example')) {
      fileResult.warnings.push('No code examples or usage examples found');
    }
    
    // Check for parameter documentation
    if (content.includes('Parameters') && !content.includes('|')) {
      fileResult.warnings.push('Parameters section exists but no table format detected');
    }
  }

  /**
   * Validate code examples
   */
  validateCodeExamples(content, fileResult) {
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    
    for (const block of codeBlocks) {
      // Check for language specification
      const firstLine = block.split('\n')[0];
      if (firstLine === '```') {
        fileResult.warnings.push('Code block without language specification');
      }
      
      // Check for JSON syntax in JSON blocks
      if (firstLine.includes('json')) {
        const jsonContent = block.replace(/```json\n/, '').replace(/\n```$/, '');
        try {
          JSON.parse(jsonContent);
        } catch (error) {
          fileResult.errors.push(`Invalid JSON syntax in code block: ${error.message}`);
        }
      }
      
      // Check for JavaScript syntax issues (basic)
      if (firstLine.includes('javascript') || firstLine.includes('js')) {
        const jsContent = block.replace(/```(javascript|js)\n/, '').replace(/\n```$/, '');
        // Basic syntax checks
        if (jsContent.includes('function') && !jsContent.includes('{')) {
          fileResult.warnings.push('Potential JavaScript syntax issue in code block');
        }
      }
    }
  }

  /**
   * Validate cross-references and links
   */
  validateCrossReferences(content, fileResult) {
    // Check for internal links
    const internalLinks = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
    
    for (const link of internalLinks) {
      const urlMatch = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (urlMatch) {
        const url = urlMatch[2];
        
        // Check for relative links to other docs
        if (url.startsWith('/') || url.startsWith('../') || url.startsWith('./')) {
          // This would need actual file system checking in a real implementation
          // For now, just check format
          if (!url.includes('.md') && !url.includes('.html') && !url.startsWith('/')) {
            fileResult.warnings.push(`Potentially invalid internal link: ${url}`);
          }
        }
        
        // Check for broken anchor links
        if (url.includes('#')) {
          const anchor = url.split('#')[1];
          if (anchor && !content.toLowerCase().includes(anchor.toLowerCase().replace(/-/g, ' '))) {
            fileResult.warnings.push(`Potentially broken anchor link: ${url}`);
          }
        }
      }
    }
    
    // Check for "Related Nodes" section content
    const relatedNodesMatch = content.match(/##\s+Related Nodes([\s\S]*?)(?=##|$)/);
    if (relatedNodesMatch) {
      const relatedContent = relatedNodesMatch[1];
      if (relatedContent.trim().length < 50) {
        fileResult.warnings.push('Related Nodes section appears to be incomplete');
      }
    }
  }

  /**
   * Validate technical accuracy
   */
  validateTechnicalAccuracy(content, fileResult) {
    // Check for browser API references
    const browserAPIs = [
      'chrome.tabs', 'chrome.storage', 'chrome.runtime',
      'browser.tabs', 'browser.storage', 'browser.runtime',
      'document.querySelector', 'window.location', 'fetch'
    ];
    
    let hasAPIReferences = false;
    for (const api of browserAPIs) {
      if (content.includes(api)) {
        hasAPIReferences = true;
        break;
      }
    }
    
    // If this appears to be a browser extension node, check for security considerations
    if (hasAPIReferences || content.toLowerCase().includes('browser') || content.toLowerCase().includes('extension')) {
      if (!content.toLowerCase().includes('permission') && !content.toLowerCase().includes('security')) {
        fileResult.warnings.push('Browser extension node missing security/permission documentation');
      }
    }
    
    // Check for outdated patterns
    const outdatedPatterns = [
      'XMLHttpRequest', // Should use fetch
      'var ', // Should use const/let
      'function()', // Should use arrow functions in examples
    ];
    
    for (const pattern of outdatedPatterns) {
      if (content.includes(pattern)) {
        fileResult.warnings.push(`Potentially outdated pattern found: ${pattern}`);
      }
    }
  }

  /**
   * Generate summary report
   */
  generateSummaryReport() {
    const { summary } = this.results;
    const successRate = ((summary.passedFiles / summary.totalFiles) * 100).toFixed(1);
    
    console.log('\n📊 VALIDATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total files validated: ${summary.totalFiles}`);
    console.log(`✅ Passed: ${summary.passedFiles} (${successRate}%)`);
    console.log(`❌ Failed: ${summary.failedFiles}`);
    console.log(`⚠️  Total warnings: ${summary.warnings}`);
    console.log(`🚨 Total errors: ${summary.errors}`);
    
    if (summary.failedFiles > 0) {
      console.log('\n❌ Files with errors:');
      this.results.templateCompliance
        .filter(result => !result.passed)
        .forEach(result => {
          console.log(`  - ${result.path} (${result.errors.length} errors)`);
        });
    }
  }

  /**
   * Save validation results to files
   */
  saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save detailed results
    const detailedReport = {
      timestamp: new Date().toISOString(),
      summary: this.results.summary,
      results: this.results.templateCompliance
    };
    
    fs.writeFileSync(
      path.join(CONFIG.outputDir, `final-validation-detailed-${timestamp}.json`),
      JSON.stringify(detailedReport, null, 2)
    );
    
    // Save summary report
    const summaryText = this.generateTextSummary();
    fs.writeFileSync(
      path.join(CONFIG.outputDir, `final-validation-summary-${timestamp}.txt`),
      summaryText
    );
    
    console.log(`\n📁 Reports saved to: ${CONFIG.outputDir}`);
  }

  /**
   * Generate text summary for easy reading
   */
  generateTextSummary() {
    const { summary } = this.results;
    let text = 'BUILTIN NODE DOCUMENTATION VALIDATION SUMMARY\n';
    text += '='.repeat(50) + '\n\n';
    
    text += `Validation Date: ${new Date().toISOString()}\n`;
    text += `Total Files: ${summary.totalFiles}\n`;
    text += `Passed: ${summary.passedFiles}\n`;
    text += `Failed: ${summary.failedFiles}\n`;
    text += `Warnings: ${summary.warnings}\n`;
    text += `Errors: ${summary.errors}\n\n`;
    
    // Group results by category
    const categories = {};
    this.results.templateCompliance.forEach(result => {
      const category = result.path.split('/')[0];
      if (!categories[category]) categories[category] = [];
      categories[category].push(result);
    });
    
    text += 'RESULTS BY CATEGORY:\n';
    text += '-'.repeat(30) + '\n';
    
    for (const [category, results] of Object.entries(categories)) {
      const passed = results.filter(r => r.passed).length;
      const total = results.length;
      text += `${category}: ${passed}/${total} passed\n`;
      
      // List failed files
      const failed = results.filter(r => !r.passed);
      if (failed.length > 0) {
        failed.forEach(f => {
          text += `  ❌ ${f.path}\n`;
          f.errors.forEach(error => text += `     - ${error}\n`);
        });
      }
    }
    
    return text;
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ValidationFramework();
  validator.validateAll().catch(console.error);
}

export default ValidationFramework;