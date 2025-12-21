---
title: Tools Agent
description: "Intelligent AI agent that can dynamically select and execute browser tools and APIs to accomplish complex automation tasks."
template: doc
tags: ["AI", "LLM", "Machine Learning", "Natural Language Processing", "Artificial Intelligence"]
---

# Tools Agent

## Overview

The Tools Agent node represents the most sophisticated AI automation capability in browser workflows. This node creates an intelligent agent that can reason about tasks, select appropriate tools from available browser APIs and workflow nodes, and execute complex multi-step operations autonomously. It bridges the gap between AI reasoning and practical browser automation.

### Purpose and Functionality

The Tools Agent node enables:

- Autonomous task execution using AI reasoning and tool selection
- Dynamic integration with browser APIs and extension capabilities
- Multi-step workflow automation with intelligent decision-making
- Adaptive problem-solving based on real-time feedback and results
- Integration of AI planning with practical browser manipulation tools

### Key Features

- **Tool Selection Intelligence**: AI automatically chooses the best tools for each task
- **Browser API Integration**: Direct access to browser extension APIs and web manipulation tools
- **Multi-Step Planning**: Breaks complex tasks into executable steps with tool chains
- **Error Recovery**: Intelligent error handling and alternative approach selection
- **Real-Time Adaptation**: Adjusts strategy based on intermediate results and feedback

### Primary Use Cases

- **Complex Web Automation**: Multi-step browser tasks requiring intelligent decision-making
- **Adaptive Data Extraction**: Dynamic content extraction that adapts to different website structures
- **Intelligent Form Filling**: Smart form completion with validation and error handling
- **Research Automation**: Comprehensive research tasks involving multiple sources and tools
- **Quality Assurance**: Automated testing and validation with intelligent verification

## Parameters & Configuration

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `llm` | `LLM Connection` | The language model for agent reasoning and planning | `OpenAI GPT-4` |
| `task_description` | `string` | Clear description of the task to accomplish | `"Extract contact information from company websites"` |
| `available_tools` | `array` | List of tools/nodes the agent can use | `["GetHTMLFromLink", "EditFields", "Filter"]` |

### Optional Parameters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `max_iterations` | `number` | `10` | Maximum number of tool execution steps | `5` |
| `planning_mode` | `string` | `"adaptive"` | Planning strategy: adaptive, sequential, parallel | `"sequential"` |
| `error_tolerance` | `string` | `"medium"` | How to handle errors: strict, medium, permissive | `"strict"` |
| `output_format` | `string` | `"structured"` | Expected output format: structured, natural, custom | `"natural"` |
| `timeout` | `number` | `300000` | Maximum execution time in milliseconds | `180000` |

### Advanced Configuration

```json
{
  "llm": "OpenAI GPT-4",
  "task_description": "Research and compile information about AI startups founded in 2024",
  "available_tools": [
    "GetAllTextFromLink",
    "GetHTMLFromLink", 
    "EditFields",
    "Filter",
    "BasicLLMChain",
    "DownloadAsFile"
  ],
  "max_iterations": 8,
  "planning_mode": "adaptive",
  "error_tolerance": "medium",
  "output_format": "structured",
  "timeout": 240000,
  "tool_preferences": {
    "GetAllTextFromLink": "preferred_for_content_extraction",
    "BasicLLMChain": "use_for_analysis_only"
  },
  "success_criteria": "Complete information for at least 5 companies"
}
```

## Browser API Integration

### Required Permissions

| Permission | Purpose | Security Impact |
|------------|---------|-----------------|
| `activeTab` | Access and manipulate current browser tab | Can read and modify content in active tabs |
| `tabs` | Create and manage browser tabs for multi-page tasks | Can open, close, and navigate browser tabs |
| `storage` | Store intermediate results and agent state | Stores execution history and temporary data |
| `scripting` | Execute content scripts for web page interaction | Can inject and run scripts in web pages |

### Browser APIs Used

- **Chrome Extension APIs**: Full access to chrome.tabs, chrome.scripting, and chrome.storage
- **Content Script Injection**: Dynamic script injection for web page manipulation
- **Background Processing**: Manages long-running agent tasks without blocking UI
- **Cross-Tab Communication**: Coordinates actions across multiple browser tabs

### Cross-Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Tool Execution | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |
| Multi-Tab Management | ✅ Full | ✅ Full | ❌ None | ✅ Full |
| Content Script Injection | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full |
| Background Processing | ✅ Full | ✅ Full | ✅ Full | ✅ Full |

### Security Considerations

- **Tool Access Control**: Restricts agent to explicitly authorized tools and APIs
- **Execution Sandboxing**: Each tool execution is isolated and monitored
- **Data Privacy**: Intermediate results are encrypted and automatically cleaned up
- **Permission Validation**: Verifies browser permissions before tool execution
- **Rate Limiting**: Prevents excessive API usage and browser resource consumption

## Input/Output Specifications

### Input Data Structure

```json
{
  "task_description": "string - Clear description of the task to accomplish",
  "context": {
    "starting_url": "string - Initial URL or starting point (optional)",
    "constraints": "array - Any limitations or requirements",
    "expected_output": "string - Description of desired output format"
  },
  "tools_config": {
    "tool_name": {
      "parameters": "object - Default parameters for this tool",
      "priority": "number - Tool selection priority"
    }
  },
  "metadata": {
    "user_id": "string - User identifier",
    "session_id": "string - Session context",
    "timestamp": "string - Task initiation time"
  }
}
```

### Output Data Structure

```json
{
  "task_result": "object - The final result of the task execution",
  "execution_plan": [
    {
      "step": "number - Step number in execution sequence",
      "tool": "string - Tool/node used in this step",
      "action": "string - Description of action performed",
      "input": "object - Input data for this step",
      "output": "object - Output data from this step",
      "success": "boolean - Whether step completed successfully",
      "duration": "number - Step execution time in milliseconds"
    }
  ],
  "agent_reasoning": [
    {
      "decision_point": "string - What decision was being made",
      "reasoning": "string - AI reasoning for the decision",
      "alternatives": "array - Other options considered",
      "confidence": "number - Confidence in the decision"
    }
  ],
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "total_duration": 45000,
    "steps_executed": 6,
    "tools_used": ["GetAllTextFromLink", "EditFields", "Filter"],
    "success_rate": 0.95,
    "source": "tools_agent"
  }
}
```

## Practical Examples

### Example 1: Competitive Research Automation

**Scenario**: Research competitor pricing and features across multiple websites

**Configuration**:
```json
{
  "llm": "OpenAI GPT-4",
  "task_description": "Visit competitor websites and extract pricing information and key features for SaaS products",
  "available_tools": [
    "GetAllTextFromLink",
    "GetHTMLFromLink",
    "EditFields",
    "Filter",
    "BasicLLMChain"
  ],
  "max_iterations": 12,
  "planning_mode": "adaptive",
  "output_format": "structured"
}
```

**Input Data**:
```json
{
  "task_description": "Visit competitor websites and extract pricing information and key features for SaaS products",
  "context": {
    "starting_url": "https://competitor1.com/pricing",
    "constraints": ["Extract at least 3 pricing tiers", "Include feature comparisons"],
    "expected_output": "Structured comparison table"
  },
  "tools_config": {
    "GetAllTextFromLink": {
      "parameters": {"extract_structured": true},
      "priority": 1
    },
    "BasicLLMChain": {
      "parameters": {"temperature": 0.1},
      "priority": 2
    }
  }
}
```

**Expected Output**:
```json
{
  "task_result": {
    "competitors_analyzed": 3,
    "pricing_data": [
      {
        "company": "Competitor 1",
        "tiers": [
          {"name": "Basic", "price": "$29/month", "features": ["Feature A", "Feature B"]},
          {"name": "Pro", "price": "$79/month", "features": ["Feature A", "Feature B", "Feature C"]}
        ]
      }
    ]
  },
  "execution_plan": [
    {
      "step": 1,
      "tool": "GetAllTextFromLink",
      "action": "Extract pricing page content",
      "input": {"url": "https://competitor1.com/pricing"},
      "output": {"content": "Pricing information extracted..."},
      "success": true,
      "duration": 2500
    },
    {
      "step": 2,
      "tool": "BasicLLMChain",
      "action": "Structure pricing information",
      "input": {"content": "Raw pricing text..."},
      "output": {"structured_data": "Organized pricing tiers..."},
      "success": true,
      "duration": 3200
    }
  ],
  "agent_reasoning": [
    {
      "decision_point": "Tool selection for content extraction",
      "reasoning": "GetAllTextFromLink chosen over GetHTMLFromLink for cleaner text extraction",
      "alternatives": ["GetHTMLFromLink", "Code"],
      "confidence": 0.85
    }
  ],
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "total_duration": 45000,
    "steps_executed": 6,
    "tools_used": ["GetAllTextFromLink", "BasicLLMChain", "EditFields"],
    "success_rate": 1.0,
    "source": "tools_agent"
  }
}
```

**Step-by-Step Process**:
1. Agent analyzes task and creates execution plan
2. Visits first competitor website using GetAllTextFromLink
3. Extracts and structures pricing information using BasicLLMChain
4. Repeats process for additional competitors
5. Compiles results into structured comparison format
6. Validates completeness against success criteria

### Example 2: Intelligent Form Automation

**Scenario**: Fill out job application forms across multiple career websites with adaptive field detection

**Configuration**:
```json
{
  "llm": "OpenAI GPT-4",
  "task_description": "Complete job application forms on career websites using provided resume data",
  "available_tools": [
    "GetHTMLFromLink",
    "FormFiller",
    "GetSelectedText",
    "InsertText",
    "Filter"
  ],
  "max_iterations": 15,
  "planning_mode": "sequential",
  "error_tolerance": "medium"
}
```

**Workflow Integration**:
```
Tools Agent → Filter → EditFields → DownloadAsFile
     ↓           ↓         ↓            ↓
multi_step_execution → validation → formatting → report_generation
```

**Complete Example**:
This pattern demonstrates how the Tools Agent can handle complex, multi-step automation tasks that require intelligent adaptation to different website structures and form layouts.

## Integration Patterns

### Common Node Combinations

#### Pattern 1: Research and Analysis Pipeline
- **Nodes**: Tools Agent → Filter → EditFields → DownloadAsFile
- **Use Case**: Complex research tasks with intelligent tool selection and result compilation
- **Configuration Tips**: Use adaptive planning mode for maximum flexibility

#### Pattern 2: Multi-Source Data Collection
- **Nodes**: Tools Agent → Merge → BasicLLMChain → LocalKnowledge
- **Use Case**: Collect data from multiple sources and integrate into knowledge base
- **Data Flow**: Autonomous collection → Data merging → AI analysis → Knowledge storage

### Best Practices

- **Performance**: Limit max_iterations to prevent infinite loops and control execution time
- **Error Handling**: Use appropriate error_tolerance settings based on task criticality
- **Data Validation**: Always validate agent outputs before using in downstream processes
- **Resource Management**: Monitor browser resource usage during complex agent tasks

## Troubleshooting

### Common Issues

#### Issue: Agent Gets Stuck in Loops

- **Symptoms**: Agent repeats the same actions without making progress
- **Causes**: Unclear task description, insufficient success criteria, or tool limitations
- **Solutions**:
  1. Provide more specific task descriptions and success criteria
  2. Reduce max_iterations to force completion
  3. Add explicit constraints to guide agent behavior
  4. Review available tools for task appropriateness
- **Prevention**: Test agent behavior with clear, measurable objectives

#### Issue: Tool Selection Errors

- **Symptoms**: Agent chooses inappropriate tools for specific tasks
- **Causes**: Insufficient tool descriptions, conflicting tool capabilities, or unclear task requirements
- **Solutions**:
  1. Provide detailed tool descriptions and capabilities
  2. Set tool preferences in configuration
  3. Limit available tools to task-appropriate options
  4. Improve task description clarity
- **Prevention**: Carefully curate available tools for specific use cases

### Browser-Specific Issues

#### Chrome
- Extension manifest v3 requirements may limit some tool capabilities
- Use service workers for background agent processing

#### Firefox
- WebExtension API differences may affect tool availability
- Ensure proper error handling for unsupported browser features

### Performance Issues

- **Slow Execution**: Complex tasks may take significant time; implement progress monitoring
- **Memory Usage**: Long-running agents may consume browser memory; implement cleanup procedures
- **Rate Limiting**: Multiple API calls may trigger rate limits; implement intelligent throttling

## Limitations & Constraints

### Technical Limitations

- **Tool Dependencies**: Agent effectiveness depends on available tool quality and capabilities
- **Planning Complexity**: Very complex tasks may exceed AI planning capabilities
- **Execution Time**: Long-running tasks may timeout or impact browser performance

### Browser Limitations

- **Permission Constraints**: Agent capabilities are limited by browser extension permissions
- **Cross-Origin Restrictions**: Some websites may block automated interactions
- **Resource Limits**: Browser memory and processing constraints may limit agent complexity

### Data Limitations

- **Context Windows**: LLM token limits may restrict agent reasoning for very complex tasks
- **Tool Integration**: Not all workflow nodes may be suitable for agent automation
- **Real-Time Adaptation**: Agent may not handle rapidly changing web content effectively

## Key Terminology

**LLM**: Large Language Model - AI models trained on vast amounts of text data

**RAG**: Retrieval-Augmented Generation - AI technique combining information retrieval with text generation

**Vector Store**: Database optimized for storing and searching high-dimensional vectors

**Embeddings**: Numerical representations of text that capture semantic meaning

**Prompt**: Input text that guides AI model behavior and response generation

**Temperature**: Parameter controlling randomness in AI responses (0.0-1.0)

**Tokens**: Units of text processing used by AI models for input and output measurement


## Search & Discovery

### Keywords
- artificial intelligence
- machine learning
- natural language processing
- LLM
- AI agent
- chatbot
- text generation
- language model

### Common Search Terms
- "ai"
- "llm"
- "gpt"
- "chat"
- "generate"
- "analyze"
- "understand"
- "process text"
- "smart"
- "intelligent"

### Primary Use Cases
- content analysis
- text generation
- question answering
- document processing
- intelligent automation
- knowledge extraction


## Learning Path

### Skill Level: Intermediate

**Prerequisites:**
- Understand [BasicLLMChainNode](/integration/builtin/ai/basicllmchainnode)
- Understand [Http-Request](/integration/builtin/ai/http-request)


## Enhanced Cross-References

### Workflow Patterns
- [AI-Powered Analysis Patterns](/learning/workflow-patterns/ai-analysis-patterns)
- [Knowledge Base Integration](/learning/workflow-patterns/knowledge-integration)
- [Intelligent Content Processing](/learning/workflow-patterns/content-processing)

### Related Tutorials
- [Building Your First AI Workflow](/learning/text-courses/beginner/first-ai-workflow)
- [Advanced AI Integration](/learning/text-courses/advanced/ai-powered-analysis)

### Practical Examples
- [Real-World Use Cases](/learning/examples/)
- [Integration Examples](/learning/examples/multi-node-automation)
- [Best Practice Examples](/learning/workflow-patterns/optimization-best-practices)

## Related Nodes

### Similar Functionality

- **BasicLLMChainNode**: Use when you need different approach to similar functionality
- **RAGNode**: Use when you need different approach to similar functionality

### Complementary Nodes

- **Http-Request**: Works well together in workflows
- **Code**: Works well together in workflows
- **GetAllTextFromLink**: Works well together in workflows

### Required Dependencies

- **Ollama**: Local LLM provider for AI processing
- **WbeLLM**: Web-based LLM provider for cloud AI services

### Common Workflow Patterns

- **ToolsAgentNode → Http-Request → EditFields**: Common integration pattern
- **GetAllTextFromLink → ToolsAgentNode → Code**: Common integration pattern

### See Also

- [AI Workflow Builder Tutorial](/advanced-ai/basics/ai-workflow-builder)
- [Understanding AI Agents](/advanced-ai/examples/understand-agents)
- [Understanding AI Chains](/advanced-ai/examples/understand-chains)
- [Understanding Memory](/advanced-ai/examples/understand-memory)
- [Understanding Tools](/advanced-ai/examples/understand-tools)
- [Vector Database Guide](/advanced-ai/examples/understand-vector-databases)
- [LangChain Integration](/advanced-ai/langchain/langchain-n8n)
- [AI Performance Optimization](/advanced-ai/performance-optimization)

**Decision Guides:**
- [AI Processing Decision Guide](#ai-processing-decision-guide)

**General Resources:**
- [Workflow Patterns](/learning/workflow-patterns/)
- [Integration Examples](/learning/examples/)
- [Node Types Overview](/integration/builtin/node-types)


## Version History

### Current Version: 1.5.0

- Added adaptive planning modes and improved tool selection
- Enhanced error recovery and alternative strategy selection
- Improved browser compatibility and performance optimization

### Previous Versions

- **1.4.0**: Added multi-tab management and cross-tab communication
- **1.3.0**: Improved agent reasoning and decision logging
- **1.2.0**: Enhanced tool integration and execution monitoring
- **1.1.0**: Added error tolerance settings and timeout management
- **1.0.0**: Initial release with basic agent functionality

## Additional Resources

- [Tools Agent Examples](/advanced-ai/examples/understand-agents)
- [Agent Workflow Patterns](/advanced-ai/examples/end-to-end-ai-workflows)
- [Browser Automation Guide](/advanced-ai/examples/intelligent-web-automation)
- [AI Performance Optimization](/advanced-ai/performance-optimization)

---

**Last Updated**: October 19, 2024  
**Tested With**: Browser Extension v2.1.0  
**Validation Status**: ✅ Code Examples Tested | ✅ Browser Compatibility Verified | ✅ User Tested