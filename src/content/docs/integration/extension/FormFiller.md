---
title: Form Filler
description: "Automatically fill web forms with data using Agentic Workflow Studio browser extension for comprehensive form automation workflows."
---

The **Form Filler** node provides comprehensive automated form filling capabilities, enabling intelligent data entry, validation, and submission across various form types with advanced field detection, data mapping, and error handling.

## How it Works

This node analyzes web forms, maps data to appropriate fields, and automatically fills them with provided information. It supports various input types, handles validation, manages form state, and can simulate human-like interaction patterns for enhanced compatibility.

## Browser API Details

The node leverages multiple browser APIs for comprehensive form automation:

### Core APIs Used

**Form and Input APIs**
- `HTMLFormElement`: Form element properties and methods
- `HTMLInputElement`: Input field manipulation and validation
- `HTMLSelectElement`: Dropdown and select field handling
- `HTMLTextAreaElement`: Multi-line text field management

**Event Simulation APIs**
- `Event.initEvent()`: Create form interaction events
- `InputEvent`: Simulate typing and input changes
- `ChangeEvent`: Trigger change events for form fields
- `FocusEvent`: Simulate focus and blur interactions

**Validation APIs**
- `ValidityState`: Check field validation status
- `HTMLFormElement.checkValidity()`: Validate entire forms
- `HTMLInputElement.setCustomValidity()`: Set custom validation messages
- `Constraint Validation API`: Handle form validation constraints

**DOM Manipulation APIs**
- `Document.querySelector()`: Find form elements
- `Element.matches()`: Check element selectors
- `NodeList.forEach()`: Iterate through form fields
- `MutationObserver`: Monitor form changes

### Required Permissions

| Permission | Purpose | Scope |
|------------|---------|-------|
| `activeTab` | Access current tab for form filling | Current tab only |
| `scripting` | Inject form automation scripts | Active tab content |
| `storage` | Store form templates and data | Extension storage |
| `clipboardRead` | Read clipboard data for form filling | System clipboard |

## Configuration

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Form Data** | Object | Yes | `{}` | Data to fill into form fields |
| **Form Selector** | String | No | `"form"` | CSS selector for target form |
| **Fill Method** | String | No | `intelligent` | Fill method: `intelligent`, `mapped`, `sequential` |
| **Submit After Fill** | Boolean | No | `false` | Automatically submit form after filling |
| **Validate Before Submit** | Boolean | No | `true` | Validate form before submission |
| **Simulate Human Input** | Boolean | No | `false` | Simulate human-like typing patterns |

### Field Mapping Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Field Mapping** | Object | No | `{}` | Custom field name to data key mapping |
| **Auto Detect Fields** | Boolean | No | `true` | Automatically detect field types and purposes |
| **Mapping Strategy** | String | No | `smart` | Mapping strategy: `smart`, `exact`, `fuzzy` |
| **Field Priorities** | Array | No | `[]` | Priority order for field detection |
| **Custom Selectors** | Object | No | `{}` | Custom CSS selectors for specific fields |
| **Ignore Fields** | Array | No | `[]` | Field names or selectors to ignore |

### Input Simulation Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Typing Speed** | Number | No | `50` | Milliseconds between keystrokes |
| **Typing Variation** | Number | No | `20` | Random variation in typing speed (±ms) |
| **Focus Delay** | Number | No | `100` | Delay before focusing each field |
| **Tab Navigation** | Boolean | No | `true` | Use tab navigation between fields |
| **Mouse Simulation** | Boolean | No | `false` | Simulate mouse clicks on fields |
| **Realistic Pauses** | Boolean | No | `false` | Add realistic pauses during filling |

### Validation Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Validate Fields** | Boolean | No | `true` | Validate individual fields during filling |
| **Validation Strategy** | String | No | `progressive` | Validation: `progressive`, `final`, `none` |
| **Handle Validation Errors** | Boolean | No | `true` | Automatically handle validation errors |
| **Retry Invalid Fields** | Boolean | No | `true` | Retry filling fields that fail validation |
| **Custom Validation** | Object | No | `{}` | Custom validation rules for fields |
| **Skip Invalid Fields** | Boolean | No | `false` | Skip fields that cannot be validated |

### Advanced Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Multi Step Forms** | Boolean | No | `false` | Handle multi-step form workflows |
| **Dynamic Forms** | Boolean | No | `false` | Handle dynamically generated forms |
| **Conditional Fields** | Boolean | No | `true` | Handle conditional field visibility |
| **File Uploads** | Boolean | No | `false` | Handle file upload fields |
| **Captcha Handling** | String | No | `skip` | Captcha handling: `skip`, `notify`, `manual` |
| **Form State Management** | Boolean | No | `true` | Track and manage form state changes |

### Error Handling Options

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Error Strategy** | String | No | `continue` | Error handling: `stop`, `continue`, `retry` |
| **Max Retries** | Number | No | `3` | Maximum retry attempts for failed fields |
| **Retry Delay** | Number | No | `1000` | Delay between retry attempts |
| **Fallback Methods** | Boolean | No | `true` | Use fallback filling methods |
| **Error Reporting** | Boolean | No | `true` | Report detailed error information |

## Usage Examples

### Basic Form Filling

Fill a simple contact form with user data:

```javascript
// Configuration for basic form filling
{
  "formData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "message": "I'm interested in your services."
  },
  "formSelector": "#contact-form",
  "fillMethod": "intelligent",
  "validateBeforeSubmit": true,
  "submitAfterFill": false
}

// Result: Contact form filled with provided data
// Fields automatically mapped by name/id/label detection
```

### Advanced Form with Custom Mapping

Fill complex form with custom field mapping:

```javascript
// Configuration for custom mapped form
{
  "formData": {
    "userFirstName": "Jane",
    "userLastName": "Smith",
    "userEmail": "jane.smith@company.com",
    "companyName": "Tech Solutions Inc",
    "jobTitle": "Senior Developer",
    "experience": "5-10 years",
    "skills": ["JavaScript", "Python", "React"],
    "availability": "immediately"
  },
  "formSelector": ".job-application-form",
  "fieldMapping": {
    "first_name": "userFirstName",
    "last_name": "userLastName",
    "email_address": "userEmail",
    "company": "companyName",
    "position": "jobTitle",
    "years_experience": "experience",
    "technical_skills": "skills",
    "start_date": "availability"
  },
  "fillMethod": "mapped",
  "simulateHumanInput": true,
  "typingSpeed": 75,
  "validateFields": true
}

// Result: Job application form filled with realistic typing simulation
```

### Multi-Step Form Automation

Handle multi-step form workflows:

```javascript
// Configuration for multi-step form
{
  "formData": {
    "step1": {
      "personalInfo": {
        "firstName": "Alice",
        "lastName": "Johnson",
        "dateOfBirth": "1990-05-15",
        "ssn": "123-45-6789"
      }
    },
    "step2": {
      "addressInfo": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      }
    },
    "step3": {
      "preferences": {
        "newsletter": true,
        "notifications": false,
        "theme": "dark"
      }
    }
  },
  "multiStepForms": true,
  "fillMethod": "intelligent",
  "stepNavigation": {
    "nextButtonSelector": ".next-step",
    "waitForLoad": true,
    "loadTimeout": 5000
  },
  "validateBeforeSubmit": true,
  "submitAfterFill": true
}

// Workflow: Fill step 1 → Navigate → Fill step 2 → Navigate → Fill step 3 → Submit
```

### E-commerce Checkout Automation

Automate e-commerce checkout process:

```javascript
// Configuration for checkout automation
{
  "formData": {
    "billingAddress": {
      "firstName": "Robert",
      "lastName": "Brown",
      "email": "robert.brown@email.com",
      "phone": "555-0199",
      "address1": "456 Oak Avenue",
      "address2": "Apt 2B",
      "city": "Springfield",
      "state": "IL",
      "zipCode": "62701",
      "country": "US"
    },
    "shippingAddress": {
      "sameAsBilling": false,
      "firstName": "Robert",
      "lastName": "Brown",
      "address1": "789 Pine Street",
      "city": "Chicago",
      "state": "IL",
      "zipCode": "60601"
    },
    "paymentInfo": {
      "cardNumber": "4111111111111111",
      "expiryMonth": "12",
      "expiryYear": "2025",
      "cvv": "123",
      "nameOnCard": "Robert Brown"
    }
  },
  "formSelector": ".checkout-form",
  "conditionalFields": true,
  "fieldMapping": {
    "billing_first_name": "billingAddress.firstName",
    "billing_last_name": "billingAddress.lastName",
    "same_as_billing": "shippingAddress.sameAsBilling",
    "card_number": "paymentInfo.cardNumber"
  },
  "validateFields": true,
  "simulateHumanInput": true,
  "submitAfterFill": false // Manual review before payment
}

// Result: Complete checkout form filled with billing, shipping, and payment info
```

### Dynamic Form Handling

Handle dynamically generated forms:

```javascript
// Configuration for dynamic forms
{
  "formData": {
    "surveyResponses": {
      "question1": "Very satisfied",
      "question2": 8,
      "question3": ["Option A", "Option C"],
      "question4": "This is my detailed feedback about the service quality.",
      "question5": true
    }
  },
  "dynamicForms": true,
  "fillMethod": "intelligent",
  "fieldDetection": {
    "waitForElements": true,
    "elementTimeout": 3000,
    "retryDetection": true,
    "observeChanges": true
  },
  "conditionalFields": true,
  "customSelectors": {
    "rating": "input[type='range'], .rating-slider",
    "multiSelect": ".multi-select-dropdown",
    "textArea": "textarea, .rich-text-editor"
  }
}

// Result: Dynamic survey form filled with appropriate response types
```

### Form Validation and Error Handling

Advanced validation and error handling:

```javascript
// Configuration for robust form handling
{
  "formData": {
    "username": "user123",
    "email": "user@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "age": 25,
    "terms": true
  },
  "validateFields": true,
  "validationStrategy": "progressive",
  "customValidation": {
    "username": {
      "minLength": 3,
      "pattern": "^[a-zA-Z0-9_]+$",
      "checkAvailability": true
    },
    "email": {
      "format": "email",
      "checkDomain": true
    },
    "password": {
      "minLength": 8,
      "requireUppercase": true,
      "requireNumbers": true,
      "requireSpecialChars": true
    }
  },
  "handleValidationErrors": true,
  "retryInvalidFields": true,
  "maxRetries": 3,
  "errorStrategy": "continue",
  "errorReporting": true
}

// Result: Form filled with comprehensive validation and error handling
```

### File Upload Automation

Handle file upload fields:

```javascript
// Configuration for file uploads
{
  "formData": {
    "applicantName": "Sarah Wilson",
    "position": "UX Designer",
    "resume": {
      "type": "file",
      "path": "/path/to/resume.pdf",
      "name": "sarah_wilson_resume.pdf"
    },
    "portfolio": {
      "type": "file",
      "path": "/path/to/portfolio.zip",
      "name": "portfolio_samples.zip"
    },
    "coverLetter": "I am excited to apply for the UX Designer position..."
  },
  "fileUploads": true,
  "uploadOptions": {
    "validateFileTypes": true,
    "checkFileSize": true,
    "maxFileSize": 10485760, // 10MB
    "allowedTypes": [".pdf", ".doc", ".docx", ".zip"],
    "uploadTimeout": 30000
  },
  "fillMethod": "intelligent",
  "validateBeforeSubmit": true
}

// Result: Job application form with file uploads handled automatically
```

## Output Data Structure

### Form Filling Results

```json
{
  "success": true,
  "formFilling": {
    "formFound": true,
    "formSelector": "#contact-form",
    "fieldsDetected": 8,
    "fieldsAttempted": 8,
    "fieldsSuccessful": 7,
    "fieldsFailed": 1,
    "validationPassed": true,
    "submitted": false
  },
  "fieldResults": [
    {
      "fieldName": "firstName",
      "fieldType": "text",
      "selector": "input[name='firstName']",
      "dataKey": "firstName",
      "value": "John",
      "success": true,
      "fillTime": 245,
      "validation": {
        "valid": true,
        "errors": []
      }
    },
    {
      "fieldName": "email",
      "fieldType": "email",
      "selector": "input[name='email']",
      "dataKey": "email",
      "value": "john.doe@example.com",
      "success": true,
      "fillTime": 180,
      "validation": {
        "valid": true,
        "errors": []
      }
    },
    {
      "fieldName": "phone",
      "fieldType": "tel",
      "selector": "input[name='phone']",
      "dataKey": "phone",
      "value": "+1-555-0123",
      "success": false,
      "fillTime": 0,
      "error": "Field validation failed",
      "validation": {
        "valid": false,
        "errors": ["Invalid phone number format"]
      },
      "retryAttempts": 3,
      "fallbackUsed": false
    }
  ],
  "formValidation": {
    "overallValid": false,
    "validFields": 7,
    "invalidFields": 1,
    "validationErrors": [
      {
        "field": "phone",
        "message": "Invalid phone number format",
        "type": "pattern-mismatch"
      }
    ],
    "customValidationResults": {
      "emailDomainCheck": "passed",
      "usernameAvailability": "available"
    }
  },
  "performance": {
    "totalFillTime": 2450,
    "averageFieldTime": 306,
    "fastestField": 120,
    "slowestField": 580,
    "typingSimulated": true,
    "humanLikeDelay": 1200
  },
  "formAnalysis": {
    "formType": "contact",
    "complexity": "medium",
    "fieldTypes": {
      "text": 4,
      "email": 1,
      "tel": 1,
      "textarea": 1,
      "checkbox": 1
    },
    "hasValidation": true,
    "hasConditionalFields": false,
    "isMultiStep": false,
    "hasCaptcha": false
  },
  "errors": [
    {
      "type": "VALIDATION_FAILED",
      "field": "phone",
      "message": "Phone number format validation failed",
      "attempts": 3,
      "resolved": false
    }
  ],
  "recommendations": [
    {
      "type": "data-format",
      "field": "phone",
      "suggestion": "Use format: (555) 123-4567 or +1-555-123-4567",
      "priority": "high"
    }
  ],
  "metadata": {
    "fillId": "fill-001",
    "timestamp": "2024-01-15T10:30:00Z",
    "formUrl": "https://example.com/contact",
    "userAgent": "Chrome/120.0.0.0",
    "simulationEnabled": true,
    "validationEnabled": true
  }
}
```

## Integration Patterns

### With Data Collection Workflows

```javascript
// Pattern: Collect data → Process → Fill forms → Submit
Data Collection → Data Processing → Form Filler → Submission Tracking
```

### With CRM Integration

```javascript
// Pattern: CRM data → Form filling → Lead capture → Update CRM
Get CRM Data → Form Filler → Capture Response → Update CRM Record
```

### With Testing Automation

```javascript
// Pattern: Test data → Fill forms → Validate → Report results
Generate Test Data → Form Filler → Validate Results → Test Report
```

### With User Onboarding

```javascript
// Pattern: User data → Multi-step forms → Progress tracking → Completion
User Registration → Form Filler → Track Progress → Welcome Flow
```

## Advanced Features

### Intelligent Field Detection

**Smart Field Mapping**
- Automatic field type detection
- Label and placeholder analysis
- Context-aware field identification
- Fuzzy matching for field names

**Field Relationship Analysis**
- Dependent field detection
- Conditional field handling
- Form flow analysis
- Validation dependency mapping

### Human-Like Interaction Simulation

**Realistic Typing Patterns**
- Variable typing speeds
- Natural pauses and corrections
- Realistic mouse movements
- Tab navigation simulation

**Behavioral Patterns**
- Reading time simulation
- Field focus patterns
- Error correction behavior
- Form completion strategies

### Advanced Validation Handling

**Multi-Level Validation**
- Client-side validation
- Server-side validation
- Custom business rules
- Real-time validation feedback

**Error Recovery Strategies**
- Automatic error correction
- Alternative data formats
- Fallback filling methods
- User notification systems

## Performance Optimization

### Filling Speed

| Form Complexity | Fill Time | Memory Usage | Recommendations |
|-----------------|-----------|--------------|-----------------|
| Simple (< 5 fields) | < 2s | Low | Standard filling |
| Medium (5-15 fields) | 2-10s | Moderate | Batch processing |
| Complex (15-50 fields) | 10-30s | High | Progressive filling |
| Very Complex (> 50 fields) | > 30s | Very High | Chunked processing |

### Resource Management

**Memory Optimization**
- Efficient field caching
- Progressive form processing
- Garbage collection after completion
- Optimized event handling

**Performance Monitoring**
- Fill time tracking
- Error rate monitoring
- Success rate analysis
- Performance bottleneck identification

## Error Handling

### Common Form Filling Errors

| Error Type | Cause | Solution |
|------------|-------|----------|
| **Field Not Found** | Selector doesn't match any elements | Update selectors or use fallback detection |
| **Validation Failed** | Data doesn't meet field requirements | Adjust data format or validation rules |
| **Access Denied** | Form fields are disabled or readonly | Check field state and permissions |
| **Timeout Error** | Form takes too long to load or respond | Increase timeouts or use progressive loading |
| **Data Type Mismatch** | Wrong data type for field | Convert data or update field mapping |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "type": "FORM_FILLING_FAILED",
    "message": "Failed to fill form due to validation errors",
    "details": {
      "formSelector": "#registration-form",
      "totalFields": 8,
      "successfulFields": 6,
      "failedFields": 2,
      "validationErrors": 2
    }
  },
  "partialResults": {
    "fieldsCompleted": ["firstName", "lastName", "email", "address", "city", "zipCode"],
    "fieldsFailed": ["phone", "birthDate"],
    "formState": "partially-filled"
  },
  "recommendations": [
    "Check phone number format requirements",
    "Verify birth date format (MM/DD/YYYY expected)",
    "Consider using fallback filling methods"
  ]
}
```

## Best Practices

### Data Preparation
1. **Format Validation**: Ensure data matches expected field formats
2. **Completeness Check**: Verify all required data is available
3. **Type Conversion**: Convert data types as needed for fields
4. **Sanitization**: Clean data to prevent injection attacks

### Form Interaction
1. **Progressive Filling**: Fill forms step by step for better reliability
2. **Validation Handling**: Handle validation errors gracefully
3. **State Management**: Track form state throughout the process
4. **Error Recovery**: Implement robust error recovery mechanisms

### User Experience
1. **Visual Feedback**: Provide clear feedback during form filling
2. **Progress Tracking**: Show progress for long forms
3. **Error Reporting**: Report errors clearly to users
4. **Manual Override**: Allow manual intervention when needed

### Security
1. **Data Protection**: Protect sensitive form data
2. **Validation**: Validate all input data before filling
3. **Permission Checking**: Verify form filling permissions
4. **Audit Trail**: Maintain logs of form filling activities

## Related Nodes

- **Get Form Data**: Extract existing form data
- **Validate Form**: Validate form data and structure
- **Submit Form**: Submit filled forms automatically
- **Form Analyzer**: Analyze form structure and requirements
- **Data Processor**: Process data before form filling
- **Captcha Solver**: Handle captcha challenges in forms