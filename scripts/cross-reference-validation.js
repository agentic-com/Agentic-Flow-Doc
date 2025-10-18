#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Cross-reference validation for Agentic Workflow Studio documentation
 * Validates internal links, navigation consistency, and content structure
 */

class CrossReferenceValidator {
  constructor() {
    this.docsDir = path.join(rootDir, 'src/content/docs');
    this.issues = [];
    this.allFiles = new Set();
    this.internalLinks = new Map();
    this.navigationStructure = new Map();
  }

  /**
   * Main validation function
   */
  async validate() {
    console.log('🔍 Starting cross-reference validation...\n');
    
    // Step 1: Discover all documentation files
    await this.discoverFiles();
    
    // Step 2: Extract internal links from all files
    await this.extractInternalLinks();
    
    // Step 3: Validate internal link targets
    await this.validateInternalLinks();
    
    // Step 4: Check navigation consistency
    await this.validateNavigationConsistency();
    
    // Step 5: Validate meta files and structure
    await this.validateMetaFiles();
    
    // Step 6: Check for browser extension specific content
    await this.validateBrowserExtensionContent();
    
    // Generate report
    this.generateReport();
    
    return this.issues.length === 0;
  }

  /**
   * Discover all documentation files
   */
  async discoverFiles() {
    console.log('📁 Discovering documentation files...');
    
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
          const relativePath = path.relative(this.docsDir, filePath);
          this.allFiles.add(relativePath);
        }
      }
    };
    
    walkDir(this.docsDir);
    console.log(`   Found ${this.allFiles.size} documentation files`);
  }

  /**
   * Extract internal links from all files
   */
  async extractInternalLinks() {
    console.log('🔗 Extracting internal links...');
    
    for (const file of this.allFiles) {
      const filePath = path.join(this.docsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extract markdown links [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const links = [];
      let match;
      
      while ((match = linkRegex.exec(content)) !== null) {
        const [, text, url] = match;
        
        // Only process internal links (not starting with http/https/mailto)
        if (!url.startsWith('http') && !url.startsWith('mailto') && !url.startsWith('#')) {
          links.push({
            text,
            url,
            line: content.substring(0, match.index).split('\n').length
          });
        }
      }
      
      if (links.length > 0) {
        this.internalLinks.set(file, links);
      }
    }
    
    console.log(`   Found internal links in ${this.internalLinks.size} files`);
  }

  /**
   * Validate internal link targets
   */
  async validateInternalLinks() {
    console.log('✅ Validating internal link targets...');
    
    let brokenLinks = 0;
    
    for (const [sourceFile, links] of this.internalLinks) {
      for (const link of links) {
        const targetPath = this.resolveInternalLink(sourceFile, link.url);
        
        if (!this.linkTargetExists(targetPath)) {
          this.issues.push({
            type: 'broken-link',
            severity: 'error',
            file: sourceFile,
            line: link.line,
            message: `Broken internal link: "${link.text}" -> "${link.url}"`,
            target: targetPath
          });
          brokenLinks++;
        }
      }
    }
    
    if (brokenLinks === 0) {
      console.log('   ✅ All internal links are valid');
    } else {
      console.log(`   ❌ Found ${brokenLinks} broken internal links`);
    }
  }

  /**
   * Resolve internal link to file path
   */
  resolveInternalLink(sourceFile, linkUrl) {
    // Remove anchor fragments
    const cleanUrl = linkUrl.split('#')[0];
    
    if (cleanUrl.startsWith('/')) {
      // Absolute path from docs root
      return cleanUrl.substring(1);
    } else {
      // Relative path from source file
      const sourceDir = path.dirname(sourceFile);
      return path.normalize(path.join(sourceDir, cleanUrl));
    }
  }

  /**
   * Check if link target exists
   */
  linkTargetExists(targetPath) {
    // Check if exact file exists
    if (this.allFiles.has(targetPath)) {
      return true;
    }
    
    // Check if it's a directory with index file
    const indexPath = path.join(targetPath, 'index.md');
    const indexMdxPath = path.join(targetPath, 'index.mdx');
    
    return this.allFiles.has(indexPath) || this.allFiles.has(indexMdxPath);
  }

  /**
   * Validate navigation consistency
   */
  async validateNavigationConsistency() {
    console.log('🧭 Validating navigation consistency...');
    
    // Check that all main sections have proper landing pages
    const mainSections = ['usage', 'integration', 'advanced-ai', 'learning'];
    
    for (const section of mainSections) {
      const indexFile = `${section}/index.md`;
      const indexMdxFile = `${section}/index.mdx`;
      
      if (!this.allFiles.has(indexFile) && !this.allFiles.has(indexMdxFile)) {
        this.issues.push({
          type: 'missing-index',
          severity: 'error',
          file: section,
          message: `Missing index file for main section: ${section}`
        });
      }
    }
    
    // Validate _meta.yml files exist for directories with multiple files
    await this.validateMetaFilesForDirectories();
  }

  /**
   * Validate meta files for proper navigation
   */
  async validateMetaFiles() {
    console.log('📋 Validating meta files...');
    
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      const hasMultipleMarkdownFiles = files.filter(f => 
        f.endsWith('.md') || f.endsWith('.mdx')
      ).length > 1;
      
      if (hasMultipleMarkdownFiles && !files.includes('_meta.yml')) {
        const relativePath = path.relative(this.docsDir, dir);
        this.issues.push({
          type: 'missing-meta',
          severity: 'warning',
          file: relativePath,
          message: `Directory with multiple files missing _meta.yml: ${relativePath}`
        });
      }
      
      // Check subdirectories
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          walkDir(filePath);
        }
      }
    };
    
    walkDir(this.docsDir);
  }

  /**
   * Validate meta files for directories
   */
  async validateMetaFilesForDirectories() {
    // This is handled in validateMetaFiles()
  }

  /**
   * Validate browser extension specific content
   */
  async validateBrowserExtensionContent() {
    console.log('🌐 Validating browser extension content...');
    
    // Check for outdated n8n references
    let n8nReferences = 0;
    
    for (const file of this.allFiles) {
      const filePath = path.join(this.docsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Check for n8n references that should be replaced
      const n8nMatches = content.match(/\bn8n\b/gi);
      if (n8nMatches) {
        // Allow n8n in certain contexts (like migration guides)
        const allowedContexts = [
          'migration',
          'history',
          'changelog',
          'release'
        ];
        
        const isAllowedContext = allowedContexts.some(context => 
          file.toLowerCase().includes(context)
        );
        
        if (!isAllowedContext) {
          this.issues.push({
            type: 'outdated-reference',
            severity: 'warning',
            file: file,
            message: `Found ${n8nMatches.length} n8n references that may need updating`,
            count: n8nMatches.length
          });
          n8nReferences += n8nMatches.length;
        }
      }
      
      // Check for server-specific references
      const serverTerms = [
        'server deployment',
        'docker compose',
        'self-hosted',
        'npm install n8n',
        'n8n start'
      ];
      
      for (const term of serverTerms) {
        if (content.toLowerCase().includes(term.toLowerCase())) {
          this.issues.push({
            type: 'server-reference',
            severity: 'warning',
            file: file,
            message: `Found server-specific reference: "${term}"`
          });
        }
      }
    }
    
    if (n8nReferences === 0) {
      console.log('   ✅ No outdated n8n references found');
    } else {
      console.log(`   ⚠️  Found ${n8nReferences} potential n8n references to review`);
    }
  }

  /**
   * Generate validation report
   */
  generateReport() {
    console.log('\n📊 Cross-Reference Validation Report');
    console.log('=====================================\n');
    
    if (this.issues.length === 0) {
      console.log('✅ All validations passed! No issues found.\n');
      return;
    }
    
    // Group issues by type
    const issuesByType = {};
    for (const issue of this.issues) {
      if (!issuesByType[issue.type]) {
        issuesByType[issue.type] = [];
      }
      issuesByType[issue.type].push(issue);
    }
    
    // Report by type
    for (const [type, issues] of Object.entries(issuesByType)) {
      console.log(`\n${this.getTypeIcon(type)} ${this.getTypeTitle(type)} (${issues.length})`);
      console.log('-'.repeat(50));
      
      for (const issue of issues) {
        console.log(`  ${this.getSeverityIcon(issue.severity)} ${issue.file}`);
        console.log(`    ${issue.message}`);
        if (issue.line) {
          console.log(`    Line: ${issue.line}`);
        }
        if (issue.target) {
          console.log(`    Target: ${issue.target}`);
        }
        if (issue.count) {
          console.log(`    Count: ${issue.count}`);
        }
        console.log();
      }
    }
    
    // Summary
    const errors = this.issues.filter(i => i.severity === 'error').length;
    const warnings = this.issues.filter(i => i.severity === 'warning').length;
    
    console.log('\n📈 Summary');
    console.log('-'.repeat(20));
    console.log(`Total issues: ${this.issues.length}`);
    console.log(`Errors: ${errors}`);
    console.log(`Warnings: ${warnings}`);
    
    if (errors > 0) {
      console.log('\n❌ Validation failed due to errors. Please fix the issues above.');
    } else if (warnings > 0) {
      console.log('\n⚠️  Validation completed with warnings. Review recommended.');
    }
    
    // Save detailed report
    this.saveDetailedReport();
  }

  /**
   * Save detailed report to file
   */
  saveDetailedReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(rootDir, `scripts/reports/cross-reference-validation-${timestamp}.json`);
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: this.allFiles.size,
        totalIssues: this.issues.length,
        errors: this.issues.filter(i => i.severity === 'error').length,
        warnings: this.issues.filter(i => i.severity === 'warning').length
      },
      issues: this.issues,
      files: Array.from(this.allFiles)
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed report saved to: ${reportPath}`);
  }

  /**
   * Get icon for issue type
   */
  getTypeIcon(type) {
    const icons = {
      'broken-link': '🔗',
      'missing-index': '📄',
      'missing-meta': '📋',
      'outdated-reference': '🔄',
      'server-reference': '🖥️'
    };
    return icons[type] || '❓';
  }

  /**
   * Get title for issue type
   */
  getTypeTitle(type) {
    const titles = {
      'broken-link': 'Broken Internal Links',
      'missing-index': 'Missing Index Files',
      'missing-meta': 'Missing Meta Files',
      'outdated-reference': 'Outdated References',
      'server-reference': 'Server-Specific References'
    };
    return titles[type] || type;
  }

  /**
   * Get icon for severity
   */
  getSeverityIcon(severity) {
    return severity === 'error' ? '❌' : '⚠️';
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new CrossReferenceValidator();
  
  validator.validate()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Validation failed with error:', error);
      process.exit(1);
    });
}

export default CrossReferenceValidator;