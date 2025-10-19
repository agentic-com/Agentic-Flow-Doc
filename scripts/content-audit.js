#!/usr/bin/env node

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Content Audit Script for `Agentic Workflow Studio` Documentation
 * 
 * This script performs a comprehensive audit of all documentation files
 * to identify completeness gaps, assess quality, and generate enhancement priorities.
 */

class ContentAuditor {
  constructor() {
    this.auditResults = [];
    this.qualityScores = new Map();
    this.contentStats = {
      totalFiles: 0,
      nodeDocumentation: 0,
      tutorials: 0,
      guides: 0,
      examples: 0,
      averageScore: 0,
      criticalIssues: 0,
      enhancementOpportunities: 0
    };
    
    // Quality criteria weights
    this.criteria = {
      hasExamples: { weight: 0.20, description: 'Contains practical code examples' },
      hasTroubleshooting: { weight: 0.15, description: 'Includes troubleshooting section' },
      hasParameters: { weight: 0.15, description: 'Documents parameters/configuration' },
      hasCrossReferences: { weight: 0.10, description: 'Links to related content' },
      hasRealWorldUseCases: { weight: 0.15, description: 'Provides real-world applications' },
      hasProperStructure: { weight: 0.10, description: 'Follows documentation standards' },
      hasCompleteFrontmatter: { weight: 0.05, description: 'Complete frontmatter metadata' },
      hasSecurityConsiderations: { weight: 0.10, description: 'Documents security implications' }
    };
  }

  /**
   * Main audit execution method
   */
  async runAudit() {
    console.log('🔍 Starting comprehensive content audit...\n');
    
    const docsPath = join(process.cwd(), 'src/content/docs');
    await this.auditDirectory(docsPath);
    
    this.calculateOverallStats();
    await this.generateAuditReport();
    await this.generateEnhancementPriorities();
    
    console.log('✅ Content audit completed successfully!');
    console.log(`📊 Audited ${this.contentStats.totalFiles} files`);
    console.log(`📈 Average quality score: ${this.contentStats.averageScore.toFixed(2)}/100`);
    console.log(`⚠️  Critical issues found: ${this.contentStats.criticalIssues}`);
    console.log(`🎯 Enhancement opportunities: ${this.contentStats.enhancementOpportunities}`);
  }

  /**
   * Recursively audit all documentation files in a directory
   */
  async auditDirectory(dirPath) {
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await this.auditDirectory(fullPath);
        } else if (entry.isFile() && this.isDocumentationFile(entry.name)) {
          await this.auditFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error auditing directory ${dirPath}:`, error.message);
    }
  }

  /**
   * Check if file is a documentation file to audit
   */
  isDocumentationFile(filename) {
    const ext = extname(filename).toLowerCase();
    return (ext === '.md' || ext === '.mdx') && 
           !filename.startsWith('_') && 
           filename !== 'index.md';
  }

  /**
   * Audit individual documentation file
   */
  async auditFile(filePath) {
    try {
      const content = await readFile(filePath, 'utf-8');
      const stats = await stat(filePath);
      const relativePath = relative(join(process.cwd(), 'src/content/docs'), filePath);
      
      const auditResult = {
        path: relativePath,
        fullPath: filePath,
        size: stats.size,
        lastModified: stats.mtime,
        contentType: this.determineContentType(relativePath, content),
        qualityScore: 0,
        criteria: {},
        issues: [],
        recommendations: [],
        priority: 'low'
      };

      // Analyze content against quality criteria
      await this.analyzeContent(content, auditResult);
      
      // Calculate overall quality score
      this.calculateQualityScore(auditResult);
      
      // Determine enhancement priority
      this.determinePriority(auditResult);
      
      this.auditResults.push(auditResult);
      this.contentStats.totalFiles++;
      
      // Update content type counters
      this.updateContentTypeStats(auditResult.contentType);
      
      console.log(`📄 Audited: ${relativePath} (Score: ${auditResult.qualityScore}/100)`);
      
    } catch (error) {
      console.error(`Error auditing file ${filePath}:`, error.message);
    }
  }

  /**
   * Determine the type of content based on path and content
   */
  determineContentType(path, content) {
    if (path.includes('/integration/builtin/')) return 'node';
    if (path.includes('/learning/') || path.includes('/examples/')) return 'tutorial';
    if (path.includes('/usage/getting-started/')) return 'guide';
    if (path.includes('/advanced-ai/examples/')) return 'example';
    
    // Analyze content for type hints
    if (content.includes('## Parameters') || content.includes('## Configuration')) return 'node';
    if (content.includes('## Step') || content.includes('tutorial')) return 'tutorial';
    
    return 'guide';
  }

  /**
   * Analyze content against quality criteria
   */
  async analyzeContent(content, auditResult) {
    const lines = content.split('\n');
    const frontmatter = this.extractFrontmatter(content);
    
    // Check each quality criterion
    auditResult.criteria.hasExamples = this.checkForExamples(content);
    auditResult.criteria.hasTroubleshooting = this.checkForTroubleshooting(content);
    auditResult.criteria.hasParameters = this.checkForParameters(content);
    auditResult.criteria.hasCrossReferences = this.checkForCrossReferences(content);
    auditResult.criteria.hasRealWorldUseCases = this.checkForUseCases(content);
    auditResult.criteria.hasProperStructure = this.checkStructure(content, auditResult.contentType);
    auditResult.criteria.hasCompleteFrontmatter = this.checkFrontmatter(frontmatter);
    auditResult.criteria.hasSecurityConsiderations = this.checkSecurityConsiderations(content);
    
    // Identify specific issues and recommendations
    this.identifyIssues(auditResult, content, frontmatter);
  }

  /**
   * Extract frontmatter from content
   */
  extractFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return {};
    
    try {
      const frontmatterText = frontmatterMatch[1];
      const frontmatter = {};
      
      frontmatterText.split('\n').forEach(line => {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
          frontmatter[match[1]] = match[2].replace(/^["']|["']$/g, '');
        }
      });
      
      return frontmatter;
    } catch (error) {
      return {};
    }
  }

  /**
   * Check for code examples in content
   */
  checkForExamples(content) {
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    const hasJavaScript = content.includes('```javascript') || content.includes('```js');
    const hasTypeScript = content.includes('```typescript') || content.includes('```ts');
    const hasJSON = content.includes('```json');
    
    return {
      score: codeBlocks.length > 0 ? (codeBlocks.length >= 2 ? 1.0 : 0.7) : 0,
      details: {
        codeBlockCount: codeBlocks.length,
        hasJavaScript,
        hasTypeScript,
        hasJSON,
        hasMultipleExamples: codeBlocks.length >= 2
      }
    };
  }

  /**
   * Check for troubleshooting content
   */
  checkForTroubleshooting(content) {
    const troubleshootingKeywords = [
      'troubleshooting', 'common issues', 'problems', 'errors',
      'debugging', 'limitations', 'known issues', 'workaround'
    ];
    
    const hasSection = /##\s*(troubleshooting|common\s+issues|known\s+issues)/i.test(content);
    const hasKeywords = troubleshootingKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
    
    return {
      score: hasSection ? 1.0 : (hasKeywords ? 0.5 : 0),
      details: {
        hasSection,
        hasKeywords,
        foundKeywords: troubleshootingKeywords.filter(k => content.toLowerCase().includes(k))
      }
    };
  }

  /**
   * Check for parameter documentation
   */
  checkForParameters(content) {
    const hasParametersSection = /##\s*parameters/i.test(content);
    const hasConfigSection = /##\s*configuration/i.test(content);
    const hasInputOutput = content.includes('Input') && content.includes('Output');
    const hasTable = content.includes('|') && content.includes('---');
    
    return {
      score: hasParametersSection || hasConfigSection ? 1.0 : (hasInputOutput ? 0.6 : 0),
      details: {
        hasParametersSection,
        hasConfigSection,
        hasInputOutput,
        hasTable
      }
    };
  }

  /**
   * Check for cross-references and links
   */
  checkForCrossReferences(content) {
    const internalLinks = (content.match(/\[.*?\]\((?!http).*?\)/g) || []).length;
    const externalLinks = (content.match(/\[.*?\]\(https?:\/\/.*?\)/g) || []).length;
    const seeAlsoSection = /##\s*(see\s+also|related|references)/i.test(content);
    
    return {
      score: internalLinks > 0 ? (internalLinks >= 3 ? 1.0 : 0.7) : 0,
      details: {
        internalLinks,
        externalLinks,
        seeAlsoSection,
        totalLinks: internalLinks + externalLinks
      }
    };
  }

  /**
   * Check for real-world use cases
   */
  checkForUseCases(content) {
    const useCaseKeywords = [
      'use case', 'example', 'scenario', 'real-world', 'practical',
      'application', 'workflow', 'implementation'
    ];
    
    const hasUseCaseSection = /##\s*(use\s+cases?|examples?|scenarios?)/i.test(content);
    const keywordCount = useCaseKeywords.reduce((count, keyword) => 
      count + (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length, 0
    );
    
    return {
      score: hasUseCaseSection ? 1.0 : (keywordCount >= 3 ? 0.7 : (keywordCount > 0 ? 0.3 : 0)),
      details: {
        hasUseCaseSection,
        keywordCount,
        foundKeywords: useCaseKeywords.filter(k => content.toLowerCase().includes(k))
      }
    };
  }

  /**
   * Check document structure based on content type
   */
  checkStructure(content, contentType) {
    const headers = content.match(/^#+\s+.+$/gm) || [];
    const hasTitle = /^#\s+/.test(content);
    
    let expectedSections = [];
    switch (contentType) {
      case 'node':
        expectedSections = ['parameters', 'example', 'input', 'output'];
        break;
      case 'tutorial':
        expectedSections = ['prerequisites', 'step', 'example'];
        break;
      case 'guide':
        expectedSections = ['overview', 'example'];
        break;
    }
    
    const foundSections = expectedSections.filter(section =>
      new RegExp(`##\\s*${section}`, 'i').test(content)
    );
    
    return {
      score: hasTitle ? (foundSections.length / expectedSections.length) : 0,
      details: {
        hasTitle,
        headerCount: headers.length,
        expectedSections,
        foundSections,
        structureScore: foundSections.length / Math.max(expectedSections.length, 1)
      }
    };
  }

  /**
   * Check frontmatter completeness
   */
  checkFrontmatter(frontmatter) {
    const requiredFields = ['title', 'description'];
    const optionalFields = ['template', 'sidebar'];
    
    const hasRequired = requiredFields.every(field => frontmatter[field]);
    const optionalCount = optionalFields.filter(field => frontmatter[field]).length;
    
    return {
      score: hasRequired ? (0.8 + (optionalCount / optionalFields.length) * 0.2) : 0,
      details: {
        hasRequired,
        requiredFields: requiredFields.filter(field => frontmatter[field]),
        optionalFields: optionalFields.filter(field => frontmatter[field]),
        missingRequired: requiredFields.filter(field => !frontmatter[field])
      }
    };
  }

  /**
   * Check for security considerations
   */
  checkSecurityConsiderations(content) {
    const securityKeywords = [
      'security', 'permission', 'privacy', 'cors', 'csp',
      'authentication', 'authorization', 'secure', 'vulnerability'
    ];
    
    const hasSecuritySection = /##\s*security/i.test(content);
    const keywordCount = securityKeywords.reduce((count, keyword) =>
      count + (content.toLowerCase().includes(keyword) ? 1 : 0), 0
    );
    
    return {
      score: hasSecuritySection ? 1.0 : (keywordCount >= 2 ? 0.6 : (keywordCount > 0 ? 0.3 : 0)),
      details: {
        hasSecuritySection,
        keywordCount,
        foundKeywords: securityKeywords.filter(k => content.toLowerCase().includes(k))
      }
    };
  }

  /**
   * Identify specific issues and generate recommendations
   */
  identifyIssues(auditResult, content, frontmatter) {
    const { criteria, contentType } = auditResult;
    
    // Critical issues (score 0)
    if (criteria.hasExamples.score === 0) {
      auditResult.issues.push({
        type: 'critical',
        category: 'examples',
        message: 'No code examples found',
        impact: 'Users cannot understand practical implementation'
      });
      auditResult.recommendations.push('Add at least 2 practical code examples with explanations');
    }
    
    if (criteria.hasCompleteFrontmatter.score === 0) {
      auditResult.issues.push({
        type: 'critical',
        category: 'metadata',
        message: 'Missing required frontmatter fields',
        impact: 'Poor SEO and navigation experience'
      });
      auditResult.recommendations.push('Add complete frontmatter with title and description');
    }
    
    // High priority issues
    if (contentType === 'node' && criteria.hasParameters.score < 0.5) {
      auditResult.issues.push({
        type: 'high',
        category: 'documentation',
        message: 'Insufficient parameter documentation',
        impact: 'Users cannot configure the node properly'
      });
      auditResult.recommendations.push('Add comprehensive parameter documentation with types and examples');
    }
    
    if (criteria.hasTroubleshooting.score === 0) {
      auditResult.issues.push({
        type: 'medium',
        category: 'support',
        message: 'No troubleshooting information',
        impact: 'Users may struggle with common issues'
      });
      auditResult.recommendations.push('Add troubleshooting section with common issues and solutions');
    }
    
    // Enhancement opportunities
    if (criteria.hasCrossReferences.score < 0.7) {
      auditResult.recommendations.push('Add more cross-references to related nodes and concepts');
    }
    
    if (criteria.hasRealWorldUseCases.score < 0.5) {
      auditResult.recommendations.push('Include more real-world use cases and practical applications');
    }
    
    if (contentType === 'node' && criteria.hasSecurityConsiderations.score < 0.5) {
      auditResult.recommendations.push('Document security considerations and browser permissions');
    }
  }

  /**
   * Calculate overall quality score for a file
   */
  calculateQualityScore(auditResult) {
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const [criterion, config] of Object.entries(this.criteria)) {
      const criterionResult = auditResult.criteria[criterion];
      if (criterionResult) {
        totalScore += criterionResult.score * config.weight;
        totalWeight += config.weight;
      }
    }
    
    auditResult.qualityScore = Math.round((totalScore / totalWeight) * 100);
    this.qualityScores.set(auditResult.path, auditResult.qualityScore);
  }

  /**
   * Determine enhancement priority based on quality score and content type
   */
  determinePriority(auditResult) {
    const { qualityScore, contentType, issues } = auditResult;
    const criticalIssues = issues.filter(issue => issue.type === 'critical').length;
    const highIssues = issues.filter(issue => issue.type === 'high').length;
    
    // Priority factors
    const isNodeDoc = contentType === 'node';
    const isTutorial = contentType === 'tutorial';
    const lowQuality = qualityScore < 50;
    const mediumQuality = qualityScore < 70;
    
    if (criticalIssues > 0 || (isNodeDoc && lowQuality)) {
      auditResult.priority = 'critical';
      this.contentStats.criticalIssues++;
    } else if (highIssues > 0 || (isTutorial && lowQuality) || (isNodeDoc && mediumQuality)) {
      auditResult.priority = 'high';
      this.contentStats.enhancementOpportunities++;
    } else if (mediumQuality || highIssues > 0) {
      auditResult.priority = 'medium';
      this.contentStats.enhancementOpportunities++;
    } else {
      auditResult.priority = 'low';
    }
  }

  /**
   * Update content type statistics
   */
  updateContentTypeStats(contentType) {
    switch (contentType) {
      case 'node':
        this.contentStats.nodeDocumentation++;
        break;
      case 'tutorial':
        this.contentStats.tutorials++;
        break;
      case 'guide':
        this.contentStats.guides++;
        break;
      case 'example':
        this.contentStats.examples++;
        break;
    }
  }

  /**
   * Calculate overall statistics
   */
  calculateOverallStats() {
    const scores = Array.from(this.qualityScores.values());
    this.contentStats.averageScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;
  }

  /**
   * Generate comprehensive audit report
   */
  async generateAuditReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = join(process.cwd(), 'scripts/reports', `content-audit-${timestamp}.json`);
    
    const report = {
      metadata: {
        timestamp: new Date().toISOString(),
        totalFiles: this.contentStats.totalFiles,
        averageScore: this.contentStats.averageScore,
        criticalIssues: this.contentStats.criticalIssues,
        enhancementOpportunities: this.contentStats.enhancementOpportunities
      },
      statistics: this.contentStats,
      qualityCriteria: this.criteria,
      auditResults: this.auditResults,
      summary: {
        topPerformers: this.auditResults
          .filter(result => result.qualityScore >= 80)
          .sort((a, b) => b.qualityScore - a.qualityScore)
          .slice(0, 10),
        criticalFiles: this.auditResults
          .filter(result => result.priority === 'critical')
          .sort((a, b) => a.qualityScore - b.qualityScore),
        enhancementCandidates: this.auditResults
          .filter(result => result.priority === 'high' || result.priority === 'medium')
          .sort((a, b) => a.qualityScore - b.qualityScore)
      }
    };
    
    await writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Detailed audit report saved to: ${reportPath}`);
    
    return report;
  }

  /**
   * Generate prioritized enhancement list
   */
  async generateEnhancementPriorities() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const prioritiesPath = join(process.cwd(), 'scripts/reports', `enhancement-priorities-${timestamp}.md`);
    
    const criticalFiles = this.auditResults.filter(r => r.priority === 'critical');
    const highPriorityFiles = this.auditResults.filter(r => r.priority === 'high');
    const mediumPriorityFiles = this.auditResults.filter(r => r.priority === 'medium');
    
    let content = `# Content Enhancement Priorities\n\n`;
    content += `Generated: ${new Date().toISOString()}\n\n`;
    content += `## Summary\n\n`;
    content += `- **Total Files Audited**: ${this.contentStats.totalFiles}\n`;
    content += `- **Average Quality Score**: ${this.contentStats.averageScore.toFixed(2)}/100\n`;
    content += `- **Critical Issues**: ${criticalFiles.length}\n`;
    content += `- **High Priority**: ${highPriorityFiles.length}\n`;
    content += `- **Medium Priority**: ${mediumPriorityFiles.length}\n\n`;
    
    // Critical Priority Section
    if (criticalFiles.length > 0) {
      content += `## 🚨 Critical Priority (${criticalFiles.length} files)\n\n`;
      content += `These files have critical issues that significantly impact user experience:\n\n`;
      
      criticalFiles.sort((a, b) => a.qualityScore - b.qualityScore).forEach(file => {
        content += `### ${file.path}\n`;
        content += `- **Quality Score**: ${file.qualityScore}/100\n`;
        content += `- **Content Type**: ${file.contentType}\n`;
        content += `- **Critical Issues**:\n`;
        file.issues.filter(i => i.type === 'critical').forEach(issue => {
          content += `  - ${issue.message} (${issue.impact})\n`;
        });
        content += `- **Recommendations**:\n`;
        file.recommendations.slice(0, 3).forEach(rec => {
          content += `  - ${rec}\n`;
        });
        content += `\n`;
      });
    }
    
    // High Priority Section
    if (highPriorityFiles.length > 0) {
      content += `## ⚠️ High Priority (${highPriorityFiles.length} files)\n\n`;
      content += `These files would significantly benefit from enhancement:\n\n`;
      
      highPriorityFiles.sort((a, b) => a.qualityScore - b.qualityScore).slice(0, 15).forEach(file => {
        content += `### ${file.path}\n`;
        content += `- **Quality Score**: ${file.qualityScore}/100\n`;
        content += `- **Content Type**: ${file.contentType}\n`;
        content += `- **Key Issues**: ${file.issues.slice(0, 2).map(i => i.message).join(', ')}\n`;
        content += `- **Top Recommendations**: ${file.recommendations.slice(0, 2).join(', ')}\n\n`;
      });
    }
    
    // Enhancement Strategy
    content += `## 📈 Enhancement Strategy\n\n`;
    content += `### Immediate Actions (Critical Priority)\n`;
    content += `1. **Add Missing Examples**: ${criticalFiles.filter(f => f.criteria.hasExamples?.score === 0).length} files need code examples\n`;
    content += `2. **Fix Frontmatter**: ${criticalFiles.filter(f => f.criteria.hasCompleteFrontmatter?.score === 0).length} files need complete metadata\n`;
    content += `3. **Parameter Documentation**: ${criticalFiles.filter(f => f.contentType === 'node' && f.criteria.hasParameters?.score < 0.5).length} node docs need parameter details\n\n`;
    
    content += `### Content Type Analysis\n`;
    content += `- **Node Documentation**: ${this.contentStats.nodeDocumentation} files (avg score: ${this.getAverageScoreByType('node').toFixed(1)})\n`;
    content += `- **Tutorials**: ${this.contentStats.tutorials} files (avg score: ${this.getAverageScoreByType('tutorial').toFixed(1)})\n`;
    content += `- **Guides**: ${this.contentStats.guides} files (avg score: ${this.getAverageScoreByType('guide').toFixed(1)})\n`;
    content += `- **Examples**: ${this.contentStats.examples} files (avg score: ${this.getAverageScoreByType('example').toFixed(1)})\n\n`;
    
    content += `### Quality Criteria Performance\n`;
    Object.entries(this.criteria).forEach(([criterion, config]) => {
      const avgScore = this.getAverageCriterionScore(criterion);
      content += `- **${config.description}**: ${(avgScore * 100).toFixed(1)}% (weight: ${(config.weight * 100).toFixed(0)}%)\n`;
    });
    
    await writeFile(prioritiesPath, content);
    console.log(`🎯 Enhancement priorities saved to: ${prioritiesPath}`);
  }

  /**
   * Get average quality score by content type
   */
  getAverageScoreByType(contentType) {
    const typeFiles = this.auditResults.filter(r => r.contentType === contentType);
    if (typeFiles.length === 0) return 0;
    return typeFiles.reduce((sum, file) => sum + file.qualityScore, 0) / typeFiles.length;
  }

  /**
   * Get average score for a specific criterion
   */
  getAverageCriterionScore(criterion) {
    const scores = this.auditResults
      .map(r => r.criteria[criterion]?.score || 0)
      .filter(score => score !== undefined);
    
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
}

// Execute audit if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new ContentAuditor();
  auditor.runAudit().catch(console.error);
}

export default ContentAuditor;