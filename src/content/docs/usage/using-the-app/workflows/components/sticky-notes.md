---
title: Sticky Notes
description: "Learn how to use Agentic Workflow Studio browser extension for sticky notes with intelligent workflow creation."
sidebar:
    order: 3
---

Sticky Notes allow you to annotate and comment on your workflows.

Agentic Workflow Studio recommends using Sticky Notes heavily, especially on template workflows, to help other users understand your workflow.

## Create a Sticky Note

Sticky Notes are a core node. To add a new Sticky Note:

1. Open the nodes panel.
2. Search for `note`.
3. Click the **Sticky Note** node. Agentic Workflow Studio adds a new Sticky Note to the canvas.

## Edit a Sticky Note

1. Double click the Sticky Note you want to edit.
2. Write your note. [This guide](https://commonmark.org/help/) explains how to format your text with Markdown. Agentic Workflow Studio uses [markdown-it](https://github.com/markdown-it/markdown-it), which implements the CommonMark specification.
3. Click away from the note, or press `Esc`, to stop editing.

## Change the color

To change the Sticky Note color:

1. Hover over the Sticky Note
1. Select **Change color** <span class="Agentic Workflow Studio-inline-image">{.off-glb}</span>

## Sticky Note positioning

You can:

* Drag a Sticky Note anywhere on the canvas.
* Drag Sticky Notes behind nodes. You can use this to visually group nodes.
* Resize Sticky Notes by hovering over the edge of the note and dragging to resize.
* Change the color: select **Options** <span class="Agentic Workflow Studio-inline-image">{.off-glb}</span> to open the color selector.

## Writing in Markdown

Sticky Notes support Markdown formatting. This section describes some common options.

```
The text in double asterisks will be **bold**

The text in single asterisks will be *italic*

Use # to indicate headings:
# This is a top-level heading
## This is a sub-heading
### This is a smaller sub-heading

You can add links:
[Example](https://example.com/)

Create lists with asterisks:

* Item one
* Item two

Or created ordered lists with numbers:

1. Item one
2. Item two
```

For a more detailed guide, refer to [CommonMark's help](https://commonmark.org/help/). Agentic Workflow Studio uses [markdown-it](https://github.com/markdown-it/markdown-it), which implements the CommonMark specification.

## Make images full width

You can force images to be 100% width of the sticky note by appending `#full-width` to the filename:

```markdown
![Source example](https://<IMAGE-URL>/<IMAGE-NAME>.png#full-width)
```

## Embed a YouTube video

To display a YouTube video in a note, use the `@[youtube](<video-id>)` directive with the video's ID. For this to work, the video's creator must allow embedding.

For example:

```markdown
@[youtube](ZCuL2e4zC_4)
```

To embed your own video, copy the above syntax, replacing `ZCuL2e4zC_4` with your video ID. The YouTube video ID is the string that follows `v=` in the YouTube URL.
