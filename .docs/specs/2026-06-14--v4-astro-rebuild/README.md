# leohuynh.dev v4 Astro rebuild

Status: accepted direction / implementation spec
Created: 2026-06-14
Branch: `v4`
Reference design: `sketches/006-fullscreen-code-studio/`

## Goal

Rebuild `leohuynh.dev` as a new v4 site with a fresh source code base, new tech stack, and new design direction.

The v4 site should feel like a light, minimal, personal code workspace: clearly programmer-native, full-screen, and a little playful, without becoming a heavy VS Code clone.

## Non-goals

- Do not redesign the legacy v3 site in place.
- Do not preserve the old Next.js source structure unless a piece is still useful.
- Do not leak or copy any local secret values into committed files.
- Do not overbuild a generic SaaS/dashboard look.

## Branch and deployment strategy

- `main` currently represents the legacy production site.
- Existing remote `v3` is preserved as-is because it already diverges from `origin/main`.
- Freeze current `origin/main` into branch `legacy-v3` and deploy it to `v3.leohuynh.dev` as the long-lived legacy reference.
- Continue all new work on `v4`.
- Promote `v4` to `main` only after content migration, URL parity, design QA, and deployment checks pass.

## Chosen design direction

Use **006 — Fullscreen Code Studio** as the primary design direction.

Source artifacts:

- `sketches/006-fullscreen-code-studio/index.html`
- `sketches/006-fullscreen-code-studio/README.md`
- `sketches/_screenshots/006-fullscreen-code-studio.png`

### Design principles

- Light mode first.
- Full-screen desktop layout.
- Coder/programmer vibe through structure, typography, metadata, command/file motifs, and live widgets.
- Clean article reading experience; keep the code-workspace motif subtle on long-form pages.
- Personal and useful over polished/enterprise.

### Homepage structure

Desktop layout:

- Top title/status bar.
- Left explorer/sidebar:
  - profile/about
  - writing sections
  - projects
  - snippets
  - uses/stack
- Main content panel:
  - README-style hero
  - short intro
  - selected writing/projects
  - code/terminal-inspired snippets where useful
- Right runtime rail:
  - Spotify now playing
  - GitHub today
  - recent activity
  - currently reading / last watched / small personal widgets if useful
- Bottom status bar:
  - latest commit/deploy metadata
  - location/timezone
  - build/version hint

Mobile layout:

- Collapse to a simple single-column page.
- Sidebar becomes a compact nav/menu.
- Runtime rail cards stack below hero.
- No horizontal fake-IDE overflow.

### Avoid

- Too much chrome.
- Fake unreadable code everywhere.
- Dark-mode-first design.
- Heavy animation or gimmicks that hurt reading.
- Full-site VS Code cosplay; use the IDE motif as framing, not as the whole product.

## Tech stack

Target stack:

- Astro for the app/site framework.
- Bun for package manager/runtime/scripts.
- Astro Content Collections for blog/snippet content.
- MDX for long-form writing and rich examples.
- Tailwind CSS v4 for styling.
- Shiki / Expressive Code or equivalent for code blocks.
- Pagefind or Astro-native static search for local search.
- Astro View Transitions for small polish, only where it helps.
- React islands only for interactive widgets that need client state.

Keep or adapt from current stack where practical:

- Supabase Postgres + Drizzle for views/reactions/activity/books/movies if still needed.
- Existing APIs as references for Spotify, GitHub, activities, stats, and reactions.
- Umami analytics.

## Existing content to migrate

Current content sources:

- `data/blog/*.mdx` — 28 posts at time of inspection.
- `data/snippets/*.mdx` — 26 snippets at time of inspection.
- `data/projects.ts`
- site metadata from `data/site-metadata.ts`
- author/about data and shared content utilities.

Migration requirements:

- Preserve existing blog URLs.
- Preserve canonical metadata, Open Graph, RSS, sitemap, and tags.
- Preserve or intentionally redirect all high-value URLs.
- Especially protect evergreen traffic to `/blog/does-promise-all-run-in-parallel-or-sequential`.

## Data and integrations

### Spotify now playing

Show current or recently played track with graceful fallback when offline or unauthenticated.

Required states:

- playing
- recently played
- unavailable / private / token failure

### GitHub today

Add a compact daily coding summary:

- contributions today
- commits today
- lines added / removed if available
- top active repo(s)

Implementation options:

- GitHub GraphQL/API with server-side cache.
- Scheduled/static refresh at build time for public data where possible.
- Runtime serverless endpoint only if needed for tokens/rate limits.

### Recent activities

Keep the current site’s activity concept, but improve the display:

- GitHub events
- writing/posts
- books/movies if still valuable
- deploy/build activity if easy

### Stats/reactions

Resolved in M4 follow-up:

- views counter retained
- reactions retained
- guestbook/comments dropped (production `/guestbook` is 404; no current feature to migrate)

Views/reactions use client islands plus a server-side `/api/stats` Vercel Function backed by `DATABASE_URL`.

## URL and SEO checklist

Before promoting v4 to `main`:

- Generate route inventory from current site.
- Generate route inventory from v4 build.
- Diff route lists and add redirects/aliases where needed.
- Verify RSS feed.
- Verify sitemap.
- Verify canonical URLs.
- Verify Open Graph/Twitter images.
- Verify robots.txt.
- Verify 404 page.
- Check Lighthouse/basic performance on homepage and article page.

## Implementation milestones

1. Freeze legacy v3
   - Preserve the existing remote `v3` branch.
   - Use `legacy-v3` as the frozen copy of current `origin/main`.
   - Configure `v3.leohuynh.dev` to deploy from `legacy-v3` or from a separate legacy project pointing at that branch.

2. Scaffold v4
   - Replace old Next.js app with Astro structure on branch `v4`.
   - Configure Bun, TypeScript, Tailwind v4, MDX, Astro Content Collections.
   - Keep old files only as migration references until replaced.

3. Content migration
   - Define blog/snippet content schemas.
   - Migrate MDX frontmatter and imports.
   - Implement tags, lists, RSS, sitemap, and slug parity.

4. Design implementation
   - Convert 006 mockup into production components.
   - Build homepage, nav/sidebar, runtime rail, status bar, and responsive behavior.
   - Build clean article/snippet/project pages.

5. Integrations
   - Spotify now playing.
   - Recent activities.
   - GitHub today summary.
   - Umami.
   - Stats/reactions.

6. Verification and cutover
   - Run typecheck/lint/build.
   - Compare route inventory.
   - Test desktop/mobile screenshots.
   - Deploy preview.
   - Promote v4 to `main` after approval.

## Acceptance criteria

- `v4` builds successfully with Bun/Astro.
- Homepage implements the 006 design direction, not a generic template.
- Blog posts and snippets render correctly from Astro Content Collections.
- Existing important URLs keep working or redirect correctly.
- Spotify, GitHub today, and recent activity widgets fail gracefully.
- RSS, sitemap, metadata, and analytics are working.
- `v3.leohuynh.dev` remains available as the legacy reference.
- No secrets are committed.

## Claude Code handoff prompt

Current handoff is M11 clean root cutover, not initial rebuild. Use this after reading `plan.md` and `m11-cutover-handoff.md`:

```text
/goal Perform M11 production cutover for leohuynh.dev on branch v4.

Read .docs/specs/2026-06-14--v4-astro-rebuild/README.md, plan.md, route-inventory.md, work-log.md, and m11-cutover-handoff.md first.

Goal: hoist the Astro app from v4/ to repository root, remove legacy Next source from this branch, fix all paths/config/scripts for root-native Astro, and verify from repo root.

Important constraints:
- Work only on branch v4.
- Do not mutate main, v3, or legacy-v3.
- Legacy code is preserved on other branches, so v4 should become clean Astro root.
- Preserve data/, json/, public/static/, icons/, .docs/specs/, .github/, .husky/, and non-secret project metadata.
- Do not commit secrets or .env values.
- Do not push.
- Run bun install, bun run check, bun run build, and HTTP/browser smoke where practical.
- Update work-log.md and mark M11 complete only if verification passes.
```

## Open questions

- Views/reactions retained in M4 follow-up; guestbook dropped because production `/guestbook` is 404.
- Use Pagefind search at launch or defer?
- Should books/movies stay as dedicated pages or become small homepage widgets?
- Vercel setup detail for `v3.leohuynh.dev`: branch domain in same project vs separate legacy project.
