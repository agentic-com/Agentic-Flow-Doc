#!/usr/bin/env node

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Content Analysis and Transformation Infrastructure
 * Scans documentation files and categorizes transformation needs
 */

class ContentAnalyzer {
  constructor() {
    this.docsPath = join(__dirname, '../src/content/docs');
    this.results = {
      inventory: [],
      patterns: {
        n8nReferences: [],
        serverSpecific: [],
        browserExtensionReady: []
      },
      statistics: {
        totalFiles: 0,
        markdownFiles: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0
      }
    };
    
    // Pattern definitions for detection
    this.patterns = {
      n8nReferences: [
        /\bn8n\b/gi,
        /n8n\.io/gi,
        /n8n-io/gi,
        /n8n community/gi,
        /n8n cloud/gi,
        /n8n server/gi
      ],
      serverSpecific: [
        /server deployment/gi,
        /docker/gi,
        /hosting/gi,
        /self-hosted/gi,
        /production deployment/gi,
        /server installation/gi,
        /database connection/gi,
        /environment variables/gi
      ],
      browserExtensionNodes: [
        /GetSelectedText/gi,
        /GetAllText/gi,
        /GetAllHTML/gi,
        /GetHTMLofSelectedText/gi,
        /GetAllLinks/gi,
        /GetAllImages/gi
      ]
    };
  }

  /**
   * Scan all documentation files and create inventory
   */
  async scanDocumentation() {
    console.log('🔍 Starting documentation scan...');
    await this.scanDirectory(this.docsPath);
    this.calculateStatistics();
    return this.results;
  }

  /**
   * Recursively scan directory for markdown files
   */
  async scanDirectory(dirPath) {
    try {
      const entries = await readdir(dirPath);
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          await this.scanDirectory(fullPath);
        } else if (this.isMarkdownFile(entry)) {
          await this.analyzeFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error.message);
    }
  }

  /**
   * Check if file is a markdown file
   */
  isMarkdownFile(filename) {
    const ext = extname(filename).toLowerCase();
    return ext === '.md' || ext === '.mdx';
  }

  /**
   * Analyze individual file for transformation needs
   */
  async analyzeFile(filePath) {
    try {
      const content = await readFile(filePath, 'utf-8');
      const relativePath = relative(join(__dirname, '..'), filePath);
      
      const fileAnalysis = {
        path: relativePath,
        title: this.extractTitle(content),
        description: this.extractDescription(content),
        contentType: this.determineContentType(relativePath),
        transformationPriority: 'low',
        browserSpecific: false,
        hasCodeExamples: this.hasCodeExamples(content),
        requiresAssetUpdate: this.requiresAssetUpdate(content),
        n8nReferences: this.findN8nReferences(content),
        serverSpecificContent: this.findServerSpecificContent(content),
        browserExtensionNodes: this.findBrowserExtensionNodes(content),
        customizationStatus: 'pending',
        wordCount: content.split(/\s+/).length,
        lastModified: new Date().toISOString()
      };

      // Determine transformation priority
      fileAnalysis.transformationPriority = this.calculatePriority(fileAnalysis);
      fileAnalysis.browserSpecific = fileAnalysis.browserExtensionNodes.length > 0;

      this.results.inventory.push(fileAnalysis);
      this.results.statistics.totalFiles++;
      
      if (this.isMarkdownFile(filePath)) {
        this.results.statistics.markdownFiles++;
      }

      console.log(`📄 Analyzed: ${relativePath} (Priority: ${fileAnalysis.transformationPriority})`);
      
    } catch (error) {
      console.error(`Error analyzing file ${filePath}:`, error.message);
    }
  }

  /**
   * Extract title from frontmatter or first heading
   */
  extractTitle(content) {
    // Try frontmatter first
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const titleMatch = frontmatterMatch[1].match(/title:\s*['"]?([^'"]+)['"]?/);
      if (titleMatch) return titleMatch[1];
    }
    
    // Try first heading
    const headingMatch = content.match(/^#\s+(.+)$/m);
    return headingMatch ? headingMatch[1] : 'Untitled';
  }

  /**
   * Extract description from frontmatter
   */
  extractDescription(content) {
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const descMatch = frontmatterMatch[1].match(/description:\s*['"]?([^'"]+)['"]?/);
      if (descMatch) return descMatch[1];
    }
    return '';
  }

  /**
   * Determine content type based on file path
   */
  determineContentType(filePath) {
    if (filePath.includes('/usage/')) return 'usage';
    if (filePath.includes('/integration/')) return 'integration';
    if (filePath.includes('/advanced-ai/')) return 'advanced-ai';
    if (filePath.includes('/learning/')) return 'learning';
    return 'other';
  }

  /**
   * Check if content has code examples
   */
  hasCodeExamples(content) {
    return /```[\s\S]*?```/.test(content) || /`[^`]+`/.test(content);
  }

  /**
   * Check if content requires asset updates
   */
  requiresAssetUpdate(content) {
    return /!\[.*?\]\(.*?\)/.test(content) || /src=["'].*?["']/.test(content);
  }

  /**
   * Find n8n references in content
   */
  findN8nReferences(content) {
    const references = [];
    this.patterns.n8nReferences.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        references.push(...matches);
      }
    });
    return [...new Set(references)]; // Remove duplicates
  }

  /**
   * Find server-specific content
   */
  findServerSpecificContent(content) {
    const serverContent = [];
    this.patterns.serverSpecific.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        serverContent.push(...matches);
      }
    });
    return [...new Set(serverContent)];
  }

  /**
   * Find browser extension nodes
   */
  findBrowserExtensionNodes(content) {
    const nodes = [];
    this.patterns.browserExtensionNodes.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        nodes.push(...matches);
      }
    });
    return [...new Set(nodes)];
  }

  /**
   * Calculate transformation priority
   */
  calculatePriority(fileAnalysis) {
    let score = 0;
    
    // High priority indicators
    if (fileAnalysis.n8nReferences.length > 5) score += 3;
    if (fileAnalysis.serverSpecificContent.length > 3) score += 3;
    if (fileAnalysis.browserExtensionNodes.length > 0) score += 4;
    if (fileAnalysis.contentType === 'usage' || fileAnalysis.contentType === 'integration') score += 2;
    if (fileAnalysis.path.includes('index.')) score += 2;
    if (fileAnalysis.hasCodeExamples) score += 1;
    
    // Medium priority indicators
    if (fileAnalysis.n8nReferences.length > 0) score += 1;
    if (fileAnalysis.serverSpecificContent.length > 0) score += 1;
    if (fileAnalysis.requiresAssetUpdate) score += 1;
    
    if (score >= 6) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  /**
   * Calculate statistics
   */
  calculateStatistics() {
    this.results.statistics.highPriority = this.results.inventory.filter(f => f.transformationPriority === 'high').length;
    this.results.statistics.mediumPriority = this.results.inventory.filter(f => f.transformationPriority === 'medium').length;
    this.results.statistics.lowPriority = this.results.inventory.filter(f => f.transformationPriority === 'low').length;
  }

  /**
   * Generate summary report
   */
  generateReport() {
    const { statistics, inventory } = this.results;
    
    console.log('\n📊 CONTENT ANALYSIS REPORT');
    console.log('=' .repeat(50));
    console.log(`Total Files Scanned: ${statistics.totalFiles}`);
    console.log(`Markdown Files: ${statistics.markdownFiles}`);
    console.log(`High Priority: ${statistics.highPriority}`);
    console.log(`Medium Priority: ${statistics.mediumPriority}`);
    console.log(`Low Priority: ${statistics.lowPriority}`);
    
    console.log('\n🎯 HIGH PRIORITY FILES:');
    inventory
      .filter(f => f.transformationPriority === 'high')
      .forEach(f => {
        console.log(`  • ${f.path} (${f.n8nReferences.length} n8n refs, ${f.serverSpecificContent.length} server refs)`);
      });
    
    console.log('\n🔧 BROWSER EXTENSION READY FILES:');
    inventory
      .filter(f => f.browserSpecific)
      .forEach(f => {
        console.log(`  • ${f.path} (${f.browserExtensionNodes.join(', ')})`);
      });
  }

  /**
   * Export results to JSON
   */
  async exportResults(outputPath = 'scripts/reports/content-analysis-results.json') {
    const fs = await import('fs/promises');
    await fs.writeFile(outputPath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Results exported to: ${outputPath}`);
  }
}

// Run analysis if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new ContentAnalyzer();
  
  analyzer.scanDocumentation()
    .then(() => {
      analyzer.generateReport();
      return analyzer.exportResults();
    })
    .catch(error => {
      console.error('Analysis failed:', error);
      process.exit(1);
    });
}

export { ContentAnalyzer };