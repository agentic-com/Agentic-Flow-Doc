---
title: Content Manipulation Patterns
description: Comprehensive patterns for modifying, inserting, and manipulating web page content dynamically
---

# Content Manipulation Patterns

Content manipulation enables dynamic modification of web pages, form automation, and interactive content management. This guide covers proven patterns for various content modification scenarios.

## Form Automation Pattern

### Overview
Automatically fill, validate, and submit web forms with intelligent data handling and error recovery.

### Use Cases
- User registration automation
- Data entry workflows
- Survey completion
- E-commerce checkout processes

### Implementation

#### Workflow Structure
```
[Navigate] → [FormFiller] → [Validate] → [Submit] → [Confirm] → [Output]
```

#### Step-by-Step Implementation

1. **Form Detection and Analysis**
   ```javascript
   // FormFiller configuration
   {
     "formSelector": "form, .form-container",
     "autoDetectFields": true,
     "fieldMapping": {
       "firstName": ["input[name='first_name']", "#firstName", ".first-name"],
       "lastName": ["input[name='last_name']", "#lastName", ".last-name"],
       "email": ["input[type='email']", "input[name='email']"],
       "phone": ["input[type='tel']", "input[name='phone']"]
     }
   }
   ```

2. **Intelligent Data Population**
   ```javascript
   // Data population with validation
   {
     "fillStrategy": "smart",
     "dataSource": {
       "firstName": "{{user.firstName}}",
       "lastName": "{{user.lastName}}",
       "email": "{{user.email}}",
       "phone": "{{user.phone}}"
     },
     "fieldValidation": {
       "email": {
         "pattern": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
         "required": true
       },
       "phone": {
         "pattern": "^\\+?[1-9]\\d{1,14}$",
         "format": "international"
       }
     }
   }
   ```

3. **Dynamic Field Handling**
   ```javascript
   // Handle dynamic form elements
   {
     "dynamicFields": {
       "dropdown": {
         "selector": "select",
         "selectionStrategy": "byValue",
         "waitForOptions": true
       },
       "checkbox": {
         "selector": "input[type='checkbox']",
         "selectionStrategy": "byLabel"
       },
       "radio": {
         "selector": "input[type='radio']",
         "selectionStrategy": "byValue"
       }
     }
   }
   ```

4. **Submission and Confirmation**
   ```javascript
   // Form submission handling
   {
     "submitButton": "button[type='submit'], .submit-btn",
     "waitForResponse": true,
     "successIndicators": [".success-message", ".confirmation"],
     "errorIndicators": [".error-message", ".field-error"],
     "timeout": 10000
   }
   ```

### Advanced Form Handling
```javascript
// Multi-step form automation
{
  "multiStepConfig": {
    "steps": [
      {
        "stepSelector": ".step-1",
        "fields": ["firstName", "lastName", "email"],
        "nextButton": ".next-step"
      },
      {
        "stepSelector": ".step-2", 
        "fields": ["address", "city", "zipCode"],
        "nextButton": ".next-step"
      },
      {
        "stepSelector": ".step-3",
        "fields": ["paymentMethod", "cardNumber"],
        "submitButton": ".submit-form"
      }
    ]
  }
}
```

## Content Injection Pattern

### Overview
Dynamically insert content into web pages while preserving existing structure and functionality.

### Use Cases
- Custom widget insertion
- Content enhancement
- Dynamic messaging
- Real-time data display

### Implementation

#### Workflow Structure
```
[Analyze Page] → [Prepare Content] → [InsertContent] → [Validate] → [Monitor]
```

#### Step-by-Step Implementation

1. **Page Structure Analysis**
   ```javascript
   // Analyze insertion points
   {
     "analysisConfig": {
       "targetSelectors": [".content", "#main", ".article-body"],
       "insertionPoints": ["before", "after", "inside", "replace"],
       "preserveStructure": true,
       "respectCSP": true
     }
   }
   ```

2. **Content Preparation**
   ```javascript
   // Prepare content for insertion
   {
     "contentConfig": {
       "type": "html",
       "sanitize": true,
       "allowedTags": ["div", "span", "p", "a", "img"],
       "allowedAttributes": ["class", "id", "href", "src", "alt"],
       "cssIsolation": true
     }
   }
   ```

3. **Dynamic Content Insertion**
   ```javascript
   // InsertContent configuration
   {
     "insertionRules": [
       {
         "target": ".article-content",
         "position": "after",
         "content": "<div class='custom-widget'>{{dynamicContent}}</div>",
         "conditions": {
           "pageType": "article",
           "wordCount": ">500"
         }
       }
     ]
   }
   ```

4. **Content Validation and Monitoring**
   ```javascript
   // Validate successful insertion
   {
     "validationRules": [
       {
         "selector": ".custom-widget",
         "expectedCount": 1,
         "visibilityCheck": true
       }
     ],
     "monitoring": {
       "watchForRemoval": true,
       "reinsertOnRemoval": true,
       "maxRetries": 3
     }
   }
   ```

## Page Modification Pattern

### Overview
Modify existing page content, structure, and styling while maintaining page functionality.

### Use Cases
- Content customization
- Accessibility improvements
- UI/UX enhancements
- Branding modifications

### Implementation

#### Workflow Structure
```
[Analyze] → [ContentReplacer] → [StyleModification] → [Validate] → [Monitor]
```

#### Step-by-Step Implementation

1. **Content Analysis and Targeting**
   ```javascript
   // ContentReplacer configuration
   {
     "analysisConfig": {
       "scanSelectors": ["h1", "h2", ".title", ".content"],
       "identifyPatterns": true,
       "preserveSemantics": true
     }
   }
   ```

2. **Content Replacement Rules**
   ```javascript
   // Replacement strategies
   {
     "replacementRules": [
       {
         "target": "h1",
         "operation": "replace",
         "newContent": "{{customTitle}}",
         "preserveAttributes": true
       },
       {
         "target": ".old-branding",
         "operation": "replace",
         "newContent": "<img src='{{newLogo}}' alt='New Brand'>",
         "fallback": "hide"
       }
     ]
   }
   ```

3. **Style Modifications**
   ```javascript
   // CSS modifications
   {
     "styleModifications": [
       {
         "selector": ".content",
         "styles": {
           "font-family": "Arial, sans-serif",
           "line-height": "1.6",
           "color": "#333"
         }
       },
       {
         "selector": ".custom-element",
         "cssClass": "enhanced-styling"
       }
     ]
   }
   ```

4. **Accessibility Enhancements**
   ```javascript
   // Accessibility improvements
   {
     "accessibilityEnhancements": [
       {
         "target": "img:not([alt])",
         "operation": "addAttribute",
         "attribute": "alt",
         "value": "{{generateAltText}}"
       },
       {
         "target": "a:not([title])",
         "operation": "addAttribute", 
         "attribute": "title",
         "value": "{{linkDescription}}"
       }
     ]
   }
   ```

## Interactive Automation Pattern

### Overview
Simulate complex user interactions and automate multi-step processes that require user-like behavior.

### Use Cases
- Multi-step workflows
- Interactive tutorials
- User journey automation
- Complex navigation patterns

### Implementation

#### Workflow Structure
```
[Plan Interaction] → [Execute Steps] → [Handle Responses] → [Adapt] → [Complete]
```

#### Step-by-Step Implementation

1. **Interaction Planning**
   ```javascript
   // Plan complex interaction sequence
   {
     "interactionPlan": [
       {
         "step": 1,
         "action": "click",
         "target": ".menu-button",
         "waitFor": ".dropdown-menu"
       },
       {
         "step": 2,
         "action": "hover",
         "target": ".submenu-item",
         "waitFor": ".submenu-expanded"
       },
       {
         "step": 3,
         "action": "click",
         "target": ".final-option",
         "waitFor": ".content-loaded"
       }
     ]
   }
   ```

2. **Adaptive Execution**
   ```javascript
   // Handle dynamic responses
   {
     "adaptiveConfig": {
       "retryOnFailure": true,
       "maxRetries": 3,
       "adaptToChanges": true,
       "fallbackStrategies": [
         {
           "condition": "elementNotFound",
           "action": "useAlternativeSelector"
         },
         {
           "condition": "timeout",
           "action": "increaseWaitTime"
         }
       ]
     }
   }
   ```

3. **State Management**
   ```javascript
   // Track interaction state
   {
     "stateTracking": {
       "trackPageChanges": true,
       "saveCheckpoints": true,
       "rollbackOnError": true,
       "stateValidation": [
         {
           "checkpoint": "afterLogin",
           "validators": [".user-dashboard", ".logout-button"]
         }
       ]
     }
   }
   ```

## Advanced Content Manipulation Techniques

### Dynamic Content Generation
```javascript
// Generate content based on page context
{
  "contentGeneration": {
    "templates": {
      "productRecommendation": "<div class='recommendation'>Based on {{currentProduct}}, you might like {{relatedProducts}}</div>",
      "personalizedMessage": "<div class='message'>Welcome back, {{userName}}!</div>"
    },
    "dataBinding": {
      "currentProduct": "{{page.productName}}",
      "relatedProducts": "{{api.getRelated(productId)}}",
      "userName": "{{session.user.name}}"
    }
  }
}
```

### Conditional Modifications
```javascript
// Apply modifications based on conditions
{
  "conditionalModifications": [
    {
      "condition": "page.url.includes('/product/')",
      "modifications": [
        {
          "action": "insertPriceComparison",
          "target": ".price-section"
        }
      ]
    },
    {
      "condition": "user.isLoggedIn === false",
      "modifications": [
        {
          "action": "showLoginPrompt",
          "target": ".header"
        }
      ]
    }
  ]
}
```

### Content Synchronization
```javascript
// Keep content synchronized across elements
{
  "synchronizationRules": [
    {
      "sourceSelector": ".main-title",
      "targetSelectors": [".breadcrumb-title", ".page-title"],
      "syncProperty": "textContent",
      "bidirectional": false
    }
  ]
}
```

## Best Practices

### Performance Considerations
- **Minimize DOM Manipulation**: Batch operations when possible
- **Use Document Fragments**: For multiple insertions
- **Optimize Selectors**: Use efficient CSS selectors
- **Debounce Operations**: Avoid excessive modifications

### Security and Safety
- **Content Sanitization**: Always sanitize inserted content
- **CSP Compliance**: Respect Content Security Policy
- **XSS Prevention**: Validate and escape user input
- **Permission Checks**: Verify modification permissions

### User Experience
- **Preserve Functionality**: Ensure existing features continue working
- **Maintain Accessibility**: Keep content accessible
- **Responsive Design**: Ensure modifications work on all devices
- **Graceful Degradation**: Provide fallbacks for failed modifications

### Maintenance and Monitoring
- **Change Detection**: Monitor for page structure changes
- **Error Recovery**: Implement robust error handling
- **Performance Monitoring**: Track modification impact
- **User Feedback**: Collect feedback on modifications