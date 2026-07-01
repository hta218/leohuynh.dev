# Feature: Travel Egypt — Web Game Port

| Field            | Value                                  |
| ---------------- | -------------------------------------- |
| **Status**       | in-progress (code complete, awaiting browser QA) |
| **Owner**        | @hta218                                |
| **Issue**        | N/A                                    |
| **Branch**       | `feat/travel-egypt-game-port`          |
| **Created**      | 2026-06-30                             |
| **Last Updated** | 2026-06-30                             |

## Original Prompt

> Read through my project at https://github.com/hta218/Travel_Egypt and port it
> to my personal Astro site (leohuynh.dev). I want a **full port**, not a slimmed
> down version — keep every level, mode, sound, and the ending. The previous
> recommendation (rewrite in TypeScript + Canvas as a React island rather than
> embedding Pygame via WASM/pygbag) is the agreed approach. Place it under a new
> `/arcade` section.

## Summary

`Travel_Egypt` is a desktop **sliding-puzzle game** (15-puzzle style) built with
Python + Pygame: 8 levels (4×4 then 5×5), 3 difficulty modes, per-level music,
and a scripted victory/ending sequence. This feature ports it **fully** to
leohuynh.dev by rewriting the game as a DOM-based React island (CSS sprite +
transform, no canvas), served from a new `/lab` section (`/lab` index +
`/lab/travel-egypt`; originally proposed as `/arcade`). The rewrite is
theme-native (light only — the site has
no dark mode), responsive, and ships optimized assets instead of the original
53.6MB of pre-sliced images and uncompressed audio.

## Source Game Reference

- Repo: https://github.com/hta218/Travel_Egypt (branch `master`)
- Tech: Python 3 + Pygame, ~40KB of game logic, 53.6MB assets (19 audio, 227 images)
- Mechanic: classic sliding puzzle — one blank cell, slide an adjacent tile, win
  when every tile is back in its correct position.
- Flow: welcome → mode select (easy/medium/hard = shuffle count) → play → level
  cleared → next level → … → ending (victory slideshow + troll loop + end card).
- Board: levels 1–4 are 4×4, levels 5–8 are 5×5. Blank starts bottom-left.
  Shuffle counts differ per board size (4×4: 20/40/60, 5×5: 30/50/70).
