---
title: Create
description: "Learn how to use Agentic Workflow Studio browser extension for create with intelligent workflow creation."
sidebar:
    order: 1
---

Credentials allow your workflows to securely connect to external services and APIs. Creating and managing credentials ensures your browser automation can integrate with various platforms while keeping sensitive information secure.

## Credential Creation Process

```mermaid
graph TB
    A[Access Credentials Panel] --> B[Select Credential Type]
    B --> C[Enter Credential Details]
    C --> D[Test Connection]
    D --> E{Connection Successful?}
    E -->|Yes| F[Save Credential]
    E -->|No| G[Check Details]
    G --> C
    F --> H[Use in Workflows]

    B --> B1[API Keys]
    B --> B2[OAuth Tokens]
    B --> B3[Username/Password]
    B --> B4[Custom Headers]

    style A fill:#e3f2fd
    style F fill:#e8f5e8
    style H fill:#fff3e0
```

## Credential Management Best Practices

- **Security**: Credentials are encrypted and stored securely within the browser extension
- **Reusability**: Create credentials once and use them across multiple workflows
- **Testing**: Always test credentials before using them in production workflows
- **Organization**: Use descriptive names to easily identify credentials for different services
