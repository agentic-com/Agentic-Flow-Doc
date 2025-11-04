---
title: Transforming data
description: Processing and transforming browser context data in workflows.
---

Agentic Workflow Studio uses a predefined [data structure](/usage/key-concepts/data/data-structure/) that allows all nodes to process browser context data correctly.

Browser extension nodes extract data in various formats depending on the web page content. You may need to transform this data to process it effectively in your workflows.

For example, when extracting all links from a web page, you might get an array of link objects that need to be processed individually, or you might want to filter links based on specific criteria.

To transform browser context data, you can use the data transformation nodes:

* [Edit Fields](/integration/builtin/dataTransformation/EditFields/): modify, add, or remove fields from browser data
* [Filter](/integration/builtin/flow/Filter/): remove items that don't match specific criteria (useful for filtering extracted links or text)
* [Split Out](/integration/builtin/dataTransformation/): separate browser data containing lists (like multiple links or images) into individual items
* [Pick Field](/integration/builtin/dataTransformation/PickField/): select specific fields from complex browser data structures

## Common Browser Data Transformations

**Processing extracted links:**
- Filter links by domain or URL pattern
- Extract only external links or internal navigation
- Transform link data into specific formats for further processing

**Processing extracted text:**
- Clean and format text content
- Extract specific information using regular expressions
- Calculate text statistics (word count, character count)

**Processing extracted images:**
- Filter images by size, type, or URL pattern
- Extract image metadata and attributes
- Transform image URLs for processing or download

