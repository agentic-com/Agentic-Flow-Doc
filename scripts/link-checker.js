#!/usr/bin/env node

import { readFile, readdir, stat, access } from 'fs/promises';
import { join, extname, relative, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Link Checker for Documentation
 * Validates internal links and references across all documentation
 */

class LinkChecker {
  constructor() {
    this.docsPath = join(__dirname, '../src/content/docs');
    this.rootPath = join(__dirname, '..');
    this.results = {
      totalLinks: 0,
      validLinks: 0,
      brokenLinks: 0,
      externalLinks: 0,
      issues: []
    };
  }

  /**
   * Check all links in documentation
   */
  async checkAllLinks() {
    console.log('🔗 Starting link validation...');
    await this.checkDirectory(this.docsPath);
    this.generateLinkSummary();
    return this.results;
  }

  /**
   * Check links in directory recursively
   */
  async checkDirectory(dirPath) {
    try {
      const entries = await readdir(dirPath);
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          await this.checkDirectory(fullPath);
        } else if (this.isMarkdownFile(entry)) {
          await this.checkLinksInFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error checking directory ${dirPath}:`, error.message);
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
   * Check links in individual file
   */
  async checkLinksInFile(filePath) {
    try {
      const content = await readFile(filePath, 'utf-8');
      const relativePath = relative(this.rootPath, filePath);
      
      // Find all markdown links
      const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
      let match;
      
      while ((match = linkRegex.exec(content)) !== null) {
        const linkText = match[1];
        const linkUrl = match[2];
        const lineNumber = this.findLineNumber(content, match.index);
        
        this.results.totalLinks++;
        
        await this.validateLink(linkUrl, linkText, relativePath, lineNumber, filePath);
      }

      // Find reference-style links
      const refLinkRegex = /\[([^\]]*)\]\[([^\]]*)\]/g;
      const refDefRegex = /^\[([^\]]+)\]:\s*(.+)$/gm;
      
      // Extract reference definitions
      const refDefs = {};
      let refMatch;
      while ((refMatch = refDefRegex.exec(content)) !== null) {
        refDefs[refMatch[1]] = refMatch[2];
      }
      
      // Check reference links
      while ((match = refLinkRegex.exec(content)) !== null) {
        const linkText = match[1];
        const refKey = match[2] || linkText;
        const lineNumber = this.findLineNumber(content, match.index);
        
        if (refDefs[refKey]) {
          this.results.totalLinks++;
          await this.validateLink(refDefs[refKey], linkText, relativePath, lineNumber, filePath);
        } else {
          this.results.totalLinks++;
          this.results.brokenLinks++;
          this.results.issues.push({
            file: relativePath,
            line: lineNumber,
            type: 'broken-reference',
            message: `Reference link "${refKey}" not defined`,
            link: `[${linkText}][${refKey}]`
          });
        }
      }

    } catch (error) {
      console.error(`Error checking links in ${filePath}:`, error.message);
    }
  }

  /**
   * Validate individual link
   */
  async validateLink(linkUrl, linkText, filePath, lineNumber, fullFilePath) {
    // Skip anchors and fragments for now
    const cleanUrl = linkUrl.split('#')[0];
    
    if (this.isExternalLink(cleanUrl)) {
      this.results.externalLinks++;
      await this.validateExternalLink(linkUrl, linkText, filePath, lineNumber);
    } else if (this.isInternalLink(cleanUrl)) {
      await this.validateInternalLink(cleanUrl, linkText, filePath, lineNumber, fullFilePath);
    } else if (cleanUrl === '' || cleanUrl.startsWith('#')) {
      // Fragment-only links (anchors) - would need content parsing to validate
      this.results.validLinks++;
    } else {
      this.results.brokenLinks++;
      this.results.issues.push({
        file: filePath,
        line: lineNumber,
        type: 'invalid-format',
        message: `Invalid link format: ${linkUrl}`,
        link: `[${linkText}](${linkUrl})`
      });
    }
  }

  /**
   * Check if link is external
   */
  isExternalLink(url) {
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
  }

  /**
   * Check if link is internal
   */
  isInternalLink(url) {
    return url.startsWith('./') || url.startsWith('../') || url.startsWith('/') || 
           (!url.includes('://') && !url.startsWith('mailto:') && !url.startsWith('tel:'));
  }

  /**
   * Validate external link
   */
  async validateExternalLink(url, linkText, filePath, lineNumber) {
    // Check for problematic external links
    const problematicDomains = [
      'n8n.io',
      'docs.n8n.io',
      'community.n8n.io'
    ];

    const domain = this.extractDomain(url);
    if (problematicDomains.includes(domain)) {
      this.results.issues.push({
        file: filePath,
        line: lineNumber,
        type: 'outdated-external',
        message: `External link to ${domain} may need updating for browser extension context`,
        link: `[${linkText}](${url})`,
        suggestion: 'Update to point to appropriate browser extension resources'
      });
    }

    this.results.externalLinks++;
    // For now, assume external links are valid (would need HTTP requests to verify)
    this.results.validLinks++;
  }

  /**
   * Validate internal link
   */
  async validateInternalLink(url, linkText, filePath, lineNumber, fullFilePath) {
    try {
      let targetPath;
      
      if (url.startsWith('/')) {
        // Absolute path from project root
        targetPath = join(this.rootPath, url.substring(1));
      } else {
        // Relative path
        const currentDir = dirname(fullFilePath);
        targetPath = resolve(currentDir, url);
      }

      // Check if target exists
      try {
        await access(targetPath);
        this.results.validLinks++;
      } catch {
        // Try with .md extension if not found
        if (!targetPath.endsWith('.md') && !targetPath.endsWith('.mdx')) {
          try {
            await access(targetPath + '.md');
            this.results.validLinks++;
          } catch {
            try {
              await access(targetPath + '.mdx');
              this.results.validLinks++;
            } catch {
              this.results.brokenLinks++;
              this.results.issues.push({
                file: filePath,
                line: lineNumber,
                type: 'broken-internal',
                message: `Internal link target not found: ${url}`,
                link: `[${linkText}](${url})`,
                targetPath: relative(this.rootPath, targetPath)
              });
            }
          }
        } else {
          this.results.brokenLinks++;
          this.results.issues.push({
            file: filePath,
            line: lineNumber,
            type: 'broken-internal',
            message: `Internal link target not found: ${url}`,
            link: `[${linkText}](${url})`,
            targetPath: relative(this.rootPath, targetPath)
          });
        }
      }
    } catch (error) {
      this.results.brokenLinks++;
      this.results.issues.push({
        file: filePath,
        line: lineNumber,
        type: 'validation-error',
        message: `Error validating link: ${error.message}`,
        link: `[${linkText}](${url})`
      });
    }
  }

  /**
   * Extract domain from URL
   */
  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }

  /**
   * Find line number for character index
   */
  findLineNumber(content, charIndex) {
    const beforeChar = content.substring(0, charIndex);
    return beforeChar.split('\n').length;
  }

  /**
   * Generate link checking summary
   */
  generateLinkSummary() {
    const { results } = this;
    
    console.log('\n🔗 LINK VALIDATION SUMMARY');
    console.log('=' .repeat(50));
    console.log(`Total Links: ${results.totalLinks}`);
    console.log(`Valid Links: ${results.validLinks}`);
    console.log(`Broken Links: ${results.brokenLinks}`);
    console.log(`External Links: ${results.externalLinks}`);
    console.log(`Issues Found: ${results.issues.length}`);
    
    if (results.totalLinks > 0) {
      const successRate = ((results.validLinks / results.totalLinks) * 100).toFixed(1);
      console.log(`Success Rate: ${successRate}%`);
    }

    // Group issues by type
    const issuesByType = results.issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {});

    if (Object.keys(issuesByType).length > 0) {
      console.log('\n📊 Issues by Type:');
      Object.entries(issuesByType).forEach(([type, count]) => {
        console.log(`  • ${type}: ${count}`);
      });
    }

    // Show sample issues
    if (results.issues.length > 0) {
      console.log('\n🔍 Sample Issues:');
      results.issues.slice(0, 10).forEach(issue => {
        console.log(`  • ${issue.file}:${issue.line} - ${issue.message}`);
      });
      
      if (results.issues.length > 10) {
        console.log(`  ... and ${results.issues.length - 10} more issues`);
      }
    }
  }

  /**
   * Export results
   */
  async exportResults(outputPath = 'scripts/reports/link-check-results.json') {
    const fs = await import('fs/promises');
    await fs.writeFile(outputPath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Link check results exported to: ${outputPath}`);
  }
}

// Export for use in other modules
export { LinkChecker };

// Run link checking if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const checker = new LinkChecker();
  
  checker.checkAllLinks()
    .then(() => {
      return checker.exportResults();
    })
    .catch(error => {
      console.error('Link checking failed:', error);
      process.exit(1);
    });
}