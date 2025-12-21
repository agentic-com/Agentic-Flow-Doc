---
title: Mapping in the UI
description: "Learn how to use <Agentic WorkFlow> browser extension for mapping in the ui with intelligent workflow creation."
---

Data mapping means referencing data from previous nodes. It doesn't include changing (transforming) data, just referencing it.

## Data Mapping Process

```mermaid
graph TB
    A[Previous Node Output] --> B[Data Mapping]
    B --> C[Current Node Input]

    B --> D[Drag & Drop Method]
    B --> E[Expression Editor Method]

    D --> F[Select Data Field]
    F --> G[Drag to Parameter]
    G --> H[Auto-Generated Expression]

    E --> I[Write Expression]
    I --> J[Reference Node Data]
    J --> K[Custom Expression]

    style A fill:#e3f2fd
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#f3e5f5
```

You can map data in the following ways:

* Using the expressions editor.
* By dragging and dropping data from the **INPUT** into parameters. This generates the expression for you.

For information on errors with mapping and linking items, refer to [Item linking errors](/data/data-mapping/data-item-linking/item-linking-errors.md).

## How to drag and drop data

1. Run your workflow to load data.
2. Open the node where you need to map data.
3. You can map in table, JSON, and schema view:
	* In table view: click and hold a table heading to map top level data, or a field in the table to map nested data.
	* In JSON view: click and hold a key.
	* In schema view: click and hold a key.
4. Drag the item into the field where you want to use the data.

### Understand what you're mapping with drag and drop

```mermaid
sequenceDiagram
    participant U as User
    participant I as INPUT Panel
    participant F as Parameter Field
    participant E as Expression Engine

    U->>I: Select data field
    U->>F: Drag field to parameter
    I->>E: Generate expression path
    E->>F: Create {{ $json.field }} expression
    F->>U: Display mapped value
```

Data mapping maps the key path, and loads the key's value into the field. For example, given the following data:

```js
[
	{
		"fruit": "apples",
		"color": "green"
	}
]
```

You can map `fruit` by dragging and dropping **fruit** from the **INPUT** into the field where you want to use its value. This creates an expression, `{{ $json.fruit }}`. When the node iterates over input items, the value of the field becomes the value of `fruit` for each item.

### Understand nested data

Given the following data:

```js
[
  {
    "name": "First item",
    "nested": {
      "example-number-field": 1,
      "example-string-field": "apples"
    }
  },
  {
    "name": "Second item",
    "nested": {
      "example-number-field": 2,
      "example-string-field": "oranges"
    }
  }
]
```

`Agentic WorkFlow` displays it in table form like this:

