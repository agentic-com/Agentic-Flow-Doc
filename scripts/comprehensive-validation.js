#!/usr/bin/env node

import { ValidationFramework } from './validation-framework.js';
import { LinkChecker } from './link-checker.js';
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Comprehensive Validation Runner
 * Runs all validation checks and generates consolidated report
 */

class ComprehensiveValidator {
  constructor() {
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.results = {
      timestamp: this.timestamp,
      summary: {
        totalChecks: 0,
        passedChecks: 0,
        failedChecks: 0,
        totalIssues: 0
      },
      validationFramework: null,
      linkChecker: null,
      codeExamples: null,
      terminologyCheck: null
    };
  }

  /**
   * Run all validation checks
   */
  async runAllValidations() {
    console.log('🚀 Starting comprehensive documentation validation...\n');

    try {
      // 1. Run validation framework
      console.log('1️⃣ Running content validation framework...');
      const validator = new ValidationFramework();
      this.results.validationFramework = await validator.validateDocumentation();
      this.updateSummary('Content Validation', this.results.validationFramework.summary);

      // 2. Run link checker
      console.log('\n2️⃣ Running link validation...');
      const linkChecker = new LinkChecker();
      this.results.linkChecker = await linkChecker.checkAllLinks();
      this.updateSummary('Link Validation', {
        totalFiles: this.results.linkChecker.totalLinks,
        passedValidation: this.results.linkChecker.validLinks,
        failedValidation: this.results.linkChecker.brokenLinks,
        errors: this.results.linkChecker.brokenLinks,
        warnings: this.results.linkChecker.issues.length - this.results.linkChecker.brokenLinks
      });

      // 3. Run code example validation
      console.log('\n3️⃣ Running code example validation...');
      this.results.codeExamples = await this.validateCodeExamples();
      this.updateSummary('Code Examples', this.results.codeExamples);

      // 4. Run terminology consistency check
      console.log('\n4️⃣ Running terminology consistency check...');
      this.results.terminologyCheck = await this.validateTerminologyConsistency();
      this.updateSummary('Terminology', this.results.terminologyCheck);

      // Generate final report
      await this.generateFinalReport();

    } catch (error) {
      console.error('❌ Validation failed:', error);
      throw error;
    }
  }

  /**
   * Update summary statistics
   */
  updateSummary(checkName, checkResults) {
    this.results.summary.totalChecks++;
    
    if (checkResults.passedValidation === checkResults.totalFiles || 
        checkResults.errors === 0) {
      this.results.summary.passedChecks++;
    } else {
      this.results.summary.failedChecks++;
    }
    
    this.results.summary.totalIssues += (checkResults.errors || 0) + (checkResults.warnings || 0);
    
    console.log(`   ✅ ${checkName}: ${checkResults.passedValidation || 0}/${checkResults.totalFiles || 0} passed`);
  }

  /**
   * Validate code examples for browser extension compatibility
   */
  async validateCodeExamples() {
    const results = {
      totalFiles: 0,
      passedValidation: 0,
      failedValidation: 0,
      errors: 0,
      warnings: 0,
      issues: []
    };

    try {
      // Check specific browser extension node documentation
      const browserNodeFiles = [
        'src/content/docs/integration/extension/GetSelectedText.md',
        'src/content/docs/integration/extension/GetAllText.md',
        'src/content/docs/integration/extension/GetAllHTML.md',
        'src/content/docs/integration/extension/GetHTMLofSelectedText.md',
        'src/content/docs/integration/extension/GetAllLinks.md',
        'src/content/docs/integration/extension/GetAllImages.md'
      ];

      for (const filePath of browserNodeFiles) {
        results.totalFiles++;
        
        try {
          const fullPath = join(__dirname, '..', filePath);
          const content = await readFile(fullPath, 'utf-8');
          
          const fileIssues = await this.validateFileCodeExamples(content, filePath);
          
          if (fileIssues.length === 0) {
            results.passedValidation++;
          } else {
            results.failedValidation++;
            results.errors += fileIssues.filter(i => i.severity === 'error').length;
            results.warnings += fileIssues.filter(i => i.severity === 'warning').length;
            results.issues.push(...fileIssues);
          }
        } catch (error) {
          results.failedValidation++;
          results.errors++;
          results.issues.push({
            file: filePath,
            severity: 'error',
            message: `Failed to validate file: ${error.message}`
          });
        }
      }

    } catch (error) {
      console.error('Code example validation failed:', error);
    }

    return results;
  }

  /**
   * Validate code examples in a specific file
   */
  async validateFileCodeExamples(content, filePath) {
    const issues = [];
    
    // Find code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'unknown';
      const code = match[2];
      
      // Check for browser extension compatibility
      if (language === 'javascript' || language === 'typescript' || language === 'json') {
        // Check for browser API usage (good)
        const hasBrowserAPIs = /\b(document\.|window\.|chrome\.|browser\.|DOM)/i.test(code);
        
        // Check for Node.js patterns (potentially problematic)
        const hasNodePatterns = /\b(require\(|import.*from ['"]fs['"]|process\.env|__dirname|__filename)/i.test(code);
        
        // Check for server-specific patterns
        const hasServerPatterns = /\b(express|koa|fastify|http\.createServer|docker|kubectl)/i.test(code);
        
        if (hasServerPatterns) {
          issues.push({
            file: filePath,
            severity: 'error',
            message: 'Code example contains server-specific patterns not suitable for browser extension',
            code: code.substring(0, 100) + '...'
          });
        } else if (hasNodePatterns && !hasBrowserAPIs) {
          issues.push({
            file: filePath,
            severity: 'warning',
            message: 'Code example uses Node.js patterns that may not work in browser extension context',
            code: code.substring(0, 100) + '...'
          });
        } else if (!hasBrowserAPIs && filePath.includes('/extension/')) {
          issues.push({
            file: filePath,
            severity: 'warning',
            message: 'Browser extension node documentation should include browser API usage examples',
            suggestion: 'Add examples showing DOM manipulation or browser API usage'
          });
        }
      }
    }
    
    return issues;
  }

  /**
   * Validate terminology consistency across all documentation
   */
  async validateTerminologyConsistency() {
    const results = {
      totalFiles: 0,
      passedValidation: 0,
      failedValidation: 0,
      errors: 0,
      warnings: 0,
      issues: []
    };

    const terminologyRules = {
      // Product name consistency
      productName: {
        correct: 'Agentic WorkFlow',
        variations: [
          /Agentic WorkFlow/gi,
          /Agentic WorkFlow/gi,
          /Agentic WorkFlow/gi,
          /Agentic WorkFlow/gi
        ]
      },
      // Deprecated terms that should be replaced
      deprecated: {
        'n8n': 'Agentic WorkFlow',
        'n8n.io': 'Agentic WorkFlow documentation',
        'self-hosted': 'browser-based',
        'server deployment': 'browser extension installation',
        'docker container': 'browser extension',
        'production server': 'browser environment'
      },
      // Browser extension specific terms
      browserTerms: [
        'browser extension',
        'browser context',
        'DOM manipulation',
        'content script',
        'browser API',
        'extension nodes'
      ]
    };

    try {
      const docsPath = join(__dirname, '../src/content/docs');
      await this.checkTerminologyInDirectory(docsPath, terminologyRules, results);
    } catch (error) {
      console.error('Terminology validation failed:', error);
    }

    return results;
  }

  /**
   * Check terminology in directory recursively
   */
  async checkTerminologyInDirectory(dirPath, rules, results) {
    const { readdir, stat } = await import('fs/promises');
    
    try {
      const entries = await readdir(dirPath);
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          await this.checkTerminologyInDirectory(fullPath, rules, results);
        } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
          results.totalFiles++;
          
          try {
            const content = await readFile(fullPath, 'utf-8');
            const relativePath = fullPath.replace(join(__dirname, '..'), '');
            
            const fileIssues = this.checkFileTerminology(content, relativePath, rules);
            
            if (fileIssues.length === 0) {
              results.passedValidation++;
            } else {
              results.failedValidation++;
              results.errors += fileIssues.filter(i => i.severity === 'error').length;
              results.warnings += fileIssues.filter(i => i.severity === 'warning').length;
              results.issues.push(...fileIssues);
            }
          } catch (error) {
            results.failedValidation++;
            results.errors++;
            results.issues.push({
              file: fullPath.replace(join(__dirname, '..'), ''),
              severity: 'error',
              message: `Failed to check terminology: ${error.message}`
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error checking terminology in ${dirPath}:`, error);
    }
  }

  /**
   * Check terminology in specific file
   */
  checkFileTerminology(content, filePath, rules) {
    const issues = [];
    
    // Check for deprecated terms
    Object.entries(rules.deprecated).forEach(([deprecated, replacement]) => {
      const regex = new RegExp(`\\b${deprecated}\\b`, 'gi');
      const matches = content.match(regex);
      
      if (matches) {
        issues.push({
          file: filePath,
          severity: 'error',
          message: `Deprecated term "${deprecated}" found ${matches.length} times`,
          suggestion: `Replace with "${replacement}"`
        });
      }
    });

    // Check product name variations
    rules.productName.variations.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (match !== rules.productName.correct) {
            issues.push({
              file: filePath,
              severity: 'warning',
              message: `Inconsistent product name: "${match}"`,
              suggestion: `Use "${rules.productName.correct}"`
            });
          }
        });
      }
    });

    // Check for browser extension context (for integration docs)
    if (filePath.includes('/integration/') && !filePath.includes('/extension/')) {
      const hasBrowserContext = rules.browserTerms.some(term => 
        content.toLowerCase().includes(term.toLowerCase())
      );
      
      if (!hasBrowserContext) {
        issues.push({
          file: filePath,
          severity: 'warning',
          message: 'Integration documentation should mention browser extension context',
          suggestion: 'Add explanation of browser extension usage'
        });
      }
    }

    return issues;
  }

  /**
   * Generate final validation report
   */
  async generateFinalReport() {
    const reportPath = `scripts/reports/validation-report-${this.timestamp}.json`;
    const summaryPath = `scripts/reports/validation-summary-${this.timestamp}.txt`;
    
    // Generate JSON report
    await writeFile(reportPath, JSON.stringify(this.results, null, 2));
    
    // Generate human-readable summary
    const summary = this.generateTextSummary();
    await writeFile(summaryPath, summary);
    
    console.log('\n📋 COMPREHENSIVE VALIDATION SUMMARY');
    console.log('=' .repeat(60));
    console.log(summary);
    console.log(`\n💾 Detailed results: ${reportPath}`);
    console.log(`📄 Summary report: ${summaryPath}`);
    
    // Return overall status
    return this.results.summary.failedChecks === 0;
  }

  /**
   * Generate text summary
   */
  generateTextSummary() {
    const { summary, validationFramework, linkChecker, codeExamples, terminologyCheck } = this.results;
    
    let text = `DOCUMENTATION VALIDATION REPORT\n`;
    text += `Generated: ${new Date(this.timestamp).toLocaleString()}\n\n`;
    
    text += `OVERALL SUMMARY:\n`;
    text += `- Total Validation Checks: ${summary.totalChecks}\n`;
    text += `- Passed Checks: ${summary.passedChecks}\n`;
    text += `- Failed Checks: ${summary.failedChecks}\n`;
    text += `- Total Issues: ${summary.totalIssues}\n`;
    text += `- Overall Status: ${summary.failedChecks === 0 ? 'PASS' : 'FAIL'}\n\n`;
    
    if (validationFramework) {
      text += `CONTENT VALIDATION:\n`;
      text += `- Files Checked: ${validationFramework.summary.totalFiles}\n`;
      text += `- Passed: ${validationFramework.summary.passedValidation}\n`;
      text += `- Failed: ${validationFramework.summary.failedValidation}\n`;
      text += `- Errors: ${validationFramework.summary.errors}\n`;
      text += `- Warnings: ${validationFramework.summary.warnings}\n\n`;
    }
    
    if (linkChecker) {
      text += `LINK VALIDATION:\n`;
      text += `- Total Links: ${linkChecker.totalLinks}\n`;
      text += `- Valid Links: ${linkChecker.validLinks}\n`;
      text += `- Broken Links: ${linkChecker.brokenLinks}\n`;
      text += `- External Links: ${linkChecker.externalLinks}\n`;
      text += `- Issues: ${linkChecker.issues.length}\n\n`;
    }
    
    if (codeExamples) {
      text += `CODE EXAMPLES:\n`;
      text += `- Files Checked: ${codeExamples.totalFiles}\n`;
      text += `- Passed: ${codeExamples.passedValidation}\n`;
      text += `- Failed: ${codeExamples.failedValidation}\n`;
      text += `- Errors: ${codeExamples.errors}\n`;
      text += `- Warnings: ${codeExamples.warnings}\n\n`;
    }
    
    if (terminologyCheck) {
      text += `TERMINOLOGY CONSISTENCY:\n`;
      text += `- Files Checked: ${terminologyCheck.totalFiles}\n`;
      text += `- Passed: ${terminologyCheck.passedValidation}\n`;
      text += `- Failed: ${terminologyCheck.failedValidation}\n`;
      text += `- Errors: ${terminologyCheck.errors}\n`;
      text += `- Warnings: ${terminologyCheck.warnings}\n\n`;
    }
    
    // Add recommendations
    text += `RECOMMENDATIONS:\n`;
    if (summary.failedChecks > 0) {
      text += `- Review and fix ${summary.totalIssues} issues found\n`;
      text += `- Focus on error-level issues first\n`;
      text += `- Update deprecated terminology\n`;
      text += `- Fix broken internal links\n`;
      text += `- Ensure code examples are browser-compatible\n`;
    } else {
      text += `- All validation checks passed!\n`;
      text += `- Documentation is ready for browser extension users\n`;
    }
    
    return text;
  }
}

// Export for use in other modules
export { ComprehensiveValidator };

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ComprehensiveValidator();
  
  validator.runAllValidations()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Comprehensive validation failed:', error);
      process.exit(1);
    });
}