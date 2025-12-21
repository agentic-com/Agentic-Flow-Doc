#!/usr/bin/env node

/**
 * Documentation Audit Runner
 * 
 * Simple interface for running documentation audits and validation tools.
 * Provides easy access to all audit capabilities for builtin nodes.
 */

import { spawn } from 'child_process';
import path from 'path';

const AUDIT_TOOLS = {
  'builtin-audit': {
    script: './validation/builtin-nodes-auditor.js',
    description: 'Comprehensive audit of all builtin node documentation'
  },
  'content-validation': {
    script: './validation/content-validator.js', 
    description: 'Structure and content quality validation'
  },
  'framework-audit': {
    script: './validation/audit-framework.js',
    description: 'Complete audit framework with implementation planning'
  },
  'all-validations': {
    script: './validation/run-all-validations.js',
    description: 'Run all validation tools and generate comprehensive report'
  }
};

function printUsage() {
  console.log('📋 Documentation Audit Tools\n');
  console.log('Usage: node run-audit.js <tool> [options]\n');
  console.log('Available tools:');
  
  Object.entries(AUDIT_TOOLS).forEach(([name, tool]) => {
    console.log(`  ${name.padEnd(20)} - ${tool.description}`);
  });
  
  console.log('\nExamples:');
  console.log('  node run-audit.js builtin-audit     # Audit builtin nodes');
  console.log('  node run-audit.js framework-audit   # Complete framework audit');
  console.log('  node run-audit.js content-validation src/path/to/file.md  # Validate specific file');
}

function runTool(toolName, args = []) {
  const tool = AUDIT_TOOLS[toolName];
  
  if (!tool) {
    console.error(`❌ Unknown tool: ${toolName}`);
    printUsage();
    process.exit(1);
  }
  
  console.log(`🚀 Running ${toolName}: ${tool.description}\n`);
  
  const scriptPath = path.resolve(tool.script);
  const child = spawn('node', [scriptPath, ...args], {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  child.on('close', (code) => {
    console.log(`\n✅ ${toolName} completed with exit code ${code}`);
    process.exit(code);
  });
  
  child.on('error', (error) => {
    console.error(`❌ Failed to run ${toolName}:`, error);
    process.exit(1);
  });
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  printUsage();
  process.exit(0);
}

const toolName = args[0];
const toolArgs = args.slice(1);

runTool(toolName, toolArgs);