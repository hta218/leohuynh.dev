# Work Logs

## 2026-07-02 — @hta218 (implemented via Claude)

- Scraped the gody.vn My Travel Map profile (JS-rendered redirect flow: GET for CSRF
  token → POST with `hash`), parsed the SSR block into per-province place data.
  gody truncates each province's public list to 5, so `Hà Nội` (27) and `Sơn La` (6)
  are `placesPartial` — counts are correct, some names await manual fill.
- Chose the **new 2025 34-unit** map. Mapped old (63) province names → new units and
  aggregated counts → coverage lands on **16/34 = 47.06%**, matching gody's headline.
- Sourced geometry from `nguyenduy1133/Free-GIS-Data` (MIT) `Provinces.geojson` (34
  units, incl. Hoàng Sa/Trường Sa). Wrote `convert.py`: Douglas-Peucker simplify (~600m),
  Mercator projection to an SVG viewBox, far-offshore clip for a compact mainland view.
  Fixed a source mislabel (Ma 31 "Lạng Sơn" → geographically Đồng Tháp). Output → 82 KB
  `src/components/travel/vietnam-provinces.ts`.
- Built the feature (mirrors the shelf/media pattern):
  - `json/places.json` — seed (16 visited units, 58 places), source of truth.
  - `src/lib/places.ts` — `getPlaces()` merges geometry + snapshot; `getTravelStats()`.
  - `src/components/travel/VietnamMap.tsx` — React island: SVG choropleth (monochrome
    slate ramp to match the palette), hover/tap → side detail panel, legend.
  - `src/pages/travel.astro` — stats tiles + island (`client:visible`) + SSR province
    list fallback.
  - `src/lib/site.ts` — `/travel` in `MORE_LINKS`, `godyProfileUrl` in `SITE`.
- Verified: `astro check` 0 errors, `biome check` clean, `astro build` OK. Built
  `/travel/index.html` SSRs all 34 province paths + the 47.1% stat + full list. Rendered
  the end-to-end SVG to confirm the choropleth shape and shading.
- Pending: owner visual QA on the dev server (`:3434`); hand-fill Hà Nội's 22 + Sơn La's
  1 missing place names if wanted. Optional: render Hoàng Sa/Trường Sa as an inset.

## 2026-07-03 — @hta218

- Renamed the route `/travel` → `/heatmap` (owner wanted an engineering-vibe name; the
  choropleth literally *is* a heatmap). `git mv src/pages/travel.astro heatmap.astro`,
  updated `StudioShell active`/`crumb`, `MORE_LINKS`, and the `places.ts` loader comment.
- Wired the page into the **left sidebar** (it was only in `MORE_LINKS`, not the explorer
  tree): added a `heatmap` leaf in `explorer-tree.ts` after `shelf`, icon `land-plot`
  (region/plot boundary — reads as a mapped territory). Added `'land-plot'` to the
  `HugeIconName` union in `types.ts` (was missing though `HugeIcon.astro` supported it).
- Kept the internal `src/components/travel/` island folder name as-is (semantic: Vietnam
  travel map). `astro check` clean (0 src errors), `biome check` clean.

## 2026-07-03 (2) — @hta218 — owner QA fixes

Six issues from the first visual pass:

1. **Click didn't stick** — hover set the active province, then the click handler toggled
   it right back off (mouseenter + click cancelled out, dead on touch). Split state into
   `hoverCode` (preview) + `pinnedCode` (click-locked); `active = hover ?? pinned`, so a
   click now pins and survives the pointer leaving.
2. **Monochrome → color** — swapped the slate ramp for a warm yellow→red "heat" ramp
   (`#facc15 → #f59e0b → #ea580c → #b91c1c`), visited-zero `#fde68a`, unvisited `#eef2f6`.
   Legend updated to match.
3. **Hoàng Sa / Trường Sa added** — source geometry clips far-offshore, so drew them as
   labelled dashed-box insets in the East Sea (cartographic convention). Positions checked
   against province path coords per y-band so the boxes clear the mainland (Hoàng Sa x≥715
   vs land maxX 622; Trường Sa x≥820 vs land maxX 806). Rendered to PNG to confirm.
4. **Heatmap-tone copy** — `Travel map` → `Travel heatmap`, new description, section
   heading `Where I've been` → `Hotspots`.
5. **Bigger map** — grid flipped to `[minmax(0,1fr)_minmax(0,300px)]` (map takes the wide
   flexible column, detail panel fixed 300px); SVG cap raised 340px → `max-w-140` (560px).
6. **Expandable place cards** — moved the SSR province list into a new island
   `ProvinceList.tsx`: each card shows 4 places, `+ N more` button reveals the rest of the
   *known* spots. The `N not listed on gody` count stays a note (gody never exposed those
   names — nothing to reveal until hand-filled; still pending for Hà Nội +22, Sơn La +1).

`astro build` OK; `/heatmap` SSRs the heat-shaded map, both archipelago insets, and the
expand buttons. `biome check` + `astro check` clean.

## 2026-07-03 (3) — @hta218 — owner QA round 2

1. **Inconsistent hover border** — the active province's thick outline was overpainted on
   the edges it shared with later-drawn neighbours (SVG paint order), so some borders read
   thin. Fix: all provinces now draw a uniform white 0.8 stroke, and the active province is
   *redrawn on top* as an overlay path (`pointer-events: none`) with the full thick outline
   — consistent on every edge. Verified by rendering Sơn La active.
2. **Heat → green** — swapped the warm ramp for a sequential green ramp
   (`#dcfce7 → #86efac → #22c55e → #15803d → #14532d`); active outline `#14532d`.
3. **Realism note** — clarified for the owner: the mainland paths are real GeoJSON data
   (`vietnam-provinces.ts` from Free-GIS-Data via `convert.py`); only the Hoàng Sa/Trường
   Sa insets are stylised markers (source clips far-offshore). Real archipelago geometry
   would need the source GeoJSON re-run through `convert.py` without the offshore clip.
4. **Personal copy** — dropped "…new 2025 administrative units"; description is now a
   first-person "I really love to travel…" line.
5. **Fit-to-viewport** — the map is tall (viewBox 1000×1925). Switched from width-driven
   (`max-w-140`) to height-driven sizing: `w-auto h-auto max-h-[78vh] max-w-full` +
   explicit `aspect-ratio: 1000 / 1925`, centred in its column — fits within the desktop
   viewport, still full-width on mobile.
6. Owner will revisit the underlying place data (Hà Nội / Sơn La unlisted names) later.

## 2026-07-04 — @hta218 — adopt the d3-geo map, remove the old variant

Owner reworked the map (commits `50358ee`, `2b3ab9c`, `444b5c2`, `799b78c`): an
experimental `/heatmap-lab` projecting real GeoJSON with **d3-geo** (`geoMercator`,
`geoPath`) at build time instead of pre-baked SVG paths. It frames the region as a
full-bleed rectangle — sea + neighbouring countries behind, Vietnam lifted on top with a
drop-shadow — and the Hoàng Sa / Trường Sa archipelagos now render at their true projected
positions (the GeoJSON keeps them). Interaction: cursor-following tooltip on hover, click to
pin a floating detail card over the sea. The province list (`ProvinceList`) went fully
static (5 spots + a "N more listed on gody" note pinned to the card bottom).

Adopted it as the real `/heatmap` and cleaned up the old approach:

- Deleted the old `src/pages/heatmap.astro` and promoted the lab page in its place
  (`heatmap-lab.astro` → `heatmap.astro`, crumb fixed).
- Deleted the old `VietnamMap.tsx`; renamed `VietnamMapLib.tsx` → `VietnamMap.tsx` (dropped
  the "Lib" experiment name and its doc caveats).
- Deleted `src/components/travel/vietnam-provinces.ts` — the 82 KB of pre-baked SVG paths
  the d3-geo approach makes obsolete.
- Refactored `src/lib/places.ts` into a pure visit-snapshot loader: it now reads only
  `json/places.json` (returns `PlacesSnapshot[]` keyed by `id`); geometry is projected in
  the page from `json/vietnam-provinces.geojson`. The page merges the snapshot by `id`
  (was `code`), deriving `visited` from snapshot presence.

Data sources now: `json/vietnam-provinces.geojson` (34 units incl. archipelagos),
`json/neighbours.geojson` (region countries). `d3-geo` + `@types/d3-geo` are deps.
`astro check` + `biome check` clean; `astro build` OK — `/heatmap` SSRs the framed map,
neighbours, sea, and the static province list. `/heatmap-lab` no longer exists.

## 2026-07-04 (2) — @hta218 — re-crawl gody after owner added more check-ins

Owner added more places on gody, so re-scraped `json/places.json`. Crawl flow (no saved
script — documented here):

1. `GET https://gody.vn/blog/huynhtuananh218951440` → a JS loader page carrying a `_token`
   (CSRF) + session cookie. The real My-Travel-Map view lives behind the hash
   `#ban-do-viet-nam` (found in the profile's "My Travel Map" link).
2. `POST` the same URL with `_token` + `hash=#ban-do-viet-nam` (cookie jar from step 1) →
   the ~469 KB SSR map page. Each place is a `data-province` / `data-place-title` /
   `data-total-place` triple; each province a `<h3>` header + `Đã đến: <span>N</span>
   địa điểm` (the true count, even though only 5 names show per province).
3. Parsed 24 old-63 provinces (100 places total), mapped old→new via the GeoJSON's
   `mergedFrom`, aggregated counts, tagged merged-in places with `origProvince`.

Result: **18/34 units, 52.94%, 100 places** (was 16/34, 47%, 58). New units this round:
**Gia Lai** (from Bình Định) and **Huế**. gody still caps each province's public name list
at 5, so high-count units stay `placesPartial` (e.g. Hà Nội 32 → 5 listed). `astro build`
OK; `/heatmap` shows the updated stats + list. The whole flow (fetch → parse → map →
write `json/places.json`) is saved as `crawl-places.mjs` in this spec folder — re-run it
next time the owner updates gody.
