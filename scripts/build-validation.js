#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Build validation for Agentic WorkFlow documentation
 * Tests the site build process and validates deployment readiness
 */

class BuildValidator {
  constructor() {
    this.issues = [];
    this.buildOutput = '';
    this.distDir = path.join(rootDir, 'dist');
  }

  /**
   * Main validation function
   */
  async validate() {
    console.log('🏗️  Starting build validation...\n');
    
    try {
      // Step 1: Clean previous build
      await this.cleanBuild();
      
      // Step 2: Run build process
      await this.runBuild();
      
      // Step 3: Validate build output
      await this.validateBuildOutput();
      
      // Step 4: Check for build warnings/errors
      await this.analyzeBuildOutput();
      
      // Step 5: Validate critical files
      await this.validateCriticalFiles();
      
      // Step 6: Check asset optimization
      await this.validateAssetOptimization();
      
      // Generate report
      this.generateReport();
      
      return this.issues.length === 0;
      
    } catch (error) {
      console.error('❌ Build validation failed:', error.message);
      this.issues.push({
        type: 'build-failure',
        severity: 'error',
        message: `Build process failed: ${error.message}`
      });
      return false;
    }
  }

  /**
   * Clean previous build
   */
  async cleanBuild() {
    console.log('🧹 Cleaning previous build...');
    
    if (fs.existsSync(this.distDir)) {
      fs.rmSync(this.distDir, { recursive: true, force: true });
    }
    
    console.log('   ✅ Build directory cleaned');
  }

  /**
   * Run build process
   */
  async runBuild() {
    console.log('🔨 Running build process...');
    
    try {
      // Use bun build as specified in the tech stack
      this.buildOutput = execSync('bun run build', {
        cwd: rootDir,
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      console.log('   ✅ Build completed successfully');
      
    } catch (error) {
      console.log('   ❌ Build failed');
      throw new Error(`Build command failed: ${error.message}`);
    }
  }

  /**
   * Validate build output directory
   */
  async validateBuildOutput() {
    console.log('📁 Validating build output...');
    
    if (!fs.existsSync(this.distDir)) {
      this.issues.push({
        type: 'missing-dist',
        severity: 'error',
        message: 'Build output directory (dist) not found'
      });
      return;
    }
    
    // Check if dist directory has content
    const distContents = fs.readdirSync(this.distDir);
    if (distContents.length === 0) {
      this.issues.push({
        type: 'empty-dist',
        severity: 'error',
        message: 'Build output directory is empty'
      });
      return;
    }
    
    console.log(`   ✅ Build output contains ${distContents.length} items`);
  }

  /**
   * Analyze build output for warnings and errors
   */
  async analyzeBuildOutput() {
    console.log('🔍 Analyzing build output...');
    
    // Check for common build warnings
    const warnings = [];
    const errors = [];
    
    const lines = this.buildOutput.split('\n');
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('warning') || lowerLine.includes('warn')) {
        warnings.push(line.trim());
      }
      
      if (lowerLine.includes('error') && !lowerLine.includes('0 errors')) {
        errors.push(line.trim());
      }
    }
    
    // Report warnings
    if (warnings.length > 0) {
      this.issues.push({
        type: 'build-warnings',
        severity: 'warning',
        message: `Build completed with ${warnings.length} warnings`,
        details: warnings
      });
    }
    
    // Report errors (if any made it through)
    if (errors.length > 0) {
      this.issues.push({
        type: 'build-errors',
        severity: 'error',
        message: `Build output contains ${errors.length} errors`,
        details: errors
      });
    }
    
    if (warnings.length === 0 && errors.length === 0) {
      console.log('   ✅ No build warnings or errors detected');
    } else {
      console.log(`   ⚠️  Found ${warnings.length} warnings and ${errors.length} errors`);
    }
  }

  /**
   * Validate critical files exist in build
   */
  async validateCriticalFiles() {
    console.log('📄 Validating critical files...');
    
    const criticalFiles = [
      'index.html',
      '_astro',
      'usage/index.html',
      'integration/index.html',
      'advanced-ai/index.html',
      'learning/index.html'
    ];
    
    for (const file of criticalFiles) {
      const filePath = path.join(this.distDir, file);
      
      if (!fs.existsSync(filePath)) {
        this.issues.push({
          type: 'missing-critical-file',
          severity: 'error',
          message: `Critical file missing from build: ${file}`,
          file: file
        });
      }
    }
    
    // Check for favicon
    const faviconPath = path.join(this.distDir, 'favicon.ico');
    const faviconSvgPath = path.join(this.distDir, 'favicon.svg');
    
    if (!fs.existsSync(faviconPath) && !fs.existsSync(faviconSvgPath)) {
      this.issues.push({
        type: 'missing-favicon',
        severity: 'warning',
        message: 'Favicon not found in build output'
      });
    }
    
    console.log('   ✅ Critical files validation completed');
  }

  /**
   * Validate asset optimization
   */
  async validateAssetOptimization() {
    console.log('🖼️  Validating asset optimization...');
    
    const astroDir = path.join(this.distDir, '_astro');
    
    if (!fs.existsSync(astroDir)) {
      this.issues.push({
        type: 'missing-assets',
        severity: 'warning',
        message: 'Astro assets directory not found'
      });
      return;
    }
    
    const assetFiles = fs.readdirSync(astroDir);
    
    // Check for CSS files
    const cssFiles = assetFiles.filter(f => f.endsWith('.css'));
    if (cssFiles.length === 0) {
      this.issues.push({
        type: 'missing-css',
        severity: 'warning',
        message: 'No CSS files found in build assets'
      });
    }
    
    // Check for JS files
    const jsFiles = assetFiles.filter(f => f.endsWith('.js'));
    if (jsFiles.length === 0) {
      this.issues.push({
        type: 'missing-js',
        severity: 'warning',
        message: 'No JavaScript files found in build assets'
      });
    }
    
    // Check for large unoptimized files
    for (const file of assetFiles) {
      const filePath = path.join(astroDir, file);
      const stats = fs.statSync(filePath);
      const sizeInMB = stats.size / (1024 * 1024);
      
      if (sizeInMB > 5) {
        this.issues.push({
          type: 'large-asset',
          severity: 'warning',
          message: `Large asset file detected: ${file} (${sizeInMB.toFixed(2)}MB)`,
          file: file,
          size: sizeInMB
        });
      }
    }
    
    console.log(`   ✅ Found ${cssFiles.length} CSS and ${jsFiles.length} JS files`);
  }

  /**
   * Generate validation report
   */
  generateReport() {
    console.log('\n📊 Build Validation Report');
    console.log('==========================\n');
    
    if (this.issues.length === 0) {
      console.log('✅ Build validation passed! Site is ready for deployment.\n');
      return;
    }
    
    // Group issues by type
    const issuesByType = {};
    for (const issue of this.issues) {
      if (!issuesByType[issue.type]) {
        issuesByType[issue.type] = [];
      }
      issuesByType[issue.type].push(issue);
    }
    
    // Report by type
    for (const [type, issues] of Object.entries(issuesByType)) {
      console.log(`\n${this.getTypeIcon(type)} ${this.getTypeTitle(type)} (${issues.length})`);
      console.log('-'.repeat(50));
      
      for (const issue of issues) {
        console.log(`  ${this.getSeverityIcon(issue.severity)} ${issue.message}`);
        
        if (issue.file) {
          console.log(`    File: ${issue.file}`);
        }
        
        if (issue.size) {
          console.log(`    Size: ${issue.size.toFixed(2)}MB`);
        }
        
        if (issue.details && issue.details.length > 0) {
          console.log('    Details:');
          for (const detail of issue.details.slice(0, 5)) {
            console.log(`      - ${detail}`);
          }
          if (issue.details.length > 5) {
            console.log(`      ... and ${issue.details.length - 5} more`);
          }
        }
        console.log();
      }
    }
    
    // Summary
    const errors = this.issues.filter(i => i.severity === 'error').length;
    const warnings = this.issues.filter(i => i.severity === 'warning').length;
    
    console.log('\n📈 Summary');
    console.log('-'.repeat(20));
    console.log(`Total issues: ${this.issues.length}`);
    console.log(`Errors: ${errors}`);
    console.log(`Warnings: ${warnings}`);
    
    if (errors > 0) {
      console.log('\n❌ Build validation failed. Please fix the errors above.');
    } else if (warnings > 0) {
      console.log('\n⚠️  Build validation completed with warnings. Review recommended.');
    }
    
    // Save detailed report
    this.saveDetailedReport();
  }

  /**
   * Save detailed report to file
   */
  saveDetailedReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(rootDir, `scripts/reports/build-validation-${timestamp}.json`);
    
    const report = {
      timestamp: new Date().toISOString(),
      buildOutput: this.buildOutput,
      summary: {
        totalIssues: this.issues.length,
        errors: this.issues.filter(i => i.severity === 'error').length,
        warnings: this.issues.filter(i => i.severity === 'warning').length
      },
      issues: this.issues
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed report saved to: ${reportPath}`);
  }

  /**
   * Get icon for issue type
   */
  getTypeIcon(type) {
    const icons = {
      'build-failure': '💥',
      'missing-dist': '📁',
      'empty-dist': '📂',
      'build-warnings': '⚠️',
      'build-errors': '❌',
      'missing-critical-file': '📄',
      'missing-favicon': '🖼️',
      'missing-assets': '🎨',
      'missing-css': '🎨',
      'missing-js': '⚙️',
      'large-asset': '📦'
    };
    return icons[type] || '❓';
  }

  /**
   * Get title for issue type
   */
  getTypeTitle(type) {
    const titles = {
      'build-failure': 'Build Failures',
      'missing-dist': 'Missing Distribution Directory',
      'empty-dist': 'Empty Distribution Directory',
      'build-warnings': 'Build Warnings',
      'build-errors': 'Build Errors',
      'missing-critical-file': 'Missing Critical Files',
      'missing-favicon': 'Missing Favicon',
      'missing-assets': 'Missing Assets',
      'missing-css': 'Missing CSS Files',
      'missing-js': 'Missing JavaScript Files',
      'large-asset': 'Large Asset Files'
    };
    return titles[type] || type;
  }

  /**
   * Get icon for severity
   */
  getSeverityIcon(severity) {
    return severity === 'error' ? '❌' : '⚠️';
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new BuildValidator();
  
  validator.validate()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Build validation failed with error:', error);
      process.exit(1);
    });
}

export default BuildValidator;