---
title: "AI-Powered Content Analysis"
description: "Build sophisticated AI workflows combining web extraction with LangChain processing for intelligent content analysis."
difficulty: "🎯 advanced"
---

# AI-Powered Content Analysis

Master the integration of browser automation with advanced AI processing to create intelligent content analysis workflows. This tutorial demonstrates how to combine web extraction with LangChain, implement AI-powered data processing, and build sophisticated analysis pipelines.

## What You'll Build

In this tutorial, you'll create an advanced AI-powered workflow that:
- Extracts content from multiple web sources simultaneously
- Processes content through LangChain AI models for analysis
- Implements intelligent content categorization and sentiment analysis
- Generates comprehensive reports with AI insights
- Handles complex data flows and AI model orchestration

## Prerequisites

- Completed all [Intermediate Tutorials](/learning/text-courses/intermediate/)
- Understanding of AI/ML concepts and LangChain framework
- Experience with API integration and asynchronous processing
- Familiarity with natural language processing concepts

## Learning Objectives

By the end of this tutorial, you'll understand:
- Advanced LangChain integration patterns in browser workflows
- AI model orchestration and pipeline management
- Intelligent content processing and analysis techniques
- Performance optimization for AI-powered workflows
- Production deployment strategies for AI automation

## AI Workflow Architecture Overview

### Complete AI Pipeline Structure

```
Multi-Source Extraction → Content Preprocessing → AI Analysis Pipeline → Intelligence Synthesis → Report Generation
         ↓                        ↓                      ↓                      ↓                    ↓
    Web Extraction           Text Cleaning         LangChain Models        Result Aggregation    Formatted Output
    Image Analysis         Data Validation       Sentiment Analysis      Pattern Recognition   Actionable Insights
    API Integration        Content Filtering     Entity Extraction       Trend Analysis        Recommendations
```#
## Data Flow Design

**Stage 1: Multi-Source Content Extraction**
- Parallel web extraction from multiple sources
- Content type detection and routing
- Real-time data validation and preprocessing

**Stage 2: AI Processing Pipeline**
- LangChain model integration and orchestration
- Parallel AI analysis (sentiment, entities, topics)
- Context-aware content understanding

**Stage 3: Intelligence Synthesis**
- Cross-source pattern recognition
- Trend analysis and anomaly detection
- Predictive insights generation

**Stage 4: Actionable Output**
- Comprehensive report generation
- Real-time dashboard updates
- Automated alert and notification systems

## Step 1: Advanced LangChain Integration Setup

### LangChain Workflow Foundation

**AI Model Manager Node:**
```javascript
{
  "nodeName": "AI Model Manager",
  "code": `
    class AIModelManager {
      constructor() {
        this.models = new Map();
        this.modelConfigs = new Map();
        this.processingQueue = [];
        this.maxConcurrentRequests = 3;
        this.activeRequests = 0;
      }

      registerModel(modelName, config) {
        this.modelConfigs.set(modelName, {
          apiKey: config.apiKey,
          baseURL: config.baseURL,
          model: config.model,
          temperature: config.temperature || 0.7,
          maxTokens: config.maxTokens || 1000,
          timeout: config.timeout || 30000,
          retryAttempts: config.retryAttempts || 3
        });
      }

      async processWithModel(modelName, prompt, options = {}) {
        const config = this.modelConfigs.get(modelName);
        if (!config) {
          throw new Error(\`Model \${modelName} not registered\`);
        }

        // Queue management for rate limiting
        if (this.activeRequests >= this.maxConcurrentRequests) {
          await this.waitForSlot();
        }

        this.activeRequests++;

        try {
          const result = await this.makeModelRequest(config, prompt, options);
          return result;
        } finally {
          this.activeRequests--;
          this.processQueue();
        }
      }

      async makeModelRequest(config, prompt, options) {
        const requestBody = {
          model: config.model,
          messages: [
            {
              role: "system",
              content: options.systemPrompt || "You are a helpful AI assistant specialized in content analysis."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: options.temperature || config.temperature,
          max_tokens: options.maxTokens || config.maxTokens
        };

        let lastError;

        for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
          try {
            const response = await fetch(\`\${config.baseURL}/chat/completions\`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${config.apiKey}\`
              },
              body: JSON.stringify(requestBody),
              signal: AbortSignal.timeout(config.timeout)
            });

            if (!response.ok) {
              throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
            }

            const data = await response.json();

            return {
              content: data.choices[0].message.content,
              usage: data.usage,
              model: data.model,
              timestamp: new Date().toISOString(),
              attempt
            };

          } catch (error) {
            lastError = error;
            console.warn(\`Model request attempt \${attempt} failed:\`, error);

            if (attempt < config.retryAttempts) {
              await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
            }
          }
        }

        throw new Error(\`All retry attempts failed. Last error: \${lastError.message}\`);
      }

      async waitForSlot() {
        return new Promise(resolve => {
          const checkSlot = () => {
            if (this.activeRequests < this.maxConcurrentRequests) {
              resolve();
            } else {
              setTimeout(checkSlot, 100);
            }
          };
          checkSlot();
        });
      }

      processQueue() {
        // Process any queued requests
        if (this.processingQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
          const nextRequest = this.processingQueue.shift();
          nextRequest();
        }
      }

      async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      getModelStats() {
        return {
          registeredModels: this.modelConfigs.size,
          activeRequests: this.activeRequests,
          queueLength: this.processingQueue.length,
          maxConcurrent: this.maxConcurrentRequests
        };
      }
    }

    // Initialize AI Model Manager
    const aiManager = new AIModelManager();

    // Register different AI models for various tasks
    aiManager.registerModel('gpt-4', {
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 2000
    });

    aiManager.registerModel('claude', {
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseURL: 'https://api.anthropic.com/v1',
      model: 'claude-3-sonnet-20240229',
      temperature: 0.5,
      maxTokens: 1500
    });

    aiManager.registerModel('sentiment-analyzer', {
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-3.5-turbo',
      temperature: 0.1,
      maxTokens: 500
    });

    const inputData = $input.all();

    return [{
      aiManager: 'initialized',
      modelStats: aiManager.getModelStats(),
      inputData,
      readyForProcessing: true
    }];
  `
}
```

## Step 2: Intelligent Content Extraction and Preprocessing

### Multi-Source Content Extractor

**Advanced Content Extraction Node:**
```javascript
{
  "nodeName": "Multi-Source Content Extractor",
  "code": `
    class ContentExtractor {
      constructor() {
        this.extractors = new Map();
        this.contentProcessors = new Map();
        this.extractionStats = {
          totalSources: 0,
          successfulExtractions: 0,
          failedExtractions: 0,
          averageProcessingTime: 0
        };
      }

      registerExtractor(sourceType, extractor) {
        this.extractors.set(sourceType, extractor);
      }

      registerProcessor(contentType, processor) {
        this.contentProcessors.set(contentType, processor);
      }

      async extractFromMultipleSources(sources) {
        const startTime = performance.now();
        const results = [];

        // Process sources in parallel with controlled concurrency
        const concurrencyLimit = 5;
        const batches = this.createBatches(sources, concurrencyLimit);

        for (const batch of batches) {
          const batchPromises = batch.map(source => this.extractFromSource(source));
          const batchResults = await Promise.allSettled(batchPromises);

          batchResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              results.push(result.value);
              this.extractionStats.successfulExtractions++;
            } else {
              console.error(\`Extraction failed for source \${batch[index].url}:\`, result.reason);
              this.extractionStats.failedExtractions++;
            }
          });

          // Add delay between batches to be respectful to servers
          if (batches.indexOf(batch) < batches.length - 1) {
            await this.delay(1000);
          }
        }

        const endTime = performance.now();
        this.extractionStats.totalSources = sources.length;
        this.extractionStats.averageProcessingTime = (endTime - startTime) / sources.length;

        return results;
      }

      async extractFromSource(source) {
        const extractor = this.extractors.get(source.type) || this.extractors.get('default');

        if (!extractor) {
          throw new Error(\`No extractor found for source type: \${source.type}\`);
        }

        const rawContent = await extractor.extract(source);
        const processedContent = await this.processContent(rawContent, source);

        return {
          source: source,
          content: processedContent,
          extractedAt: new Date().toISOString(),
          contentType: this.detectContentType(processedContent)
        };
      }

      async processContent(content, source) {
        const contentType = this.detectContentType(content);
        const processor = this.contentProcessors.get(contentType);

        if (processor) {
          return await processor.process(content, source);
        }

        // Default processing
        return {
          text: this.extractText(content),
          metadata: this.extractMetadata(content, source),
          structure: this.analyzeStructure(content)
        };
      }

      detectContentType(content) {
        if (typeof content === 'string') {
          if (content.includes('<html') || content.includes('<!DOCTYPE')) {
            return 'html';
          } else if (content.startsWith('{') || content.startsWith('[')) {
            try {
              JSON.parse(content);
              return 'json';
            } catch {
              return 'text';
            }
          } else {
            return 'text';
          }
        } else if (typeof content === 'object') {
          return 'structured';
        }

        return 'unknown';
      }

      extractText(content) {
        if (typeof content === 'string') {
          // Remove HTML tags and decode entities
          return content
            .replace(/<script[^>]*>.*?<\\/script>/gi, '')
            .replace(/<style[^>]*>.*?<\\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&[#\\w]+;/g, ' ')
            .replace(/\\s+/g, ' ')
            .trim();
        }

        return content.toString();
      }

      extractMetadata(content, source) {
        const metadata = {
          source: source.url,
          extractedAt: new Date().toISOString(),
          contentLength: content.length,
          sourceType: source.type
        };

        if (typeof content === 'string' && content.includes('<')) {
          // Extract HTML metadata
          const titleMatch = content.match(/<title[^>]*>([^<]+)<\\/title>/i);
          if (titleMatch) metadata.title = titleMatch[1].trim();

          const descMatch = content.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i);
          if (descMatch) metadata.description = descMatch[1];

          const keywordsMatch = content.match(/<meta[^>]*name=["\']keywords["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i);
          if (keywordsMatch) metadata.keywords = keywordsMatch[1].split(',').map(k => k.trim());
        }

        return metadata;
      }

      analyzeStructure(content) {
        if (typeof content === 'string' && content.includes('<')) {
          const structure = {
            headings: this.extractHeadings(content),
            paragraphs: this.countElements(content, 'p'),
            links: this.countElements(content, 'a'),
            images: this.countElements(content, 'img'),
            lists: this.countElements(content, 'ul') + this.countElements(content, 'ol')
          };

          return structure;
        }

        return { type: 'unstructured', length: content.length };
      }

      extractHeadings(html) {
        const headings = [];
        const headingRegex = /<h([1-6])[^>]*>([^<]+)<\\/h[1-6]>/gi;
        let match;

        while ((match = headingRegex.exec(html)) !== null) {
          headings.push({
            level: parseInt(match[1]),
            text: match[2].trim()
          });
        }

        return headings;
      }

      countElements(html, tagName) {
        const regex = new RegExp(\`<\${tagName}[^>]*>\`, 'gi');
        const matches = html.match(regex);
        return matches ? matches.length : 0;
      }

      createBatches(array, batchSize) {
        const batches = [];
        for (let i = 0; i < array.length; i += batchSize) {
          batches.push(array.slice(i, i + batchSize));
        }
        return batches;
      }

      async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      getExtractionStats() {
        return {
          ...this.extractionStats,
          successRate: this.extractionStats.successfulExtractions / this.extractionStats.totalSources,
          failureRate: this.extractionStats.failedExtractions / this.extractionStats.totalSources
        };
      }
    }

    // Initialize content extractor
    const extractor = new ContentExtractor();

    // Register extractors for different source types
    extractor.registerExtractor('web', {
      async extract(source) {
        const response = await fetch(source.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ContentAnalyzer/1.0)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          },
          signal: AbortSignal.timeout(15000)
        });

        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }

        return await response.text();
      }
    });

    extractor.registerExtractor('api', {
      async extract(source) {
        const response = await fetch(source.url, {
          method: source.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...source.headers
          },
          body: source.body ? JSON.stringify(source.body) : undefined,
          signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
          throw new Error(\`API request failed: \${response.status}\`);
        }

        return await response.json();
      }
    });

    // Register content processors
    extractor.registerProcessor('html', {
      async process(content, source) {
        return {
          text: extractor.extractText(content),
          title: content.match(/<title[^>]*>([^<]+)<\\/title>/i)?.[1] || '',
          headings: extractor.extractHeadings(content),
          links: this.extractLinks(content),
          images: this.extractImages(content),
          metadata: extractor.extractMetadata(content, source)
        };
      },

      extractLinks(html) {
        const links = [];
        const linkRegex = /<a[^>]*href=["\']([^"\']+)["\'][^>]*>([^<]*)<\\/a>/gi;
        let match;

        while ((match = linkRegex.exec(html)) !== null) {
          links.push({
            url: match[1],
            text: match[2].trim()
          });
        }

        return links;
      },

      extractImages(html) {
        const images = [];
        const imgRegex = /<img[^>]*src=["\']([^"\']+)["\'][^>]*alt=["\']([^"\']*)["\'][^>]*>/gi;
        let match;

        while ((match = imgRegex.exec(html)) !== null) {
          images.push({
            src: match[1],
            alt: match[2]
          });
        }

        return images;
      }
    });

    const inputData = $input.all();

    // Extract sources from input data
    const sources = inputData.filter(item => item.url).map(item => ({
      url: item.url,
      type: item.sourceType || 'web',
      method: item.method,
      headers: item.headers,
      body: item.body
    }));

    if (sources.length === 0) {
      return [{
        error: 'No valid sources found in input data',
        inputData
      }];
    }

    const extractedContent = await extractor.extractFromMultipleSources(sources);

    return [{
      sources,
      extractedContent,
      extractionStats: extractor.getExtractionStats(),
      totalContentItems: extractedContent.length
    }];
  `
}
```## Step 3:
 AI Analysis Pipeline Implementation

### Comprehensive AI Content Analyzer

**AI Analysis Orchestrator Node:**
```javascript
{
  "nodeName": "AI Analysis Orchestrator",
  "code": `
    class AIAnalysisOrchestrator {
      constructor(aiManager) {
        this.aiManager = aiManager;
        this.analysisTypes = new Map();
        this.analysisResults = new Map();
        this.processingStats = {
          totalAnalyses: 0,
          successfulAnalyses: 0,
          failedAnalyses: 0,
          totalProcessingTime: 0
        };
      }

      registerAnalysisType(name, config) {
        this.analysisTypes.set(name, {
          model: config.model,
          systemPrompt: config.systemPrompt,
          promptTemplate: config.promptTemplate,
          outputFormat: config.outputFormat || 'json',
          maxRetries: config.maxRetries || 2,
          timeout: config.timeout || 30000,
          postProcessor: config.postProcessor
        });
      }

      async analyzeContent(content, analysisTypes = []) {
        const startTime = performance.now();
        const results = {};

        // Run analyses in parallel for efficiency
        const analysisPromises = analysisTypes.map(async (analysisType) => {
          try {
            const result = await this.runSingleAnalysis(content, analysisType);
            results[analysisType] = result;
            this.processingStats.successfulAnalyses++;
            return { type: analysisType, result, success: true };
          } catch (error) {
            console.error(\`Analysis \${analysisType} failed:\`, error);
            results[analysisType] = { error: error.message, success: false };
            this.processingStats.failedAnalyses++;
            return { type: analysisType, error: error.message, success: false };
          }
        });

        await Promise.allSettled(analysisPromises);

        const endTime = performance.now();
        this.processingStats.totalAnalyses += analysisTypes.length;
        this.processingStats.totalProcessingTime += endTime - startTime;

        return {
          content: content,
          analyses: results,
          processingTime: endTime - startTime,
          timestamp: new Date().toISOString()
        };
      }

      async runSingleAnalysis(content, analysisType) {
        const config = this.analysisTypes.get(analysisType);
        if (!config) {
          throw new Error(\`Analysis type '\${analysisType}' not registered\`);
        }

        const prompt = this.buildPrompt(content, config);
        const modelResponse = await this.aiManager.processWithModel(
          config.model,
          prompt,
          {
            systemPrompt: config.systemPrompt,
            maxTokens: config.maxTokens || 1000,
            temperature: config.temperature || 0.3
          }
        );

        let result = modelResponse.content;

        // Parse JSON if expected
        if (config.outputFormat === 'json') {
          try {
            result = JSON.parse(result);
          } catch (error) {
            console.warn(\`Failed to parse JSON response for \${analysisType}:\`, error);
            // Try to extract JSON from the response
            const jsonMatch = result.match(/\\{[^}]*\\}/);
            if (jsonMatch) {
              try {
                result = JSON.parse(jsonMatch[0]);
              } catch {
                result = { rawResponse: result, parseError: true };
              }
            } else {
              result = { rawResponse: result, parseError: true };
            }
          }
        }

        // Apply post-processing if configured
        if (config.postProcessor) {
          result = config.postProcessor(result, content);
        }

        return {
          result,
          metadata: {
            model: config.model,
            analysisType,
            usage: modelResponse.usage,
            processingTime: modelResponse.timestamp
          }
        };
      }

      buildPrompt(content, config) {
        let prompt = config.promptTemplate;

        // Replace placeholders in the prompt template
        prompt = prompt.replace(/\\{\\{content\\}\\}/g, this.truncateContent(content.text || content, 3000));
        prompt = prompt.replace(/\\{\\{title\\}\\}/g, content.title || 'No title');
        prompt = prompt.replace(/\\{\\{url\\}\\}/g, content.source || 'Unknown source');
        prompt = prompt.replace(/\\{\\{contentType\\}\\}/g, content.contentType || 'text');

        return prompt;
      }

      truncateContent(text, maxLength) {
        if (text.length <= maxLength) return text;

        // Try to truncate at sentence boundary
        const truncated = text.substring(0, maxLength);
        const lastSentence = truncated.lastIndexOf('.');

        if (lastSentence > maxLength * 0.8) {
          return truncated.substring(0, lastSentence + 1);
        }

        return truncated + '...';
      }

      async batchAnalyzeContent(contentItems, analysisTypes) {
        const results = [];
        const batchSize = 3; // Process in small batches to manage API rate limits

        for (let i = 0; i < contentItems.length; i += batchSize) {
          const batch = contentItems.slice(i, i + batchSize);
          const batchPromises = batch.map(content =>
            this.analyzeContent(content, analysisTypes));

          const batchResults = await Promise.allSettled(batchPromises);

          batchResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              results.push(result.value);
            } else {
              console.error(\`Batch analysis failed for item \${i + index}:\`, result.reason);
              results.push({
                content: batch[index],
                analyses: {},
                error: result.reason.message,
                processingTime: 0,
                timestamp: new Date().toISOString()
              });
            }
          });

          // Add delay between batches
          if (i + batchSize < contentItems.length) {
            await this.delay(2000);
          }
        }

        return results;
      }

      async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      getProcessingStats() {
        return {
          ...this.processingStats,
          successRate: this.processingStats.successfulAnalyses / this.processingStats.totalAnalyses,
          averageProcessingTime: this.processingStats.totalProcessingTime / this.processingStats.totalAnalyses
        };
      }
    }

    // Initialize AI Analysis Orchestrator
    const aiManager = $input.first().aiManager; // Get from previous node
    const orchestrator = new AIAnalysisOrchestrator(aiManager);

    // Register different types of AI analyses
    orchestrator.registerAnalysisType('sentiment', {
      model: 'sentiment-analyzer',
      systemPrompt: 'You are an expert sentiment analyzer. Analyze the emotional tone and sentiment of the given content.',
      promptTemplate: \`Analyze the sentiment of the following content and provide a detailed analysis:

      Content: {{content}}

      Please provide your analysis in the following JSON format:
      {
        "overallSentiment": "positive|negative|neutral",
        "confidence": 0.95,
        "emotionalTone": ["excited", "optimistic"],
        "keyPhrases": ["great product", "highly recommend"],
        "sentimentScore": 0.8,
        "reasoning": "Brief explanation of the sentiment analysis"
      }\`,
      outputFormat: 'json'
    });

    orchestrator.registerAnalysisType('topics', {
      model: 'gpt-4',
      systemPrompt: 'You are an expert content analyzer specializing in topic extraction and categorization.',
      promptTemplate: \`Extract and categorize the main topics from the following content:

      Content: {{content}}

      Provide your analysis in JSON format:
      {
        "mainTopics": ["topic1", "topic2", "topic3"],
        "categories": ["category1", "category2"],
        "keywords": ["keyword1", "keyword2", "keyword3"],
        "topicConfidence": {"topic1": 0.9, "topic2": 0.7},
        "contentType": "news|blog|product|academic|other",
        "summary": "Brief summary of the main topics discussed"
      }\`,
      outputFormat: 'json'
    });

    orchestrator.registerAnalysisType('entities', {
      model: 'gpt-4',
      systemPrompt: 'You are an expert in named entity recognition and extraction.',
      promptTemplate: \`Extract named entities from the following content:

      Content: {{content}}

      Provide entities in JSON format:
      {
        "people": ["John Doe", "Jane Smith"],
        "organizations": ["Company Inc", "Organization Name"],
        "locations": ["New York", "California"],
        "dates": ["2024-01-15", "January 2024"],
        "products": ["Product Name", "Service Name"],
        "technologies": ["AI", "Machine Learning"],
        "other": ["Other Entity"],
        "entityRelationships": [
          {"entity1": "John Doe", "relationship": "works_at", "entity2": "Company Inc"}
        ]
      }\`,
      outputFormat: 'json'
    });

    orchestrator.registerAnalysisType('quality', {
      model: 'gpt-4',
      systemPrompt: 'You are a content quality analyst. Evaluate content for readability, accuracy, and overall quality.',
      promptTemplate: \`Evaluate the quality of the following content:

      Content: {{content}}

      Provide quality assessment in JSON format:
      {
        "overallQuality": "excellent|good|fair|poor",
        "readabilityScore": 0.85,
        "accuracyAssessment": "high|medium|low",
        "completeness": 0.9,
        "clarity": 0.8,
        "engagement": 0.7,
        "issues": ["issue1", "issue2"],
        "strengths": ["strength1", "strength2"],
        "recommendations": ["recommendation1", "recommendation2"],
        "qualityScore": 0.82
      }\`,
      outputFormat: 'json'
    });

    orchestrator.registerAnalysisType('insights', {
      model: 'gpt-4',
      systemPrompt: 'You are a strategic analyst. Generate actionable insights and recommendations from content.',
      promptTemplate: \`Generate strategic insights from the following content:

      Content: {{content}}
      Source: {{url}}

      Provide insights in JSON format:
      {
        "keyInsights": ["insight1", "insight2", "insight3"],
        "trends": ["trend1", "trend2"],
        "opportunities": ["opportunity1", "opportunity2"],
        "risks": ["risk1", "risk2"],
        "recommendations": [
          {"action": "action1", "priority": "high", "rationale": "reason1"},
          {"action": "action2", "priority": "medium", "rationale": "reason2"}
        ],
        "marketImplications": "Analysis of market implications",
        "competitiveAdvantage": "Potential competitive advantages identified"
      }\`,
      outputFormat: 'json'
    });

    const inputData = $input.all();
    const contentItems = inputData.filter(item => item.extractedContent).flatMap(item => item.extractedContent);

    if (contentItems.length === 0) {
      return [{
        error: 'No extracted content found for analysis',
        inputData
      }];
    }

    // Define which analyses to run
    const analysisTypes = ['sentiment', 'topics', 'entities', 'quality', 'insights'];

    // Run batch analysis
    const analysisResults = await orchestrator.batchAnalyzeContent(contentItems, analysisTypes);

    return [{
      originalData: inputData,
      analysisResults,
      processingStats: orchestrator.getProcessingStats(),
      totalAnalyzedItems: analysisResults.length,
      analysisTypes
    }];
  `
}
```

## Step 4: Intelligence Synthesis and Pattern Recognition

### Advanced Pattern Recognition Engine

**Intelligence Synthesis Node:**
```javascript
{
  "nodeName": "Intelligence Synthesis Engine",
  "code": `
    class IntelligenceSynthesis {
      constructor() {
        this.patterns = new Map();
        this.trends = new Map();
        this.insights = new Map();
        this.synthesisRules = new Map();
      }

      registerSynthesisRule(name, rule) {
        this.synthesisRules.set(name, rule);
      }

      async synthesizeIntelligence(analysisResults) {
        const synthesis = {
          crossSourcePatterns: await this.identifyCrossSourcePatterns(analysisResults),
          trendAnalysis: await this.analyzeTrends(analysisResults),
          sentimentAggregation: this.aggregateSentiment(analysisResults),
          topicClustering: this.clusterTopics(analysisResults),
          entityRelationships: this.mapEntityRelationships(analysisResults),
          qualityMetrics: this.calculateQualityMetrics(analysisResults),
          strategicInsights: await this.generateStrategicInsights(analysisResults),
          anomalies: this.detectAnomalies(analysisResults),
          recommendations: await this.generateRecommendations(analysisResults)
        };

        return synthesis;
      }

      async identifyCrossSourcePatterns(results) {
        const patterns = {
          commonTopics: this.findCommonTopics(results),
          sentimentCorrelations: this.findSentimentCorrelations(results),
          entityOverlaps: this.findEntityOverlaps(results),
          contentSimilarities: await this.calculateContentSimilarities(results)
        };

        return patterns;
      }

      findCommonTopics(results) {
        const topicFrequency = new Map();
        const sourceTopics = new Map();

        results.forEach((result, index) => {
          const topics = result.analyses.topics?.result?.mainTopics || [];
          sourceTopics.set(index, topics);

          topics.forEach(topic => {
            topicFrequency.set(topic, (topicFrequency.get(topic) || 0) + 1);
          });
        });

        // Find topics that appear in multiple sources
        const commonTopics = Array.from(topicFrequency.entries())
          .filter(([topic, count]) => count > 1)
          .sort((a, b) => b[1] - a[1])
          .map(([topic, count]) => ({
            topic,
            frequency: count,
            sources: this.findTopicSources(topic, sourceTopics)
          }));

        return commonTopics;
      }

      findTopicSources(targetTopic, sourceTopics) {
        const sources = [];
        for (const [sourceIndex, topics] of sourceTopics.entries()) {
          if (topics.includes(targetTopic)) {
            sources.push(sourceIndex);
          }
        }
        return sources;
      }

      findSentimentCorrelations(results) {
        const sentiments = results.map(result => ({
          source: result.content.source,
          sentiment: result.analyses.sentiment?.result?.overallSentiment,
          score: result.analyses.sentiment?.result?.sentimentScore || 0
        })).filter(s => s.sentiment);

        const sentimentDistribution = {
          positive: sentiments.filter(s => s.sentiment === 'positive').length,
          negative: sentiments.filter(s => s.sentiment === 'negative').length,
          neutral: sentiments.filter(s => s.sentiment === 'neutral').length
        };

        const averageScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;

        return {
          distribution: sentimentDistribution,
          averageScore,
          sentimentConsistency: this.calculateSentimentConsistency(sentiments),
          outliers: this.findSentimentOutliers(sentiments)
        };
      }

      calculateSentimentConsistency(sentiments) {
        if (sentiments.length < 2) return 1;

        const scores = sentiments.map(s => s.score);
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
        const standardDeviation = Math.sqrt(variance);

        // Consistency is inverse of standard deviation (normalized)
        return Math.max(0, 1 - (standardDeviation / 0.5));
      }

      findSentimentOutliers(sentiments) {
        const scores = sentiments.map(s => s.score);
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const stdDev = Math.sqrt(scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length);

        return sentiments.filter(s => Math.abs(s.score - mean) > 2 * stdDev);
      }

      findEntityOverlaps(results) {
        const entityMap = new Map();

        results.forEach((result, index) => {
          const entities = result.analyses.entities?.result || {};

          Object.entries(entities).forEach(([type, entityList]) => {
            if (Array.isArray(entityList)) {
              entityList.forEach(entity => {
                const key = \`\${type}:\${entity}\`;
                if (!entityMap.has(key)) {
                  entityMap.set(key, { entity, type, sources: [] });
                }
                entityMap.get(key).sources.push(index);
              });
            }
          });
        });

        // Find entities mentioned in multiple sources
        const overlaps = Array.from(entityMap.values())
          .filter(item => item.sources.length > 1)
          .sort((a, b) => b.sources.length - a.sources.length);

        return overlaps;
      }

      async calculateContentSimilarities(results) {
        const similarities = [];

        for (let i = 0; i < results.length; i++) {
          for (let j = i + 1; j < results.length; j++) {
            const similarity = this.calculateTextSimilarity(
              results[i].content.text || '',
              results[j].content.text || ''
            );

            if (similarity > 0.3) { // Only include significant similarities
              similarities.push({
                source1: i,
                source2: j,
                similarity,
                commonElements: this.findCommonElements(results[i], results[j])
              });
            }
          }
        }

        return similarities.sort((a, b) => b.similarity - a.similarity);
      }

      calculateTextSimilarity(text1, text2) {
        // Simple Jaccard similarity based on word sets
        const words1 = new Set(text1.toLowerCase().split(/\\s+/));
        const words2 = new Set(text2.toLowerCase().split(/\\s+/));

        const intersection = new Set([...words1].filter(word => words2.has(word)));
        const union = new Set([...words1, ...words2]);

        return intersection.size / union.size;
      }

      findCommonElements(result1, result2) {
        const common = {
          topics: [],
          entities: [],
          sentiment: null
        };

        // Common topics
        const topics1 = result1.analyses.topics?.result?.mainTopics || [];
        const topics2 = result2.analyses.topics?.result?.mainTopics || [];
        common.topics = topics1.filter(topic => topics2.includes(topic));

        // Common entities
        const entities1 = result1.analyses.entities?.result || {};
        const entities2 = result2.analyses.entities?.result || {};

        Object.keys(entities1).forEach(type => {
          if (entities2[type]) {
            const commonEntities = entities1[type].filter(entity =>
              entities2[type].includes(entity));
            if (commonEntities.length > 0) {
              common.entities.push({ type, entities: commonEntities });
            }
          }
        });

        // Sentiment alignment
        const sentiment1 = result1.analyses.sentiment?.result?.overallSentiment;
        const sentiment2 = result2.analyses.sentiment?.result?.overallSentiment;
        if (sentiment1 === sentiment2) {
          common.sentiment = sentiment1;
        }

        return common;
      }

      analyzeTrends(results) {
        const trends = {
          topicTrends: this.analyzeTopicTrends(results),
          sentimentTrends: this.analyzeSentimentTrends(results),
          qualityTrends: this.analyzeQualityTrends(results),
          entityTrends: this.analyzeEntityTrends(results)
        };

        return trends;
      }

      analyzeTopicTrends(results) {
        const topicFrequency = new Map();

        results.forEach(result => {
          const topics = result.analyses.topics?.result?.mainTopics || [];
          topics.forEach(topic => {
            topicFrequency.set(topic, (topicFrequency.get(topic) || 0) + 1);
          });
        });

        const sortedTopics = Array.from(topicFrequency.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        return {
          trending: sortedTopics.map(([topic, count]) => ({
            topic,
            frequency: count,
            percentage: (count / results.length) * 100
          })),
          totalUniqueTopics: topicFrequency.size,
          averageTopicsPerSource: Array.from(topicFrequency.values()).reduce((sum, count) => sum + count, 0) / results.length
        };
      }

      analyzeSentimentTrends(results) {
        const sentiments = results.map(result =>
          result.analyses.sentiment?.result?.overallSentiment).filter(Boolean);

        const distribution = {
          positive: sentiments.filter(s => s === 'positive').length,
          negative: sentiments.filter(s => s === 'negative').length,
          neutral: sentiments.filter(s => s === 'neutral').length
        };

        const total = sentiments.length;

        return {
          distribution,
          percentages: {
            positive: (distribution.positive / total) * 100,
            negative: (distribution.negative / total) * 100,
            neutral: (distribution.neutral / total) * 100
          },
          dominantSentiment: Object.entries(distribution).reduce((a, b) =>
            distribution[a[0]] > distribution[b[0]] ? a : b)[0],
          sentimentDiversity: this.calculateSentimentDiversity(distribution)
        };
      }

      calculateSentimentDiversity(distribution) {
        const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
        if (total === 0) return 0;

        // Calculate Shannon diversity index
        const proportions = Object.values(distribution).map(count => count / total);
        return -proportions.reduce((sum, p) => p > 0 ? sum + p * Math.log2(p) : sum, 0);
      }

      analyzeQualityTrends(results) {
        const qualityScores = results.map(result =>
          result.analyses.quality?.result?.qualityScore).filter(score => score !== undefined);

        if (qualityScores.length === 0) return null;

        const average = qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
        const min = Math.min(...qualityScores);
        const max = Math.max(...qualityScores);

        return {
          averageQuality: average,
          qualityRange: { min, max },
          qualityDistribution: this.categorizeQualityScores(qualityScores),
          qualityConsistency: this.calculateQualityConsistency(qualityScores)
        };
      }

      categorizeQualityScores(scores) {
        return {
          excellent: scores.filter(s => s >= 0.8).length,
          good: scores.filter(s => s >= 0.6 && s < 0.8).length,
          fair: scores.filter(s => s >= 0.4 && s < 0.6).length,
          poor: scores.filter(s => s < 0.4).length
        };
      }

      calculateQualityConsistency(scores) {
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
        return 1 - Math.sqrt(variance); // Higher consistency = lower variance
      }

      analyzeEntityTrends(results) {
        const entityFrequency = new Map();

        results.forEach(result => {
          const entities = result.analyses.entities?.result || {};
          Object.entries(entities).forEach(([type, entityList]) => {
            if (Array.isArray(entityList)) {
              entityList.forEach(entity => {
                const key = \`\${type}:\${entity}\`;
                entityFrequency.set(key, (entityFrequency.get(key) || 0) + 1);
              });
            }
          });
        });

        const topEntities = Array.from(entityFrequency.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20)
          .map(([key, count]) => {
            const [type, entity] = key.split(':');
            return { type, entity, frequency: count };
          });

        return {
          topEntities,
          entityTypes: this.analyzeEntityTypes(topEntities),
          totalUniqueEntities: entityFrequency.size
        };
      }

      analyzeEntityTypes(entities) {
        const typeFrequency = new Map();
        entities.forEach(entity => {
          typeFrequency.set(entity.type, (typeFrequency.get(entity.type) || 0) + entity.frequency);
        });

        return Array.from(typeFrequency.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([type, frequency]) => ({ type, frequency }));
      }

      aggregateSentiment(results) {
        const sentiments = results.map(result => result.analyses.sentiment?.result).filter(Boolean);

        if (sentiments.length === 0) return null;

        const overallScore = sentiments.reduce((sum, s) => sum + (s.sentimentScore || 0), 0) / sentiments.length;
        const confidence = sentiments.reduce((sum, s) => sum + (s.confidence || 0), 0) / sentiments.length;

        const emotionalTones = new Map();
        sentiments.forEach(s => {
          (s.emotionalTone || []).forEach(tone => {
            emotionalTones.set(tone, (emotionalTones.get(tone) || 0) + 1);
          });
        });

        return {
          overallScore,
          confidence,
          dominantTones: Array.from(emotionalTones.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tone, count]) => ({ tone, frequency: count })),
          sentimentConsistency: this.calculateSentimentConsistency(sentiments.map(s => ({ score: s.sentimentScore || 0 })))
        };
      }

      clusterTopics(results) {
        const allTopics = results.flatMap(result =>
          result.analyses.topics?.result?.mainTopics || []);

        const topicFrequency = new Map();
        allTopics.forEach(topic => {
          topicFrequency.set(topic, (topicFrequency.get(topic) || 0) + 1);
        });

        // Simple clustering based on frequency and similarity
        const clusters = this.performTopicClustering(Array.from(topicFrequency.keys()));

        return {
          clusters,
          totalTopics: topicFrequency.size,
          topicDistribution: Array.from(topicFrequency.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
        };
      }

      performTopicClustering(topics) {
        // Simple keyword-based clustering
        const clusters = new Map();

        topics.forEach(topic => {
          const words = topic.toLowerCase().split(/\\s+/);
          let assigned = false;

          for (const [clusterName, clusterTopics] of clusters.entries()) {
            if (this.hasCommonWords(words, clusterName.split(/\\s+/))) {
              clusterTopics.push(topic);
              assigned = true;
              break;
            }
          }

          if (!assigned) {
            clusters.set(topic, [topic]);
          }
        });

        return Array.from(clusters.entries()).map(([name, topics]) => ({
          clusterName: name,
          topics,
          size: topics.length
        }));
      }

      hasCommonWords(words1, words2) {
        return words1.some(word => words2.includes(word));
      }

      mapEntityRelationships(results) {
        const relationships = [];

        results.forEach(result => {
          const entityRels = result.analyses.entities?.result?.entityRelationships || [];
          relationships.push(...entityRels);
        });

        // Group relationships by type
        const relationshipTypes = new Map();
        relationships.forEach(rel => {
          const type = rel.relationship;
          if (!relationshipTypes.has(type)) {
            relationshipTypes.set(type, []);
          }
          relationshipTypes.get(type).push(rel);
        });

        return {
          totalRelationships: relationships.length,
          relationshipTypes: Array.from(relationshipTypes.entries()).map(([type, rels]) => ({
            type,
            count: rels.length,
            examples: rels.slice(0, 3)
          })),
          networkDensity: this.calculateNetworkDensity(relationships)
        };
      }

      calculateNetworkDensity(relationships) {
        const entities = new Set();
        relationships.forEach(rel => {
          entities.add(rel.entity1);
          entities.add(rel.entity2);
        });

        const maxPossibleRelationships = entities.size * (entities.size - 1) / 2;
        return maxPossibleRelationships > 0 ? relationships.length / maxPossibleRelationships : 0;
      }

      calculateQualityMetrics(results) {
        const qualityResults = results.map(result => result.analyses.quality?.result).filter(Boolean);

        if (qualityResults.length === 0) return null;

        const metrics = {
          averageReadability: this.calculateAverage(qualityResults, 'readabilityScore'),
          averageCompleteness: this.calculateAverage(qualityResults, 'completeness'),
          averageClarity: this.calculateAverage(qualityResults, 'clarity'),
          averageEngagement: this.calculateAverage(qualityResults, 'engagement'),
          overallQuality: this.calculateAverage(qualityResults, 'qualityScore')
        };

        return {
          ...metrics,
          qualityDistribution: this.categorizeQualityScores(qualityResults.map(q => q.qualityScore)),
          commonIssues: this.aggregateIssues(qualityResults),
          commonStrengths: this.aggregateStrengths(qualityResults)
        };
      }

      calculateAverage(results, field) {
        const values = results.map(r => r[field]).filter(v => v !== undefined);
        return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
      }

      aggregateIssues(qualityResults) {
        const issueFrequency = new Map();

        qualityResults.forEach(result => {
          (result.issues || []).forEach(issue => {
            issueFrequency.set(issue, (issueFrequency.get(issue) || 0) + 1);
          });
        });

        return Array.from(issueFrequency.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([issue, count]) => ({ issue, frequency: count }));
      }

      aggregateStrengths(qualityResults) {
        const strengthFrequency = new Map();

        qualityResults.forEach(result => {
          (result.strengths || []).forEach(strength => {
            strengthFrequency.set(strength, (strengthFrequency.get(strength) || 0) + 1);
          });
        });

        return Array.from(strengthFrequency.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([strength, count]) => ({ strength, frequency: count }));
      }

      async generateStrategicInsights(results) {
        const insights = results.map(result => result.analyses.insights?.result).filter(Boolean);

        if (insights.length === 0) return null;

        return {
          keyInsights: this.aggregateInsights(insights, 'keyInsights'),
          trends: this.aggregateInsights(insights, 'trends'),
          opportunities: this.aggregateInsights(insights, 'opportunities'),
          risks: this.aggregateInsights(insights, 'risks'),
          recommendations: this.aggregateRecommendations(insights),
          strategicThemes: this.identifyStrategicThemes(insights)
        };
      }

      aggregateInsights(insights, field) {
        const aggregated = new Map();

        insights.forEach(insight => {
          (insight[field] || []).forEach(item => {
            aggregated.set(item, (aggregated.get(item) || 0) + 1);
          });
        });

        return Array.from(aggregated.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([item, frequency]) => ({ item, frequency }));
      }

      aggregateRecommendations(insights) {
        const recommendations = new Map();

        insights.forEach(insight => {
          (insight.recommendations || []).forEach(rec => {
            const key = rec.action || rec;
            if (!recommendations.has(key)) {
              recommendations.set(key, {
                action: key,
                frequency: 0,
                priorities: [],
                rationales: []
              });
            }

            const existing = recommendations.get(key);
            existing.frequency++;
            if (rec.priority) existing.priorities.push(rec.priority);
            if (rec.rationale) existing.rationales.push(rec.rationale);
          });
        });

        return Array.from(recommendations.values())
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 10);
      }

      identifyStrategicThemes(insights) {
        const themes = new Map();

        insights.forEach(insight => {
          // Extract themes from market implications and competitive advantages
          const text = (insight.marketImplications || '') + ' ' + (insight.competitiveAdvantage || '');
          const words = text.toLowerCase().match(/\\b\\w{4,}\\b/g) || [];

          words.forEach(word => {
            themes.set(word, (themes.get(word) || 0) + 1);
          });
        });

        return Array.from(themes.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([theme, frequency]) => ({ theme, frequency }));
      }

      detectAnomalies(results) {
        const anomalies = [];

        // Detect sentiment anomalies
        const sentimentScores = results.map(r => r.analyses.sentiment?.result?.sentimentScore).filter(Boolean);
        if (sentimentScores.length > 0) {
          const sentimentAnomalies = this.detectOutliers(sentimentScores, 'sentiment');
          anomalies.push(...sentimentAnomalies);
        }

        // Detect quality anomalies
        const qualityScores = results.map(r => r.analyses.quality?.result?.qualityScore).filter(Boolean);
        if (qualityScores.length > 0) {
          const qualityAnomalies = this.detectOutliers(qualityScores, 'quality');
          anomalies.push(...qualityAnomalies);
        }

        // Detect content length anomalies
        const contentLengths = results.map(r => (r.content.text || '').length);
        const lengthAnomalies = this.detectOutliers(contentLengths, 'content_length');
        anomalies.push(...lengthAnomalies);

        return anomalies;
      }

      detectOutliers(values, type) {
        if (values.length < 3) return [];

        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);

        const outliers = [];
        values.forEach((value, index) => {
          const zScore = Math.abs((value - mean) / stdDev);
          if (zScore > 2) { // More than 2 standard deviations
            outliers.push({
              type,
              index,
              value,
              zScore,
              deviation: value - mean,
              severity: zScore > 3 ? 'high' : 'medium'
            });
          }
        });

        return outliers;
      }

      async generateRecommendations(results) {
        const synthesis = await this.synthesizeIntelligence(results);
        const recommendations = [];

        // Content quality recommendations
        if (synthesis.qualityMetrics && synthesis.qualityMetrics.overallQuality < 0.7) {
          recommendations.push({
            category: 'content_quality',
            priority: 'high',
            recommendation: 'Improve content quality across sources',
            rationale: \`Average quality score is \${synthesis.qualityMetrics.overallQuality.toFixed(2)}, below recommended threshold of 0.7\`,
            actions: synthesis.qualityMetrics.commonIssues.map(issue => \`Address: \${issue.issue}\`)
          });
        }

        // Sentiment recommendations
        if (synthesis.sentimentAggregation && synthesis.sentimentAggregation.overallScore < 0.3) {
          recommendations.push({
            category: 'sentiment_management',
            priority: 'medium',
            recommendation: 'Address negative sentiment patterns',
            rationale: \`Overall sentiment score is \${synthesis.sentimentAggregation.overallScore.toFixed(2)}, indicating negative sentiment\`,
            actions: ['Investigate sources of negative sentiment', 'Develop sentiment improvement strategy']
          });
        }

        // Topic diversity recommendations
        if (synthesis.topicClustering && synthesis.topicClustering.clusters.length < 3) {
          recommendations.push({
            category: 'content_diversity',
            priority: 'low',
            recommendation: 'Increase topic diversity',
            rationale: 'Limited topic diversity detected across content sources',
            actions: ['Expand content source variety', 'Include more diverse topic areas']
          });
        }

        // Strategic recommendations from AI insights
        if (synthesis.strategicInsights && synthesis.strategicInsights.recommendations) {
          synthesis.strategicInsights.recommendations.forEach(rec => {
            recommendations.push({
              category: 'strategic',
              priority: this.determinePriority(rec.priorities),
              recommendation: rec.action,
              rationale: rec.rationales.join('; '),
              frequency: rec.frequency,
              actions: ['Implement strategic recommendation', 'Monitor implementation results']
            });
          });
        }

        return recommendations.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
      }

      determinePriority(priorities) {
        if (!priorities || priorities.length === 0) return 'medium';

        const priorityCounts = { high: 0, medium: 0, low: 0 };
        priorities.forEach(p => priorityCounts[p] = (priorityCounts[p] || 0) + 1);

        return Object.entries(priorityCounts).reduce((a, b) =>
          priorityCounts[a[0]] > priorityCounts[b[0]] ? a : b)[0];
      }
    }

    const inputData = $input.all();
    const analysisResults = inputData.filter(item => item.analysisResults).flatMap(item => item.analysisResults);

    if (analysisResults.length === 0) {
      return [{
        error: 'No analysis results found for synthesis',
        inputData
      }];
    }

    const synthesisEngine = new IntelligenceSynthesis();
    const intelligence = await synthesisEngine.synthesizeIntelligence(analysisResults);

    return [{
      originalData: inputData,
      intelligenceSynthesis: intelligence,
      totalAnalyzedSources: analysisResults.length,
      synthesisTimestamp: new Date().toISOString()
    }];
  `
}
```