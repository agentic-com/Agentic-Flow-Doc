#!/usr/bin/env node

/**
 * Enhance Content Discoverability for Builtin Nodes
 * 
 * This script adds comprehensive "See Also" sections, decision guides,
 * and consistent terminology across all node documentation.
 */

import fs from 'fs';
import path from 'path';

// Base directory for builtin nodes
const BUILTIN_DIR = 'src/content/docs/integration/builtin';

// Decision guides for common scenarios
const decisionGuides = {
  'text-extraction': {
    title: 'Text Extraction Decision Guide',
    scenarios: [
      {
        need: 'Extract all visible text from a webpage',
        recommendation: 'GetAllTextFromLink',
        reason: 'Provides clean, readable text content filtered from HTML'
      },
      {
        need: 'Get full HTML structure for parsing',
        recommendation: 'GetHTMLFromLink', 
        reason: 'Preserves HTML structure for custom processing'
      },
      {
        need: 'Extract specific images from a page',
        recommendation: 'GetImagesFromLink',
        reason: 'Specialized for image extraction with metadata'
      },
      {
        need: 'Collect all links for crawling',
        recommendation: 'GetLinksFromLink',
        reason: 'Optimized for link discovery and validation'
      }
    ]
  },
  'ai-processing': {
    title: 'AI Processing Decision Guide',
    scenarios: [
      {
        need: 'Simple text processing with AI',
        recommendation: 'BasicLLMChainNode',
        reason: 'Direct LLM integration for straightforward AI tasks'
      },
      {
        need: 'Question-answering with knowledge base',
        recommendation: 'QANode',
        reason: 'Optimized for Q&A scenarios with context retrieval'
      },
      {
        need: 'Advanced retrieval with source attribution',
        recommendation: 'RAGNode',
        reason: 'Combines vector search with AI for accurate, sourced responses'
      },
      {
        need: 'AI with external tool integration',
        recommendation: 'ToolsAgentNode',
        reason: 'Enables AI to use external APIs and browser functions'
      }
    ]
  },
  'data-transformation': {
    title: 'Data Transformation Decision Guide',
    scenarios: [
      {
        need: 'Rename, convert, or validate fields',
        recommendation: 'EditFields',
        reason: 'Comprehensive field manipulation with validation'
      },
      {
        need: 'Select specific fields only',
        recommendation: 'PickField',
        reason: 'Simple field selection without transformation'
      },
      {
        need: 'Complex custom transformations',
        recommendation: 'Code',
        reason: 'Full JavaScript flexibility for complex logic'
      },
      {
        need: 'Save processed data as file',
        recommendation: 'DownloadAsFile',
        reason: 'Converts data to downloadable file formats'
      }
    ]
  },
  'flow-control': {
    title: 'Flow Control Decision Guide',
    scenarios: [
      {
        need: 'Route workflow based on conditions',
        recommendation: 'IFNode',
        reason: 'Boolean logic for branching workflow paths'
      },
      {
        need: 'Filter arrays of data',
        recommendation: 'Filter',
        reason: 'Specialized for array filtering and validation'
      },
      {
        need: 'Combine multiple data streams',
        recommendation: 'Merge',
        reason: 'Merges data from multiple workflow branches'
      },
      {
        need: 'Handle errors gracefully',
        recommendation: 'StopAndError',
        reason: 'Controlled error handling and workflow termination'
      },
      {
        need: 'Add delays or timing control',
        recommendation: 'WaitNode',
        reason: 'Timing control for rate limiting and delays'
      }
    ]
  }
};

// Enhanced tutorial and example mappings
const enhancedTutorials = {
  'ai-nodes': [
    { title: 'AI Workflow Builder Tutorial', path: '/advanced-ai/basics/ai-workflow-builder' },
    { title: 'Understanding AI Agents', path: '/advanced-ai/examples/understand-agents' },
    { title: 'Understanding AI Chains', path: '/advanced-ai/examples/understand-chains' },
    { title: 'Understanding Memory', path: '/advanced-ai/examples/understand-memory' },
    { title: 'Understanding Tools', path: '/advanced-ai/examples/understand-tools' },
    { title: 'Vector Database Guide', path: '/advanced-ai/examples/understand-vector-databases' },
    { title: 'LangChain Integration', path: '/advanced-ai/langchain/langchain-n8n' },
    { title: 'AI Performance Optimization', path: '/advanced-ai/performance-optimization' }
  ],
  'core-nodes': [
    { title: 'Browser Content Extraction', path: '/learning/examples/browser-content-extraction' },
    { title: 'Web Automation Patterns', path: '/learning/examples/web-automation-patterns' },
    { title: 'Multi-Node Automation', path: '/learning/examples/multi-node-automation' },
    { title: 'Integration Patterns', path: '/learning/workflow-patterns/integration-patterns' },
    { title: 'Browser Security Guide', path: '/usage/licenses-and-privacy/privacy-security/security' }
  ],
  'data-transformation': [
    { title: 'Data Processing Patterns', path: '/learning/workflow-patterns/data-processing-patterns' },
    { title: 'Data Transformation Guide', path: '/usage/key-concepts/data/transforming-data' },
    { title: 'Data Mapping Expressions', path: '/usage/key-concepts/data/data-mapping/data-mapping-expressions' },
    { title: 'Field Validation Examples', path: '/learning/examples/data-validation-workflows' }
  ],
  'flow-control': [
    { title: 'Flow Logic Overview', path: '/usage/key-concepts/flow-logic/' },
    { title: 'Error Handling Guide', path: '/usage/key-concepts/flow-logic/error-handling' },
    { title: 'Execution Order', path: '/usage/key-concepts/flow-logic/execution-order' },
    { title: 'Workflow Debugging', path: '/learning/text-courses/intermediate/workflow-debugging' },
    { title: 'Merging Data Streams', path: '/usage/key-concepts/flow-logic/merging' }
  ]
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
 * Generate enhanced "See Also" section for a node
 */
function generateEnhancedSeeAlso(nodeName) {
  let category = null;
  for (const [cat, nodes] of Object.entries(nodeCategories)) {
    if (nodes.includes(nodeName)) {
      category = cat;
      break;
    }
  }
  
  if (!category) return '';
  
  let content = '\n### See Also\n\n';
  
  // Add category-specific tutorials
  const tutorials = enhancedTutorials[category] || [];
  tutorials.forEach(tutorial => {
    content += `- [${tutorial.title}](${tutorial.path})\n`;
  });
  
  // Add decision guides for relevant categories
  const relevantGuides = getRelevantDecisionGuides(category);
  if (relevantGuides.length > 0) {
    content += '\n**Decision Guides:**\n';
    relevantGuides.forEach(guide => {
      content += `- [${guide.title}](#${guide.title.toLowerCase().replace(/\s+/g, '-')})\n`;
    });
  }
  
  // Add general resources
  content += '\n**General Resources:**\n';
  content += `- [Workflow Patterns](/learning/workflow-patterns/)\n`;
  content += `- [Integration Examples](/learning/examples/)\n`;
  content += `- [Node Types Overview](/integration/builtin/node-types)\n`;
  
  return content;
}

/**
 * Get relevant decision guides for a category
 */
function getRelevantDecisionGuides(category) {
  const guides = [];
  
  switch (category) {
    case 'core-nodes':
      guides.push(decisionGuides['text-extraction']);
      break;
    case 'ai-nodes':
      guides.push(decisionGuides['ai-processing']);
      break;
    case 'data-transformation':
      guides.push(decisionGuides['data-transformation']);
      break;
    case 'flow-control':
      guides.push(decisionGuides['flow-control']);
      break;
  }
  
  return guides;
}

/**
 * Generate decision guide content
 */
function generateDecisionGuideContent(guide) {
  let content = `\n## ${guide.title}\n\n`;
  content += `Choose the right node for your specific needs:\n\n`;
  
  guide.scenarios.forEach(scenario => {
    content += `**${scenario.need}**\n`;
    content += `→ Use **${scenario.recommendation}**\n`;
    content += `*${scenario.reason}*\n\n`;
  });
  
  return content;
}

/**
 * Add decision guides to overview files
 */
function addDecisionGuidesToOverview() {
  const overviewFiles = [
    { path: 'core/_meta.yml', guides: ['text-extraction'] },
    { path: 'ai/_meta.yml', guides: ['ai-processing'] },
    { path: 'dataTransformation/_meta.yml', guides: ['data-transformation'] },
    { path: 'flow/_meta.yml', guides: ['flow-control'] }
  ];
  
  // For now, we'll add decision guides to the node-types.md file
  const nodeTypesPath = path.join(BUILTIN_DIR, 'node-types.md');
  
  if (fs.existsSync(nodeTypesPath)) {
    let content = fs.readFileSync(nodeTypesPath, 'utf8');
    
    // Add decision guides section
    let decisionGuidesContent = '\n## Decision Guides\n\n';
    decisionGuidesContent += 'Use these guides to choose the right node for your specific needs:\n\n';
    
    Object.values(decisionGuides).forEach(guide => {
      decisionGuidesContent += generateDecisionGuideContent(guide);
    });
    
    // Insert before any existing sections or at the end
    const insertionPoint = content.indexOf('\n## ') !== -1 ? content.indexOf('\n## ') : content.length;
    const updatedContent = content.substring(0, insertionPoint) + decisionGuidesContent + content.substring(insertionPoint);
    
    fs.writeFileSync(nodeTypesPath, updatedContent, 'utf8');
    console.log('✅ Added decision guides to node-types.md');
  }
}

/**
 * Update See Also sections in all node files
 */
function updateSeeAlsoSections() {
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
  
  let successCount = 0;
  let totalCount = 0;
  
  for (const [nodeName, filePath] of Object.entries(nodePaths)) {
    totalCount++;
    const fullPath = path.join(BUILTIN_DIR, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${fullPath}`);
      continue;
    }
    
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Find and replace existing See Also section
      const seeAlsoRegex = /\n### See Also[\s\S]*?(?=\n### |\n## |\n---|\n$)/g;
      content = content.replace(seeAlsoRegex, '');
      
      // Generate enhanced See Also content
      const enhancedSeeAlso = generateEnhancedSeeAlso(nodeName);
      
      // Find insertion point (before Version History or at end of Related Nodes section)
      const insertionPoints = [
        /(\n## Version History)/,
        /(\n## Additional Resources)/,
        /(\n---\n\*\*Last Updated\*\*)/,
        /(\n$)/
      ];
      
      let insertionIndex = -1;
      let matchedPattern = null;
      
      for (const pattern of insertionPoints) {
        const match = content.match(pattern);
        if (match) {
          insertionIndex = match.index;
          matchedPattern = match[1];
          break;
        }
      }
      
      if (insertionIndex !== -1) {
        const beforeInsertion = content.substring(0, insertionIndex);
        const afterInsertion = content.substring(insertionIndex);
        
        const updatedContent = beforeInsertion + enhancedSeeAlso + '\n' + afterInsertion;
        
        fs.writeFileSync(fullPath, updatedContent, 'utf8');
        console.log(`✅ Enhanced See Also section for ${nodeName}`);
        successCount++;
      } else {
        console.log(`⚠️  Could not find insertion point for ${nodeName}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${nodeName}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 See Also enhancement completed:`);
  console.log(`   ✅ Successfully updated: ${successCount} files`);
  console.log(`   ❌ Failed to update: ${totalCount - successCount} files`);
  console.log(`   📁 Total files processed: ${totalCount}`);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting content discoverability enhancement...\n');
  
  // Add decision guides to overview
  addDecisionGuidesToOverview();
  
  // Update See Also sections
  updateSeeAlsoSections();
  
  console.log('\n🎉 Content discoverability enhancement completed!');
}

export {
  generateEnhancedSeeAlso,
  addDecisionGuidesToOverview,
  updateSeeAlsoSections,
  decisionGuides
};