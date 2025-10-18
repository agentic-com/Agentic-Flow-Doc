#!/usr/bin/env node

import { ContentAnalyzer } from "./content-analysis.js";
import { PatternDetector } from "./pattern-detection.js";
import { ValidationFramework } from "./validation-framework.js";
import { writeFile } from "fs/promises";

/**
 * Content Transformation Orchestrator
 * Main script that coordinates content analysis, pattern detection, and validation
 */

class ContentTransformationOrchestrator {
  constructor() {
    this.analyzer = new ContentAnalyzer();
    this.detector = new PatternDetector();
    this.validator = new ValidationFramework();
    this.results = {
      analysis: null,
      patterns: null,
      validation: null,
      summary: null,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Run complete content transformation analysis
   */
  async runCompleteAnalysis() {
    console.log("🚀 Starting Complete Content Transformation Analysis");
    console.log("=".repeat(60));

    try {
      // Step 1: Content Analysis
      console.log("\n📊 Step 1: Content Inventory and Analysis");
      this.results.analysis = await this.analyzer.scanDocumentation();
      this.analyzer.generateReport();

      // Step 2: Pattern Detection
      console.log("\n🔍 Step 2: Pattern Detection and Transformation Planning");
      const filePaths = this.results.analysis.inventory.map(
        (item) => item.path
      );
      this.results.patterns = await this.detector.batchDetection(filePaths);
      this.detector.generatePatternReport(this.results.patterns);

      // Step 3: Validation
      console.log("\n✅ Step 3: Content Validation");
      this.results.validation = await this.validator.validateDocumentation();

      // Step 4: Generate comprehensive summary
      console.log("\n📋 Step 4: Generating Comprehensive Summary");
      this.results.summary = this.generateComprehensiveSummary();
      this.displaySummary();

      // Export all results
      await this.exportAllResults();

      console.log("\n🎉 Content transformation analysis complete!");
      return this.results;
    } catch (error) {
      console.error("❌ Analysis failed:", error);
      throw error;
    }
  }

  /**
   * Generate comprehensive summary of all analysis results
   */
  generateComprehensiveSummary() {
    const { analysis, patterns, validation } = this.results;

    const summary = {
      overview: {
        totalFiles: analysis.statistics.totalFiles,
        markdownFiles: analysis.statistics.markdownFiles,
        analysisDate: new Date().toISOString(),
      },

      priorities: {
        high: analysis.statistics.highPriority,
        medium: analysis.statistics.mediumPriority,
        low: analysis.statistics.lowPriority,
      },

      transformationNeeds: {
        filesWithN8nReferences: patterns.filter(
          (p) => p.n8nReferences.length > 0
        ).length,
        filesWithServerContent: patterns.filter(
          (p) => p.serverSpecificContent.length > 0
        ).length,
        filesWithBrowserNodes: patterns.filter(
          (p) => p.browserExtensionContent.length > 0
        ).length,
        criticalPriority: patterns.filter((p) => p.priority === "critical")
          .length,
        highPriority: patterns.filter((p) => p.priority === "high").length,
      },

      validationStatus: {
        passedValidation: validation.summary.passedValidation,
        failedValidation: validation.summary.failedValidation,
        totalErrors: validation.summary.errors,
        totalWarnings: validation.summary.warnings,
        successRate: (
          (validation.summary.passedValidation /
            validation.summary.totalFiles) *
          100
        ).toFixed(1),
      },

      recommendations: this.generateRecommendations(),

      nextSteps: this.generateNextSteps(),
    };

    return summary;
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations() {
    const { analysis, patterns, validation } = this.results;
    const recommendations = [];

    // Priority-based recommendations
    if (analysis.statistics.highPriority > 10) {
      recommendations.push({
        type: "priority",
        level: "high",
        message: `${analysis.statistics.highPriority} high-priority files need immediate attention`,
        action:
          "Start with landing pages, getting started guides, and main integration docs",
      });
    }

    // Pattern-based recommendations
    const heavyN8nFiles = patterns.filter((p) => p.n8nReferences.length > 10);
    if (heavyN8nFiles.length > 0) {
      recommendations.push({
        type: "content",
        level: "high",
        message: `${heavyN8nFiles.length} files have extensive n8n references`,
        action: "Use automated replacement tools with careful manual review",
      });
    }

    const serverHeavyFiles = patterns.filter(
      (p) => p.serverSpecificContent.length > 5
    );
    if (serverHeavyFiles.length > 0) {
      recommendations.push({
        type: "content",
        level: "medium",
        message: `${serverHeavyFiles.length} files are heavily server-focused`,
        action: "Consider complete rewrite for browser extension context",
      });
    }

    // Validation-based recommendations
    if (
      validation.summary.failedValidation > validation.summary.passedValidation
    ) {
      recommendations.push({
        type: "quality",
        level: "high",
        message: "More files failed validation than passed",
        action:
          "Address systematic issues before proceeding with transformations",
      });
    }

    // Browser extension readiness
    const browserReadyFiles = patterns.filter(
      (p) => p.browserExtensionContent.length > 0
    );
    if (browserReadyFiles.length > 0) {
      recommendations.push({
        type: "opportunity",
        level: "medium",
        message: `${browserReadyFiles.length} files already contain browser extension content`,
        action: "These files can be enhanced rather than completely rewritten",
      });
    }

    return recommendations;
  }

  /**
   * Generate next steps based on analysis
   */
  generateNextSteps() {
    const { analysis, patterns } = this.results;

    const steps = [
      {
        phase: "Immediate (Week 1)",
        tasks: [
          "Address high-priority files identified in analysis",
          "Update main landing pages and navigation",
          "Transform getting started documentation",
          "Update product terminology globally",
        ],
      },
      {
        phase: "Short-term (Weeks 2-3)",
        tasks: [
          "Transform integration documentation for browser context",
          "Update browser extension node documentation",
          "Remove or adapt server-specific content",
          "Update code examples for browser compatibility",
        ],
      },
      {
        phase: "Medium-term (Weeks 4-6)",
        tasks: [
          "Transform advanced AI documentation",
          "Create browser-specific workflow examples",
          "Update learning materials and tutorials",
          "Implement comprehensive validation fixes",
        ],
      },
      {
        phase: "Long-term (Ongoing)",
        tasks: [
          "Establish content maintenance processes",
          "Create guidelines for future updates",
          "Monitor and improve content quality",
          "Gather user feedback and iterate",
        ],
      },
    ];

    return steps;
  }

  /**
   * Display comprehensive summary
   */
  displaySummary() {
    const { summary } = this.results;

    console.log("\n🎯 COMPREHENSIVE TRANSFORMATION SUMMARY");
    console.log("=".repeat(60));

    console.log("\n📊 Overview:");
    console.log(`  Total Files: ${summary.overview.totalFiles}`);
    console.log(`  Markdown Files: ${summary.overview.markdownFiles}`);

    console.log("\n🎯 Priority Distribution:");
    console.log(`  High Priority: ${summary.priorities.high} files`);
    console.log(`  Medium Priority: ${summary.priorities.medium} files`);
    console.log(`  Low Priority: ${summary.priorities.low} files`);

    console.log("\n🔄 Transformation Needs:");
    console.log(
      `  Files with n8n References: ${summary.transformationNeeds.filesWithN8nReferences}`
    );
    console.log(
      `  Files with Server Content: ${summary.transformationNeeds.filesWithServerContent}`
    );
    console.log(
      `  Files with Browser Nodes: ${summary.transformationNeeds.filesWithBrowserNodes}`
    );
    console.log(
      `  Critical Priority: ${summary.transformationNeeds.criticalPriority}`
    );
    console.log(`  High Priority: ${summary.transformationNeeds.highPriority}`);

    console.log("\n✅ Validation Status:");
    console.log(
      `  Passed Validation: ${summary.validationStatus.passedValidation}`
    );
    console.log(
      `  Failed Validation: ${summary.validationStatus.failedValidation}`
    );
    console.log(`  Total Errors: ${summary.validationStatus.totalErrors}`);
    console.log(`  Total Warnings: ${summary.validationStatus.totalWarnings}`);
    console.log(`  Success Rate: ${summary.validationStatus.successRate}%`);

    console.log("\n💡 Key Recommendations:");
    summary.recommendations.forEach((rec, index) => {
      console.log(
        `  ${index + 1}. [${rec.level.toUpperCase()}] ${rec.message}`
      );
      console.log(`     Action: ${rec.action}`);
    });

    console.log("\n📋 Next Steps:");
    summary.nextSteps.forEach((phase) => {
      console.log(`\n  ${phase.phase}:`);
      phase.tasks.forEach((task) => {
        console.log(`    • ${task}`);
      });
    });
  }

  /**
   * Export all results to files
   */
  async exportAllResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    // Export individual results
    await writeFile(
      `scripts/reports/content-analysis-${timestamp}.json`,
      JSON.stringify(this.results.analysis, null, 2)
    );

    await writeFile(
      `scripts/reports/pattern-detection-${timestamp}.json`,
      JSON.stringify(this.results.patterns, null, 2)
    );

    await writeFile(
      `scripts/reports/validation-results-${timestamp}.json`,
      JSON.stringify(this.results.validation, null, 2)
    );

    // Export comprehensive results
    await writeFile(
      `scripts/reports/transformation-analysis-complete-${timestamp}.json`,
      JSON.stringify(this.results, null, 2)
    );

    console.log(`\n💾 All results exported with timestamp: ${timestamp}`);
  }

  /**
   * Get files by priority for targeted processing
   */
  getFilesByPriority(priority = "high") {
    if (!this.results.analysis) {
      throw new Error("Analysis must be run first");
    }

    return this.results.analysis.inventory
      .filter((file) => file.transformationPriority === priority)
      .sort((a, b) => {
        // Sort by n8n references count (descending)
        return b.n8nReferences.length - a.n8nReferences.length;
      });
  }

  /**
   * Get validation issues by severity
   */
  getValidationIssues(severity = "error") {
    if (!this.results.validation) {
      throw new Error("Validation must be run first");
    }

    return this.results.validation.validationResults
      .filter((result) =>
        severity === "error"
          ? result.errors.length > 0
          : result.warnings.length > 0
      )
      .map((result) => ({
        file: result.filePath,
        issues: severity === "error" ? result.errors : result.warnings,
      }));
  }
}

// Export for use in other modules
export { ContentTransformationOrchestrator };

// Run complete analysis if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const orchestrator = new ContentTransformationOrchestrator();

  orchestrator
    .runCompleteAnalysis()
    .then((results) => {
      console.log(
        "\n✨ Analysis complete! Check the exported JSON files for detailed results."
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Analysis failed:", error);
      process.exit(1);
    });
}
