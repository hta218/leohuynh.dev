# Plan: Shelf Cover Grid

## Layout

- Currently reading: 4-column grid (3 on mobile) of covers with a `reading` badge, title, author.
- Read: 6-column grid (4 on `sm`, 3 on mobile), title + author, first 12 shown.
- Watching: chips `All · 10 · 9 …` (Hugeicons star, filled amber) with counts, then a 6-column
  poster grid with an IMDb badge, title + `year (· TV)`, first 18 shown. My rating is not on the
  cards; in the "All" view a full-width divider (`★ 10/10 ──── 23 titles`) opens each rating group.
- Book covers round only the right corners (spine on the left); posters round all four.
- Hover underlines the title (no lift effect); titles clamp to two lines.

## Behaviour

- Every item is rendered server-side; items past the page size get `hidden`.
- A small script per `[data-shelf]` block keeps `rating` + `limit`: chips reset `limit` to one
  page, "Show more" adds a page, and the button shows the remaining count or hides.
- A rating divider shows only in the "All" view and only once its group has a visible item.
- Runs on `astro:page-load` (ClientRouter navigation).

## Payload trade-off

The 2026-07-09 client-navigation spec (P2.2) moved items behind `/api/shelf.json` to keep the
initial HTML small. The grid markup is much lighter per item, so rendering everything costs
233 KB raw / 34 KB gzip versus 207 KB / 29 KB before, and expanding no longer fetches the
~54 KB (gzip) API payload.

## Files touched

- `src/pages/shelf.astro` — rewritten (markup, global `.shelf-*` styles, filter script).
- `src/pages/api/shelf.json.ts` — removed (only the old "Show more" used it).
- `.docs/specs/2026-11-24--shelf-grid/` — this spec.
