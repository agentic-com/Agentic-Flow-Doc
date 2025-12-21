#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UserExperienceOptimizer {
    constructor() {
        this.builtinDir = path.join(__dirname, '../src/content/docs/integration/builtin');
        this.issues = [];
        this.stats = {
            filesProcessed: 0,
            terminologyIssues: 0,
            securityGaps: 0,
            progressionIssues: 0,
            clarityIssues: 0
        };
        
        // Standardized terminology mapping
        this.terminologyStandards = {
            // Browser extension terms
            'browser extension': ['browser extension', 'extension'],
            'workflow': ['workflow', 'automation'],
            'node': ['node', 'component'],
            'parameter': ['parameter', 'option', 'setting'],
            'configuration': ['configuration', 'config', 'setup'],
            
            // AI terms
            'LLM': ['LLM', 'Large Language Model', 'language model'],
            'RAG': ['RAG', 'Retrieval-Augmented Generation'],
            'embedding': ['embedding', 'vector embedding'],
            'vector store': ['vector store', 'vector database'],
            
            // Technical terms
            'API': ['API', 'Application Programming Interface'],
            'JSON': ['JSON'],
            'HTTP': ['HTTP', 'HTTPS'],
            'URL': ['URL', 'web address', 'link'],
            
            // Security terms
            'permission': ['permission', 'browser permission'],
            'CORS': ['CORS', 'Cross-Origin Resource Sharing'],
            'CSP': ['CSP', 'Content Security Policy']
        };
        
        // Required security considerations by node type
        this.securityRequirements = {
            'core': ['browser permissions', 'CORS', 'data privacy'],
            'ai': ['data handling', 'API security', 'local processing'],
            'dataTransformation': ['data validation', 'sanitization'],
            'flow': ['error handling', 'data flow security'],
            'lambda': ['input validation', 'execution context'],
            'trigger': ['event security', 'permission validation']
        };
        
        // Learning progression requirements
        this.progressionRequirements = {
            'beginner': ['clear purpose', 'basic examples', 'step-by-step'],
            'intermediate': ['integration patterns', 'best practices'],
            'advanced': ['optimization', 'troubleshooting', 'complex scenarios']
        };
    }

    async optimizeUserExperience() {
        console.log('🔍 Starting User Experience Optimization...\n');
        
        try {
            await this.validateTerminologyConsistency();
            await this.validateSecurityCoverage();
            await this.validateLearningProgression();
            await this.validateClarityAndCompleteness();
            
            await this.generateOptimizationReport();
            
        } catch (error) {
            console.error('❌ Error during optimization:', error.message);
            throw error;
        }
    }

    async validateTerminologyConsistency() {
        console.log('📝 Validating terminology consistency...');
        
        const files = await this.getAllMarkdownFiles();
        
        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.builtinDir, filePath);
                
                // Check for inconsistent terminology
                const terminologyIssues = this.checkTerminologyConsistency(content, relativePath);
                if (terminologyIssues.length > 0) {
                    this.issues.push({
                        type: 'terminology',
                        file: relativePath,
                        issues: terminologyIssues
                    });
                    this.stats.terminologyIssues += terminologyIssues.length;
                }
                
                this.stats.filesProcessed++;
                
            } catch (error) {
                console.warn(`⚠️  Could not process ${filePath}: ${error.message}`);
            }
        }
        
        console.log(`   ✅ Processed ${this.stats.filesProcessed} files`);
        console.log(`   📊 Found ${this.stats.terminologyIssues} terminology issues\n`);
    }

    checkTerminologyConsistency(content, filePath) {
        const issues = [];
        const lines = content.split('\n');
        
        // Check for inconsistent terminology usage
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            
            // Check for mixed terminology within the same document
            if (line.includes('browser extension') && line.includes('extension')) {
                if (!line.includes('browser extension')) {
                    issues.push({
                        line: i + 1,
                        issue: 'Inconsistent terminology: Use "browser extension" consistently',
                        text: lines[i].trim()
                    });
                }
            }
            
            // Check for outdated or unclear terms
            if (line.includes('plugin') && !line.includes('browser extension')) {
                issues.push({
                    line: i + 1,
                    issue: 'Outdated terminology: Use "browser extension" instead of "plugin"',
                    text: lines[i].trim()
                });
            }
            
            // Check for vague terms
            const vagueTerms = ['thing', 'stuff', 'something', 'somehow', 'various'];
            for (const term of vagueTerms) {
                if (line.includes(term)) {
                    issues.push({
                        line: i + 1,
                        issue: `Vague terminology: "${term}" should be more specific`,
                        text: lines[i].trim()
                    });
                }
            }
        }
        
        return issues;
    }

    async validateSecurityCoverage() {
        console.log('🔒 Validating browser security coverage...');
        
        const files = await this.getAllMarkdownFiles();
        
        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.builtinDir, filePath);
                
                // Determine node category
                const category = this.getNodeCategory(relativePath);
                if (!category) continue;
                
                // Check security coverage
                const securityIssues = this.checkSecurityCoverage(content, category, relativePath);
                if (securityIssues.length > 0) {
                    this.issues.push({
                        type: 'security',
                        file: relativePath,
                        category: category,
                        issues: securityIssues
                    });
                    this.stats.securityGaps += securityIssues.length;
                }
                
            } catch (error) {
                console.warn(`⚠️  Could not process ${filePath}: ${error.message}`);
            }
        }
        
        console.log(`   🔒 Found ${this.stats.securityGaps} security coverage gaps\n`);
    }

    checkSecurityCoverage(content, category, filePath) {
        const issues = [];
        const requiredSecurity = this.securityRequirements[category] || [];
        
        for (const requirement of requiredSecurity) {
            const hasRequirement = this.checkSecurityRequirement(content, requirement);
            if (!hasRequirement) {
                issues.push({
                    requirement: requirement,
                    issue: `Missing ${requirement} documentation for ${category} node`,
                    severity: 'high'
                });
            }
        }
        
        // Check for browser permission documentation in core nodes
        if (category === 'core' && !content.includes('permission')) {
            issues.push({
                requirement: 'browser permissions',
                issue: 'Core nodes should document required browser permissions',
                severity: 'high'
            });
        }
        
        // Check for CORS documentation in HTTP-related nodes
        if (filePath.includes('Http') && !content.toLowerCase().includes('cors')) {
            issues.push({
                requirement: 'CORS handling',
                issue: 'HTTP nodes should document CORS considerations',
                severity: 'medium'
            });
        }
        
        return issues;
    }

    checkSecurityRequirement(content, requirement) {
        const contentLower = content.toLowerCase();
        
        switch (requirement) {
            case 'browser permissions':
                return contentLower.includes('permission') || contentLower.includes('browser api');
            case 'CORS':
                return contentLower.includes('cors') || contentLower.includes('cross-origin');
            case 'data privacy':
                return contentLower.includes('privacy') || contentLower.includes('data handling');
            case 'API security':
                return contentLower.includes('api key') || contentLower.includes('authentication');
            case 'local processing':
                return contentLower.includes('local') || contentLower.includes('browser-based');
            case 'data validation':
                return contentLower.includes('validation') || contentLower.includes('sanitiz');
            case 'error handling':
                return contentLower.includes('error') || contentLower.includes('exception');
            case 'input validation':
                return contentLower.includes('input') && contentLower.includes('validation');
            default:
                return contentLower.includes(requirement.toLowerCase());
        }
    }

    async validateLearningProgression() {
        console.log('📚 Validating learning progression...');
        
        const files = await this.getAllMarkdownFiles();
        
        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.builtinDir, filePath);
                
                // Check learning progression elements
                const progressionIssues = this.checkLearningProgression(content, relativePath);
                if (progressionIssues.length > 0) {
                    this.issues.push({
                        type: 'progression',
                        file: relativePath,
                        issues: progressionIssues
                    });
                    this.stats.progressionIssues += progressionIssues.length;
                }
                
            } catch (error) {
                console.warn(`⚠️  Could not process ${filePath}: ${error.message}`);
            }
        }
        
        console.log(`   📚 Found ${this.stats.progressionIssues} learning progression issues\n`);
    }

    checkLearningProgression(content, filePath) {
        const issues = [];
        
        // Check for clear purpose statement
        if (!content.includes('## Purpose') && !content.includes('## Overview')) {
            issues.push({
                issue: 'Missing clear purpose/overview section',
                severity: 'high',
                suggestion: 'Add clear purpose statement at the beginning'
            });
        }
        
        // Check for examples progression (basic to advanced)
        const hasBasicExample = content.includes('Basic Example') || content.includes('Simple Example');
        const hasAdvancedExample = content.includes('Advanced Example') || content.includes('Complex Example');
        
        if (!hasBasicExample) {
            issues.push({
                issue: 'Missing basic example for beginners',
                severity: 'medium',
                suggestion: 'Add simple, clear example for new users'
            });
        }
        
        // Check for prerequisite documentation
        if (!content.includes('prerequisite') && !content.includes('requirement') && !content.includes('before using')) {
            issues.push({
                issue: 'Missing prerequisite information',
                severity: 'low',
                suggestion: 'Document any prerequisites or requirements'
            });
        }
        
        // Check for related nodes section
        if (!content.includes('Related Nodes') && !content.includes('See Also')) {
            issues.push({
                issue: 'Missing related nodes/see also section',
                severity: 'medium',
                suggestion: 'Add cross-references to help users discover related functionality'
            });
        }
        
        return issues;
    }

    async validateClarityAndCompleteness() {
        console.log('✨ Validating clarity and completeness...');
        
        const files = await this.getAllMarkdownFiles();
        
        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.builtinDir, filePath);
                
                // Check clarity and completeness
                const clarityIssues = this.checkClarityAndCompleteness(content, relativePath);
                if (clarityIssues.length > 0) {
                    this.issues.push({
                        type: 'clarity',
                        file: relativePath,
                        issues: clarityIssues
                    });
                    this.stats.clarityIssues += clarityIssues.length;
                }
                
            } catch (error) {
                console.warn(`⚠️  Could not process ${filePath}: ${error.message}`);
            }
        }
        
        console.log(`   ✨ Found ${this.stats.clarityIssues} clarity and completeness issues\n`);
    }

    checkClarityAndCompleteness(content, filePath) {
        const issues = [];
        const lines = content.split('\n');
        
        // Check for placeholder content
        const placeholders = ['TODO', 'TBD', 'FIXME', 'placeholder', 'coming soon'];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            for (const placeholder of placeholders) {
                if (line.includes(placeholder.toLowerCase())) {
                    issues.push({
                        line: i + 1,
                        issue: `Placeholder content found: "${placeholder}"`,
                        severity: 'high',
                        text: lines[i].trim()
                    });
                }
            }
        }
        
        // Check for incomplete sentences
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.length > 10 && !line.endsWith('.') && !line.endsWith(':') && 
                !line.startsWith('#') && !line.startsWith('|') && !line.startsWith('-') &&
                !line.startsWith('```') && line.includes(' ')) {
                issues.push({
                    line: i + 1,
                    issue: 'Incomplete sentence (missing punctuation)',
                    severity: 'low',
                    text: line
                });
            }
        }
        
        // Check for overly long paragraphs
        let currentParagraph = '';
        let paragraphStart = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === '') {
                if (currentParagraph.length > 1000) {
                    issues.push({
                        line: paragraphStart + 1,
                        issue: 'Paragraph too long (>1000 chars) - consider breaking up',
                        severity: 'low'
                    });
                }
                currentParagraph = '';
                paragraphStart = i + 1;
            } else if (!line.startsWith('#') && !line.startsWith('|') && !line.startsWith('-')) {
                currentParagraph += line + ' ';
            }
        }
        
        // Check for missing code examples
        if (content.includes('Parameter') && !content.includes('```')) {
            issues.push({
                issue: 'Node with parameters should include code examples',
                severity: 'medium'
            });
        }
        
        return issues;
    }

    getNodeCategory(filePath) {
        if (filePath.includes('/ai/')) return 'ai';
        if (filePath.includes('/core/')) return 'core';
        if (filePath.includes('/dataTransformation/')) return 'dataTransformation';
        if (filePath.includes('/flow/')) return 'flow';
        if (filePath.includes('/lambda/')) return 'lambda';
        if (filePath.includes('/trigger/')) return 'trigger';
        return null;
    }

    async getAllMarkdownFiles() {
        const files = [];
        
        const scanDirectory = (dir) => {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    scanDirectory(fullPath);
                } else if (item.endsWith('.md') && !item.startsWith('_')) {
                    files.push(fullPath);
                }
            }
        };
        
        scanDirectory(this.builtinDir);
        return files;
    }

    async generateOptimizationReport() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(__dirname, 'reports', `user-experience-optimization-${timestamp}.json`);
        const summaryPath = path.join(__dirname, 'reports', `user-experience-optimization-summary-${timestamp}.txt`);
        
        // Ensure reports directory exists
        const reportsDir = path.dirname(reportPath);
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }
        
        // Generate detailed report
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.stats,
            issues: this.issues,
            recommendations: this.generateRecommendations()
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        // Generate summary report
        const summary = this.generateSummaryReport();
        fs.writeFileSync(summaryPath, summary);
        
        console.log('📊 User Experience Optimization Report Generated');
        console.log(`   📄 Detailed report: ${reportPath}`);
        console.log(`   📋 Summary report: ${summaryPath}\n`);
        
        // Display summary
        console.log(summary);
        
        return report;
    }

    generateRecommendations() {
        const recommendations = [];
        
        // Terminology recommendations
        if (this.stats.terminologyIssues > 0) {
            recommendations.push({
                category: 'terminology',
                priority: 'high',
                action: 'Standardize terminology across all documentation',
                details: 'Use consistent terms like "browser extension" instead of "plugin", and maintain consistent technical vocabulary'
            });
        }
        
        // Security recommendations
        if (this.stats.securityGaps > 0) {
            recommendations.push({
                category: 'security',
                priority: 'high',
                action: 'Add comprehensive security documentation',
                details: 'Ensure all nodes document browser permissions, CORS considerations, and data privacy implications'
            });
        }
        
        // Learning progression recommendations
        if (this.stats.progressionIssues > 0) {
            recommendations.push({
                category: 'progression',
                priority: 'medium',
                action: 'Improve learning progression',
                details: 'Add clear purpose statements, basic examples, and prerequisite information to help users at all skill levels'
            });
        }
        
        // Clarity recommendations
        if (this.stats.clarityIssues > 0) {
            recommendations.push({
                category: 'clarity',
                priority: 'medium',
                action: 'Enhance clarity and completeness',
                details: 'Remove placeholder content, fix incomplete sentences, and add missing code examples'
            });
        }
        
        return recommendations;
    }

    generateSummaryReport() {
        const totalIssues = this.stats.terminologyIssues + this.stats.securityGaps + 
                           this.stats.progressionIssues + this.stats.clarityIssues;
        
        return `
🎯 USER EXPERIENCE OPTIMIZATION SUMMARY
=====================================

📊 OVERALL STATISTICS
- Files Processed: ${this.stats.filesProcessed}
- Total Issues Found: ${totalIssues}

📝 TERMINOLOGY CONSISTENCY
- Issues Found: ${this.stats.terminologyIssues}
- Status: ${this.stats.terminologyIssues === 0 ? '✅ GOOD' : '⚠️ NEEDS ATTENTION'}

🔒 SECURITY COVERAGE
- Gaps Found: ${this.stats.securityGaps}
- Status: ${this.stats.securityGaps === 0 ? '✅ COMPREHENSIVE' : '⚠️ INCOMPLETE'}

📚 LEARNING PROGRESSION
- Issues Found: ${this.stats.progressionIssues}
- Status: ${this.stats.progressionIssues === 0 ? '✅ WELL-STRUCTURED' : '⚠️ NEEDS IMPROVEMENT'}

✨ CLARITY & COMPLETENESS
- Issues Found: ${this.stats.clarityIssues}
- Status: ${this.stats.clarityIssues === 0 ? '✅ CLEAR' : '⚠️ NEEDS POLISH'}

🎯 PRIORITY ACTIONS
${totalIssues === 0 ? '✅ No issues found - documentation is optimized!' : 
  this.generateRecommendations().map(rec => 
    `- ${rec.priority.toUpperCase()}: ${rec.action}`
  ).join('\n')}

📈 QUALITY SCORE: ${Math.max(0, 100 - (totalIssues * 2))}%
`;
    }
}

// Run the optimization
const optimizer = new UserExperienceOptimizer();
optimizer.optimizeUserExperience().catch(console.error);