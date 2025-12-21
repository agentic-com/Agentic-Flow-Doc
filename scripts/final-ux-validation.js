#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FinalUXValidator {
    constructor() {
        this.builtinDir = path.join(__dirname, '../src/content/docs/integration/builtin');
        this.validationResults = {
            terminologyConsistency: { score: 0, issues: [] },
            securityCoverage: { score: 0, issues: [] },
            learningProgression: { score: 0, issues: [] },
            clarityCompleteness: { score: 0, issues: [] }
        };
        this.stats = {
            filesValidated: 0,
            overallScore: 0
        };
    }

    async validateUserExperience() {
        console.log('🔍 Final User Experience Validation...\n');
        
        try {
            await this.validateTerminologyConsistency();
            await this.validateSecurityCoverage();
            await this.validateLearningProgression();
            await this.validateClarityAndCompleteness();
            
            this.calculateOverallScore();
            await this.generateFinalReport();
            
        } catch (error) {
            console.error('❌ Error during validation:', error.message);
            throw error;
        }
    }

    async validateTerminologyConsistency() {
        console.log('📝 Validating terminology consistency...');
        
        const files = await this.getAllMarkdownFiles();
        let consistentFiles = 0;
        const issues = [];
        
        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.builtinDir, filePath);
                
                // Check for remaining vague terms
                const vagueTerms = ['various', 'stuff', 'thing', 'something', 'somehow'];
                let hasVagueTerms = false;
                
                for (const term of vagueTerms) {
                    if (content.toLowerCase().includes(term)) {
                        hasVagueTerms = true;
                        issues.push(`${relativePath}: Contains vague term "${term}"`);
                    }
                }
                
                if (!hasVagueTerms) {
                    consistentFiles++;
                }
                
            } catch (error) {
                console.warn(`⚠️  Could not validate ${filePath}: ${error.message}`);
            }
        }
        
        this.validationResults.terminologyConsistency.score = Math.round((consistentFiles / files.length) * 100);
        this.validationResults.terminologyConsistency.issues = issues;
        
        console.log(`   ✅ Terminology consistency: ${this.validationResults.terminologyConsistency.score}%`);
        console.log(`   📊 ${consistentFiles}/${files.length} files have consistent terminology\n`);
    }

    async validateSecurityCoverage() {
        console.log('🔒 Validating security coverage...');
        
        const files = await this.getAllMarkdownFiles();
        let secureFiles = 0;
        const issues = [];
        
        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.builtinDir, filePath);
                const category = this.getNodeCategory(relativePath);
                
                if (!category) continue;
                
                let hasSecurityCoverage = true;
                
                // Check category-specific security requirements
                if (category === 'core') {
                    if (!content.toLowerCase().includes('permission') && 
                        !content.toLowerCase().includes('browser api')) {
                        hasSecurityCoverage = false;
                        issues.push(`${relativePath}: Missing browser permission documentation`);
                    }
                }
                
                if (relativePath.includes('Http') && !content.toLowerCase().includes('cors')) {
                    hasSecurityCoverage = false;
                    issues.push(`${relativePath}: Missing CORS documentation`);
                }
                
                if (hasSecurityCoverage) {
                    secureFiles++;
                }
                
            } catch (error) {
                console.warn(`⚠️  Could not validate ${filePath}: ${error.message}`);
            }
        }
        
        this.validationResults.securityCoverage.score = Math.round((secureFiles / files.length) * 100);
        this.validationResults.securityCoverage.issues = issues;
        
        console.log(`   🔒 Security coverage: ${this.validationResults.securityCoverage.score}%`);
        console.log(`   📊 ${secureFiles}/${files.length} files have adequate security coverage\n`);
    }

    async validateLearningProgression() {
        console.log('📚 Validating learning progression...');
        
        const files = await this.getAllMarkdownFiles();
        let progressiveFiles = 0;
        const issues = [];
        
        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.builtinDir, filePath);
                
                let hasGoodProgression = true;
                
                // Check for clear purpose/overview
                if (!content.includes('## Purpose') && !content.includes('## Overview')) {
                    hasGoodProgression = false;
                    issues.push(`${relativePath}: Missing clear purpose/overview section`);
                }
                
                // Check for examples
                if (!content.includes('Example') && !content.includes('```')) {
                    hasGoodProgression = false;
                    issues.push(`${relativePath}: Missing examples`);
                }
                
                // Check for cross-references
                if (!content.includes('Related Nodes') && !content.includes('See Also')) {
                    hasGoodProgression = false;
                    issues.push(`${relativePath}: Missing cross-references`);
                }
                
                if (hasGoodProgression) {
                    progressiveFiles++;
                }
                
            } catch (error) {
                console.warn(`⚠️  Could not validate ${filePath}: ${error.message}`);
            }
        }
        
        this.validationResults.learningProgression.score = Math.round((progressiveFiles / files.length) * 100);
        this.validationResults.learningProgression.issues = issues;
        
        console.log(`   📚 Learning progression: ${this.validationResults.learningProgression.score}%`);
        console.log(`   📊 ${progressiveFiles}/${files.length} files have good learning progression\n`);
    }

    async validateClarityAndCompleteness() {
        console.log('✨ Validating clarity and completeness...');
        
        const files = await this.getAllMarkdownFiles();
        let clearFiles = 0;
        const issues = [];
        
        for (const filePath of files) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.builtinDir, filePath);
                
                let isClear = true;
                
                // Check for placeholder content
                const placeholders = ['TODO', 'TBD', 'FIXME', 'placeholder', 'coming soon'];
                for (const placeholder of placeholders) {
                    if (content.toLowerCase().includes(placeholder.toLowerCase())) {
                        isClear = false;
                        issues.push(`${relativePath}: Contains placeholder content "${placeholder}"`);
                    }
                }
                
                // Check for proper structure
                if (!content.includes('# ') && !content.includes('## ')) {
                    isClear = false;
                    issues.push(`${relativePath}: Missing proper heading structure`);
                }
                
                if (isClear) {
                    clearFiles++;
                }
                
            } catch (error) {
                console.warn(`⚠️  Could not validate ${filePath}: ${error.message}`);
            }
        }
        
        this.validationResults.clarityCompleteness.score = Math.round((clearFiles / files.length) * 100);
        this.validationResults.clarityCompleteness.issues = issues;
        
        console.log(`   ✨ Clarity and completeness: ${this.validationResults.clarityCompleteness.score}%`);
        console.log(`   📊 ${clearFiles}/${files.length} files are clear and complete\n`);
        
        this.stats.filesValidated = files.length;
    }

    calculateOverallScore() {
        const scores = [
            this.validationResults.terminologyConsistency.score,
            this.validationResults.securityCoverage.score,
            this.validationResults.learningProgression.score,
            this.validationResults.clarityCompleteness.score
        ];
        
        this.stats.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
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

    async generateFinalReport() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(__dirname, 'reports', `final-ux-validation-${timestamp}.txt`);
        
        // Ensure reports directory exists
        const reportsDir = path.dirname(reportPath);
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }
        
        const report = `
🎯 FINAL USER EXPERIENCE VALIDATION REPORT
=========================================

📊 OVERALL QUALITY SCORE: ${this.stats.overallScore}%

📈 DETAILED SCORES
- 📝 Terminology Consistency: ${this.validationResults.terminologyConsistency.score}%
- 🔒 Security Coverage: ${this.validationResults.securityCoverage.score}%
- 📚 Learning Progression: ${this.validationResults.learningProgression.score}%
- ✨ Clarity & Completeness: ${this.validationResults.clarityCompleteness.score}%

📋 VALIDATION SUMMARY
- Files Validated: ${this.stats.filesValidated}
- Total Issues Found: ${Object.values(this.validationResults).reduce((sum, result) => sum + result.issues.length, 0)}

${this.stats.overallScore >= 90 ? '🎉 EXCELLENT QUALITY' : 
  this.stats.overallScore >= 80 ? '✅ GOOD QUALITY' : 
  this.stats.overallScore >= 70 ? '⚠️ ACCEPTABLE QUALITY' : 
  '❌ NEEDS IMPROVEMENT'}

${this.stats.overallScore >= 80 ? 
`✅ USER EXPERIENCE OPTIMIZATION SUCCESSFUL
The builtin nodes documentation now provides:
- Consistent and clear terminology
- Comprehensive security coverage
- Well-structured learning progression
- Clear and complete content

Users can now effectively discover, understand, and implement workflow nodes
with confidence in their security and functionality.` :
`⚠️ ADDITIONAL OPTIMIZATION NEEDED
Some areas still require attention to achieve optimal user experience.`}

${Object.values(this.validationResults).some(result => result.issues.length > 0) ?
`🔍 REMAINING ISSUES
${Object.entries(this.validationResults).map(([category, result]) => 
  result.issues.length > 0 ? 
  `\n${category.toUpperCase()}:\n${result.issues.map(issue => `- ${issue}`).join('\n')}` : 
  ''
).filter(Boolean).join('\n')}` : 
'✅ NO REMAINING ISSUES FOUND'}
`;
        
        fs.writeFileSync(reportPath, report);
        
        console.log('📊 Final User Experience Validation Complete');
        console.log(`   📋 Report: ${reportPath}\n`);
        
        // Display report
        console.log(report);
        
        return report;
    }
}

// Run the final validation
const validator = new FinalUXValidator();
validator.validateUserExperience().catch(console.error);