# Plan — Vietnam Travel Map

## Goal

Ship a `/travel` page that renders an interactive SVG choropleth of Vietnam: provinces
the owner has visited are shaded by number of places checked in; hovering/tapping a
province shows a tooltip with its place list; a stat header shows overall coverage.
Follow the existing media/shelf pattern (static data → typed loader → Astro page + one
hydrated island).

## Files & scope

| File | New/Mod | Purpose |
| --- | --- | --- |
| `json/places.json` | new | Seed data, source of truth, hand-editable |
| `src/lib/places.ts` | new | `Province`/`Place` types + `getPlaces()` + coverage stats helper |
| `src/pages/travel.astro` | new | Page chrome + stats + place list; renders the map island |
| `src/components/travel/VietnamMap.tsx` | new | React island: SVG choropleth + hover tooltip |
| `src/components/travel/vietnam-provinces.ts` | new | Province geometry (paths) + id→name lookup |
| `src/lib/site.ts` | mod | Add `/travel` to `MORE_LINKS`; add gody profile URL to `SITE` |

Mirrors: `src/pages/shelf.astro` (page), `src/lib/media.ts` (loader shape),
`src/pages/lab/travel-egypt.astro` + `src/components/lab/travel-egypt/` (React island convention,
`client:only="react"` / `client:visible`), `src/components/builds/ProjectCard.astro` (card styling
tokens: `border-line`, `bg-white`, `text-ink`, `text-muted`, hover `shadow-[4px_4px_0_var(--color-line)]`).

## Data model

Data is keyed by the **new 2025 34-unit** administrative names (Open decision #1 resolved).
`json/places.json` — array of provincial units:

```jsonc
[
  {
    "unit": "Đà Nẵng",         // NEW 2025 unit display name (Vietnamese)
    "id": "da-nang",            // stable slug; MUST match the SVG/GeoJSON province id
    "count": 6,                 // total places checked in (aggregated across merged old provinces)
    "mergedFrom": ["Quảng Nam"],// old (pre-2025) provinces folded into this unit that were visited
    "placesPartial": false,     // true when count > places.length (gody hid some names)
    "places": [
      { "name": "Bà Nà Hills" },
      { "name": "Rừng dừa Bảy Mẫu - Hội An", "origProvince": "Quảng Nam" }
    ]
  }
]
```

Loader `src/lib/places.ts`:

```ts
export interface Place { name: string; photo?: string; origProvince?: string }
export interface ProvinceUnit {
  unit: string; id: string; count: number
  mergedFrom?: string[]; placesPartial?: boolean; places: Place[]
}

export const TOTAL_UNITS = 34
export function getPlaces(): ProvinceUnit[]           // read json/places.json, sort by count desc
export function getTravelStats(units: ProvinceUnit[]) // { visited, total: 34, percent, totalPlaces }
```

No Supabase, no try/catch DB fallback (unlike `media.ts`); the JSON *is* the source.
Seed file ready at `.docs/specs/2026-07-02--vietnam-travel-map/places-new34.json` — copy to
`json/places.json` at implementation. (Raw pre-merge parse kept at `places-parsed.json`.)

## Seed dataset (from gody.vn, snapshot 2024-07, aggregated to new 34 units)

Owner profile: `https://gody.vn/blog/huynhtuananh218951440`. gody labels places by OLD
(pre-2025) province names but counts against 34 units; after mapping old→new (see table
below), coverage is **16/34 units = 47.06%**, which matches gody's headline exactly.

Aggregated by NEW unit (count = places checked in; some name lists partial — see note):

| New unit | Count | Merged-from (visited old) | Places (as listed on gody) |
| --- | --- | --- | --- |
| Hà Nội | 27 | — | Hồ Hoàn Kiếm, Chùa Một Cột, Lăng Bác, Công viên Thống Nhất, Royal City — **only 5 of 27 exposed publicly; 22 need fill** |
| Sơn La | 6 | — | Thác Dải Yếm, Ngũ động bản Ôn, Đồi chè trái tim, Vườn hoa mận/cải, Rừng thông Bản Áng (Mộc Châu) — badge 6, listed 5 |
| Đà Nẵng | 6 | Quảng Nam | Bà Nà Hills, Đèo Hải Vân, Cầu Rồng + Rừng dừa Bảy Mẫu, Cơm gà Bà Buội, Mót (Hội An) |
| Ninh Bình | 4 | — | Tràng An, Tam Cốc - Bích Động, VQG Cúc Phương, Vườn chim Thung Nham |
| Phú Thọ | 4 | Vĩnh Phúc, Hòa Bình | Tam Đảo, VQG Tam Đảo, Đền Hùng, Thung lũng Mai Châu |
| An Giang | 3 | Kiên Giang | Đảo Hòn Thơm, Quần đảo An Thới, Sun World Hòn Thơm (Phú Quốc) |
| Hải Phòng | 2 | Hải Dương | VQG Cát Bà, Vịnh Lan Hạ |
| Quảng Ninh | 2 | — | Cầu Bãi Cháy Hạ Long, Vịnh Hạ Long |
| Cao Bằng | 1 | — | Thác Bản Giốc |
| Khánh Hòa | 1 | — | VinWonders Nha Trang |
| Lào Cai | 1 | — | Fansipan - Sapa |
| Đắk Lắk | 1 | Phú Yên | Tháp Nhạn |
| Thanh Hóa | 0 | — | (visited, no spots yet) |
| Nghệ An | 0 | — | (visited, no spots yet) |
| Bắc Ninh | 0 | Bắc Giang | (visited, no spots yet) |
| Hưng Yên | 0 | Thái Bình | (visited, no spots yet) |

Total 58 places across 12 units with spots + 4 units visited-with-no-spots = 16/34.
Ready-to-import seed: `places-new34.json` (in this spec folder). `Hà Nội` and `Sơn La`
are `placesPartial: true` — gody truncates each province's public list to 5, so their full
name lists must be hand-filled (province counts are correct regardless; the map colors by count).

### Old (63) → New (34) mapping used

Unchanged: Hà Nội, Sơn La, Cao Bằng, Quảng Ninh, Thanh Hóa, Nghệ An, Ninh Bình.
Merged: Kiên Giang→An Giang · Quảng Nam→Đà Nẵng · Hải Dương→Hải Phòng ·
Vĩnh Phúc & Hòa Bình→Phú Thọ · Phú Yên→Đắk Lắk · Bắc Giang→Bắc Ninh · Thái Bình→Hưng Yên.
(Full national mapping verified against the 2025 reform sources; only visited provinces shown.)

## UI / page structure (`travel.astro`)

```
BaseLayout > StudioShell active="/travel"
  PageHeader  title="Travel map" subtitle="Places I've been across Vietnam"
  <section>
    Stat row: "16 / 34 provinces" · "47% of Vietnam" · "26 places" · "16 cities"
              (progress bar for %). Reuse ProjectCard / stat-tile tokens.
    <VietnamMap client:visible provinces={provinces} />   ← the island
    Province list: grid of cards (name + count + places), sorted by count desc.
                   Reuse ProjectCard grid styling.
  </section>
```

Legend: 4–5 shade buckets (0, 1–2, 3–5, 6–10, 10+) using existing accent tokens
(e.g. `--color-code-blue` ramp). Unvisited provinces = `--color-line` fill.

## Map island (`VietnamMap.tsx`)

- Renders an inline `<svg viewBox=...>` with one `<path>` per province, `fill` chosen by
  a `count → bucket → color` scale.
- On hover/focus (and tap on mobile) show a tooltip: province name + count + first few places.
- Province path `id`/`data-id` must match `Province.id` in the JSON. A `id → displayName`
  map lives in `vietnam-provinces.ts` alongside the geometry.
- No external map lib (keep bundle small); geometry is a static local module.
- Hydrate with `client:visible` (map is below the fold-ish) — confirm against how
  `travel-egypt` island is mounted for consistency.

## Nav wiring (`site.ts`)

- Add `{ title: 'Travel', href: '/travel' }` (or under `MORE_LINKS`) — match the existing
  entry shape.
- Add `godyProfileUrl` to `SITE` for a "source: gody.vn" external link on the page footer.

## Resolved decisions

1. **Geometry / denominator — RESOLVED: new 2025 34-unit map.** Coverage shown as
   `visited/34` (= 16/34, 47.06%, matching gody). Old place-province names are mapped to
   new units per the table above; the JSON is keyed by new unit.

2. **SVG source — RESOLVED: use a MIT-licensed 34-unit GeoJSON, convert to SVG paths at
   build.** Primary candidate: **`thanglequoc/vietnamese-provinces-database`** — provides
   non-SQL JSON in `full`, `simplified`, and `vn_only_simplified` variants (MIT); use
   `vn_only_simplified` for a small choropleth bundle. Alternative:
   **`nguyenduy1133/Free-GIS-Data`** — GeoJSON + SHP of the 34 units, **includes Hoàng Sa /
   Trường Sa** archipelagos (use if we want the islands rendered). Implementation step:
   pick one, extract `{ id/code, name, geometry }`, project to an SVG viewBox, and emit
   `vietnam-provinces.ts` (path `d` strings keyed by the same `id` as `json/places.json`).
   Confirm the GeoJSON's province `name`/`code` field matches our `id` slugs (add a
   normalizer if codes differ from our kebab slugs).

## Open decisions (minor, can decide during implementation)

3. **Islands (Hoàng Sa / Trường Sa).** Standard on Vietnamese maps. Recommend: render them
   (pick the `Free-GIS-Data` source which already includes them), styled as unvisited.

4. **Home activity rail.** Optionally surface "last place visited" on the home runtime-rail
   (`src/lib/runtime/activity.ts`) like currently-reading/last-watched. Out of scope for v1
   unless requested.

## Acceptance

- `/travel` renders server-side with correct stats and province list even if the island
  fails to hydrate (progressive enhancement — SVG + list are the fallback).
- Hovering a visited province shows its places; shade reflects count.
- Data edits in `json/places.json` reflect on the page with no code changes.
- Added to nav; `nr typecheck` + `nr format` clean.

## Implementation order

1. Lock Open decisions #1 & #2 (map asset + denominator).
2. Add `json/places.json` (import from `places-parsed.json`, hand-correct Hà Nội/Sơn La).
3. `src/lib/places.ts` loader + stats.
4. `vietnam-provinces.ts` geometry from the chosen SVG.
5. `VietnamMap.tsx` island.
6. `travel.astro` page (stats + island + list).
7. Nav wiring in `site.ts`.
8. `nr typecheck` / `nr format`; verify SSR fallback + hydration.
