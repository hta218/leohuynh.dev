# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog and portfolio website built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS. Content is managed with MDX files using Contentlayer2, and data is stored in a Supabase PostgreSQL database with Drizzle ORM.

## Essential Commands

### Development
```bash
pnpm dev         # Start development server on port 3434
pnpm build       # Build for production
pnpm serve       # Start production server
```

### Code Quality
```bash
pnpm biome:fix   # Auto-fix code style and linting issues
pnpm biome:lint  # Check for linting issues
pnpm biome:format # Format code
pnpm typecheck   # Run TypeScript type checking
pnpm lint        # Run Next.js linter
```

### Database
```bash
pnpm db:init     # Generate and push database migrations
pnpm db:studio   # Open Drizzle Studio on port 8088
pnpm seed        # Seed database with initial data
```

### Testing & Analysis
```bash
pnpm analyze     # Analyze bundle size
```

## Architecture

### Content Management
- **MDX Content**: Blog posts in `/data/blog/`, snippets in `/data/snippets/`, author data in `/data/authors/`
- **Contentlayer**: Processes MDX files, generates TypeScript types, handles frontmatter extraction
- **Static Generation**: JSON files for tags (`/json/tag-data.json`), search index, RSS feeds

### Database Layer
- **Drizzle ORM**: Type-safe database operations, schema in `/db/schema.ts`
- **Supabase PostgreSQL**: Hosts reactions, views, and activity data
- **Migrations**: Located in `/supabase/migrations/`

### API Routes (App Router)
- `/app/api/activities/`: Activity feed data
- `/app/api/github/`: GitHub integration
- `/app/api/spotify/`: Spotify now-playing integration  
- `/app/api/stats/`: Blog statistics
- `/app/api/newsletter/`: Newsletter subscription

### Component Organization
- `/components/ui/`: Reusable UI components
- `/components/blog/`: Blog-specific components (comments, reactions, TOC)
- `/components/home-page/`: Homepage sections
- `/components/mdx/`: MDX rendering components
- `/layouts/`: Page layout templates

## Coding Standards

### TypeScript & JavaScript
- Use `const` for constants (ALL_CAPS naming), prefer `let` for variables
- Use arrow functions for callbacks
- Prefer async/await over promises
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Avoid `any` type, define proper interfaces

### React Patterns
- Functional components with hooks only
- Keep components small and focused
- Use React.FC type for components with children

### File Naming
- Components: PascalCase (e.g., `BlogPost.tsx`)
- Utilities/hooks: camelCase (e.g., `useActivities.ts`)
- MDX content: kebab-case (e.g., `my-blog-post.mdx`)

### Code Style (Biome Configuration)
- 2 spaces indentation
- Single quotes for JS/TS strings
- Double quotes for JSX attributes
- Trailing commas in multi-line structures
- 80 character line limit
- Semicolons as needed (ASI)

## Environment Variables

Required in `.env`:
- `DATABASE_URL`: Supabase PostgreSQL connection string
- Spotify API credentials for now-playing feature
- GitHub API token for activity feed
- Umami analytics configuration

## Path Aliases

- `~/`: Root directory (e.g., `~/components/ui/button`)
- `contentlayer/generated`: Contentlayer generated types

## Pre-commit Hooks

Husky runs Biome checks on staged files via lint-staged before commits.

## Important Notes

- Always run `pnpm biome:fix` before committing
- MDX files require proper frontmatter (title, date, tags, summary)
- Database schema changes require new migrations via Drizzle Kit
- Static assets go in `/public/static/`
- Use existing UI components from `/components/ui/` when possible