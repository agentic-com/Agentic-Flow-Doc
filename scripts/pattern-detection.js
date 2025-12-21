#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { ContentAnalyzer } from './content-analysis.js';

/**
 * Pattern Detection Engine
 * Automated detection of n8n references and server-specific content
 */

class PatternDetector {
  constructor() {
    this.transformationRules = [
      // Product name transformations
      {
        pattern: /\bn8n\b/g,
        replacement: 'Agentic WorkFlow',
        context: 'global',
        category: 'product-name',
        validation: (content) => !content.includes('n8n.io') // Don't replace if it's a URL
      },
      {
        pattern: /n8n\.io/g,
        replacement: 'Agentic WorkFlow',
        context: 'global',
        category: 'product-name',
        validation: () => true
      },
      {
        pattern: /n8n community/gi,
        replacement: 'Agentic WorkFlow community',
        context: 'global',
        category: 'product-name',
        validation: () => true
      },
      
      // Server-specific content patterns
      {
        pattern: /server deployment/gi,
        replacement: 'browser extension installation',
        context: 'specific',
        category: 'deployment',
        validation: (content) => !content.includes('API server')
      },
      {
        pattern: /self-hosted/gi,
        replacement: 'browser-based',
        context: 'specific',
        category: 'deployment',
        validation: () => true
      },
      {
        pattern: /production deployment/gi,
        replacement: 'browser extension deployment',
        context: 'specific',
        category: 'deployment',
        validation: () => true
      },
      
      // Feature reference transformations
      {
        pattern: /workflow execution/gi,
        replacement: 'browser workflow execution',
        context: 'specific',
        category: 'feature-reference',
        validation: () => true
      },
      {
        pattern: /data processing/gi,
        replacement: 'browser context data processing',
        context: 'specific',
        category: 'feature-reference',
        validation: () => true
      },
      
      // Integration pattern updates
      {
        pattern: /API integration/gi,
        replacement: 'browser-compatible API integration',
        context: 'specific',
        category: 'integration',
        validation: () => true
      },
      {
        pattern: /webhook/gi,
        replacement: 'browser event',
        context: 'specific',
        category: 'integration',
        validation: (content) => content.includes('trigger') || content.includes('event')
      }
    ];

    this.serverSpecificPatterns = [
      // Deployment and hosting
      /docker/gi,
      /kubernetes/gi,
      /hosting/gi,
      /server installation/gi,
      /environment variables/gi,
      /database connection/gi,
      /redis/gi,
      /postgresql/gi,
      /mysql/gi,
      
      // Server operations
      /server restart/gi,
      /server configuration/gi,
      /server logs/gi,
      /server monitoring/gi,
      /load balancing/gi,
      /scaling/gi,
      
      // Infrastructure
      /cloud deployment/gi,
      /AWS/gi,
      /Azure/gi,
      /Google Cloud/gi,
      /VPS/gi,
      /dedicated server/gi
    ];

    this.browserExtensionPatterns = [
      // Browser extension nodes
      /GetSelectedText/gi,
      /GetAllText/gi,
      /GetAllHTML/gi,
      /GetHTMLofSelectedText/gi,
      /GetAllLinks/gi,
      /GetAllImages/gi,
      
      // Browser context features
      /browser context/gi,
      /web page manipulation/gi,
      /DOM interaction/gi,
      /content extraction/gi,
      /browser automation/gi,
      
      // Extension-specific terms
      /Chrome extension/gi,
      /Firefox extension/gi,
      /browser extension/gi,
      /content script/gi,
      /background script/gi
    ];
  }

  /**
   * Detect patterns in content and suggest transformations
   */
  async detectPatterns(content, filePath) {
    const detectionResults = {
      filePath,
      n8nReferences: this.findMatches(content, [/\bn8n\b/gi, /n8n\.io/gi]),
      serverSpecificContent: this.findServerSpecificContent(content),
      browserExtensionContent: this.findBrowserExtensionContent(content),
      suggestedTransformations: this.suggestTransformations(content),
      riskAssessment: this.assessTransformationRisk(content),
      priority: this.calculateTransformationPriority(content)
    };

    return detectionResults;
  }

  /**
   * Find matches for given patterns
   */
  findMatches(content, patterns) {
    const matches = [];
    patterns.forEach(pattern => {
      const found = content.match(pattern);
      if (found) {
        matches.push(...found.map(match => ({
          text: match,
          pattern: pattern.source,
          line: this.findLineNumber(content, match)
        })));
      }
    });
    return matches;
  }

  /**
   * Find server-specific content
   */
  findServerSpecificContent(content) {
    return this.findMatches(content, this.serverSpecificPatterns);
  }

  /**
   * Find browser extension content
   */
  findBrowserExtensionContent(content) {
    return this.findMatches(content, this.browserExtensionPatterns);
  }

  /**
   * Find line number for a match
   */
  findLineNumber(content, match) {
    const lines = content.substring(0, content.indexOf(match)).split('\n');
    return lines.length;
  }

  /**
   * Suggest transformations based on detected patterns
   */
  suggestTransformations(content) {
    const suggestions = [];
    
    this.transformationRules.forEach(rule => {
      const matches = content.match(rule.pattern);
      if (matches && rule.validation(content)) {
        suggestions.push({
          pattern: rule.pattern.source,
          replacement: rule.replacement,
          category: rule.category,
          context: rule.context,
          matches: matches.length,
          confidence: this.calculateConfidence(rule, content)
        });
      }
    });

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Calculate confidence score for transformation
   */
  calculateConfidence(rule, content) {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on context
    if (rule.context === 'global') confidence += 0.3;
    if (rule.category === 'product-name') confidence += 0.2;
    
    // Decrease confidence for complex patterns
    if (rule.pattern.source.includes('|')) confidence -= 0.1;
    if (content.includes('example') || content.includes('sample')) confidence -= 0.1;
    
    return Math.min(1.0, Math.max(0.1, confidence));
  }

  /**
   * Assess transformation risk
   */
  assessTransformationRisk(content) {
    const risks = [];
    
    // Check for code blocks that might break
    if (content.includes('```')) {
      risks.push({
        type: 'code-blocks',
        severity: 'medium',
        description: 'Content contains code blocks that may need careful review'
      });
    }
    
    // Check for external links
    if (content.includes('http')) {
      risks.push({
        type: 'external-links',
        severity: 'low',
        description: 'Content contains external links that may need updating'
      });
    }
    
    // Check for complex integrations
    if (content.includes('API') && content.includes('authentication')) {
      risks.push({
        type: 'api-integration',
        severity: 'high',
        description: 'Content involves API integration that may not work in browser context'
      });
    }
    
    // Check for server-specific operations
    const serverMatches = this.findServerSpecificContent(content);
    if (serverMatches.length > 5) {
      risks.push({
        type: 'server-heavy',
        severity: 'high',
        description: 'Content is heavily server-focused and may need significant rewriting'
      });
    }

    return risks;
  }

  /**
   * Calculate transformation priority
   */
  calculateTransformationPriority(content) {
    let score = 0;
    
    // High impact factors
    if (content.includes('getting started') || content.includes('quick start')) score += 5;
    if (content.includes('installation')) score += 4;
    if (content.match(/\bn8n\b/gi)?.length > 10) score += 4;
    
    // Medium impact factors
    if (content.includes('tutorial') || content.includes('example')) score += 3;
    if (this.findServerSpecificContent(content).length > 3) score += 3;
    if (this.findBrowserExtensionContent(content).length > 0) score += 4;
    
    // Low impact factors
    if (content.includes('advanced')) score += 1;
    if (content.includes('reference')) score += 1;

    if (score >= 8) return 'critical';
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  /**
   * Apply transformations to content
   */
  async applyTransformations(content, transformations) {
    let transformedContent = content;
    const appliedTransformations = [];

    for (const transformation of transformations) {
      if (transformation.confidence > 0.7) {
        const pattern = new RegExp(transformation.pattern, 'gi');
        const beforeCount = (transformedContent.match(pattern) || []).length;
        
        transformedContent = transformedContent.replace(pattern, transformation.replacement);
        
        const afterCount = (transformedContent.match(pattern) || []).length;
        
        if (beforeCount !== afterCount) {
          appliedTransformations.push({
            ...transformation,
            replacements: beforeCount - afterCount
          });
        }
      }
    }

    return {
      content: transformedContent,
      appliedTransformations
    };
  }

  /**
   * Batch process multiple files
   */
  async batchDetection(filePaths) {
    const results = [];
    
    for (const filePath of filePaths) {
      try {
        const content = await readFile(filePath, 'utf-8');
        const detection = await this.detectPatterns(content, filePath);
        results.push(detection);
        
        console.log(`🔍 Analyzed patterns in: ${filePath}`);
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }

    return results;
  }

  /**
   * Generate pattern detection report
   */
  generatePatternReport(detectionResults) {
    console.log('\n🎯 PATTERN DETECTION REPORT');
    console.log('=' .repeat(50));
    
    const totalFiles = detectionResults.length;
    const filesWithN8n = detectionResults.filter(r => r.n8nReferences.length > 0).length;
    const filesWithServer = detectionResults.filter(r => r.serverSpecificContent.length > 0).length;
    const filesWithBrowser = detectionResults.filter(r => r.browserExtensionContent.length > 0).length;
    
    console.log(`Total Files Analyzed: ${totalFiles}`);
    console.log(`Files with n8n References: ${filesWithN8n}`);
    console.log(`Files with Server Content: ${filesWithServer}`);
    console.log(`Files with Browser Extension Content: ${filesWithBrowser}`);
    
    // Priority breakdown
    const priorities = detectionResults.reduce((acc, r) => {
      acc[r.priority] = (acc[r.priority] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📊 Priority Distribution:');
    Object.entries(priorities).forEach(([priority, count]) => {
      console.log(`  ${priority.toUpperCase()}: ${count} files`);
    });
    
    // High-risk files
    const highRiskFiles = detectionResults.filter(r => 
      r.riskAssessment.some(risk => risk.severity === 'high')
    );
    
    if (highRiskFiles.length > 0) {
      console.log('\n⚠️  HIGH RISK FILES:');
      highRiskFiles.forEach(file => {
        console.log(`  • ${file.filePath}`);
        file.riskAssessment
          .filter(risk => risk.severity === 'high')
          .forEach(risk => console.log(`    - ${risk.description}`));
      });
    }
  }
}

// Export for use in other modules
export { PatternDetector };

// Run detection if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const detector = new PatternDetector();
  const analyzer = new ContentAnalyzer();
  
  console.log('🔍 Starting pattern detection analysis...');
  
  analyzer.scanDocumentation()
    .then(results => {
      const filePaths = results.inventory.map(item => item.path);
      return detector.batchDetection(filePaths);
    })
    .then(detectionResults => {
      detector.generatePatternReport(detectionResults);
      
      // Export results
      return writeFile(
        'scripts/reports/pattern-detection-results.json',
        JSON.stringify(detectionResults, null, 2)
      );
    })
    .then(() => {
      console.log('\n💾 Pattern detection results exported to: pattern-detection-results.json');
    })
    .catch(error => {
      console.error('Pattern detection failed:', error);
      process.exit(1);
    });
}