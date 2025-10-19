#!/usr/bin/env node

/**
 * Add Consistent Terminology and Tags to Node Documentation
 * 
 * This script adds consistent terminology definitions and tags
 * to improve searchability and consistency across all node documentation.
 */

import fs from 'fs';
import path from 'path';

// Base directory for builtin nodes
const BUILTIN_DIR = 'src/content/docs/integration/builtin';

// Standardized terminology and tags
const terminologyTags = {
  'ai-nodes': {
    tags: ['AI', 'LLM', 'Machine Learning', 'Natural Language Processing', 'Artificial Intelligence'],
    terminology: {
      'LLM': 'Large Language Model - AI models trained on vast amounts of text data',
      'RAG': 'Retrieval-Augmented Generation - AI technique combining information retrieval with text generation',
      'Vector Store': 'Database optimized for storing and searching high-dimensional vectors',
      'Embeddings': 'Numerical representations of text that capture semantic meaning',
      'Prompt': 'Input text that guides AI model behavior and response generation',
      'Temperature': 'Parameter controlling randomness in AI responses (0.0-1.0)',
      'Tokens': 'Units of text processing used by AI models for input and output measurement'
    }
  },
  'core-nodes': {
    tags: ['Web Scraping', 'Browser Automation', 'HTTP', 'DOM', 'Content Extraction'],
    terminology: {
      'DOM': 'Document Object Model - Programming interface for web documents',
      'CORS': 'Cross-Origin Resource Sharing - Security feature controlling cross-domain requests',
      'CSP': 'Content Security Policy - Security standard preventing code injection attacks',
      'Browser API': 'Programming interfaces provided by web browsers for extension functionality',
      'Content Script': 'JavaScript code that runs in the context of web pages',
      'Web Scraping': 'Automated extraction of data from websites'
    }
  },
  'data-transformation': {
    tags: ['Data Processing', 'Field Manipulation', 'Type Conversion', 'Validation', 'Formatting'],
    terminology: {
      'Field Transformation': 'Process of modifying data field names, types, or values',
      'Type Conversion': 'Converting data from one type to another (string, number, boolean, etc.)',
      'Data Validation': 'Process of ensuring data meets specified criteria and constraints',
      'Schema': 'Structure definition that describes the format and constraints of data',
      'Serialization': 'Process of converting data structures into a format for storage or transmission'
    }
  },
  'flow-control': {
    tags: ['Workflow Logic', 'Conditional Processing', 'Data Flow', 'Error Handling', 'Branching'],
    terminology: {
      'Conditional Logic': 'Programming construct that performs different actions based on conditions',
      'Boolean Expression': 'Expression that evaluates to true or false',
      'Data Flow': 'Movement of data through different stages of a workflow',
      'Error Handling': 'Process of catching and managing errors in workflow execution',
      'Workflow Branch': 'Separate execution path in a workflow based on conditions'
    }
  },
  'lambda-trigger': {
    tags: ['Modular Workflows', 'Reusability', 'Workflow Triggers', 'Event Handling'],
    terminology: {
      'Lambda Workflow': 'Reusable sub-workflow that can be called from other workflows',
      'Workflow Trigger': 'Event or condition that initiates workflow execution',
      'Modular Design': 'Approach to building workflows using reusable, independent components',
      'Event-Driven': 'Architecture where workflow execution is triggered by specific events'
    }
  }
};

// Node category mappings
const nodeCategories = {
  'ai-nodes': ['BasicLLMChainNode', 'QANode', 'RAGNode', 'ToolsAgentNode', 'LocalMemory', 'OllamaEmbeddings', 'Ollama', 'WbeLLM', 'StructuredOutputParser', 'RecursiveCharacterTextSplitter', 'LocalKnowledge'],
  'core-nodes': ['Code', 'GetAllTextFromLink', 'GetHTMLFromLink', 'GetImagesFromLink', 'GetLinksFromLink', 'Http-Request'],
  'data-transformation': ['DownloadAsFile', 'EditFields', 'PickField', 'AddToADate', 'ExtractPartOfADate', 'FormatDate', 'GetCurrentDate', 'GetTimeBetweenDates', 'SubstractFromDate'],
  'flow-control': ['Filter', 'IFNode', 'Merge', 'StopAndError', 'WaitNode'],
  'lambda-trigger': ['LambdaInput', 'LambdaOutput', 'WhenStarted']
};

/**
 * Generate terminology section for a node category
 */
function generateTerminologySection(category) {
  const categoryData = terminologyTags[category];
  if (!categoryData) return '';
  
  let content = '\n## Key Terminology\n\n';
  
  Object.entries(categoryData.terminology).forEach(([term, definition]) => {
    content += `**${term}**: ${definition}\n\n`;
  });
  
  return content;
}

/**
 * Generate tags for frontmatter
 */
function generateTags(category) {
  const categoryData = terminologyTags[category];
  if (!categoryData) return [];
  
  return categoryData.tags;
}

/**
 * Update frontmatter with tags
 */
function updateFrontmatterWithTags(content, tags) {
  // Check if frontmatter exists
  if (!content.startsWith('---\n')) return content;
  
  const frontmatterEnd = content.indexOf('\n---\n', 4);
  if (frontmatterEnd === -1) return content;
  
  const frontmatter = content.substring(4, frontmatterEnd);
  const restOfContent = content.substring(frontmatterEnd + 5);
  
  // Add tags if not already present
  let updatedFrontmatter = frontmatter;
  if (!frontmatter.includes('tags:')) {
    const tagsYaml = `tags: [${tags.map(tag => `"${tag}"`).join(', ')}]`;
    updatedFrontmatter = frontmatter + '\n' + tagsYaml;
  }
  
  return `---\n${updatedFrontmatter}\n---\n${restOfContent}`;
}

/**
 * Add terminology section to a node file
 */
function addTerminologyToFile(nodeName, filePath, category) {
  const fullPath = path.join(BUILTIN_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${fullPath}`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Update frontmatter with tags
    const tags = generateTags(category);
    if (tags.length > 0) {
      content = updateFrontmatterWithTags(content, tags);
    }
    
    // Remove existing Key Terminology section if it exists
    content = content.replace(/\n## Key Terminology[\s\S]*?(?=\n## |\n---|\n$)/g, '');
    
    // Generate terminology content
    const terminologyContent = generateTerminologySection(category);
    
    if (!terminologyContent) {
      console.log(`⚠️  No terminology defined for category: ${category}`);
      return false;
    }
    
    // Find insertion point (before Related Nodes section)
    const insertionPoints = [
      /(\n## Related Nodes)/,
      /(\n## Version History)/,
      /(\n## Additional Resources)/,
      /(\n---\n\*\*Last Updated\*\*)/,
      /(\n$)/
    ];
    
    let insertionIndex = -1;
    
    for (const pattern of insertionPoints) {
      const match = content.match(pattern);
      if (match) {
        insertionIndex = match.index;
        break;
      }
    }
    
    if (insertionIndex !== -1) {
      const beforeInsertion = content.substring(0, insertionIndex);
      const afterInsertion = content.substring(insertionIndex);
      
      const updatedContent = beforeInsertion + terminologyContent + afterInsertion;
      
      fs.writeFileSync(fullPath, updatedContent, 'utf8');
      console.log(`✅ Added terminology and tags to ${nodeName}`);
      return true;
    } else {
      console.log(`⚠️  Could not find insertion point for ${nodeName}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${nodeName}: ${error.message}`);
    return false;
  }
}

/**
 * Process all node files to add terminology and tags
 */
function addTerminologyToAllNodes() {
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
  
  console.log('🚀 Starting terminology and tags addition process...\n');
  
  let successCount = 0;
  let totalCount = 0;
  
  for (const [nodeName, filePath] of Object.entries(nodePaths)) {
    totalCount++;
    
    // Find category for this node
    let category = null;
    for (const [cat, nodes] of Object.entries(nodeCategories)) {
      if (nodes.includes(nodeName)) {
        category = cat;
        break;
      }
    }
    
    if (!category) {
      console.log(`⚠️  No category found for ${nodeName}`);
      continue;
    }
    
    if (addTerminologyToFile(nodeName, filePath, category)) {
      successCount++;
    }
  }
  
  console.log(`\n📊 Terminology addition completed:`);
  console.log(`   ✅ Successfully updated: ${successCount} files`);
  console.log(`   ❌ Failed to update: ${totalCount - successCount} files`);
  console.log(`   📁 Total files processed: ${totalCount}`);
  
  return { successCount, totalCount };
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const results = addTerminologyToAllNodes();
  
  if (results.successCount === results.totalCount) {
    console.log('\n🎉 Terminology and tags addition completed successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Terminology and tags addition completed with issues');
    process.exit(1);
  }
}

export {
  addTerminologyToFile,
  addTerminologyToAllNodes,
  terminologyTags
};