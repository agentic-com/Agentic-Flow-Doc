---
title: Data structure
description: "Understand data structures and formats used in Agentic Workflow Studio browser extension workflows for web content processing."
---

In Agentic Workflow Studio, all data passed between nodes is an array of objects. This structure is particularly important when working with browser context data.

## Data Structure Overview

```mermaid
graph TB
    A[Node Output] --> B[Array of Objects]
    B --> C[Object 1]
    B --> D[Object 2]
    B --> E[Object N...]
    
    C --> F[json: Browser Data]
    C --> G[binary: File Data]
    
    F --> H[text, url, title, links...]
    G --> I[data, mimeType, fileName...]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style F fill:#e8f5e8
    style G fill:#fff3e0
```

The data structure has the following format:

```json
[
	{
		// For browser context data:
		// Wrap each item in another object, with the key 'json'
		"json": {
			// Example browser data
			"text": "Selected text from web page",
			"url": "https://example.com",
			"title": "Page Title",
			"links": [
				{"href": "https://example.com/page1", "text": "Link 1"},
				{"href": "https://example.com/page2", "text": "Link 2"}
			]
		},
		// For binary data (images, files):
		// Wrap each item in another object, with the key 'binary'
		"binary": {
			// Example image data from web page
			"page-screenshot": {
				"data": "....", // Base64 encoded binary data (required)
				"mimeType": "image/png", // Best practice to set if possible (optional)
				"fileExtension": "png", // Best practice to set if possible (optional)
				"fileName": "screenshot.png", // Best practice to set if possible (optional)
			}
		}
	},
]
```

/// note | Browser context data handling
Browser extension nodes automatically format extracted data into the proper structure. When using Code nodes to process browser data, Agentic Workflow Studio automatically adds the `json` key if it's missing and wraps items in an array as needed.
///

## Browser Data Types

Browser extension nodes extract different types of data from web pages:

```mermaid
graph LR
    A[Web Page] --> B[Text Data]
    A --> C[Link Data]
    A --> D[Image Data]
    A --> E[HTML Data]
    A --> F[Form Data]
    
    B --> B1[Selected Text]
    B --> B2[All Page Text]
    B --> B3[Element Text]
    
    C --> C1[URLs]
    C --> C2[Link Text]
    C --> C3[Link Attributes]
    
    D --> D1[Image URLs]
    D --> D2[Alt Text]
    D --> D3[Image Metadata]
    
    E --> E1[Raw HTML]
    E --> E2[Element HTML]
    E --> E3[Page Structure]
    
    F --> F1[Input Values]
    F --> F2[Form Structure]
    F --> F3[Form Metadata]
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#fce4ec
    style F fill:#e0f2f1
```

- **Text data**: Selected text, all page text, or specific element text
- **Link data**: URLs, link text, and link attributes
- **Image data**: Image URLs, alt text, and image metadata
- **HTML data**: Raw HTML content from selected elements or entire pages
- **Form data**: Input values, form structure, and form metadata
## Data item processing

--8<-- "_snippets/flow-logic/data-flow-nodes.md"


