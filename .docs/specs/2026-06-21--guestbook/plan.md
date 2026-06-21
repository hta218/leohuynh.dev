# Plan: Guestbook

## Implementation shape

Build this as a small server-backed feature inside the existing Astro app:

```text
GitHub OAuth
    ↓ signed HTTP-only session cookie
src/lib/guestbook.ts
    ↓ raw postgres client via getSql()
src/pages/api/guestbook/*.ts
    ↓ JSON endpoints
src/components/guestbook/*.tsx/.astro
    ↓ React island for form + pagination
src/pages/guestbook.astro
```

Use the existing project patterns:

- Astro SSR via Vercel adapter.
- `postgres` client through `src/lib/db.ts` / `getSql()`.
- `import.meta.env[name] ?? process.env[name]` for server env compatibility.
- Tailwind v4 classes, 2-space indent, single quotes in TS.
- No ORM, no Next.js patterns, no generated migration files unless the repo later
  adopts migrations.

## Files to add

- `src/pages/guestbook.astro`
  - Page shell and initial server-rendered first page of approved entries.
  - Uses `BaseLayout` and `StudioShell`.
  - Passes `currentUser`, `entries`, `nextCursor`, and admin boolean to a React
    island.

- `src/lib/guestbook.ts`
  - Data access and validation helpers.
  - Public functions:
    - `getGuestbookEntries({ cursor, limit })`
    - `createGuestbookEntry(input, requestMeta)`
    - `hideGuestbookEntry(id, adminLogin)`
    - `unhideGuestbookEntry(id, adminLogin)`
    - `getGuestbookCurrentUser(cookies)`
    - `isGuestbookAdmin(login)`
  - Keep SQL parameterized with the `postgres` tagged template.

- `src/lib/github-oauth.ts`
  - GitHub OAuth URL creation, callback exchange, profile fetch.
  - Reads server-only env:
    - `GITHUB_OAUTH_CLIENT_ID`
    - `GITHUB_OAUTH_CLIENT_SECRET`
    - `GUESTBOOK_SESSION_SECRET`
  - Exposes:
    - `createGithubAuthUrl(origin)`
    - `exchangeGithubCode(code)`
    - `fetchGithubViewer(accessToken)`
    - `signGuestbookSession(user)`
    - `verifyGuestbookSession(cookieValue)`

- `src/pages/api/auth/github.ts`
  - Redirects to GitHub OAuth with `state`.
  - Sets a short-lived signed `guestbook_oauth_state` cookie.

- `src/pages/api/auth/github/callback.ts`
  - Verifies `state`.
  - Exchanges `code` for token server-side.
  - Fetches GitHub user profile.
  - Sets signed HTTP-only `guestbook_session` cookie.
  - Redirects back to `/guestbook`.

- `src/pages/api/auth/logout.ts`
  - Clears guestbook cookies.
  - Redirects to `/guestbook`.

- `src/pages/api/guestbook/index.ts`
  - `GET`: returns approved entries with cursor pagination.
  - `POST`: creates an entry for the signed-in GitHub user.

- `src/pages/api/guestbook/[id].ts`
  - `PATCH`: admin moderation action `{ status: 'approved' | 'hidden' }`.
  - No `DELETE` in v1.

- `src/components/guestbook/GuestbookApp.tsx`
  - React island owning client-side form, optimistic append, load-more, and admin
    hide/unhide buttons.

- `src/components/guestbook/SignaturePad.tsx`
  - Optional lightweight pointer-events canvas/SVG signature capture.
  - Must be progressive: if skipped or unsupported, message submit still works.

- `src/components/guestbook/GuestbookEntryCard.astro` or `.tsx`
  - Entry presentation: avatar, name/login, timestamp, message, signature.

- `src/types/guestbook.ts`
  - Shared public DTO types for entries/user/session payloads.

## Existing files likely to change

- `vercel.json`
  - Add `avatars.githubusercontent.com` to image/CSP allowlist if not already
    allowed.

- Navigation component or shell file that owns primary nav
  - Add `/guestbook` link if the current nav has room.
  - Inspect `src/components/studio/StudioShell.astro` and related nav before
    changing.

- `src/lib/db.ts`
  - Prefer no changes. Only update if a shared env helper is introduced later.

## API contracts

### `GET /api/guestbook?cursor=<iso-date-or-id>&limit=20`

Response:

```ts
interface GuestbookListResponse {
  entries: GuestbookEntry[]
  nextCursor: string | null
}
```

Rules:

- Public endpoint.
- Returns `status = 'approved'` only unless current user is admin.
- Default `limit = 20`, max `50`.
- Cursor should be stable. Prefer `(created_at, id)` tuple encoded as a compact
  string over offset pagination.

### `POST /api/guestbook`

Request:

```ts
interface CreateGuestbookRequest {
  message: string
  displayName?: string
  signature?: GuestbookSignature | null
  website?: string // honeypot; must be empty
}
```

Response:

```ts
interface CreateGuestbookResponse {
  entry: GuestbookEntry
  status: 'approved' | 'pending'
}
```

Rules:

- Requires valid `guestbook_session` cookie.
- Reject invalid JSON with `400`.
- Reject unauthenticated with `401`.
- Reject rate limited with `429`.
- Reject honeypot-filled requests with a generic success-looking response or
  `204` to avoid teaching bots.
- Server chooses `github_id`, `github_login`, name, avatar from session, not from
  client input.

### `PATCH /api/guestbook/[id]`

Request:

```ts
interface ModerateGuestbookRequest {
  status: 'approved' | 'hidden'
}
```

Rules:

- Requires admin GitHub login.
- Updates `status`, `hidden_at`, `hidden_by`, `updated_at`.
- Never deletes.

## Data access details

Create a small DTO mapper so API responses never leak internal hashes:

```ts
interface GuestbookEntry {
  id: string
  displayName: string
  githubLogin: string
  githubAvatarUrl: string | null
  message: string
  signature: GuestbookSignature | null
  status: 'pending' | 'approved' | 'hidden'
  createdAt: string
  isOwnEntry?: boolean
}
```

Hash request metadata before storage:

- `ip_hash = sha256(ip + GUESTBOOK_SESSION_SECRET)`
- `user_agent_hash = sha256(userAgent + GUESTBOOK_SESSION_SECRET)`

Do not store raw IPs.

## UI behavior

1. SSR renders the first page for fast first paint and SEO.
2. If anonymous:
   - show intro copy;
   - show `Sign in with GitHub` button linking to `/api/auth/github`;
   - render approved wall below.
3. If signed in:
   - show compact composer with avatar/name;
   - textarea with character counter;
   - optional "draw signature" affordance;
   - submit button.
4. On successful submit:
   - reset textarea/signature;
   - prepend new entry if approved;
   - otherwise show pending state.
5. Load more:
   - calls `GET /api/guestbook?cursor=...`;
   - appends entries;
   - hides button when `nextCursor` is null.
6. Admin controls:
   - visible only for admin session;
   - inline hide/unhide button on each card.

## Signature pad v1 constraints

Keep it intentionally small:

- pointer events only;
- store strokes as normalized arrays, not a giant base64 PNG;
- render as SVG path on cards;
- cap payload at 20 KB;
- include "clear" button;
- optional field, not required for submit.

Example data shape:

```ts
interface GuestbookSignature {
  width: number
  height: number
  strokes: Array<Array<[number, number]>>
}
```

Normalize points to a fixed coordinate system, e.g. `0..1000`, so signatures
render responsively.

## GitHub OAuth details

OAuth app settings:

- Homepage URL: `https://leohuynh.dev`
- Authorization callback URL:
  - production: `https://leohuynh.dev/api/auth/github/callback`
  - local dev: `http://localhost:3434/api/auth/github/callback`

Scopes:

- Use no explicit scope or `read:user` only.
- Do not request repo or email scopes.

Session cookie:

- Name: `guestbook_session`
- HTTP-only: true
- Secure: true in production
- SameSite: `lax`
- Max age: 30 days
- Payload: signed minimal user object:
  - GitHub id
  - login
  - name
  - avatar URL
  - issued-at / expiry

## Implementation steps

### 1. Database setup note

Add the SQL from `README.md` to Supabase manually before end-to-end testing.
Document that this repo does not currently own DB migrations.

### 2. Add types and server helpers first

- Create `src/types/guestbook.ts`.
- Create `src/lib/guestbook.ts` with validation and SQL helpers.
- Create `src/lib/github-oauth.ts` with pure helpers.
- Add unit-testable validation functions even if the repo has no current test
  runner; keep them pure.

### 3. Add API endpoints

- Add auth redirect/callback/logout endpoints.
- Add guestbook list/create endpoint.
- Add moderation endpoint.
- Keep all responses JSON except OAuth redirects.

### 4. Add page and UI

- Add `src/pages/guestbook.astro`.
- Add `GuestbookApp.tsx`, `GuestbookEntryCard`, and `SignaturePad`.
- Match existing typography, border, background, and mono label patterns.
- Keep form accessible: label textarea, visible focus states, button disabled state.

### 5. Navigation and CSP

- Add nav link only after verifying the current nav owner.
- Update `vercel.json` if avatars are blocked by CSP.

### 6. Verification

Run:

```bash
bun run check
bun run build
```

Manual local checks with `bun dev --port 3434`:

- `/guestbook` renders signed-out state.
- Sign-in URL redirects to GitHub with valid client ID and state.
- Callback rejects missing/invalid state.
- `GET /api/guestbook` returns empty list or seeded rows.
- `POST /api/guestbook` rejects anonymous requests.
- With a valid session, submit a message and see it render.
- Load-more works with more than 20 rows.
- Admin hide/unhide works and hidden rows disappear for anonymous users.
- Build output has no secret leakage in client JS. Search for OAuth secret names
  in `dist/` if needed; never print actual secret values.

## Testing strategy

If adding a lightweight test runner is acceptable later, cover pure helpers first:

- message validation limits;
- display name fallback;
- signature payload size cap;
- cursor encode/decode;
- admin login parsing;
- session sign/verify expiry;
- rate-limit window calculation.

Do not add a full testing framework just for this feature unless implementation
risk grows. The first required gates are `bun run check`, `bun run build`, and
manual endpoint/browser verification.

## Rollout plan

1. Deploy with `GUESTBOOK_AUTO_APPROVE=false` if concerned about launch spam;
   otherwise deploy true for a smoother experience.
2. Create the GitHub OAuth app and set env vars in Vercel.
3. Create Supabase table.
4. Deploy preview and test OAuth callback on preview if callback URL is added;
   otherwise test production only after env is ready.
5. After launch, monitor entries for spam and toggle auto-approve if needed.

## Handoff command for implementation agent

```bash
git checkout spec/guestbook-2026-06-21
# read .docs/specs/2026-06-21--guestbook/README.md and plan.md
# create implementation branch from v4 or from this spec branch after merging spec
```

Implementation should keep the spec updated if product decisions change.
