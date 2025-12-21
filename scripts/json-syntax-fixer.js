#!/usr/bin/env node

/**
 * JSON Syntax Fixer
 * 
 * This script specifically targets and fixes JSON syntax errors in the RecursiveCharacterTextSplitter.md file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/content/docs/integration/builtin/ai/AIDependencies/textSplitter/RecursiveCharacterTextSplitter.md');

function fixJSONSyntax() {
  console.log('🔧 Fixing JSON syntax in RecursiveCharacterTextSplitter.md...');
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract all JSON blocks
  const jsonBlocks = [];
  let match;
  const regex = /```json\n([\s\S]*?)\n```/g;
  
  while ((match = regex.exec(content)) !== null) {
    jsonBlocks.push({
      fullMatch: match[0],
      jsonContent: match[1],
      index: match.index
    });
  }
  
  console.log(`Found ${jsonBlocks.length} JSON blocks to validate`);
  
  let hasErrors = false;
  
  // Validate each JSON block
  jsonBlocks.forEach((block, i) => {
    try {
      JSON.parse(block.jsonContent);
      console.log(`  ✅ JSON block ${i + 1}: Valid`);
    } catch (error) {
      console.log(`  ❌ JSON block ${i + 1}: ${error.message}`);
      console.log(`     Content preview: ${block.jsonContent.substring(0, 100)}...`);
      hasErrors = true;
      
      // Try to fix common issues
      let fixedJson = block.jsonContent;
      
      // Fix 1: Escape unescaped newlines in strings
      fixedJson = fixedJson.replace(/"([^"]*?)\\n([^"]*?)"/g, (match, before, after) => {
        // If it's already properly escaped, don't change it
        if (before.includes('\\\\n') || after.includes('\\\\n')) {
          return match;
        }
        return `"${before}\\\\n${after}"`;
      });
      
      // Fix 2: Escape literal newlines in strings
      fixedJson = fixedJson.replace(/"([^"]*?)\n([^"]*?)"/g, '"$1\\n$2"');
      
      // Fix 3: Fix separator arrays with unescaped newlines
      fixedJson = fixedJson.replace(/"separators":\s*\[([^\]]*?)\]/g, (match, content) => {
        const fixedContent = content.replace(/"\n\n"/g, '"\\n\\n"').replace(/"\n"/g, '"\\n"');
        return `"separators": [${fixedContent}]`;
      });
      
      // Fix 4: Remove trailing commas
      fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1');
      
      // Fix 5: Add missing commas
      fixedJson = fixedJson.replace(/"\s*\n\s*"/g, '",\n  "');
      
      try {
        JSON.parse(fixedJson);
        console.log(`  ✅ Fixed JSON block ${i + 1}`);
        
        // Replace in content
        content = content.replace(block.fullMatch, `\`\`\`json\n${fixedJson}\n\`\`\``);
      } catch (fixError) {
        console.log(`  ❌ Could not fix JSON block ${i + 1}: ${fixError.message}`);
      }
    }
  });
  
  if (hasErrors) {
    // Create backup
    const backupPath = filePath + '.backup.' + Date.now();
    fs.copyFileSync(filePath, backupPath);
    console.log(`📁 Backup created: ${backupPath}`);
    
    // Write fixed content
    fs.writeFileSync(filePath, content);
    console.log('✅ File updated with fixes');
  } else {
    console.log('✅ No JSON syntax errors found');
  }
}

// Run the fixer
fixJSONSyntax();