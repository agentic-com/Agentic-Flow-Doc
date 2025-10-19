#!/usr/bin/env node

/**
 * Content Validation System for Agentic Workflow Studio Documentation
 * 
 * This script validates documentation files for completeness, structure,
 * and adherence to documentation standards.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ContentValidator {
  constructor() {
    this.validationResults = {
      passed: 0,
      failed: 0,
      warnings: 0,
      errors: []
    };
    
    this.requiredSections = {
      node: [
        'Overview',
        'Parameters & Configuration', 
        'Browser API Integration',
        'Input/Output Specifications',
        'Practical Examples',
        'Integration Patterns',
        'Troubleshooting',
        'Related Nodes'
      ],
      tutorial: [
        'Tutorial Overview',
        'Prerequisites', 
        'Step-by-Step Implementation',
        'Real-World Applications',
        'Troubleshooting Guide',
        'Related Tutorials'
      ],
      workflow: [
        'Workflow Overview',
        'Workflow Architecture',
        'Prerequisites',
        'Step-by-Step Implementation',
        'Complete Configuration',
        'Testing and Validation',
        'Troubleshooting Guide'
      ]
    };
  }

  /**
   * Validate all documentation files in the project
   */
  async validateAllContent() {
    console.log('🔍 Starting comprehensive content validation...\n');
    
    const contentDir = path.join(process.cwd(), 'src/content/docs');
    await this.validateDirectory(contentDir);
    
    this.printValidationSummary();
    return this.validationResults;
  }

  /**
   * Recursively validate all markdown files in a directory
   */
  async validateDirectory(dirPath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          await this.validateDirectory(fullPath);
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
          await this.validateFile(fullPath);
        }
      }
    } catch (error) {
      this.addError(`Failed to read directory ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Validate a single markdown file
   */
  async validateFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      console.log(`📄 Validating: ${relativePath}`);
      
      const validation = {
        file: relativePath,
        errors: [],
        warnings: [],
        passed: true
      };

      // Parse frontmatter and content
      const { frontmatter, body } = this.parseFrontmatter(content);
      
      // Determine document type
      const docType = this.determineDocumentType(relativePath, frontmatter);
      
      // Run validation checks
      this.validateFrontmatter(frontmatter, validation);
      this.validateStructure(body, docType, validation);
      this.validateContent(body, validation);
      this.validateCodeExamples(body, validation);
      this.validateLinks(body, validation);
      
      // Update overall results
      if (validation.errors.length > 0) {
        validation.passed = false;
        this.validationResults.failed++;
        this.validationResults.errors.push(validation);
      } else {
        this.validationResults.passed++;
      }
      
      if (validation.warnings.length > 0) {
        this.validationResults.warnings += validation.warnings.length;
      }
      
      // Print file results
      this.printFileResults(validation);
      
    } catch (error) {
      this.addError(`Failed to validate ${filePath}: ${error.message}`);
    }
  }

  /**
   * Parse frontmatter from markdown content
   */
  parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
      return { frontmatter: {}, body: content };
    }
    
    try {
      const frontmatter = yaml.load(match[1]);
      return { frontmatter, body: match[2] };
    } catch (error) {
      return { frontmatter: {}, body: content };
    }
  }

  /**
   * Determine document type based on path and frontmatter
   */
  determineDocumentType(filePath, frontmatter) {
    if (filePath.includes('/integration/builtin/')) {
      return 'node';
    } else if (filePath.includes('/learning/') || filePath.includes('tutorial')) {
      return 'tutorial';
    } else if (filePath.includes('/examples/') || filePath.includes('workflow')) {
      return 'workflow';
    }
    return 'general';
  }

  /**
   * Validate frontmatter completeness and format
   */
  validateFrontmatter(frontmatter, validation) {
    // Required frontmatter fields
    const requiredFields = ['title', 'description'];
    
    for (const field of requiredFields) {
      if (!frontmatter[field]) {
        validation.errors.push(`Missing required frontmatter field: ${field}`);
      } else if (typeof frontmatter[field] !== 'string' || frontmatter[field].trim().length === 0) {
        validation.errors.push(`Frontmatter field '${field}' must be a non-empty string`);
      }
    }
    
    // Validate title length
    if (frontmatter.title && frontmatter.title.length > 60) {
      validation.warnings.push('Title is longer than 60 characters, may be truncated in search results');
    }
    
    // Validate description length
    if (frontmatter.description) {
      if (frontmatter.description.length < 50) {
        validation.warnings.push('Description is shorter than 50 characters, consider adding more detail');
      } else if (frontmatter.description.length > 160) {
        validation.warnings.push('Description is longer than 160 characters, may be truncated in search results');
      }
    }
  }

  /**
   * Validate document structure based on type
   */
  validateStructure(content, docType, validation) {
    if (!this.requiredSections[docType]) {
      return; // No specific structure requirements for this type
    }
    
    const requiredSections = this.requiredSections[docType];
    const headers = this.extractHeaders(content);
    
    for (const section of requiredSections) {
      const found = headers.some(header => 
        header.toLowerCase().includes(section.toLowerCase()) ||
        section.toLowerCase().includes(header.toLowerCase())
      );
      
      if (!found) {
        validation.errors.push(`Missing required section: ${section}`);
      }
    }
    
    // Check for proper header hierarchy
    this.validateHeaderHierarchy(content, validation);
  }

  /**
   * Extract headers from markdown content
   */
  extractHeaders(content) {
    const headerRegex = /^#{1,6}\s+(.+)$/gm;
    const headers = [];
    let match;
    
    while ((match = headerRegex.exec(content)) !== null) {
      headers.push(match[1].trim());
    }
    
    return headers;
  }

  /**
   * Validate header hierarchy (H1 -> H2 -> H3, etc.)
   */
  validateHeaderHierarchy(content, validation) {
    const headerRegex = /^(#{1,6})\s+(.+)$/gm;
    const headers = [];
    let match;
    
    while ((match = headerRegex.exec(content)) !== null) {
      headers.push({
        level: match[1].length,
        text: match[2].trim(),
        line: content.substring(0, match.index).split('\n').length
      });
    }
    
    for (let i = 1; i < headers.length; i++) {
      const current = headers[i];
      const previous = headers[i - 1];
      
      // Check for skipped levels (e.g., H2 -> H4)
      if (current.level > previous.level + 1) {
        validation.warnings.push(
          `Header level skip at line ${current.line}: H${previous.level} to H${current.level} (${current.text})`
        );
      }
    }
  }

  /**
   * Validate content quality and completeness
   */
  validateContent(content, validation) {
    // Check for placeholder text
    const placeholders = [
      '[TODO]', '[PLACEHOLDER]', 'Lorem ipsum', 'TODO:', 'FIXME:',
      '[Description]', '[Example]', '[Add content]'
    ];
    
    for (const placeholder of placeholders) {
      if (content.includes(placeholder)) {
        validation.errors.push(`Contains placeholder text: ${placeholder}`);
      }
    }
    
    // Check content length
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 200) {
      validation.warnings.push(`Content is quite short (${wordCount} words), consider adding more detail`);
    }
    
    // Check for code examples in technical content
    const hasCodeBlocks = /```[\s\S]*?```/.test(content);
    const isTechnical = content.includes('node') || content.includes('workflow') || content.includes('API');
    
    if (isTechnical && !hasCodeBlocks) {
      validation.warnings.push('Technical content should include code examples');
    }
  }

  /**
   * Validate code examples for completeness and syntax
   */
  validateCodeExamples(content, validation) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let codeBlockCount = 0;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlockCount++;
      const language = match[1];
      const code = match[2].trim();
      
      // Check for language specification
      if (!language) {
        validation.warnings.push(`Code block ${codeBlockCount} missing language specification`);
      }
      
      // Check for empty code blocks
      if (code.length === 0) {
        validation.errors.push(`Code block ${codeBlockCount} is empty`);
        continue;
      }
      
      // Validate JSON syntax
      if (language === 'json') {
        try {
          JSON.parse(code);
        } catch (error) {
          validation.errors.push(`Code block ${codeBlockCount} contains invalid JSON: ${error.message}`);
        }
      }
      
      // Check for placeholder code
      if (code.includes('// TODO') || code.includes('/* TODO */') || code.includes('...')) {
        validation.warnings.push(`Code block ${codeBlockCount} contains placeholder code`);
      }
      
      // Check for proper error handling in JavaScript
      if (language === 'javascript' || language === 'js') {
        if (code.includes('async ') && !code.includes('try') && !code.includes('catch')) {
          validation.warnings.push(`Code block ${codeBlockCount} uses async but lacks error handling`);
        }
      }
    }
  }

  /**
   * Validate internal and external links
   */
  validateLinks(content, validation) {
    // Internal links
    const internalLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = internalLinkRegex.exec(content)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2];
      
      // Check for empty link text
      if (linkText.trim().length === 0) {
        validation.warnings.push('Link has empty text');
      }
      
      // Check for placeholder links
      if (linkUrl.includes('example.com') || linkUrl === '#' || linkUrl === '') {
        validation.warnings.push(`Placeholder link detected: ${linkUrl}`);
      }
      
      // Check for descriptive link text
      const genericTexts = ['click here', 'read more', 'link', 'here'];
      if (genericTexts.includes(linkText.toLowerCase())) {
        validation.warnings.push(`Non-descriptive link text: "${linkText}"`);
      }
    }
  }

  /**
   * Add error to overall results
   */
  addError(message) {
    this.validationResults.errors.push({
      file: 'system',
      errors: [message],
      warnings: [],
      passed: false
    });
    this.validationResults.failed++;
  }

  /**
   * Print results for a single file
   */
  printFileResults(validation) {
    if (validation.passed && validation.warnings.length === 0) {
      console.log('  ✅ Passed\n');
    } else {
      if (validation.errors.length > 0) {
        console.log('  ❌ Failed');
        validation.errors.forEach(error => {
          console.log(`    • ${error}`);
        });
      }
      
      if (validation.warnings.length > 0) {
        console.log('  ⚠️  Warnings');
        validation.warnings.forEach(warning => {
          console.log(`    • ${warning}`);
        });
      }
      console.log();
    }
  }

  /**
   * Print overall validation summary
   */
  printValidationSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${this.validationResults.passed}`);
    console.log(`❌ Failed: ${this.validationResults.failed}`);
    console.log(`⚠️  Warnings: ${this.validationResults.warnings}`);
    console.log(`📁 Total Files: ${this.validationResults.passed + this.validationResults.failed}`);
    
    if (this.validationResults.failed > 0) {
      console.log('\n🔍 Files with errors:');
      this.validationResults.errors.forEach(result => {
        if (result.errors.length > 0) {
          console.log(`  • ${result.file}`);
        }
      });
    }
    
    const successRate = ((this.validationResults.passed / (this.validationResults.passed + this.validationResults.failed)) * 100).toFixed(1);
    console.log(`\n📈 Success Rate: ${successRate}%`);
    
    if (this.validationResults.failed === 0) {
      console.log('\n🎉 All documentation meets quality standards!');
    } else {
      console.log('\n🔧 Please address the errors above to improve documentation quality.');
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ContentValidator();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const specificFile = args.find(arg => !arg.startsWith('--'));
  
  if (specificFile) {
    // Validate specific file
    validator.validateFile(path.resolve(specificFile))
      .then(() => validator.printValidationSummary())
      .catch(error => {
        console.error('Validation failed:', error);
        process.exit(1);
      });
  } else {
    // Validate all content
    validator.validateAllContent()
      .then(results => {
        process.exit(results.failed > 0 ? 1 : 0);
      })
      .catch(error => {
        console.error('Validation failed:', error);
        process.exit(1);
      });
  }
}

export default ContentValidator;