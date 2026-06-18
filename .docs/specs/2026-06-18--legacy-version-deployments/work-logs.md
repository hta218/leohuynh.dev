# Work Logs

## 2026-06-18 — @hta218

Spec authored and finalized.

**Context leading in:**
- Branch cleanup completed: kept `v1` (Gatsby), `v2` (Next 15.3), `v3` (Next 15.4),
  `v4` (Astro), `main`. Renamed `legacy-gatsby → v1` and `legacy-v3 → v3`; deleted
  stale/auto branches.
- Verified DNS for `leohuynh.dev` is on Vercel; existing `leo-blog-gatsby` project
  already deploys the Gatsby build.

**Decisions locked (plan §6):**
1. v2/v3 archives share the live Supabase DB (writes to production `stats` accepted).
2. Domains: `v1/v2/v3.leohuynh.dev`.
3. Archives are frozen — auto-deploy OFF.
4. v1 reuses the existing `leo-blog-gatsby` project.

**Status:** spec complete (`in-progress`). Implementation NOT started — paused at
owner's request ("finish specs trước"). Next step is rollout §5 starting with v1.
