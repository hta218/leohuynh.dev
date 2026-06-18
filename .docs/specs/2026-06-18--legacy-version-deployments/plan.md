# Plan — Legacy version deployments

## 1. Goal

Each historical version of the site is reachable at its own versioned subdomain,
as a frozen, read-only archive, without affecting the production site or the
upcoming v4 → `main` cutover.

| Version | Stack            | Branch | Target URL          |
| ------- | ---------------- | ------ | ------------------- |
| v1      | Gatsby (2018–21) | `v1`   | `v1.leohuynh.dev`   |
| v2      | Next.js 15.3     | `v2`   | `v2.leohuynh.dev`   |
| v3      | Next.js 15.4     | `v3`   | `v3.leohuynh.dev`   |
| v4      | Astro 6          | `v4`   | `www.leohuynh.dev`  (separate cutover spec) |

## 2. Current state (verified 2026-06-18)

- **DNS**: `leohuynh.dev` nameservers are `ns1/ns2.vercel-dns.com` → DNS is
  managed on Vercel. Subdomains can be created entirely via Vercel (no external
  DNS provider step). `v1.leohuynh.dev` already resolves to Vercel IPs.
- **Vercel projects** (account `hta218`):
  - `leohuynh.dev` → `www.leohuynh.dev` (production; will host v4 after cutover).
  - `analytics.leohuynh.dev` → self-hosted Umami (unrelated, leave alone).
  - `leo-blog-gatsby` → `leo-blog-legacy.vercel.app` — **already deploys the
    Gatsby build**. Reuse this for v1.
- **Branches** (after cleanup): `v1` (Gatsby), `v2` (Next 15.3), `v3` (Next 15.4),
  `v4` (Astro), `main`. All version branches exist on `origin`.
- The v4 rebuild spec already declared intent to publish the legacy site to
  `v3.leohuynh.dev`; this spec generalizes that to v1–v3.

## 3. Approach

One **separate Vercel project per version**, because each is a different
framework and cannot share one project's build settings.

Each archive project is configured as a **frozen snapshot**:

- Git connected to the repo, **Production Branch = the version branch**.
- **Auto-deploy OFF** (ignore build step / disconnect auto-builds) so an archive
  is built once and never rebuilds on unrelated pushes.
- Custom domain `vX.leohuynh.dev` assigned to the project.
- Node 22.x (Vercel default) unless a version needs an older Node (v1 Gatsby).

### Per-version steps

**v1 — Gatsby** (lowest risk; project already exists)

1. Confirm `leo-blog-gatsby` builds the `v1` branch (it already deploys today).
2. Set its Production Branch to `v1` if not already.
3. Add domain `v1.leohuynh.dev` to the project.
4. Verify the archive renders.

**v2 — Next.js 15.3**

1. Create project `leohuynh-dev-v2`, link repo, Production Branch = `v2`.
2. Set required env vars (see §4).
3. Trigger a production build; fix/triage build failures (old deps).
4. On success, add domain `v2.leohuynh.dev`.
5. Set auto-deploy OFF (freeze).

**v3 — Next.js 15.4**

1. Create project `leohuynh-dev-v3`, link repo, Production Branch = `v3`.
2. Set required env vars (see §4).
3. Trigger a production build; triage failures.
4. On success, add domain `v3.leohuynh.dev`.
5. Set auto-deploy OFF (freeze).

## 4. Environment variables

v2 and v3 are dynamic Next.js apps that read env at build/runtime (DATABASE_URL,
Spotify, GitHub, Umami, newsletter, etc.). v1 (Gatsby) is static and needs little
to none.

Source of truth: the `leohuynh.dev` Vercel project env (pullable via
`vercel env pull`). Copy the required subset into each archive project.

**Decision (resolved):** v2/v3 archives **share the live Supabase DB** — they use
the same `DATABASE_URL` as production. Views/reactions on the archive sites write
to the same `stats` table. This is intentional: stats stay unified across all
versions of a given post/slug regardless of which version site recorded them.

## 5. Rollout sequence

Do it incrementally, verifying each before the next:

1. **v1** (reuse Gatsby project + domain) — quick win, validates the subdomain flow.
2. **v2** (new project + env + build + domain).
3. **v3** (new project + env + build + domain).

Each step ends with a manual check of `vX.leohuynh.dev`.

## 6. Decisions (resolved 2026-06-18)

1. **DB sharing**: archives **share the live Supabase DB** (same `DATABASE_URL`);
   archive writes to production `stats` are accepted/intended.
2. **Domain naming**: confirmed `v1.leohuynh.dev`, `v2.leohuynh.dev`,
   `v3.leohuynh.dev`.
3. **Frozen vs live**: **auto-deploy OFF** for all archive projects (frozen).
4. **v1 scope**: **reuse the existing `leo-blog-gatsby` project** (no new project).

## 7. Risks & mitigations

- **Old builds fail** (stale deps, Node version, 78 known vulns): build each in a
  throwaway deploy first; pin Node version per project; do not attempt dependency
  upgrades on archives (they are snapshots). If a build is unrecoverable, fall
  back to deploying a pre-built static export.
- **Archive writes to production DB**: accepted per §6.1 (shared DB is intended).
- **Accidental rebuilds** overwriting an archive: mitigated by auto-deploy OFF.
- **Secret leakage**: never commit pulled env; only set via Vercel project env.
- **Cost/clutter**: 2 new projects; acceptable.

## 8. Acceptance criteria

- `v1.leohuynh.dev`, `v2.leohuynh.dev`, `v3.leohuynh.dev` each load the correct
  historical site over HTTPS.
- Each archive project has auto-deploy disabled (frozen).
- v2/v3 archives connect to the shared live Supabase DB (per §6.1).
- Production `www.leohuynh.dev` and `analytics.leohuynh.dev` are unaffected.

## 9. Files & scope touched

This work is primarily **Vercel/infra configuration**, not repo source code.

- Repo: this spec folder only
  (`.docs/specs/2026-06-18--legacy-version-deployments/`).
- Possibly a small per-version build tweak committed **on that version's branch**
  if a build fix is required (e.g. Node version in `package.json`/`vercel.json`).
  Such fixes must NOT land on `v4`/`main`.
- Vercel (outside the repo): projects `leo-blog-gatsby` (reuse), `leohuynh-dev-v2`,
  `leohuynh-dev-v3`; domains `v1/v2/v3.leohuynh.dev`; per-project env vars.

## 10. Not in scope

- v4 → `main`/`www` promotion and Vercel production cutover (separate effort).
- Redesigning or upgrading any legacy version (archives are frozen as-is).
- `analytics.leohuynh.dev`.
