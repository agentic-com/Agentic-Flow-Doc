---
title: Integration Patterns
description: Proven patterns for connecting browser workflows with external services, APIs, and systems
---

# Integration Patterns

Integration patterns enable browser workflows to connect with external services, databases, APIs, and other systems. This guide covers comprehensive patterns for building robust, scalable integrations.

## API Integration Pattern

### Overview
Connect browser workflows with REST APIs, GraphQL endpoints, and other web services for data exchange and processing.

### Use Cases
- Data synchronization with external systems
- Real-time data enrichment
- Third-party service integration
- Microservices communication

### Implementation

#### Workflow Structure
```
[Extract Data] → [Transform] → [HTTP Request] → [Handle Response] → [Process Result]
```

#### Step-by-Step Implementation

1. **Data Preparation**
   ```javascript
   // Prepare data for API consumption
   {
     "dataTransformation": {
       "mapping": {
         "apiField1": "{{extracted.field1}}",
         "apiField2": "{{extracted.field2}}",
         "timestamp": "{{now()}}"
       },
       "validation": {
         "required": ["apiField1"],
         "formats": {
           "apiField2": "email"
         }
       }
     }
   }
   ```

2. **HTTP Request Configuration**
   ```javascript
   // HTTP Request node configuration
   {
     "method": "POST",
     "url": "https://api.example.com/v1/data",
     "headers": {
       "Content-Type": "application/json",
       "Authorization": "Bearer {{credentials.apiToken}}",
       "X-Client-Version": "1.0.0"
     },
     "body": {
       "data": "{{transformedData}}",
       "metadata": {
         "source": "browser-workflow",
         "timestamp": "{{timestamp}}"
       }
     }
   }
   ```

3. **Response Handling**
   ```javascript
   // Process API response
   {
     "responseProcessing": {
       "successCodes": [200, 201, 202],
       "errorHandling": {
         "400": "validation_error",
         "401": "authentication_error",
         "429": "rate_limit_exceeded",
         "500": "server_error"
       },
       "retryConfig": {
         "maxRetries": 3,
         "backoffStrategy": "exponential",
         "retryableErrors": [429, 500, 502, 503, 504]
       }
     }
   }
   ```

4. **Result Processing**
   ```javascript
   // Process and store results
   {
     "resultProcessing": {
       "extractFields": ["id", "status", "createdAt"],
       "transformations": [
         {
           "field": "createdAt",
           "operation": "parseDate",
           "format": "ISO8601"
         }
       ],
       "storage": {
         "type": "local",
         "key": "api_results_{{id}}"
       }
     }
   }
   ```

### Advanced API Integration
```javascript
// GraphQL integration
{
  "graphqlConfig": {
    "endpoint": "https://api.example.com/graphql",
    "query": `
      mutation CreateRecord($input: RecordInput!) {
        createRecord(input: $input) {
          id
          status
          errors {
            field
            message
          }
        }
      }
    `,
    "variables": {
      "input": "{{preparedData}}"
    }
  }
}
```

## Database Integration Pattern

### Overview
Connect workflows with databases for data storage, retrieval, and management operations.

### Use Cases
- Workflow data persistence
- Historical data analysis
- Data warehousing
- Audit trail maintenance

### Implementation

#### Workflow Structure
```
[Prepare Query] → [Database Connection] → [Execute Operation] → [Process Results]
```

#### Step-by-Step Implementation

1. **Database Connection Setup**
   ```javascript
   // Database connection configuration
   {
     "connectionConfig": {
       "type": "postgresql",
       "host": "{{env.DB_HOST}}",
       "port": 5432,
       "database": "{{env.DB_NAME}}",
       "username": "{{credentials.dbUser}}",
       "password": "{{credentials.dbPassword}}",
       "ssl": true,
       "poolSize": 10
     }
   }
   ```

2. **Data Operations**
   ```javascript
   // Insert extracted data
   {
     "operation": "insert",
     "table": "extracted_data",
     "data": {
       "url": "{{source.url}}",
       "title": "{{extracted.title}}",
       "content": "{{extracted.content}}",
       "extracted_at": "{{timestamp}}",
       "metadata": "{{extracted.metadata}}"
     },
     "onConflict": "update"
   }
   ```

3. **Query Operations**
   ```javascript
   // Query existing data
   {
     "operation": "select",
     "query": `
       SELECT * FROM extracted_data
       WHERE url = $1
       AND extracted_at > $2
       ORDER BY extracted_at DESC
       LIMIT 10
     `,
     "parameters": ["{{source.url}}", "{{yesterday}}"]
   }
   ```

4. **Batch Operations**
   ```javascript
   // Batch insert for performance
   {
     "operation": "batchInsert",
     "table": "bulk_data",
     "batchSize": 1000,
     "data": "{{extractedArray}}",
     "conflictResolution": "ignore"
   }
   ```

## File System Integration Pattern

### Overview
Read from and write to local file systems for data persistence, configuration management, and file processing.

### Use Cases
- Configuration file management
- Data export and import
- Log file processing
- Backup and archival

### Implementation

#### Workflow Structure
```
[File Operation] → [Process Content] → [Transform] → [Write Result]
```

#### Step-by-Step Implementation

1. **File Reading Operations**
   ```javascript
   // Read configuration files
   {
     "operation": "read",
     "filePath": "./config/workflow-config.json",
     "encoding": "utf8",
     "parseAs": "json",
     "errorHandling": "useDefault"
   }
   ```

2. **File Writing Operations**
   ```javascript
   // Write processed data
   {
     "operation": "write",
     "filePath": "./output/extracted-data-{{timestamp}}.json",
     "content": "{{processedData}}",
     "format": "json",
     "createDirectories": true,
     "backup": true
   }
   ```

3. **File Processing**
   ```javascript
   // Process CSV files
   {
     "operation": "processCsv",
     "filePath": "./data/input.csv",
     "options": {
       "delimiter": ",",
       "headers": true,
       "skipEmptyLines": true
     },
     "transformations": [
       {
         "column": "date",
         "operation": "parseDate"
       }
     ]
   }
   ```

4. **Directory Operations**
   ```javascript
   // Directory management
   {
     "operation": "listDirectory",
     "path": "./data/processed",
     "filter": "*.json",
     "recursive": true,
     "sortBy": "modifiedDate"
   }
   ```

## Cross-Platform Integration Pattern

### Overview
Connect browser workflows with desktop applications, mobile apps, and other platforms.

### Use Cases
- Desktop application automation
- Mobile app data synchronization
- Cross-platform data sharing
- System integration workflows

### Implementation

#### Workflow Structure
```
[Platform Detection] → [Protocol Handler] → [Data Exchange] → [Response Processing]
```

#### Step-by-Step Implementation

1. **Platform Communication Setup**
   ```javascript
   // Native messaging configuration
   {
     "communicationMethod": "nativeMessaging",
     "applicationId": "com.example.desktop-app",
     "protocol": "json-rpc",
     "timeout": 30000
   }
   ```

2. **Data Exchange Protocol**
   ```javascript
   // Cross-platform data exchange
   {
     "message": {
       "method": "processData",
       "params": {
         "data": "{{extractedData}}",
         "options": {
           "format": "json",
           "compression": true
         }
       },
       "id": "{{generateId()}}"
     }
   }
   ```

3. **Response Handling**
   ```javascript
   // Handle platform responses
   {
     "responseHandling": {
       "successCallback": "processSuccess",
       "errorCallback": "handleError",
       "timeoutCallback": "handleTimeout",
       "validateResponse": true
     }
   }
   ```

## Real-time Integration Patterns

### WebSocket Integration
```javascript
// Real-time data streaming
{
  "websocketConfig": {
    "url": "wss://api.example.com/stream",
    "protocols": ["v1.api.example.com"],
    "reconnect": true,
    "maxReconnectAttempts": 5,
    "messageHandlers": {
      "data": "processStreamData",
      "error": "handleStreamError",
      "close": "handleStreamClose"
    }
  }
}
```

### Server-Sent Events
```javascript
// SSE integration
{
  "sseConfig": {
    "url": "https://api.example.com/events",
    "eventTypes": ["update", "delete", "create"],
    "reconnect": true,
    "headers": {
      "Authorization": "Bearer {{token}}"
    }
  }
}
```

## Authentication and Security Patterns

### OAuth 2.0 Integration
```javascript
// OAuth authentication flow
{
  "oauthConfig": {
    "authUrl": "https://auth.example.com/oauth/authorize",
    "tokenUrl": "https://auth.example.com/oauth/token",
    "clientId": "{{credentials.clientId}}",
    "clientSecret": "{{credentials.clientSecret}}",
    "scopes": ["read", "write"],
    "redirectUri": "https://localhost:3000/callback"
  }
}
```

### API Key Management
```javascript
// Secure API key handling
{
  "apiKeyConfig": {
    "storage": "encrypted",
    "rotation": {
      "enabled": true,
      "interval": "30d",
      "notifyBefore": "7d"
    },
    "validation": {
      "testEndpoint": "/api/v1/validate",
      "expectedResponse": {"status": "valid"}
    }
  }
}
```

## Error Handling and Resilience

### Circuit Breaker Pattern
```javascript
// Circuit breaker for external services
{
  "circuitBreaker": {
    "failureThreshold": 5,
    "timeout": 60000,
    "resetTimeout": 300000,
    "monitoringWindow": 600000,
    "fallbackAction": "useCache"
  }
}
```

### Retry Strategies
```javascript
// Advanced retry configuration
{
  "retryStrategy": {
    "maxAttempts": 3,
    "backoffType": "exponential",
    "baseDelay": 1000,
    "maxDelay": 30000,
    "jitter": true,
    "retryableErrors": [
      "NETWORK_ERROR",
      "TIMEOUT",
      "RATE_LIMIT"
    ]
  }
}
```

## Performance Optimization

### Connection Pooling
```javascript
// Optimize connection management
{
  "connectionPool": {
    "maxConnections": 10,
    "minConnections": 2,
    "acquireTimeout": 30000,
    "idleTimeout": 300000,
    "keepAlive": true
  }
}
```

### Caching Strategies
```javascript
// Multi-level caching
{
  "cachingConfig": {
    "levels": [
      {
        "type": "memory",
        "maxSize": "100MB",
        "ttl": 300
      },
      {
        "type": "redis",
        "host": "cache.example.com",
        "ttl": 3600
      }
    ],
    "strategies": {
      "read": "cache-first",
      "write": "write-through"
    }
  }
}
```

## Monitoring and Observability

### Metrics Collection
```javascript
// Integration metrics
{
  "metricsConfig": {
    "enabled": true,
    "endpoint": "https://metrics.example.com/v1/metrics",
    "metrics": [
      "request_count",
      "response_time",
      "error_rate",
      "throughput"
    ],
    "labels": {
      "service": "browser-workflow",
      "environment": "production"
    }
  }
}
```

### Health Checks
```javascript
// Service health monitoring
{
  "healthChecks": [
    {
      "name": "api_connectivity",
      "endpoint": "https://api.example.com/health",
      "interval": 30000,
      "timeout": 5000,
      "expectedStatus": 200
    }
  ]
}
```

## Best Practices

### Security
- **Credential Management**: Use secure credential storage
- **Data Encryption**: Encrypt sensitive data in transit and at rest
- **Access Control**: Implement proper authentication and authorization
- **Audit Logging**: Log all integration activities

### Performance
- **Connection Reuse**: Implement connection pooling
- **Batch Operations**: Use batch processing for bulk operations
- **Async Processing**: Use asynchronous operations where possible
- **Resource Management**: Monitor and manage resource usage

### Reliability
- **Error Handling**: Implement comprehensive error handling
- **Retry Logic**: Use appropriate retry strategies
- **Circuit Breakers**: Protect against cascading failures
- **Monitoring**: Implement thorough monitoring and alerting

### Maintainability
- **Documentation**: Document all integration points
- **Version Management**: Handle API versioning properly
- **Testing**: Implement integration testing
- **Configuration Management**: Use external configuration