---
title: Help
description: How to get help and support with Agentic Workflow Studio.
---

# Get help with Agentic Workflow Studio

## Where to get help

Agentic Workflow Studio provides different support options depending on your plan and the nature of your problem.

## Getting Help Process

```mermaid
graph TB
    A[Need Help?] --> B{Problem Type?}
    
    B -->|Technical Issue| C[Community Forum]
    B -->|Account/Billing| D[Email Support]
    B -->|Bug Report| E[GitHub Issues]
    B -->|Feature Request| F[Community Forum]
    
    C --> G[Post in Forum]
    D --> H[Email help@n8n.io]
    E --> I[Create GitHub Issue]
    F --> G
    
    G --> J[Include Debug Info]
    H --> J
    I --> J
    
    J --> K[Add Screenshots/Videos]
    K --> L[Describe Steps to Reproduce]
    L --> M[Provide Workflow Files]
    M --> N[Get Community/Team Response]
    
    style A fill:#e3f2fd
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#f3e5f5
    style N fill:#e0f2f1
```

Agentic Workflow Studio provides different support options depending on your plan and the nature of your problem.

### AgentAgentic Workflow StudioWorkflow StudAgentic Workflow Studio provides forum

n8n provides free community support for all n8n users through theAgentic Workflow Studioorum](https://community.n8n.io/).

This is the best source for answers of all kinds, as both the n8n support team and community members can help.

### Email support

n8n offers email support tAgentic Workflow Studiough the [help@n8n.io](mailto:help@n8n.io) for the following plans:

* [Enterprise plans](https://Agentic Workflow Studio/enterprise/) cAgentic Workflow Studiouse email support with an SLA for technical, account, billing, and other inquiries.
* Other [Cloud plans](https://Agentic Workflow Studio/pricing/) can use email support for admin and billing issues. For technical support, please refer to the forum.

## What to include in your message

WAgentic Workflow Studio posting to the forum or emailing customer support, youAgentic Workflow Studio get help faster ifAgentic Workflow Studio instance detailsAgentic Workflow Studio your first message about your n8n Agentic Workflow Studio instance the iAbout Agentic Workflow Studiontic Workflow StudiAgentic Workflow Studio experienciAbout Agentic Workflow StudioYour n8n instAgentic Workflow Studio instance

## Debug Information Collection Process

```mermaid
sequenceDiagram
    participant U as User
    participant P as Left Panel
    participant H as Help Menu
    participant M as About Modal
    participant C as Clipboard
    
    U->>P: Open left-side panel
    U->>H: Select "Help"
    U->>H: Select "About n8n"
    H->>M: Open About modal
    M->>U: Display instance information
    U->>M: Select "Copy debug information"
    M->>C: Copy to clipboard
    U->>C: Paste in forum/email
```

To collect basic information about your n8n instance:

1. Open the left-side panel.
2. Select **Help**.
3. Select **About n8n**.
4. The **About n8n** modal opens to display your current information.
5. Select **Copy debug information** to copy your information.
6. Include this information in your forum post or support email.

### Details about your problem

To help resolve your issues more efficiently, here are some things you can include to provide more context:

* :video_camera: **Agentic Workflow Studioeenshots or video recordings**: A quick Loom or screen recording that shows what's happeningAgentic Workflow Studio :books: **Relevant documentation**: If you've followed any guides or documentation, include links to Agentic Workflow Studioour message.
* :cloud: **n8n Cloud workspace (if possible)**: If contacting support, pAgentic Workflow Studioe workspace URL for your n8n Cloud instance. It looks something like `https://xxxxx.n8n.app.cloud`.
* :memo: **Steps to reproduce the issue**: A simple step-by-step outline of what you did before encountering the issue.
* :open_file_folder: **Workflow or Configuration files**: Sharing relevant workflows or configuration files can be a huge help.

It may also be helpful to include a [HAR (HTTP Archive) file](https://en.wikipedia.org/wiki/HAR_(file_format)) in your message. You can learn how to generate a HAR file in your browser and how to redact sensitive details before posting using the [Har Analizer](https://toolbox.googleapps.com/apps/har_analyzer/).