#!/usr/bin/env node

/**
 * Comprehensive Documentation Validation Suite
 * 
 * This script runs all validation tools and generates a comprehensive
 * report on documentation quality and compliance.
 */

import ContentValidator from './content-validator.js';
import CodeExampleTester from './code-example-tester.js';
import TechnicalAccuracyValidator from './technical-accuracy-validator.js';
import fs from 'fs/promises';
import path from 'path';

class ComprehensiveValidator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      overall_status: 'unknown',
      summary: {
        total_files: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      validations: {
        content: null,
        code_examples: null,
        technical_accuracy: null
      },
      recommendations: []
    };
  }

  /**
   * Run all validation tools and generate comprehensive report
   */
  async runAllValidations() {
    console.log('🚀 Starting Comprehensive Documentation Validation Suite\n');
    console.log('=' .repeat(70));
    console.log('This will run all validation tools and generate a complete report');
    console.log('=' .repeat(70) + '\n');

    try {
      // Run content validation
      console.log('📋 Phase 1: Content Structure and Quality Validation');
      const contentValidator = new ContentValidator();
      this.results.validations.content = await contentValidator.validateAllContent();
      
      console.log('\n' + '-'.repeat(50) + '\n');
      
      // Run code example testing
      console.log('🧪 Phase 2: Code Example Testing');
      const codeExampleTester = new CodeExampleTester();
      this.results.validations.code_examples = await codeExampleTester.testAllExamples();
      
      console.log('\n' + '-'.repeat(50) + '\n');
      
      // Run technical accuracy validation
      console.log('🔬 Phase 3: Technical Accuracy Validation');
      const technicalValidator = new TechnicalAccuracyValidator();
      this.results.validations.technical_accuracy = await technicalValidator.validateTechnicalAccuracy();
      
      // Generate comprehensive analysis
      this.analyzeResults();
      
      // Generate report
      await this.generateReport();
      
      // Print final summary
      this.printFinalSummary();
      
      return this.results;
      
    } catch (error) {
      console.error('❌ Validation suite failed:', error);
      this.results.overall_status = 'error';
      this.results.error = error.message;
      return this.results;
    }
  }

  /**
   * Analyze results from all validation tools
   */
  analyzeResults() {
    const content = this.results.validations.content;
    const codeExamples = this.results.validations.code_examples;
    const technical = this.results.validations.technical_accuracy;

    // Calculate overall metrics
    this.results.summary = {
      total_files: content.passed + content.failed,
      passed: Math.min(content.passed, technical.passed),
      failed: Math.max(content.failed, technical.failed),
      warnings: content.warnings + technical.warnings,
      code_examples: {
        total: codeExamples.totalExamples,
        passed: codeExamples.passed,
        failed: codeExamples.failed,
        skipped: codeExamples.skipped
      }
    };

    // Determine overall status
    if (this.results.summary.failed === 0 && codeExamples.failed === 0) {
      this.results.overall_status = 'excellent';
    } else if (this.results.summary.failed <= 2 && codeExamples.failed <= 1) {
      this.results.overall_status = 'good';
    } else if (this.results.summary.failed <= 5 && codeExamples.failed <= 3) {
      this.results.overall_status = 'needs_improvement';
    } else {
      this.results.overall_status = 'poor';
    }

    // Generate recommendations
    this.generateRecommendations();
  }

  /**
   * Generate actionable recommendations based on validation results
   */
  generateRecommendations() {
    const content = this.results.validations.content;
    const codeExamples = this.results.validations.code_examples;
    const technical = this.results.validations.technical_accuracy;

    // Content recommendations
    if (content.failed > 0) {
      this.results.recommendations.push({
        priority: 'high',
        category: 'content_structure',
        title: 'Fix Content Structure Issues',
        description: `${content.failed} files have structural or completeness issues that need immediate attention.`,
        action: 'Review failed files and address missing sections, broken formatting, or incomplete content.'
      });
    }

    if (content.warnings > 10) {
      this.results.recommendations.push({
        priority: 'medium',
        category: 'content_quality',
        title: 'Address Content Quality Warnings',
        description: `${content.warnings} warnings indicate opportunities for content improvement.`,
        action: 'Review warnings and improve content clarity, add missing examples, or enhance explanations.'
      });
    }

    // Code example recommendations
    if (codeExamples.failed > 0) {
      this.results.recommendations.push({
        priority: 'critical',
        category: 'code_examples',
        title: 'Fix Broken Code Examples',
        description: `${codeExamples.failed} code examples are not working correctly.`,
        action: 'Test and fix all failing code examples to ensure they work in the current browser extension environment.'
      });
    }

    if (codeExamples.skipped > codeExamples.totalExamples * 0.3) {
      this.results.recommendations.push({
        priority: 'medium',
        category: 'code_coverage',
        title: 'Improve Code Example Coverage',
        description: `${codeExamples.skipped} code examples were skipped, indicating potential testing gaps.`,
        action: 'Review skipped examples and implement testing for supported languages and scenarios.'
      });
    }

    // Technical accuracy recommendations
    const technicalErrors = technical.issues.filter(issue => issue.severity === 'error').length;
    if (technicalErrors > 0) {
      this.results.recommendations.push({
        priority: 'high',
        category: 'technical_accuracy',
        title: 'Fix Technical Accuracy Issues',
        description: `${technicalErrors} technical errors found in documentation.`,
        action: 'Review and fix deprecated API usage, incorrect permissions, and other technical inaccuracies.'
      });
    }

    // Performance recommendations
    const performanceIssues = technical.issues.filter(issue => issue.category === 'performance_issue').length;
    if (performanceIssues > 0) {
      this.results.recommendations.push({
        priority: 'medium',
        category: 'performance',
        title: 'Address Performance Recommendations',
        description: `${performanceIssues} performance-related improvements identified.`,
        action: 'Review and implement performance best practices in code examples and recommendations.'
      });
    }

    // Security recommendations
    const securityIssues = technical.issues.filter(issue => issue.category.includes('security')).length;
    if (securityIssues > 0) {
      this.results.recommendations.push({
        priority: 'critical',
        category: 'security',
        title: 'Address Security Issues',
        description: `${securityIssues} security-related issues found.`,
        action: 'Immediately review and fix security vulnerabilities in code examples and recommendations.'
      });
    }

    // Overall quality recommendations
    const successRate = (this.results.summary.passed / this.results.summary.total_files) * 100;
    if (successRate < 90) {
      this.results.recommendations.push({
        priority: 'high',
        category: 'overall_quality',
        title: 'Improve Overall Documentation Quality',
        description: `Documentation success rate is ${successRate.toFixed(1)}%, below the 90% target.`,
        action: 'Implement systematic quality improvements and establish regular maintenance procedures.'
      });
    }

    // Sort recommendations by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    this.results.recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  /**
   * Generate comprehensive validation report
   */
  async generateReport() {
    const reportContent = this.generateReportContent();
    const reportPath = path.join(process.cwd(), '.kiro/documentation-standards/reports');
    
    // Ensure reports directory exists
    await fs.mkdir(reportPath, { recursive: true });
    
    // Generate timestamped report filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(reportPath, `validation-report-${timestamp}.md`);
    const jsonFile = path.join(reportPath, `validation-report-${timestamp}.json`);
    
    // Write markdown report
    await fs.writeFile(reportFile, reportContent);
    
    // Write JSON data
    await fs.writeFile(jsonFile, JSON.stringify(this.results, null, 2));
    
    console.log(`\n📄 Detailed report saved to: ${reportFile}`);
    console.log(`📊 JSON data saved to: ${jsonFile}`);
  }

  /**
   * Generate markdown report content
   */
  generateReportContent() {
    const { summary, validations, recommendations, timestamp, overall_status } = this.results;
    
    return `# Documentation Validation Report

**Generated**: ${timestamp}  
**Overall Status**: ${this.getStatusEmoji(overall_status)} ${overall_status.toUpperCase()}

## Executive Summary

${this.getExecutiveSummary()}

## Validation Results

### Content Structure and Quality
- **Total Files**: ${summary.total_files}
- **Passed**: ${summary.passed}
- **Failed**: ${summary.failed}
- **Warnings**: ${summary.warnings}
- **Success Rate**: ${((summary.passed / summary.total_files) * 100).toFixed(1)}%

### Code Examples
- **Total Examples**: ${summary.code_examples.total}
- **Passed**: ${summary.code_examples.passed}
- **Failed**: ${summary.code_examples.failed}
- **Skipped**: ${summary.code_examples.skipped}
- **Success Rate**: ${summary.code_examples.total > 0 ? ((summary.code_examples.passed / summary.code_examples.total) * 100).toFixed(1) : 0}%

### Technical Accuracy
- **Files Reviewed**: ${validations.technical_accuracy.totalFiles}
- **Passed**: ${validations.technical_accuracy.passed}
- **Failed**: ${validations.technical_accuracy.failed}
- **Total Issues**: ${validations.technical_accuracy.issues.length}

## Priority Recommendations

${this.formatRecommendations()}

## Detailed Findings

### Content Issues
${this.formatContentIssues()}

### Code Example Issues
${this.formatCodeExampleIssues()}

### Technical Issues
${this.formatTechnicalIssues()}

## Next Steps

${this.getNextSteps()}

---

*This report was generated automatically by the Documentation Validation Suite.*
`;
  }

  /**
   * Get status emoji for overall status
   */
  getStatusEmoji(status) {
    const emojis = {
      excellent: '🟢',
      good: '🟡',
      needs_improvement: '🟠',
      poor: '🔴',
      error: '❌'
    };
    return emojis[status] || '❓';
  }

  /**
   * Generate executive summary
   */
  getExecutiveSummary() {
    const { summary, overall_status } = this.results;
    const successRate = ((summary.passed / summary.total_files) * 100).toFixed(1);
    
    switch (overall_status) {
      case 'excellent':
        return `Documentation is in excellent condition with ${successRate}% of files passing validation and all code examples working correctly. Minor improvements may be beneficial but no critical issues require immediate attention.`;
      
      case 'good':
        return `Documentation is in good condition with ${successRate}% success rate. A few issues need attention but overall quality is high. Focus on addressing the priority recommendations below.`;
      
      case 'needs_improvement':
        return `Documentation needs improvement with ${successRate}% success rate. Several issues require attention to meet quality standards. Prioritize fixing failed validations and broken code examples.`;
      
      case 'poor':
        return `Documentation quality is poor with ${successRate}% success rate. Significant issues need immediate attention. Implement systematic improvements and establish quality assurance processes.`;
      
      default:
        return `Documentation validation completed with ${successRate}% success rate. Review detailed findings and recommendations below.`;
    }
  }

  /**
   * Format recommendations for report
   */
  formatRecommendations() {
    if (this.results.recommendations.length === 0) {
      return 'No specific recommendations at this time. Continue maintaining current quality standards.';
    }

    return this.results.recommendations.map((rec, index) => {
      const priorityEmoji = {
        critical: '🚨',
        high: '⚠️',
        medium: '📋',
        low: '💡'
      };
      
      return `### ${index + 1}. ${rec.title} ${priorityEmoji[rec.priority]}

**Priority**: ${rec.priority.toUpperCase()}  
**Category**: ${rec.category}

${rec.description}

**Action Required**: ${rec.action}`;
    }).join('\n\n');
  }

  /**
   * Format content issues for report
   */
  formatContentIssues() {
    const content = this.results.validations.content;
    if (content.errors.length === 0) {
      return 'No content structure issues found.';
    }

    return content.errors.slice(0, 10).map(error => {
      return `- **${error.file}**: ${error.errors.join(', ')}`;
    }).join('\n') + (content.errors.length > 10 ? `\n\n*... and ${content.errors.length - 10} more issues*` : '');
  }

  /**
   * Format code example issues for report
   */
  formatCodeExampleIssues() {
    const codeExamples = this.results.validations.code_examples;
    if (codeExamples.errors.length === 0) {
      return 'No code example issues found.';
    }

    return codeExamples.errors.slice(0, 10).map(error => {
      return `- **${error.testId}**: ${error.error}`;
    }).join('\n') + (codeExamples.errors.length > 10 ? `\n\n*... and ${codeExamples.errors.length - 10} more issues*` : '');
  }

  /**
   * Format technical issues for report
   */
  formatTechnicalIssues() {
    const technical = this.results.validations.technical_accuracy;
    const criticalIssues = technical.issues.filter(issue => issue.severity === 'error');
    
    if (criticalIssues.length === 0) {
      return 'No critical technical issues found.';
    }

    return criticalIssues.slice(0, 10).map(issue => {
      return `- **${issue.file}** (Line ${issue.line}): ${issue.message}`;
    }).join('\n') + (criticalIssues.length > 10 ? `\n\n*... and ${criticalIssues.length - 10} more issues*` : '');
  }

  /**
   * Get next steps based on results
   */
  getNextSteps() {
    const steps = [];
    
    if (this.results.summary.failed > 0) {
      steps.push('1. **Address Failed Validations**: Fix all files that failed content validation');
    }
    
    if (this.results.validations.code_examples.failed > 0) {
      steps.push('2. **Fix Code Examples**: Test and repair all broken code examples');
    }
    
    const criticalIssues = this.results.validations.technical_accuracy.issues.filter(issue => issue.severity === 'error');
    if (criticalIssues.length > 0) {
      steps.push('3. **Resolve Technical Issues**: Address all technical accuracy errors');
    }
    
    if (this.results.summary.warnings > 0) {
      steps.push('4. **Improve Content Quality**: Address warnings to enhance user experience');
    }
    
    steps.push('5. **Establish Regular Validation**: Run this validation suite regularly to maintain quality');
    
    return steps.join('\n');
  }

  /**
   * Print final summary to console
   */
  printFinalSummary() {
    console.log('\n' + '='.repeat(70));
    console.log('🎯 COMPREHENSIVE VALIDATION SUMMARY');
    console.log('='.repeat(70));
    
    console.log(`\n${this.getStatusEmoji(this.results.overall_status)} Overall Status: ${this.results.overall_status.toUpperCase()}`);
    
    console.log('\n📊 Key Metrics:');
    console.log(`   • Documentation Files: ${this.results.summary.passed}/${this.results.summary.total_files} passed`);
    console.log(`   • Code Examples: ${this.results.summary.code_examples.passed}/${this.results.summary.code_examples.total} working`);
    console.log(`   • Warnings: ${this.results.summary.warnings}`);
    
    if (this.results.recommendations.length > 0) {
      console.log('\n🎯 Top Priority Actions:');
      this.results.recommendations.slice(0, 3).forEach((rec, index) => {
        const emoji = { critical: '🚨', high: '⚠️', medium: '📋', low: '💡' }[rec.priority];
        console.log(`   ${index + 1}. ${emoji} ${rec.title}`);
      });
    }
    
    const successRate = ((this.results.summary.passed / this.results.summary.total_files) * 100).toFixed(1);
    console.log(`\n📈 Overall Success Rate: ${successRate}%`);
    
    if (this.results.overall_status === 'excellent') {
      console.log('\n🎉 Excellent! Your documentation meets high quality standards.');
    } else if (this.results.overall_status === 'good') {
      console.log('\n👍 Good work! Address the recommendations above to reach excellence.');
    } else {
      console.log('\n🔧 Focus on the priority recommendations to improve documentation quality.');
    }
    
    console.log('\n' + '='.repeat(70));
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ComprehensiveValidator();
  
  validator.runAllValidations()
    .then(results => {
      const exitCode = results.overall_status === 'excellent' || results.overall_status === 'good' ? 0 : 1;
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('Comprehensive validation failed:', error);
      process.exit(1);
    });
}

export default ComprehensiveValidator;