# Feature: Global Site Hits Counter

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| **Status**       | draft                                   |
| **Owner**        | @hta218                                 |
| **Issue**        | N/A                                     |
| **Branch**       | `feat/global-site-hits`                 |
| **Created**      | 2026-06-22                              |
| **Last Updated** | 2026-06-22                              |

## Original Prompt

> Build global site hits counter and display on home page

## Summary

The home page has a third stat card labelled "views" that currently renders a hardcoded `—`
placeholder. This feature adds a real, site-wide **global hits** counter: a single persisted
number that increments on every page load across the whole site (not just blog/snippet pages)
and is displayed in that card. The counter is **seeded** once from the existing accumulated
post + snippet views (`SUM(views)` in the `stats` table) so it starts from a meaningful number
instead of zero.
