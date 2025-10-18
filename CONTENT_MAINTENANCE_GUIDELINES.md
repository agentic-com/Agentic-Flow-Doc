# Content Maintenance Guidelines

## Overview

This document provides comprehensive guidelines for maintaining the Agentic Workflow Studio documentation. It covers processes for keeping browser extension documentation updated, adding new features, and ensuring content quality and consistency.

## Table of Contents

1. [Content Update Process](#content-update-process)
2. [Adding New Browser Extension Features](#adding-new-browser-extension-features)
3. [Review Processes](#review-processes)
4. [Quality Assurance](#quality-assurance)
5. [Tools and Scripts](#tools-and-scripts)
6. [Content Standards](#content-standards)
7. [Troubleshooting](#troubleshooting)

## Content Update Process

### Regular Maintenance Schedule

- **Weekly**: Review and update example workflows
- **Bi-weekly**: Check for broken links and outdated references
- **Monthly**: Comprehensive content audit and validation
- **Quarterly**: Major content review and restructuring if needed

### Content Update Workflow

1. **Identify Update Need**
   - Feature releases
   - Bug fixes
   - User feedback
   - Community contributions

2. **Plan Updates**
   - Assess impact on existing content
   - Identify affected documentation sections
   - Plan content changes and additions

3. **Execute Updates**
   - Follow content standards (see below)
   - Update related examples and tutorials
   - Maintain cross-references and links

4. **Validate Changes**
   - Run validation scripts
   - Test build process
   - Review content accuracy

5. **Deploy and Monitor**
   - Deploy changes
   - Monitor for issues
   - Gather user feedback

### Content Types and Update Frequency

| Content Type | Update Frequency | Responsibility |
|--------------|------------------|----------------|
| Feature Documentation | With each release | Development Team |
| API References | With API changes | Development Team |
| Tutorials and Examples | Monthly | Documentation Team |
| Getting Started Guides | Quarterly | Documentation Team |
| Troubleshooting | As needed | Support Team |

## Adding New Browser Extension Features

### Documentation Requirements for New Features

When adding a new browser extension feature, ensure the following documentation is created or updated:

#### 1. Feature Documentation
- **Location**: `src/content/docs/integration/extension/`
- **Required Sections**:
  - Feature overview and purpose
  - Installation/setup requirements
  - Usage examples with code
  - Parameters and configuration options
  - Browser compatibility notes
  - Security considerations
  - Troubleshooting common issues

#### 2. Integration Examples
- **Location**: `src/content/docs/learning/examples/`
- **Requirements**:
  - Real-world use case examples
  - Step-by-step tutorials
  - Integration with other nodes
  - Best practices and tips

#### 3. API Documentation
- **Location**: `src/content/docs/integration/builtin/`
- **Requirements**:
  - Complete API reference
  - Parameter descriptions
  - Return value documentation
  - Error handling information

### New Feature Documentation Checklist

- [ ] Feature overview page created
- [ ] Usage examples documented
- [ ] API reference updated
- [ ] Integration examples added
- [ ] Navigation updated in `_meta.yml` files
- [ ] Cross-references added to related content
- [ ] Browser compatibility documented
- [ ] Security considerations noted
- [ ] Troubleshooting section included
- [ ] Content validated with scripts
- [ ] Build process tested

### Template for New Feature Documentation

```markdown
---
title: [Feature Name]
description: [Brief description of the feature and its purpose]
---

# [Feature Name]

## Overview

[Detailed description of what the feature does and why it's useful]

## Browser Compatibility

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome  | 88+     | Full Support  |
| Firefox | 85+     | Full Support  |
| Edge    | 88+     | Full Support  |

## Installation

[Installation instructions if needed]

## Usage

### Basic Usage

[Simple example with code]

### Advanced Usage

[More complex examples]

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| [param]   | [type] | [yes/no] | [description] |

## Examples

### Example 1: [Use Case]

[Step-by-step example]

### Example 2: [Another Use Case]

[Another example]

## Security Considerations

[Any security implications or best practices]

## Troubleshooting

### Common Issues

[List of common problems and solutions]

## Related Features

- [Link to related feature 1]
- [Link to related feature 2]
```

## Review Processes

### Content Review Workflow

#### 1. Technical Review
- **Reviewer**: Development Team Lead
- **Focus**: Technical accuracy, API correctness
- **Timeline**: 2-3 business days

#### 2. Editorial Review
- **Reviewer**: Documentation Team Lead
- **Focus**: Writing quality, clarity, consistency
- **Timeline**: 1-2 business days

#### 3. User Experience Review
- **Reviewer**: UX Team or Community Representative
- **Focus**: User journey, tutorial effectiveness
- **Timeline**: 2-3 business days

### Review Criteria

#### Technical Accuracy
- [ ] All code examples work correctly
- [ ] API documentation matches implementation
- [ ] Browser compatibility information is accurate
- [ ] Security considerations are complete

#### Content Quality
- [ ] Writing is clear and concise
- [ ] Examples are relevant and helpful
- [ ] Navigation and structure are logical
- [ ] Cross-references are accurate

#### User Experience
- [ ] Content serves user needs
- [ ] Tutorials are easy to follow
- [ ] Information is findable
- [ ] Examples solve real problems

### Review Tools and Checklists

Use the following scripts for automated review:

```bash
# Run comprehensive validation
node scripts/comprehensive-validation.js

# Check cross-references
node scripts/cross-reference-validation.js

# Validate build
node scripts/build-validation.js

# Fix frontmatter issues
node scripts/fix-frontmatter-issues.js
```

## Quality Assurance

### Automated Quality Checks

#### Daily Checks
- Link validation
- Build process verification
- Content schema validation

#### Weekly Checks
- Comprehensive content audit
- Cross-reference validation
- Asset optimization check

#### Monthly Checks
- Full content review
- User journey testing
- Performance analysis

### Quality Metrics

Track the following metrics to ensure content quality:

- **Link Health**: Percentage of working internal/external links
- **Build Success Rate**: Percentage of successful builds
- **Content Freshness**: Age of last update for each section
- **User Engagement**: Page views, time on page, bounce rate
- **Feedback Score**: User ratings and feedback

### Quality Standards

#### Content Standards
- All pages must have proper frontmatter
- Code examples must be tested and working
- Links must be validated and functional
- Images must be optimized and accessible
- Content must follow style guide

#### Technical Standards
- Build must complete without errors
- All validation scripts must pass
- Performance metrics must meet targets
- Accessibility standards must be met

## Tools and Scripts

### Available Maintenance Scripts

#### Content Analysis
```bash
# Analyze content structure and patterns
node scripts/content-analysis.js

# Detect content patterns and issues
node scripts/pattern-detection.js
```

#### Content Transformation
```bash
# Transform content for consistency
node scripts/content-transformation.js

# Update terminology globally
node scripts/global-terminology-replacement.js

# Update branding and assets
node scripts/asset-branding-update.js
```

#### Validation and Quality
```bash
# Comprehensive validation suite
node scripts/comprehensive-validation.js

# Technical accuracy review
node scripts/technical-accuracy-review.js

# Link checking
node scripts/link-checker.js

# Cross-reference validation
node scripts/cross-reference-validation.js

# Build validation
node scripts/build-validation.js
```

#### SEO and Metadata
```bash
# Update SEO metadata
node scripts/seo-meta-update.js

# Generate validation summaries
node scripts/validation-summary.js
```

### Script Usage Guidelines

#### Before Making Changes
1. Run content analysis to understand current state
2. Use pattern detection to identify potential issues
3. Plan changes based on analysis results

#### During Content Updates
1. Use transformation scripts for bulk changes
2. Validate changes incrementally
3. Test build process regularly

#### After Making Changes
1. Run comprehensive validation
2. Check technical accuracy
3. Validate cross-references and links
4. Test build and deployment

### Custom Script Development

When creating new maintenance scripts:

1. **Follow Existing Patterns**
   - Use consistent error handling
   - Provide detailed logging
   - Generate JSON reports
   - Include progress indicators

2. **Documentation Requirements**
   - Add script description to `scripts/README.md`
   - Include usage examples
   - Document parameters and options
   - Provide troubleshooting information

3. **Testing Requirements**
   - Test with sample content
   - Validate error handling
   - Check performance with large datasets
   - Ensure cross-platform compatibility

## Content Standards

### Writing Style

#### Voice and Tone
- **Professional but approachable**: Technical accuracy with user-friendly language
- **Action-oriented**: Focus on what users can do
- **Concise**: Eliminate unnecessary words
- **Consistent**: Use established terminology

#### Structure Guidelines
- Use clear headings and subheadings
- Include table of contents for long pages
- Provide examples for complex concepts
- Use bullet points and numbered lists
- Include cross-references to related content

### Technical Writing Standards

#### Code Examples
- Always test code examples before publishing
- Include complete, runnable examples
- Provide context for code snippets
- Use consistent formatting and indentation
- Include error handling where appropriate

#### API Documentation
- Document all parameters and return values
- Include example requests and responses
- Note browser compatibility requirements
- Explain error conditions and handling
- Provide troubleshooting information

### Content Organization

#### File Naming Conventions
- Use kebab-case for file names
- Use descriptive, specific names
- Avoid abbreviations unless widely understood
- Include version numbers for versioned content

#### Directory Structure
- Follow established patterns
- Group related content together
- Use `_meta.yml` files for navigation
- Maintain consistent depth levels

### Frontmatter Standards

All documentation files must include proper frontmatter:

```yaml
---
title: [Descriptive Title]
description: [Brief description for SEO and navigation]
---
```

Optional frontmatter fields:
- `contentType`: Type of content (howto, reference, tutorial)
- `tags`: Relevant tags for categorization
- `lastUpdated`: Date of last significant update
- `difficulty`: Beginner, Intermediate, Advanced

## Troubleshooting

### Common Issues and Solutions

#### Build Failures

**Issue**: Frontmatter validation errors
**Solution**: 
1. Run `node scripts/fix-frontmatter-issues.js`
2. Manually review and fix remaining issues
3. Ensure all required fields are present

**Issue**: Broken internal links
**Solution**:
1. Run `node scripts/cross-reference-validation.js`
2. Update or remove broken links
3. Verify target files exist

**Issue**: Asset loading problems
**Solution**:
1. Check asset paths and file existence
2. Verify image optimization settings
3. Update asset references if needed

#### Content Issues

**Issue**: Outdated examples or screenshots
**Solution**:
1. Review content regularly using validation scripts
2. Update examples to match current UI/functionality
3. Replace outdated screenshots

**Issue**: Inconsistent terminology
**Solution**:
1. Use `node scripts/global-terminology-replacement.js`
2. Update style guide with approved terms
3. Review content for consistency

#### Performance Issues

**Issue**: Slow build times
**Solution**:
1. Optimize images and assets
2. Review content structure for efficiency
3. Consider content splitting for large sections

**Issue**: Large bundle sizes
**Solution**:
1. Audit asset usage and optimization
2. Remove unused dependencies
3. Implement lazy loading where appropriate

### Getting Help

#### Internal Resources
- Development Team: Technical questions and API changes
- Documentation Team: Writing and structure questions
- UX Team: User experience and tutorial effectiveness
- Community: User feedback and real-world usage

#### External Resources
- [Astro Documentation](https://docs.astro.build/)
- [Starlight Documentation](https://starlight.astro.build/)
- [Markdown Guide](https://www.markdownguide.org/)

### Escalation Process

1. **Level 1**: Self-service using this guide and available scripts
2. **Level 2**: Consult with Documentation Team Lead
3. **Level 3**: Involve Development Team for technical issues
4. **Level 4**: Escalate to Project Manager for resource or priority issues

## Appendix

### Useful Commands

```bash
# Development server
bun dev

# Build for production
bun build

# Preview production build
bun preview

# Install dependencies
bun install

# Run all validation scripts
npm run validate-all  # (if script is added to package.json)
```

### File Locations

- **Documentation Source**: `src/content/docs/`
- **Assets**: `src/assets/`
- **Components**: `src/components/`
- **Configuration**: `astro.config.mjs`
- **Maintenance Scripts**: `scripts/`
- **Build Output**: `dist/`

### Contact Information

- **Documentation Team Lead**: [Contact Information]
- **Development Team Lead**: [Contact Information]
- **Project Manager**: [Contact Information]
- **Community Manager**: [Contact Information]

---

*Last Updated: [Current Date]*
*Version: 1.0*