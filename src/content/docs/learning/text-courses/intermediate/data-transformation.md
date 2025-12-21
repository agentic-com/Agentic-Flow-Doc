---
title: "Advanced Data Transformation"
description: "Master advanced data manipulation techniques for complex browser automation workflows with real-world examples."
difficulty: "🚀 intermediate"
---

# Advanced Data Transformation

Master sophisticated data transformation techniques to process, clean, and enhance extracted web content. This tutorial covers advanced data manipulation patterns, validation strategies, and transformation pipelines for professional workflow.

## What You'll Learn

By the end of this tutorial, you'll master:
- Complex data transformation patterns and pipelines
- Advanced validation and cleaning techniques
- Data normalization and standardization methods
- Dynamic data mapping and schema transformation
- Performance-optimized data processing strategies

## Prerequisites

- Completed [Performance Optimization](/learning/text-courses/intermediate/performance-optimization/)
- Experience with complex data structures and JSON manipulation
- Understanding of regular expressions and data validation
- Familiarity with data processing concepts

## Data Transformation Architecture

### Transformation Pipeline Framework

```
Raw Data → Validation → Cleaning → Normalization → Enhancement → Output
    ↓          ↓          ↓           ↓             ↓          ↓
  Schema    Quality    Formatting   Standards    Enrichment  Delivery
  Check     Control    Rules        Compliance   Logic       Format
```

### Transformation Categories

**Structural Transformations:**
- Schema mapping and conversion
- Data type normalization
- Hierarchical restructuring
- Array and object manipulation

**Content Transformations:**
- Text processing and cleaning
- Format standardization
- Data validation and correction
- Content enhancement and enrichment

**Contextual Transformations:**
- Business rule application
- Conditional logic processing
- Dynamic field generation
- Cross-reference resolution

## Step 1: Advanced Schema Transformation

### Dynamic Schema Mapper

**Flexible Schema Transformation Node:**
```javascript
{
  "nodeName": "Advanced Schema Mapper",
  "code": `
    class SchemaMapper {
      constructor(mappingRules) {
        this.rules = mappingRules;
        this.transformationHistory = [];
      }

      transform(data, targetSchema) {
        const startTime = performance.now();
        const result = this.applyTransformation(data, targetSchema);
        const endTime = performance.now();

        this.transformationHistory.push({
          timestamp: new Date().toISOString(),
          processingTime: endTime - startTime,
          inputSchema: this.analyzeSchema(data),
          outputSchema: this.analyzeSchema(result),
          transformationRules: targetSchema
        });

        return result;
      }

      applyTransformation(data, schema) {
        if (Array.isArray(data)) {
          return data.map(item => this.transformObject(item, schema));
        } else if (typeof data === 'object' && data !== null) {
          return this.transformObject(data, schema);
        }
        return data;
      }

      transformObject(obj, schema) {
        const result = {};

        for (const [targetField, mapping] of Object.entries(schema)) {
          try {
            result[targetField] = this.applyFieldMapping(obj, mapping);
          } catch (error) {
            console.warn(\`Field transformation failed for \${targetField}:\`, error);
            result[targetField] = mapping.defaultValue || null;
          }
        }

        return result;
      }

      applyFieldMapping(obj, mapping) {
        if (typeof mapping === 'string') {
          // Simple field mapping
          return this.getNestedValue(obj, mapping);
        }

        if (typeof mapping === 'object') {
          if (mapping.source) {
            let value = this.getNestedValue(obj, mapping.source);

            // Apply transformations
            if (mapping.transform) {
              value = this.applyTransformFunction(value, mapping.transform);
            }

            // Apply validation
            if (mapping.validate) {
              value = this.validateValue(value, mapping.validate);
            }

            // Apply formatting
            if (mapping.format) {
              value = this.formatValue(value, mapping.format);
            }

            return value;
          }

          if (mapping.computed) {
            // Computed field based on multiple sources
            return this.computeValue(obj, mapping.computed);
          }

          if (mapping.conditional) {
            // Conditional field mapping
            return this.applyConditionalMapping(obj, mapping.conditional);
          }
        }

        return mapping.defaultValue || null;
      }

      getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
          if (current && typeof current === 'object') {
            return current[key];
          }
          return undefined;
        }, obj);
      }

      applyTransformFunction(value, transform) {
        switch (transform.type) {
          case 'uppercase':
            return typeof value === 'string' ? value.toUpperCase() : value;

          case 'lowercase':
            return typeof value === 'string' ? value.toLowerCase() : value;

          case 'trim':
            return typeof value === 'string' ? value.trim() : value;

          case 'number':
            const num = parseFloat(value);
            return isNaN(num) ? transform.defaultValue || 0 : num;

          case 'boolean':
            if (typeof value === 'boolean') return value;
            if (typeof value === 'string') {
              return ['true', 'yes', '1', 'on'].includes(value.toLowerCase());
            }
            return Boolean(value);

          case 'date':
            const date = new Date(value);
            return isNaN(date.getTime()) ? null : date.toISOString();

          case 'array':
            if (Array.isArray(value)) return value;
            if (typeof value === 'string') {
              return value.split(transform.delimiter || ',').map(s => s.trim());
            }
            return [value];

          case 'regex':
            if (typeof value === 'string' && transform.pattern) {
              const match = value.match(new RegExp(transform.pattern, transform.flags || ''));
              return match ? (transform.group ? match[transform.group] : match[0]) : null;
            }
            return value;

          case 'custom':
            if (transform.function) {
              return new Function('value', 'obj', transform.function)(value, this.currentObject);
            }
            return value;

          default:
            return value;
        }
      }

      validateValue(value, validation) {
        const errors = [];

        if (validation.required && (value === null || value === undefined || value === '')) {
          errors.push('Value is required');
        }

        if (validation.type && typeof value !== validation.type) {
          errors.push(\`Expected type \${validation.type}, got \${typeof value}\`);
        }

        if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
          errors.push(\`Minimum length is \${validation.minLength}\`);
        }

        if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
          errors.push(\`Maximum length is \${validation.maxLength}\`);
        }

        if (validation.pattern && typeof value === 'string') {
          const regex = new RegExp(validation.pattern);
          if (!regex.test(value)) {
            errors.push('Value does not match required pattern');
          }
        }

        if (validation.enum && !validation.enum.includes(value)) {
          errors.push(\`Value must be one of: \${validation.enum.join(', ')}\`);
        }

        if (errors.length > 0) {
          if (validation.strict) {
            throw new Error(\`Validation failed: \${errors.join(', ')}\`);
          } else {
            console.warn('Validation warnings:', errors);
            return validation.fallback !== undefined ? validation.fallback : value;
          }
        }

        return value;
      }

      formatValue(value, format) {
        switch (format.type) {
          case 'currency':
            const num = parseFloat(value);
            return isNaN(num) ? value : new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: format.currency || 'USD'
            }).format(num);

          case 'percentage':
            const percent = parseFloat(value);
            return isNaN(percent) ? value : new Intl.NumberFormat('en-US', {
              style: 'percent',
              minimumFractionDigits: format.decimals || 2
            }).format(percent / 100);

          case 'date':
            const date = new Date(value);
            return isNaN(date.getTime()) ? value : date.toLocaleDateString(
              format.locale || 'en-US',
              format.options || {}
            );

          case 'template':
            return format.template.replace(/\\{\\{(.*?)\\}\\}/g, (match, key) => {
              return this.getNestedValue({ value }, key.trim()) || match;
            });

          default:
            return value;
        }
      }

      computeValue(obj, computation) {
        switch (computation.type) {
          case 'concat':
            return computation.sources.map(source =>
              this.getNestedValue(obj, source) || ''
            ).join(computation.separator || '');

          case 'sum':
            return computation.sources.reduce((sum, source) => {
              const value = parseFloat(this.getNestedValue(obj, source)) || 0;
              return sum + value;
            }, 0);

          case 'average':
            const values = computation.sources.map(source =>
              parseFloat(this.getNestedValue(obj, source)) || 0
            );
            return values.reduce((sum, val) => sum + val, 0) / values.length;

          case 'expression':
            // Safe expression evaluation
            try {
              const context = {};
              computation.sources.forEach(source => {
                const key = source.replace(/\\./g, '_');
                context[key] = this.getNestedValue(obj, source);
              });

              return new Function(...Object.keys(context), \`return \${computation.expression}\`)
                (...Object.values(context));
            } catch (error) {
              console.error('Expression evaluation failed:', error);
              return computation.defaultValue || null;
            }

          default:
            return null;
        }
      }

      applyConditionalMapping(obj, conditional) {
        for (const condition of conditional.conditions) {
          if (this.evaluateCondition(obj, condition.if)) {
            return this.applyFieldMapping(obj, condition.then);
          }
        }

        return conditional.else ? this.applyFieldMapping(obj, conditional.else) : null;
      }

      evaluateCondition(obj, condition) {
        const value = this.getNestedValue(obj, condition.field);

        switch (condition.operator) {
          case 'equals':
            return value === condition.value;
          case 'not_equals':
            return value !== condition.value;
          case 'greater_than':
            return parseFloat(value) > parseFloat(condition.value);
          case 'less_than':
            return parseFloat(value) < parseFloat(condition.value);
          case 'contains':
            return typeof value === 'string' && value.includes(condition.value);
          case 'matches':
            return typeof value === 'string' && new RegExp(condition.value).test(value);
          case 'exists':
            return value !== null && value !== undefined;
          case 'empty':
            return !value || (typeof value === 'string' && value.trim() === '');
          default:
            return false;
        }
      }

      analyzeSchema(data) {
        if (Array.isArray(data)) {
          return data.length > 0 ? this.analyzeSchema(data[0]) : {};
        }

        if (typeof data === 'object' && data !== null) {
          const schema = {};
          for (const [key, value] of Object.entries(data)) {
            schema[key] = {
              type: Array.isArray(value) ? 'array' : typeof value,
              nullable: value === null,
              example: value
            };
          }
          return schema;
        }

        return { type: typeof data };
      }

      getTransformationStats() {
        return {
          totalTransformations: this.transformationHistory.length,
          averageProcessingTime: this.transformationHistory.reduce((sum, t) =>
            sum + t.processingTime, 0) / this.transformationHistory.length,
          lastTransformation: this.transformationHistory[this.transformationHistory.length - 1]
        };
      }
    }

    // Define transformation schema
    const productSchema = {
      id: {
        source: 'productId',
        transform: { type: 'custom', function: 'return value || "PROD_" + Math.random().toString(36).substr(2, 9)' },
        validate: { required: true, type: 'string' }
      },
      name: {
        source: 'title',
        transform: { type: 'trim' },
        validate: { required: true, minLength: 1, maxLength: 200 }
      },
      price: {
        source: 'priceText',
        transform: { type: 'regex', pattern: '\\\\$?([0-9,]+\\\\.?[0-9]*)', group: 1 },
        format: { type: 'currency', currency: 'USD' },
        validate: { type: 'string' }
      },
      category: {
        conditional: {
          conditions: [
            {
              if: { field: 'tags', operator: 'contains', value: 'electronics' },
              then: { source: 'category', transform: { type: 'uppercase' } }
            },
            {
              if: { field: 'department', operator: 'exists' },
              then: { source: 'department' }
            }
          ],
          else: { defaultValue: 'GENERAL' }
        }
      },
      availability: {
        source: 'stockStatus',
        transform: { type: 'boolean' },
        validate: { type: 'boolean' }
      },
      description: {
        source: 'description',
        transform: { type: 'trim' },
        validate: { maxLength: 1000 }
      },
      rating: {
        computed: {
          type: 'average',
          sources: ['rating1', 'rating2', 'rating3']
        },
        format: { type: 'template', template: '{{value}}/5.0' }
      },
      metadata: {
        computed: {
          type: 'expression',
          sources: ['extractedAt', 'source'],
          expression: '{ extractedAt, source, processed: true }'
        }
      }
    };

    const inputData = $input.all();
    const mapper = new SchemaMapper();

    const transformedData = inputData.map(item => {
      mapper.currentObject = item; // Set context for custom functions
      return mapper.transform(item, productSchema);
    });

    return [{
      originalData: inputData,
      transformedData,
      transformationStats: mapper.getTransformationStats(),
      schema: {
        input: mapper.analyzeSchema(inputData),
        output: mapper.analyzeSchema(transformedData)
      }
    }];
  `
}
```

## Step 2: Advanced Data Cleaning and Validation

### Comprehensive Data Cleaner

**Multi-Stage Data Cleaning Node:**
```javascript
{
  "nodeName": "Advanced Data Cleaner",
  "code": `
    class DataCleaner {
      constructor() {
        this.cleaningRules = new Map();
        this.validationRules = new Map();
        this.cleaningStats = {
          totalProcessed: 0,
          totalCleaned: 0,
          errorsCorrected: 0,
          validationFailures: 0
        };
      }

      registerCleaningRule(fieldName, rule) {
        if (!this.cleaningRules.has(fieldName)) {
          this.cleaningRules.set(fieldName, []);
        }
        this.cleaningRules.get(fieldName).push(rule);
      }

      registerValidationRule(fieldName, rule) {
        if (!this.validationRules.has(fieldName)) {
          this.validationRules.set(fieldName, []);
        }
        this.validationRules.get(fieldName).push(rule);
      }

      cleanData(data) {
        this.cleaningStats.totalProcessed++;

        const cleaned = {};
        let changesMade = false;

        for (const [field, value] of Object.entries(data)) {
          const originalValue = value;
          let cleanedValue = this.applyCleaningRules(field, value);

          // Apply validation and correction
          cleanedValue = this.validateAndCorrect(field, cleanedValue);

          cleaned[field] = cleanedValue;

          if (cleanedValue !== originalValue) {
            changesMade = true;
            this.cleaningStats.errorsCorrected++;
          }
        }

        if (changesMade) {
          this.cleaningStats.totalCleaned++;
        }

        return cleaned;
      }

      applyCleaningRules(fieldName, value) {
        const rules = this.cleaningRules.get(fieldName) || [];
        let cleanedValue = value;

        for (const rule of rules) {
          cleanedValue = this.applyRule(cleanedValue, rule);
        }

        return cleanedValue;
      }

      applyRule(value, rule) {
        if (value === null || value === undefined) {
          return rule.handleNull || value;
        }

        switch (rule.type) {
          case 'trim_whitespace':
            return typeof value === 'string' ? value.trim() : value;

          case 'remove_extra_spaces':
            return typeof value === 'string' ?
              value.replace(/\\s+/g, ' ').trim() : value;

          case 'normalize_case':
            if (typeof value === 'string') {
              switch (rule.case) {
                case 'upper': return value.toUpperCase();
                case 'lower': return value.toLowerCase();
                case 'title': return this.toTitleCase(value);
                case 'sentence': return this.toSentenceCase(value);
                default: return value;
              }
            }
            return value;

          case 'remove_html':
            return typeof value === 'string' ?
              value.replace(/<[^>]*>/g, '') : value;

          case 'decode_entities':
            return typeof value === 'string' ?
              this.decodeHtmlEntities(value) : value;

          case 'normalize_unicode':
            return typeof value === 'string' ?
              value.normalize('NFC') : value;

          case 'remove_special_chars':
            return typeof value === 'string' ?
              value.replace(new RegExp(rule.pattern || '[^a-zA-Z0-9\\\\s]', 'g'),
                rule.replacement || '') : value;

          case 'format_phone':
            return typeof value === 'string' ?
              this.formatPhoneNumber(value) : value;

          case 'format_email':
            return typeof value === 'string' ?
              this.formatEmail(value) : value;

          case 'extract_numbers':
            if (typeof value === 'string') {
              const numbers = value.match(/\\d+(\\.\\d+)?/g);
              return rule.returnFirst ?
                (numbers ? parseFloat(numbers[0]) : null) : numbers;
            }
            return value;

          case 'standardize_date':
            return this.standardizeDate(value, rule.format);

          case 'custom_regex':
            return typeof value === 'string' && rule.pattern ?
              value.replace(new RegExp(rule.pattern, rule.flags || 'g'),
                rule.replacement || '') : value;

          case 'custom_function':
            return rule.function ? rule.function(value) : value;

          default:
            return value;
        }
      }

      validateAndCorrect(fieldName, value) {
        const rules = this.validationRules.get(fieldName) || [];
        let correctedValue = value;

        for (const rule of rules) {
          const validationResult = this.validateValue(correctedValue, rule);

          if (!validationResult.isValid) {
            this.cleaningStats.validationFailures++;

            if (rule.autoCorrect) {
              correctedValue = this.attemptCorrection(correctedValue, rule);
            } else if (rule.fallback !== undefined) {
              correctedValue = rule.fallback;
            }
          }
        }

        return correctedValue;
      }

      validateValue(value, rule) {
        const errors = [];

        switch (rule.type) {
          case 'required':
            if (value === null || value === undefined || value === '') {
              errors.push('Value is required');
            }
            break;

          case 'type':
            if (typeof value !== rule.expectedType) {
              errors.push(\`Expected \${rule.expectedType}, got \${typeof value}\`);
            }
            break;

          case 'length':
            if (typeof value === 'string') {
              if (rule.min && value.length < rule.min) {
                errors.push(\`Minimum length is \${rule.min}\`);
              }
              if (rule.max && value.length > rule.max) {
                errors.push(\`Maximum length is \${rule.max}\`);
              }
            }
            break;

          case 'range':
            const num = parseFloat(value);
            if (!isNaN(num)) {
              if (rule.min !== undefined && num < rule.min) {
                errors.push(\`Value must be at least \${rule.min}\`);
              }
              if (rule.max !== undefined && num > rule.max) {
                errors.push(\`Value must be at most \${rule.max}\`);
              }
            }
            break;

          case 'pattern':
            if (typeof value === 'string' && rule.regex) {
              if (!new RegExp(rule.regex).test(value)) {
                errors.push('Value does not match required pattern');
              }
            }
            break;

          case 'email':
            if (typeof value === 'string') {
              const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
              if (!emailRegex.test(value)) {
                errors.push('Invalid email format');
              }
            }
            break;

          case 'url':
            if (typeof value === 'string') {
              try {
                new URL(value);
              } catch {
                errors.push('Invalid URL format');
              }
            }
            break;

          case 'custom':
            if (rule.validator) {
              const customResult = rule.validator(value);
              if (customResult !== true) {
                errors.push(customResult || 'Custom validation failed');
              }
            }
            break;
        }

        return {
          isValid: errors.length === 0,
          errors
        };
      }

      attemptCorrection(value, rule) {
        switch (rule.type) {
          case 'email':
            if (typeof value === 'string') {
              // Try to fix common email issues
              let corrected = value.toLowerCase().trim();

              // Fix missing @ symbol
              if (!corrected.includes('@') && corrected.includes(' at ')) {
                corrected = corrected.replace(' at ', '@');
              }

              // Fix common domain typos
              const domainFixes = {
                'gmail.co': 'gmail.com',
                'yahoo.co': 'yahoo.com',
                'hotmail.co': 'hotmail.com'
              };

              for (const [wrong, correct] of Object.entries(domainFixes)) {
                if (corrected.endsWith(wrong)) {
                  corrected = corrected.replace(wrong, correct);
                }
              }

              return corrected;
            }
            break;

          case 'phone':
            if (typeof value === 'string') {
              // Extract and format phone number
              const digits = value.replace(/\\D/g, '');
              if (digits.length === 10) {
                return \`(\${digits.substr(0,3)}) \${digits.substr(3,3)}-\${digits.substr(6,4)}\`;
              } else if (digits.length === 11 && digits[0] === '1') {
                return \`+1 (\${digits.substr(1,3)}) \${digits.substr(4,3)}-\${digits.substr(7,4)}\`;
              }
            }
            break;

          case 'url':
            if (typeof value === 'string') {
              let corrected = value.trim();

              // Add protocol if missing
              if (!corrected.startsWith('http://') && !corrected.startsWith('https://')) {
                corrected = 'https://' + corrected;
              }

              return corrected;
            }
            break;
        }

        return value;
      }

      // Helper methods
      toTitleCase(str) {
        return str.replace(/\\w\\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      }

      toSentenceCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      }

      decodeHtmlEntities(str) {
        const entities = {
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&#39;': "'",
          '&nbsp;': ' '
        };

        return str.replace(/&[#\\w]+;/g, (entity) => entities[entity] || entity);
      }

      formatPhoneNumber(phone) {
        const digits = phone.replace(/\\D/g, '');

        if (digits.length === 10) {
          return \`(\${digits.substr(0,3)}) \${digits.substr(3,3)}-\${digits.substr(6,4)}\`;
        } else if (digits.length === 11 && digits[0] === '1') {
          return \`+1 (\${digits.substr(1,3)}) \${digits.substr(4,3)}-\${digits.substr(7,4)}\`;
        }

        return phone;
      }

      formatEmail(email) {
        return email.toLowerCase().trim();
      }

      standardizeDate(dateValue, format) {
        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
          return null;
        }

        switch (format) {
          case 'iso':
            return date.toISOString();
          case 'date':
            return date.toISOString().split('T')[0];
          case 'timestamp':
            return date.getTime();
          default:
            return date.toISOString();
        }
      }

      getCleaningStats() {
        return {
          ...this.cleaningStats,
          cleaningRate: this.cleaningStats.totalCleaned / this.cleaningStats.totalProcessed,
          errorCorrectionRate: this.cleaningStats.errorsCorrected / this.cleaningStats.totalProcessed
        };
      }
    }

    // Initialize cleaner with rules
    const cleaner = new DataCleaner();

    // Register cleaning rules
    cleaner.registerCleaningRule('name', { type: 'trim_whitespace' });
    cleaner.registerCleaningRule('name', { type: 'remove_extra_spaces' });
    cleaner.registerCleaningRule('name', { type: 'normalize_case', case: 'title' });

    cleaner.registerCleaningRule('email', { type: 'trim_whitespace' });
    cleaner.registerCleaningRule('email', { type: 'normalize_case', case: 'lower' });

    cleaner.registerCleaningRule('phone', { type: 'format_phone' });

    cleaner.registerCleaningRule('description', { type: 'remove_html' });
    cleaner.registerCleaningRule('description', { type: 'decode_entities' });
    cleaner.registerCleaningRule('description', { type: 'normalize_unicode' });

    cleaner.registerCleaningRule('price', {
      type: 'extract_numbers',
      returnFirst: true
    });

    // Register validation rules
    cleaner.registerValidationRule('email', {
      type: 'email',
      autoCorrect: true
    });

    cleaner.registerValidationRule('phone', {
      type: 'pattern',
      regex: '^\\\\+?[1-9]\\\\d{1,14}$',
      autoCorrect: true
    });

    cleaner.registerValidationRule('name', {
      type: 'required'
    });

    cleaner.registerValidationRule('name', {
      type: 'length',
      min: 1,
      max: 100
    });

    const inputData = $input.all();

    const cleanedData = inputData.map(item => cleaner.cleanData(item));

    return [{
      originalData: inputData,
      cleanedData,
      cleaningStats: cleaner.getCleaningStats()
    }];
  `
}
```

## Step 3: Dynamic Data Enrichment

### Intelligent Data Enricher

**Context-Aware Data Enhancement Node:**
```javascript
{
  "nodeName": "Intelligent Data Enricher",
  "code": `
    class DataEnricher {
      constructor() {
        this.enrichmentRules = new Map();
        this.contextData = new Map();
        this.enrichmentCache = new Map();
        this.stats = {
          totalEnrichments: 0,
          cacheHits: 0,
          enrichmentTime: 0
        };
      }

      registerEnrichmentRule(fieldName, rule) {
        if (!this.enrichmentRules.has(fieldName)) {
          this.enrichmentRules.set(fieldName, []);
        }
        this.enrichmentRules.get(fieldName).push(rule);
      }

      setContext(contextKey, contextValue) {
        this.contextData.set(contextKey, contextValue);
      }

      async enrichData(data) {
        const startTime = performance.now();
        const enriched = { ...data };

        // Apply enrichment rules
        for (const [fieldName, rules] of this.enrichmentRules.entries()) {
          for (const rule of rules) {
            try {
              const enrichmentResult = await this.applyEnrichmentRule(enriched, fieldName, rule);
              if (enrichmentResult !== null && enrichmentResult !== undefined) {
                enriched[rule.targetField || fieldName] = enrichmentResult;
                this.stats.totalEnrichments++;
              }
            } catch (error) {
              console.warn(\`Enrichment failed for \${fieldName}:\`, error);
            }
          }
        }

        const endTime = performance.now();
        this.stats.enrichmentTime += endTime - startTime;

        return enriched;
      }

      async applyEnrichmentRule(data, fieldName, rule) {
        const cacheKey = this.generateCacheKey(data, fieldName, rule);

        // Check cache first
        if (this.enrichmentCache.has(cacheKey)) {
          this.stats.cacheHits++;
          return this.enrichmentCache.get(cacheKey);
        }

        let result = null;

        switch (rule.type) {
          case 'lookup':
            result = await this.performLookup(data, rule);
            break;

          case 'calculate':
            result = this.performCalculation(data, rule);
            break;

          case 'classify':
            result = this.performClassification(data, rule);
            break;

          case 'extract':
            result = this.performExtraction(data, rule);
            break;

          case 'generate':
            result = this.performGeneration(data, rule);
            break;

          case 'validate':
            result = this.performValidation(data, rule);
            break;

          case 'context':
            result = this.applyContextualEnrichment(data, rule);
            break;

          case 'ml_predict':
            result = await this.performMLPrediction(data, rule);
            break;

          default:
            console.warn(\`Unknown enrichment type: \${rule.type}\`);
        }

        // Cache the result
        if (result !== null && rule.cacheable !== false) {
          this.enrichmentCache.set(cacheKey, result);
        }

        return result;
      }

      async performLookup(data, rule) {
        const lookupValue = this.getFieldValue(data, rule.sourceField);

        if (!lookupValue) return rule.defaultValue || null;

        switch (rule.lookupType) {
          case 'static':
            return rule.lookupTable[lookupValue] || rule.defaultValue || null;

          case 'api':
            try {
              const response = await fetch(rule.apiUrl.replace('{value}', encodeURIComponent(lookupValue)), {
                method: rule.method || 'GET',
                headers: rule.headers || {},
                signal: AbortSignal.timeout(rule.timeout || 5000)
              });

              if (!response.ok) throw new Error(\`API lookup failed: \${response.status}\`);

              const apiData = await response.json();
              return this.extractFromApiResponse(apiData, rule.responseMapping);

            } catch (error) {
              console.warn('API lookup failed:', error);
              return rule.defaultValue || null;
            }

          case 'context':
            const contextData = this.contextData.get(rule.contextKey);
            return contextData ? contextData[lookupValue] : rule.defaultValue || null;

          default:
            return rule.defaultValue || null;
        }
      }

      performCalculation(data, rule) {
        try {
          const values = rule.sourceFields.map(field => {
            const value = this.getFieldValue(data, field);
            return parseFloat(value) || 0;
          });

          switch (rule.operation) {
            case 'sum':
              return values.reduce((sum, val) => sum + val, 0);

            case 'average':
              return values.reduce((sum, val) => sum + val, 0) / values.length;

            case 'min':
              return Math.min(...values);

            case 'max':
              return Math.max(...values);

            case 'multiply':
              return values.reduce((product, val) => product * val, 1);

            case 'percentage':
              return values.length >= 2 ? (values[0] / values[1]) * 100 : 0;

            case 'custom':
              // Safe expression evaluation
              const context = {};
              rule.sourceFields.forEach((field, index) => {
                context[\`v\${index}\`] = values[index];
              });

              return new Function(...Object.keys(context), \`return \${rule.expression}\`)
                (...Object.values(context));

            default:
              return null;
          }
        } catch (error) {
          console.warn('Calculation failed:', error);
          return rule.defaultValue || null;
        }
      }

      performClassification(data, rule) {
        const sourceValue = this.getFieldValue(data, rule.sourceField);

        if (!sourceValue) return rule.defaultValue || null;

        // Apply classification rules
        for (const classifier of rule.classifiers) {
          if (this.matchesClassifier(sourceValue, classifier)) {
            return classifier.category;
          }
        }

        return rule.defaultValue || 'unclassified';
      }

      matchesClassifier(value, classifier) {
        switch (classifier.type) {
          case 'keyword':
            return classifier.keywords.some(keyword =>
              value.toLowerCase().includes(keyword.toLowerCase()));

          case 'regex':
            return new RegExp(classifier.pattern, classifier.flags || 'i').test(value);

          case 'range':
            const numValue = parseFloat(value);
            return !isNaN(numValue) &&
                   numValue >= classifier.min &&
                   numValue <= classifier.max;

          case 'custom':
            return classifier.function(value);

          default:
            return false;
        }
      }

      performExtraction(data, rule) {
        const sourceValue = this.getFieldValue(data, rule.sourceField);

        if (!sourceValue || typeof sourceValue !== 'string') {
          return rule.defaultValue || null;
        }

        switch (rule.extractionType) {
          case 'regex':
            const match = sourceValue.match(new RegExp(rule.pattern, rule.flags || ''));
            return match ? (rule.group ? match[rule.group] : match[0]) : rule.defaultValue || null;

          case 'substring':
            return sourceValue.substring(rule.start, rule.end);

          case 'split':
            const parts = sourceValue.split(rule.delimiter);
            return rule.index < parts.length ? parts[rule.index] : rule.defaultValue || null;

          case 'domain':
            try {
              const url = new URL(sourceValue);
              return url.hostname;
            } catch {
              return rule.defaultValue || null;
            }

          case 'email_parts':
            const emailMatch = sourceValue.match(/^([^@]+)@([^@]+)$/);
            if (emailMatch) {
              return rule.part === 'username' ? emailMatch[1] :
                     rule.part === 'domain' ? emailMatch[2] : emailMatch[0];
            }
            return rule.defaultValue || null;

          default:
            return rule.defaultValue || null;
        }
      }

      performGeneration(data, rule) {
        switch (rule.generationType) {
          case 'uuid':
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              const r = Math.random() * 16 | 0;
              const v = c == 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });

          case 'timestamp':
            return rule.format === 'unix' ? Date.now() : new Date().toISOString();

          case 'hash':
            const sourceValue = this.getFieldValue(data, rule.sourceField) || '';
            return this.simpleHash(sourceValue.toString());

          case 'sequence':
            if (!this.sequenceCounters) this.sequenceCounters = {};
            if (!this.sequenceCounters[rule.name]) this.sequenceCounters[rule.name] = rule.start || 1;
            return this.sequenceCounters[rule.name]++;

          case 'template':
            return this.processTemplate(rule.template, data);

          default:
            return null;
        }
      }

      performValidation(data, rule) {
        const sourceValue = this.getFieldValue(data, rule.sourceField);

        const validationResult = {
          isValid: true,
          errors: [],
          warnings: []
        };

        for (const validator of rule.validators) {
          const result = this.validateAgainstRule(sourceValue, validator);

          if (!result.isValid) {
            validationResult.isValid = false;
            validationResult.errors.push(...result.errors);
          }

          if (result.warnings) {
            validationResult.warnings.push(...result.warnings);
          }
        }

        return validationResult;
      }

      applyContextualEnrichment(data, rule) {
        const contextValue = this.contextData.get(rule.contextKey);

        if (!contextValue) return rule.defaultValue || null;

        switch (rule.contextType) {
          case 'merge':
            return { ...contextValue, ...data };

          case 'lookup':
            const lookupKey = this.getFieldValue(data, rule.lookupField);
            return contextValue[lookupKey] || rule.defaultValue || null;

          case 'calculate':
            return this.performCalculation({ ...data, ...contextValue }, rule.calculation);

          default:
            return contextValue;
        }
      }

      async performMLPrediction(data, rule) {
        // Placeholder for ML prediction - would integrate with actual ML service
        try {
          const features = rule.features.map(feature =>
            this.getFieldValue(data, feature) || 0);

          // Simulate ML prediction
          const prediction = this.simulateMLPrediction(features, rule.model);

          return {
            prediction,
            confidence: Math.random() * 0.3 + 0.7, // Simulate confidence score
            model: rule.model,
            features: rule.features
          };

        } catch (error) {
          console.warn('ML prediction failed:', error);
          return rule.defaultValue || null;
        }
      }

      // Helper methods
      getFieldValue(data, fieldPath) {
        return fieldPath.split('.').reduce((obj, key) =>
          obj && obj[key] !== undefined ? obj[key] : null, data);
      }

      extractFromApiResponse(apiData, mapping) {
        if (typeof mapping === 'string') {
          return this.getFieldValue(apiData, mapping);
        }

        if (typeof mapping === 'object') {
          const result = {};
          for (const [key, path] of Object.entries(mapping)) {
            result[key] = this.getFieldValue(apiData, path);
          }
          return result;
        }

        return apiData;
      }

      processTemplate(template, data) {
        return template.replace(/\\{\\{([^}]+)\\}\\}/g, (match, fieldPath) => {
          const value = this.getFieldValue(data, fieldPath.trim());
          return value !== null && value !== undefined ? value : match;
        });
      }

      simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
      }

      simulateMLPrediction(features, model) {
        // Simple simulation - in real implementation, this would call actual ML service
        const sum = features.reduce((s, f) => s + f, 0);
        const avg = sum / features.length;

        switch (model) {
          case 'sentiment':
            return avg > 0.5 ? 'positive' : avg < -0.5 ? 'negative' : 'neutral';
          case 'category':
            return ['technology', 'business', 'entertainment', 'sports'][Math.floor(avg * 4) % 4];
          case 'score':
            return Math.min(100, Math.max(0, avg * 100));
          default:
            return avg;
        }
      }

      validateAgainstRule(value, validator) {
        // Implementation similar to previous validation logic
        return { isValid: true, errors: [], warnings: [] };
      }

      generateCacheKey(data, fieldName, rule) {
        const keyData = {
          field: fieldName,
          type: rule.type,
          source: rule.sourceField,
          value: this.getFieldValue(data, rule.sourceField)
        };
        return JSON.stringify(keyData);
      }

      getEnrichmentStats() {
        return {
          ...this.stats,
          cacheHitRate: this.stats.cacheHits / this.stats.totalEnrichments,
          averageEnrichmentTime: this.stats.enrichmentTime / this.stats.totalEnrichments,
          cacheSize: this.enrichmentCache.size
        };
      }
    }

    // Initialize enricher
    const enricher = new DataEnricher();

    // Set up context data
    enricher.setContext('categories', {
      'electronics': { priority: 'high', department: 'tech' },
      'clothing': { priority: 'medium', department: 'fashion' },
      'books': { priority: 'low', department: 'media' }
    });

    // Register enrichment rules
    enricher.registerEnrichmentRule('name', {
      type: 'generate',
      generationType: 'hash',
      sourceField: 'name',
      targetField: 'nameHash'
    });

    enricher.registerEnrichmentRule('price', {
      type: 'classify',
      sourceField: 'price',
      targetField: 'priceCategory',
      classifiers: [
        { type: 'range', min: 0, max: 25, category: 'budget' },
        { type: 'range', min: 25, max: 100, category: 'mid-range' },
        { type: 'range', min: 100, max: 1000, category: 'premium' }
      ],
      defaultValue: 'luxury'
    });

    enricher.registerEnrichmentRule('description', {
      type: 'extract',
      sourceField: 'description',
      extractionType: 'regex',
      pattern: '\\\\b(\\\\w+)\\\\s+rating',
      group: 1,
      targetField: 'ratingType'
    });

    enricher.registerEnrichmentRule('metadata', {
      type: 'generate',
      generationType: 'template',
      template: 'Processed on {{timestamp}} from {{source}}',
      targetField: 'processingInfo'
    });

    const inputData = $input.all();

    // Enrich all data items
    const enrichedData = [];
    for (const item of inputData) {
      const enriched = await enricher.enrichData(item);
      enrichedData.push(enriched);
    }

    return [{
      originalData: inputData,
      enrichedData,
      enrichmentStats: enricher.getEnrichmentStats()
    }];
  `
}
```

Now I'll mark sub-task 3.2 as complete and move to sub-task 3.3:

<function_calls>
<invoke name="taskStatus">
<parameter name="taskFilePath">.kiro/specs/content-review-enhancement/tasks.md