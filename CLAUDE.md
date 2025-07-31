# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal blog and portfolio site built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS v4. Features an interactive terminal interface as the main navigation system.

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (Supabase) with Drizzle ORM
- **Content**: MDX via Contentlayer2
- **Linting/Formatting**: Biome
- **Analytics**: Umami

## Essential Commands

```bash
# Development
pnpm dev               # Start dev server on port 3434
pnpm start             # Start dev server on port 3435

# Build & Production
pnpm build             # Build for production (includes postbuild script)
pnpm serve             # Start production server
pnpm analyze           # Analyze bundle size

# Code Quality
pnpm lint              # ESLint fix for all source directories
pnpm biome:lint        # Biome lint with auto-fix
pnpm biome:format      # Biome format
pnpm biome:fix         # Biome check and fix all issues
pnpm typecheck         # Run TypeScript type checking

# Database
pnpm db:init           # Generate and push DB schema
pnpm db:studio         # Open Drizzle Studio on port 8088
pnpm seed              # Seed database with initial data

# Clean
pnpm clean             # Remove all build artifacts and dependencies
```

## Architecture Overview

### Core Structure

```
app/                    # Next.js 15 App Router pages
├── layout.tsx         # Root layout with terminal integration
├── page.tsx           # Homepage (terminal interface)
├── blog/              # Blog pages with MDX content
├── projects/          # Projects showcase
├── snippets/          # Code snippets
└── api/               # API routes (GitHub, Spotify, stats)

components/
├── home-page/terminal/  # Main terminal interface
│   ├── index.tsx       # Terminal component
│   ├── window.tsx      # Resizable window wrapper
│   ├── commands/       # Individual command implementations
│   └── types.ts        # TypeScript definitions
├── blog/               # Blog-related components
├── ui/                 # Reusable UI components
└── mdx/                # MDX rendering components

data/
├── blog/               # Blog posts in MDX
├── snippets/           # Code snippets in MDX
└── site-metadata.ts    # Site configuration

db/
├── schema.ts           # Drizzle ORM schema
├── queries.ts          # Database queries
└── index.ts            # Database connection
```

### Key Features

1. **Terminal Interface**: Interactive command-line UI for navigation
   - Command system with auto-suggestions
   - Theme switching (Solarized Light/Dark, GitHub Light)
   - Font selection (Mono, JetBrains Mono, Fira Code, Source Code Pro)
   - Resizable window with drag functionality
   - Blog reader modal integration

2. **Content Management**: MDX-based blog and snippets
   - Contentlayer2 for processing MDX files
   - Syntax highlighting with rehype-pretty-code
   - Reading time, TOC generation
   - Tag system with counts

3. **Database Integration**: PostgreSQL with Drizzle ORM
   - Schema in `db/schema.ts`
   - Type-safe queries
   - Migrations in `supabase/migrations/`

4. **External Integrations**:
   - GitHub API for activity tracking
   - Spotify API for currently playing
   - Goodreads/IMDB data parsing

## Development Guidelines

### Code Style (from Copilot Instructions)

- **Naming**: camelCase for variables/functions, PascalCase for components, ALL_CAPS for constants
- **Strings**: Use double quotes
- **Indentation**: 2 spaces
- **Functions**: Arrow functions for callbacks
- **Private members**: Prefix with underscore (_)
- **Async**: Use async/await
- **Constants**: Use `const` only for true constants (ALL_CAPS names), prefer `let` otherwise
- **Modern JS**: Use ES6+ features, destructuring, template literals

### TypeScript

- Always define types for function parameters and return values
- Avoid `any` type
- Use interfaces for data structures
- Prefer readonly and immutable data
- Use optional chaining (?.) and nullish coalescing (??)

### React

- Functional components with hooks
- React.FC type for components with children
- Keep components small and focused
- Follow hooks rules (no conditional hooks)

### Terminal Development

When working on terminal features:
1. Commands are defined in `components/home-page/terminal/commands.ts`
2. Individual command implementations in `components/home-page/terminal/commands/`
3. Window resizing logic in `components/home-page/terminal/window.tsx`
4. Theme system affects all terminal components consistently

### Content Updates

- Blog posts: Add MDX files to `data/blog/`
- Snippets: Add MDX files to `data/snippets/`
- Run `pnpm build` to regenerate tag counts and search index
- Images referenced in MDX should be placed in `public/static/images/`

### Database Changes

1. Modify schema in `db/schema.ts`
2. Run `npx drizzle-kit generate` to create migration
3. Run `npx drizzle-kit push` to apply changes
4. Update queries in `db/queries.ts` as needed

## Important Notes

- Environment variables required: `DATABASE_URL`, Umami analytics ID
- The terminal is the main interface - preserve its functionality when making changes
- Biome is used for both linting and formatting - run `pnpm biome:fix` before committing
- All content is processed at build time via Contentlayer
- The site uses CSP headers defined in `next.config.js`