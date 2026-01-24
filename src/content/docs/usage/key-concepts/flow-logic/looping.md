---
title: Looping
description: "Learn how to use <Agentic WorkFlow> browser extension for looping with intelligent workflow creation."
sidebar:
  order: 3
---

Looping is useful when you want to process multiple items or perform an action repeatedly, such as sending a message to every contact in your address book. `Agentic WorkFlow` handles this repetitive processing automatically, meaning you don't need to specifically build loops into your workflows.

## Using loops in `Agentic WorkFlow`

```mermaid
flowchart TB
 subgraph s1["Outputs"]
        A1["Item 1"]
        A2["Item 2"]
        A3["Item 3"]
        A4["Item N..."]
  end
 subgraph s2["Output 2"]
        C1["Result 1"]
        C2["Result 2"]
        C3["Result 3"]
        C4["Result N..."]
  end
    A["Action 1"] L_A_s1_0@--> s1
    B["Node Processing"] L_B_s2_0@--> s2
    s1 L_s1_B_0@--> B
    A1 x--x A2
    A2 x--x A3
    A3 x--x A4
    n2[" "] L_n2_A_0@--> A
    C1 x--x C2
    C2 x--x C3
    C3 x--x C4

    n2@{ icon: "fa:circle-play", pos: "b"}
    style A fill:#e3f2fd
    style B fill:#e8f5e8

    L_A_s1_0@{ animation: slow } 
    L_B_s2_0@{ animation: slow } 
    L_s1_B_0@{ animation: slow } 
    L_n2_A_0@{ animation: slow } 
```

`Agentic WorkFlow` nodes take any number of items as input, process these items, and output the results. You can think of each item as a single data point, or a single row in the output table of a node.

Nodes usually run once for each item. 


### Executing nodes once

:::caution
Coming soon
:::

## Creating loops

`Agentic WorkFlow` typically handles the iteration for all incoming items. However, there are certain scenarios where you will have to create a loop to iterate through all items. Refer to [Node exceptions](#node-exceptions) for a list of nodes that don't automatically iterate over all incoming items.

### Loop until a condition is met

```mermaid
flowchart TB
    A["Start"] L_A_B_0@--> B["Process Node"]
    B L_B_C_0@--> C["IF Node"]
    C L_C_D_0@-- Condition Met --> D["Continue Workflow"]
    C L_C_B_0@-- Condition Not Met --> B

    A@{ shape: rounded}
    B@{ shape: rounded}
    C@{ shape: rounded}
    D@{ shape: rounded}
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#f3e5f5

    L_A_B_0@{ animation: slow } 
    L_B_C_0@{ animation: slow } 
    L_C_D_0@{ animation: slow } 
    L_C_B_0@{ animation: slow } 
```

To create a loop in an `Agentic WorkFlow` workflow, connect the output of one node to the input of a previous node. Add an [IF](/nodes/builtin/core/flow/if) node to check when to stop the loop.

### Loop until all items are processed

:::caution
Coming soon
:::