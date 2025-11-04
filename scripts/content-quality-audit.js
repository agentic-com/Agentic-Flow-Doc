#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

class ContentQualityAuditor {
  constructor() {
    this.issues = [];
    this.stats = {
      totalFiles: 0,
      totalWords: 0,
      averageReadingTime: 0,
      longPages: [],
      brokenLinks: [],
      terminologyInconsistencies: [],
      clarityIssues: []
    };
  }

  async auditAllContent() {
    console.log('🔍 Starting comprehensive content quality audit...\n');
    
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
        await this.auditFile(fullPath);
      }
    }
  }

  async auditFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.stats.totalFiles++;
      
      // Extract frontmatter and content
      const { frontmatter, body } = this.parseFrontmatter(content);
      
      // Count words and estimate reading time
      const wordCount = this.countWords(body);
      this.stats.totalWords += wordCount;
      const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
      
      // Check for length issues (aim for 5-minute read time max)
      if (readingTime > 5) {
        this.stats.longPages.push({
          file: filePath,
          wordCount,
          readingTime,
          title: frontmatter.title || 'Untitled'
        });
      }
      
      // Check for clarity and simplification issues
      this.checkClarity(filePath, body, frontmatter);
      
      // Check for broken internal links
      this.checkInternalLinks(filePath, body);
      
      // Check for terminology consistency
      this.checkTerminology(filePath, body);
      
    } catch (error) {
      this.issues.push({
        type: 'file_error',
        file: filePath,
        message: `Error reading file: ${error.message}`
      });
    }
  }

  parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (match) {
      const frontmatterText = match[1];
      const body = match[2];
      
      // Simple YAML parsing for common fields
      const frontmatter = {};
      frontmatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
          frontmatter[key] = value;
        }
      });
      
      return { frontmatter, body };
    }
    
    return { frontmatter: {}, body: content };
  }

  countWords(text) {
    // Remove code blocks, links, and other markdown syntax
    const cleanText = text
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`[^`]*`/g, '') // Remove inline code
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Replace links with text
      .replace(/[#*_~`]/g, '') // Remove markdown formatting
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return cleanText.split(/\s+/).filter(word => word.length > 0).length;
  }

  checkClarity(filePath, content, frontmatter) {
    const issues = [];
    
    // Check for overly technical language without explanations
    const technicalTerms = [
      'API', 'JSON', 'HTTP', 'REST', 'GraphQL', 'OAuth', 'JWT', 'CORS', 'CSP',
      'DOM', 'CSS', 'JavaScript', 'TypeScript', 'Node.js', 'npm', 'yarn',
      'regex', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'Redis'
    ];
    
    technicalTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = content.match(regex);
      if (matches && matches.length > 2) {
        // Check if term is defined nearby
        const definitionRegex = new RegExp(`${term}[^.]*?(?:is|means|refers to)`, 'i');
        if (!content.match(definitionRegex)) {
          issues.push({
            type: 'technical_term_undefined',
            term,
            occurrences: matches.length
          });
        }
      }
    });
    
    // Check for long paragraphs (should be 2-3 sentences max)
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    paragraphs.forEach((paragraph, index) => {
      const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
      if (sentences.length > 4) {
        issues.push({
          type: 'long_paragraph',
          paragraphIndex: index,
          sentenceCount: sentences.length
        });
      }
    });
    
    // Check for missing skill level indicators
    if (!frontmatter.difficulty && !content.includes('🌱') && !content.includes('🚀') && !content.includes('🎯')) {
      issues.push({
        type: 'missing_difficulty_indicator'
      });
    }
    
    // Check for missing time estimates
    if (!frontmatter.time && !content.includes('min') && !content.includes('hour')) {
      issues.push({
        type: 'missing_time_estimate'
      });
    }
    
    if (issues.length > 0) {
      this.stats.clarityIssues.push({
        file: filePath,
        issues
      });
    }
  }

  checkInternalLinks(filePath, content) {
    // Find all internal links
    const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2];
      
      // Check internal links (starting with / or relative paths)
      if (linkUrl.startsWith('/') || (!linkUrl.startsWith('http') && !linkUrl.startsWith('#'))) {
        // Convert to file system path
        let targetPath = linkUrl;
        if (targetPath.startsWith('/')) {
          targetPath = `src/content/docs${targetPath}`;
        } else {
          // Relative path
          const currentDir = path.dirname(filePath);
          targetPath = path.resolve(currentDir, targetPath);
        }
        
        // Add .md extension if not present and not a directory
        if (!targetPath.endsWith('.md') && !targetPath.endsWith('.mdx') && !targetPath.includes('#')) {
          if (fs.existsSync(targetPath + '.md')) {
            targetPath += '.md';
          } else if (fs.existsSync(targetPath + '.mdx')) {
            targetPath += '.mdx';
          } else if (fs.existsSync(targetPath + '/index.md')) {
            targetPath += '/index.md';
          }
        }
        
        // Check if target exists
        if (!fs.existsSync(targetPath)) {
          this.stats.brokenLinks.push({
            file: filePath,
            linkText,
            linkUrl,
            targetPath
          });
        }
      }
    }
  }

  checkTerminology(filePath, content) {
    const inconsistencies = [];
    
    // Check for old product names that should be updated
    const oldTerms = [
      { old: /\bn8n\b/g, correct: 'Agentic Workflow Studio' },
      { old: /\bN8N\b/g, correct: 'Agentic Workflow Studio' },
      { old: /\bworkflow automation\b/gi, correct: 'workflow' },
      { old: /\bautomation tool\b/gi, correct: 'workflow builder' },
      { old: /\bscraping\b/gi, correct: 'extraction' },
      { old: /\bplugin\b/gi, correct: 'browser extension' },
      { old: /\badd-on\b/gi, correct: 'browser extension' }
    ];
    
    oldTerms.forEach(({ old, correct }) => {
      const matches = content.match(old);
      if (matches) {
        inconsistencies.push({
          type: 'outdated_terminology',
          oldTerm: matches[0],
          correctTerm: correct,
          occurrences: matches.length
        });
      }
    });
    
    if (inconsistencies.length > 0) {
      this.stats.terminologyInconsistencies.push({
        file: filePath,
        inconsistencies
      });
    }
  }

  generateReport() {
    console.log('📊 Content Quality Audit Report');
    console.log('================================\n');
    
    // Overall statistics
    this.stats.averageReadingTime = Math.ceil(this.stats.totalWords / this.stats.totalFiles / 200);
    
    console.log('📈 Overall Statistics:');
    console.log(`   Total files audited: ${this.stats.totalFiles}`);
    console.log(`   Total words: ${this.stats.totalWords.toLocaleString()}`);
    console.log(`   Average reading time: ${this.stats.averageReadingTime} minutes\n`);
    
    // Length issues
    if (this.stats.longPages.length > 0) {
      console.log('⚠️  Pages Exceeding 5-Minute Read Time:');
      this.stats.longPages
        .sort((a, b) => b.readingTime - a.readingTime)
        .slice(0, 10)
        .forEach(page => {
          console.log(`   📄 ${page.title} (${page.readingTime} min, ${page.wordCount} words)`);
          console.log(`      File: ${page.file}`);
        });
      console.log(`   Total long pages: ${this.stats.longPages.length}\n`);
    }
    
    // Broken links
    if (this.stats.brokenLinks.length > 0) {
      console.log('🔗 Broken Internal Links:');
      this.stats.brokenLinks.slice(0, 10).forEach(link => {
        console.log(`   ❌ "${link.linkText}" → ${link.linkUrl}`);
        console.log(`      In: ${link.file}`);
      });
      console.log(`   Total broken links: ${this.stats.brokenLinks.length}\n`);
    }
    
    // Terminology issues
    if (this.stats.terminologyInconsistencies.length > 0) {
      console.log('📝 Terminology Inconsistencies:');
      const termCounts = {};
      this.stats.terminologyInconsistencies.forEach(file => {
        file.inconsistencies.forEach(issue => {
          const key = `${issue.oldTerm} → ${issue.correctTerm}`;
          termCounts[key] = (termCounts[key] || 0) + issue.occurrences;
        });
      });
      
      Object.entries(termCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .forEach(([term, count]) => {
          console.log(`   🔄 ${term} (${count} occurrences)`);
        });
      console.log(`   Files with terminology issues: ${this.stats.terminologyInconsistencies.length}\n`);
    }
    
    // Clarity issues
    if (this.stats.clarityIssues.length > 0) {
      console.log('💡 Clarity and Simplification Issues:');
      
      const issueTypes = {};
      this.stats.clarityIssues.forEach(file => {
        file.issues.forEach(issue => {
          issueTypes[issue.type] = (issueTypes[issue.type] || 0) + 1;
        });
      });
      
      Object.entries(issueTypes)
        .sort(([,a], [,b]) => b - a)
        .forEach(([type, count]) => {
          const description = {
            'technical_term_undefined': 'Technical terms without definitions',
            'long_paragraph': 'Paragraphs with >4 sentences',
            'missing_difficulty_indicator': 'Missing skill level indicators',
            'missing_time_estimate': 'Missing time estimates'
          }[type] || type;
          
          console.log(`   ⚠️  ${description}: ${count} files`);
        });
      console.log(`   Total files with clarity issues: ${this.stats.clarityIssues.length}\n`);
    }
    
    // Recommendations
    console.log('🎯 Recommendations:');
    
    if (this.stats.longPages.length > 0) {
      console.log('   📏 Content Length:');
      console.log('      • Break long pages into focused sub-pages');
      console.log('      • Use expandable sections for detailed information');
      console.log('      • Aim for 5-minute reading time maximum');
    }
    
    if (this.stats.brokenLinks.length > 0) {
      console.log('   🔗 Link Maintenance:');
      console.log('      • Fix broken internal links');
      console.log('      • Update outdated URLs');
      console.log('      • Add backup explanations for external links');
    }
    
    if (this.stats.terminologyInconsistencies.length > 0) {
      console.log('   📝 Terminology:');
      console.log('      • Replace "n8n" with "Agentic Workflow Studio"');
      console.log('      • Use consistent product terminology');
      console.log('      • Update outdated references');
    }
    
    if (this.stats.clarityIssues.length > 0) {
      console.log('   💡 Clarity Improvements:');
      console.log('      • Add inline definitions for technical terms');
      console.log('      • Break long paragraphs into shorter ones');
      console.log('      • Add skill level and time indicators');
      console.log('      • Use more conversational language');
    }
    
    console.log('\n✅ Audit complete! Use these findings to improve content quality.');
  }
}

// Run the audit
const auditor = new ContentQualityAuditor();
auditor.auditAllContent().catch(console.error);