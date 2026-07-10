# P2.1 implementation notes

Date: 2026-07-10
Branch: `perf/client-navigation-spec`

## Scope implemented

P2.1 only — reduce `/heatmap` initial HTML by moving projected map geometry out
of the document and into the map island bundle.

- Added `json/heatmap-map.json`, generated from the existing Vietnam/neighbour
  GeoJSON plus `json/places.json`.
- Added `bun run heatmap:refresh` to regenerate that snapshot.
- Updated `src/pages/heatmap.astro` so the page no longer projects GeoJSON with
  `d3-geo` or passes `provinces`, `neighbours`, and `viewBox` as serialized props
  to the client island.
- Updated `VietnamMap` so it imports the generated snapshot directly inside the
  React island.
- Kept the existing interactive map behavior: hover, keyboard focus, province
  click details, legend, and hotspot list.

Explicitly NOT in this slice:

- No P2.2 `/shelf` refactor.
- No P2.3 `/builds` refactor.
- No visual redesign of the heatmap.
- No route URL / canonical change, no env change, no DB change.

## Files changed

- `json/heatmap-map.json`
  - Generated projected map data: `viewBox`, `provinces`, and `neighbours`.
- `scripts/refresh-heatmap-map.ts`
  - Projects GeoJSON with `d3-geo` and writes the snapshot.
- `package.json`
  - Adds `heatmap:refresh` script.
- `src/pages/heatmap.astro`
  - Removes request/build-time projection code from the page.
  - Uses the snapshot only for stats and the server-rendered hotspot list.
  - Renders `<VietnamMap client:visible />` without large serialized props.
- `src/components/travel/VietnamMap.tsx`
  - Imports the snapshot inside the client island.

## Verification performed

- `bun run heatmap:refresh` — passed, wrote 34 provinces and 12 neighbours.
- `git diff --check` — passed.
- `bun run check` — passed, 0 errors / 0 warnings / 0 hints.
- `bun run build` — passed.
- Built `/heatmap` HTML size: `339,601` bytes (~331.6 KB).
  - Historical finding before this slice was about ~500 KB; this is roughly a
    35% reduction.
  - It does not yet hit the original ~220 KB target because shared shell/sidebar
    HTML and the server-rendered hotspot list are still significant.
- Browser smoke on local dev server:
  - `/heatmap` renders the map.
  - 34 province SVG paths are present after the island loads.
  - browser console was clean.
- Autoreview Copilot local diff — clean, no actionable findings.

## Expected impact

- Client navigation no longer has to fetch/parse the projected SVG path data as
  part of the `/heatmap` document before swapping pages.
- The map data moves into the `client:visible` island bundle, so the visible page
  shell/stats/hotspot list can arrive with a lighter document.
