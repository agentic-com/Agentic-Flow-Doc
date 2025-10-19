#!/usr/bin/env node

/**
 * Technical Accuracy Validation System
 * 
 * This script validates technical accuracy of documentation including
 * browser API references, permission requirements, and integration patterns.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TechnicalAccuracyValidator {
  constructor() {
    this.validationResults = {
      totalFiles: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: []
    };
    
    // Current browser API reference data
    this.browserAPIs = {
      chrome: {
        tabs: ['query', 'executeScript', 'create', 'update', 'remove'],
        runtime: ['sendMessage', 'onMessage', 'getManifest', 'getURL'],
        storage: ['local', 'sync', 'managed'],
        activeTab: ['executeScript', 'insertCSS'],
        scripting: ['executeScript', 'insertCSS', 'removeCSS']
      },
      permissions: {
        required: ['activeTab', 'storage', 'tabs'],
        optional: ['scripting', 'webNavigation', 'cookies'],
        host_permissions: ['<all_urls>', 'https://*/*', 'http://*/*']
      }
    };
    
    // Known deprecated APIs and their replacements
    this.deprecatedAPIs = {
      'chrome.tabs.executeScript': 'chrome.scripting.executeScript',
      'chrome.tabs.insertCSS': 'chrome.scripting.insertCSS',
      'chrome.extension.getURL': 'chrome.runtime.getURL'
    };
    
    // Current extension version compatibility
    this.extensionVersion = '2.1.0';
    this.supportedBrowsers = {
      chrome: { min: '88', current: '120' },
      firefox: { min: '78', current: '121' }
    };
  }

  /**
   * Validate technical accuracy across all documentation
   */
  async validateTechnicalAccuracy() {
    console.log('🔬 Starting technical accuracy validation...\n');
    
    const contentDir = path.join(process.cwd(), 'src/content/docs');
    await this.validateDirectory(contentDir);
    
    this.printValidationSummary();
    return this.validationResults;
  }

  /**
   * Recursively validate all files in directory
   */
  async validateDirectory(dirPath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          await this.validateDirectory(fullPath);
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
          await this.validateFile(fullPath);
        }
      }
    } catch (error) {
      this.addIssue('system', 'error', `Failed to read directory ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Validate technical accuracy of a single file
   */
  async validateFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      console.log(`🔍 Validating: ${relativePath}`);
      
      this.validationResults.totalFiles++;
      
      const fileIssues = [];
      
      // Run all validation checks
      this.validateBrowserAPIs(content, relativePath, fileIssues);
      this.validatePermissions(content, relativePath, fileIssues);
      this.validateVersionCompatibility(content, relativePath, fileIssues);
      this.validateCodeExamples(content, relativePath, fileIssues);
      this.validateExternalReferences(content, relativePath, fileIssues);
      this.validateSecurityPractices(content, relativePath, fileIssues);
      
      // Categorize results
      const errors = fileIssues.filter(issue => issue.severity === 'error');
      const warnings = fileIssues.filter(issue => issue.severity === 'warning');
      
      if (errors.length > 0) {
        this.validationResults.failed++;
        console.log(`  ❌ ${errors.length} error(s), ${warnings.length} warning(s)`);
      } else if (warnings.length > 0) {
        this.validationResults.warnings += warnings.length;
        console.log(`  ⚠️  ${warnings.length} warning(s)`);
      } else {
        this.validationResults.passed++;
        console.log(`  ✅ Passed`);
      }
      
      // Add to overall results
      this.validationResults.issues.push(...fileIssues);
      
    } catch (error) {
      this.addIssue(filePath, 'error', `Failed to validate file: ${error.message}`);
    }
  }

  /**
   * Validate browser API usage and references
   */
  validateBrowserAPIs(content, filePath, issues) {
    // Check for deprecated API usage
    Object.entries(this.deprecatedAPIs).forEach(([deprecated, replacement]) => {
      if (content.includes(deprecated)) {
        issues.push({
          file: filePath,
          severity: 'error',
          category: 'deprecated_api',
          message: `Uses deprecated API '${deprecated}'. Replace with '${replacement}'`,
          line: this.findLineNumber(content, deprecated)
        });
      }
    });
    
    // Check for proper API usage patterns
    const apiUsageRegex = /chrome\.(\w+)\.(\w+)/g;
    let match;
    
    while ((match = apiUsageRegex.exec(content)) !== null) {
      const namespace = match[1];
      const method = match[2];
      
      if (this.browserAPIs.chrome[namespace]) {
        if (!this.browserAPIs.chrome[namespace].includes(method)) {
          issues.push({
            file: filePath,
            severity: 'warning',
            category: 'unknown_api',
            message: `Unknown or potentially incorrect API method: chrome.${namespace}.${method}`,
            line: this.findLineNumber(content, match[0])
          });
        }
      } else {
        issues.push({
          file: filePath,
          severity: 'warning',
          category: 'unknown_namespace',
          message: `Unknown API namespace: chrome.${namespace}`,
          line: this.findLineNumber(content, match[0])
        });
      }
    }
    
    // Check for missing error handling in API calls
    const asyncAPIRegex = /chrome\.\w+\.\w+\([^)]*\)/g;
    let apiMatch;
    
    while ((apiMatch = asyncAPIRegex.exec(content)) !== null) {
      const apiCall = apiMatch[0];
      const lineNum = this.findLineNumber(content, apiCall);
      const contextStart = Math.max(0, apiMatch.index - 200);
      const contextEnd = Math.min(content.length, apiMatch.index + 200);
      const context = content.substring(contextStart, contextEnd);
      
      if (!context.includes('try') && !context.includes('catch') && !context.includes('.catch(')) {
        issues.push({
          file: filePath,
          severity: 'warning',
          category: 'missing_error_handling',
          message: `API call '${apiCall}' lacks error handling`,
          line: lineNum
        });
      }
    }
  }

  /**
   * Validate permission requirements and declarations
   */
  validatePermissions(content, filePath, issues) {
    // Extract mentioned permissions
    const permissionRegex = /"([^"]*Tab[^"]*|storage|scripting|webNavigation|cookies|<all_urls>|https?:\/\/[^"]*)"|\b(activeTab|storage|scripting|webNavigation|cookies)\b/g;
    const mentionedPermissions = new Set();
    let match;
    
    while ((match = permissionRegex.exec(content)) !== null) {
      const permission = match[1] || match[2];
      if (permission) {
        mentionedPermissions.add(permission);
      }
    }
    
    // Check if permissions are properly documented
    if (mentionedPermissions.size > 0) {
      const hasPermissionSection = /#{1,6}\s*.*[Pp]ermission/i.test(content);
      
      if (!hasPermissionSection) {
        issues.push({
          file: filePath,
          severity: 'warning',
          category: 'missing_permission_docs',
          message: 'File mentions permissions but lacks a permissions documentation section',
          line: 1
        });
      }
    }
    
    // Validate permission usage patterns
    mentionedPermissions.forEach(permission => {
      if (!this.browserAPIs.permissions.required.includes(permission) && 
          !this.browserAPIs.permissions.optional.includes(permission) &&
          !this.browserAPIs.permissions.host_permissions.some(pattern => 
            permission.includes('://') && (pattern === '<all_urls>' || permission.match(pattern.replace(/\*/g, '.*')))
          )) {
        issues.push({
          file: filePath,
          severity: 'warning',
          category: 'unknown_permission',
          message: `Unknown or potentially incorrect permission: ${permission}`,
          line: this.findLineNumber(content, permission)
        });
      }
    });
  }

  /**
   * Validate version compatibility information
   */
  validateVersionCompatibility(content, filePath, issues) {
    // Check for version references
    const versionRegex = /(?:version|v)[\s:]*(\d+\.\d+\.\d+)/gi;
    let match;
    
    while ((match = versionRegex.exec(content)) !== null) {
      const version = match[1];
      
      // Check if version is current
      if (this.isOutdatedVersion(version)) {
        issues.push({
          file: filePath,
          severity: 'warning',
          category: 'outdated_version',
          message: `References potentially outdated version: ${version}. Current is ${this.extensionVersion}`,
          line: this.findLineNumber(content, match[0])
        });
      }
    }
    
    // Check for browser compatibility information
    const browserRegex = /(Chrome|Firefox)\s+(\d+)/gi;
    let browserMatch;
    
    while ((browserMatch = browserRegex.exec(content)) !== null) {
      const browser = browserMatch[1].toLowerCase();
      const version = parseInt(browserMatch[2]);
      
      if (this.supportedBrowsers[browser]) {
        const minVersion = parseInt(this.supportedBrowsers[browser].min);
        const currentVersion = parseInt(this.supportedBrowsers[browser].current);
        
        if (version < minVersion) {
          issues.push({
            file: filePath,
            severity: 'error',
            category: 'unsupported_browser',
            message: `References unsupported ${browser} version ${version}. Minimum supported is ${minVersion}`,
            line: this.findLineNumber(content, browserMatch[0])
          });
        } else if (version > currentVersion + 5) {
          issues.push({
            file: filePath,
            severity: 'warning',
            category: 'future_browser',
            message: `References future ${browser} version ${version}. Current is ${currentVersion}`,
            line: this.findLineNumber(content, browserMatch[0])
          });
        }
      }
    }
  }

  /**
   * Validate code examples for technical accuracy
   */
  validateCodeExamples(content, filePath, issues) {
    const codeBlockRegex = /```(?:javascript|js|json)\n([\s\S]*?)```/g;
    let match;
    let blockNumber = 0;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      blockNumber++;
      const code = match[1];
      
      // Check for common anti-patterns
      this.validateCodePatterns(code, filePath, blockNumber, issues);
      
      // Check for security issues
      this.validateCodeSecurity(code, filePath, blockNumber, issues);
      
      // Check for performance issues
      this.validateCodePerformance(code, filePath, blockNumber, issues);
    }
  }

  /**
   * Validate code patterns and best practices
   */
  validateCodePatterns(code, filePath, blockNumber, issues) {
    // Check for proper async/await usage
    if (code.includes('async ') && code.includes('.then(')) {
      issues.push({
        file: filePath,
        severity: 'warning',
        category: 'mixed_async_patterns',
        message: `Code block ${blockNumber} mixes async/await with .then() - use consistent pattern`,
        line: this.findLineNumber(code, 'async ')
      });
    }
    
    // Check for proper error handling
    if (code.includes('await ') && !code.includes('try') && !code.includes('catch')) {
      issues.push({
        file: filePath,
        severity: 'warning',
        category: 'missing_error_handling',
        message: `Code block ${blockNumber} uses await without try/catch error handling`,
        line: this.findLineNumber(code, 'await ')
      });
    }
    
    // Check for console.log in production examples
    if (code.includes('console.log') && !code.includes('// Debug') && !code.includes('// Example')) {
      issues.push({
        file: filePath,
        severity: 'warning',
        category: 'debug_code',
        message: `Code block ${blockNumber} contains console.log - consider removing for production examples`,
        line: this.findLineNumber(code, 'console.log')
      });
    }
  }

  /**
   * Validate code security practices
   */
  validateCodeSecurity(code, filePath, blockNumber, issues) {
    // Check for eval usage
    if (code.includes('eval(')) {
      issues.push({
        file: filePath,
        severity: 'error',
        category: 'security_risk',
        message: `Code block ${blockNumber} uses eval() - security risk`,
        line: this.findLineNumber(code, 'eval(')
      });
    }
    
    // Check for innerHTML without sanitization
    if (code.includes('innerHTML') && !code.includes('sanitize') && !code.includes('textContent')) {
      issues.push({
        file: filePath,
        severity: 'warning',
        category: 'xss_risk',
        message: `Code block ${blockNumber} uses innerHTML without sanitization - potential XSS risk`,
        line: this.findLineNumber(code, 'innerHTML')
      });
    }
    
    // Check for hardcoded credentials
    const credentialPatterns = [
      /api[_-]?key\s*[:=]\s*["'][^"']+["']/i,
      /password\s*[:=]\s*["'][^"']+["']/i,
      /token\s*[:=]\s*["'][^"']+["']/i
    ];
    
    credentialPatterns.forEach(pattern => {
      if (pattern.test(code)) {
        issues.push({
          file: filePath,
          severity: 'error',
          category: 'hardcoded_credentials',
          message: `Code block ${blockNumber} contains hardcoded credentials`,
          line: this.findLineNumber(code, pattern.exec(code)[0])
        });
      }
    });
  }

  /**
   * Validate code performance practices
   */
  validateCodePerformance(code, filePath, blockNumber, issues) {
    // Check for synchronous operations in loops
    if (code.includes('for ') && code.includes('await ') && !code.includes('Promise.all')) {
      issues.push({
        file: filePath,
        severity: 'warning',
        category: 'performance_issue',
        message: `Code block ${blockNumber} uses await in loop - consider Promise.all for parallel execution`,
        line: this.findLineNumber(code, 'for ')
      });
    }
    
    // Check for inefficient DOM queries
    if (code.includes('document.querySelector') && code.includes('for ')) {
      issues.push({
        file: filePath,
        severity: 'warning',
        category: 'performance_issue',
        message: `Code block ${blockNumber} may have inefficient DOM queries in loop`,
        line: this.findLineNumber(code, 'document.querySelector')
      });
    }
  }

  /**
   * Validate external references and links
   */
  validateExternalReferences(content, filePath, issues) {
    // Check for outdated external links
    const outdatedDomains = [
      'developer.chrome.com/extensions', // Old extension docs
      'developer.mozilla.org/en-US/Add-ons/WebExtensions' // Old WebExtensions docs
    ];
    
    outdatedDomains.forEach(domain => {
      if (content.includes(domain)) {
        issues.push({
          file: filePath,
          severity: 'warning',
          category: 'outdated_reference',
          message: `References potentially outdated documentation: ${domain}`,
          line: this.findLineNumber(content, domain)
        });
      }
    });
    
    // Check for broken internal references
    const internalLinkRegex = /\[([^\]]+)\]\(([^)]+\.md[^)]*)\)/g;
    let match;
    
    while ((match = internalLinkRegex.exec(content)) !== null) {
      const linkPath = match[2];
      
      // Basic validation - more comprehensive link checking would require file system access
      if (linkPath.includes('..') && linkPath.split('../').length > 3) {
        issues.push({
          file: filePath,
          severity: 'warning',
          category: 'complex_link',
          message: `Complex relative link may be fragile: ${linkPath}`,
          line: this.findLineNumber(content, match[0])
        });
      }
    }
  }

  /**
   * Validate security practices documentation
   */
  validateSecurityPractices(content, filePath, issues) {
    // Check if security considerations are mentioned when needed
    const securityKeywords = ['permission', 'API', 'script', 'injection', 'XSS', 'CSRF'];
    const hasSecurityKeywords = securityKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (hasSecurityKeywords) {
      const hasSecuritySection = /#{1,6}\s*.*[Ss]ecurity/i.test(content);
      
      if (!hasSecuritySection) {
        issues.push({
          file: filePath,
          severity: 'warning',
          category: 'missing_security_docs',
          message: 'File discusses security-sensitive topics but lacks security considerations section',
          line: 1
        });
      }
    }
  }

  /**
   * Check if a version is outdated
   */
  isOutdatedVersion(version) {
    const [major, minor, patch] = version.split('.').map(Number);
    const [currentMajor, currentMinor, currentPatch] = this.extensionVersion.split('.').map(Number);
    
    if (major < currentMajor) return true;
    if (major === currentMajor && minor < currentMinor) return true;
    if (major === currentMajor && minor === currentMinor && patch < currentPatch) return true;
    
    return false;
  }

  /**
   * Find line number of text in content
   */
  findLineNumber(content, searchText) {
    const index = content.indexOf(searchText);
    if (index === -1) return 1;
    
    return content.substring(0, index).split('\n').length;
  }

  /**
   * Add issue to results
   */
  addIssue(file, severity, message) {
    this.validationResults.issues.push({
      file,
      severity,
      category: 'system',
      message,
      line: 1
    });
    
    if (severity === 'error') {
      this.validationResults.failed++;
    } else {
      this.validationResults.warnings++;
    }
  }

  /**
   * Print validation summary
   */
  printValidationSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('🔬 TECHNICAL ACCURACY VALIDATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`📁 Total Files: ${this.validationResults.totalFiles}`);
    console.log(`✅ Passed: ${this.validationResults.passed}`);
    console.log(`❌ Failed: ${this.validationResults.failed}`);
    console.log(`⚠️  Warnings: ${this.validationResults.warnings}`);
    
    // Group issues by category
    const issuesByCategory = {};
    this.validationResults.issues.forEach(issue => {
      if (!issuesByCategory[issue.category]) {
        issuesByCategory[issue.category] = [];
      }
      issuesByCategory[issue.category].push(issue);
    });
    
    if (Object.keys(issuesByCategory).length > 0) {
      console.log('\n📊 Issues by Category:');
      Object.entries(issuesByCategory).forEach(([category, issues]) => {
        const errors = issues.filter(i => i.severity === 'error').length;
        const warnings = issues.filter(i => i.severity === 'warning').length;
        console.log(`  • ${category}: ${errors} errors, ${warnings} warnings`);
      });
    }
    
    const successRate = this.validationResults.totalFiles > 0 
      ? ((this.validationResults.passed / this.validationResults.totalFiles) * 100).toFixed(1)
      : '0';
    
    console.log(`\n📈 Success Rate: ${successRate}%`);
    
    if (this.validationResults.failed === 0) {
      console.log('\n🎉 All documentation is technically accurate!');
    } else {
      console.log('\n🔧 Please address the technical accuracy issues above.');
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new TechnicalAccuracyValidator();
  
  validator.validateTechnicalAccuracy()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Technical validation failed:', error);
      process.exit(1);
    });
}

export default TechnicalAccuracyValidator;