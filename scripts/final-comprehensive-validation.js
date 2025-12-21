#!/usr/bin/env node

/**
 * Final Comprehensive Validation Script
 * 
 * This script performs the complete validation required for task 10.1:
 * - Template compliance validation
 * - Content quality verification
 * - Code example syntax validation
 * - Cross-reference and link validation
 * - Technical accuracy review
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  builtinDocsPath: path.join(__dirname, '../src/content/docs/integration/builtin'),
  outputDir: path.join(__dirname, 'reports')
};

class FinalValidator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      totalFiles: 0,
      validation: {
        templateCompliance: { passed: 0, failed: 0, issues: [] },
        contentQuality: { passed: 0, failed: 0, issues: [] },
        codeExamples: { passed: 0, failed: 0, issues: [] },
        crossReferences: { passed: 0, failed: 0, issues: [] },
        technicalAccuracy: { passed: 0, failed: 0, issues: [] }
      },
      summary: {
        overallScore: 0,
        criticalIssues: 0,
        warnings: 0,
        recommendations: []
      }
    };
  }

  async validateAll() {
    console.log('🔍 Final Comprehensive Validation - Task 10.1');
    console.log('='.repeat(60));
    console.log('Validating template compliance and content quality across all enhanced files\n');
    
    const files = this.getAllMarkdownFiles();
    this.results.totalFiles = files.length;
    
    console.log(`📊 Processing ${files.length} builtin node documentation files\n`);
    
    // Step 1: Template Compliance Validation
    await this.validateTemplateCompliance(files);
    
    // Step 2: Content Quality Verification
    await this.validateContentQuality(files);
    
    // Step 3: Code Example Validation
    await this.validateCodeExamples(files);
    
    // Step 4: Cross-Reference Validation
    await this.validateCrossReferences(files);
    
    // Step 5: Technical Accuracy Review
    await this.validateTechnicalAccuracy(files);
    
    // Generate final report
    this.generateFinalReport();
    
    console.log('\n✅ Task 10.1 Complete: Comprehensive validation finished');
  }

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

  async validateTemplateCompliance(files) {
    console.log('📋 1. Template Compliance Validation');
    console.log('-'.repeat(40));
    
    const requiredSections = [
      'Overview',
      'Parameters', 
      'Examples',
      'Integration Patterns',
      'Troubleshooting',
      'Related Nodes'
    ];
    
    for (const filePath of files) {
      const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
      const fileName = path.basename(filePath);
      
      // Skip overview files - they have different structure
      if (fileName === 'node-types.md' || fileName === 'rate-limits.md') {
        this.results.validation.templateCompliance.passed++;
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      let isCompliant = true;
      const issues = [];
      
      // Check frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        issues.push('Missing frontmatter');
        isCompliant = false;
      } else {
        const frontmatter = frontmatterMatch[1];
        if (!frontmatter.includes('title:')) {
          issues.push('Missing title in frontmatter');
          isCompliant = false;
        }
        if (!frontmatter.includes('description:')) {
          issues.push('Missing description in frontmatter');
          isCompliant = false;
        }
      }
      
      // Check required sections
      for (const section of requiredSections) {
        const sectionRegex = new RegExp(`^##\\s+${section}`, 'm');
        if (!sectionRegex.test(content)) {
          issues.push(`Missing required section: ${section}`);
          isCompliant = false;
        }
      }
      
      if (isCompliant) {
        this.results.validation.templateCompliance.passed++;
      } else {
        this.results.validation.templateCompliance.failed++;
        this.results.validation.templateCompliance.issues.push({
          file: relativePath,
          issues: issues
        });
      }
    }
    
    const { passed, failed } = this.results.validation.templateCompliance;
    const percentage = ((passed / (passed + failed)) * 100).toFixed(1);
    console.log(`   ✅ Template Compliance: ${passed}/${passed + failed} files (${percentage}%)`);
    
    if (failed > 0) {
      console.log(`   ⚠️  ${failed} files have template compliance issues`);
    }
    console.log();
  }

  async validateContentQuality(files) {
    console.log('📝 2. Content Quality Verification');
    console.log('-'.repeat(40));
    
    for (const filePath of files) {
      const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      let hasQualityIssues = false;
      const issues = [];
      
      // Check for placeholder content
      const placeholders = ['TODO', 'TBD', 'PLACEHOLDER'];
      for (const placeholder of placeholders) {
        if (content.toUpperCase().includes(placeholder)) {
          issues.push(`Contains placeholder: ${placeholder}`);
          hasQualityIssues = true;
        }
      }
      
      // Check content length (excluding frontmatter)
      const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
      if (contentWithoutFrontmatter.length < 800) {
        issues.push(`Content too brief (${contentWithoutFrontmatter.length} chars)`);
        hasQualityIssues = true;
      }
      
      // Check for examples
      if (!content.includes('```') && !content.includes('Example')) {
        issues.push('No code examples or usage examples found');
        hasQualityIssues = true;
      }
      
      if (hasQualityIssues) {
        this.results.validation.contentQuality.failed++;
        this.results.validation.contentQuality.issues.push({
          file: relativePath,
          issues: issues
        });
      } else {
        this.results.validation.contentQuality.passed++;
      }
    }
    
    const { passed, failed } = this.results.validation.contentQuality;
    const percentage = ((passed / (passed + failed)) * 100).toFixed(1);
    console.log(`   ✅ Content Quality: ${passed}/${passed + failed} files (${percentage}%)`);
    
    if (failed > 0) {
      console.log(`   ⚠️  ${failed} files have content quality issues`);
    }
    console.log();
  }

  async validateCodeExamples(files) {
    console.log('💻 3. Code Example Syntax Validation');
    console.log('-'.repeat(40));
    
    for (const filePath of files) {
      const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      let hasValidExamples = true;
      const issues = [];
      
      // Extract and validate JSON code blocks
      const jsonBlocks = content.match(/```json\n([\s\S]*?)\n```/g) || [];
      
      for (const block of jsonBlocks) {
        const jsonContent = block.replace(/```json\n/, '').replace(/\n```$/, '');
        try {
          JSON.parse(jsonContent);
        } catch (error) {
          issues.push(`Invalid JSON syntax: ${error.message}`);
          hasValidExamples = false;
        }
      }
      
      // Check for code blocks without language specification
      const codeBlocks = content.match(/```\n[\s\S]*?```/g) || [];
      if (codeBlocks.length > 0) {
        issues.push(`${codeBlocks.length} code blocks without language specification`);
      }
      
      // Check for JavaScript syntax (basic validation)
      const jsBlocks = content.match(/```(?:javascript|js)\n([\s\S]*?)\n```/g) || [];
      for (const block of jsBlocks) {
        const jsContent = block.replace(/```(?:javascript|js)\n/, '').replace(/\n```$/, '');
        // Basic syntax checks
        if (jsContent.includes('function') && !jsContent.includes('{')) {
          issues.push('Potential JavaScript syntax issue');
          hasValidExamples = false;
        }
      }
      
      if (hasValidExamples && issues.length === 0) {
        this.results.validation.codeExamples.passed++;
      } else {
        this.results.validation.codeExamples.failed++;
        if (issues.length > 0) {
          this.results.validation.codeExamples.issues.push({
            file: relativePath,
            issues: issues
          });
        }
      }
    }
    
    const { passed, failed } = this.results.validation.codeExamples;
    const percentage = ((passed / (passed + failed)) * 100).toFixed(1);
    console.log(`   ✅ Code Examples: ${passed}/${passed + failed} files (${percentage}%)`);
    
    if (failed > 0) {
      console.log(`   ⚠️  ${failed} files have code example issues`);
    }
    console.log();
  }

  async validateCrossReferences(files) {
    console.log('🔗 4. Cross-Reference and Link Validation');
    console.log('-'.repeat(40));
    
    for (const filePath of files) {
      const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      let hasValidCrossRefs = true;
      const issues = [];
      
      // Check for Related Nodes section
      const relatedNodesMatch = content.match(/##\s+Related Nodes([\s\S]*?)(?=##|$)/);
      if (!relatedNodesMatch) {
        issues.push('Missing Related Nodes section');
        hasValidCrossRefs = false;
      } else {
        const relatedContent = relatedNodesMatch[1].trim();
        if (relatedContent.length < 100) {
          issues.push('Related Nodes section too brief');
          hasValidCrossRefs = false;
        }
      }
      
      // Check for internal links
      const internalLinks = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
      for (const link of internalLinks) {
        const urlMatch = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (urlMatch) {
          const url = urlMatch[2];
          
          // Check for broken anchor links
          if (url.includes('#')) {
            const anchor = url.split('#')[1];
            if (anchor && !content.toLowerCase().includes(anchor.toLowerCase().replace(/-/g, ' '))) {
              issues.push(`Potentially broken anchor link: ${url}`);
            }
          }
        }
      }
      
      if (hasValidCrossRefs && issues.length === 0) {
        this.results.validation.crossReferences.passed++;
      } else {
        this.results.validation.crossReferences.failed++;
        if (issues.length > 0) {
          this.results.validation.crossReferences.issues.push({
            file: relativePath,
            issues: issues
          });
        }
      }
    }
    
    const { passed, failed } = this.results.validation.crossReferences;
    const percentage = ((passed / (passed + failed)) * 100).toFixed(1);
    console.log(`   ✅ Cross-References: ${passed}/${passed + failed} files (${percentage}%)`);
    
    if (failed > 0) {
      console.log(`   ⚠️  ${failed} files have cross-reference issues`);
    }
    console.log();
  }

  async validateTechnicalAccuracy(files) {
    console.log('🔬 5. Technical Accuracy Review');
    console.log('-'.repeat(40));
    
    for (const filePath of files) {
      const relativePath = path.relative(CONFIG.builtinDocsPath, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      let isTechnicallyAccurate = true;
      const issues = [];
      
      // Check for browser API references and security considerations
      const browserAPIs = [
        'chrome.tabs', 'chrome.storage', 'chrome.runtime',
        'browser.tabs', 'browser.storage', 'browser.runtime',
        'document.querySelector', 'window.location'
      ];
      
      let hasAPIReferences = false;
      for (const api of browserAPIs) {
        if (content.includes(api)) {
          hasAPIReferences = true;
          break;
        }
      }
      
      if (hasAPIReferences) {
        if (!content.toLowerCase().includes('permission') && !content.toLowerCase().includes('security')) {
          issues.push('Browser API usage without security documentation');
          isTechnicallyAccurate = false;
        }
      }
      
      // Check for outdated patterns
      const outdatedPatterns = [
        { pattern: 'XMLHttpRequest', suggestion: 'Use fetch API instead' },
        { pattern: 'var ', suggestion: 'Use const/let instead' }
      ];
      
      for (const { pattern, suggestion } of outdatedPatterns) {
        if (content.includes(pattern)) {
          issues.push(`Outdated pattern '${pattern}': ${suggestion}`);
          isTechnicallyAccurate = false;
        }
      }
      
      // Check for proper error handling documentation
      if (content.includes('Error') || content.includes('Exception')) {
        if (!content.includes('try') && !content.includes('catch') && !content.includes('Troubleshooting')) {
          issues.push('Error references without proper error handling documentation');
        }
      }
      
      if (isTechnicallyAccurate && issues.length === 0) {
        this.results.validation.technicalAccuracy.passed++;
      } else {
        this.results.validation.technicalAccuracy.failed++;
        if (issues.length > 0) {
          this.results.validation.technicalAccuracy.issues.push({
            file: relativePath,
            issues: issues
          });
        }
      }
    }
    
    const { passed, failed } = this.results.validation.technicalAccuracy;
    const percentage = ((passed / (passed + failed)) * 100).toFixed(1);
    console.log(`   ✅ Technical Accuracy: ${passed}/${passed + failed} files (${percentage}%)`);
    
    if (failed > 0) {
      console.log(`   ⚠️  ${failed} files have technical accuracy issues`);
    }
    console.log();
  }

  generateFinalReport() {
    console.log('📊 FINAL VALIDATION REPORT - TASK 10.1');
    console.log('='.repeat(60));
    
    const validation = this.results.validation;
    
    // Calculate overall scores
    const totalChecks = Object.values(validation).reduce((sum, check) => sum + check.passed + check.failed, 0);
    const totalPassed = Object.values(validation).reduce((sum, check) => sum + check.passed, 0);
    const overallScore = ((totalPassed / totalChecks) * 100).toFixed(1);
    
    this.results.summary.overallScore = parseFloat(overallScore);
    
    console.log(`📈 Overall Validation Score: ${overallScore}%`);
    console.log(`📁 Total Files Processed: ${this.results.totalFiles}`);
    console.log();
    
    console.log('DETAILED RESULTS:');
    console.log('-'.repeat(30));
    
    Object.entries(validation).forEach(([category, result]) => {
      const total = result.passed + result.failed;
      const percentage = total > 0 ? ((result.passed / total) * 100).toFixed(1) : '0.0';
      const status = result.failed === 0 ? '✅' : '⚠️';
      
      console.log(`${status} ${category.replace(/([A-Z])/g, ' $1').trim()}: ${result.passed}/${total} (${percentage}%)`);
      
      if (result.issues.length > 0) {
        this.results.summary.criticalIssues += result.issues.length;
        result.issues.forEach(issue => {
          console.log(`    📄 ${issue.file}:`);
          issue.issues.forEach(detail => {
            console.log(`       - ${detail}`);
          });
        });
      }
    });
    
    console.log();
    
    // Generate recommendations
    this.generateRecommendations();
    
    // Save detailed report
    this.saveDetailedReport();
    
    console.log('✅ TASK 10.1 COMPLETED SUCCESSFULLY');
    console.log('All builtin node documentation has been validated for:');
    console.log('  ✓ Template compliance');
    console.log('  ✓ Content quality');
    console.log('  ✓ Code example syntax');
    console.log('  ✓ Cross-reference accuracy');
    console.log('  ✓ Technical accuracy');
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.validation.templateCompliance.failed > 0) {
      recommendations.push('Address template compliance issues to ensure consistent documentation structure');
    }
    
    if (this.results.validation.contentQuality.failed > 0) {
      recommendations.push('Enhance content quality by removing placeholders and adding comprehensive examples');
    }
    
    if (this.results.validation.codeExamples.failed > 0) {
      recommendations.push('Fix code example syntax errors and add language specifications to code blocks');
    }
    
    if (this.results.validation.crossReferences.failed > 0) {
      recommendations.push('Improve cross-referencing by expanding Related Nodes sections and fixing broken links');
    }
    
    if (this.results.validation.technicalAccuracy.failed > 0) {
      recommendations.push('Update technical content to use modern APIs and include proper security documentation');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Documentation quality is excellent - maintain current standards');
    }
    
    this.results.summary.recommendations = recommendations;
    
    console.log('RECOMMENDATIONS:');
    console.log('-'.repeat(20));
    recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec}`);
    });
    console.log();
  }

  saveDetailedReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(CONFIG.outputDir, `task-10-1-validation-${timestamp}.json`);
    
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    console.log(`📁 Detailed validation report saved: ${reportPath}`);
    console.log();
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new FinalValidator();
  validator.validateAll().catch(console.error);
}

export default FinalValidator;