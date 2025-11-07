#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FinalTerminologyFixer {
    constructor() {
        this.builtinDir = path.join(__dirname, '../src/content/docs/integration/builtin');
        this.fixes = [];
    }

    async fixRemainingTerminology() {
        console.log('🔧 Fixing remaining terminology issues...\n');
        
        const files = await this.getAllMarkdownFiles();
        
        for (const filePath of files) {
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.builtinDir, filePath);
                const originalContent = content;
                
                // Context-specific replacements for "various"
                if (relativePath.includes('DateTime')) {
                    content = content.replace(/various date formats/g, 'multiple date formats including ISO 8601, locale-specific, and custom formats');
                    content = content.replace(/various timezone/g, 'multiple timezone');
                    content = content.replace(/various date/g, 'multiple date');
                    content = content.replace(/various time/g, 'multiple time');
                }
                
                if (relativePath.includes('dataTransformation')) {
                    content = content.replace(/various data types/g, 'multiple data types including strings, numbers, objects, and arrays');
                    content = content.replace(/various field/g, 'multiple field');
                    content = content.replace(/various format/g, 'multiple format');
                    content = content.replace(/various file/g, 'multiple file');
                }
                
                if (relativePath.includes('flow')) {
                    content = content.replace(/various condition/g, 'multiple condition');
                    content = content.replace(/various workflow/g, 'multiple workflow');
                    content = content.replace(/various data/g, 'multiple data');
                    content = content.replace(/various input/g, 'multiple input');
                }
                
                if (relativePath.includes('lambda')) {
                    content = content.replace(/various workflow/g, 'multiple workflow');
                    content = content.replace(/various input/g, 'multiple input');
                    content = content.replace(/various output/g, 'multiple output');
                    content = content.replace(/various parameter/g, 'multiple parameter');
                }
                
                if (relativePath.includes('core/Code')) {
                    content = content.replace(/various information/g, 'multiple pieces of information');
                    content = content.replace(/various programming/g, 'multiple programming');
                    content = content.replace(/various data/g, 'multiple data');
                }
                
                // Generic fallback replacements
                content = content.replace(/\bvarious\b/g, 'multiple');
                
                if (content !== originalContent) {
                    fs.writeFileSync(filePath, content);
                    this.fixes.push(relativePath);
                    console.log(`✅ Fixed terminology in: ${relativePath}`);
                }
                
            } catch (error) {
                console.warn(`⚠️  Could not process ${filePath}: ${error.message}`);
            }
        }
        
        console.log(`\n🎯 Fixed terminology in ${this.fixes.length} files`);
        
        // Also fix the overview sections for node-types.md and rate-limits.md
        await this.fixOverviewSections();
    }

    async fixOverviewSections() {
        console.log('\n📝 Adding missing overview sections...');
        
        // Fix node-types.md
        const nodeTypesPath = path.join(this.builtinDir, 'node-types.md');
        if (fs.existsSync(nodeTypesPath)) {
            let content = fs.readFileSync(nodeTypesPath, 'utf8');
            
            if (!content.includes('## Overview') && !content.includes('## Purpose')) {
                // Add overview section after frontmatter
                const lines = content.split('\n');
                const frontmatterEnd = lines.findIndex((line, index) => index > 0 && line === '---');
                
                if (frontmatterEnd > 0) {
                    lines.splice(frontmatterEnd + 1, 0, '', '## Overview', '', 'This document provides a comprehensive guide to the different types of nodes available in Agentic WorkFlow, helping you understand their categories, purposes, and when to use each type in your workflows.');
                    content = lines.join('\n');
                    fs.writeFileSync(nodeTypesPath, content);
                    console.log('✅ Added overview to node-types.md');
                }
            }
        }
        
        // Fix rate-limits.md
        const rateLimitsPath = path.join(this.builtinDir, 'rate-limits.md');
        if (fs.existsSync(rateLimitsPath)) {
            let content = fs.readFileSync(rateLimitsPath, 'utf8');
            
            if (!content.includes('## Overview') && !content.includes('## Purpose')) {
                // Add overview section after frontmatter
                const lines = content.split('\n');
                const frontmatterEnd = lines.findIndex((line, index) => index > 0 && line === '---');
                
                if (frontmatterEnd > 0) {
                    lines.splice(frontmatterEnd + 1, 0, '', '## Overview', '', 'This document explains the rate limiting considerations and best practices for builtin nodes in Agentic WorkFlow, helping you understand how to optimize your workflows for performance and reliability.');
                    content = lines.join('\n');
                    fs.writeFileSync(rateLimitsPath, content);
                    console.log('✅ Added overview to rate-limits.md');
                }
            }
        }
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
}

// Run the final terminology fix
const fixer = new FinalTerminologyFixer();
fixer.fixRemainingTerminology().catch(console.error);