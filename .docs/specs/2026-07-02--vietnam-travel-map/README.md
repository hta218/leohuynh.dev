# Feature: Vietnam Travel Map

| Field            | Value                                             |
| ---------------- | ------------------------------------------------- |
| **Status**       | in-progress (implemented, pending owner review)   |
| **Owner**        | @hta218                                            |
| **Issue**        | N/A                                               |
| **Branch**       | `feat/vietnam-travel-map`                          |
| **Created**      | 2026-07-02                                         |
| **Last Updated** | 2026-07-02                                         |

## Original Prompt

> Read my gody.vn travel profile page. I want to show that data on my own site,
> the same way I show the book + movie shelf. Do the map — option A (an interactive
> SVG choropleth map of Vietnam) is the best. Write the spec first.

## Summary

A new `/travel` page that visualizes the provinces of Vietnam the owner has visited
as an interactive SVG choropleth map (provinces shaded by how many places were checked
in), plus a stat tile ("16/34 units · 47% Vietnam") and a per-unit place list.
The data is a static JSON snapshot seeded from the owner's gody.vn My Travel Map profile,
mirroring the existing book/movie "shelf" pattern (local data → typed loader → page).

**Decisions locked (2026-07-02):** map uses the **new 2025 34-unit** administrative
boundaries (gody's old 63-province place labels are aggregated to new units — coverage
stays 16/34 = 47.06%). Geometry from a MIT-licensed 34-unit GeoJSON
(`thanglequoc/vietnamese-provinces-database` or `nguyenduy1133/Free-GIS-Data`, the latter
including Hoàng Sa/Trường Sa) converted to SVG paths at build. Seed data ready in this
spec folder (`places-new34.json`). See `plan.md`.

## Scope of impact (files)

New:
- `json/places.json` — seed dataset (provinces + places visited), source of truth, hand-editable.
- `src/lib/places.ts` — `Place`/`Province` types + `getPlaces()` loader (reads local JSON; no DB).
- `src/pages/travel.astro` — the page (BaseLayout + StudioShell + PageHeader + map + list).
- `src/components/travel/VietnamMap.tsx` — React island: the interactive SVG choropleth.
- `src/components/travel/vietnam-provinces.ts` (or `.svg`) — province path geometry + id→name map.
- `src/components/travel/travel-map.css` (optional) — island-scoped styles if needed.

Modified:
- `src/lib/site.ts` — add `/travel` to `MORE_LINKS` (nav) and any `SITE` links (gody profile URL).

No change:
- `src/content.config.ts` — travel data is not a content collection (matches media pattern).
- `src/lib/db.ts` / Supabase — not used; data is static local JSON.

See `plan.md` for the implementation plan, the seed dataset, and open decisions.
