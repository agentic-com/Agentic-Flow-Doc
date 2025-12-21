#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

/**
 * Global terminology replacement script for Agentic WorkFlow documentation
 * Systematically replaces n8n references with appropriate Agentic WorkFlow terminology
 */

// Replacement patterns - order matters for specificity
const replacementPatterns = [
  // Product name replacements
  {
    pattern: /\bn8n\.io\b/g,
    replacement: 'Agentic WorkFlow',
    description: 'Replace n8n.io domain references'
  },
  {
    pattern: /\bn8n Cloud\b/g,
    replacement: 'Agentic WorkFlow',
    description: 'Replace n8n Cloud references'
  },
  {
    pattern: /\bn8n community\b/g,
    replacement: 'Agentic WorkFlow community',
    description: 'Replace n8n community references'
  },
  {
    pattern: /\bn8n instance\b/g,
    replacement: 'Agentic WorkFlow instance',
    description: 'Replace n8n instance references'
  },
  {
    pattern: /\bn8n workflow\b/g,
    replacement: 'Agentic WorkFlow workflow',
    description: 'Replace n8n workflow references'
  },
  {
    pattern: /\bn8n users\b/g,
    replacement: 'Agentic WorkFlow users',
    description: 'Replace n8n users references'
  },
  {
    pattern: /\bn8n provides\b/g,
    replacement: 'Agentic WorkFlow provides',
    description: 'Replace n8n provides references'
  },
  {
    pattern: /\bn8n offers\b/g,
    replacement: 'Agentic WorkFlow offers',
    description: 'Replace n8n offers references'
  },
  {
    pattern: /\bwith n8n\b/g,
    replacement: 'with Agentic WorkFlow',
    description: 'Replace with n8n references'
  },
  {
    pattern: /\busing n8n\b/g,
    replacement: 'using Agentic WorkFlow',
    description: 'Replace using n8n references'
  },
  {
    pattern: /\bUse n8n\b/g,
    replacement: 'Use Agentic WorkFlow',
    description: 'Replace Use n8n references'
  },
  {
    pattern: /\bto n8n\b/g,
    replacement: 'to Agentic WorkFlow',
    description: 'Replace to n8n references'
  },
  {
    pattern: /\babout n8n\b/g,
    replacement: 'about Agentic WorkFlow',
    description: 'Replace about n8n references'
  },
  {
    pattern: /\bAbout n8n\b/g,
    replacement: 'About Agentic WorkFlow',
    description: 'Replace About n8n references'
  },
  // Generic n8n references (be careful with this one)
  {
    pattern: /\bn8n\b(?!\s*-)/g,
    replacement: 'Agentic WorkFlow',
    description: 'Replace standalone n8n references (excluding technical node names)'
  }
];

// Patterns to exclude from replacement (technical references that should remain)
const exclusionPatterns = [
  /n8n-nodes-/,  // Technical node names
  /\/n8n-/,      // URL paths to technical resources
  /github\.com\/n8n-io/,  // GitHub repository references
  /hub\.docker\.com\/r\/n8nio/,  // Docker Hub references
  /community\.n8n\.io/,  // Community forum references
  /help@n8n\.io/,  // Support email references
  /\.n8n\.app\.cloud/  // Cloud workspace URLs
];

// Files to process
const filePatterns = [
  'src/content/docs/**/*.md',
  'src/content/docs/**/*.mdx'
];

// Files to exclude
const excludePatterns = [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**'
];

/**
 * Check if content should be excluded from replacement
 */
function shouldExcludeReplacement(content, startIndex, endIndex) {
  const contextStart = Math.max(0, startIndex - 50);
  const contextEnd = Math.min(content.length, endIndex + 50);
  const context = content.slice(contextStart, contextEnd);
  
  return exclusionPatterns.some(pattern => pattern.test(context));
}

/**
 * Apply replacements to content with exclusion checking
 */
function applyReplacements(content, filePath) {
  let modifiedContent = content;
  let totalReplacements = 0;
  const replacementLog = [];

  for (const { pattern, replacement, description } of replacementPatterns) {
    let match;
    const matches = [];
    
    // Reset pattern to start from beginning
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(content)) !== null) {
      if (!shouldExcludeReplacement(content, match.index, match.index + match[0].length)) {
        matches.push({
          match: match[0],
          index: match.index,
          replacement: replacement
        });
      }
      
      // Prevent infinite loop for global patterns
      if (!pattern.global) break;
    }
    
    // Apply replacements in reverse order to maintain indices
    matches.reverse().forEach(({ match, index, replacement: repl }) => {
      modifiedContent = modifiedContent.slice(0, index) + repl + modifiedContent.slice(index + match.length);
      totalReplacements++;
      replacementLog.push({
        pattern: pattern.source,
        match,
        replacement: repl,
        description
      });
    });
  }

  return {
    content: modifiedContent,
    replacements: totalReplacements,
    log: replacementLog
  };
}

/**
 * Process a single file
 */
async function processFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const result = applyReplacements(content, filePath);
    
    if (result.replacements > 0) {
      await fs.writeFile(filePath, result.content, 'utf-8');
      console.log(`✅ ${filePath}: ${result.replacements} replacements made`);
      
      // Log detailed replacements for review
      result.log.forEach(({ pattern, match, replacement, description }) => {
        console.log(`   ${match} → ${replacement} (${description})`);
      });
      
      return { filePath, replacements: result.replacements, log: result.log };
    } else {
      console.log(`⏭️  ${filePath}: No replacements needed`);
      return { filePath, replacements: 0, log: [] };
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return { filePath, error: error.message };
  }
}

/**
 * Recursively find all markdown files
 */
async function findMarkdownFiles(dir) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !excludePatterns.some(pattern => 
        fullPath.includes('node_modules') || fullPath.includes('.git') || fullPath.includes('dist')
      )) {
        const subFiles = await findMarkdownFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return files;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting global terminology replacement...\n');
  
  // Find all files to process
  const files = await findMarkdownFiles('src/content/docs');
  
  console.log(`📁 Found ${files.length} files to process\n`);
  
  // Process all files
  const results = [];
  for (const file of files) {
    const result = await processFile(file);
    results.push(result);
  }
  
  // Summary
  const successfulFiles = results.filter(r => !r.error);
  const totalReplacements = successfulFiles.reduce((sum, r) => sum + r.replacements, 0);
  const filesWithChanges = successfulFiles.filter(r => r.replacements > 0);
  
  console.log('\n📊 Summary:');
  console.log(`   Files processed: ${successfulFiles.length}`);
  console.log(`   Files modified: ${filesWithChanges.length}`);
  console.log(`   Total replacements: ${totalReplacements}`);
  
  if (results.some(r => r.error)) {
    console.log('\n❌ Errors encountered:');
    results.filter(r => r.error).forEach(r => {
      console.log(`   ${r.filePath}: ${r.error}`);
    });
  }
  
  // Save detailed log
  const logData = {
    timestamp: new Date().toISOString(),
    summary: {
      filesProcessed: successfulFiles.length,
      filesModified: filesWithChanges.length,
      totalReplacements
    },
    replacementPatterns: replacementPatterns.map(p => ({
      pattern: p.pattern.source,
      replacement: p.replacement,
      description: p.description
    })),
    fileResults: results
  };
  
  const logFileName = `scripts/reports/terminology-replacement-log-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  await fs.writeFile(logFileName, JSON.stringify(logData, null, 2));
  console.log(`\n📝 Detailed log saved to: ${logFileName}`);
  
  console.log('\n✅ Global terminology replacement completed!');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { applyReplacements, replacementPatterns };