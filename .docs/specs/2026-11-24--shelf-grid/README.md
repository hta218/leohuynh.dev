# Feature: Shelf Cover Grid

| Field            | Value       |
| ---------------- | ----------- |
| **Status**       | completed   |
| **Owner**        | @hta218     |
| **Created**      | 2026-11-24  |
| **Last Updated** | 2026-11-24  |

## Original Prompt

> ok, giờ polish lại cái shelf đấy cho a tý, a nhìn chưa đc ưng lắm

Direction chosen: "Lưới poster/bìa" — books and movies as 2:3 cover grids, movies filtered by rating chips instead of ten rating groups with their own "Show more".

## Summary

`/shelf` listed books and movies as text-heavy rows, with movies split into ten rating groups of three items each, every group with its own "Show more" that fetched `/api/shelf.json`. It now renders both as cover/poster grids, filters movies by my rating with chips, and reveals more items from the already-rendered DOM, so the shelf API is gone.
