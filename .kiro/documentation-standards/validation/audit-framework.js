#!/usr/bin/env node

/**
 * Documentation Audit Framework
 *
 * Comprehensive framework for auditing and validating builtin node documentation.
 * Provides systematic evaluation, priority assessment, and actionable recommendations.
 */

import BuiltinNodesAuditor from "./builtin-nodes-auditor.js";
import ContentValidator from "./content-validator.js";
import fs from "fs/promises";
import path from "path";

class DocumentationAuditFramework {
  constructor() {
    this.auditResults = {
      timestamp: new Date().toISOString(),
      framework_version: "1.0.0",
      audit_scope: "builtin_nodes_comprehensive",
      summary: {
        total_files: 0,
        audit_passed: 0,
        validation_passed: 0,
        critical_issues: 0,
        high_priority_files: 0,
        recommendations_count: 0,
      },
      audits: {
        builtin_nodes: null,
        content_validation: null,
      },
      consolidated_recommendations: [],
      implementation_plan: {
        phases: [],
        timeline: null,
        resource_requirements: null,
      },
    };
  }

  /**
   * Run comprehensive audit framework
   */
  async runComprehensiveAudit() {
    console.log("🚀 Starting Documentation Audit Framework\n");
    console.log("=".repeat(70));
    console.log("Comprehensive evaluation of builtin node documentation");
    console.log("Establishing foundation for systematic enhancement");
    console.log("=".repeat(70) + "\n");

    try {
      // Phase 1: Builtin Nodes Specialized Audit
      console.log("📋 Phase 1: Builtin Nodes Specialized Audit");
      console.log("-".repeat(50));
      const builtinAuditor = new BuiltinNodesAuditor();
      this.auditResults.audits.builtin_nodes =
        await builtinAuditor.auditAllBuiltinNodes();

      console.log("\n📋 Phase 2: Content Structure Validation");
      console.log("-".repeat(50));
      const contentValidator = new ContentValidator();
      this.auditResults.audits.content_validation =
        await contentValidator.validateAllContent();

      // Consolidate results
      this.consolidateResults();

      // Generate implementation plan
      this.generateImplementationPlan();

      // Generate comprehensive report
      await this.generateFrameworkReport();

      // Print executive summary
      this.printExecutiveSummary();

      return this.auditResults;
    } catch (error) {
      console.error("❌ Audit framework failed:", error);
      throw error;
    }
  }

  /**
   * Consolidate results from all audit tools
   */
  consolidateResults() {
    const builtinAudit = this.auditResults.audits.builtin_nodes;
    const contentValidation = this.auditResults.audits.content_validation;

    // Calculate summary metrics
    this.auditResults.summary = {
      total_files: builtinAudit.summary.totalFiles,
      audit_passed:
        builtinAudit.summary.byStatus.complete +
        builtinAudit.summary.byStatus.partial,
      validation_passed: contentValidation.passed,
      critical_issues:
        builtinAudit.summary.byStatus.placeholder + contentValidation.failed,
      high_priority_files: builtinAudit.summary.byPriority.high,
      recommendations_count: builtinAudit.recommendations.length,
    };

    // Consolidate recommendations by priority and category
    this.consolidateRecommendations();
  }

  /**
   * Consolidate recommendations from all audit sources
   */
  consolidateRecommendations() {
    const builtinRecs = this.auditResults.audits.builtin_nodes.recommendations;
    const consolidated = [];

    // Group recommendations by category and priority
    const categories = {};

    builtinRecs.forEach((rec) => {
      const key = `${rec.category}_${rec.priority}`;
      if (!categories[key]) {
        categories[key] = {
          category: rec.category,
          priority: rec.priority,
          items: [],
          total_files: 0,
        };
      }
      categories[key].items.push(rec);
      categories[key].total_files += rec.files ? rec.files.length : 0;
    });

    // Convert to consolidated recommendations
    Object.values(categories).forEach((cat) => {
      consolidated.push({
        category: cat.category,
        priority: cat.priority,
        title: this.generateConsolidatedTitle(cat),
        description: this.generateConsolidatedDescription(cat),
        action_items: cat.items.map((item) => item.action),
        affected_files: cat.total_files,
        estimated_effort: this.estimateConsolidatedEffort(cat),
        timeline: this.estimateTimeline(cat),
      });
    });

    // Sort by priority and impact
    consolidated.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.affected_files - a.affected_files; // Higher file count first
    });

    this.auditResults.consolidated_recommendations = consolidated;
  }

  /**
   * Generate consolidated recommendation title
   */
  generateConsolidatedTitle(category) {
    const titles = {
      content_creation: "Complete Placeholder Content Documentation",
      content_expansion: "Expand Minimal Content Files",
      category_improvement: "Enhance Category-Specific Documentation",
      examples: "Implement Comprehensive Code Examples",
      structure: "Fix Documentation Structure Issues",
      technical_accuracy: "Resolve Technical Accuracy Problems",
    };

    return (
      titles[category.category] || `Improve ${category.category} Documentation`
    );
  }

  /**
   * Generate consolidated recommendation description
   */
  generateConsolidatedDescription(category) {
    const totalFiles = category.total_files;
    const priority = category.priority;

    const descriptions = {
      content_creation: `${totalFiles} files contain only placeholder content and require complete documentation creation.`,
      content_expansion: `${totalFiles} files have minimal content that needs substantial expansion to meet quality standards.`,
      category_improvement: `${totalFiles} files across specific categories need targeted improvements for consistency.`,
      examples: `${totalFiles} files lack proper code examples and need practical implementation demonstrations.`,
      structure: `${totalFiles} files have structural issues that prevent effective user navigation and understanding.`,
      technical_accuracy: `${totalFiles} files contain technical inaccuracies that could mislead users or cause implementation failures.`,
    };

    return (
      descriptions[category.category] ||
      `${totalFiles} files need ${priority} priority improvements.`
    );
  }

  /**
   * Estimate consolidated effort
   */
  estimateConsolidatedEffort(category) {
    const totalFiles = category.total_files;
    const priority = category.priority;

    if (priority === "critical" || category.category === "content_creation") {
      return totalFiles > 10 ? "large" : totalFiles > 5 ? "medium" : "small";
    }

    if (priority === "high" || category.category === "content_expansion") {
      return totalFiles > 15 ? "large" : totalFiles > 8 ? "medium" : "small";
    }

    return totalFiles > 20 ? "medium" : "small";
  }

  /**
   * Estimate timeline for category
   */
  estimateTimeline(category) {
    const effort = this.estimateConsolidatedEffort(category);
    const priority = category.priority;

    const timelines = {
      critical: { small: "1-2 days", medium: "3-5 days", large: "1-2 weeks" },
      high: { small: "2-3 days", medium: "1 week", large: "2-3 weeks" },
      medium: { small: "3-5 days", medium: "1-2 weeks", large: "3-4 weeks" },
      low: { small: "1 week", medium: "2-3 weeks", large: "1 month" },
    };

    return timelines[priority][effort] || "1-2 weeks";
  }

  /**
   * Generate implementation plan
   */
  generateImplementationPlan() {
    const recs = this.auditResults.consolidated_recommendations;

    // Phase 1: Critical and High Priority
    const phase1 = recs.filter(
      (r) => r.priority === "critical" || r.priority === "high"
    );

    // Phase 2: Medium Priority
    const phase2 = recs.filter((r) => r.priority === "medium");

    // Phase 3: Low Priority and Polish
    const phase3 = recs.filter((r) => r.priority === "low");

    this.auditResults.implementation_plan = {
      phases: [
        {
          phase: 1,
          title: "Foundation and Critical Issues",
          duration: "1-2 weeks",
          description:
            "Address placeholder content and critical structural issues",
          recommendations: phase1,
          success_criteria: [
            "All placeholder content replaced with comprehensive documentation",
            "All critical structural issues resolved",
            "Essential code examples implemented and tested",
          ],
        },
        {
          phase: 2,
          title: "Content Enhancement and Standardization",
          duration: "2-3 weeks",
          description:
            "Expand minimal content and implement consistent structure",
          recommendations: phase2,
          success_criteria: [
            "All minimal content expanded to meet quality standards",
            "Consistent structure implemented across all categories",
            "Comprehensive examples and integration patterns documented",
          ],
        },
        {
          phase: 3,
          title: "Quality Polish and Optimization",
          duration: "1-2 weeks",
          description:
            "Final quality improvements and user experience optimization",
          recommendations: phase3,
          success_criteria: [
            "All documentation meets excellence standards",
            "Cross-referencing system fully implemented",
            "User experience optimized and validated",
          ],
        },
      ],
      timeline: "4-7 weeks total",
      resource_requirements: {
        technical_writer: "1 full-time",
        developer_reviewer: "0.5 part-time",
        subject_matter_expert: "0.25 part-time",
        estimated_hours: this.calculateTotalHours(),
      },
    };
  }

  /**
   * Calculate total estimated hours
   */
  calculateTotalHours() {
    const recs = this.auditResults.consolidated_recommendations;
    let totalHours = 0;

    const effortHours = {
      small: 8, // 1 day
      medium: 24, // 3 days
      large: 80, // 2 weeks
    };

    recs.forEach((rec) => {
      totalHours += effortHours[rec.estimated_effort] || 24;
    });

    return `${totalHours}-${Math.round(totalHours * 1.3)} hours`; // Add 30% buffer
  }

  /**
   * Generate comprehensive framework report
   */
  async generateFrameworkReport() {
    const reportContent = this.generateFrameworkMarkdown();
    const reportDir = path.join(
      process.cwd(),
      ".kiro/documentation-standards/reports"
    );

    await fs.mkdir(reportDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const reportFile = path.join(
      reportDir,
      `audit-framework-report-${timestamp}.md`
    );
    const jsonFile = path.join(
      reportDir,
      `audit-framework-data-${timestamp}.json`
    );

    await fs.writeFile(reportFile, reportContent);
    await fs.writeFile(jsonFile, JSON.stringify(this.auditResults, null, 2));

    console.log(`\n📄 Framework report saved: ${reportFile}`);
    console.log(`📊 Framework data saved: ${jsonFile}`);
  }

  /**
   * Generate framework markdown report
   */
  generateFrameworkMarkdown() {
    const { summary, consolidated_recommendations, implementation_plan } =
      this.auditResults;

    return `# Documentation Audit Framework Report

**Generated**: ${this.auditResults.timestamp}  
**Framework Version**: ${this.auditResults.framework_version}  
**Audit Scope**: ${this.auditResults.audit_scope}

## Executive Summary

This comprehensive audit framework evaluated ${summary.total_files} builtin node documentation files using specialized auditing tools and quality validation processes. The assessment provides a systematic foundation for enhancing documentation quality and establishing sustainable maintenance procedures.

### Key Findings

| Metric | Count | Status |
|--------|-------|--------|
| **Total Files Evaluated** | ${summary.total_files} | 📊 |
| **Files Passing Audit** | ${summary.audit_passed} | ${summary.audit_passed > summary.total_files * 0.7 ? "🟢" : summary.audit_passed > summary.total_files * 0.4 ? "🟡" : "🔴"} |
| **Files Passing Validation** | ${summary.validation_passed} | ${summary.validation_passed > summary.total_files * 0.8 ? "🟢" : summary.validation_passed > summary.total_files * 0.5 ? "🟡" : "🔴"} |
| **Critical Issues** | ${summary.critical_issues} | ${summary.critical_issues === 0 ? "🟢" : summary.critical_issues < 5 ? "🟡" : "🔴"} |
| **High Priority Files** | ${summary.high_priority_files} | ${summary.high_priority_files < 5 ? "🟢" : summary.high_priority_files < 15 ? "🟡" : "🔴"} |

### Overall Assessment

${this.generateOverallAssessment()}

## Consolidated Recommendations

${this.formatConsolidatedRecommendations()}

## Implementation Plan

### Timeline Overview
**Total Duration**: ${implementation_plan.timeline}  
**Resource Requirements**: ${implementation_plan.resource_requirements.estimated_hours}

${this.formatImplementationPhases()}

### Resource Requirements

| Role | Commitment | Responsibilities |
|------|------------|------------------|
| **Technical Writer** | ${implementation_plan.resource_requirements.technical_writer} | Content creation, structure implementation, quality assurance |
| **Developer Reviewer** | ${implementation_plan.resource_requirements.developer_reviewer} | Technical accuracy validation, code example testing |
| **Subject Matter Expert** | ${implementation_plan.resource_requirements.subject_matter_expert} | Domain expertise, use case validation, integration patterns |

## Quality Assurance Framework

### Validation Tools Implemented
- ✅ **Builtin Nodes Auditor**: Specialized evaluation of node documentation completeness
- ✅ **Content Validator**: Structure and quality validation against standards
- ✅ **Quality Criteria Checklist**: Comprehensive quality assessment framework
- ✅ **Audit Framework**: Consolidated reporting and implementation planning

### Ongoing Maintenance Procedures
1. **Weekly**: Automated validation runs on modified files
2. **Monthly**: Comprehensive audit of all documentation
3. **Quarterly**: Quality metrics review and process optimization
4. **Semi-Annual**: Complete framework review and standards update

## Success Metrics

### Phase 1 Success Criteria
${implementation_plan.phases[0].success_criteria.map((criteria) => `- ${criteria}`).join("\n")}

### Phase 2 Success Criteria
${implementation_plan.phases[1].success_criteria.map((criteria) => `- ${criteria}`).join("\n")}

### Phase 3 Success Criteria
${implementation_plan.phases[2].success_criteria.map((criteria) => `- ${criteria}`).join("\n")}

### Long-term Quality Targets
- **Documentation Completion Rate**: 95%+ files meeting quality standards
- **User Satisfaction**: 4.5+ rating on documentation helpfulness
- **Code Example Success Rate**: 98%+ examples working correctly
- **Cross-Reference Accuracy**: 99%+ links and references valid

## Next Steps

1. **Immediate (This Week)**
   - Review and approve implementation plan
   - Assign resources and establish timeline
   - Begin Phase 1 critical issue resolution

2. **Short-term (Next 2 Weeks)**
   - Complete Phase 1 implementation
   - Establish regular validation procedures
   - Begin Phase 2 content enhancement

3. **Medium-term (Next 4-6 Weeks)**
   - Complete all implementation phases
   - Validate quality improvements
   - Establish maintenance procedures

4. **Long-term (Ongoing)**
   - Monitor quality metrics and user feedback
   - Continuous improvement based on usage patterns
   - Regular framework updates and optimization

---

*This report was generated by the Documentation Audit Framework v${this.auditResults.framework_version}*
`;
  }

  /**
   * Generate overall assessment
   */
  generateOverallAssessment() {
    const { summary } = this.auditResults;
    const completionRate = (summary.audit_passed / summary.total_files) * 100;
    const validationRate =
      (summary.validation_passed / summary.total_files) * 100;

    if (
      completionRate >= 80 &&
      validationRate >= 90 &&
      summary.critical_issues === 0
    ) {
      return "Documentation is in excellent condition with high completion and validation rates. Focus on continuous improvement and maintenance procedures.";
    } else if (
      completionRate >= 60 &&
      validationRate >= 70 &&
      summary.critical_issues < 5
    ) {
      return "Documentation is in good condition with room for improvement. Systematic enhancement will achieve excellence standards.";
    } else if (completionRate >= 40 && summary.critical_issues < 15) {
      return "Documentation needs significant improvement but has a solid foundation. Focused effort on critical issues will yield substantial improvements.";
    } else {
      return "Documentation requires comprehensive enhancement. Systematic implementation of the framework recommendations is essential for achieving quality standards.";
    }
  }

  /**
   * Format consolidated recommendations
   */
  formatConsolidatedRecommendations() {
    if (this.auditResults.consolidated_recommendations.length === 0) {
      return "No specific recommendations - documentation meets excellence standards.";
    }

    return this.auditResults.consolidated_recommendations
      .map((rec, index) => {
        const priorityEmoji = {
          critical: "🚨",
          high: "⚠️",
          medium: "📋",
          low: "💡",
        };

        const effortEmoji = {
          small: "🟢",
          medium: "🟡",
          large: "🔴",
        };

        return `### ${index + 1}. ${rec.title} ${priorityEmoji[rec.priority]}

**Priority**: ${rec.priority.toUpperCase()}  
**Affected Files**: ${rec.affected_files}  
**Estimated Effort**: ${rec.estimated_effort} ${effortEmoji[rec.estimated_effort]}  
**Timeline**: ${rec.timeline}

${rec.description}

**Action Items**:
${rec.action_items.map((action) => `- ${action}`).join("\n")}`;
      })
      .join("\n\n");
  }

  /**
   * Format implementation phases
   */
  formatImplementationPhases() {
    return this.auditResults.implementation_plan.phases
      .map((phase) => {
        return `### Phase ${phase.phase}: ${phase.title}
**Duration**: ${phase.duration}  
**Focus**: ${phase.description}

**Recommendations in this Phase**: ${phase.recommendations.length}
${phase.recommendations.map((rec) => `- ${rec.title} (${rec.priority} priority)`).join("\n")}

**Success Criteria**:
${phase.success_criteria.map((criteria) => `- ${criteria}`).join("\n")}`;
      })
      .join("\n\n");
  }

  /**
   * Print executive summary to console
   */
  printExecutiveSummary() {
    const { summary } = this.auditResults;

    console.log("\n" + "=".repeat(70));
    console.log("🎯 DOCUMENTATION AUDIT FRAMEWORK SUMMARY");
    console.log("=".repeat(70));

    console.log(`\n📊 Audit Results:`);
    console.log(`   • Total Files: ${summary.total_files}`);
    console.log(
      `   • Audit Passed: ${summary.audit_passed} (${((summary.audit_passed / summary.total_files) * 100).toFixed(1)}%)`
    );
    console.log(
      `   • Validation Passed: ${summary.validation_passed} (${((summary.validation_passed / summary.total_files) * 100).toFixed(1)}%)`
    );
    console.log(`   • Critical Issues: ${summary.critical_issues}`);
    console.log(`   • High Priority Files: ${summary.high_priority_files}`);

    console.log(`\n🎯 Implementation Plan:`);
    console.log(
      `   • Total Duration: ${this.auditResults.implementation_plan.timeline}`
    );
    console.log(
      `   • Resource Hours: ${this.auditResults.implementation_plan.resource_requirements.estimated_hours}`
    );
    console.log(
      `   • Implementation Phases: ${this.auditResults.implementation_plan.phases.length}`
    );

    console.log(`\n📋 Priority Recommendations:`);
    this.auditResults.consolidated_recommendations
      .slice(0, 3)
      .forEach((rec, index) => {
        const emoji = { critical: "🚨", high: "⚠️", medium: "📋", low: "💡" }[
          rec.priority
        ];
        console.log(
          `   ${index + 1}. ${emoji} ${rec.title} (${rec.affected_files} files)`
        );
      });

    const overallHealth = this.calculateOverallHealth();
    console.log(
      `\n📈 Overall Documentation Health: ${overallHealth.emoji} ${overallHealth.status}`
    );

    console.log("\n🚀 Next Steps:");
    console.log("   1. Review implementation plan and assign resources");
    console.log("   2. Begin Phase 1: Foundation and Critical Issues");
    console.log(
      "   3. Establish regular validation and maintenance procedures"
    );

    console.log("\n" + "=".repeat(70));
  }

  /**
   * Calculate overall documentation health
   */
  calculateOverallHealth() {
    const { summary } = this.auditResults;
    const completionRate = (summary.audit_passed / summary.total_files) * 100;
    const criticalRatio = summary.critical_issues / summary.total_files;

    if (completionRate >= 80 && criticalRatio < 0.1) {
      return { status: "Excellent", emoji: "🟢" };
    } else if (completionRate >= 60 && criticalRatio < 0.2) {
      return { status: "Good", emoji: "🟡" };
    } else if (completionRate >= 40 && criticalRatio < 0.4) {
      return { status: "Needs Improvement", emoji: "🟠" };
    } else {
      return { status: "Poor", emoji: "🔴" };
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const framework = new DocumentationAuditFramework();

  framework
    .runComprehensiveAudit()
    .then((results) => {
      const hasIssues =
        results.summary.critical_issues > 0 ||
        results.summary.high_priority_files > 10;
      process.exit(hasIssues ? 1 : 0);
    })
    .catch((error) => {
      console.error("Audit framework failed:", error);
      process.exit(1);
    });
}

export default DocumentationAuditFramework;
