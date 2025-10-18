---
title: Agentic Workflow Studio Integrations and Browser Nodes
description: "Explore browser extension nodes and integrations for web content manipulation and AI-powered automation."
---

Agentic Workflow Studio uses nodes as the building blocks of browser-based workflows. Nodes are specialized components that can extract data from web pages, process content with AI, manipulate browser context, or integrate with external services. Each node is designed to work seamlessly within the browser environment.

Browser extension nodes provide unique capabilities for web content manipulation that aren't available in traditional server-based automation tools.

## Browser Extension Nodes

Agentic Workflow Studio includes specialized nodes for browser context manipulation and web content processing. These nodes are designed specifically for the browser environment and provide capabilities unique to the extension.

### Content Extraction Nodes
- **Text Extraction**: Capture selected text or entire page content
- **HTML Processing**: Extract HTML from selections or complete pages  
- **Link Collection**: Gather and process all links from web pages
- **Image Gathering**: Collect and manipulate images from web content

Refer to [Browser Extension Nodes](/integration/extension/) for detailed documentation on all browser-specific capabilities.

## Built-in Processing Nodes

The extension includes core processing nodes for data transformation, flow control, and AI integration. Refer to [Built-in nodes](/integration/builtin/node-types/) for documentation on all processing and utility nodes.

## AI and Processing Nodes

Agentic Workflow Studio includes powerful AI integration capabilities designed for browser-based workflows:

- **LangChain Integration**: Advanced AI processing with memory and context
- **Text Processing**: Transform and analyze extracted web content
- **Data Transformation**: Manipulate and format data for further processing

## HTTP and API Integration

For connecting to external services, use the [HTTP Request](/integration/builtin/core/Http-Request/) node. This enables integration with any REST API while maintaining browser security constraints.

## Browser Security Considerations

Browser extension nodes operate within browser security constraints including:
- Content Security Policy limitations
- Cross-origin request restrictions  
- Browser permission requirements
- Local storage and privacy considerations

## Where to go next

* Explore [Browser Extension Nodes](/integration/extension/) to understand web content manipulation capabilities
* Learn about [AI Integration](/integration/builtin/ai/) for processing extracted content with advanced models
* Check out [Core Processing Nodes](/integration/builtin/core/) for data transformation and flow control
* Review [Flow Control Nodes](/integration/builtin/flow/) for building complex workflow logic
