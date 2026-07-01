# Plan: Travel Egypt — Web Game Port

Full rewrite of the Pygame sliding-puzzle game as a DOM-based React island
inside the Astro v4 site. Faithful to the original game flow and all 8 levels,
but theme-native, responsive, and with optimized assets.

## Approach (decided)

- **Rewrite, not embed.** Pygbag/WASM rejected: blocking `time.sleep()` calls
  would freeze the browser, 53.6MB assets balloon the WASM VFS, and it can't
  integrate with the site's look. Logic is tiny (~40KB) so a TS rewrite is cheap
  and yields a native-feeling, maintainable result.
- **DOM-based React, not canvas.** A sliding puzzle is a grid of discrete cells
  where only one tile moves per turn — a natural fit for React + DOM. Each tile
  is a `<div>`; tile slides animate via CSS `transform: translate()` +
  `transition` (GPU-accelerated, no manual render loop); React state holds tile
  positions and drives re-renders. Canvas is overkill here (would mean a custom
  render loop, tweening, and click hit-testing for no benefit) and is reserved
  for free-form/particle rendering this game doesn't have.
- **Engine is framework-agnostic vanilla TS.** Pure game logic (board, shuffle,
  slide, win) lives outside React so it stays testable; React renders it.
- **DOM chrome with site design tokens.** Buttons (Let's go, mode select,
  Next/Back/Quit), move counter, and level indicator are DOM + Tailwind — so we
  drop the original button image assets and get theme-native, responsive layout
  for free.
- **CSS sprite, no runtime slicing.** Ship one `full.jpg` per level; cut tiles
  with CSS `background-position` (`background-size` = full board), instead of
  shipping 227 pre-cut images or slicing on a canvas.

## Game flow (state machine)

```
welcome → mode-select → playing → level-cleared → (next) → playing → … → ending → done
```

- **welcome** — title art + "Let's go" CTA. First user gesture unlocks audio.
- **mode-select** — easy / medium / hard. Mode = number of random shuffle moves.
- **playing** — render board; tap a tile adjacent to the blank → slide animation,
  increment move counter, check win. Next/Back navigate cleared levels; Quit
  returns to welcome.
- **level-cleared** — show level win image, play "level pass" sound, unlock next.
- **ending** — after level 8 (index 7): victory image + cheer → "Heaven" track +
  final 01–08 slideshow → **ending card** with run stats (total moves, elapsed
  time), "Play again", "Back to /lab", and a link to the source GitHub repo.
  The original "John Cena" troll flashing loop is **dropped** (photosensitivity
  risk + off-tone for the portfolio).

## Core mechanics to reproduce faithfully

- **Board sizes:** levels 1–4 = 4×4, levels 5–8 = 5×5. Blank starts bottom-left
  (`{x:0, y:size-1}`).
- **Shuffle:** from the solved board, perform N random *adjacent* swaps with the
  blank (guarantees solvability). N per mode — 4×4: 20/40/60, 5×5: 30/50/70.
- **Slide:** only a tile orthogonally adjacent to the blank can move; animate it
  into the blank, swap positions.
- **Win:** every tile's current `(x,y)` equals its `correctPos`.
- **Run stats:** track total moves and elapsed time per run, for the ending card.
- **Level nav:** Next only enabled up to the highest reached level; Back down to
  level 1; both stop/reload per-level music.

## Architecture & file layout

### Pages (Astro)

- `src/pages/lab/index.astro` — `/lab` landing; lists available games as
  cards (start with Travel Egypt). Uses existing site layout/components.
- `src/pages/lab/travel-egypt.astro` — hosts the React game island via
  `client:only="react"`; sets page title/meta/OG.

### React island

- `src/components/lab/travel-egypt/travel-egypt-game.tsx` — top-level island.
  Holds game state, renders the board + HUD, bridges engine ↔ React.
- `src/components/lab/travel-egypt/puzzle-board.tsx` — the grid: renders tiles
  as `<div>`s with CSS-sprite backgrounds; handles tile clicks + slide animation.
- `src/components/lab/travel-egypt/game-hud.tsx` — move counter, level x/8,
  Next/Back/Quit, mode-select, welcome overlay (DOM + Tailwind + `cn()`).
- `src/components/lab/travel-egypt/use-travel-egypt.ts` — hook wiring the
  engine lifecycle to the React component (init, level changes, teardown).

### Engine (framework-agnostic vanilla TS)

Under `src/lib/lab/travel-egypt/`:

- `engine.ts` — state machine + render/update loop, input dispatch.
- `board.ts` — board model, blank tracking, `slide`, `shuffle`, `isWin`.
- `levels.ts` — the 8 level configs (grid size, image paths, win/hint art,
  music path, difficulty shuffle counts).
- `assets.ts` — asset manifest + image preloader (no slicing; CSS handles cuts).
- `audio.ts` — audio manager (background loop, per-level track, SFX, gesture
  unlock, mute toggle).
- `constants.ts` — board sizes, mode shuffle counts, timings.
- `types.ts` — `Tile`, `Board`, `LevelConfig`, `GameState`, `Mode`, etc.

### Assets (optimized, committed under `public/`)

`public/lab/travel-egypt/`

- `images/levels/{1..8}/full.jpg` — full board image; tiles cut via CSS sprite.
- `images/levels/{1..8}/{win,hint}.jpg` — per-level win + hint art.
- `images/victory/{final-01..08,troll-01,troll-02,end}.jpg` — ending sequence.
- `images/bg/{welcome,background}.jpg` — backdrops.
- `audio/` — compressed background, per-level, and SFX tracks.

**Optimization targets:** re-encode audio (egypt background 9.4MB → ~1MB) to a
web-friendly bitrate (and/or `.opus`/`.m4a`); compress/resize JPGs. Goal: total
asset footprint a few MB, not 53MB. A one-off script (in `scripts/`, not
shipped) pulls from the old repo, slices/compresses, and writes to `public/`.

### Cross-links

- Add a Travel Egypt card to `src/pages/builds.astro` (or its data source)
  linking to `/lab/travel-egypt`, so the game shows in the project list too.
- Add a **new sidebar/explorer group placed directly below the `dotfiles`
  group**, containing the `/lab` entry (and room for future games).

## Files & folders this feature touches

**New:**
- `src/pages/lab/index.astro`
- `src/pages/lab/travel-egypt.astro`
- `src/components/lab/travel-egypt/travel-egypt-game.tsx`
- `src/components/lab/travel-egypt/puzzle-board.tsx`
- `src/components/lab/travel-egypt/game-hud.tsx`
- `src/components/lab/travel-egypt/use-travel-egypt.ts`
- `src/lib/lab/travel-egypt/{engine,board,levels,assets,audio,constants,types}.ts`
- `public/lab/travel-egypt/**` (images + audio)
- `scripts/build-travel-egypt-assets.*` (one-off asset pipeline; not shipped)

**Modified (likely):**
- `src/pages/builds.astro` or its data source — add the game card/link.
- Sidebar/explorer config — add a new group below `dotfiles` with the `/lab`
  entry (exact file TBD — locate the current sidebar group definition).
- `astro.config.*` — only if a redirect or integration tweak is needed (unlikely).

## Coding conventions (per repo rules)

- `function foo()` declarations, named exports only (route components excepted).
- `const` + `UPPER_SNAKE_CASE` for constants, `let` otherwise.
- `cn()` from `lib/cn` for conditional classes; `cva` for variants; no string
  templates for classes.
- No `useMemo`/`useCallback` (React 19 compiler). kebab-case filenames.
- Co-locate related files; no barrel/index re-exports.

## Milestones

1. **Asset pipeline** — script to pull, slice-source, compress → `public/`.
2. **Engine core** — board model, shuffle, slide, win (vanilla TS, unit-checkable).
3. **Levels + flow** — 8 level configs + state machine.
4. **Board rendering** — DOM tiles, CSS-sprite backgrounds, slide tween via CSS
   transform, responsive scaling.
5. **React island + HUD** — mount, welcome/mode-select, move/level chrome.
6. **Audio** — background loop, per-level tracks, SFX, gesture unlock, mute toggle.
7. **Routes** — `/lab` index + `/lab/travel-egypt`.
8. **Ending sequence** — victory slideshow + ending card (stats, Play again,
   back to /lab, source repo link). No troll flashing.
9. **Mobile + a11y** — tap input, scaling, keyboard arrow controls, focus.
10. **Cross-links + polish** — `/builds` card, new sidebar group, QA.

## Resolved decisions

- **Rendering:** DOM-based React (CSS sprite + transform), not canvas.
- **No dark mode:** the site has no dark mode — build light-theme only.
- **Sidebar:** new group directly below the `dotfiles` group, holding `/lab`.
- **Mute toggle:** yes — include a mute/volume toggle (autoplay-friendly).
- **Keyboard controls:** yes — arrow keys slide tiles, in addition to tap/click.
- **Ending:** drop the troll flashing loop; end with victory slideshow + an
  ending card (run stats, Play again, back to /lab, source repo link).
- **Asset hosting:** commit optimized assets under `public/` (~few MB).

Spec is closed — ready to implement.
