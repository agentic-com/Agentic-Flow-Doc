#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Fix frontmatter issues in documentation files
 */

class FrontmatterFixer {
  constructor() {
    this.docsDir = path.join(rootDir, 'src/content/docs');
    this.fixedFiles = [];
    this.issues = [];
  }

  /**
   * Main fix function
   */
  async fix() {
    console.log('🔧 Fixing frontmatter issues...\n');
    
    // Find all markdown files
    const markdownFiles = this.findMarkdownFiles(this.docsDir);
    
    for (const file of markdownFiles) {
      await this.fixFile(file);
    }
    
    this.generateReport();
    
    return this.issues.length === 0;
  }

  /**
   * Find all markdown files
   */
  findMarkdownFiles(dir) {
    const files = [];
    
    const walkDir = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          walkDir(itemPath);
        } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
          files.push(itemPath);
        }
      }
    };
    
    walkDir(dir);
    return files;
  }

  /**
   * Fix a single file
   */
  async fixFile(filePath) {
    const relativePath = path.relative(this.docsDir, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if file has frontmatter
    if (!content.startsWith('---')) {
      // Add basic frontmatter
      const title = this.generateTitleFromPath(relativePath);
      const description = `Documentation for ${title}`;
      
      const frontmatter = `---
title: ${title}
description: ${description}
---

`;
      
      const newContent = frontmatter + content;
      fs.writeFileSync(filePath, newContent);
      
      this.fixedFiles.push({
        file: relativePath,
        action: 'added-frontmatter',
        title: title
      });
      
      return;
    }
    
    // Check for corrupted frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      this.issues.push({
        type: 'invalid-frontmatter',
        file: relativePath,
        message: 'Invalid frontmatter format'
      });
      return;
    }
    
    const frontmatterContent = frontmatterMatch[1];
    
    // Check for corrupted text in frontmatter
    if (frontmatterContent.includes('Agentic WorkFlowntic Workflow Studio') ||
        frontmatterContent.includes('Agentic WorkFlowAgentic WorkFlow') ||
        frontmatterContent.includes('Agentic WorkFlowyour') ||
        frontmatterContent.includes('Agentic WorkFlownd') ||
        frontmatterContent.includes('Agentic WorkFlowending')) {
      
      // Fix corrupted frontmatter
      let fixedFrontmatter = frontmatterContent
        .replace(/Agentic WorkFlowntic Workflow Studio/g, 'Agentic WorkFlow')
        .replace(/Agentic WorkFlowAgentic WorkFlow/g, 'Agentic WorkFlow')
        .replace(/Agentic WorkFlowyour/g, 'Agentic WorkFlow for your')
        .replace(/Agentic WorkFlownd/g, 'Agentic WorkFlow and')
        .replace(/Agentic WorkFlowending/g, 'Agentic WorkFlow depending')
        .replace(/fAgentic WorkFlow/g, 'for Agentic WorkFlow')
        .replace(/Agentic WorkFlow StuAgentic WorkFlow/g, 'Agentic WorkFlow');
      
      const newContent = content.replace(frontmatterMatch[1], fixedFrontmatter);
      fs.writeFileSync(filePath, newContent);
      
      this.fixedFiles.push({
        file: relativePath,
        action: 'fixed-corrupted-frontmatter'
      });
    }
    
    // Check for missing required fields
    const lines = frontmatterContent.split('\n');
    const hasTitle = lines.some(line => line.trim().startsWith('title:'));
    
    if (!hasTitle) {
      const title = this.generateTitleFromPath(relativePath);
      const titleLine = `title: ${title}`;
      
      const newFrontmatter = titleLine + '\n' + frontmatterContent;
      const newContent = content.replace(frontmatterMatch[1], newFrontmatter);
      fs.writeFileSync(filePath, newContent);
      
      this.fixedFiles.push({
        file: relativePath,
        action: 'added-missing-title',
        title: title
      });
    }
  }

  /**
   * Generate title from file path
   */
  generateTitleFromPath(filePath) {
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Handle special cases
    if (fileName === 'index') {
      const dirName = path.basename(path.dirname(filePath));
      return this.formatTitle(dirName);
    }
    
    return this.formatTitle(fileName);
  }

  /**
   * Format title from filename
   */
  formatTitle(name) {
    return name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\bAi\b/g, 'AI')
      .replace(/\bApi\b/g, 'API')
      .replace(/\bHtml\b/g, 'HTML')
      .replace(/\bUrl\b/g, 'URL')
      .replace(/\bJson\b/g, 'JSON')
      .replace(/\bXml\b/g, 'XML')
      .replace(/\bCsv\b/g, 'CSV')
      .replace(/\bSql\b/g, 'SQL')
      .replace(/\bHttp\b/g, 'HTTP');
  }

  /**
   * Generate report
   */
  generateReport() {
    console.log('\n📊 Frontmatter Fix Report');
    console.log('==========================\n');
    
    if (this.fixedFiles.length === 0 && this.issues.length === 0) {
      console.log('✅ No frontmatter issues found.\n');
      return;
    }
    
    if (this.fixedFiles.length > 0) {
      console.log(`🔧 Fixed ${this.fixedFiles.length} files:\n`);
      
      const actionGroups = {};
      for (const fix of this.fixedFiles) {
        if (!actionGroups[fix.action]) {
          actionGroups[fix.action] = [];
        }
        actionGroups[fix.action].push(fix);
      }
      
      for (const [action, fixes] of Object.entries(actionGroups)) {
        console.log(`  ${this.getActionIcon(action)} ${this.getActionTitle(action)} (${fixes.length})`);
        for (const fix of fixes.slice(0, 5)) {
          console.log(`    - ${fix.file}${fix.title ? ` (${fix.title})` : ''}`);
        }
        if (fixes.length > 5) {
          console.log(`    ... and ${fixes.length - 5} more`);
        }
        console.log();
      }
    }
    
    if (this.issues.length > 0) {
      console.log(`❌ ${this.issues.length} issues could not be automatically fixed:\n`);
      
      for (const issue of this.issues) {
        console.log(`  ❌ ${issue.file}`);
        console.log(`    ${issue.message}`);
        console.log();
      }
    }
    
    console.log(`📈 Summary: Fixed ${this.fixedFiles.length} files, ${this.issues.length} issues remaining`);
  }

  /**
   * Get icon for action
   */
  getActionIcon(action) {
    const icons = {
      'added-frontmatter': '➕',
      'fixed-corrupted-frontmatter': '🔧',
      'added-missing-title': '📝'
    };
    return icons[action] || '🔧';
  }

  /**
   * Get title for action
   */
  getActionTitle(action) {
    const titles = {
      'added-frontmatter': 'Added Missing Frontmatter',
      'fixed-corrupted-frontmatter': 'Fixed Corrupted Frontmatter',
      'added-missing-title': 'Added Missing Title'
    };
    return titles[action] || action;
  }
}

// Run fixer if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new FrontmatterFixer();
  
  fixer.fix()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Frontmatter fix failed with error:', error);
      process.exit(1);
    });
}

export default FrontmatterFixer;