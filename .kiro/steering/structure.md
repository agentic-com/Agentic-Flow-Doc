# Project Structure

## Root Directory
```
├── .astro/              # Astro build artifacts and type definitions
├── .env                 # Environment variables
├── .kiro/               # Kiro AI assistant configuration
├── public/              # Static assets (favicon, images)
├── src/                 # Source code
├── astro.config.mjs     # Astro configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Source Structure (`src/`)
```
src/
├── assets/              # Images, logos, and media files
├── components/          # Astro components
│   ├── (override)/      # Starlight component overrides
│   └── *.astro          # Custom components
├── content/             # Content collections
│   └── docs/            # Documentation pages
├── styles/              # Global CSS and styling
└── content.config.ts    # Content collection schemas
```

## Documentation Organization (`src/content/docs/`)
Content is organized into four main sections:

### 1. Usage (`usage/`)
- `getting-started/` - Onboarding and quick starts
- `using-the-app/` - App functionality (workflows, credentials)
- `key-concepts/` - Core concepts (data, flow logic)
- `releases/` - Release notes and versioning
- `help-and-community/` - Support and contribution guides
- `licenses-and-privacy/` - Legal and security information

### 2. Integration (`integration/`)
- `builtin/` - Built-in nodes organized by category (ai, core, flow, etc.)
- `apps/` - Third-party application integrations
- `extension/` - Browser extension specific nodes

### 3. Advanced AI (`advanced-ai/`)
- `basics/` - AI workflow fundamentals
- `langchain/` - LangChain integration guides
- `evaluations/` - AI model evaluation tools
- `examples/` - Practical AI workflow examples

### 4. Learning (`learning/`)
- `examples/` - Tutorial examples
- `video-courses/` - Video-based learning content
- `text-courses/` - Written course materials

## File Conventions

### Documentation Files
- Use `.md` for standard Markdown content
- Use `.mdx` for content requiring JSX components
- Include frontmatter with `title` and `description`
- Use `template: splash` for landing pages

### Navigation Control
- `_meta.yml` files control section labels and ordering
- Auto-sidebar generation based on file structure
- Topic-based navigation configured in `astro.config.mjs`

### Component Organization
- Override Starlight components in `src/components/(override)/`
- Custom components use `.astro` extension
- Feedback components integrated via astro-feelback

### Asset Management
- Images in `src/assets/` for content embedding
- Static files in `public/` for direct access
- Logo variants: logo.png, logo-beige.png, logo-black.png