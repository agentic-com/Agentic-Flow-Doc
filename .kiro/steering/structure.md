# Project Structure & Conventions

## Architecture Patterns

### Content Collections Structure

- All documentation lives in `src/content/docs/` with strict organization
- Four main sections: `usage/`, `integration/`, `advanced-ai/`, `learning/`
- Each section follows hierarchical folder structure with `_meta.yml` for navigation control
- Use content collections for type-safe frontmatter validation

### File Naming Conventions

- Documentation files: kebab-case (e.g., `ai-workflow-builder.md`)
- Component files: PascalCase (e.g., `FeedbackComponent.astro`)
- Configuration files: lowercase with extensions (e.g., `astro.config.mjs`)
- Meta files: `_meta.yml` for navigation configuration

## Critical File Locations

### Configuration Files

- `astro.config.mjs` - Main Astro configuration with Starlight setup
- `src/content.config.ts` - Content collection schemas and validation
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies managed with Bun

### Content Organization Rules

```
src/content/docs/
├── usage/           # User-facing app functionality
├── integration/     # Node documentation by category
├── advanced-ai/     # AI-specific workflows and concepts
└── learning/        # Educational content and examples
```

### Component Architecture

- Override Starlight components in `src/components/(override)/`
- Custom components in `src/components/` with `.astro` extension
- Use Astro component syntax, not React/Vue

## Development Patterns

### Content Creation Rules

- Always include frontmatter with `title` and `description`
- Use `.md` for standard content, `.mdx` only when JSX components needed
- Landing pages use `template: splash` in frontmatter
- Node documentation follows consistent structure: purpose → parameters → examples

### Navigation Management

- `_meta.yml` files control sidebar labels and ordering
- Auto-sidebar generation based on file structure
- Topic-based navigation configured in main config
- Maintain consistent hierarchy depth (max 3-4 levels)

### Asset Handling

- Images for content: `src/assets/` (processed by Astro)
- Static assets: `public/` (served directly)
- Logo variants available: `logo.png`, `logo.png`, `logo.png`

## Code Style Guidelines

### Frontmatter Standards

```yaml
---
title: "Node Name"
description: "Brief description of functionality"
template: doc # or 'splash' for landing pages
---
```

### File Organization Principles

- Group related content in folders with descriptive names
- Use `index.md` for section overviews
- Maintain parallel structure across main sections
- Keep file paths under 100 characters for compatibility

### Content Linking

- Use relative paths for internal links
- Reference other nodes and concepts with proper linking
- Maintain cross-references between related topics
- Use consistent terminology across all documentation
