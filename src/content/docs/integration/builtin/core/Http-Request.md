---
title: HTTP Request
description: "Make HTTP requests from browser workflows to integrate with external APIs and services while respecting browser security constraints."
---

The **HTTP Request** node allows you to make HTTP requests to external APIs and services from within your browser workflows. This node is essential for integrating browser-extracted data with external systems and services.

## Browser Security Considerations

When using HTTP requests in browser extension workflows, be aware of important security limitations:

### Cross-Origin Resource Sharing (CORS)

- Browser extensions must respect CORS policies
- Some APIs may not be accessible due to CORS restrictions
- Consider using APIs that explicitly support browser extension requests

### Content Security Policy (CSP)

- Requests must comply with the current page's CSP
- Some requests may be blocked by strict CSP policies
- Test requests on different websites to ensure compatibility

### Required Permissions

The browser extension needs appropriate permissions to make HTTP requests:

- `host_permissions`: For specific domains you want to access
- `activeTab`: For requests related to the current tab's domain

## Configuration

### Request Methods

Supported HTTP methods:

- **GET**: Retrieve data from APIs
- **POST**: Send data to external services
- **PUT**: Update resources
- **DELETE**: Remove resources
- **PATCH**: Partial updates

### Authentication

Common authentication methods for browser workflows:

- **API Keys**: Include in headers or query parameters
- **Bearer Tokens**: Add to Authorization header
- **Basic Auth**: Username/password authentication
- **OAuth**: For services supporting browser-based OAuth flows

### Headers and Parameters

Configure request headers and parameters:

- **Content-Type**: Specify data format (JSON, form data, etc.)
- **User-Agent**: Identify your browser extension
- **Custom Headers**: Add service-specific headers
- **Query Parameters**: Include URL parameters

## Usage Examples

### Send Extracted Text to AI Service

```javascript
// Workflow: Extract text → Send to AI API → Process response
// 1. GetSelectedText extracts user selection
// 2. HTTP Request sends text to AI service
// 3. Process AI response for further use

{
  "method": "POST",
  "url": "https://api.example.com/analyze",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  "body": {
    "text": "{{ $node['GetSelectedText'].json.selectedText }}",
    "analysis_type": "sentiment"
  }
}
```

### Save Browser Data to External Database

```javascript
// Workflow: Extract links → Save to database
// 1. GetAllLinks collects page links
// 2. HTTP Request saves data to external service

{
  "method": "POST",
  "url": "https://api.database.com/links",
  "headers": {
    "Content-Type": "application/json",
    "X-API-Key": "YOUR_DATABASE_KEY"
  },
  "body": {
    "page_url": "{{ $node['GetAllLinks'].json.pageUrl }}",
    "links": "{{ $node['GetAllLinks'].json.links }}",
    "extracted_at": "{{ new Date().toISOString() }}"
  }
}
```

### Validate Extracted Links

```javascript
// Workflow: Extract links → Validate each link
// 1. GetAllLinks extracts page links
// 2. HTTP Request checks each link status

{
  "method": "HEAD",
  "url": "{{ $node['GetAllLinks'].json.links[0].url }}",
  "timeout": 5000,
  "followRedirects": false
}
```

## Error Handling

### Common Browser Extension Errors

| Error Type        | Cause                                  | Solution                                 |
| ----------------- | -------------------------------------- | ---------------------------------------- |
| CORS Error        | Cross-origin request blocked           | Use CORS-enabled APIs or proxy           |
| CSP Violation     | Content Security Policy blocks request | Check page CSP or use different approach |
| Network Error     | Connection failed or timeout           | Add retry logic and error handling       |
| Permission Denied | Missing browser permissions            | Update extension permissions             |

### Response Handling

Handle different response scenarios:

- **Success (200-299)**: Process response data
- **Client Error (400-499)**: Handle authentication or validation errors
- **Server Error (500-599)**: Implement retry logic
- **Network Error**: Provide fallback behavior

## Best Practices

### Security

1. **Validate URLs**: Ensure request URLs are safe and expected
2. **Sanitize Data**: Clean browser-extracted data before sending
3. **Secure Credentials**: Store API keys securely in browser extension storage
4. **Rate Limiting**: Respect API rate limits to avoid blocking

### Performance

1. **Timeout Settings**: Set appropriate timeouts for requests
2. **Batch Requests**: Group multiple operations when possible
3. **Caching**: Cache responses when appropriate
4. **Async Processing**: Use parallel requests for independent operations

### Browser Compatibility

1. **Test Across Browsers**: Verify requests work in Chrome, Firefox, and Edge
2. **Handle Permissions**: Gracefully handle permission requests
3. **Fallback Options**: Provide alternatives when requests fail
4. **User Feedback**: Inform users about request status and errors

## Integration Patterns

### With Browser Extension Nodes

```javascript
// Pattern: Extract → Process → Send
GetSelectedText → Edit Fields → HTTP Request → Display Results
```

### With AI Processing

```javascript
// Pattern: Extract → AI Analysis → External Storage
GetAllText → AI Agent → HTTP Request → Notification
```

### With Data Validation

```javascript
// Pattern: Extract → Validate → Store
GetAllLinks → HTTP Request (validate) → Filter → HTTP Request (store)
```

## Related Nodes

- **GetSelectedText**: Extract text to send via HTTP requests
- **GetAllLinks**: Collect links for validation or processing
- **Edit Fields**: Format data before sending HTTP requests
- **Filter**: Process HTTP response data
- **IF**: Handle conditional HTTP requests based on browser data
