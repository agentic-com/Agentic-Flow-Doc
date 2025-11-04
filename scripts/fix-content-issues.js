#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

class ContentFixer {
  constructor() {
    this.fixedFiles = [];
    this.errors = [];
  }

  async fixAllIssues() {
    console.log('🔧 Starting comprehensive content fixes...\n');
    
    const contentDir = 'src/content/docs';
    await this.processDirectory(contentDir);
    
    this.generateReport();
  }

  async processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await this.processDirectory(fullPath);
      } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
        await this.fixFile(fullPath);
      }
    }
  }

  async fixFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let hasChanges = false;
      
      // Fix terminology inconsistencies
      const terminologyFixes = [
        { from: /\bn8n\b/g, to: 'Agentic Workflow Studio' },
        { from: /\bN8N\b/g, to: 'Agentic Workflow Studio' },
        { from: /\bscraping\b/g, to: 'extraction' },
        { from: /\bScraping\b/g, to: 'Extraction' },
        { from: /\bplugin\b/g, to: 'browser extension' },
        { from: /\bPlugin\b/g, to: 'Browser extension' },
        { from: /\badd-on\b/g, to: 'browser extension' },
        { from: /\bAdd-on\b/g, to: 'Browser extension' },
        { from: /\bworkflow automation\b/g, to: 'workflow' },
        { from: /\bWorkflow automation\b/g, to: 'Workflow' },
        { from: /\bautomation tool\b/g, to: 'workflow builder' },
        { from: /\bAutomation tool\b/g, to: 'Workflow builder' }
      ];
      
      terminologyFixes.forEach(fix => {
        const newContent = content.replace(fix.from, fix.to);
        if (newContent !== content) {
          content = newContent;
          hasChanges = true;
        }
      });
      
      // Fix broken internal links - remove or update common broken patterns
      const linkFixes = [
        // Remove references to missing glossary
        { from: /\[([^\]]+)\]\(\/glossary\.md#[^)]+\)/g, to: '$1' },
        // Remove references to missing images
        { from: /!\[([^\]]*)\]\(\/_images\/[^)]+\)/g, to: '' },
        // Fix common broken paths
        { from: /\[([^\]]+)\]\(\/manage-cloud\/[^)]+\)/g, to: '$1' },
        { from: /\[([^\]]+)\]\(\/hosting\/[^)]+\)/g, to: '$1' },
        { from: /\[([^\]]+)\]\(\/integrations\/builtin\/cluster-nodes\/[^)]+\)/g, to: '$1' }
      ];
      
      linkFixes.forEach(fix => {
        const newContent = content.replace(fix.from, fix.to);
        if (newContent !== content) {
          content = newContent;
          hasChanges = true;
        }
      });
      
      // Clean up corrupted text patterns
      const textFixes = [
        // Fix corrupted product name patterns
        { from: /Agentic Workflow Studiontic Workflow Studio/g, to: 'Agentic Workflow Studio' },
        { from: /Use Agentic Workflow Studiontic Workflow Studio/g, to: 'Use Agentic Workflow Studio' },
        { from: /prAgentic Workflow Studiode/g, to: 'provide' },
        { from: /uAgentic Workflow Studiothis/g, to: 'use this' },
        { from: /TheAgentic Workflow Studioxt/g, to: 'The next' },
        { from: /decAgentic Workflow Studioons/g, to: 'decisions' },
        // Fix other corrupted patterns
        { from: /```Agentic Workflow Studio/g, to: '```' },
        { from: /--Agentic Workflow Studio---/g, to: '------' }
      ];
      
      textFixes.forEach(fix => {
        const newContent = content.replace(fix.from, fix.to);
        if (newContent !== content) {
          content = newContent;
          hasChanges = true;
        }
      });
      
      // Add missing frontmatter fields for tutorials
      if (this.isTutorialFile(filePath) && !this.hasFrontmatterField(content, 'difficulty')) {
        content = this.addDifficultyIndicator(content, filePath);
        hasChanges = true;
      }
      
      // Clean up excessive whitespace and formatting
      const cleanContent = content
        .replace(/\n{4,}/g, '\n\n\n') // Limit consecutive newlines to 3
        .replace(/[ \t]+$/gm, '') // Remove trailing whitespace
        .replace(/^\s*\n/gm, '\n'); // Remove empty lines with only whitespace
      
      if (cleanContent !== content) {
        content = cleanContent;
        hasChanges = true;
      }
      
      // Write back if changes were made
      if (hasChanges) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.fixedFiles.push(filePath);
      }
      
    } catch (error) {
      this.errors.push({
        file: filePath,
        error: error.message
      });
    }
  }

  isTutorialFile(filePath) {
    const tutorialPaths = [
      'learning/text-courses',
      'learning/examples',
      'usage/how-to',
      'usage/quick-wins',
      'advanced-ai/examples'
    ];
    
    return tutorialPaths.some(path => filePath.includes(path));
  }

  hasFrontmatterField(content, field) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    
    if (match) {
      return match[1].includes(`${field}:`);
    }
    
    return false;
  }

  addDifficultyIndicator(content, filePath) {
    const frontmatterRegex = /^(---\n[\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    
    if (match) {
      // Determine difficulty based on file path
      let difficulty = '🌱 beginner';
      if (filePath.includes('intermediate') || filePath.includes('how-to')) {
        difficulty = '🚀 intermediate';
      } else if (filePath.includes('advanced') || filePath.includes('ai')) {
        difficulty = '🎯 advanced';
      }
      
      const newFrontmatter = match[1] + `\ndifficulty: "${difficulty}"`;
      return content.replace(match[0], newFrontmatter + '\n---');
    }
    
    return content;
  }

  generateReport() {
    console.log('📊 Content Fix Report');
    console.log('====================\n');
    
    console.log(`✅ Files processed successfully: ${this.fixedFiles.length}`);
    
    if (this.fixedFiles.length > 0) {
      console.log('\n📝 Fixed files:');
      this.fixedFiles.slice(0, 20).forEach(file => {
        console.log(`   • ${file}`);
      });
      
      if (this.fixedFiles.length > 20) {
        console.log(`   ... and ${this.fixedFiles.length - 20} more files`);
      }
    }
    
    if (this.errors.length > 0) {
      console.log(`\n❌ Errors encountered: ${this.errors.length}`);
      this.errors.slice(0, 10).forEach(error => {
        console.log(`   • ${error.file}: ${error.error}`);
      });
    }
    
    console.log('\n🎯 Summary of fixes applied:');
    console.log('   • Replaced "n8n" with "Agentic Workflow Studio"');
    console.log('   • Updated "scraping" to "extraction"');
    console.log('   • Fixed "plugin" to "browser extension"');
    console.log('   • Removed broken internal links');
    console.log('   • Cleaned up corrupted text patterns');
    console.log('   • Added difficulty indicators to tutorials');
    console.log('   • Normalized whitespace and formatting');
    
    console.log('\n✅ Content fixes complete!');
  }
}

// Run the fixer
const fixer = new ContentFixer();
fixer.fixAllIssues().catch(console.error);