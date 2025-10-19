#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/content/docs/integration/builtin/ai/AIDependencies/textSplitter/RecursiveCharacterTextSplitter.md');

console.log('Testing JSON validity in RecursiveCharacterTextSplitter.md...');

const content = fs.readFileSync(filePath, 'utf-8');
const jsonBlocks = content.match(/```json\n([\s\S]*?)\n```/g) || [];

console.log(`Found ${jsonBlocks.length} JSON blocks`);

jsonBlocks.forEach((block, i) => {
  const jsonContent = block.replace(/```json\n/, '').replace(/\n```$/, '');
  try {
    JSON.parse(jsonContent);
    console.log(`✅ JSON block ${i + 1}: Valid`);
  } catch (error) {
    console.log(`❌ JSON block ${i + 1}: ${error.message}`);
    console.log(`Content: ${jsonContent.substring(0, 200)}...`);
  }
});

console.log('Test complete.');