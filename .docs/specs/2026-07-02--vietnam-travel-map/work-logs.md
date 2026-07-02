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
