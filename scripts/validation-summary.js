#!/usr/bin/env node

import { readFile, writeFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Validation Summary Generator
 * Consolidates all validation results into a comprehensive report
 */

class ValidationSummaryGenerator {
  constructor() {
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.results = {
      timestamp: this.timestamp,
      validationComplete: false,
      overallStatus: 'FAIL',
      summary: {
        totalValidations: 0,
        passedValidations: 0,
        failedValidations: 0,
        totalIssues: 0,
        criticalIssues: 0,
        warningIssues: 0
      },
      validationResults: {},
      recommendations: [],
      nextSteps: []
    };
  }

  /**
   * Generate comprehensive validation summary
   */
  async generateSummary() {
    console.log('📊 Generating comprehensive validation summary...\n');

    try {
      // Load all validation results
      await this.loadValidationResults();
      
      // Analyze overall status
      this.analyzeOverallStatus();
      
      // Generate recommendations
      this.generateRecommendations();
      
      // Generate next steps
      this.generateNextSteps();
      
      // Create final report
      await this.createFinalReport();
      
      console.log('✅ Validation summary generated successfully');
      
    } catch (error) {
      console.error('❌ Failed to generate validation summary:', error);
      throw error;
    }
  }

  /**
   * Load all validation results from generated files
   */
  async loadValidationResults() {
    const validationFiles = [
      { name: 'comprehensive', pattern: /validation-report-.*\.json$/ },
      { name: 'technical', pattern: /technical-accuracy-report-.*\.json$/ },
      { name: 'links', pattern: /link-check-results\.json$/ }
    ];

    // Check in parent directory for validation files
    const parentDir = join(__dirname, '..');

    for (const validation of validationFiles) {
      try {
        // Check both current directory and parent directory
        const directories = [__dirname, parentDir];
        let matchingFile = null;
        let foundDir = null;
        
        for (const dir of directories) {
          try {
            const files = await readdir(dir);
            const found = files.find(f => validation.pattern.test(f));
            if (found) {
              matchingFile = found;
              foundDir = dir;
              break;
            }
          } catch (error) {
            // Directory might not exist, continue
          }
        }
        
        if (matchingFile && foundDir) {
          const filePath = join(foundDir, matchingFile);
          const content = await readFile(filePath, 'utf-8');
          this.results.validationResults[validation.name] = JSON.parse(content);
          this.results.summary.totalValidations++;
          console.log(`📄 Loaded ${validation.name} validation results from ${matchingFile}`);
        } else {
          console.log(`⚠️  No ${validation.name} validation results found`);
        }
      } catch (error) {
        console.error(`Error loading ${validation.name} results:`, error.message);
      }
    }
  }

  /**
   * Analyze overall validation status
   */
  analyzeOverallStatus() {
    const { validationResults } = this.results;
    let totalIssues = 0;
    let criticalIssues = 0;
    let warningIssues = 0;
    let passedValidations = 0;
    let failedValidations = 0;

    // Analyze comprehensive validation
    if (validationResults.comprehensive) {
      const comp = validationResults.comprehensive;
      if (comp.summary) {
        totalIssues += comp.summary.totalIssues || 0;
        criticalIssues += comp.summary.errors || 0;
        warningIssues += comp.summary.warnings || 0;
        
        if (comp.summary.failedChecks === 0) {
          passedValidations++;
        } else {
          failedValidations++;
        }
      }
    }

    // Analyze technical accuracy
    if (validationResults.technical) {
      const tech = validationResults.technical;
      if (tech.summary) {
        totalIssues += tech.summary.totalIssues || 0;
        criticalIssues += tech.summary.totalIssues || 0; // Treat all technical issues as critical
        
        if (tech.summary.inaccurateFiles === 0) {
          passedValidations++;
        } else {
          failedValidations++;
        }
      }
    }

    // Analyze link validation
    if (validationResults.links) {
      const links = validationResults.links;
      totalIssues += links.brokenLinks || 0;
      criticalIssues += links.brokenLinks || 0; // Treat broken links as critical
      
      if (links.brokenLinks === 0) {
        passedValidations++;
      } else {
        failedValidations++;
      }
    }

    // Update summary
    this.results.summary.totalIssues = totalIssues;
    this.results.summary.criticalIssues = criticalIssues;
    this.results.summary.warningIssues = warningIssues;
    this.results.summary.passedValidations = passedValidations;
    this.results.summary.failedValidations = failedValidations;

    // Determine overall status
    if (failedValidations === 0 && criticalIssues === 0) {
      this.results.overallStatus = 'PASS';
      this.results.validationComplete = true;
    } else if (criticalIssues < 50 && warningIssues < 100) {
      this.results.overallStatus = 'CONDITIONAL_PASS';
      this.results.validationComplete = false;
    } else {
      this.results.overallStatus = 'FAIL';
      this.results.validationComplete = false;
    }
  }

  /**
   * Generate recommendations based on validation results
   */
  generateRecommendations() {
    const { validationResults, summary } = this.results;
    const recommendations = [];

    // Critical issues recommendations
    if (summary.criticalIssues > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Critical Issues',
        action: `Fix ${summary.criticalIssues} critical issues before deployment`,
        details: 'Critical issues include broken links, technical inaccuracies, and deprecated terminology'
      });
    }

    // Terminology recommendations
    if (validationResults.comprehensive?.terminologyCheck?.errors > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Terminology',
        action: 'Update all deprecated n8n references to Agentic Workflow Studio',
        details: 'Use global find-and-replace to ensure consistent product naming'
      });
    }

    // Link validation recommendations
    if (validationResults.links?.brokenLinks > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Links',
        action: `Fix ${validationResults.links.brokenLinks} broken internal links`,
        details: 'Update file paths and ensure all referenced files exist'
      });
    }

    // Browser extension specific recommendations
    if (validationResults.technical?.browserExtensionCapabilities) {
      const inaccurateNodes = validationResults.technical.browserExtensionCapabilities
        .filter(node => !node.accurate).length;
      
      if (inaccurateNodes > 0) {
        recommendations.push({
          priority: 'HIGH',
          category: 'Browser Extension Nodes',
          action: `Update ${inaccurateNodes} browser extension node documentation`,
          details: 'Add browser API examples, security considerations, and permission requirements'
        });
      }
    }

    // Security documentation recommendations
    if (validationResults.technical?.securityLimitations) {
      const inaccurateSecurity = validationResults.technical.securityLimitations
        .filter(sec => !sec.accurate).length;
      
      if (inaccurateSecurity > 0) {
        recommendations.push({
          priority: 'MEDIUM',
          category: 'Security Documentation',
          action: 'Enhance security documentation for browser extension context',
          details: 'Add CSP limitations, CORS restrictions, and browser permission requirements'
        });
      }
    }

    // Code examples recommendations
    if (validationResults.comprehensive?.codeExamples?.errors > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Code Examples',
        action: 'Update code examples for browser extension compatibility',
        details: 'Replace Node.js patterns with browser APIs and add browser context explanations'
      });
    }

    // Warning issues recommendations
    if (summary.warningIssues > 0) {
      recommendations.push({
        priority: 'LOW',
        category: 'Content Quality',
        action: `Address ${summary.warningIssues} warning-level issues`,
        details: 'Improve content completeness, add missing sections, and enhance documentation quality'
      });
    }

    this.results.recommendations = recommendations;
  }

  /**
   * Generate next steps for completing validation
   */
  generateNextSteps() {
    const { overallStatus, summary } = this.results;
    const nextSteps = [];

    if (overallStatus === 'PASS') {
      nextSteps.push({
        step: 1,
        action: 'Documentation Ready for Deployment',
        description: 'All validation checks passed. Documentation is ready for browser extension users.',
        timeEstimate: 'Complete'
      });
    } else {
      // Step 1: Fix critical issues
      if (summary.criticalIssues > 0) {
        nextSteps.push({
          step: 1,
          action: 'Fix Critical Issues',
          description: `Address ${summary.criticalIssues} critical issues including broken links and technical inaccuracies`,
          timeEstimate: '2-4 hours',
          priority: 'HIGH'
        });
      }

      // Step 2: Update terminology
      nextSteps.push({
        step: 2,
        action: 'Global Terminology Update',
        description: 'Run global find-and-replace to update all n8n references to Agentic Workflow Studio',
        timeEstimate: '30 minutes',
        priority: 'HIGH'
      });

      // Step 3: Fix broken links
      nextSteps.push({
        step: 3,
        action: 'Fix Broken Links',
        description: 'Update internal links and ensure all referenced files exist',
        timeEstimate: '1-2 hours',
        priority: 'HIGH'
      });

      // Step 4: Update browser extension documentation
      nextSteps.push({
        step: 4,
        action: 'Enhance Browser Extension Documentation',
        description: 'Add browser API examples, security considerations, and permission requirements',
        timeEstimate: '2-3 hours',
        priority: 'MEDIUM'
      });

      // Step 5: Address warnings
      if (summary.warningIssues > 0) {
        nextSteps.push({
          step: 5,
          action: 'Address Warning Issues',
          description: 'Improve content quality and completeness',
          timeEstimate: '1-2 hours',
          priority: 'LOW'
        });
      }

      // Step 6: Re-run validation
      nextSteps.push({
        step: nextSteps.length + 1,
        action: 'Re-run Validation',
        description: 'Execute comprehensive validation again to verify all issues are resolved',
        timeEstimate: '15 minutes',
        priority: 'HIGH'
      });
    }

    this.results.nextSteps = nextSteps;
  }

  /**
   * Create final validation report
   */
  async createFinalReport() {
    const reportPath = `scripts/reports/final-validation-summary-${this.timestamp}.json`;
    const readablePath = `scripts/reports/final-validation-summary-${this.timestamp}.md`;
    
    // Generate JSON report
    await writeFile(reportPath, JSON.stringify(this.results, null, 2));
    
    // Generate markdown report
    const markdownReport = this.generateMarkdownReport();
    await writeFile(readablePath, markdownReport);
    
    // Display summary
    this.displaySummary();
    
    console.log(`\n💾 Detailed JSON report: ${reportPath}`);
    console.log(`📄 Readable markdown report: ${readablePath}`);
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport() {
    const { overallStatus, summary, recommendations, nextSteps } = this.results;
    
    let md = `# Documentation Validation Summary\n\n`;
    md += `**Generated:** ${new Date().toLocaleString()}\n`;
    md += `**Overall Status:** ${overallStatus}\n`;
    md += `**Validation Complete:** ${this.results.validationComplete ? 'Yes' : 'No'}\n\n`;
    
    md += `## Summary Statistics\n\n`;
    md += `| Metric | Count |\n`;
    md += `|--------|-------|\n`;
    md += `| Total Validations | ${summary.totalValidations} |\n`;
    md += `| Passed Validations | ${summary.passedValidations} |\n`;
    md += `| Failed Validations | ${summary.failedValidations} |\n`;
    md += `| Total Issues | ${summary.totalIssues} |\n`;
    md += `| Critical Issues | ${summary.criticalIssues} |\n`;
    md += `| Warning Issues | ${summary.warningIssues} |\n\n`;
    
    md += `## Recommendations\n\n`;
    recommendations.forEach((rec, index) => {
      md += `### ${index + 1}. ${rec.category} (${rec.priority} Priority)\n\n`;
      md += `**Action:** ${rec.action}\n\n`;
      md += `**Details:** ${rec.details}\n\n`;
    });
    
    md += `## Next Steps\n\n`;
    nextSteps.forEach(step => {
      md += `### Step ${step.step}: ${step.action}\n\n`;
      md += `**Description:** ${step.description}\n\n`;
      if (step.timeEstimate) {
        md += `**Time Estimate:** ${step.timeEstimate}\n\n`;
      }
      if (step.priority) {
        md += `**Priority:** ${step.priority}\n\n`;
      }
    });
    
    md += `## Validation Details\n\n`;
    
    // Add details from each validation
    Object.entries(this.results.validationResults).forEach(([name, results]) => {
      md += `### ${name.charAt(0).toUpperCase() + name.slice(1)} Validation\n\n`;
      
      if (results.summary) {
        md += `- **Status:** ${results.summary.failedValidation === 0 ? 'PASS' : 'FAIL'}\n`;
        md += `- **Files Checked:** ${results.summary.totalFiles || results.summary.reviewedFiles || 'N/A'}\n`;
        md += `- **Issues Found:** ${results.summary.errors + results.summary.warnings || results.summary.totalIssues || 'N/A'}\n\n`;
      }
    });
    
    return md;
  }

  /**
   * Display summary to console
   */
  displaySummary() {
    const { overallStatus, summary } = this.results;
    
    console.log('\n📋 FINAL VALIDATION SUMMARY');
    console.log('=' .repeat(60));
    console.log(`Overall Status: ${overallStatus}`);
    console.log(`Validation Complete: ${this.results.validationComplete ? 'Yes' : 'No'}`);
    console.log(`Total Issues: ${summary.totalIssues}`);
    console.log(`Critical Issues: ${summary.criticalIssues}`);
    console.log(`Warning Issues: ${summary.warningIssues}`);
    
    if (overallStatus === 'PASS') {
      console.log('\n✅ All validation checks passed!');
      console.log('📚 Documentation is ready for browser extension users.');
    } else {
      console.log(`\n❌ Validation incomplete - ${summary.failedValidations} checks failed`);
      console.log('🔧 Review recommendations and complete next steps.');
    }
    
    console.log('\n🎯 Priority Actions:');
    this.results.recommendations
      .filter(r => r.priority === 'HIGH')
      .slice(0, 3)
      .forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec.action}`);
      });
  }
}

// Export for use in other modules
export { ValidationSummaryGenerator };

// Run summary generation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new ValidationSummaryGenerator();
  
  generator.generateSummary()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Summary generation failed:', error);
      process.exit(1);
    });
}