---
title: Error Handling
description: "Learn how to use Agentic Workflow Studio browser extension for error handling with intelligent workflow creation."
sidebar:
  order: 6
---

When designing browser-based workflows, it's important to consider potential errors specific to the browser environment and set up methods to handle them gracefully. Browser workflows face unique challenges like page loading issues, content security policies, and DOM changes.

/// note | Investigating browser workflow errors
To investigate failed browser workflow executions, you can:

* Review your execution history in the browser extension interface
* Check browser console logs for JavaScript errors or security violations
* Verify that the target web page content and structure haven't changed
* Ensure browser permissions are properly configured for the extension
///

## Common Browser Workflow Errors

**Content Security Policy (CSP) violations**: Some websites restrict browser extension access
**DOM element not found**: Page structure changes can break element selectors
**Cross-origin restrictions**: Limitations on accessing content from different domains
**Page loading issues**: Network problems or slow-loading pages can cause timeouts
**Permission errors**: Browser extension permissions may be insufficient for certain operations

## Create and set an error workflow

For each browser workflow, you can set an error workflow in **Workflow Settings**. It runs if an execution fails due to browser-specific issues. This allows you to handle errors gracefully, such as retrying with different parameters or logging browser-specific error information.

Browser error workflows can:
* Retry operations with different selectors or timing
* Log detailed browser state information for debugging
* Provide fallback data extraction methods
* Send notifications about browser automation failures

## Error data

--8<-- "_snippets/integrations/builtin/core-nodes/error-trigger/error-data.md"

## Cause a workflow execution failure using Stop And Error

When you create and set an error workflow, Agentic Workflow Studio runs it when an execution fails. In browser environments, this is often due to page content changes, security restrictions, or network issues.

You can add the [Stop And Error](/integration/builtin/flow/StopAndError/) node to your workflow to force executions to fail under specific browser conditions, such as:
* When required page elements are not found
* When browser permissions are insufficient
* When page content doesn't match expected patterns
* When security policies prevent data extraction
