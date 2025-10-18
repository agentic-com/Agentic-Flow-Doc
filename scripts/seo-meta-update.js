#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

/**
 * SEO and meta description update script for Agentic Workflow Studio documentation
 * Updates all page descriptions to be browser extension specific and optimizes SEO metadata
 */

/**
 * Browser extension focused SEO keywords and phrases
 */
const seoKeywords = [
  'browser extension',
  'AI workflow',
  'web automation',
  'browser context manipulation',
  'intelligent workflows',
  'web content extraction',
  'AI-powered automation',
  'visual workflow builder',
  'browser-based AI',
  'web scraping automation'
];

/**
 * Improved descriptions for different content types
 */
const improvedDescriptions = {
  // Main sections
  'src/content/docs/index.mdx': 'Build AI-powered workflows directly in your browser with intelligent automation and context manipulation.',
  'src/content/docs/usage/index.md': 'Learn how to use Agentic Workflow Studio browser extension to create intelligent workflows that interact with web content.',
  'src/content/docs/integration/index.md': 'Explore browser extension nodes and integrations for web content manipulation and AI-powered automation.',
  'src/content/docs/advanced-ai/index.md': 'Create advanced AI workflows in your browser using LangChain integration and intelligent content processing.',
  'src/content/docs/learning/index.md': 'Master browser-based workflow automation with comprehensive tutorials and examples for web content manipulation.',
  
  // Getting started
  'src/content/docs/usage/getting-started/learning-path.md': 'Follow the complete learning path to master Agentic Workflow Studio browser extension and create intelligent web automation workflows.',
  'src/content/docs/usage/getting-started/quick-starts/quick-intro.md': 'Get started quickly with Agentic Workflow Studio browser extension - install and create your first AI-powered web automation workflow.',
  'src/content/docs/usage/getting-started/quick-starts/long-intro.md': 'Complete installation and setup guide for Agentic Workflow Studio browser extension with detailed workflow creation tutorial.',
  
  // Key concepts
  'src/content/docs/usage/key-concepts/glossary.md': 'Essential terminology and concepts for Agentic Workflow Studio browser extension and AI-powered web automation workflows.',
  'src/content/docs/usage/key-concepts/data/data-structure.md': 'Understand data structures and formats used in Agentic Workflow Studio browser extension workflows for web content processing.',
  'src/content/docs/usage/key-concepts/flow-logic/execution-order.md': 'Learn how workflow execution works in Agentic Workflow Studio browser extension for optimal web automation performance.',
  
  // Extension nodes
  'src/content/docs/integration/extension/GetSelectedText.md': 'Extract selected text from web pages using Agentic Workflow Studio browser extension for AI processing and automation.',
  'src/content/docs/integration/extension/GetAllText.md': 'Capture all text content from web pages with Agentic Workflow Studio browser extension for comprehensive content analysis.',
  'src/content/docs/integration/extension/GetAllHTML.md': 'Extract complete HTML content from web pages using Agentic Workflow Studio browser extension for advanced processing.',
  'src/content/docs/integration/extension/GetHTMLofSelectedText.md': 'Get HTML markup of selected content with Agentic Workflow Studio browser extension for precise content manipulation.',
  'src/content/docs/integration/extension/GetAllLinks.md': 'Collect all links from web pages using Agentic Workflow Studio browser extension for comprehensive link analysis and processing.',
  'src/content/docs/integration/extension/GetAllImages.md': 'Gather all images from web pages with Agentic Workflow Studio browser extension for media processing and analysis.',
  
  // AI examples
  'src/content/docs/advanced-ai/examples/smart-text-extraction.md': 'Create intelligent text extraction workflows using Agentic Workflow Studio browser extension with AI-powered content analysis.',
  'src/content/docs/advanced-ai/examples/ai-web-scraping.md': 'Build advanced web scraping workflows with AI processing using Agentic Workflow Studio browser extension.',
  'src/content/docs/advanced-ai/examples/web-content-analysis.md': 'Analyze web content intelligently using Agentic Workflow Studio browser extension with AI-powered processing workflows.',
  
  // Learning examples
  'src/content/docs/learning/examples/browser-content-extraction.md': 'Master browser content extraction techniques with Agentic Workflow Studio extension through practical examples and tutorials.',
  'src/content/docs/learning/examples/web-automation-patterns.md': 'Learn common web automation patterns and best practices using Agentic Workflow Studio browser extension.',
  'src/content/docs/learning/examples/multi-node-automation.md': 'Create complex multi-step automation workflows with Agentic Workflow Studio browser extension for advanced web manipulation.'
};

/**
 * Recursively find all markdown files
 */
async function findMarkdownFiles(dir) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git')) {
        const subFiles = await findMarkdownFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return files;
}

/**
 * Extract frontmatter from markdown content
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    return {
      frontmatter: match[1],
      content: match[2],
      hasFrontmatter: true
    };
  }
  
  return {
    frontmatter: '',
    content: content,
    hasFrontmatter: false
  };
}

/**
 * Parse frontmatter YAML-like content
 */
function parseFrontmatter(frontmatterText) {
  const lines = frontmatterText.split('\n');
  const parsed = {};
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      parsed[key] = value;
    }
  }
  
  return parsed;
}

/**
 * Generate browser extension focused description
 */
function generateBrowserExtensionDescription(filePath, currentDescription, title) {
  // Check if we have a predefined improved description
  if (improvedDescriptions[filePath]) {
    return improvedDescriptions[filePath];
  }
  
  // If current description exists and is already browser extension focused, keep it
  if (currentDescription && (
    currentDescription.includes('browser extension') ||
    currentDescription.includes('browser context') ||
    currentDescription.includes('web automation') ||
    currentDescription.includes('Agentic Workflow Studio')
  )) {
    return currentDescription;
  }
  
  // Generate new description based on file path and title
  const pathParts = filePath.split('/');
  const section = pathParts.includes('usage') ? 'usage' :
                 pathParts.includes('integration') ? 'integration' :
                 pathParts.includes('advanced-ai') ? 'advanced-ai' :
                 pathParts.includes('learning') ? 'learning' : 'general';
  
  const templates = {
    usage: `Learn how to use Agentic Workflow Studio browser extension for ${title?.toLowerCase() || 'web automation'} with intelligent workflow creation.`,
    integration: `Explore ${title || 'browser extension nodes'} for web content manipulation and AI-powered automation workflows.`,
    'advanced-ai': `Create advanced AI workflows using ${title || 'browser extension capabilities'} with LangChain integration and intelligent processing.`,
    learning: `Master ${title?.toLowerCase() || 'browser automation'} with Agentic Workflow Studio extension through practical examples and tutorials.`,
    general: `${title || 'Agentic Workflow Studio'} - Build AI-powered workflows directly in your browser with intelligent automation capabilities.`
  };
  
  return templates[section];
}

/**
 * Update meta description in a file
 */
async function updateFileMetaDescription(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { frontmatter, content: bodyContent, hasFrontmatter } = extractFrontmatter(content);
    
    if (!hasFrontmatter) {
      // No frontmatter, skip this file
      return { updated: false, reason: 'no-frontmatter' };
    }
    
    const parsed = parseFrontmatter(frontmatter);
    const currentDescription = parsed.description;
    const title = parsed.title;
    
    // Generate new browser extension focused description
    const newDescription = generateBrowserExtensionDescription(filePath, currentDescription, title);
    
    // Check if update is needed
    if (currentDescription === newDescription) {
      return { updated: false, reason: 'no-change-needed' };
    }
    
    // Update frontmatter
    let updatedFrontmatter = frontmatter;
    
    if (currentDescription) {
      // Replace existing description
      updatedFrontmatter = updatedFrontmatter.replace(
        new RegExp(`description:\\s*["']?${currentDescription.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?`),
        `description: "${newDescription}"`
      );
    } else {
      // Add description after title if it exists
      if (title) {
        updatedFrontmatter = updatedFrontmatter.replace(
          new RegExp(`title:\\s*["']?${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?`),
          `title: "${title}"\ndescription: "${newDescription}"`
        );
      } else {
        // Add at the beginning
        updatedFrontmatter = `description: "${newDescription}"\n${updatedFrontmatter}`;
      }
    }
    
    // Reconstruct file content
    const updatedContent = `---\n${updatedFrontmatter}\n---\n${bodyContent}`;
    
    // Write updated content
    await fs.writeFile(filePath, updatedContent, 'utf-8');
    
    return {
      updated: true,
      oldDescription: currentDescription,
      newDescription: newDescription
    };
    
  } catch (error) {
    return {
      updated: false,
      error: error.message
    };
  }
}

/**
 * Update site-wide SEO configuration
 */
async function updateSitewideSEO() {
  try {
    const configContent = await fs.readFile('astro.config.mjs', 'utf-8');
    
    // Check if description is already browser extension focused
    const currentDescriptionMatch = configContent.match(/description:\s*["'](.*?)["']/);
    const currentDescription = currentDescriptionMatch ? currentDescriptionMatch[1] : '';
    
    const newDescription = "Agentic Workflow Studio - Build AI-powered workflows directly in your browser with intelligent automation and web content manipulation capabilities.";
    
    if (currentDescription !== newDescription) {
      const updatedContent = configContent.replace(
        /description:\s*["'].*?["']/,
        `description: "${newDescription}"`
      );
      
      await fs.writeFile('astro.config.mjs', updatedContent, 'utf-8');
      
      return {
        updated: true,
        oldDescription: currentDescription,
        newDescription: newDescription
      };
    }
    
    return { updated: false, reason: 'no-change-needed' };
    
  } catch (error) {
    return { updated: false, error: error.message };
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🔍 Starting SEO and meta description update...\n');
  
  // Update site-wide SEO
  console.log('📝 Updating site-wide SEO configuration...');
  const sitewideSEO = await updateSitewideSEO();
  if (sitewideSEO.updated) {
    console.log('✅ Updated site description in astro.config.mjs');
    console.log(`   Old: ${sitewideSEO.oldDescription}`);
    console.log(`   New: ${sitewideSEO.newDescription}`);
  } else {
    console.log('⏭️  Site description already optimized');
  }
  
  // Find all markdown files
  console.log('\n📁 Finding documentation files...');
  const files = await findMarkdownFiles('src/content/docs');
  console.log(`Found ${files.length} files to process\n`);
  
  // Process all files
  const results = [];
  let updatedCount = 0;
  
  for (const file of files) {
    const result = await updateFileMetaDescription(file);
    results.push({ file, ...result });
    
    if (result.updated) {
      updatedCount++;
      console.log(`✅ ${file}: Updated description`);
      console.log(`   Old: ${result.oldDescription || '(none)'}`);
      console.log(`   New: ${result.newDescription}`);
    } else if (result.error) {
      console.log(`❌ ${file}: Error - ${result.error}`);
    } else {
      console.log(`⏭️  ${file}: ${result.reason}`);
    }
  }
  
  // Summary
  console.log('\n📊 SEO Update Summary:');
  console.log(`   Files processed: ${files.length}`);
  console.log(`   Descriptions updated: ${updatedCount}`);
  console.log(`   Site-wide SEO: ${sitewideSEO.updated ? 'Updated' : 'No changes needed'}`);
  
  // Save detailed log
  const logData = {
    timestamp: new Date().toISOString(),
    summary: {
      filesProcessed: files.length,
      descriptionsUpdated: updatedCount,
      sitewideSEOUpdated: sitewideSEO.updated
    },
    sitewideSEO,
    fileResults: results,
    seoKeywords
  };
  
  const logFileName = `scripts/reports/seo-meta-update-log-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  await fs.writeFile(logFileName, JSON.stringify(logData, null, 2));
  console.log(`\n📝 Detailed log saved to: ${logFileName}`);
  
  console.log('\n✅ SEO and meta description update completed!');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { updateFileMetaDescription, generateBrowserExtensionDescription, updateSitewideSEO };