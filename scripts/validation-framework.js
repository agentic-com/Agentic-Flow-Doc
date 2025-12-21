#!/usr/bin/env node

import { readFile, readdir, stat } from 'fs/promises';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Validation Framework
 * Checks content accuracy and consistency for browser extension documentation
 */

class ValidationFramework {
  constructor() {
    this.docsPath = join(__dirname, '../src/content/docs');
    this.validationRules = this.initializeValidationRules();
    this.glossary = this.initializeGlossary();
    this.results = {
      validationResults: [],
      summary: {
        totalFiles: 0,
        passedValidation: 0,
        failedValidation: 0,
        warnings: 0,
        errors: 0
      }
    };
  }

  /**
   * Initialize validation rules
   */
  initializeValidationRules() {
    return [
      {
        name: 'terminology-consistency',
        description: 'Check for consistent use of Agentic WorkFlow terminology',
        severity: 'error',
        validator: this.validateTerminology.bind(this)
      },
      {
        name: 'browser-extension-context',
        description: 'Ensure content is appropriate for browser extension context',
        severity: 'error',
        validator: this.validateBrowserContext.bind(this)
      },
      {
        name: 'link-validity',
        description: 'Check internal links and references',
        severity: 'warning',
        validator: this.validateLinks.bind(this)
      },
      {
        name: 'code-example-syntax',
        description: 'Validate code examples for browser compatibility',
        severity: 'error',
        validator: this.validateCodeExamples.bind(this)
      },
      {
        name: 'frontmatter-schema',
        description: 'Validate frontmatter structure and required fields',
        severity: 'warning',
        validator: this.validateFrontmatter.bind(this)
      },
      {
        name: 'browser-node-accuracy',
        description: 'Verify browser extension node documentation accuracy',
        severity: 'error',
        validator: this.validateBrowserNodes.bind(this)
      },
      {
        name: 'security-considerations',
        description: 'Check for proper security limitation documentation',
        severity: 'warning',
        validator: this.validateSecurityContent.bind(this)
      },
      {
        name: 'content-completeness',
        description: 'Ensure content covers required browser extension aspects',
        severity: 'warning',
        validator: this.validateContentCompleteness.bind(this)
      }
    ];
  }

  /**
   * Initialize terminology glossary
   */
  initializeGlossary() {
    return {
      approved: [
        'Agentic WorkFlow',
        'browser extension',
        'browser context',
        'workflow builder',
        'extension nodes',
        'browser automation',
        'content extraction',
        'DOM manipulation',
        'Chrome extension',
        'Firefox extension'
      ],
      deprecated: [
        'n8n',
        'n8n.io',
        'server deployment',
        'self-hosted',
        'docker',
        'kubernetes',
        'production server',
        'database connection',
        'server installation'
      ],
      browserNodes: [
        'GetSelectedText',
        'GetAllText',
        'GetAllHTML',
        'GetHTMLofSelectedText',
        'GetAllLinks',
        'GetAllImages'
      ]
    };
  }

  /**
   * Run validation on all documentation files
   */
  async validateDocumentation() {
    console.log('🔍 Starting documentation validation...');
    await this.validateDirectory(this.docsPath);
    this.generateValidationSummary();
    return this.results;
  }

  /**
   * Validate files in directory recursively
   */
  async validateDirectory(dirPath) {
    try {
      const entries = await readdir(dirPath);
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          await this.validateDirectory(fullPath);
        } else if (this.isMarkdownFile(entry)) {
          await this.validateFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error validating directory ${dirPath}:`, error.message);
    }
  }

  /**
   * Check if file is markdown
   */
  isMarkdownFile(filename) {
    const ext = extname(filename).toLowerCase();
    return ext === '.md' || ext === '.mdx';
  }

  /**
   * Validate individual file
   */
  async validateFile(filePath) {
    try {
      const content = await readFile(filePath, 'utf-8');
      const relativePath = relative(join(__dirname, '..'), filePath);
      
      const fileValidation = {
        filePath: relativePath,
        passed: true,
        errors: [],
        warnings: [],
        validationResults: []
      };

      // Run all validation rules
      for (const rule of this.validationRules) {
        try {
          const result = await rule.validator(content, relativePath);
          
          fileValidation.validationResults.push({
            rule: rule.name,
            description: rule.description,
            severity: rule.severity,
            passed: result.passed,
            issues: result.issues || []
          });

          if (!result.passed) {
            if (rule.severity === 'error') {
              fileValidation.errors.push(...(result.issues || []));
              fileValidation.passed = false;
            } else {
              fileValidation.warnings.push(...(result.issues || []));
            }
          }
        } catch (error) {
          fileValidation.errors.push({
            rule: rule.name,
            message: `Validation rule failed: ${error.message}`,
            line: 0
          });
          fileValidation.passed = false;
        }
      }

      this.results.validationResults.push(fileValidation);
      this.results.summary.totalFiles++;
      
      if (fileValidation.passed) {
        this.results.summary.passedValidation++;
        console.log(`✅ ${relativePath}`);
      } else {
        this.results.summary.failedValidation++;
        console.log(`❌ ${relativePath} (${fileValidation.errors.length} errors, ${fileValidation.warnings.length} warnings)`);
      }

      this.results.summary.errors += fileValidation.errors.length;
      this.results.summary.warnings += fileValidation.warnings.length;

    } catch (error) {
      console.error(`Error validating file ${filePath}:`, error.message);
    }
  }

  /**
   * Validate terminology consistency
   */
  async validateTerminology(content, filePath) {
    const issues = [];
    
    // Check for deprecated terms
    this.glossary.deprecated.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        const lines = this.findLineNumbers(content, regex);
        lines.forEach(line => {
          issues.push({
            message: `Deprecated term "${term}" found. Use approved terminology instead.`,
            line,
            suggestion: this.suggestTerminologyReplacement(term)
          });
        });
      }
    });

    // Check for inconsistent product naming
    const productNameVariations = [
      /Agentic WorkFlow/gi,
      /Agentic WorkFlow/gi,
      /Agentic WorkFlow/gi
    ];

    productNameVariations.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (match !== 'Agentic WorkFlow') {
            const line = this.findLineNumber(content, match);
            issues.push({
              message: `Inconsistent product name: "${match}". Should be "Agentic WorkFlow"`,
              line,
              suggestion: 'Use consistent capitalization: "Agentic WorkFlow"'
            });
          }
        });
      }
    });

    return {
      passed: issues.length === 0,
      issues
    };
  }

  /**
   * Validate browser extension context
   */
  async validateBrowserContext(content, filePath) {
    const issues = [];
    
    // Check for server-specific content that shouldn't be in browser extension docs
    const serverTerms = [
      'docker deployment',
      'server installation',
      'database setup',
      'production hosting',
      'kubernetes',
      'load balancer'
    ];

    serverTerms.forEach(term => {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        const line = this.findLineNumber(content, term);
        issues.push({
          message: `Server-specific content "${term}" may not be appropriate for browser extension documentation`,
          line,
          suggestion: 'Consider removing or adapting for browser context'
        });
      }
    });

    // Check for missing browser context explanations
    if (filePath.includes('/integration/') && content.includes('node')) {
      const hasBrowserContext = content.toLowerCase().includes('browser') || 
                               content.toLowerCase().includes('extension') ||
                               content.toLowerCase().includes('dom');
      
      if (!hasBrowserContext) {
        issues.push({
          message: 'Integration documentation should explain browser context usage',
          line: 1,
          suggestion: 'Add explanation of how this works in browser extension context'
        });
      }
    }

    return {
      passed: issues.length === 0,
      issues
    };
  }

  /**
   * Validate internal links
   */
  async validateLinks(content, filePath) {
    const issues = [];
    
    // Find markdown links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2];
      
      // Check for broken internal links (simplified check)
      if (linkUrl.startsWith('./') || linkUrl.startsWith('../')) {
        // This would need actual file system checking in a real implementation
        // For now, just flag relative links for manual review
        const line = this.findLineNumber(content, match[0]);
        issues.push({
          message: `Relative link "${linkUrl}" should be verified`,
          line,
          suggestion: 'Ensure link target exists and is correct for browser extension docs'
        });
      }
      
      // Check for n8n.io links that should be updated
      if (linkUrl.includes('n8n.io')) {
        const line = this.findLineNumber(content, match[0]);
        issues.push({
          message: `External n8n.io link "${linkUrl}" may need updating`,
          line,
          suggestion: 'Update to point to appropriate browser extension resources'
        });
      }
    }

    return {
      passed: issues.length === 0,
      issues
    };
  }

  /**
   * Validate code examples
   */
  async validateCodeExamples(content, filePath) {
    const issues = [];
    
    // Find code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'unknown';
      const code = match[2];
      
      // Check for server-specific code patterns
      const serverPatterns = [
        /process\.env\./,
        /require\(['"]fs['"]\)/,
        /import.*from ['"]fs['"]/,
        /docker/i,
        /kubectl/i
      ];

      serverPatterns.forEach(pattern => {
        if (pattern.test(code)) {
          const line = this.findLineNumber(content, match[0]);
          issues.push({
            message: `Code example contains server-specific pattern: ${pattern.source}`,
            line,
            suggestion: 'Adapt code example for browser extension environment'
          });
        }
      });

      // Check for browser extension compatibility
      if (language === 'javascript' || language === 'typescript') {
        if (code.includes('document.') || code.includes('window.')) {
          // Good - browser API usage
        } else if (code.includes('node:') || code.includes('require(')) {
          const line = this.findLineNumber(content, match[0]);
          issues.push({
            message: 'Code example uses Node.js patterns that may not work in browser',
            line,
            suggestion: 'Use browser-compatible APIs or Web APIs instead'
          });
        }
      }
    }

    return {
      passed: issues.length === 0,
      issues
    };
  }

  /**
   * Validate frontmatter
   */
  async validateFrontmatter(content, filePath) {
    const issues = [];
    
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    
    if (!frontmatterMatch) {
      issues.push({
        message: 'Missing frontmatter',
        line: 1,
        suggestion: 'Add frontmatter with title and description'
      });
      return { passed: false, issues };
    }

    const frontmatter = frontmatterMatch[1];
    
    // Check required fields
    if (!frontmatter.includes('title:')) {
      issues.push({
        message: 'Missing title in frontmatter',
        line: 2,
        suggestion: 'Add title field to frontmatter'
      });
    }

    if (!frontmatter.includes('description:')) {
      issues.push({
        message: 'Missing description in frontmatter',
        line: 2,
        suggestion: 'Add description field to frontmatter'
      });
    }

    // Check for n8n references in frontmatter
    if (frontmatter.toLowerCase().includes('n8n')) {
      issues.push({
        message: 'Frontmatter contains n8n references',
        line: 2,
        suggestion: 'Update frontmatter to use Agentic WorkFlow terminology'
      });
    }

    return {
      passed: issues.length === 0,
      issues
    };
  }

  /**
   * Validate browser extension nodes
   */
  async validateBrowserNodes(content, filePath) {
    const issues = [];
    
    // Check if file documents a browser extension node
    const isBrowserNodeDoc = this.glossary.browserNodes.some(node => 
      filePath.includes(node) || content.includes(node)
    );

    if (isBrowserNodeDoc) {
      // Required sections for browser node documentation
      const requiredSections = [
        'description',
        'parameters',
        'example',
        'browser'
      ];

      requiredSections.forEach(section => {
        const sectionRegex = new RegExp(`#{1,3}\\s*${section}`, 'i');
        if (!sectionRegex.test(content)) {
          issues.push({
            message: `Missing required section: ${section}`,
            line: 1,
            suggestion: `Add ${section} section to browser node documentation`
          });
        }
      });

      // Check for browser API documentation
      if (!content.toLowerCase().includes('browser api') && 
          !content.toLowerCase().includes('dom') &&
          !content.toLowerCase().includes('content script')) {
        issues.push({
          message: 'Browser node documentation should explain browser API usage',
          line: 1,
          suggestion: 'Add explanation of browser APIs and permissions required'
        });
      }
    }

    return {
      passed: issues.length === 0,
      issues
    };
  }

  /**
   * Validate security considerations
   */
  async validateSecurityContent(content, filePath) {
    const issues = [];
    
    // Check if security-sensitive content has appropriate warnings
    const securityKeywords = [
      'authentication',
      'credentials',
      'api key',
      'token',
      'password',
      'cross-origin'
    ];

    const hasSecurityContent = securityKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );

    if (hasSecurityContent) {
      const hasSecurityWarning = content.toLowerCase().includes('security') ||
                                content.toLowerCase().includes('permission') ||
                                content.toLowerCase().includes('cors');

      if (!hasSecurityWarning) {
        issues.push({
          message: 'Content involves security-sensitive topics but lacks security considerations',
          line: 1,
          suggestion: 'Add security considerations section explaining browser limitations'
        });
      }
    }

    return {
      passed: issues.length === 0,
      issues
    };
  }

  /**
   * Validate content completeness
   */
  async validateContentCompleteness(content, filePath) {
    const issues = [];
    
    // Check minimum content length
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 50) {
      issues.push({
        message: `Content is very short (${wordCount} words)`,
        line: 1,
        suggestion: 'Consider expanding content with more details and examples'
      });
    }

    // Check for placeholder content
    const placeholders = ['TODO', 'TBD', 'Coming soon', 'Under construction'];
    placeholders.forEach(placeholder => {
      if (content.includes(placeholder)) {
        const line = this.findLineNumber(content, placeholder);
        issues.push({
          message: `Placeholder content found: "${placeholder}"`,
          line,
          suggestion: 'Replace placeholder with actual content'
        });
      }
    });

    return {
      passed: issues.length === 0,
      issues
    };
  }

  /**
   * Find line number for text
   */
  findLineNumber(content, searchText) {
    const lines = content.substring(0, content.indexOf(searchText)).split('\n');
    return lines.length;
  }

  /**
   * Find all line numbers for pattern matches
   */
  findLineNumbers(content, pattern) {
    const lines = [];
    const contentLines = content.split('\n');
    
    contentLines.forEach((line, index) => {
      if (pattern.test(line)) {
        lines.push(index + 1);
      }
    });
    
    return lines;
  }

  /**
   * Suggest terminology replacement
   */
  suggestTerminologyReplacement(term) {
    const replacements = {
      'n8n': 'Agentic WorkFlow',
      'n8n.io': 'Agentic WorkFlow',
      'server deployment': 'browser extension installation',
      'self-hosted': 'browser-based',
      'docker': 'browser extension',
      'production server': 'browser environment'
    };
    
    return replacements[term.toLowerCase()] || 'Use approved browser extension terminology';
  }

  /**
   * Generate validation summary
   */
  generateValidationSummary() {
    const { summary } = this.results;
    
    console.log('\n📋 VALIDATION SUMMARY');
    console.log('=' .repeat(50));
    console.log(`Total Files: ${summary.totalFiles}`);
    console.log(`Passed: ${summary.passedValidation}`);
    console.log(`Failed: ${summary.failedValidation}`);
    console.log(`Errors: ${summary.errors}`);
    console.log(`Warnings: ${summary.warnings}`);
    
    const successRate = ((summary.passedValidation / summary.totalFiles) * 100).toFixed(1);
    console.log(`Success Rate: ${successRate}%`);
    
    // Show most common issues
    const allIssues = this.results.validationResults.flatMap(r => 
      [...r.errors, ...r.warnings]
    );
    
    const issueTypes = allIssues.reduce((acc, issue) => {
      const key = issue.message.split(':')[0] || issue.message.substring(0, 50);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    
    const topIssues = Object.entries(issueTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    if (topIssues.length > 0) {
      console.log('\n🔍 Most Common Issues:');
      topIssues.forEach(([issue, count]) => {
        console.log(`  • ${issue}: ${count} occurrences`);
      });
    }
  }

  /**
   * Export validation results
   */
  async exportResults(outputPath = 'scripts/reports/validation-results.json') {
    const fs = await import('fs/promises');
    await fs.writeFile(outputPath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Validation results exported to: ${outputPath}`);
  }
}

// Export for use in other modules
export { ValidationFramework };

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ValidationFramework();
  
  validator.validateDocumentation()
    .then(() => {
      return validator.exportResults();
    })
    .catch(error => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}