#!/usr/bin/env node

/**
 * Cross-Reference Mapping System for Builtin Nodes
 * 
 * This script creates comprehensive cross-reference mappings between all builtin nodes
 * to implement bidirectional relationships and workflow pattern suggestions.
 */

import fs from 'fs';
import path from 'path';

// Define node categories and their relationships
const nodeCategories = {
  ai: {
    agents: ['BasicLLMChainNode', 'QANode', 'RAGNode', 'ToolsAgentNode'],
    dependencies: {
      chatMemories: ['LocalMemory'],
      embeddings: ['OllamaEmbeddings'],
      llm: ['Ollama', 'WbeLLM'],
      outputParser: ['StructuredOutputParser'],
      textSplitter: ['RecursiveCharacterTextSplitter'],
      vectorStore: ['LocalKnowledge']
    }
  },
  core: ['Code', 'GetAllTextFromLink', 'GetHTMLFromLink', 'GetImagesFromLink', 'GetLinksFromLink', 'Http-Request'],
  dataTransformation: {
    main: ['DownloadAsFile', 'EditFields', 'PickField'],
    dateTime: ['AddToADate', 'ExtractPartOfADate', 'FormatDate', 'GetCurrentDate', 'GetTimeBetweenDates', 'SubstractFromDate']
  },
  flow: ['Filter', 'IFNode', 'Merge', 'StopAndError', 'WaitNode'],
  lambda: ['LambdaInput', 'LambdaOutput'],
  trigger: ['WhenStarted']
};

// Define cross-reference relationships
const crossReferences = {
  // AI Agent Nodes
  'BasicLLMChainNode': {
    complementary: ['GetAllTextFromLink', 'EditFields', 'Filter'],
    alternatives: ['QANode', 'RAGNode'],
    dependencies: ['Ollama', 'WbeLLM'],
    workflows: [
      'GetAllTextFromLink → BasicLLMChainNode → EditFields',
      'Http-Request → BasicLLMChainNode → DownloadAsFile'
    ],
    tutorials: ['/advanced-ai/basics/ai-workflow-builder', '/advanced-ai/langchain/langchain-n8n']
  },
  
  'QANode': {
    complementary: ['LocalKnowledge', 'RecursiveCharacterTextSplitter'],
    alternatives: ['BasicLLMChainNode', 'RAGNode'],
    dependencies: ['Ollama', 'WbeLLM', 'LocalMemory'],
    workflows: [
      'GetAllTextFromLink → RecursiveCharacterTextSplitter → LocalKnowledge → QANode'
    ],
    tutorials: ['/advanced-ai/examples/understand-agents']
  },
  
  'RAGNode': {
    complementary: ['LocalKnowledge', 'OllamaEmbeddings', 'RecursiveCharacterTextSplitter'],
    alternatives: ['QANode', 'BasicLLMChainNode'],
    dependencies: ['Ollama', 'WbeLLM', 'LocalKnowledge', 'OllamaEmbeddings'],
    workflows: [
      'GetAllTextFromLink → RecursiveCharacterTextSplitter → LocalKnowledge → RAGNode',
      'RAGNode → Filter → EditFields'
    ],
    tutorials: ['/advanced-ai/examples/understand-vector-databases', '/advanced-ai/examples/vector-store-website']
  },
  
  'ToolsAgentNode': {
    complementary: ['Http-Request', 'Code', 'GetAllTextFromLink'],
    alternatives: ['BasicLLMChainNode', 'RAGNode'],
    dependencies: ['Ollama', 'WbeLLM'],
    workflows: [
      'ToolsAgentNode → Http-Request → EditFields',
      'GetAllTextFromLink → ToolsAgentNode → Code'
    ],
    tutorials: ['/advanced-ai/examples/understand-tools', '/advanced-ai/examples/understand-agents']
  },

  // Core Nodes
  'GetAllTextFromLink': {
    complementary: ['BasicLLMChainNode', 'RecursiveCharacterTextSplitter', 'EditFields'],
    alternatives: ['GetHTMLFromLink', 'GetImagesFromLink'],
    workflows: [
      'GetAllTextFromLink → BasicLLMChainNode → EditFields',
      'GetAllTextFromLink → RecursiveCharacterTextSplitter → LocalKnowledge'
    ],
    tutorials: ['/learning/examples/browser-content-extraction', '/advanced-ai/examples/intelligent-content-analysis']
  },
  
  'GetHTMLFromLink': {
    complementary: ['Code', 'EditFields', 'Filter'],
    alternatives: ['GetAllTextFromLink', 'GetLinksFromLink'],
    workflows: [
      'GetHTMLFromLink → Code → EditFields',
      'GetHTMLFromLink → Filter → DownloadAsFile'
    ],
    tutorials: ['/learning/examples/web-automation-patterns']
  },
  
  'GetImagesFromLink': {
    complementary: ['DownloadAsFile', 'EditFields', 'Filter'],
    alternatives: ['GetAllTextFromLink', 'GetLinksFromLink'],
    workflows: [
      'GetImagesFromLink → Filter → DownloadAsFile',
      'GetImagesFromLink → EditFields → Http-Request'
    ],
    tutorials: ['/learning/examples/browser-content-extraction']
  },
  
  'GetLinksFromLink': {
    complementary: ['Filter', 'EditFields', 'Http-Request'],
    alternatives: ['GetAllTextFromLink', 'GetHTMLFromLink'],
    workflows: [
      'GetLinksFromLink → Filter → GetAllTextFromLink',
      'GetLinksFromLink → EditFields → Http-Request'
    ],
    tutorials: ['/learning/examples/web-automation-patterns']
  },
  
  'Http-Request': {
    complementary: ['GetAllTextFromLink', 'EditFields', 'IFNode'],
    alternatives: ['Code'],
    workflows: [
      'GetAllTextFromLink → Http-Request → EditFields',
      'EditFields → Http-Request → IFNode'
    ],
    tutorials: ['/learning/workflow-patterns/integration-patterns']
  },
  
  'Code': {
    complementary: ['GetHTMLFromLink', 'EditFields', 'Filter'],
    alternatives: ['Http-Request'],
    workflows: [
      'GetHTMLFromLink → Code → EditFields',
      'Code → Filter → DownloadAsFile'
    ],
    tutorials: ['/usage/key-concepts/data/code']
  },

  // Data Transformation Nodes
  'EditFields': {
    complementary: ['Filter', 'IFNode', 'Http-Request'],
    alternatives: ['PickField', 'Code'],
    workflows: [
      'GetAllTextFromLink → EditFields → Http-Request',
      'BasicLLMChainNode → EditFields → DownloadAsFile'
    ],
    tutorials: ['/learning/workflow-patterns/data-processing-patterns']
  },
  
  'PickField': {
    complementary: ['Filter', 'EditFields'],
    alternatives: ['EditFields', 'Code'],
    workflows: [
      'Http-Request → PickField → EditFields',
      'PickField → Filter → DownloadAsFile'
    ],
    tutorials: ['/learning/workflow-patterns/data-processing-patterns']
  },
  
  'DownloadAsFile': {
    complementary: ['EditFields', 'Filter'],
    workflows: [
      'BasicLLMChainNode → EditFields → DownloadAsFile',
      'GetAllTextFromLink → Filter → DownloadAsFile'
    ],
    tutorials: ['/learning/workflow-patterns/data-processing-patterns']
  },

  // Flow Control Nodes
  'IFNode': {
    complementary: ['Filter', 'Merge', 'StopAndError'],
    alternatives: ['Filter'],
    workflows: [
      'Http-Request → IFNode → EditFields / StopAndError',
      'GetAllTextFromLink → IFNode → BasicLLMChainNode'
    ],
    tutorials: ['/usage/key-concepts/flow-logic/execution-order', '/learning/text-courses/intermediate/workflow-debugging']
  },
  
  'Filter': {
    complementary: ['IFNode', 'EditFields', 'Merge'],
    alternatives: ['IFNode'],
    workflows: [
      'GetLinksFromLink → Filter → GetAllTextFromLink',
      'RAGNode → Filter → EditFields'
    ],
    tutorials: ['/learning/workflow-patterns/data-processing-patterns']
  },
  
  'Merge': {
    complementary: ['IFNode', 'Filter', 'EditFields'],
    workflows: [
      'IFNode branches → Merge → EditFields',
      'Multiple sources → Merge → DownloadAsFile'
    ],
    tutorials: ['/usage/key-concepts/flow-logic/merging']
  },
  
  'StopAndError': {
    complementary: ['IFNode', 'Filter'],
    workflows: [
      'Http-Request → IFNode → StopAndError (on error)',
      'Filter → StopAndError (on validation failure)'
    ],
    tutorials: ['/usage/key-concepts/flow-logic/error-handling']
  },
  
  'WaitNode': {
    complementary: ['Http-Request', 'IFNode'],
    workflows: [
      'Http-Request → WaitNode → Http-Request (retry pattern)',
      'WaitNode → GetAllTextFromLink (delayed extraction)'
    ],
    tutorials: ['/usage/key-concepts/flow-logic/waiting']
  },

  // AI Dependencies
  'LocalKnowledge': {
    complementary: ['RAGNode', 'QANode', 'RecursiveCharacterTextSplitter', 'OllamaEmbeddings'],
    workflows: [
      'GetAllTextFromLink → RecursiveCharacterTextSplitter → LocalKnowledge → RAGNode',
      'LocalKnowledge → QANode → EditFields'
    ],
    tutorials: ['/advanced-ai/examples/understand-vector-databases']
  },
  
  'RecursiveCharacterTextSplitter': {
    complementary: ['LocalKnowledge', 'RAGNode', 'GetAllTextFromLink'],
    workflows: [
      'GetAllTextFromLink → RecursiveCharacterTextSplitter → LocalKnowledge',
      'RecursiveCharacterTextSplitter → BasicLLMChainNode'
    ],
    tutorials: ['/advanced-ai/examples/understand-vector-databases']
  },
  
  'OllamaEmbeddings': {
    complementary: ['LocalKnowledge', 'RAGNode'],
    workflows: [
      'OllamaEmbeddings → LocalKnowledge → RAGNode'
    ],
    tutorials: ['/advanced-ai/langchain/langchain-n8n']
  },
  
  'Ollama': {
    complementary: ['BasicLLMChainNode', 'RAGNode', 'QANode', 'ToolsAgentNode'],
    alternatives: ['WbeLLM'],
    workflows: [
      'Ollama → BasicLLMChainNode → EditFields',
      'Ollama → RAGNode → Filter'
    ],
    tutorials: ['/advanced-ai/langchain/langchain-n8n']
  },
  
  'WbeLLM': {
    complementary: ['BasicLLMChainNode', 'RAGNode', 'QANode', 'ToolsAgentNode'],
    alternatives: ['Ollama'],
    workflows: [
      'WbeLLM → BasicLLMChainNode → Http-Request',
      'WbeLLM → QANode → EditFields'
    ],
    tutorials: ['/advanced-ai/langchain/langchain-n8n']
  },
  
  'LocalMemory': {
    complementary: ['BasicLLMChainNode', 'QANode', 'RAGNode'],
    workflows: [
      'LocalMemory → QANode → EditFields',
      'BasicLLMChainNode → LocalMemory (conversation context)'
    ],
    tutorials: ['/advanced-ai/examples/understand-memory']
  },

  // Lambda and Trigger Nodes
  'LambdaInput': {
    complementary: ['LambdaOutput', 'EditFields'],
    workflows: [
      'LambdaInput → EditFields → BasicLLMChainNode → LambdaOutput'
    ],
    tutorials: ['/usage/key-concepts/flow-logic/lambdaworkflows']
  },
  
  'LambdaOutput': {
    complementary: ['LambdaInput', 'EditFields'],
    workflows: [
      'LambdaInput → processing nodes → LambdaOutput'
    ],
    tutorials: ['/usage/key-concepts/flow-logic/lambdaworkflows']
  },
  
  'WhenStarted': {
    complementary: ['GetAllTextFromLink', 'Http-Request', 'EditFields'],
    workflows: [
      'WhenStarted → GetAllTextFromLink → BasicLLMChainNode',
      'WhenStarted → Http-Request → EditFields'
    ],
    tutorials: ['/usage/using-the-app/workflows/executions/manual-partial-and-production-executions']
  },

  // DateTime Nodes
  'AddToADate': {
    complementary: ['GetCurrentDate', 'FormatDate', 'EditFields'],
    alternatives: ['SubstractFromDate', 'GetTimeBetweenDates'],
    workflows: [
      'GetCurrentDate → AddToADate → FormatDate',
      'EditFields → AddToADate → DownloadAsFile'
    ],
    tutorials: ['/learning/workflow-patterns/data-processing-patterns']
  },
  
  'ExtractPartOfADate': {
    complementary: ['FormatDate', 'GetCurrentDate', 'EditFields'],
    alternatives: ['AddToADate', 'SubstractFromDate'],
    workflows: [
      'GetCurrentDate → ExtractPartOfADate → EditFields',
      'Http-Request → ExtractPartOfADate → Filter'
    ],
    tutorials: ['/learning/workflow-patterns/data-processing-patterns']
  },
  
  'FormatDate': {
    complementary: ['GetCurrentDate', 'AddToADate', 'EditFields'],
    alternatives: ['ExtractPartOfADate'],
    workflows: [
      'GetCurrentDate → FormatDate → EditFields',
      'AddToADate → FormatDate → DownloadAsFile'
    ],
    tutorials: ['/learning/workflow-patterns/data-processing-patterns']
  },
  
  'GetCurrentDate': {
    complementary: ['FormatDate', 'AddToADate', 'ExtractPartOfADate'],
    workflows: [
      'GetCurrentDate → FormatDate → EditFields',
      'GetCurrentDate → AddToADate → FormatDate'
    ],
    tutorials: ['/learning/workflow-patterns/data-processing-patterns']
  },
  
  'GetTimeBetweenDates': {
    complementary: ['GetCurrentDate', 'EditFields', 'Filter'],
    alternatives: ['AddToADate', 'SubstractFromDate'],
    workflows: [
      'EditFields → GetTimeBetweenDates → Filter',
      'GetCurrentDate → GetTimeBetweenDates → EditFields'
    ],
    tutorials: ['/learning/workflow-patterns/data-processing-patterns']
  },
  
  'SubstractFromDate': {
    complementary: ['GetCurrentDate', 'FormatDate', 'EditFields'],
    alternatives: ['AddToADate', 'GetTimeBetweenDates'],
    workflows: [
      'GetCurrentDate → SubstractFromDate → FormatDate',
      'EditFields → SubstractFromDate → DownloadAsFile'
    ],
    tutorials: ['/learning/workflow-patterns/data-processing-patterns']
  },

  // Output Parser
  'StructuredOutputParser': {
    complementary: ['BasicLLMChainNode', 'RAGNode', 'EditFields'],
    workflows: [
      'BasicLLMChainNode → StructuredOutputParser → EditFields',
      'RAGNode → StructuredOutputParser → Filter'
    ],
    tutorials: ['/advanced-ai/langchain/langchain-n8n']
  }
};

// Generate cross-reference content for a specific node
function generateCrossReferenceContent(nodeName) {
  const refs = crossReferences[nodeName];
  if (!refs) return '';

  let content = '\n## Related Nodes\n\n';

  // Similar Functionality
  if (refs.alternatives && refs.alternatives.length > 0) {
    content += '### Similar Functionality\n\n';
    refs.alternatives.forEach(alt => {
      content += `- **${alt}**: Use when you need ${getAlternativeDescription(nodeName, alt)}\n`;
    });
    content += '\n';
  }

  // Complementary Nodes
  if (refs.complementary && refs.complementary.length > 0) {
    content += '### Complementary Nodes\n\n';
    refs.complementary.forEach(comp => {
      content += `- **${comp}**: ${getComplementaryDescription(nodeName, comp)}\n`;
    });
    content += '\n';
  }

  // Dependencies (for AI nodes)
  if (refs.dependencies && refs.dependencies.length > 0) {
    content += '### Required Dependencies\n\n';
    refs.dependencies.forEach(dep => {
      content += `- **${dep}**: ${getDependencyDescription(dep)}\n`;
    });
    content += '\n';
  }

  // Common Workflow Patterns
  if (refs.workflows && refs.workflows.length > 0) {
    content += '### Common Workflow Patterns\n\n';
    refs.workflows.forEach(workflow => {
      content += `- **${workflow}**: ${getWorkflowDescription(workflow)}\n`;
    });
    content += '\n';
  }

  // See Also section
  content += '### See Also\n\n';
  if (refs.tutorials && refs.tutorials.length > 0) {
    refs.tutorials.forEach(tutorial => {
      const title = getTutorialTitle(tutorial);
      content += `- [${title}](${tutorial})\n`;
    });
  }
  
  // Add general workflow pattern links
  content += `- [Workflow Patterns](/learning/workflow-patterns/)\n`;
  content += `- [Integration Examples](/learning/examples/)\n`;

  return content;
}

// Helper functions for generating descriptions
function getAlternativeDescription(nodeName, alternative) {
  const descriptions = {
    'BasicLLMChainNode': {
      'QANode': 'question-answering with knowledge base integration',
      'RAGNode': 'retrieval-augmented generation with vector search'
    },
    'QANode': {
      'BasicLLMChainNode': 'simple AI processing without knowledge base requirements',
      'RAGNode': 'more advanced retrieval with better source attribution'
    },
    'RAGNode': {
      'QANode': 'simpler question-answering without complex retrieval',
      'BasicLLMChainNode': 'basic AI processing without knowledge base integration'
    },
    'GetAllTextFromLink': {
      'GetHTMLFromLink': 'full HTML structure instead of just text content',
      'GetSelectedText': 'only user-selected text portions from pages'
    },
    'GetHTMLFromLink': {
      'GetAllTextFromLink': 'clean text content without HTML markup',
      'GetLinksFromLink': 'specifically extracting links rather than full HTML'
    },
    'EditFields': {
      'PickField': 'simple field selection without transformation',
      'Code': 'complex transformations requiring custom JavaScript logic'
    },
    'IFNode': {
      'Filter': 'filtering arrays of data instead of single boolean routing'
    },
    'Filter': {
      'IFNode': 'binary true/false routing instead of array filtering'
    }
  };
  
  return descriptions[nodeName]?.[alternative] || `different approach to similar functionality`;
}

function getComplementaryDescription(nodeName, complementary) {
  const descriptions = {
    'BasicLLMChainNode': {
      'GetAllTextFromLink': 'Provides web content for AI processing',
      'EditFields': 'Formats and structures AI responses for further use',
      'Filter': 'Validates AI responses before downstream processing'
    },
    'RAGNode': {
      'LocalKnowledge': 'Provides the vector store backend for RAG operations',
      'RecursiveCharacterTextSplitter': 'Prepares documents for knowledge base ingestion',
      'OllamaEmbeddings': 'Generates embeddings for vector search functionality'
    },
    'GetAllTextFromLink': {
      'BasicLLMChainNode': 'Perfect for processing extracted text content with AI',
      'RecursiveCharacterTextSplitter': 'Useful for breaking large extracted text into chunks',
      'EditFields': 'Can format and clean extracted text data'
    },
    'Http-Request': {
      'GetAllTextFromLink': 'Perfect for extracting content to send via HTTP requests',
      'EditFields': 'Useful for formatting data before sending to external APIs',
      'IFNode': 'Essential for processing and validating HTTP response data'
    },
    'EditFields': {
      'Filter': 'Combine to filter data after field transformations',
      'IFNode': 'Use for conditional field operations based on data validation',
      'Http-Request': 'Format data before sending to external APIs'
    }
  };
  
  return descriptions[nodeName]?.[complementary] || `Works well together in workflows`;
}

function getDependencyDescription(dependency) {
  const descriptions = {
    'Ollama': 'Local LLM provider for AI processing',
    'WbeLLM': 'Web-based LLM provider for cloud AI services',
    'LocalKnowledge': 'Vector store for knowledge base operations',
    'OllamaEmbeddings': 'Local embedding generation for vector search',
    'LocalMemory': 'Conversation memory management for AI agents',
    'RecursiveCharacterTextSplitter': 'Text chunking for large document processing'
  };
  
  return descriptions[dependency] || 'Required for node operation';
}

function getWorkflowDescription(workflow) {
  const descriptions = {
    'GetAllTextFromLink → BasicLLMChainNode → EditFields': 'Extract web content, process with AI, and format results',
    'GetAllTextFromLink → RecursiveCharacterTextSplitter → LocalKnowledge → RAGNode': 'Build knowledge base from web content for Q&A',
    'Http-Request → IFNode → EditFields / StopAndError': 'API call with conditional response handling',
    'RAGNode → Filter → EditFields': 'AI-powered information retrieval with validation and formatting'
  };
  
  return descriptions[workflow] || 'Common integration pattern';
}

function getTutorialTitle(tutorial) {
  const titles = {
    '/advanced-ai/basics/ai-workflow-builder': 'AI Workflow Builder Tutorial',
    '/advanced-ai/langchain/langchain-n8n': 'LangChain Integration Guide',
    '/advanced-ai/examples/understand-agents': 'Understanding AI Agents',
    '/advanced-ai/examples/understand-vector-databases': 'Vector Database Guide',
    '/learning/examples/browser-content-extraction': 'Browser Content Extraction',
    '/learning/workflow-patterns/data-processing-patterns': 'Data Processing Patterns',
    '/usage/key-concepts/flow-logic/error-handling': 'Error Handling Guide'
  };
  
  return titles[tutorial] || tutorial.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export {
  crossReferences,
  generateCrossReferenceContent,
  nodeCategories
};

// If run directly, generate cross-reference content for all nodes
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Cross-Reference Mapping System initialized');
  console.log(`Total nodes mapped: ${Object.keys(crossReferences).length}`);
  
  // Example usage
  const exampleNode = 'BasicLLMChainNode';
  console.log(`\nExample cross-reference content for ${exampleNode}:`);
  console.log(generateCrossReferenceContent(exampleNode));
}