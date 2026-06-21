# Work Logs

## 2026-06-21 — @hta218 (implementation, v1)

### What was built

Smallest complete v1 of the custom guestbook (Astro SSR + Supabase Postgres +
GitHub OAuth), matching the StudioShell visual language. No Giscus changes —
post/snippet comments are untouched.

Files added:

- `src/types/guestbook.ts` — public DTO types (no internal hashes exposed).
- `src/lib/github-oauth.ts` — OAuth URL/exchange/profile + HMAC-signed session &
  `state` cookies, plus `hashWithSecret` for IP/UA hashing. Server-only env via
  `import.meta.env[name] ?? process.env[name]`.
- `src/lib/guestbook.ts` — pure validators (message, display name, signature,
  spam), keyset cursor encode/decode, rate-limit counters, and parameterized SQL
  data access (`getGuestbookEntries`, `createGuestbookEntry`,
  `moderateGuestbookEntry`).
- `src/pages/api/auth/github.ts` — redirect to GitHub with signed `state`.
- `src/pages/api/auth/github/callback.ts` — verify `state`, exchange code, set
  `guestbook_session` cookie, redirect to `/guestbook`.
- `src/pages/api/auth/logout.ts` — clear cookies.
- `src/pages/api/guestbook/index.ts` — `GET` (keyset pagination) + `POST`
  (auth + honeypot + validation + rate limit).
- `src/pages/api/guestbook/[id].ts` — `PATCH` admin soft-moderation (no DELETE).
- `src/components/guestbook/GuestbookApp.tsx` — React island: composer,
  optimistic prepend, load-more, inline admin hide/unhide.
- `src/components/guestbook/GuestbookEntryCard.tsx` — entry card + signature SVG.
- `src/components/guestbook/SignaturePad.tsx` — pointer-events signature capture,
  normalized to a 0..1000 space, ≤20 KB, optional + clearable.
- `src/pages/guestbook.astro` — SSR page (`prerender = false`), first page
  rendered server-side; falls back to empty wall if DB/env not yet configured.

Files changed:

- `src/components/studio/StudioShell.astro` — added a low-priority `guestbook`
  explorer nav leaf (after `topics`), using the existing `comment` icon.

### Decisions / deviations

- **Spam handling**: spammy-looking messages (too many URLs/emails) are saved as
  `status = 'pending'` (held for review) rather than `hidden`. `hidden` is
  reserved for an explicit admin action, which keeps moderation semantics clean.
- **CSP / `vercel.json`**: no change needed. The existing policy already allows
  GitHub avatars (`img-src * blob: data:`) and the client fetches
  (`connect-src *`). OAuth code exchange and the GitHub profile call are
  server-side only, so no browser CSP entry is required.
- **Sessions**: stateless signed HTTP-only cookie (HMAC-SHA256), no session
  table. The optional `guestbook_oauth_sessions` table was not created.

### Repo checks (run locally)

- `bun run check` → 0 errors, 0 warnings, 0 hints.
- `bun run build` → success (Vercel adapter bundled the SSR function).
- Client bundle scan: `grep` of `dist/client` for `GITHUB_OAUTH_CLIENT_SECRET`,
  `GUESTBOOK_SESSION_SECRET`, `GITHUB_OAUTH_CLIENT_ID`, `DATABASE_URL`, and
  server-only function names returned nothing → no secret/server-code leakage.
  (The `GuestbookApp` island ships, server helpers do not.)

End-to-end OAuth + DB writes were NOT exercised locally — they require the env
vars and the Supabase table below. Code paths are implemented and typecheck/build
clean; manual verification steps are listed in `plan.md` §6.

### Required manual setup (before end-to-end testing)

This repo has no migration system — create the table by hand.

1. **Supabase**: run the `guestbook_entries` table + indexes SQL from
   `README.md` → "Data Model" in the Supabase SQL editor. (The optional
   `guestbook_oauth_sessions` table is NOT needed — sessions are cookie-based.)

2. **GitHub OAuth app** (Settings → Developer settings → OAuth Apps → New):
   - Homepage URL: `https://leohuynh.dev`
   - Authorization callback URL (add both):
     - `https://leohuynh.dev/api/auth/github/callback`
     - `http://localhost:3434/api/auth/github/callback`
   - Scope used by code: `read:user` only (no repo/email).

3. **Env vars** (local `.env` for dev, Vercel project settings for prod) —
   server-only, never `PUBLIC_`-prefixed:
   - `GITHUB_OAUTH_CLIENT_ID`
   - `GITHUB_OAUTH_CLIENT_SECRET`
   - `GUESTBOOK_SESSION_SECRET` (random ≥32-byte string; signs sessions + hashes)
   - `GUESTBOOK_ADMIN_GITHUB_LOGINS=hta218` (comma-separated logins)
   - `GUESTBOOK_AUTO_APPROVE=true` (set `false` to hold all entries for review)
   - `DATABASE_URL` already exists.

4. Restart `bun dev --port 3434` after setting env (`.env` is read at boot).
