# Work Logs

## 2026-07-02 — @hta218

Implemented the full SEO audit backlog from `report.md` on branch `v4`.

### Commits

- `586aeb5` — Exclude tag pages from sitemap and add legacy feed redirects (Finding 1, 3)
- `b0c9abe` — Enrich article JSON-LD with keywords, language, and modified time (Finding 5)
- `51f8751` — Add whoami profile schema, fix image alt text and stale stack claims (Finding 4, 6, part of 5)
- `108ccca` — Add optional seoTitle and seoDescription metadata fields (Finding 2, infra)
- `81c1ee1` — Exclude UGC guestbook from index and sitemap (Finding 7)

### Decisions

- **Finding 2**: shipped the `seoTitle`/`seoDescription` mechanism but did NOT
  retrofit existing posts. First applied concise SEO fields to 6 top offenders,
  then reverted them — the owner preferred not to touch titles of posts that are
  already ranking (risk of losing keywords / CTR, e.g. the top-traffic
  `does-promise-all-run-in-parallel-or-sequential`). Mechanism stays for new
  posts. `seo:check` warnings therefore remain at `39` by design.
- **Finding 7**: `/guestbook` → `noindex` + out of sitemap; `/dotfiles` → kept
  indexable.

### Verification

- `bun run check`: 0 errors / 0 warnings / 0 hints
- `bun run build`: success
- Sitemap: `241 → 71` URLs, `0` render `noindex`, `/guestbook` excluded,
  `/dotfiles` + `/topics` index present, `/topics/<tag>` excluded.
- Built HTML spot-checks: article JSON-LD `keywords` + `inLanguage`,
  `article:modified_time`, `/whoami` `ProfilePage` all present.

### Not done (out of scope / by decision)

- Retrofitting existing posts with `seoTitle`/`seoDescription` (Finding 2 content).

## 2026-07-02 (later) — @hta218

Addressed the two follow-ups from Codex's post-implementation re-audit
(`re-audit-2026-07-02.md`).

- **F1**: aligned `scripts/check-seo-lengths.mjs` with the routes — snippets now
  use `seoTitle ?? title` (not `heading`, which is display-only). Gist
  title mismatch scan (script vs rendered `<title>`) → `0`. `seo:check`
  `39 → 53`, the extra 14 being long gist titles the script previously hid;
  existing titles intentionally left as-is.
- **F2**: fixed `/dotfiles` index title duplication in
  `src/pages/dotfiles/[...slug].astro` (`dotfiles — dotfiles` → `dotfiles`);
  nested dotfile titles unchanged.
- Verify: `bun run check` 0/0/0, `bun run build` success, gist mismatch scan `0`.

