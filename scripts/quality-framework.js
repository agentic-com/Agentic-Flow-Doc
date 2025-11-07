#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * Content Quality Scoring Framework
 * 
 * This module provides a comprehensive framework for scoring and monitoring
 * documentation quality based on established criteria and user impact metrics.
 */

export class QualityFramework {
  constructor() {
    this.scoringCriteria = {
      // Core Content Quality (60% weight)
      codeExamples: {
        weight: 0.20,
        description: 'Practical code examples with explanations',
        scoring: {
          excellent: { min: 3, score: 1.0, description: '3+ comprehensive examples' },
          good: { min: 2, score: 0.8, description: '2 solid examples' },
          fair: { min: 1, score: 0.5, description: '1 basic example' },
          poor: { min: 0, score: 0.0, description: 'No examples' }
        }
      },
      
      parameterDocumentation: {
        weight: 0.15,
        description: 'Complete parameter and configuration details',
        scoring: {
          excellent: { score: 1.0, description: 'All parameters with types, defaults, examples' },
          good: { score: 0.8, description: 'Most parameters documented well' },
          fair: { score: 0.5, description: 'Basic parameter listing' },
          poor: { score: 0.0, description: 'No parameter documentation' }
        }
      },
      
      realWorldUseCases: {
        weight: 0.15,
        description: 'Practical applications and scenarios',
        scoring: {
          excellent: { score: 1.0, description: 'Multiple detailed use cases' },
          good: { score: 0.8, description: 'Some practical examples' },
          fair: { score: 0.5, description: 'Basic use case mentions' },
          poor: { score: 0.0, description: 'No practical applications' }
        }
      },
      
      troubleshooting: {
        weight: 0.10,
        description: 'Common issues and solutions',
        scoring: {
          excellent: { score: 1.0, description: 'Comprehensive troubleshooting section' },
          good: { score: 0.8, description: 'Good issue coverage' },
          fair: { score: 0.5, description: 'Basic troubleshooting' },
          poor: { score: 0.0, description: 'No troubleshooting info' }
        }
      },
      
      // User Experience (25% weight)
      crossReferences: {
        weight: 0.10,
        description: 'Links to related content and concepts',
        scoring: {
          excellent: { min: 5, score: 1.0, description: '5+ relevant links' },
          good: { min: 3, score: 0.8, description: '3-4 good links' },
          fair: { min: 1, score: 0.5, description: '1-2 basic links' },
          poor: { min: 0, score: 0.0, description: 'No cross-references' }
        }
      },
      
      structureCompliance: {
        weight: 0.10,
        description: 'Follows documentation standards',
        scoring: {
          excellent: { score: 1.0, description: 'Perfect structure compliance' },
          good: { score: 0.8, description: 'Good structure with minor gaps' },
          fair: { score: 0.5, description: 'Basic structure present' },
          poor: { score: 0.0, description: 'Poor or missing structure' }
        }
      },
      
      metadataCompleteness: {
        weight: 0.05,
        description: 'Complete frontmatter and metadata',
        scoring: {
          excellent: { score: 1.0, description: 'All metadata fields complete' },
          good: { score: 0.8, description: 'Most metadata present' },
          fair: { score: 0.5, description: 'Basic metadata only' },
          poor: { score: 0.0, description: 'Missing critical metadata' }
        }
      },
      
      // Technical Accuracy (15% weight)
      securityConsiderations: {
        weight: 0.10,
        description: 'Security implications and best practices',
        scoring: {
          excellent: { score: 1.0, description: 'Comprehensive security coverage' },
          good: { score: 0.8, description: 'Good security awareness' },
          fair: { score: 0.5, description: 'Basic security mentions' },
          poor: { score: 0.0, description: 'No security considerations' }
        }
      },
      
      technicalAccuracy: {
        weight: 0.05,
        description: 'Accurate and up-to-date technical information',
        scoring: {
          excellent: { score: 1.0, description: 'Fully accurate and current' },
          good: { score: 0.8, description: 'Mostly accurate' },
          fair: { score: 0.5, description: 'Some accuracy issues' },
          poor: { score: 0.0, description: 'Significant inaccuracies' }
        }
      }
    };
    
    // Content type specific requirements
    this.contentTypeRequirements = {
      node: {
        requiredSections: ['parameters', 'examples', 'input', 'output'],
        criticalCriteria: ['codeExamples', 'parameterDocumentation', 'securityConsiderations'],
        minimumScore: 70
      },
      tutorial: {
        requiredSections: ['prerequisites', 'steps', 'examples'],
        criticalCriteria: ['codeExamples', 'realWorldUseCases', 'troubleshooting'],
        minimumScore: 60
      },
      guide: {
        requiredSections: ['overview', 'examples'],
        criticalCriteria: ['realWorldUseCases', 'crossReferences'],
        minimumScore: 50
      },
      example: {
        requiredSections: ['scenario', 'implementation', 'results'],
        criticalCriteria: ['codeExamples', 'realWorldUseCases'],
        minimumScore: 65
      }
    };
    
    // Priority calculation factors
    this.priorityFactors = {
      userImpact: {
        node: 1.0,        // High impact - users need to understand how to use nodes
        tutorial: 0.9,    // High impact - learning materials are critical
        guide: 0.7,       // Medium impact - reference materials
        example: 0.8      // High impact - practical demonstrations
      },
      
      trafficWeight: {
        'getting-started': 1.0,
        'integration/extension': 0.9,
        'integration/builtin': 0.8,
        'advanced-ai': 0.7,
        'learning': 0.8,
        'usage': 0.6
      },
      
      maintenanceComplexity: {
        low: 1.0,
        medium: 0.8,
        high: 0.6
      }
    };
  }

  /**
   * Calculate comprehensive quality score for content
   */
  calculateQualityScore(contentAnalysis, contentType = 'guide') {
    let totalScore = 0;
    let totalWeight = 0;
    const criteriaScores = {};
    
    // Calculate score for each criterion
    for (const [criterionName, criterion] of Object.entries(this.scoringCriteria)) {
      const analysis = contentAnalysis[criterionName] || {};
      const score = this.scoreCriterion(criterionName, analysis, contentType);
      
      criteriaScores[criterionName] = {
        score: score,
        weight: criterion.weight,
        weightedScore: score * criterion.weight,
        description: criterion.description
      };
      
      totalScore += score * criterion.weight;
      totalWeight += criterion.weight;
    }
    
    const overallScore = Math.round((totalScore / totalWeight) * 100);
    
    return {
      overallScore,
      criteriaScores,
      contentType,
      meetsMinimum: this.meetsMinimumRequirements(overallScore, contentType),
      recommendations: this.generateRecommendations(criteriaScores, contentType)
    };
  }

  /**
   * Score individual criterion based on analysis
   */
  scoreCriterion(criterionName, analysis, contentType) {
    const criterion = this.scoringCriteria[criterionName];
    
    switch (criterionName) {
      case 'codeExamples':
        return this.scoreCodeExamples(analysis);
      case 'parameterDocumentation':
        return this.scoreParameterDocumentation(analysis, contentType);
      case 'realWorldUseCases':
        return this.scoreUseCases(analysis);
      case 'troubleshooting':
        return this.scoreTroubleshooting(analysis);
      case 'crossReferences':
        return this.scoreCrossReferences(analysis);
      case 'structureCompliance':
        return this.scoreStructure(analysis, contentType);
      case 'metadataCompleteness':
        return this.scoreMetadata(analysis);
      case 'securityConsiderations':
        return this.scoreSecurity(analysis, contentType);
      case 'technicalAccuracy':
        return this.scoreTechnicalAccuracy(analysis);
      default:
        return 0;
    }
  }

  /**
   * Score code examples criterion
   */
  scoreCodeExamples(analysis) {
    const codeBlockCount = analysis.codeBlockCount || 0;
    const hasMultipleLanguages = analysis.hasJavaScript && analysis.hasTypeScript;
    const hasExplanations = analysis.hasExplanations || false;
    
    if (codeBlockCount >= 3 && hasMultipleLanguages && hasExplanations) return 1.0;
    if (codeBlockCount >= 2 && hasExplanations) return 0.8;
    if (codeBlockCount >= 1) return 0.5;
    return 0.0;
  }

  /**
   * Score parameter documentation
   */
  scoreParameterDocumentation(analysis, contentType) {
    if (contentType !== 'node') return 0.8; // Less critical for non-node content
    
    const hasParametersSection = analysis.hasParametersSection || false;
    const hasTypes = analysis.hasTypes || false;
    const hasDefaults = analysis.hasDefaults || false;
    const hasExamples = analysis.hasExamples || false;
    
    if (hasParametersSection && hasTypes && hasDefaults && hasExamples) return 1.0;
    if (hasParametersSection && hasTypes) return 0.8;
    if (hasParametersSection) return 0.5;
    return 0.0;
  }

  /**
   * Score use cases and practical applications
   */
  scoreUseCases(analysis) {
    const keywordCount = analysis.keywordCount || 0;
    const hasUseCaseSection = analysis.hasUseCaseSection || false;
    const hasRealWorldExamples = analysis.hasRealWorldExamples || false;
    
    if (hasUseCaseSection && hasRealWorldExamples && keywordCount >= 5) return 1.0;
    if (hasUseCaseSection && keywordCount >= 3) return 0.8;
    if (keywordCount >= 2) return 0.5;
    return 0.0;
  }

  /**
   * Score troubleshooting information
   */
  scoreTroubleshooting(analysis) {
    const hasSection = analysis.hasSection || false;
    const issueCount = analysis.issueCount || 0;
    const hasSolutions = analysis.hasSolutions || false;
    
    if (hasSection && issueCount >= 3 && hasSolutions) return 1.0;
    if (hasSection && hasSolutions) return 0.8;
    if (hasSection || issueCount > 0) return 0.5;
    return 0.0;
  }

  /**
   * Score cross-references and links
   */
  scoreCrossReferences(analysis) {
    const internalLinks = analysis.internalLinks || 0;
    const relatedSections = analysis.relatedSections || false;
    const contextualLinks = analysis.contextualLinks || 0;
    
    if (internalLinks >= 5 && relatedSections && contextualLinks >= 2) return 1.0;
    if (internalLinks >= 3 && contextualLinks >= 1) return 0.8;
    if (internalLinks >= 1) return 0.5;
    return 0.0;
  }

  /**
   * Score document structure compliance
   */
  scoreStructure(analysis, contentType) {
    const requirements = this.contentTypeRequirements[contentType];
    if (!requirements) return 0.5;
    
    const foundSections = analysis.foundSections || [];
    const requiredSections = requirements.requiredSections;
    const compliance = foundSections.length / requiredSections.length;
    
    if (compliance >= 0.9) return 1.0;
    if (compliance >= 0.7) return 0.8;
    if (compliance >= 0.5) return 0.5;
    return 0.0;
  }

  /**
   * Score metadata completeness
   */
  scoreMetadata(analysis) {
    const hasTitle = analysis.hasTitle || false;
    const hasDescription = analysis.hasDescription || false;
    const hasTemplate = analysis.hasTemplate || false;
    const hasAdditionalMeta = analysis.hasAdditionalMeta || false;
    
    if (hasTitle && hasDescription && hasTemplate && hasAdditionalMeta) return 1.0;
    if (hasTitle && hasDescription && hasTemplate) return 0.8;
    if (hasTitle && hasDescription) return 0.5;
    return 0.0;
  }

  /**
   * Score security considerations
   */
  scoreSecurity(analysis, contentType) {
    if (contentType === 'node') {
      // Nodes should have security info
      const hasSecuritySection = analysis.hasSecuritySection || false;
      const hasPermissions = analysis.hasPermissions || false;
      const hasWarnings = analysis.hasWarnings || false;
      
      if (hasSecuritySection && hasPermissions && hasWarnings) return 1.0;
      if (hasSecuritySection && hasPermissions) return 0.8;
      if (hasPermissions || hasWarnings) return 0.5;
      return 0.0;
    } else {
      // Other content types - less critical
      const securityMentions = analysis.securityMentions || 0;
      if (securityMentions >= 2) return 0.8;
      if (securityMentions >= 1) return 0.5;
      return 0.3; // Default for non-node content
    }
  }

  /**
   * Score technical accuracy
   */
  scoreTechnicalAccuracy(analysis) {
    const hasCurrentAPIs = analysis.hasCurrentAPIs !== false;
    const hasValidExamples = analysis.hasValidExamples !== false;
    const hasCorrectSyntax = analysis.hasCorrectSyntax !== false;
    
    if (hasCurrentAPIs && hasValidExamples && hasCorrectSyntax) return 1.0;
    if (hasCurrentAPIs && hasValidExamples) return 0.8;
    if (hasCurrentAPIs) return 0.5;
    return 0.0;
  }

  /**
   * Check if content meets minimum requirements
   */
  meetsMinimumRequirements(score, contentType) {
    const requirements = this.contentTypeRequirements[contentType];
    return requirements ? score >= requirements.minimumScore : score >= 50;
  }

  /**
   * Generate specific recommendations based on scores
   */
  generateRecommendations(criteriaScores, contentType) {
    const recommendations = [];
    const requirements = this.contentTypeRequirements[contentType];
    
    // Check critical criteria for content type
    if (requirements && requirements.criticalCriteria) {
      for (const criterion of requirements.criticalCriteria) {
        const score = criteriaScores[criterion];
        if (score && score.score < 0.7) {
          recommendations.push({
            priority: 'high',
            criterion: criterion,
            message: `Improve ${score.description} - currently scoring ${(score.score * 100).toFixed(0)}%`,
            impact: 'Critical for user success'
          });
        }
      }
    }
    
    // General recommendations based on low scores
    for (const [criterion, score] of Object.entries(criteriaScores)) {
      if (score.score < 0.5) {
        recommendations.push({
          priority: score.weight > 0.1 ? 'medium' : 'low',
          criterion: criterion,
          message: `Add ${score.description}`,
          impact: `Weighted impact: ${(score.weight * 100).toFixed(0)}%`
        });
      }
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Calculate enhancement priority based on multiple factors
   */
  calculateEnhancementPriority(qualityScore, contentType, filePath, userMetrics = {}) {
    const baseScore = qualityScore.overallScore;
    const contentTypeImpact = this.priorityFactors.userImpact[contentType] || 0.5;
    
    // Determine traffic weight based on file path
    let trafficWeight = 0.5;
    for (const [pathPattern, weight] of Object.entries(this.priorityFactors.trafficWeight)) {
      if (filePath.includes(pathPattern)) {
        trafficWeight = weight;
        break;
      }
    }
    
    // Calculate priority score (lower score = higher priority)
    const qualityFactor = (100 - baseScore) / 100; // Invert quality score
    const impactFactor = contentTypeImpact * trafficWeight;
    const userFactor = (userMetrics.pageViews || 1) / 1000; // Normalize page views
    
    const priorityScore = qualityFactor * impactFactor * (1 + userFactor);
    
    // Determine priority level
    let priority;
    if (priorityScore > 0.8 || baseScore < 30) {
      priority = 'critical';
    } else if (priorityScore > 0.6 || baseScore < 50) {
      priority = 'high';
    } else if (priorityScore > 0.4 || baseScore < 70) {
      priority = 'medium';
    } else {
      priority = 'low';
    }
    
    return {
      priority,
      priorityScore: Math.round(priorityScore * 100),
      factors: {
        qualityFactor: Math.round(qualityFactor * 100),
        impactFactor: Math.round(impactFactor * 100),
        userFactor: Math.round(userFactor * 100)
      },
      reasoning: this.generatePriorityReasoning(priority, baseScore, contentType, filePath)
    };
  }

  /**
   * Generate reasoning for priority assignment
   */
  generatePriorityReasoning(priority, score, contentType, filePath) {
    const reasons = [];
    
    if (score < 30) {
      reasons.push('Extremely low quality score requires immediate attention');
    } else if (score < 50) {
      reasons.push('Below acceptable quality threshold');
    }
    
    if (contentType === 'node' && score < 70) {
      reasons.push('Node documentation is critical for user success');
    }
    
    if (filePath.includes('getting-started')) {
      reasons.push('High-traffic onboarding content');
    }
    
    if (filePath.includes('extension')) {
      reasons.push('Core browser extension functionality');
    }
    
    return reasons.length > 0 ? reasons.join('; ') : 'Standard priority based on quality metrics';
  }

  /**
   * Export quality framework configuration
   */
  async exportConfiguration(outputPath) {
    const config = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      scoringCriteria: this.scoringCriteria,
      contentTypeRequirements: this.contentTypeRequirements,
      priorityFactors: this.priorityFactors,
      usage: {
        description: 'Content Quality Scoring Framework for Agentic WorkFlow Documentation',
        implementation: 'Use calculateQualityScore() method with content analysis data',
        integration: 'Can be integrated with content audit scripts and CI/CD pipelines'
      }
    };
    
    await writeFile(outputPath, JSON.stringify(config, null, 2));
    return config;
  }
}

// Export for use in other modules
export default QualityFramework;