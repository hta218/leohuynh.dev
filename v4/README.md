# leohuynh.dev — v4 (Astro)

New v4 site rebuild. Astro + Bun + Astro Content Collections + MDX + Tailwind v4,
following the **Fullscreen Code Studio** design direction (`sketches/006-fullscreen-code-studio`).

Spec: `../docs/specs/2026-06-14--v4-astro-rebuild/`.

## Why a subdirectory?

During migration this app lives in `v4/` so the legacy Next.js app at repo root stays intact
as a reference. Content is **not duplicated** — collections load the existing legacy MDX from
`../data/blog` and `../data/snippets` via Astro's glob loader (single source of truth).
Final cutover hoists this to repo root. See `plan.md`.

## Commands (Bun)

```bash
bun install
bun run dev        # dev server on :4321
bun run build      # static build → dist/
bun run preview    # preview built site
bun run check      # astro check (typecheck)
```

## Status

M1 (scaffold + content schema) — homepage shell, blog/snippet indexes, collection schema.
Article rendering, tags, RSS, sitemap, and integrations are later milestones (see `plan.md`).
