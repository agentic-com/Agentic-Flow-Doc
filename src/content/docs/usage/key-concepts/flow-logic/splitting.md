---
title: Splitting
description: "Learn how to use <Agentic WorkFlow> browser extension for splitting with intelligent workflow creation."
sidebar:
  order: 1
---

Splitting means taking one workflow path and turning it into multiple paths.

The most common way to split is with an **If** node.

It lets your workflow do different things depending on a condition (for example: “is this text longer than 500 characters?”).

Compare these workflows:

```mermaid
flowchart LR
    n3[" "] L_n3_B_0@--> B["Extract Text"]
    B L_B_C_0@--> C["Send content per email"]

    n3@{ icon: "fa:circle-play", pos: "b"}
    B@{ shape: rounded}
    C@{ shape: rounded}

    L_n3_B_0@{ animation: slow } 
    L_B_C_0@{ animation: slow } 
```

```mermaid
flowchart LR
    B["Extract Text"] L_B_n1_0@--> n1["If content lenght &gt; 500 characters"]
    n1 L_n1_n2_0@--> n2["Send content to Whatsapp"] & C["Send content per email"]
    n3[" "] L_n3_B_0@--> B

    B@{ shape: rounded}
    n1@{ shape: diam}
    n2@{ shape: rounded}
    C@{ shape: rounded}
    n3@{ icon: "fa:circle-play", pos: "b"}

    L_B_n1_0@{ animation: slow } 
    L_n1_n2_0@{ animation: slow } 
    L_n1_C_0@{ animation: slow } 
    L_n3_B_0@{ animation: slow } 
```

This is the basic idea: one input → different actions depending on what you find.

See the node reference: [If](/nodes/builtin/flow/If/).
