# Work Logs

## 2026-06-30 — @hta218 (implementation)

Full port implemented end-to-end on branch `feat/travel-egypt-game-port`.

### Assets
- Cloned the source `Travel_Egypt` repo; optimized with `ffmpeg` into
  `public/lab/travel-egypt/` (**53.6MB → 8.6MB**).
- Ship 8 `full.jpg` board images (600×600, CSS-sprite sliced at render) instead
  of the 227 pre-cut tiles; dropped the per-level `win.jpg` (~5MB) in favour of a
  DOM "level cleared" overlay.
- Audio recompressed and per-level tracks trimmed to ~75s loops; per-level music
  is lazy-loaded. Dropped the `John Cena` troll track (troll ending was cut).

### Engine (`src/lib/lab/travel-egypt/`)
- `board.ts` pure logic: solved board, neighbours, slide, arrow-direction mapping,
  win check, and a shuffle that does N random adjacent slides (always solvable).
- `constants.ts` / `levels.ts` / `types.ts` / `sprite.ts` (CSS percentage sprite)
  / `audio.ts` (imperative manager: music, SFX, gesture unlock, mute).
- Verified: 2400/2400 shuffles solvable, 0 accidentally-solved, win + blank-home +
  arrow directions all correct.

### UI (`src/components/lab/travel-egypt/`)
- `use-travel-egypt.ts` — reducer state machine + audio orchestration.
- `PuzzleBoard.tsx` — DOM tiles, CSS sprite, transform-based slide animation.
- `GameHud.tsx` — level/moves/mode + prev/next/hint/restart/mute controls.
- `EndingSequence.tsx` — victory slideshow; `TravelEgyptGame.tsx` — the island
  (welcome → mode-select → play → level-cleared → ending → ending card).
- Mounted `client:only="react"` to avoid SSR/hydration issues with audio/timers.

### Routes & cross-links
- `src/pages/lab/index.astro` (games landing) + `lab/travel-egypt.astro`.
- New sidebar `lab` group added directly below `dotfiles` in `Sidebar.astro`.
- Updated the Travel Egypt card in `src/lib/projects.ts` to link to the playable
  page + source, with a `Play` link.

### Incidental fix
- Registered the `land-plot` HugeIcon (import + `IconName` + `ProjectIcon`). The
  prior commit `825b19a` set the Weaverse card to `icon: 'land-plot'`, which was
  not in the icon map — it was a type error **and crashed the `/builds` build**
  (`currentIcon is not iterable`). Now resolved.

### Verification
- `astro check`: 0 errors / 0 warnings / 0 hints.
- `biome check` on new files: clean.
- `astro build`: succeeds; `/lab`, `/lab/travel-egypt`, island bundle, and
  assets all emitted to `dist/`.
- Browser QA (play-through, audio, mobile) still pending — user tests on their own
  dev server (port 3434).

## 2026-07-01 — @hta218 (route rename + HUD polish)

- Renamed the section **`/arcade` → `/lab`** across routes, folders, and asset
  paths (`public/lab`, `src/pages/lab`, `src/lib/lab`, `src/components/lab`) and
  the sidebar group. The original prompt (immutable) still reads `/arcade`.
- The sidebar `lab` group now has two entries like the `dotfiles` group: a
  `README.md` (→ `/lab` landing) and `travel-egypt.tsx` (→ `/lab/travel-egypt`).
- HUD polish from browser testing: fixed missing slide animation on downward
  moves (render tiles in a stable order so React never reorders DOM nodes);
  added `cursor-pointer` to all buttons (Tailwind v4 default); added a
  "restart game" (home) button; moved the HUD above the board with stats +
  peek preview in a right-hand column; muted audio by default.
