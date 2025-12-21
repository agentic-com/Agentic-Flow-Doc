#!/usr/bin/env node

/**
 * Add Cross-References to All Builtin Node Documentation
 * 
 * This script systematically adds comprehensive cross-reference sections
 * to all builtin node documentation files.
 */

import fs from 'fs';
import path from 'path';
import { crossReferences, generateCrossReferenceContent } from './cross-reference-mapping.js';

// Base directory for builtin nodes
const BUILTIN_DIR = 'src/content/docs/integration/builtin';

// File paths for all node documentation
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
 * Add or update cross-references in a node documentation file
 */
function addCrossReferencesToFile(nodeName, filePath) {
  const fullPath = path.join(BUILTIN_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${fullPath}`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove existing Related Nodes section if it exists
    content = content.replace(/\n## Related Nodes[\s\S]*?(?=\n## |\n---|\n$)/g, '');
    
    // Generate new cross-reference content
    const crossRefContent = generateCrossReferenceContent(nodeName);
    
    if (!crossRefContent) {
      console.log(`⚠️  No cross-references defined for ${nodeName}`);
      return false;
    }
    
    // Find insertion point (before Version History, Additional Resources, or end)
    const insertionPoints = [
      /\n## Version History/,
      /\n## Additional Resources/,
      /\n---\n\*\*Last Updated\*\*/,
      /\n---$/
    ];
    
    let insertionIndex = -1;
    for (const pattern of insertionPoints) {
      const match = content.match(pattern);
      if (match) {
        insertionIndex = match.index;
        break;
      }
    }
    
    if (insertionIndex === -1) {
      // If no insertion point found, add before the final metadata
      insertionIndex = content.length;
    }
    
    // Insert cross-reference content
    const beforeInsertion = content.substring(0, insertionIndex);
    const afterInsertion = content.substring(insertionIndex);
    
    const updatedContent = beforeInsertion + crossRefContent + '\n' + afterInsertion;
    
    // Write updated content back to file
    fs.writeFileSync(fullPath, updatedContent, 'utf8');
    
    console.log(`✅ Updated cross-references for ${nodeName}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${nodeName}: ${error.message}`);
    return false;
  }
}

/**
 * Process all node documentation files
 */
function processAllNodes() {
  console.log('🚀 Starting cross-reference addition process...\n');
  
  let successCount = 0;
  let totalCount = 0;
  
  for (const [nodeName, filePath] of Object.entries(nodePaths)) {
    totalCount++;
    if (addCrossReferencesToFile(nodeName, filePath)) {
      successCount++;
    }
  }
  
  console.log(`\n📊 Process completed:`);
  console.log(`   ✅ Successfully updated: ${successCount} files`);
  console.log(`   ❌ Failed to update: ${totalCount - successCount} files`);
  console.log(`   📁 Total files processed: ${totalCount}`);
  
  return { successCount, totalCount };
}

/**
 * Validate cross-reference links
 */
function validateCrossReferences() {
  console.log('\n🔍 Validating cross-reference links...');
  
  const issues = [];
  
  for (const [nodeName, refs] of Object.entries(crossReferences)) {
    // Check if referenced nodes exist
    if (refs.complementary) {
      refs.complementary.forEach(refNode => {
        if (!nodePaths[refNode]) {
          issues.push(`${nodeName} references non-existent node: ${refNode}`);
        }
      });
    }
    
    if (refs.alternatives) {
      refs.alternatives.forEach(refNode => {
        if (!nodePaths[refNode]) {
          issues.push(`${nodeName} references non-existent alternative: ${refNode}`);
        }
      });
    }
    
    if (refs.dependencies) {
      refs.dependencies.forEach(refNode => {
        if (!nodePaths[refNode]) {
          issues.push(`${nodeName} references non-existent dependency: ${refNode}`);
        }
      });
    }
  }
  
  if (issues.length > 0) {
    console.log('⚠️  Validation issues found:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  } else {
    console.log('✅ All cross-references are valid');
  }
  
  return issues;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const results = processAllNodes();
  const validationIssues = validateCrossReferences();
  
  if (results.successCount === results.totalCount && validationIssues.length === 0) {
    console.log('\n🎉 Cross-reference addition completed successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Cross-reference addition completed with issues');
    process.exit(1);
  }
}

export {
  addCrossReferencesToFile,
  processAllNodes,
  validateCrossReferences,
  nodePaths
};