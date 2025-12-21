#!/usr/bin/env node

/**
 * Fix Remaining JSON Issues
 * 
 * This script fixes the remaining JSON syntax errors identified in validation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  builtinDocsPath: path.join(__dirname, '../src/content/docs/integration/builtin')
};

class JSONFixer {
  async fixAll() {
    console.log('🔧 Fixing remaining JSON syntax issues...\n');
    
    // Fix LambdaOutput.md - 4 backticks issue
    await this.fixLambdaOutput();
    
    // Fix RecursiveCharacterTextSplitter.md - unterminated string
    await this.fixRecursiveCharacterTextSplitter();
    
    console.log('\n✅ All JSON syntax issues fixed!');
  }

  async fixLambdaOutput() {
    const filePath = path.join(CONFIG.builtinDocsPath, 'lambda/LambdaOutput.md');
    console.log('🔧 Fixing LambdaOutput.md...');
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix all instances of 4 backticks to 3 backticks
    content = content.replace(/````json/g, '```json');
    content = content.replace(/````\n/g, '```\n');
    
    // Also fix any malformed JSON blocks with backticks inside
    content = content.replace(/```json\n`{[\s\S]*?}`\n```/g, (match) => {
      // Extract the JSON content and fix it
      const jsonContent = match.replace(/```json\n`/, '').replace(/`\n```/, '');
      return `\`\`\`json\n${jsonContent}\n\`\`\``;
    });
    
    fs.writeFileSync(filePath, content);
    console.log('  ✅ Fixed LambdaOutput.md');
  }

  async fixRecursiveCharacterTextSplitter() {
    const filePath = path.join(CONFIG.builtinDocsPath, 'ai/AIDependencies/textSplitter/RecursiveCharacterTextSplitter.md');
    console.log('🔧 Fixing RecursiveCharacterTextSplitter.md...');
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix the specific JSON block with unterminated string
    // The issue is likely in the separators array with the backticks
    content = content.replace(
      /"separators": \["\`\`\`\\n", "\\n\\n", "\\n", "\. ", " "\]/g,
      '"separators": ["```\\n", "\\n\\n", "\\n", ". ", " "]'
    );
    
    // Also fix any trailing 4 backticks
    content = content.replace(/````\n/g, '```\n');
    
    // Fix any JSON blocks that might have unterminated strings due to escaping issues
    content = content.replace(/("separators": \[)"([^"]*\\n[^"]*)"(,)/g, '$1"$2"$3');
    
    fs.writeFileSync(filePath, content);
    console.log('  ✅ Fixed RecursiveCharacterTextSplitter.md');
  }
}

// Run fixes if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new JSONFixer();
  fixer.fixAll().catch(console.error);
}

export default JSONFixer;