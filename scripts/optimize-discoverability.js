#!/usr/bin/env node

/**
 * Optimize Content Discoverability - Advanced Features
 * 
 * This script adds advanced discoverability features including:
 * - Enhanced search metadata
 * - Cross-reference optimization
 * - Content tagging for better navigation
 * - User journey mapping
 */

import fs from 'fs';
import path from 'path';

// Base directory for builtin nodes
const BUILTIN_DIR = 'src/content/docs/integration/builtin';

// Advanced search metadata for each node category
const searchMetadata = {
  'ai-nodes': {
    keywords: ['artificial intelligence', 'machine learning', 'natural language processing', 'LLM', 'AI agent', 'chatbot', 'text generation', 'language model'],
    searchTerms: ['ai', 'llm', 'gpt', 'chat', 'generate', 'analyze', 'understand', 'process text', 'smart', 'intelligent'],
    useCases: ['content analysis', 'text generation', 'question answering', 'document processing', 'intelligent automation', 'knowledge extraction']
  },
  'core-nodes': {
    keywords: ['web scraping', 'browser automation', 'HTTP requests', 'DOM manipulation', 'content extraction', 'web interaction'],
    searchTerms: ['scrape', 'extract', 'fetch', 'get', 'browser', 'web', 'html', 'text', 'links', 'images', 'api'],
    useCases: ['data collection', 'web automation', 'content extraction', 'API integration', 'browser interaction', 'web scraping']
  },
  'data-transformation': {
    keywords: ['data processing', 'field manipulation', 'type conversion', 'data validation', 'formatting', 'transformation'],
    searchTerms: ['transform', 'convert', 'format', 'edit', 'modify', 'process', 'validate', 'clean', 'restructure'],
    useCases: ['data cleaning', 'format conversion', 'field manipulation', 'data validation', 'report generation', 'data processing']
  },
  'flow-control': {
    keywords: ['workflow logic', 'conditional processing', 'data flow', 'error handling', 'branching', 'control flow'],
    searchTerms: ['if', 'condition', 'filter', 'merge', 'branch', 'control', 'logic', 'error', 'wait', 'delay'],
    useCases: ['workflow control', 'conditional logic', 'error handling', 'data routing', 'process orchestration', 'flow management']
  },
  'lambda-trigger': {
    keywords: ['modular workflows', 'reusability', 'workflow triggers', 'event handling', 'sub-workflows'],
    searchTerms: ['lambda', 'trigger', 'start', 'modular', 'reuse', 'component', 'input', 'output', 'event'],
    useCases: ['modular design', 'workflow reusability', 'event handling', 'process automation', 'component architecture']
  }
};

// User journey mappings for different skill levels
const userJourneys = {
  'beginner': {
    'ai-nodes': [
      'BasicLLMChainNode → Simple AI text processing',
      'QANode → Question-answering workflows',
      'LocalMemory → Basic AI memory management'
    ],
    'core-nodes': [
      'GetAllTextFromLink → Extract text from web pages',
      'Http-Request → Make simple API calls',
      'Code → Basic JavaScript automation'
    ],
    'data-transformation': [
      'EditFields → Rename and modify data fields',
      'PickField → Select specific data fields',
      'FormatDate → Format date and time values'
    ],
    'flow-control': [
      'IFNode → Simple conditional logic',
      'Filter → Filter arrays of data',
      'Merge → Combine data from multiple sources'
    ]
  },
  'intermediate': {
    'ai-nodes': [
      'RAGNode → Advanced AI with knowledge retrieval',
      'ToolsAgentNode → AI with external tool integration',
      'RecursiveCharacterTextSplitter → Prepare text for AI processing'
    ],
    'core-nodes': [
      'GetHTMLFromLink → Advanced web scraping',
      'GetImagesFromLink → Extract and process images',
      'GetLinksFromLink → Build web crawlers'
    ],
    'data-transformation': [
      'DownloadAsFile → Generate files from data',
      'AddToADate → Complex date calculations',
      'GetTimeBetweenDates → Date arithmetic operations'
    ],
    'flow-control': [
      'StopAndError → Advanced error handling',
      'WaitNode → Timing and rate limiting',
      'Merge → Complex data merging strategies'
    ]
  },
  'advanced': {
    'ai-nodes': [
      'LocalKnowledge → Build custom knowledge bases',
      'OllamaEmbeddings → Local AI embeddings',
      'StructuredOutputParser → Parse AI responses'
    ],
    'core-nodes': [
      'Code → Complex browser automation',
      'Http-Request → Advanced API integration patterns'
    ],
    'lambda-trigger': [
      'LambdaInput/LambdaOutput → Modular workflow architecture',
      'WhenStarted → Event-driven automation'
    ]
  }
};

// Content relationship mappings
const contentRelationships = {
  'prerequisites': {
    'RAGNode': ['LocalKnowledge', 'OllamaEmbeddings', 'RecursiveCharacterTextSplitter'],
    'QANode': ['LocalMemory', 'BasicLLMChainNode'],
    'ToolsAgentNode': ['BasicLLMChainNode', 'Http-Request'],
    'LocalKnowledge': ['OllamaEmbeddings', 'RecursiveCharacterTextSplitter'],
    'DownloadAsFile': ['EditFields', 'PickField']
  },
  'next_steps': {
    'BasicLLMChainNode': ['QANode', 'RAGNode', 'ToolsAgentNode'],
    'GetAllTextFromLink': ['RecursiveCharacterTextSplitter', 'LocalKnowledge', 'RAGNode'],
    'EditFields': ['DownloadAsFile', 'Filter', 'Merge'],
    'IFNode': ['Filter', 'Merge', 'StopAndError'],
    'LocalMemory': ['QANode', 'RAGNode', 'ToolsAgentNode']
  },
  'alternatives': {
    'GetAllTextFromLink': ['GetHTMLFromLink', 'GetSelectedText'],
    'EditFields': ['PickField', 'Code'],
    'BasicLLMChainNode': ['QANode', 'RAGNode'],
    'Filter': ['IFNode', 'Code'],
    'LocalKnowledge': ['External Vector Databases']
  }
};

/**
 * Generate enhanced search metadata section
 */
function generateSearchMetadata(category) {
  const metadata = searchMetadata[category];
  if (!metadata) return '';
  
  let content = '\n## Search & Discovery\n\n';
  
  content += '### Keywords\n';
  content += metadata.keywords.map(keyword => `- ${keyword}`).join('\n') + '\n\n';
  
  content += '### Common Search Terms\n';
  content += metadata.searchTerms.map(term => `- "${term}"`).join('\n') + '\n\n';
  
  content += '### Primary Use Cases\n';
  content += metadata.useCases.map(useCase => `- ${useCase}`).join('\n') + '\n\n';
  
  return content;
}

/**
 * Generate user journey guidance
 */
function generateUserJourneyGuidance(nodeName, category) {
  let content = '\n## Learning Path\n\n';
  
  // Find which skill level this node belongs to
  let skillLevel = 'beginner';
  for (const [level, categories] of Object.entries(userJourneys)) {
    if (categories[category]) {
      const nodeEntry = categories[category].find(entry => entry.includes(nodeName));
      if (nodeEntry) {
        skillLevel = level;
        break;
      }
    }
  }
  
  content += `### Skill Level: ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}\n\n`;
  
  // Add prerequisites if they exist
  const prerequisites = contentRelationships.prerequisites[nodeName];
  if (prerequisites && prerequisites.length > 0) {
    content += '**Prerequisites:**\n';
    prerequisites.forEach(prereq => {
      content += `- Understand [${prereq}](/integration/builtin/ai/${prereq.toLowerCase()})\n`;
    });
    content += '\n';
  }
  
  // Add next steps if they exist
  const nextSteps = contentRelationships.next_steps[nodeName];
  if (nextSteps && nextSteps.length > 0) {
    content += '**Next Steps:**\n';
    nextSteps.forEach(next => {
      content += `- Explore [${next}](/integration/builtin/ai/${next.toLowerCase()})\n`;
    });
    content += '\n';
  }
  
  // Add alternatives if they exist
  const alternatives = contentRelationships.alternatives[nodeName];
  if (alternatives && alternatives.length > 0) {
    content += '**Alternatives to Consider:**\n';
    alternatives.forEach(alt => {
      content += `- ${alt}\n`;
    });
    content += '\n';
  }
  
  return content;
}

/**
 * Generate enhanced cross-references section
 */
function generateEnhancedCrossReferences(nodeName, category) {
  let content = '\n## Enhanced Cross-References\n\n';
  
  // Add workflow pattern references
  content += '### Workflow Patterns\n';
  switch (category) {
    case 'ai-nodes':
      content += '- [AI-Powered Analysis Patterns](/learning/workflow-patterns/ai-analysis-patterns)\n';
      content += '- [Knowledge Base Integration](/learning/workflow-patterns/knowledge-integration)\n';
      content += '- [Intelligent Content Processing](/learning/workflow-patterns/content-processing)\n';
      break;
    case 'core-nodes':
      content += '- [Web Scraping Patterns](/learning/workflow-patterns/web-scraping-patterns)\n';
      content += '- [Browser Automation Workflows](/learning/workflow-patterns/browser-automation)\n';
      content += '- [API Integration Patterns](/learning/workflow-patterns/integration-patterns)\n';
      break;
    case 'data-transformation':
      content += '- [Data Processing Patterns](/learning/workflow-patterns/data-processing-patterns)\n';
      content += '- [Content Manipulation Patterns](/learning/workflow-patterns/content-manipulation-patterns)\n';
      content += '- [Data Validation Workflows](/learning/workflow-patterns/validation-patterns)\n';
      break;
    case 'flow-control':
      content += '- [Flow Control Patterns](/learning/workflow-patterns/flow-control-patterns)\n';
      content += '- [Error Handling Strategies](/learning/workflow-patterns/error-handling)\n';
      content += '- [Conditional Logic Patterns](/learning/workflow-patterns/conditional-logic)\n';
      break;
    case 'lambda-trigger':
      content += '- [Modular Workflow Design](/learning/workflow-patterns/modular-design)\n';
      content += '- [Event-Driven Patterns](/learning/workflow-patterns/event-driven)\n';
      content += '- [Reusable Component Patterns](/learning/workflow-patterns/reusable-components)\n';
      break;
  }
  
  // Add tutorial references
  content += '\n### Related Tutorials\n';
  switch (category) {
    case 'ai-nodes':
      content += '- [Building Your First AI Workflow](/learning/text-courses/beginner/first-ai-workflow)\n';
      content += '- [Advanced AI Integration](/learning/text-courses/advanced/ai-powered-analysis)\n';
      break;
    case 'core-nodes':
      content += '- [Web Automation Basics](/learning/text-courses/beginner/web-automation-basics)\n';
      content += '- [Advanced Web Scraping](/learning/text-courses/advanced/complex-web-scraping)\n';
      break;
    case 'data-transformation':
      content += '- [Data Processing Fundamentals](/learning/text-courses/intermediate/data-transformation)\n';
      content += '- [Advanced Data Manipulation](/learning/text-courses/advanced/data-processing)\n';
      break;
    case 'flow-control':
      content += '- [Workflow Logic Basics](/learning/text-courses/beginner/workflow-logic)\n';
      content += '- [Advanced Flow Control](/learning/text-courses/intermediate/advanced-flow-control)\n';
      break;
  }
  
  // Add example references
  content += '\n### Practical Examples\n';
  content += '- [Real-World Use Cases](/learning/examples/)\n';
  content += '- [Integration Examples](/learning/examples/multi-node-automation)\n';
  content += '- [Best Practice Examples](/learning/workflow-patterns/optimization-best-practices)\n';
  
  return content;
}

/**
 * Add advanced discoverability features to a node file
 */
function addAdvancedDiscoverability(nodeName, filePath, category) {
  const fullPath = path.join(BUILTIN_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${fullPath}`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove existing advanced sections if they exist
    content = content.replace(/\n## Search & Discovery[\s\S]*?(?=\n## |\n---|\n$)/g, '');
    content = content.replace(/\n## Learning Path[\s\S]*?(?=\n## |\n---|\n$)/g, '');
    content = content.replace(/\n## Enhanced Cross-References[\s\S]*?(?=\n## |\n---|\n$)/g, '');
    
    // Generate new advanced content
    const searchMetadataContent = generateSearchMetadata(category);
    const userJourneyContent = generateUserJourneyGuidance(nodeName, category);
    const crossReferencesContent = generateEnhancedCrossReferences(nodeName, category);
    
    // Find insertion point (before Related Nodes or Version History)
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
      
      const advancedContent = searchMetadataContent + userJourneyContent + crossReferencesContent;
      const updatedContent = beforeInsertion + advancedContent + afterInsertion;
      
      fs.writeFileSync(fullPath, updatedContent, 'utf8');
      console.log(`✅ Added advanced discoverability features to ${nodeName}`);
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
 * Process all node files to add advanced discoverability features
 */
function addAdvancedDiscoverabilityToAllNodes() {
  const nodeCategories = {
    'ai-nodes': ['BasicLLMChainNode', 'QANode', 'RAGNode', 'ToolsAgentNode', 'LocalMemory', 'OllamaEmbeddings', 'Ollama', 'WbeLLM', 'StructuredOutputParser', 'RecursiveCharacterTextSplitter', 'LocalKnowledge'],
    'core-nodes': ['Code', 'GetAllTextFromLink', 'GetHTMLFromLink', 'GetImagesFromLink', 'GetLinksFromLink', 'Http-Request'],
    'data-transformation': ['DownloadAsFile', 'EditFields', 'PickField', 'AddToADate', 'ExtractPartOfADate', 'FormatDate', 'GetCurrentDate', 'GetTimeBetweenDates', 'SubstractFromDate'],
    'flow-control': ['Filter', 'IFNode', 'Merge', 'StopAndError', 'WaitNode'],
    'lambda-trigger': ['LambdaInput', 'LambdaOutput', 'WhenStarted']
  };
  
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
  
  console.log('🚀 Starting advanced discoverability enhancement...\n');
  
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
    
    if (addAdvancedDiscoverability(nodeName, filePath, category)) {
      successCount++;
    }
  }
  
  console.log(`\n📊 Advanced discoverability enhancement completed:`);
  console.log(`   ✅ Successfully updated: ${successCount} files`);
  console.log(`   ❌ Failed to update: ${totalCount - successCount} files`);
  console.log(`   📁 Total files processed: ${totalCount}`);
  
  return { successCount, totalCount };
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const results = addAdvancedDiscoverabilityToAllNodes();
  
  if (results.successCount === results.totalCount) {
    console.log('\n🎉 Advanced discoverability optimization completed successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Advanced discoverability optimization completed with issues');
    process.exit(1);
  }
}

export {
  addAdvancedDiscoverability,
  addAdvancedDiscoverabilityToAllNodes,
  searchMetadata,
  userJourneys,
  contentRelationships
};