---
title: Quick Intro
description: "Get started quickly with Agentic Workflow Studio browser extension - install and create your first AI-powered web automation workflow."
sidebar:
  order: 0
---

# The very quick quickstart

This quickstart gets you started using Agentic Workflow Studio as quickly as possible. It allows you to try out the browser-based workflow builder and introduces two key features: browser context manipulation and workflow creation. It doesn't include detailed explanations or explore concepts in-depth.

In this tutorial, you will:

* Install the browser extension
* Create your first browser-based workflow
* Extract text from a web page using browser context manipulation
* Run your first workflow


## Step one: Install the browser extension

Agentic Workflow Studio runs directly in your browser, making it easy to get started without any server setup.

1. Install the extension from your browser's extension store:
   - **Chrome**: [Chrome Web Store](https://chrome.google.com/webstore)
   - **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/firefox)
   - **Edge**: [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons)

2. Once installed, you'll see the Agentic Workflow Studio icon in your browser toolbar.
3. Click the icon to open the workflow builder interface.

This workflow will:

1. Extract text from the current web page using the [Get Selected Text](/integration/extension/GetSelectedText/) node.
2. Use the [Edit Fields](/integration/builtin/dataTransformation/EditFields/) node to process and format the extracted text.

The individual pieces in an Agentic Workflow Studio workflow are called nodes. Double click a node to explore its settings and how it processes browser data.

## Step two: Create your first workflow

1. In the workflow builder, select **Add first step**.
2. Search for **Get Selected Text** and select it to add the node to the canvas.
3. Navigate to any web page with text content.
4. Select some text on the page, then return to the workflow builder.
5. Select **Execute Workflow**. This runs the workflow and extracts the selected text from the web page.

## Step three: Add text processing

Add a second node to process the extracted text:

1. Select the **Add node** connector on the Get Selected Text node.
2. Search for **Edit Fields** and select it to add the node to the canvas.
3. Configure the Edit Fields node to format the extracted text:
   - In the **Fields to Set** section, add a new field called "processed_text"
   - Use an expression to transform the text:
     ```
     Extracted text: {{ $json.text }}
     Length: {{ $json.text.length }} characters
     ```
4. Select **Execute Workflow** to run the complete workflow.

## Congratulations!

You've created your first browser-based workflow that extracts and processes text from web pages. The workflow demonstrates the core power of Agentic Workflow Studio: seamlessly combining browser context manipulation with data processing.

## Next steps

* Read the [longer introduction tutorial](/usage/getting-started/quick-starts/long-intro/) for a more complex workflow with AI integration.
* Explore [browser extension nodes](/integration/extension/) to learn about all available browser context manipulation capabilities.
* Try [AI-powered workflows](/advanced-ai/) to combine browser data with artificial intelligence.

