#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Maintenance Runner for Agentic WorkFlow Documentation
 * Orchestrates various maintenance tasks and provides a unified interface
 */

class MaintenanceRunner {
  constructor() {
    this.tasks = new Map();
    this.results = [];
    this.setupTasks();
  }

  /**
   * Setup available maintenance tasks
   */
  setupTasks() {
    this.tasks.set('content-analysis', {
      name: 'Content Analysis',
      description: 'Analyze content structure and identify issues',
      script: 'content-analysis.js',
      frequency: 'weekly',
      critical: false
    });

    this.tasks.set('cross-reference-validation', {
      name: 'Cross-Reference Validation',
      description: 'Validate internal links and navigation consistency',
      script: 'cross-reference-validation.js',
      frequency: 'daily',
      critical: true
    });

    this.tasks.set('build-validation', {
      name: 'Build Validation',
      description: 'Test site build process and deployment readiness',
      script: 'build-validation.js',
      frequency: 'daily',
      critical: true
    });

    this.tasks.set('technical-accuracy', {
      name: 'Technical Accuracy Review',
      description: 'Verify technical content accuracy and completeness',
      script: 'technical-accuracy-review.js',
      frequency: 'weekly',
      critical: false
    });

    this.tasks.set('link-checker', {
      name: 'Link Checker',
      description: 'Check all external and internal links',
      script: 'link-checker.js',
      frequency: 'weekly',
      critical: false
    });

    this.tasks.set('frontmatter-fix', {
      name: 'Frontmatter Fix',
      description: 'Fix frontmatter issues and missing metadata',
      script: 'fix-frontmatter-issues.js',
      frequency: 'as-needed',
      critical: false
    });

    this.tasks.set('comprehensive-validation', {
      name: 'Comprehensive Validation',
      description: 'Run all validation checks in sequence',
      script: 'comprehensive-validation.js',
      frequency: 'monthly',
      critical: false
    });
  }

  /**
   * Run maintenance tasks
   */
  async run(options = {}) {
    const {
      tasks = [],
      frequency = null,
      criticalOnly = false,
      dryRun = false
    } = options;

    console.log('🔧 Agentic WorkFlow Documentation Maintenance');
    console.log('====================================================\n');

    // Determine which tasks to run
    const tasksToRun = this.selectTasks(tasks, frequency, criticalOnly);

    if (tasksToRun.length === 0) {
      console.log('❌ No tasks selected to run.');
      return false;
    }

    console.log(`📋 Running ${tasksToRun.length} maintenance tasks...\n`);

    // Run tasks
    for (const taskId of tasksToRun) {
      await this.runTask(taskId, dryRun);
    }

    // Generate summary report
    this.generateSummaryReport();

    // Return success status
    return this.results.every(result => result.success);
  }

  /**
   * Select tasks based on criteria
   */
  selectTasks(requestedTasks, frequency, criticalOnly) {
    let tasksToRun = [];

    if (requestedTasks.length > 0) {
      // Run specific requested tasks
      tasksToRun = requestedTasks.filter(taskId => this.tasks.has(taskId));
    } else if (frequency) {
      // Run tasks by frequency
      tasksToRun = Array.from(this.tasks.entries())
        .filter(([, task]) => task.frequency === frequency)
        .map(([taskId]) => taskId);
    } else if (criticalOnly) {
      // Run only critical tasks
      tasksToRun = Array.from(this.tasks.entries())
        .filter(([, task]) => task.critical)
        .map(([taskId]) => taskId);
    } else {
      // Run all tasks
      tasksToRun = Array.from(this.tasks.keys());
    }

    return tasksToRun;
  }

  /**
   * Run a single maintenance task
   */
  async runTask(taskId, dryRun = false) {
    const task = this.tasks.get(taskId);
    if (!task) {
      console.log(`❌ Unknown task: ${taskId}`);
      return;
    }

    console.log(`🔄 Running: ${task.name}`);
    console.log(`   ${task.description}`);

    if (dryRun) {
      console.log('   🔍 DRY RUN - Task would execute but no changes made');
      this.results.push({
        taskId,
        name: task.name,
        success: true,
        dryRun: true,
        duration: 0
      });
      return;
    }

    const startTime = Date.now();
    let success = false;
    let error = null;

    try {
      const scriptPath = path.join(__dirname, task.script);
      
      if (!fs.existsSync(scriptPath)) {
        throw new Error(`Script not found: ${task.script}`);
      }

      // Run the maintenance script
      execSync(`node ${scriptPath}`, {
        cwd: rootDir,
        stdio: 'pipe'
      });

      success = true;
      console.log('   ✅ Completed successfully');

    } catch (err) {
      error = err.message;
      console.log('   ❌ Failed with error');
      console.log(`   Error: ${error}`);
    }

    const duration = Date.now() - startTime;

    this.results.push({
      taskId,
      name: task.name,
      success,
      error,
      duration,
      dryRun: false
    });

    console.log(`   ⏱️  Duration: ${duration}ms\n`);
  }

  /**
   * Generate summary report
   */
  generateSummaryReport() {
    console.log('📊 Maintenance Summary Report');
    console.log('=============================\n');

    const totalTasks = this.results.length;
    const successfulTasks = this.results.filter(r => r.success).length;
    const failedTasks = this.results.filter(r => !r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`📈 Overall Statistics:`);
    console.log(`   Total tasks: ${totalTasks}`);
    console.log(`   Successful: ${successfulTasks}`);
    console.log(`   Failed: ${failedTasks}`);
    console.log(`   Total duration: ${totalDuration}ms`);
    console.log();

    if (failedTasks > 0) {
      console.log('❌ Failed Tasks:');
      this.results
        .filter(r => !r.success)
        .forEach(result => {
          console.log(`   - ${result.name}: ${result.error}`);
        });
      console.log();
    }

    if (successfulTasks > 0) {
      console.log('✅ Successful Tasks:');
      this.results
        .filter(r => r.success)
        .forEach(result => {
          const status = result.dryRun ? '(DRY RUN)' : '';
          console.log(`   - ${result.name} ${status}`);
        });
      console.log();
    }

    // Save detailed report
    this.saveDetailedReport();

    // Overall status
    if (failedTasks === 0) {
      console.log('🎉 All maintenance tasks completed successfully!');
    } else {
      console.log('⚠️  Some maintenance tasks failed. Please review the errors above.');
    }
  }

  /**
   * Save detailed report to file
   */
  saveDetailedReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(rootDir, `maintenance-report-${timestamp}.json`);

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTasks: this.results.length,
        successful: this.results.filter(r => r.success).length,
        failed: this.results.filter(r => !r.success).length,
        totalDuration: this.results.reduce((sum, r) => sum + r.duration, 0)
      },
      tasks: this.results,
      availableTasks: Array.from(this.tasks.entries()).map(([id, task]) => ({
        id,
        ...task
      }))
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`💾 Detailed report saved to: ${reportPath}`);
  }

  /**
   * List available tasks
   */
  listTasks() {
    console.log('📋 Available Maintenance Tasks');
    console.log('==============================\n');

    const tasksByFrequency = {};
    for (const [taskId, task] of this.tasks) {
      if (!tasksByFrequency[task.frequency]) {
        tasksByFrequency[task.frequency] = [];
      }
      tasksByFrequency[task.frequency].push({ taskId, ...task });
    }

    for (const [frequency, tasks] of Object.entries(tasksByFrequency)) {
      console.log(`${this.getFrequencyIcon(frequency)} ${frequency.toUpperCase()}`);
      console.log('-'.repeat(30));
      
      for (const task of tasks) {
        const criticalBadge = task.critical ? '🔴 CRITICAL' : '';
        console.log(`  ${task.name} ${criticalBadge}`);
        console.log(`    ID: ${task.taskId}`);
        console.log(`    Description: ${task.description}`);
        console.log(`    Script: ${task.script}`);
        console.log();
      }
    }
  }

  /**
   * Get icon for frequency
   */
  getFrequencyIcon(frequency) {
    const icons = {
      'daily': '📅',
      'weekly': '📆',
      'monthly': '🗓️',
      'as-needed': '🔧'
    };
    return icons[frequency] || '📋';
  }
}

// CLI Interface
function showHelp() {
  console.log(`
Agentic WorkFlow Documentation Maintenance Runner

Usage:
  node maintenance-runner.js [options]

Options:
  --tasks <task1,task2>     Run specific tasks (comma-separated)
  --frequency <freq>        Run tasks by frequency (daily|weekly|monthly|as-needed)
  --critical               Run only critical tasks
  --dry-run                Show what would be done without executing
  --list                   List all available tasks
  --help                   Show this help message

Examples:
  node maintenance-runner.js --critical
  node maintenance-runner.js --frequency daily
  node maintenance-runner.js --tasks cross-reference-validation,build-validation
  node maintenance-runner.js --dry-run --frequency weekly
  node maintenance-runner.js --list
`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const runner = new MaintenanceRunner();

  // Parse command line arguments
  const options = {};
  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    switch (arg) {
      case '--help':
        showHelp();
        process.exit(0);
        break;

      case '--list':
        runner.listTasks();
        process.exit(0);
        break;

      case '--tasks':
        if (i + 1 < args.length) {
          options.tasks = args[i + 1].split(',').map(t => t.trim());
          i++;
        }
        break;

      case '--frequency':
        if (i + 1 < args.length) {
          options.frequency = args[i + 1];
          i++;
        }
        break;

      case '--critical':
        options.criticalOnly = true;
        break;

      case '--dry-run':
        options.dryRun = true;
        break;

      default:
        console.log(`Unknown option: ${arg}`);
        showHelp();
        process.exit(1);
    }

    i++;
  }

  // Run maintenance
  runner.run(options)
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Maintenance runner failed:', error);
      process.exit(1);
    });
}

export default MaintenanceRunner;