#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

class AccessibilityValidator {
  constructor() {
    this.issues = [];
    this.stats = {
      totalFiles: 0,
      imagesWithoutAlt: [],
      poorHeadingStructure: [],
      lowContrastElements: [],
      missingSemanticMarkup: [],
      culturalBiasIssues: []
    };
  }

  async validateAllContent() {
    console.log('♿ Starting accessibility validation...\n');
    
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
        await this.validateFile(fullPath);
      }
    }
  }

  async validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.stats.totalFiles++;
      
      // Check for images without alt text
      this.checkImageAltText(filePath, content);
      
      // Check heading structure
      this.checkHeadingStructure(filePath, content);
      
      // Check for semantic markup
      this.checkSemanticMarkup(filePath, content);
      
      // Check for cultural bias
      this.checkCulturalBias(filePath, content);
      
    } catch (error) {
      this.issues.push({
        type: 'file_error',
        file: filePath,
        message: `Error reading file: ${error.message}`
      });
    }
  }

  checkImageAltText(filePath, content) {
    // Find all image references
    const imageRegex = /!\[([^\]]*)\]\([^)]+\)/g;
    let match;
    
    while ((match = imageRegex.exec(content)) !== null) {
      const altText = match[1];
      
      if (!altText || altText.trim().length === 0) {
        this.stats.imagesWithoutAlt.push({
          file: filePath,
          imageMarkdown: match[0]
        });
      } else if (altText.length < 10 || altText === 'image' || altText === 'screenshot') {
        this.stats.imagesWithoutAlt.push({
          file: filePath,
          imageMarkdown: match[0],
          issue: 'Poor alt text quality'
        });
      }
    }
  }

  checkHeadingStructure(filePath, content) {
    const lines = content.split('\n');
    const headings = [];
    
    lines.forEach((line, index) => {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        headings.push({ level, text, lineNumber: index + 1 });
      }
    });
    
    // Check for proper heading hierarchy
    let issues = [];
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];
      
      // Check if heading level jumps more than 1
      if (current.level > previous.level + 1) {
        issues.push({
          type: 'heading_level_jump',
          lineNumber: current.lineNumber,
          text: current.text,
          currentLevel: current.level,
          previousLevel: previous.level
        });
      }
    }
    
    // Check for missing H1
    if (headings.length > 0 && headings[0].level !== 1) {
      issues.push({
        type: 'missing_h1',
        firstHeading: headings[0]
      });
    }
    
    if (issues.length > 0) {
      this.stats.poorHeadingStructure.push({
        file: filePath,
        issues
      });
    }
  }

  checkSemanticMarkup(filePath, content) {
    const issues = [];
    
    // Check for lists that should use proper markup
    const listPatterns = [
      /^\s*[-*]\s+/gm, // Bullet lists
      /^\s*\d+\.\s+/gm // Numbered lists
    ];
    
    listPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches && matches.length > 2) {
        // Check if they're properly formatted as markdown lists
        const lines = content.split('\n');
        let inList = false;
        let listItems = 0;
        
        lines.forEach(line => {
          if (pattern.test(line)) {
            if (!inList) {
              inList = true;
              listItems = 1;
            } else {
              listItems++;
            }
          } else if (inList && line.trim() === '') {
            // Empty line might end list
          } else if (inList) {
            inList = false;
            if (listItems >= 3) {
              // This looks like a proper list
            }
          }
        });
      }
    });
    
    // Check for tables without proper headers
    const tableRegex = /\|.*\|/g;
    const tableMatches = content.match(tableRegex);
    if (tableMatches && tableMatches.length > 1) {
      // Check if second line has header separators
      const lines = content.split('\n');
      let foundTable = false;
      
      for (let i = 0; i < lines.length - 1; i++) {
        if (lines[i].includes('|') && lines[i + 1].includes('|')) {
          if (!lines[i + 1].includes('---') && !lines[i + 1].includes('===')) {
            issues.push({
              type: 'table_without_headers',
              lineNumber: i + 1
            });
          }
          foundTable = true;
          break;
        }
      }
    }
    
    if (issues.length > 0) {
      this.stats.missingSemanticMarkup.push({
        file: filePath,
        issues
      });
    }
  }

  checkCulturalBias(filePath, content) {
    const issues = [];
    
    // Check for region-specific assumptions
    const regionSpecificTerms = [
      { term: /\$\d+/g, issue: 'USD currency assumption' },
      { term: /\bUS\b|\bUSA\b|\bAmerica\b/g, issue: 'US-centric reference' },
      { term: /\bEurope\b|\bEuropean\b/g, issue: 'Europe-centric reference' },
      { term: /\bChristmas\b|\bThanksgiving\b/g, issue: 'Western holiday assumption' }
    ];
    
    regionSpecificTerms.forEach(({ term, issue }) => {
      const matches = content.match(term);
      if (matches && matches.length > 0) {
        issues.push({
          type: 'cultural_bias',
          issue,
          occurrences: matches.length,
          examples: matches.slice(0, 3)
        });
      }
    });
    
    // Check for gendered language
    const genderedTerms = [
      /\bguys\b/gi,
      /\bmankind\b/gi,
      /\bmanpower\b/gi,
      /\bhe\/she\b/gi
    ];
    
    genderedTerms.forEach(term => {
      const matches = content.match(term);
      if (matches) {
        issues.push({
          type: 'gendered_language',
          term: matches[0],
          occurrences: matches.length
        });
      }
    });
    
    if (issues.length > 0) {
      this.stats.culturalBiasIssues.push({
        file: filePath,
        issues
      });
    }
  }

  generateReport() {
    console.log('♿ Accessibility Validation Report');
    console.log('=================================\n');
    
    console.log(`📊 Files validated: ${this.stats.totalFiles}\n`);
    
    // Image accessibility
    if (this.stats.imagesWithoutAlt.length > 0) {
      console.log('🖼️  Image Accessibility Issues:');
      this.stats.imagesWithoutAlt.slice(0, 10).forEach(issue => {
        console.log(`   ❌ ${issue.file}`);
        console.log(`      ${issue.imageMarkdown}`);
        if (issue.issue) {
          console.log(`      Issue: ${issue.issue}`);
        }
      });
      console.log(`   Total images with accessibility issues: ${this.stats.imagesWithoutAlt.length}\n`);
    }
    
    // Heading structure
    if (this.stats.poorHeadingStructure.length > 0) {
      console.log('📋 Heading Structure Issues:');
      this.stats.poorHeadingStructure.slice(0, 5).forEach(file => {
        console.log(`   📄 ${file.file}`);
        file.issues.forEach(issue => {
          if (issue.type === 'heading_level_jump') {
            console.log(`      ⚠️  Line ${issue.lineNumber}: H${issue.currentLevel} after H${issue.previousLevel}`);
          } else if (issue.type === 'missing_h1') {
            console.log(`      ⚠️  Missing H1, starts with H${issue.firstHeading.level}`);
          }
        });
      });
      console.log(`   Total files with heading issues: ${this.stats.poorHeadingStructure.length}\n`);
    }
    
    // Semantic markup
    if (this.stats.missingSemanticMarkup.length > 0) {
      console.log('🏷️  Semantic Markup Issues:');
      this.stats.missingSemanticMarkup.slice(0, 5).forEach(file => {
        console.log(`   📄 ${file.file}`);
        file.issues.forEach(issue => {
          console.log(`      ⚠️  ${issue.type} at line ${issue.lineNumber || 'unknown'}`);
        });
      });
      console.log(`   Total files with semantic issues: ${this.stats.missingSemanticMarkup.length}\n`);
    }
    
    // Cultural bias
    if (this.stats.culturalBiasIssues.length > 0) {
      console.log('🌍 Cultural Inclusivity Issues:');
      const biasTypes = {};
      this.stats.culturalBiasIssues.forEach(file => {
        file.issues.forEach(issue => {
          const key = issue.issue || issue.type;
          biasTypes[key] = (biasTypes[key] || 0) + (issue.occurrences || 1);
        });
      });
      
      Object.entries(biasTypes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .forEach(([type, count]) => {
          console.log(`   🌐 ${type}: ${count} occurrences`);
        });
      console.log(`   Total files with cultural bias issues: ${this.stats.culturalBiasIssues.length}\n`);
    }
    
    // Recommendations
    console.log('🎯 Accessibility Recommendations:');
    
    if (this.stats.imagesWithoutAlt.length > 0) {
      console.log('   🖼️  Images:');
      console.log('      • Add descriptive alt text to all images');
      console.log('      • Describe what the image shows, not just "image" or "screenshot"');
      console.log('      • Include context about why the image is important');
    }
    
    if (this.stats.poorHeadingStructure.length > 0) {
      console.log('   📋 Headings:');
      console.log('      • Use proper heading hierarchy (H1 → H2 → H3)');
      console.log('      • Don\'t skip heading levels');
      console.log('      • Ensure each page has exactly one H1');
    }
    
    if (this.stats.missingSemanticMarkup.length > 0) {
      console.log('   🏷️  Semantic Markup:');
      console.log('      • Use proper list markup for bullet points');
      console.log('      • Add table headers for data tables');
      console.log('      • Use semantic HTML elements when possible');
    }
    
    if (this.stats.culturalBiasIssues.length > 0) {
      console.log('   🌍 Cultural Inclusivity:');
      console.log('      • Use inclusive, gender-neutral language');
      console.log('      • Avoid region-specific assumptions');
      console.log('      • Provide global examples and scenarios');
      console.log('      • Use international date/currency formats when possible');
    }
    
    console.log('\n✅ Accessibility validation complete!');
  }
}

// Run the validator
const validator = new AccessibilityValidator();
validator.validateAllContent().catch(console.error);