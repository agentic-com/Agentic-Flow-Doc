#!/usr/bin/env node

/**
 * Builtin Nodes Documentation Auditor
 * 
 * Specialized audit tool for systematically evaluating all builtin node
 * documentation files for completeness, structure, and enhancement priorities.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BuiltinNodesAuditor {
  constructor() {
    this.auditResults = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: 0,
        byStatus: {
          complete: 0,
          partial: 0,
          minimal: 0,
          placeholder: 0
        },
        byPriority: {
          high: 0,
          medium: 0,
          low: 0
        },
        byCategory: {}
      },
      files: [],
      recommendations: []
    };

    this.categories = {
      'ai/AIAgents': 'AI Agents',
      'ai/AIDependencies': 'AI Dependencies', 
      'core': 'Core Browser Functions',
      'dataTransformation': 'Data Transformation',
      'dataTransformation/DateTime': 'Date/Time Operations',
      'flow': 'Flow Control',
      'lambda': 'Lambda Workflows',
      'trigger': 'Workflow Triggers'
    };

    this.requiredSections = [
      'Overview',
      'Parameters & Configuration',
      'Browser API Integration',
      'Input/Output Specifications', 
      'Practical Examples',
      'Integration Patterns',
      'Troubleshooting',
      'Related Nodes'
    ];

    this.contentQualityThresholds = {
      placeholder: 50,    // Less than 50 words = placeholder
      minimal: 200,       // Less than 200 words = minimal
      partial: 500,       // Less than 500 words = partial
      complete: 500       // 500+ words with all sections = complete
    };
  }

  /**
   * Run comprehensive audit of all builtin node documentation
   */
  async auditAllBuiltinNodes() {
    console.log('🔍 Starting Builtin Nodes Documentation Audit\n');
    console.log('=' .repeat(60));
    console.log('Systematically evaluating all builtin node documentation');
    console.log('=' .repeat(60) + '\n');

    const builtinDir = path.join(process.cwd(), 'src/content/docs/integration/builtin');
    
    try {
      await this.auditDirectory(builtinDir, '');
      this.generateRecommendations();
      await this.generateAuditReport();
      this.printAuditSummary();
      
      return this.auditResults;
    } catch (error) {
      console.error('❌ Audit failed:', error);
      throw error;
    }
  }

  /**
   * Recursively audit all markdown files in builtin directory
   */
  async auditDirectory(dirPath, relativePath = '') {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const entryRelativePath = path.join(relativePath, entry.name);
        
        if (entry.isDirectory()) {
          await this.auditDirectory(fullPath, entryRelativePath);
        } else if (entry.name.endsWith('.md') && !entry.name.startsWith('_')) {
          await this.auditNodeFile(fullPath, entryRelativePath);
        }
      }
    } catch (error) {
      console.error(`Failed to read directory ${dirPath}:`, error);
    }
  }

  /**
   * Audit individual node documentation file
   */
  async auditNodeFile(filePath, relativePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const fileAudit = await this.analyzeNodeFile(content, relativePath);
      
      this.auditResults.files.push(fileAudit);
      this.auditResults.summary.totalFiles++;
      
      // Update summary statistics
      this.auditResults.summary.byStatus[fileAudit.status]++;
      this.auditResults.summary.byPriority[fileAudit.priority]++;
      
      const category = this.determineCategory(relativePath);
      if (!this.auditResults.summary.byCategory[category]) {
        this.auditResults.summary.byCategory[category] = { total: 0, complete: 0, needsWork: 0 };
      }
      this.auditResults.summary.byCategory[category].total++;
      
      if (fileAudit.status === 'complete') {
        this.auditResults.summary.byCategory[category].complete++;
      } else {
        this.auditResults.summary.byCategory[category].needsWork++;
      }
      
      console.log(`📄 ${relativePath}: ${this.getStatusEmoji(fileAudit.status)} ${fileAudit.status.toUpperCase()} (${fileAudit.priority} priority)`);
      
    } catch (error) {
      console.error(`Failed to audit ${filePath}:`, error);
    }
  }

  /**
   * Analyze individual node file for completeness and quality
   */
  async analyzeNodeFile(content, relativePath) {
    const { frontmatter, body } = this.parseFrontmatter(content);
    
    const analysis = {
      file: relativePath,
      nodeName: this.extractNodeName(relativePath),
      category: this.determineCategory(relativePath),
      frontmatter: {
        hasTitle: !!frontmatter.title,
        hasDescription: !!frontmatter.description,
        titleQuality: this.assessTitleQuality(frontmatter.title),
        descriptionQuality: this.assessDescriptionQuality(frontmatter.description)
      },
      content: {
        wordCount: this.countWords(body),
        hasPlaceholderContent: this.hasPlaceholderContent(body),
        sectionsPresent: this.findPresentSections(body),
        missingSections: [],
        codeExamples: this.countCodeExamples(body),
        hasRealExamples: this.hasRealExamples(body)
      },
      status: 'unknown',
      priority: 'medium',
      issues: [],
      recommendations: [],
      estimatedEffort: 'medium'
    };

    // Determine missing sections
    analysis.content.missingSections = this.requiredSections.filter(
      section => !analysis.content.sectionsPresent.includes(section)
    );

    // Assess overall status
    analysis.status = this.determineStatus(analysis);
    analysis.priority = this.determinePriority(analysis);
    analysis.estimatedEffort = this.estimateEffort(analysis);

    // Generate specific issues and recommendations
    this.generateFileIssues(analysis);
    this.generateFileRecommendations(analysis);

    return analysis;
  }

  /**
   * Parse frontmatter from markdown content
   */
  parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
      return { frontmatter: {}, body: content };
    }
    
    try {
      const frontmatter = yaml.load(match[1]);
      return { frontmatter, body: match[2] };
    } catch (error) {
      return { frontmatter: {}, body: content };
    }
  }

  /**
   * Extract node name from file path
   */
  extractNodeName(relativePath) {
    const fileName = path.basename(relativePath, '.md');
    return fileName.replace(/([A-Z])/g, ' $1').trim();
  }

  /**
   * Determine category from file path
   */
  determineCategory(relativePath) {
    const pathParts = relativePath.split('/');
    
    if (pathParts.includes('AIAgents')) return 'AI Agents';
    if (pathParts.includes('AIDependencies')) return 'AI Dependencies';
    if (pathParts.includes('DateTime')) return 'Date/Time Operations';
    if (pathParts.includes('core')) return 'Core Browser Functions';
    if (pathParts.includes('dataTransformation')) return 'Data Transformation';
    if (pathParts.includes('flow')) return 'Flow Control';
    if (pathParts.includes('lambda')) return 'Lambda Workflows';
    if (pathParts.includes('trigger')) return 'Workflow Triggers';
    
    return 'General';
  }

  /**
   * Count words in content
   */
  countWords(content) {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Check for placeholder content
   */
  hasPlaceholderContent(content) {
    const placeholders = [
      'simple',
      'TODO',
      'PLACEHOLDER',
      '[Add content]',
      '[Description]',
      'Lorem ipsum'
    ];
    
    const lowerContent = content.toLowerCase();
    return placeholders.some(placeholder => lowerContent.includes(placeholder.toLowerCase()));
  }

  /**
   * Find sections present in content
   */
  findPresentSections(content) {
    const headers = this.extractHeaders(content);
    const presentSections = [];
    
    for (const requiredSection of this.requiredSections) {
      const found = headers.some(header => {
        const headerLower = header.toLowerCase();
        const sectionLower = requiredSection.toLowerCase();
        return headerLower.includes(sectionLower) || 
               sectionLower.includes(headerLower) ||
               this.isSectionMatch(header, requiredSection);
      });
      
      if (found) {
        presentSections.push(requiredSection);
      }
    }
    
    return presentSections;
  }

  /**
   * Check if header matches section requirement
   */
  isSectionMatch(header, section) {
    const matches = {
      'Overview': ['overview', 'introduction', 'purpose'],
      'Parameters & Configuration': ['parameters', 'configuration', 'settings', 'options'],
      'Browser API Integration': ['browser', 'api', 'permissions', 'integration'],
      'Input/Output Specifications': ['input', 'output', 'data structure', 'format'],
      'Practical Examples': ['examples', 'usage', 'how to', 'tutorial'],
      'Integration Patterns': ['patterns', 'workflow', 'integration', 'combinations'],
      'Troubleshooting': ['troubleshooting', 'issues', 'problems', 'debugging'],
      'Related Nodes': ['related', 'similar', 'see also', 'alternatives']
    };
    
    const headerLower = header.toLowerCase();
    const sectionMatches = matches[section] || [];
    
    return sectionMatches.some(match => headerLower.includes(match));
  }

  /**
   * Extract headers from markdown content
   */
  extractHeaders(content) {
    const headerRegex = /^#{1,6}\s+(.+)$/gm;
    const headers = [];
    let match;
    
    while ((match = headerRegex.exec(content)) !== null) {
      headers.push(match[1].trim());
    }
    
    return headers;
  }

  /**
   * Count code examples in content
   */
  countCodeExamples(content) {
    const codeBlockRegex = /```[\s\S]*?```/g;
    const matches = content.match(codeBlockRegex);
    return matches ? matches.length : 0;
  }

  /**
   * Check if content has real examples (not placeholders)
   */
  hasRealExamples(content) {
    const codeBlockRegex = /```[\s\S]*?```/g;
    const matches = content.match(codeBlockRegex);
    
    if (!matches) return false;
    
    return matches.some(block => {
      const blockContent = block.toLowerCase();
      return !blockContent.includes('example') && 
             !blockContent.includes('placeholder') &&
             !blockContent.includes('todo') &&
             blockContent.length > 50;
    });
  }

  /**
   * Assess title quality
   */
  assessTitleQuality(title) {
    if (!title) return 'missing';
    if (title.length < 3) return 'too_short';
    if (title.length > 60) return 'too_long';
    if (title.includes('[') || title.includes('TODO')) return 'placeholder';
    return 'good';
  }

  /**
   * Assess description quality
   */
  assessDescriptionQuality(description) {
    if (!description) return 'missing';
    if (description.length < 20) return 'too_short';
    if (description.length > 160) return 'too_long';
    if (description.includes('Explore') && description.includes('for web content manipulation')) {
      return 'generic_template';
    }
    return 'good';
  }

  /**
   * Determine overall status of file
   */
  determineStatus(analysis) {
    const { content, frontmatter } = analysis;
    
    // Placeholder content
    if (content.hasPlaceholderContent || content.wordCount < this.contentQualityThresholds.placeholder) {
      return 'placeholder';
    }
    
    // Minimal content
    if (content.wordCount < this.contentQualityThresholds.minimal || 
        content.missingSections.length > 6) {
      return 'minimal';
    }
    
    // Partial content
    if (content.wordCount < this.contentQualityThresholds.complete || 
        content.missingSections.length > 2 ||
        content.codeExamples === 0) {
      return 'partial';
    }
    
    // Complete content
    if (content.wordCount >= this.contentQualityThresholds.complete &&
        content.missingSections.length <= 1 &&
        content.codeExamples > 0 &&
        frontmatter.hasTitle &&
        frontmatter.hasDescription) {
      return 'complete';
    }
    
    return 'partial';
  }

  /**
   * Determine enhancement priority
   */
  determinePriority(analysis) {
    const { status, category, content } = analysis;
    
    // High priority: placeholder/minimal content or core browser functions
    if (status === 'placeholder' || status === 'minimal') {
      return 'high';
    }
    
    // High priority for core browser functions that are partial
    if (category === 'Core Browser Functions' && status === 'partial') {
      return 'high';
    }
    
    // Medium priority for partial content
    if (status === 'partial') {
      return 'medium';
    }
    
    // Low priority for complete content needing minor updates
    return 'low';
  }

  /**
   * Estimate effort required for enhancement
   */
  estimateEffort(analysis) {
    const { status, content } = analysis;
    
    if (status === 'placeholder') {
      return 'large';  // Complete rewrite needed
    }
    
    if (status === 'minimal') {
      return 'large';  // Substantial content creation needed
    }
    
    if (status === 'partial' && content.missingSections.length > 4) {
      return 'medium'; // Several sections to add
    }
    
    if (status === 'partial') {
      return 'small';  // Minor enhancements needed
    }
    
    return 'small';    // Complete files need minimal work
  }

  /**
   * Generate specific issues for file
   */
  generateFileIssues(analysis) {
    const { frontmatter, content } = analysis;
    
    if (!frontmatter.hasTitle) {
      analysis.issues.push('Missing title in frontmatter');
    }
    
    if (!frontmatter.hasDescription) {
      analysis.issues.push('Missing description in frontmatter');
    }
    
    if (frontmatter.descriptionQuality === 'generic_template') {
      analysis.issues.push('Using generic template description');
    }
    
    if (content.hasPlaceholderContent) {
      analysis.issues.push('Contains placeholder content');
    }
    
    if (content.wordCount < 100) {
      analysis.issues.push('Extremely short content');
    }
    
    if (content.codeExamples === 0) {
      analysis.issues.push('No code examples provided');
    }
    
    if (content.missingSections.length > 0) {
      analysis.issues.push(`Missing ${content.missingSections.length} required sections`);
    }
  }

  /**
   * Generate specific recommendations for file
   */
  generateFileRecommendations(analysis) {
    const { status, content, category } = analysis;
    
    if (status === 'placeholder') {
      analysis.recommendations.push('Complete rewrite needed - implement full template structure');
      analysis.recommendations.push('Add comprehensive examples and use cases');
      analysis.recommendations.push('Document browser API integration and permissions');
    } else if (status === 'minimal') {
      analysis.recommendations.push('Expand content to include all required sections');
      analysis.recommendations.push('Add practical examples with real-world scenarios');
      analysis.recommendations.push('Include troubleshooting and integration patterns');
    } else if (status === 'partial') {
      if (content.missingSections.length > 0) {
        analysis.recommendations.push(`Add missing sections: ${content.missingSections.join(', ')}`);
      }
      if (content.codeExamples === 0) {
        analysis.recommendations.push('Add working code examples');
      }
      if (!content.hasRealExamples) {
        analysis.recommendations.push('Replace placeholder examples with real implementations');
      }
    }
    
    // Category-specific recommendations
    if (category === 'Core Browser Functions') {
      analysis.recommendations.push('Emphasize browser API usage and security considerations');
      analysis.recommendations.push('Include cross-browser compatibility information');
    } else if (category.includes('AI')) {
      analysis.recommendations.push('Document AI model integration and performance considerations');
      analysis.recommendations.push('Include evaluation and testing examples');
    }
  }

  /**
   * Generate overall audit recommendations
   */
  generateRecommendations() {
    const { summary, files } = this.auditResults;
    
    // High-level recommendations based on audit results
    const highPriorityFiles = files.filter(f => f.priority === 'high').length;
    const placeholderFiles = files.filter(f => f.status === 'placeholder').length;
    const minimalFiles = files.filter(f => f.status === 'minimal').length;
    
    if (placeholderFiles > 0) {
      this.auditResults.recommendations.push({
        priority: 'critical',
        category: 'content_creation',
        title: 'Address Placeholder Content',
        description: `${placeholderFiles} files contain only placeholder content and need complete documentation.`,
        action: 'Prioritize these files for immediate content creation using the standardized template.',
        files: files.filter(f => f.status === 'placeholder').map(f => f.file)
      });
    }
    
    if (minimalFiles > 0) {
      this.auditResults.recommendations.push({
        priority: 'high',
        category: 'content_expansion',
        title: 'Expand Minimal Content',
        description: `${minimalFiles} files have minimal content that needs substantial expansion.`,
        action: 'Add missing sections, examples, and comprehensive documentation.',
        files: files.filter(f => f.status === 'minimal').map(f => f.file)
      });
    }
    
    // Category-specific recommendations
    Object.entries(summary.byCategory).forEach(([category, stats]) => {
      if (stats.needsWork > stats.complete) {
        this.auditResults.recommendations.push({
          priority: 'medium',
          category: 'category_improvement',
          title: `Improve ${category} Documentation`,
          description: `${stats.needsWork}/${stats.total} files in ${category} need enhancement.`,
          action: `Focus on completing documentation for ${category} nodes to ensure consistency.`
        });
      }
    });
    
    // Template compliance recommendation
    const filesWithoutExamples = files.filter(f => f.content.codeExamples === 0).length;
    if (filesWithoutExamples > 0) {
      this.auditResults.recommendations.push({
        priority: 'medium',
        category: 'examples',
        title: 'Add Code Examples',
        description: `${filesWithoutExamples} files lack code examples.`,
        action: 'Add practical, working code examples to all node documentation.'
      });
    }
  }

  /**
   * Generate comprehensive audit report
   */
  async generateAuditReport() {
    const reportContent = this.generateReportMarkdown();
    const reportDir = path.join(process.cwd(), '.kiro/documentation-standards/reports');
    
    await fs.mkdir(reportDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(reportDir, `builtin-nodes-audit-${timestamp}.md`);
    const jsonFile = path.join(reportDir, `builtin-nodes-audit-${timestamp}.json`);
    
    await fs.writeFile(reportFile, reportContent);
    await fs.writeFile(jsonFile, JSON.stringify(this.auditResults, null, 2));
    
    console.log(`\n📄 Audit report saved: ${reportFile}`);
    console.log(`📊 JSON data saved: ${jsonFile}`);
  }

  /**
   * Generate markdown report content
   */
  generateReportMarkdown() {
    const { summary, files, recommendations } = this.auditResults;
    
    return `# Builtin Nodes Documentation Audit Report

**Generated**: ${this.auditResults.timestamp}

## Executive Summary

This audit evaluated ${summary.totalFiles} builtin node documentation files for completeness, structure, and quality. The assessment identifies enhancement priorities and provides actionable recommendations for systematic improvement.

### Overall Status Distribution

| Status | Count | Percentage |
|--------|-------|------------|
| 🟢 Complete | ${summary.byStatus.complete} | ${((summary.byStatus.complete / summary.totalFiles) * 100).toFixed(1)}% |
| 🟡 Partial | ${summary.byStatus.partial} | ${((summary.byStatus.partial / summary.totalFiles) * 100).toFixed(1)}% |
| 🟠 Minimal | ${summary.byStatus.minimal} | ${((summary.byStatus.minimal / summary.totalFiles) * 100).toFixed(1)}% |
| 🔴 Placeholder | ${summary.byStatus.placeholder} | ${((summary.byStatus.placeholder / summary.totalFiles) * 100).toFixed(1)}% |

### Enhancement Priority Distribution

| Priority | Count | Description |
|----------|-------|-------------|
| 🚨 High | ${summary.byPriority.high} | Requires immediate attention |
| ⚠️ Medium | ${summary.byPriority.medium} | Should be addressed soon |
| 📋 Low | ${summary.byPriority.low} | Minor improvements needed |

## Category Analysis

${this.generateCategoryAnalysis()}

## Priority Recommendations

${this.formatRecommendations()}

## Detailed File Analysis

### High Priority Files (${files.filter(f => f.priority === 'high').length})

${this.formatFileList(files.filter(f => f.priority === 'high'))}

### Medium Priority Files (${files.filter(f => f.priority === 'medium').length})

${this.formatFileList(files.filter(f => f.priority === 'medium'))}

### Low Priority Files (${files.filter(f => f.priority === 'low').length})

${this.formatFileList(files.filter(f => f.priority === 'low'))}

## Implementation Roadmap

### Phase 1: Critical Issues (Week 1)
- Address all placeholder content files
- Fix missing frontmatter and basic structure issues
- Establish content creation workflow

### Phase 2: High Priority Enhancement (Week 2-3)
- Complete minimal content files
- Add missing required sections
- Implement standardized examples

### Phase 3: Quality Improvement (Week 4-5)
- Enhance partial content files
- Add comprehensive examples and integration patterns
- Implement cross-referencing system

### Phase 4: Polish and Validation (Week 5-6)
- Final quality review and validation
- User experience optimization
- Comprehensive testing of all examples

---

*This audit was generated by the Builtin Nodes Documentation Auditor*
`;
  }

  /**
   * Generate category analysis section
   */
  generateCategoryAnalysis() {
    const { byCategory } = this.auditResults.summary;
    
    return Object.entries(byCategory).map(([category, stats]) => {
      const completionRate = ((stats.complete / stats.total) * 100).toFixed(1);
      const status = completionRate >= 80 ? '🟢' : completionRate >= 50 ? '🟡' : '🔴';
      
      return `### ${category} ${status}
- **Total Files**: ${stats.total}
- **Complete**: ${stats.complete}
- **Need Work**: ${stats.needsWork}
- **Completion Rate**: ${completionRate}%`;
    }).join('\n\n');
  }

  /**
   * Format recommendations for report
   */
  formatRecommendations() {
    if (this.auditResults.recommendations.length === 0) {
      return 'No specific recommendations - documentation is in excellent condition.';
    }

    return this.auditResults.recommendations.map((rec, index) => {
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

**Action Required**: ${rec.action}

${rec.files ? `**Affected Files**: ${rec.files.length} files` : ''}`;
    }).join('\n\n');
  }

  /**
   * Format file list for report
   */
  formatFileList(fileList) {
    if (fileList.length === 0) {
      return '*No files in this category*';
    }

    return fileList.slice(0, 20).map(file => {
      const statusEmoji = this.getStatusEmoji(file.status);
      const effortEmoji = { small: '🟢', medium: '🟡', large: '🔴' }[file.estimatedEffort];
      
      return `- **${file.file}** ${statusEmoji}
  - Status: ${file.status} | Effort: ${file.estimatedEffort} ${effortEmoji} | Words: ${file.content.wordCount}
  - Missing: ${file.content.missingSections.length} sections | Examples: ${file.content.codeExamples}
  - Issues: ${file.issues.join(', ') || 'None'}`;
    }).join('\n');
  }

  /**
   * Get status emoji
   */
  getStatusEmoji(status) {
    const emojis = {
      complete: '🟢',
      partial: '🟡', 
      minimal: '🟠',
      placeholder: '🔴'
    };
    return emojis[status] || '❓';
  }

  /**
   * Print audit summary to console
   */
  printAuditSummary() {
    const { summary } = this.auditResults;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 BUILTIN NODES AUDIT SUMMARY');
    console.log('='.repeat(60));
    
    console.log(`\n📁 Total Files Audited: ${summary.totalFiles}`);
    
    console.log('\n📈 Status Distribution:');
    console.log(`   🟢 Complete: ${summary.byStatus.complete} (${((summary.byStatus.complete / summary.totalFiles) * 100).toFixed(1)}%)`);
    console.log(`   🟡 Partial: ${summary.byStatus.partial} (${((summary.byStatus.partial / summary.totalFiles) * 100).toFixed(1)}%)`);
    console.log(`   🟠 Minimal: ${summary.byStatus.minimal} (${((summary.byStatus.minimal / summary.totalFiles) * 100).toFixed(1)}%)`);
    console.log(`   🔴 Placeholder: ${summary.byStatus.placeholder} (${((summary.byStatus.placeholder / summary.totalFiles) * 100).toFixed(1)}%)`);
    
    console.log('\n🎯 Enhancement Priorities:');
    console.log(`   🚨 High Priority: ${summary.byPriority.high} files`);
    console.log(`   ⚠️ Medium Priority: ${summary.byPriority.medium} files`);
    console.log(`   📋 Low Priority: ${summary.byPriority.low} files`);
    
    console.log('\n📂 Category Status:');
    Object.entries(summary.byCategory).forEach(([category, stats]) => {
      const completionRate = ((stats.complete / stats.total) * 100).toFixed(1);
      const status = completionRate >= 80 ? '🟢' : completionRate >= 50 ? '🟡' : '🔴';
      console.log(`   ${status} ${category}: ${stats.complete}/${stats.total} (${completionRate}%)`);
    });
    
    const overallCompletion = ((summary.byStatus.complete / summary.totalFiles) * 100).toFixed(1);
    console.log(`\n📊 Overall Completion Rate: ${overallCompletion}%`);
    
    if (this.auditResults.recommendations.length > 0) {
      console.log('\n🎯 Top Recommendations:');
      this.auditResults.recommendations.slice(0, 3).forEach((rec, index) => {
        const emoji = { critical: '🚨', high: '⚠️', medium: '📋', low: '💡' }[rec.priority];
        console.log(`   ${index + 1}. ${emoji} ${rec.title}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new BuiltinNodesAuditor();
  
  auditor.auditAllBuiltinNodes()
    .then(results => {
      const hasIssues = results.summary.byStatus.placeholder > 0 || results.summary.byStatus.minimal > 0;
      process.exit(hasIssues ? 1 : 0);
    })
    .catch(error => {
      console.error('Audit failed:', error);
      process.exit(1);
    });
}

export default BuiltinNodesAuditor;