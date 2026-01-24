---
title: Splitting
description: "Learn how to use <Agentic WorkFlow> browser extension for splitting with intelligent workflow creation."
sidebar:
  order: 1
---

Splitting uses the [IF](/nodes/builtin/core-nodes/if) or [Switch](/nodes/builtin/core-nodes/switch) nodes. It turns a single-branch workflow into a multi-branch workflow. This is a key piece of representing complex logic in `Agentic WorkFlow`.

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

This is the power of splitting and conditional nodes in `Agentic WorkFlow`.

Refer to the [IF](/nodes/builtin/core-nodes/if) or [Switch](/nodes/builtin/core-nodes/switch) documentation for usage details.
