#!/usr/bin/env node

import { readFile, readdir, stat, writeFile } from 'fs/promises';
import { join, extname, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Technical Accuracy Review
 * Verifies browser extension capabilities and security documentation
 */

class TechnicalAccuracyReviewer {
  constructor() {
    this.docsPath = join(__dirname, '../src/content/docs');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.results = {
      timestamp: this.timestamp,
      summary: {
        totalFiles: 0,
        reviewedFiles: 0,
        accurateFiles: 0,
        inaccurateFiles: 0,
        totalIssues: 0
      },
      browserExtensionCapabilities: [],
      securityLimitations: [],
      workflowExamples: [],
      apiDocumentation: [],
      issues: []
    };

    // Define known browser extension capabilities
    this.browserCapabilities = {
      textExtraction: {
        nodes: ['GetSelectedText', 'GetAllText'],
        apis: ['document.getSelection()', 'document.body.innerText', 'textContent'],
        limitations: ['Cannot access cross-origin frames', 'Requires activeTab permission']
      },
      htmlProcessing: {
        nodes: ['GetAllHTML', 'GetHTMLofSelectedText'],
        apis: ['document.documentElement.outerHTML', 'innerHTML'],
        limitations: ['Cannot modify DOM in all contexts', 'CSP restrictions apply']
      },
      linkCollection: {
        nodes: ['GetAllLinks'],
        apis: ['document.querySelectorAll("a")', 'document.links'],
        limitations: ['Only visible links accessible', 'Dynamic links may be missed']
      },
      imageGathering: {
        nodes: ['GetAllImages'],
        apis: ['document.images', 'document.querySelectorAll("img")'],
        limitations: ['Background images not included', 'Lazy-loaded images may be missed']
      }
    };

    // Define security considerations
    this.securityRequirements = {
      permissions: ['activeTab', 'scripting', 'storage'],
      cspLimitations: ['inline scripts restricted', 'eval() not allowed'],
      crossOrigin: ['same-origin policy applies', 'CORS restrictions'],
      dataHandling: ['sensitive data encryption', 'local storage limitations']
    };
  }

  /**
   * Run technical accuracy review
   */
  async runTechnicalReview() {
    console.log('🔬 Starting technical accuracy review...\n');

    try {
      // 1. Review browser extension node documentation
      console.log('1️⃣ Reviewing browser extension node documentation...');
      await this.reviewBrowserExtensionNodes();

      // 2. Review security limitation documentation
      console.log('\n2️⃣ Reviewing security limitation documentation...');
      await this.reviewSecurityDocumentation();

      // 3. Review workflow examples
      console.log('\n3️⃣ Reviewing workflow examples...');
      await this.reviewWorkflowExamples();

      // 4. Review API documentation accuracy
      console.log('\n4️⃣ Reviewing API documentation...');
      await this.reviewApiDocumentation();

      // Generate final report
      await this.generateTechnicalReport();

    } catch (error) {
      console.error('❌ Technical review failed:', error);
      throw error;
    }
  }

  /**
   * Review browser extension node documentation
   */
  async reviewBrowserExtensionNodes() {
    const extensionNodesPath = join(this.docsPath, 'integration/extension');
    
    try {
      const files = await readdir(extensionNodesPath);
      
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = join(extensionNodesPath, file);
          const content = await readFile(filePath, 'utf-8');
          const relativePath = relative(join(__dirname, '..'), filePath);
          
          this.results.summary.totalFiles++;
          this.results.summary.reviewedFiles++;
          
          const nodeReview = await this.reviewNodeDocumentation(content, file, relativePath);
          this.results.browserExtensionCapabilities.push(nodeReview);
          
          if (nodeReview.accurate) {
            this.results.summary.accurateFiles++;
          } else {
            this.results.summary.inaccurateFiles++;
            this.results.summary.totalIssues += nodeReview.issues.length;
          }
        }
      }
    } catch (error) {
      console.error('Error reviewing browser extension nodes:', error);
    }
  }

  /**
   * Review individual node documentation
   */
  async reviewNodeDocumentation(content, filename, relativePath) {
    const nodeName = filename.replace('.md', '');
    const review = {
      node: nodeName,
      file: relativePath,
      accurate: true,
      issues: [],
      capabilities: [],
      limitations: [],
      examples: []
    };

    // Check if node is documented with correct browser APIs
    const capability = this.findNodeCapability(nodeName);
    if (capability) {
      // Verify API documentation
      const hasCorrectApis = capability.apis.some(api => 
        content.toLowerCase().includes(api.toLowerCase())
      );
      
      if (!hasCorrectApis) {
        review.accurate = false;
        review.issues.push({
          type: 'missing-api-documentation',
          message: `Missing browser API documentation for ${nodeName}`,
          suggestion: `Document APIs: ${capability.apis.join(', ')}`
        });
      }

      // Verify limitations are documented
      const hasLimitations = capability.limitations.some(limitation =>
        content.toLowerCase().includes(limitation.toLowerCase().split(' ')[0])
      );

      if (!hasLimitations) {
        review.accurate = false;
        review.issues.push({
          type: 'missing-limitations',
          message: `Missing limitation documentation for ${nodeName}`,
          suggestion: `Document limitations: ${capability.limitations.join(', ')}`
        });
      }

      review.capabilities = capability.apis;
      review.limitations = capability.limitations;
    }

    // Check for browser context examples
    const hasBrowserExamples = /document\.|window\.|chrome\.|browser\./i.test(content);
    if (!hasBrowserExamples) {
      review.accurate = false;
      review.issues.push({
        type: 'missing-browser-examples',
        message: `No browser API usage examples found in ${nodeName}`,
        suggestion: 'Add code examples showing browser API usage'
      });
    }

    // Check for security considerations
    const hasSecurityInfo = /security|permission|cors|csp/i.test(content);
    if (!hasSecurityInfo) {
      review.accurate = false;
      review.issues.push({
        type: 'missing-security-info',
        message: `No security considerations documented for ${nodeName}`,
        suggestion: 'Add security limitations and permission requirements'
      });
    }

    // Extract code examples
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    review.examples = codeBlocks.map(block => ({
      code: block,
      hasBrowserAPIs: /document\.|window\.|chrome\.|browser\./i.test(block),
      hasNodeJS: /require\(|import.*from ['"]fs/i.test(block)
    }));

    return review;
  }

  /**
   * Find capability definition for node
   */
  findNodeCapability(nodeName) {
    for (const [category, capability] of Object.entries(this.browserCapabilities)) {
      if (capability.nodes.includes(nodeName)) {
        return capability;
      }
    }
    return null;
  }

  /**
   * Review security limitation documentation
   */
  async reviewSecurityDocumentation() {
    const securityFiles = [
      'usage/licenses-and-privacy/privacy-security/security.md',
      'usage/licenses-and-privacy/privacy-security/privacy.md'
    ];

    for (const file of securityFiles) {
      try {
        const filePath = join(this.docsPath, file);
        const content = await readFile(filePath, 'utf-8');
        const relativePath = relative(join(__dirname, '..'), filePath);
        
        this.results.summary.totalFiles++;
        this.results.summary.reviewedFiles++;
        
        const securityReview = await this.reviewSecurityContent(content, relativePath);
        this.results.securityLimitations.push(securityReview);
        
        if (securityReview.accurate) {
          this.results.summary.accurateFiles++;
        } else {
          this.results.summary.inaccurateFiles++;
          this.results.summary.totalIssues += securityReview.issues.length;
        }
      } catch (error) {
        console.error(`Error reviewing security file ${file}:`, error);
      }
    }

    // Also check for security mentions in other files
    await this.checkSecurityMentionsInAllFiles();
  }

  /**
   * Review security content accuracy
   */
  async reviewSecurityContent(content, relativePath) {
    const review = {
      file: relativePath,
      accurate: true,
      issues: [],
      coveredTopics: [],
      missingTopics: []
    };

    // Check for browser extension specific security topics
    const requiredTopics = {
      'content security policy': /csp|content security policy/i,
      'cross-origin restrictions': /cors|cross.?origin|same.?origin/i,
      'browser permissions': /permission|activeTab|scripting/i,
      'data storage limitations': /storage|local storage|session storage/i,
      'script injection': /script injection|xss|cross.?site scripting/i
    };

    Object.entries(requiredTopics).forEach(([topic, pattern]) => {
      if (pattern.test(content)) {
        review.coveredTopics.push(topic);
      } else {
        review.missingTopics.push(topic);
        review.accurate = false;
        review.issues.push({
          type: 'missing-security-topic',
          message: `Missing security topic: ${topic}`,
          suggestion: `Add documentation about ${topic} in browser extension context`
        });
      }
    });

    // Check for outdated server-specific security info
    const serverSecurityPatterns = [
      /database security/i,
      /server hardening/i,
      /network security/i,
      /ssl certificate/i
    ];

    serverSecurityPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        review.accurate = false;
        review.issues.push({
          type: 'outdated-security-info',
          message: `Contains server-specific security information: ${pattern.source}`,
          suggestion: 'Update to focus on browser extension security considerations'
        });
      }
    });

    return review;
  }

  /**
   * Check for security mentions across all files
   */
  async checkSecurityMentionsInAllFiles() {
    await this.checkSecurityInDirectory(this.docsPath);
  }

  /**
   * Check security mentions in directory recursively
   */
  async checkSecurityInDirectory(dirPath) {
    try {
      const entries = await readdir(dirPath);
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          await this.checkSecurityInDirectory(fullPath);
        } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
          const content = await readFile(fullPath, 'utf-8');
          const relativePath = relative(join(__dirname, '..'), fullPath);
          
          // Check for security-sensitive content without proper warnings
          const hasSecurityContent = /password|token|api.?key|credential|auth/i.test(content);
          const hasSecurityWarning = /security|caution|warning|important.*security/i.test(content);
          
          if (hasSecurityContent && !hasSecurityWarning) {
            this.results.issues.push({
              file: relativePath,
              type: 'missing-security-warning',
              message: 'File contains security-sensitive content but lacks security warnings',
              suggestion: 'Add security considerations section'
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error checking security in ${dirPath}:`, error);
    }
  }

  /**
   * Review workflow examples
   */
  async reviewWorkflowExamples() {
    const examplePaths = [
      'learning/examples',
      'advanced-ai/examples'
    ];

    for (const examplePath of examplePaths) {
      try {
        const fullPath = join(this.docsPath, examplePath);
        await this.reviewExamplesInDirectory(fullPath);
      } catch (error) {
        console.error(`Error reviewing examples in ${examplePath}:`, error);
      }
    }
  }

  /**
   * Review examples in directory
   */
  async reviewExamplesInDirectory(dirPath) {
    try {
      const entries = await readdir(dirPath);
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          await this.reviewExamplesInDirectory(fullPath);
        } else if (entry.endsWith('.md')) {
          const content = await readFile(fullPath, 'utf-8');
          const relativePath = relative(join(__dirname, '..'), fullPath);
          
          this.results.summary.totalFiles++;
          this.results.summary.reviewedFiles++;
          
          const exampleReview = await this.reviewWorkflowExample(content, relativePath);
          this.results.workflowExamples.push(exampleReview);
          
          if (exampleReview.accurate) {
            this.results.summary.accurateFiles++;
          } else {
            this.results.summary.inaccurateFiles++;
            this.results.summary.totalIssues += exampleReview.issues.length;
          }
        }
      }
    } catch (error) {
      console.error(`Error reviewing examples directory ${dirPath}:`, error);
    }
  }

  /**
   * Review individual workflow example
   */
  async reviewWorkflowExample(content, relativePath) {
    const review = {
      file: relativePath,
      accurate: true,
      issues: [],
      browserNodes: [],
      serverNodes: [],
      codeExamples: []
    };

    // Check for browser extension nodes usage
    const browserNodes = Object.values(this.browserCapabilities)
      .flatMap(cap => cap.nodes);
    
    browserNodes.forEach(node => {
      if (content.includes(node)) {
        review.browserNodes.push(node);
      }
    });

    // Check for server-specific nodes that shouldn't be in browser examples
    const serverNodes = [
      'HTTP Request', 'Webhook', 'FTP', 'SSH', 'MySQL', 'PostgreSQL',
      'MongoDB', 'Redis', 'Docker', 'Kubernetes'
    ];

    serverNodes.forEach(node => {
      if (content.includes(node)) {
        review.serverNodes.push(node);
        review.accurate = false;
        review.issues.push({
          type: 'server-node-in-browser-example',
          message: `Server-specific node "${node}" used in browser extension example`,
          suggestion: 'Replace with browser-compatible alternatives'
        });
      }
    });

    // Check code examples for browser compatibility
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    codeBlocks.forEach(block => {
      const example = {
        code: block.substring(0, 100) + '...',
        browserCompatible: true,
        issues: []
      };

      // Check for Node.js specific code
      if (/require\(|import.*from ['"]fs|process\.env|__dirname/i.test(block)) {
        example.browserCompatible = false;
        example.issues.push('Contains Node.js specific code');
        review.accurate = false;
        review.issues.push({
          type: 'nodejs-code-in-browser-example',
          message: 'Code example contains Node.js patterns not suitable for browser',
          suggestion: 'Use browser-compatible APIs'
        });
      }

      // Check for server deployment code
      if (/docker|kubectl|pm2|systemd/i.test(block)) {
        example.browserCompatible = false;
        example.issues.push('Contains server deployment code');
        review.accurate = false;
        review.issues.push({
          type: 'server-deployment-in-browser-example',
          message: 'Code example contains server deployment patterns',
          suggestion: 'Remove server-specific deployment code'
        });
      }

      review.codeExamples.push(example);
    });

    // Check if example explains browser context
    if (review.browserNodes.length > 0) {
      const explainsBrowserContext = /browser|extension|dom|content script/i.test(content);
      if (!explainsBrowserContext) {
        review.accurate = false;
        review.issues.push({
          type: 'missing-browser-context-explanation',
          message: 'Example uses browser nodes but doesn\'t explain browser context',
          suggestion: 'Add explanation of browser extension context and limitations'
        });
      }
    }

    return review;
  }

  /**
   * Review API documentation
   */
  async reviewApiDocumentation() {
    const apiFiles = [
      'integration/builtin/core',
      'integration/extension'
    ];

    for (const apiPath of apiFiles) {
      try {
        const fullPath = join(this.docsPath, apiPath);
        await this.reviewApiInDirectory(fullPath);
      } catch (error) {
        console.error(`Error reviewing API docs in ${apiPath}:`, error);
      }
    }
  }

  /**
   * Review API documentation in directory
   */
  async reviewApiInDirectory(dirPath) {
    try {
      const entries = await readdir(dirPath);
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          await this.reviewApiInDirectory(fullPath);
        } else if (entry.endsWith('.md')) {
          const content = await readFile(fullPath, 'utf-8');
          const relativePath = relative(join(__dirname, '..'), fullPath);
          
          this.results.summary.totalFiles++;
          this.results.summary.reviewedFiles++;
          
          const apiReview = await this.reviewApiDocumentationFile(content, relativePath);
          this.results.apiDocumentation.push(apiReview);
          
          if (apiReview.accurate) {
            this.results.summary.accurateFiles++;
          } else {
            this.results.summary.inaccurateFiles++;
            this.results.summary.totalIssues += apiReview.issues.length;
          }
        }
      }
    } catch (error) {
      console.error(`Error reviewing API directory ${dirPath}:`, error);
    }
  }

  /**
   * Review API documentation file
   */
  async reviewApiDocumentationFile(content, relativePath) {
    const review = {
      file: relativePath,
      accurate: true,
      issues: [],
      parameters: [],
      examples: [],
      browserContext: false
    };

    // Check for parameter documentation
    const hasParameters = /parameter|input|field|option/i.test(content);
    if (!hasParameters && relativePath.includes('/integration/')) {
      review.accurate = false;
      review.issues.push({
        type: 'missing-parameter-docs',
        message: 'Integration documentation should include parameter descriptions',
        suggestion: 'Add parameter documentation section'
      });
    }

    // Check for browser context explanation
    if (relativePath.includes('/extension/')) {
      review.browserContext = /browser|extension|dom|content script|permission/i.test(content);
      if (!review.browserContext) {
        review.accurate = false;
        review.issues.push({
          type: 'missing-browser-context',
          message: 'Browser extension node should explain browser context usage',
          suggestion: 'Add browser context and permission requirements'
        });
      }
    }

    // Check for realistic examples
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    if (codeBlocks.length === 0 && relativePath.includes('/integration/')) {
      review.accurate = false;
      review.issues.push({
        type: 'missing-code-examples',
        message: 'Integration documentation should include code examples',
        suggestion: 'Add practical usage examples'
      });
    }

    // Validate code examples
    codeBlocks.forEach(block => {
      const example = {
        realistic: true,
        issues: []
      };

      // Check for placeholder values
      if (/your.?api.?key|example\.com|placeholder|TODO|TBD/i.test(block)) {
        example.realistic = false;
        example.issues.push('Contains placeholder values');
      }

      // Check for browser compatibility
      if (relativePath.includes('/extension/')) {
        const hasBrowserAPIs = /document\.|window\.|chrome\.|browser\./i.test(block);
        if (!hasBrowserAPIs) {
          example.realistic = false;
          example.issues.push('Missing browser API usage for extension node');
          review.accurate = false;
          review.issues.push({
            type: 'unrealistic-browser-example',
            message: 'Browser extension example should use browser APIs',
            suggestion: 'Include document, window, or browser API usage'
          });
        }
      }

      review.examples.push(example);
    });

    return review;
  }

  /**
   * Generate technical accuracy report
   */
  async generateTechnicalReport() {
    const reportPath = `scripts/reports/technical-accuracy-report-${this.timestamp}.json`;
    const summaryPath = `scripts/reports/technical-accuracy-summary-${this.timestamp}.txt`;
    
    // Generate JSON report
    await writeFile(reportPath, JSON.stringify(this.results, null, 2));
    
    // Generate human-readable summary
    const summary = this.generateTechnicalSummary();
    await writeFile(summaryPath, summary);
    
    console.log('\n🔬 TECHNICAL ACCURACY REVIEW SUMMARY');
    console.log('=' .repeat(60));
    console.log(summary);
    console.log(`\n💾 Detailed results: ${reportPath}`);
    console.log(`📄 Summary report: ${summaryPath}`);
    
    return this.results.summary.inaccurateFiles === 0;
  }

  /**
   * Generate technical summary text
   */
  generateTechnicalSummary() {
    const { summary, browserExtensionCapabilities, securityLimitations, workflowExamples, apiDocumentation } = this.results;
    
    let text = `TECHNICAL ACCURACY REVIEW REPORT\n`;
    text += `Generated: ${new Date(this.timestamp).toLocaleString()}\n\n`;
    
    text += `OVERALL SUMMARY:\n`;
    text += `- Total Files Reviewed: ${summary.reviewedFiles}\n`;
    text += `- Technically Accurate: ${summary.accurateFiles}\n`;
    text += `- Technically Inaccurate: ${summary.inaccurateFiles}\n`;
    text += `- Total Issues Found: ${summary.totalIssues}\n`;
    text += `- Accuracy Rate: ${((summary.accurateFiles / summary.reviewedFiles) * 100).toFixed(1)}%\n\n`;
    
    text += `BROWSER EXTENSION CAPABILITIES:\n`;
    text += `- Nodes Reviewed: ${browserExtensionCapabilities.length}\n`;
    const accurateNodes = browserExtensionCapabilities.filter(n => n.accurate).length;
    text += `- Accurately Documented: ${accurateNodes}\n`;
    text += `- Need Updates: ${browserExtensionCapabilities.length - accurateNodes}\n\n`;
    
    text += `SECURITY DOCUMENTATION:\n`;
    text += `- Security Files Reviewed: ${securityLimitations.length}\n`;
    const accurateSecurity = securityLimitations.filter(s => s.accurate).length;
    text += `- Accurate Security Docs: ${accurateSecurity}\n`;
    text += `- Need Security Updates: ${securityLimitations.length - accurateSecurity}\n\n`;
    
    text += `WORKFLOW EXAMPLES:\n`;
    text += `- Examples Reviewed: ${workflowExamples.length}\n`;
    const accurateExamples = workflowExamples.filter(e => e.accurate).length;
    text += `- Browser-Compatible: ${accurateExamples}\n`;
    text += `- Need Browser Updates: ${workflowExamples.length - accurateExamples}\n\n`;
    
    text += `API DOCUMENTATION:\n`;
    text += `- API Files Reviewed: ${apiDocumentation.length}\n`;
    const accurateApi = apiDocumentation.filter(a => a.accurate).length;
    text += `- Accurate API Docs: ${accurateApi}\n`;
    text += `- Need API Updates: ${apiDocumentation.length - accurateApi}\n\n`;
    
    // Add key findings
    text += `KEY FINDINGS:\n`;
    const allIssues = [
      ...browserExtensionCapabilities.flatMap(n => n.issues),
      ...securityLimitations.flatMap(s => s.issues),
      ...workflowExamples.flatMap(e => e.issues),
      ...apiDocumentation.flatMap(a => a.issues)
    ];
    
    const issueTypes = allIssues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(issueTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([type, count]) => {
        text += `- ${type.replace(/-/g, ' ')}: ${count} occurrences\n`;
      });
    
    text += `\nRECOMMENDATIONS:\n`;
    if (summary.inaccurateFiles > 0) {
      text += `- Update ${summary.inaccurateFiles} files with technical inaccuracies\n`;
      text += `- Add missing browser API documentation\n`;
      text += `- Include security limitations for browser context\n`;
      text += `- Update workflow examples to use browser-compatible patterns\n`;
      text += `- Add browser permission requirements to node documentation\n`;
    } else {
      text += `- All documentation is technically accurate!\n`;
      text += `- Browser extension capabilities are properly documented\n`;
      text += `- Security considerations are adequately covered\n`;
    }
    
    return text;
  }
}

// Export for use in other modules
export { TechnicalAccuracyReviewer };

// Run technical review if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const reviewer = new TechnicalAccuracyReviewer();
  
  reviewer.runTechnicalReview()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Technical accuracy review failed:', error);
      process.exit(1);
    });
}