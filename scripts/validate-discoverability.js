#!/usr/bin/env node

/**
 * Validate Content Discoverability Enhancements
 * 
 * This script validates that all discoverability enhancements have been
 * properly applied across all builtin node documentation files.
 */

import fs from 'fs';
import path from 'path';

// Base directory for builtin nodes
const BUILTIN_DIR = 'src/content/docs/integration/builtin';

// Required sections for discoverability
const requiredSections = [
  'See Also',
  'Key Terminology', 
  'Search & Discovery',
  'Learning Path',
  'Enhanced Cross-References'
];

// Node paths for validation
const nodePaths = {
  // AI Agents
  'BasicLLMChainNode': 'ai/AIAgents/BasicLLMChainNode.md',
  'QANode': 'ai/AIAgents/QANode.md',
  'RAGNode': 'ai/AIAgents/RAGNode.md',
  'ToolsAgentNode': 'ai/AIAgents/ToolsAgentNode.md',
  
  // AI Dependencies
  'LocalMemory': 'ai/AIDependencies/chatMemories/LocalMemory.md',
  'OllamaEmbeddings': 'ai/AIDependencies/embeddings/OllamaEmbeddings.md',
  'Ollama': 'ai/AIDependencies/llm/Ollama.md',
  'WbeLLM': 'ai/AIDependencies/llm/WbeLLM.md',
  'StructuredOutputParser': 'ai/AIDependencies/outputParser/StructuredOutputParser.md',
  'RecursiveCharacterTextSplitter': 'ai/AIDependencies/textSplitter/RecursiveCharacterTextSplitter.md',
  'LocalKnowledge': 'ai/AIDependencies/vectorStore/LocalKnowledge.md',
  
  // Core Nodes
  'Code': 'core/Code.md',
  'GetAllTextFromLink': 'core/GetAllTextFromLink.md',
  'GetHTMLFromLink': 'core/GetHTMLFromLink.md',
  'GetImagesFromLink': 'core/GetImagesFromLink.md',
  'GetLinksFromLink': 'core/GetLinksFromLink.md',
  'Http-Request': 'core/Http-Request.md',
  
  // Data Transformation
  'DownloadAsFile': 'dataTransformation/DownloadAsFile.md',
  'EditFields': 'dataTransformation/EditFields.md',
  'PickField': 'dataTransformation/PickField.md',
  'AddToADate': 'dataTransformation/DateTime/AddToADate.md',
  'ExtractPartOfADate': 'dataTransformation/DateTime/ExtractPartOfADate.md',
  'FormatDate': 'dataTransformation/DateTime/FormatDate.md',
  'GetCurrentDate': 'dataTransformation/DateTime/GetCurrentDate.md',
  'GetTimeBetweenDates': 'dataTransformation/DateTime/GetTimeBetweenDates.md',
  'SubstractFromDate': 'dataTransformation/DateTime/SubstractFromDate.md',
  
  // Flow Control
  'Filter': 'flow/Filter.md',
  'IFNode': 'flow/IFNode.md',
  'Merge': 'flow/Merge.md',
  'StopAndError': 'flow/StopAndError.md',
  'WaitNode': 'flow/WaitNode.md',
  
  // Lambda
  'LambdaInput': 'lambda/LambdaInput.md',
  'LambdaOutput': 'lambda/LambdaOutput.md',
  
  // Trigger
  'WhenStarted': 'trigger/WhenStarted.md'
};

/**
 * Validate a single node file for discoverability features
 */
function validateNodeFile(nodeName, filePath) {
  const fullPath = path.join(BUILTIN_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    return {
      nodeName,
      exists: false,
      sections: {},
      issues: [`File not found: ${fullPath}`]
    };
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const sections = {};
    const issues = [];
    
    // Check for required sections
    requiredSections.forEach(section => {
      const sectionRegex = new RegExp(`## ${section}`, 'i');
      sections[section] = sectionRegex.test(content);
      
      if (!sections[section]) {
        issues.push(`Missing section: ${section}`);
      }
    });
    
    // Check for frontmatter tags
    const hasFrontmatter = content.startsWith('---\n');
    const hasTags = content.includes('tags:');
    
    if (!hasFrontmatter) {
      issues.push('Missing frontmatter');
    }
    
    if (!hasTags) {
      issues.push('Missing tags in frontmatter');
    }
    
    // Check for decision guide references
    const hasDecisionGuideRef = content.includes('Decision Guide');
    if (!hasDecisionGuideRef) {
      issues.push('Missing decision guide references');
    }
    
    // Check for tutorial links
    const hasTutorialLinks = content.includes('/learning/') || content.includes('/advanced-ai/');
    if (!hasTutorialLinks) {
      issues.push('Missing tutorial links');
    }
    
    // Check for workflow pattern references
    const hasWorkflowPatterns = content.includes('/learning/workflow-patterns/');
    if (!hasWorkflowPatterns) {
      issues.push('Missing workflow pattern references');
    }
    
    return {
      nodeName,
      exists: true,
      sections,
      hasFrontmatter,
      hasTags,
      hasDecisionGuideRef,
      hasTutorialLinks,
      hasWorkflowPatterns,
      issues
    };
    
  } catch (error) {
    return {
      nodeName,
      exists: true,
      sections: {},
      issues: [`Error reading file: ${error.message}`]
    };
  }
}

/**
 * Validate decision guides in node-types.md
 */
function validateDecisionGuides() {
  const nodeTypesPath = path.join(BUILTIN_DIR, 'node-types.md');
  
  if (!fs.existsSync(nodeTypesPath)) {
    return {
      exists: false,
      issues: ['node-types.md file not found']
    };
  }
  
  try {
    const content = fs.readFileSync(nodeTypesPath, 'utf8');
    const issues = [];
    
    // Check for decision guide sections
    const requiredGuides = [
      'Text Extraction Decision Guide',
      'AI Processing Decision Guide', 
      'Data Transformation Decision Guide',
      'Flow Control Decision Guide'
    ];
    
    const missingGuides = requiredGuides.filter(guide => !content.includes(guide));
    
    if (missingGuides.length > 0) {
      issues.push(`Missing decision guides: ${missingGuides.join(', ')}`);
    }
    
    // Check for decision guide content structure
    const hasScenarios = content.includes('→ Use **');
    if (!hasScenarios) {
      issues.push('Decision guides missing proper scenario format');
    }
    
    return {
      exists: true,
      hasDecisionGuides: missingGuides.length === 0,
      hasProperFormat: hasScenarios,
      issues
    };
    
  } catch (error) {
    return {
      exists: true,
      issues: [`Error reading node-types.md: ${error.message}`]
    };
  }
}

/**
 * Generate validation report
 */
function generateValidationReport(results, decisionGuideResults) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = `scripts/reports/discoverability-validation-${timestamp}.json`;
  const summaryPath = `scripts/reports/discoverability-validation-summary-${timestamp}.txt`;
  
  // Ensure reports directory exists
  const reportsDir = 'scripts/reports';
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  // Calculate statistics
  const totalNodes = results.length;
  const validNodes = results.filter(r => r.exists && r.issues.length === 0).length;
  const nodesWithIssues = results.filter(r => r.issues.length > 0).length;
  
  const sectionStats = {};
  requiredSections.forEach(section => {
    const count = results.filter(r => r.sections && r.sections[section]).length;
    sectionStats[section] = {
      present: count,
      missing: totalNodes - count,
      percentage: Math.round((count / totalNodes) * 100)
    };
  });
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalNodes,
      validNodes,
      nodesWithIssues,
      successRate: Math.round((validNodes / totalNodes) * 100)
    },
    sectionStats,
    decisionGuides: decisionGuideResults,
    nodeResults: results,
    issues: results.filter(r => r.issues.length > 0)
  };
  
  // Write detailed JSON report
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Write summary text report
  let summary = `# Discoverability Validation Summary\n\n`;
  summary += `**Generated**: ${new Date().toISOString()}\n\n`;
  summary += `## Overall Statistics\n\n`;
  summary += `- **Total Nodes**: ${totalNodes}\n`;
  summary += `- **Valid Nodes**: ${validNodes}\n`;
  summary += `- **Nodes with Issues**: ${nodesWithIssues}\n`;
  summary += `- **Success Rate**: ${Math.round((validNodes / totalNodes) * 100)}%\n\n`;
  
  summary += `## Section Coverage\n\n`;
  Object.entries(sectionStats).forEach(([section, stats]) => {
    summary += `- **${section}**: ${stats.present}/${totalNodes} (${stats.percentage}%)\n`;
  });
  
  summary += `\n## Decision Guides\n\n`;
  summary += `- **File Exists**: ${decisionGuideResults.exists ? '✅' : '❌'}\n`;
  summary += `- **Has Decision Guides**: ${decisionGuideResults.hasDecisionGuides ? '✅' : '❌'}\n`;
  summary += `- **Proper Format**: ${decisionGuideResults.hasProperFormat ? '✅' : '❌'}\n`;
  
  if (decisionGuideResults.issues.length > 0) {
    summary += `\n**Issues**:\n`;
    decisionGuideResults.issues.forEach(issue => {
      summary += `- ${issue}\n`;
    });
  }
  
  if (nodesWithIssues > 0) {
    summary += `\n## Nodes with Issues\n\n`;
    results.filter(r => r.issues.length > 0).forEach(result => {
      summary += `### ${result.nodeName}\n`;
      result.issues.forEach(issue => {
        summary += `- ${issue}\n`;
      });
      summary += '\n';
    });
  }
  
  fs.writeFileSync(summaryPath, summary);
  
  return { reportPath, summaryPath, report };
}

/**
 * Main validation function
 */
function validateDiscoverability() {
  console.log('🔍 Starting discoverability validation...\n');
  
  const results = [];
  let processedCount = 0;
  
  // Validate each node file
  for (const [nodeName, filePath] of Object.entries(nodePaths)) {
    processedCount++;
    console.log(`[${processedCount}/${Object.keys(nodePaths).length}] Validating ${nodeName}...`);
    
    const result = validateNodeFile(nodeName, filePath);
    results.push(result);
    
    if (result.issues.length > 0) {
      console.log(`  ⚠️  Issues found: ${result.issues.length}`);
    } else {
      console.log(`  ✅ Valid`);
    }
  }
  
  // Validate decision guides
  console.log('\nValidating decision guides...');
  const decisionGuideResults = validateDecisionGuides();
  
  if (decisionGuideResults.issues.length > 0) {
    console.log(`  ⚠️  Decision guide issues: ${decisionGuideResults.issues.length}`);
  } else {
    console.log(`  ✅ Decision guides valid`);
  }
  
  // Generate report
  console.log('\nGenerating validation report...');
  const { reportPath, summaryPath, report } = generateValidationReport(results, decisionGuideResults);
  
  // Display summary
  console.log('\n📊 Validation Summary:');
  console.log(`   📁 Total nodes processed: ${report.summary.totalNodes}`);
  console.log(`   ✅ Valid nodes: ${report.summary.validNodes}`);
  console.log(`   ⚠️  Nodes with issues: ${report.summary.nodesWithIssues}`);
  console.log(`   📈 Success rate: ${report.summary.successRate}%`);
  
  console.log('\n📄 Reports generated:');
  console.log(`   📋 Detailed report: ${reportPath}`);
  console.log(`   📝 Summary report: ${summaryPath}`);
  
  return report;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const report = validateDiscoverability();
  
  if (report.summary.successRate >= 90) {
    console.log('\n🎉 Discoverability validation completed successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Discoverability validation completed with issues');
    process.exit(1);
  }
}

export {
  validateNodeFile,
  validateDecisionGuides,
  validateDiscoverability
};