#!/usr/bin/env node

/**
 * Comprehensive Validation Fix Script
 * 
 * This script performs final validation and fixes for all builtin node documentation,
 * addressing template compliance, content quality, code examples, and cross-references.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  builtinDocsPath: path.join(__dirname, '../src/content/docs/integration/builtin'),
  outputDir: path.join(__dirname, 'reports'),
  backupDir: path.join(__dirname, 'backups')
};

class ComprehensiveValidator {
  constructor() {
    this.results = {
      totalFiles: 0,
      fixedFiles: [],
      validationResults: {
        templateCompliance: 0,
        contentQuality: 0,
        codeExamples: 0,
        crossReferences: 0,
        technicalAccuracy: 0
      },
      issues: {
        fixed: [],
        remaining: []
      }
    };
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    [CONFIG.outputDir, CONFIG.backupDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Main validation and fix entry point
   */
  async validateAndFix() {
    console.log('🔍 Starting comprehensive validation and fix process...\n');
    
    const files = this.getAllMarkdownFiles();
    this.results.totalFiles = files.length;
    
    console.log(`Found ${files.length} documentation files to validate and fix\n`);
    
    // Step 1: Fix JSON syntax issues
    await this.fixJSONSyntaxIssues(files);
    
    // Step 2: Validate template compliance
    await this.validateTemplateCompliance(files);
    
    // Step 3: Validate content quality
    await this.validateContentQuality(files);
    
    // Step 4: Validate code examples
    await this.validateCodeExamples(files);
    
    // Step 5: Validate cross-references
    await this.validateCrossReferences(files);
    
    // Step 6: Validate technical accuracy
    await this.validateTechnicalAccuracy(files);
    
    // Step 7: Generate final report
    this.generateFinalReport();
    
    console.log('\n✅ Comprehensive validation and fix process complete!');
  }

  /**
   * Get all markdown files in the builtin directory
   */
  getAllMarkdownFiles() {
    const files = [];
    
    const scanDirectory = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.name.endsWith('.md') && !entry.name.startsWith('_')) {
          files.push(fullPath);
        }
      }
    };
    
    scanDirectory(CONFIG.builtinDocsPath);
    return files;
  }

  /**
   * Fix JSON syntax issues in all files
   */
  async fixJSONSyntaxIssues(files) {
    console.log('🔧 Step 1: Fixing JSON syntax issues...');
    
    for (const filePath of files) {
      const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
      let content = fs.readFileSync(filePath, 'utf-8');
      let modified = false;
      
      // Find all JSON code blocks
      const jsonBlocks = content.match(/```json[\s\S]*?```/g) || [];
      
      for (const block of jsonBlocks) {
        const jsonContent = block.replace(/```json\n/, '').replace(/\n```$/, '');
        
        try {
          // Try to parse the JSON to validate it
          JSON.parse(jsonContent);
        } catch (error) {
          console.log(`  🔧 Fixing JSON in ${relativePath}: ${error.message}`);
          
          // Common fixes
          let fixedJson = jsonContent;
          
          // Fix unterminated strings by ensuring proper quotes
          fixedJson = this.fixUnterminatedStrings(fixedJson);
          
          // Fix missing commas
          fixedJson = this.fixMissingCommas(fixedJson);
          
          // Fix trailing commas
          fixedJson = this.fixTrailingCommas(fixedJson);
          
          try {
            JSON.parse(fixedJson);
            content = content.replace(block, `\`\`\`json\n${fixedJson}\n\`\`\``);
            modified = true;
            this.results.issues.fixed.push(`JSON syntax in ${relativePath}`);
          } catch (fixError) {
            console.log(`  ❌ Could not fix JSON in ${relativePath}: ${fixError.message}`);
            this.results.issues.remaining.push(`JSON syntax in ${relativePath}: ${fixError.message}`);
          }
        }
      }
      
      if (modified) {
        this.backupFile(filePath);
        fs.writeFileSync(filePath, content);
        this.results.fixedFiles.push(relativePath);
      }
    }
    
    console.log(`  ✅ Fixed JSON syntax issues in ${this.results.fixedFiles.length} files\n`);
  }

  /**
   * Fix unterminated strings in JSON
   */
  fixUnterminatedStrings(jsonContent) {
    // Look for strings that might be unterminated
    const lines = jsonContent.split('\n');
    const fixedLines = lines.map(line => {
      // If line has an opening quote but no closing quote, and ends with comma or brace
      if (line.includes('"') && line.match(/^[^"]*"[^"]*[,}]$/) && !line.match(/^[^"]*"[^"]*"[^"]*$/)) {
        // Find the last quote and ensure it's properly closed
        const lastQuoteIndex = line.lastIndexOf('"');
        if (lastQuoteIndex > 0) {
          const beforeQuote = line.substring(0, lastQuoteIndex + 1);
          const afterQuote = line.substring(lastQuoteIndex + 1);
          if (!afterQuote.includes('"') && (afterQuote.includes(',') || afterQuote.includes('}'))) {
            return beforeQuote + '"' + afterQuote.replace(/[,}]/, '') + (afterQuote.includes(',') ? ',' : '}');
          }
        }
      }
      return line;
    });
    
    return fixedLines.join('\n');
  }

  /**
   * Fix missing commas in JSON
   */
  fixMissingCommas(jsonContent) {
    const lines = jsonContent.split('\n');
    const fixedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
      
      // If current line ends with a value and next line starts with a key, add comma
      if (line && nextLine && 
          (line.endsWith('"') || line.endsWith('}') || line.endsWith(']') || line.match(/\d$/)) &&
          nextLine.startsWith('"') && 
          !line.endsWith(',')) {
        fixedLines.push(lines[i] + ',');
      } else {
        fixedLines.push(lines[i]);
      }
    }
    
    return fixedLines.join('\n');
  }

  /**
   * Fix trailing commas in JSON
   */
  fixTrailingCommas(jsonContent) {
    // Remove trailing commas before closing braces or brackets
    return jsonContent.replace(/,(\s*[}\]])/g, '$1');
  }

  /**
   * Validate template compliance
   */
  async validateTemplateCompliance(files) {
    console.log('🔍 Step 2: Validating template compliance...');
    
    const requiredSections = [
      'Overview',
      'Parameters',
      'Examples',
      'Integration Patterns',
      'Troubleshooting',
      'Related Nodes'
    ];
    
    let compliantFiles = 0;
    
    for (const filePath of files) {
      const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
      const fileName = path.basename(filePath);
      
      // Skip overview files
      if (fileName === 'node-types.md' || fileName === 'rate-limits.md') {
        compliantFiles++;
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      let isCompliant = true;
      
      // Check frontmatter
      if (!content.match(/^---\n[\s\S]*?\n---/)) {
        console.log(`  ⚠️  ${relativePath}: Missing frontmatter`);
        isCompliant = false;
      }
      
      // Check required sections
      for (const section of requiredSections) {
        const sectionRegex = new RegExp(`^##\\s+${section}`, 'm');
        if (!sectionRegex.test(content)) {
          console.log(`  ⚠️  ${relativePath}: Missing section: ${section}`);
          isCompliant = false;
        }
      }
      
      if (isCompliant) {
        compliantFiles++;
      }
    }
    
    this.results.validationResults.templateCompliance = compliantFiles;
    console.log(`  ✅ Template compliance: ${compliantFiles}/${files.length} files compliant\n`);
  }

  /**
   * Validate content quality
   */
  async validateContentQuality(files) {
    console.log('🔍 Step 3: Validating content quality...');
    
    let qualityFiles = 0;
    
    for (const filePath of files) {
      const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      let hasQualityIssues = false;
      
      // Check for placeholder content
      const placeholders = ['TODO', 'TBD', 'PLACEHOLDER'];
      for (const placeholder of placeholders) {
        if (content.includes(placeholder)) {
          console.log(`  ⚠️  ${relativePath}: Contains placeholder: ${placeholder}`);
          hasQualityIssues = true;
        }
      }
      
      // Check content length (excluding frontmatter)
      const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
      if (contentWithoutFrontmatter.length < 1000) {
        console.log(`  ⚠️  ${relativePath}: Content too short (${contentWithoutFrontmatter.length} chars)`);
        hasQualityIssues = true;
      }
      
      if (!hasQualityIssues) {
        qualityFiles++;
      }
    }
    
    this.results.validationResults.contentQuality = qualityFiles;
    console.log(`  ✅ Content quality: ${qualityFiles}/${files.length} files meet quality standards\n`);
  }

  /**
   * Validate code examples
   */
  async validateCodeExamples(files) {
    console.log('🔍 Step 4: Validating code examples...');
    
    let validExampleFiles = 0;
    
    for (const filePath of files) {
      const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      let hasValidExamples = true;
      
      // Check for code blocks
      const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
      
      if (codeBlocks.length === 0) {
        console.log(`  ⚠️  ${relativePath}: No code examples found`);
        hasValidExamples = false;
      } else {
        // Validate JSON blocks
        for (const block of codeBlocks) {
          if (block.startsWith('```json')) {
            const jsonContent = block.replace(/```json\n/, '').replace(/\n```$/, '');
            try {
              JSON.parse(jsonContent);
            } catch (error) {
              console.log(`  ❌ ${relativePath}: Invalid JSON: ${error.message}`);
              hasValidExamples = false;
            }
          }
        }
      }
      
      if (hasValidExamples) {
        validExampleFiles++;
      }
    }
    
    this.results.validationResults.codeExamples = validExampleFiles;
    console.log(`  ✅ Code examples: ${validExampleFiles}/${files.length} files have valid examples\n`);
  }

  /**
   * Validate cross-references
   */
  async validateCrossReferences(files) {
    console.log('🔍 Step 5: Validating cross-references...');
    
    let validCrossRefFiles = 0;
    
    for (const filePath of files) {
      const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      let hasValidCrossRefs = true;
      
      // Check for Related Nodes section
      const relatedNodesMatch = content.match(/##\s+Related Nodes([\s\S]*?)(?=##|$)/);
      if (!relatedNodesMatch) {
        console.log(`  ⚠️  ${relativePath}: Missing Related Nodes section`);
        hasValidCrossRefs = false;
      } else {
        const relatedContent = relatedNodesMatch[1].trim();
        if (relatedContent.length < 50) {
          console.log(`  ⚠️  ${relativePath}: Related Nodes section too brief`);
          hasValidCrossRefs = false;
        }
      }
      
      if (hasValidCrossRefs) {
        validCrossRefFiles++;
      }
    }
    
    this.results.validationResults.crossReferences = validCrossRefFiles;
    console.log(`  ✅ Cross-references: ${validCrossRefFiles}/${files.length} files have valid cross-references\n`);
  }

  /**
   * Validate technical accuracy
   */
  async validateTechnicalAccuracy(files) {
    console.log('🔍 Step 6: Validating technical accuracy...');
    
    let technicallyAccurateFiles = 0;
    
    for (const filePath of files) {
      const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      let isTechnicallyAccurate = true;
      
      // Check for browser API references and security considerations
      const browserAPIs = ['chrome.', 'browser.', 'document.', 'window.'];
      const hasAPIReferences = browserAPIs.some(api => content.includes(api));
      
      if (hasAPIReferences && !content.toLowerCase().includes('permission') && !content.toLowerCase().includes('security')) {
        console.log(`  ⚠️  ${relativePath}: Browser API usage without security documentation`);
        isTechnicallyAccurate = false;
      }
      
      // Check for outdated patterns
      const outdatedPatterns = ['XMLHttpRequest', 'var '];
      for (const pattern of outdatedPatterns) {
        if (content.includes(pattern)) {
          console.log(`  ⚠️  ${relativePath}: Contains outdated pattern: ${pattern}`);
          isTechnicallyAccurate = false;
        }
      }
      
      if (isTechnicallyAccurate) {
        technicallyAccurateFiles++;
      }
    }
    
    this.results.validationResults.technicalAccuracy = technicallyAccurateFiles;
    console.log(`  ✅ Technical accuracy: ${technicallyAccurateFiles}/${files.length} files are technically accurate\n`);
  }

  /**
   * Generate final validation report
   */
  generateFinalReport() {
    console.log('📊 FINAL VALIDATION REPORT');
    console.log('='.repeat(50));
    
    const { validationResults, totalFiles, fixedFiles, issues } = this.results;
    
    console.log(`Total files processed: ${totalFiles}`);
    console.log(`Files modified: ${fixedFiles.length}`);
    console.log('');
    
    console.log('VALIDATION RESULTS:');
    console.log(`Template Compliance: ${validationResults.templateCompliance}/${totalFiles} (${((validationResults.templateCompliance/totalFiles)*100).toFixed(1)}%)`);
    console.log(`Content Quality: ${validationResults.contentQuality}/${totalFiles} (${((validationResults.contentQuality/totalFiles)*100).toFixed(1)}%)`);
    console.log(`Code Examples: ${validationResults.codeExamples}/${totalFiles} (${((validationResults.codeExamples/totalFiles)*100).toFixed(1)}%)`);
    console.log(`Cross-References: ${validationResults.crossReferences}/${totalFiles} (${((validationResults.crossReferences/totalFiles)*100).toFixed(1)}%)`);
    console.log(`Technical Accuracy: ${validationResults.technicalAccuracy}/${totalFiles} (${((validationResults.technicalAccuracy/totalFiles)*100).toFixed(1)}%)`);
    console.log('');
    
    console.log(`Issues Fixed: ${issues.fixed.length}`);
    if (issues.fixed.length > 0) {
      issues.fixed.forEach(issue => console.log(`  ✅ ${issue}`));
    }
    console.log('');
    
    console.log(`Remaining Issues: ${issues.remaining.length}`);
    if (issues.remaining.length > 0) {
      issues.remaining.forEach(issue => console.log(`  ❌ ${issue}`));
    }
    
    // Save detailed report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(CONFIG.outputDir, `comprehensive-validation-${timestamp}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    console.log(`\n📁 Detailed report saved to: ${reportPath}`);
  }

  /**
   * Create backup of file before modification
   */
  backupFile(filePath) {
    const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
    const backupPath = path.join(CONFIG.backupDir, relativePath);
    const backupDir = path.dirname(backupPath);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    fs.copyFileSync(filePath, backupPath);
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ComprehensiveValidator();
  validator.validateAndFix().catch(console.error);
}

export default ComprehensiveValidator;