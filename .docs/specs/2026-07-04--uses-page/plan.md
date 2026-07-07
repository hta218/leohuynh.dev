# Plan: /uses page

## Goal

Add a `/uses` route that lists the gear, editor setup, apps, and dev tools Leo
uses. Match the existing studio-shell visual language; reuse the card style from
`shelf.astro` and the data-driven section pattern from `takes.astro`.

## Approach

- Single static Astro page, no new data source.
- Data lives in a `SECTIONS` array at the top of the page: each section has a
  `title`, an `icon` (HugeIcon name), and `items[]`.
- Each item: `{ name, description?, meta?, href? }`. When `href` is set the card
  becomes an outbound link with a `↗` affordance and hover shadow, otherwise a
  static card — same treatment as shelf entries.
- Register a nav leaf in the explorer tree so it appears in the sidebar.
- Seed with realistic placeholder gear; owner edits into the real setup later.

## Files touched

- `src/pages/uses.astro` — new page (data + render).
- `src/components/studio/studio-shell/lib/explorer-tree.ts` — add `uses` leaf
  (`keyboard` icon, `activeWhen: exact('/uses')`), placed after `shelf`.
- `.docs/specs/2026-07-04--uses-page/` — this spec.

## Sections (placeholder seed)

1. Editor & Terminal
2. Hardware
3. Desktop apps
4. Dev tools
5. Everyday carry

## Out of scope

- Real per-item affiliate/store links (owner supplies later).
- Images/logos per tool (text cards only for v1).
