#!/usr/bin/env node

/**
 * Code Example Testing Framework for Browser Extension Environment
 * 
 * This script extracts and tests all code examples from documentation
 * to ensure they work correctly in the browser extension environment.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CodeExampleTester {
  constructor() {
    this.testResults = {
      totalExamples: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };
    
    this.testEnvironment = {
      browser: 'chrome',
      extensionVersion: '2.1.0',
      nodeVersion: process.version,
      testTimeout: 30000
    };
  }

  /**
   * Test all code examples in documentation
   */
  async testAllExamples() {
    console.log('🧪 Starting code example testing...\n');
    console.log(`Environment: ${this.testEnvironment.browser} | Extension v${this.testEnvironment.extensionVersion} | Node ${this.testEnvironment.nodeVersion}\n`);
    
    const contentDir = path.join(process.cwd(), 'src/content/docs');
    await this.testDirectory(contentDir);
    
    this.printTestSummary();
    return this.testResults;
  }

  /**
   * Recursively test code examples in all markdown files
   */
  async testDirectory(dirPath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          await this.testDirectory(fullPath);
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
          await this.testFileExamples(fullPath);
        }
      }
    } catch (error) {
      this.addError(`Failed to read directory ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Extract and test code examples from a single file
   */
  async testFileExamples(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      const codeBlocks = this.extractCodeBlocks(content);
      
      if (codeBlocks.length === 0) {
        return; // No code examples to test
      }
      
      console.log(`📄 Testing examples in: ${relativePath}`);
      
      for (let i = 0; i < codeBlocks.length; i++) {
        const block = codeBlocks[i];
        await this.testCodeBlock(block, relativePath, i + 1);
      }
      
    } catch (error) {
      this.addError(`Failed to test examples in ${filePath}: ${error.message}`);
    }
  }

  /**
   * Extract code blocks from markdown content
   */
  extractCodeBlocks(content) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks = [];
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'text';
      const code = match[2].trim();
      
      if (code.length > 0) {
        blocks.push({
          language,
          code,
          startIndex: match.index
        });
      }
    }
    
    return blocks;
  }

  /**
   * Test a single code block
   */
  async testCodeBlock(block, filePath, blockNumber) {
    this.testResults.totalExamples++;
    
    const testId = `${filePath}:block-${blockNumber}`;
    console.log(`  🔍 Testing block ${blockNumber} (${block.language})`);
    
    try {
      // Determine test strategy based on language
      switch (block.language.toLowerCase()) {
        case 'javascript':
        case 'js':
          await this.testJavaScriptCode(block, testId);
          break;
        case 'json':
          await this.testJSONCode(block, testId);
          break;
        case 'typescript':
        case 'ts':
          await this.testTypeScriptCode(block, testId);
          break;
        case 'bash':
        case 'shell':
          await this.testShellCode(block, testId);
          break;
        default:
          this.skipTest(testId, `Unsupported language: ${block.language}`);
          return;
      }
      
      this.testResults.passed++;
      console.log(`    ✅ Passed`);
      
    } catch (error) {
      this.testResults.failed++;
      console.log(`    ❌ Failed: ${error.message}`);
      
      this.testResults.errors.push({
        testId,
        language: block.language,
        error: error.message,
        code: block.code.substring(0, 200) + (block.code.length > 200 ? '...' : '')
      });
    }
  }

  /**
   * Test JavaScript code examples
   */
  async testJavaScriptCode(block, testId) {
    // Create a test file
    const testFile = path.join(__dirname, 'temp', `${testId.replace(/[^a-zA-Z0-9]/g, '_')}.js`);
    
    try {
      // Ensure temp directory exists
      await fs.mkdir(path.dirname(testFile), { recursive: true });
      
      // Wrap code in test harness
      const testCode = this.wrapJavaScriptForTesting(block.code);
      await fs.writeFile(testFile, testCode);
      
      // Run the test
      const result = await this.executeWithTimeout(
        () => this.runNodeScript(testFile),
        this.testEnvironment.testTimeout
      );
      
      // Validate result
      if (result.includes('ERROR:') || result.includes('TypeError') || result.includes('ReferenceError')) {
        throw new Error(`Runtime error: ${result.split('\n')[0]}`);
      }
      
    } finally {
      // Clean up test file
      try {
        await fs.unlink(testFile);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Wrap JavaScript code for safe testing
   */
  wrapJavaScriptForTesting(code) {
    return `
// Test harness for code example validation
(async () => {
  try {
    // Mock browser extension APIs if needed
    const mockBrowserAPI = {
      tabs: {
        query: () => Promise.resolve([{ id: 1, url: 'https://example.com' }]),
        executeScript: () => Promise.resolve([{ result: 'mock result' }])
      },
      runtime: {
        sendMessage: () => Promise.resolve({ success: true })
      }
    };
    
    // Make browser API available if referenced
    if (typeof chrome === 'undefined') {
      global.chrome = mockBrowserAPI;
    }
    if (typeof browser === 'undefined') {
      global.browser = mockBrowserAPI;
    }
    
    // Mock fetch if not available
    if (typeof fetch === 'undefined') {
      global.fetch = async (url) => ({
        ok: true,
        json: () => Promise.resolve({ mock: 'data' }),
        text: () => Promise.resolve('mock response')
      });
    }
    
    // Execute the actual code
    ${code}
    
    console.log('SUCCESS: Code executed without errors');
    
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
})();
`;
  }

  /**
   * Test JSON code examples
   */
  async testJSONCode(block, testId) {
    try {
      // Parse JSON to validate syntax
      const parsed = JSON.parse(block.code);
      
      // Additional validation for workflow configurations
      if (parsed.workflow || parsed.nodes || parsed.connections) {
        this.validateWorkflowConfiguration(parsed);
      }
      
      // Validate against common schemas
      if (parsed.node_configuration || parsed.config) {
        this.validateNodeConfiguration(parsed);
      }
      
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON syntax: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Test TypeScript code examples
   */
  async testTypeScriptCode(block, testId) {
    // For now, treat TypeScript similar to JavaScript but with type checking
    const testFile = path.join(__dirname, 'temp', `${testId.replace(/[^a-zA-Z0-9]/g, '_')}.ts`);
    
    try {
      await fs.mkdir(path.dirname(testFile), { recursive: true });
      await fs.writeFile(testFile, block.code);
      
      // Check TypeScript compilation
      try {
        execSync(`npx tsc --noEmit --target es2020 --moduleResolution node "${testFile}"`, {
          stdio: 'pipe',
          timeout: this.testEnvironment.testTimeout
        });
      } catch (error) {
        throw new Error(`TypeScript compilation failed: ${error.message}`);
      }
      
    } finally {
      try {
        await fs.unlink(testFile);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Test shell/bash code examples
   */
  async testShellCode(block, testId) {
    // Only test safe, non-destructive commands
    const safeCommands = ['echo', 'ls', 'pwd', 'which', 'node --version', 'npm --version'];
    const lines = block.code.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    
    for (const line of lines) {
      const command = line.split(' ')[0];
      
      if (!safeCommands.some(safe => line.startsWith(safe))) {
        this.skipTest(testId, `Unsafe shell command: ${command}`);
        return;
      }
    }
    
    // Test safe commands
    try {
      execSync(block.code, {
        stdio: 'pipe',
        timeout: this.testEnvironment.testTimeout
      });
    } catch (error) {
      throw new Error(`Shell command failed: ${error.message}`);
    }
  }

  /**
   * Validate workflow configuration structure
   */
  validateWorkflowConfiguration(config) {
    if (config.workflow) {
      const workflow = config.workflow;
      
      if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
        throw new Error('Workflow must have a nodes array');
      }
      
      if (!workflow.connections || !Array.isArray(workflow.connections)) {
        throw new Error('Workflow must have a connections array');
      }
      
      // Validate node structure
      workflow.nodes.forEach((node, index) => {
        if (!node.id || typeof node.id !== 'string') {
          throw new Error(`Node at index ${index} must have a string id`);
        }
        
        if (!node.type || typeof node.type !== 'string') {
          throw new Error(`Node at index ${index} must have a string type`);
        }
      });
      
      // Validate connections
      workflow.connections.forEach((conn, index) => {
        if (!conn.from || !conn.to) {
          throw new Error(`Connection at index ${index} must have from and to properties`);
        }
      });
    }
  }

  /**
   * Validate node configuration structure
   */
  validateNodeConfiguration(config) {
    // Common validation for node configurations
    if (config.node_configuration) {
      const nodeConfig = config.node_configuration;
      
      // Check for required fields based on common patterns
      if (nodeConfig.type && typeof nodeConfig.type !== 'string') {
        throw new Error('Node type must be a string');
      }
    }
  }

  /**
   * Run a Node.js script and capture output
   */
  async runNodeScript(scriptPath) {
    return new Promise((resolve, reject) => {
      const { spawn } = require('child_process');
      const child = spawn('node', [scriptPath], {
        stdio: 'pipe',
        timeout: this.testEnvironment.testTimeout
      });
      
      let output = '';
      let errorOutput = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(errorOutput || `Process exited with code ${code}`));
        }
      });
      
      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Execute a function with timeout
   */
  async executeWithTimeout(fn, timeout) {
    return Promise.race([
      fn(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Test timeout')), timeout)
      )
    ]);
  }

  /**
   * Skip a test with reason
   */
  skipTest(testId, reason) {
    this.testResults.skipped++;
    console.log(`    ⏭️  Skipped: ${reason}`);
  }

  /**
   * Add error to results
   */
  addError(message) {
    this.testResults.errors.push({
      testId: 'system',
      error: message
    });
    this.testResults.failed++;
  }

  /**
   * Print test summary
   */
  printTestSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 CODE EXAMPLE TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`📊 Total Examples: ${this.testResults.totalExamples}`);
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`⏭️  Skipped: ${this.testResults.skipped}`);
    
    if (this.testResults.failed > 0) {
      console.log('\n🔍 Failed Tests:');
      this.testResults.errors.forEach(error => {
        console.log(`  • ${error.testId}: ${error.error}`);
      });
    }
    
    const successRate = this.testResults.totalExamples > 0 
      ? ((this.testResults.passed / this.testResults.totalExamples) * 100).toFixed(1)
      : '0';
    
    console.log(`\n📈 Success Rate: ${successRate}%`);
    
    if (this.testResults.failed === 0) {
      console.log('\n🎉 All code examples are working correctly!');
    } else {
      console.log('\n🔧 Please fix the failing code examples above.');
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new CodeExampleTester();
  
  tester.testAllExamples()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Testing failed:', error);
      process.exit(1);
    });
}

export default CodeExampleTester;