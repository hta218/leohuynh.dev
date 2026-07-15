# Plan: Bilingual Blog Posts

## Problem

The `blog` collection had no language support — the `misc` collection already
models bilingual content (`lang: 'en' | 'vi'` + `translationOf` pointing at the
canonical entry), but blog posts were implicitly English-only. We want to
publish a technical post (git worktree) in both English and Vietnamese under
`/blog/<slug>`, without translations showing up as duplicate entries in lists.

## Approach

Mirror the proven `misc` pattern 1:1 onto the `blog` collection:

- **Schema**: add `lang` (default `'en'`) and optional `translationOf` to the
  blog collection. Existing posts need no frontmatter changes.
- **Listing rule**: every list surface (blog index, pagination, home "latest",
  studio sidebar latest-post link, RSS feed, tag counts, tag pages) shows only
  primary posts (`translationOf` unset). Translations are reachable via the
  language switcher on the detail page.
- **Detail page**: build the translation group in `getStaticPaths`, render a
  language switcher pill (same UI as misc), emit hreflang alternates
  (`en`, `vi`, `x-default` → primary) and set `<html lang>` + JSON-LD
  `inLanguage` from frontmatter.
- **Search**: `search.json` keeps BOTH languages — search is a finder, not a
  list, and titles differ per language.

Shared helper `isPrimary()` lives in `src/lib/content.ts`.

## Files Touched

| File | Change |
| --- | --- |
| `src/content.config.ts` | `lang` + `translationOf` on blog schema |
| `src/lib/content.ts` | `isPrimary()` helper; primaries-only tag counts & tag lists |
| `src/pages/blog/index.astro` | filter primaries for list + count + pagination math |
| `src/pages/blog/page/[page].astro` | filter primaries in `getStaticPaths` |
| `src/pages/blog/[...slug].astro` | translations group, language switcher, hreflang, `lang`/`inLanguage` |
| `src/pages/index.astro` | latest-3 posts from primaries only |
| `src/components/studio/StudioShell.astro` | sidebar latest-post link from primaries only |
| `src/pages/feed.xml.ts` | RSS blog items from primaries only |
| `data/blog/git-worktree-one-repo-many-working-directories.mdx` | new post (EN, canonical) |
| `data/blog/git-worktree-mot-repo-nhieu-thu-muc-lam-viec.mdx` | new post (VI, `translationOf` → EN slug) |

## Verification

- `bun run check` — 0 errors / 0 warnings.
- `bun run build` — clean; inspected `dist/client`:
  - both post pages generated; EN ↔ VI switcher links present on both
  - hreflang `en`/`vi`/`x-default` emitted on both pages; VI page has `<html lang="vi">`
  - blog index, home, `/topics/git`, and `feed.xml` contain only the EN post
  - `search.json` contains both language variants

## Authoring a bilingual post (for next time)

1. Write the canonical post as usual (no new fields needed; `lang` defaults to `en`).
2. Write the translation with `lang: 'vi'` and `translationOf: '<canonical-filename-without-ext>'`.
3. Keep `date` identical on both so the pair sorts together.
