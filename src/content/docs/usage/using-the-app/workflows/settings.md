---
title: Settings
description: "Learn how to use Agentic Workflow Studio browser extension for settings with intelligent workflow creation."
sidebar:
    order: 7
---

Workflow settings allow you to customize browser workflow behavior for individual workflows, including browser-specific execution options and security considerations.

## Access workflow settings

To open the settings:

1. Open your workflow in the browser extension interface.
2. Select the **settings icon** or **three dots menu** in the workflow toolbar.
3. Select **Settings**. Agentic Workflow Studio opens the **Workflow settings** panel.

## Available settings

The following settings are available for browser workflows:

### Execution order

Choose the execution order for multi-branch workflows:

**Sequential (recommended)** executes each branch in turn, completing one branch before starting another. Agentic Workflow Studio orders the branches based on their position on the canvas, from topmost to bottommost. If two branches are at the same height, the leftmost branch executes first.

This is particularly important for browser workflows where one branch might modify page content that affects subsequent branches.

### Browser permissions

Configure browser-specific permissions and security settings:

**Page access level**: Determine which pages the workflow can access
**Cross-origin requests**: Enable or restrict access to external domains
**Local storage access**: Allow workflows to read/write browser storage

### Error Workflow (to notify when this one errors)

Select a workflow to trigger if the current workflow fails due to browser-specific issues like page loading problems or security restrictions. See [error workflows](/usage/key-concepts/flow-logic/error-handling/) for more details.

### Browser context handling

Configure how the workflow handles browser context changes:

**Page navigation**: How to handle when the user navigates to a different page during execution
**Tab switching**: Behavior when the user switches browser tabs
**Page refresh**: How to handle page reloads during workflow execution

### Timezone

Sets the timezone for this workflow, which affects time-based operations and data processing. Browser workflows use the browser's local timezone by default.

### Performance settings

Configure browser-specific performance options:

**Memory usage**: Set limits for workflow memory consumption
**Execution timeout**: Maximum time allowed for workflow execution
**Concurrent operations**: Limit simultaneous browser operations to prevent performance issues

### Save failed executions

Whether to save failed executions for debugging browser-specific issues like page loading problems or security violations.

### Save successful executions

Whether to save successful executions for analysis and workflow optimization.

### Save manual executions

Whether to save executions for workflows started manually by the user in the browser extension.

### Save execution progress

Whether to save execution data for each node, which helps with debugging browser workflows but may impact performance.

### Timeout Workflow

Whether to cancel the current workflow execution after a certain amount of time elapses. This is particularly important for browser workflows that may encounter slow-loading pages or network issues.

When enabled, you can set the timeout duration. Browser workflows typically need shorter timeouts due to user interaction expectations.

### Privacy and security

Configure privacy settings for browser workflows:

**Data retention**: How long to keep extracted browser data
**Sensitive data handling**: Special handling for passwords, personal information, or financial data
**Local storage**: Whether to store workflow data locally in the browser
