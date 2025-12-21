# Technology Stack

## Framework & Build System
- **Astro 5.14.5** - Static site generator with content collections
- **Starlight** - Documentation theme for Astro
- **Bun** - Package manager and runtime (preferred over npm/yarn)
- **TypeScript** - Type checking and configuration

## Styling & UI
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Custom CSS layers** - Organized as base, starlight, theme, components, utilities
- **Starlight Tailwind integration** - Pre-configured Starlight + Tailwind setup

## Key Dependencies
- **starlight-auto-sidebar** - Automatic sidebar generation
- **starlight-sidebar-topics** - Topic-based navigation
- **starlight-videos** - Video embedding support
- **starlight-llms-txt** - LLM-friendly content export
- **astro-feelback** - User feedback components
- **Sharp** - Image optimization

## Content Management
- **Content Collections** - Astro's type-safe content system
- **MDX support** - Markdown with JSX components
- **Frontmatter schemas** - Validated metadata for docs
- **Auto-generated navigation** - Based on file structure and _meta.yml files

## Common Commands
```bash
# Development
bun dev              # Start dev server at localhost:4321
bun start            # Alias for dev

# Build & Deploy
bun build            # Build production site to ./dist/
bun preview          # Preview build locally

# Package Management
bun install          # Install dependencies
bun astro ...        # Run Astro CLI commands
```

## Environment Variables
- `PUBLIC_SITE_URL` - Site URL for production builds
- `VITE_CONTENT_SET_ID` - Feedback component configuration