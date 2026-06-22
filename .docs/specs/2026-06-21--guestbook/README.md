# Feature: Guestbook

| Field            | Value                         |
| ---------------- | ----------------------------- |
| **Status**       | in-progress                   |
| **Owner**        | @hta218                       |
| **Issue**        | N/A                           |
| **Branch**       | `spec/guestbook-2026-06-21`   |
| **Created**      | 2026-06-21                    |
| **Last Updated** | 2026-06-21                    |

## Original Prompt

> Build guestbook functionality for the site. Visitors should be able to sign in with GitHub and leave a short note on the site. The guestbook should feel native to the current Astro v4 portfolio, not like an embedded third-party widget.

## Goal

Add a public `/guestbook` page where visitors can authenticate with GitHub and
leave a short note on Leo's site. The feature should feel native to the current
Astro v4 portfolio, not like an embedded third-party widget.

## Reference Research

### duncan.land/guestbook

Observed behavior:

- Dedicated guestbook route with the heading "Sign my guestbook".
- Primary action: "Sign in with GitHub".
- Secondary action: "See the Wall".
- Public wall renders entries as compact cards/list items.
- Each entry includes message, author name, timestamp, and a visual signature
  image.
- The wall is paginated with a "Load More" button.

What to borrow:

- GitHub login as a low-friction identity layer.
- Personal, playful "wall" feeling rather than a generic comment thread.
- Load-more pagination.
- Optional hand-drawn signature as the distinctive interaction.

### anishde.dev/guestbook

Observed behavior:

- Dedicated guestbook route titled "GuestBook" with "Leave a message :)".
- Uses a Giscus/GitHub Discussions comments iframe when loaded normally.
- Provides GitHub identity, reactions, replies, and sorting for free.

What to borrow:

- GitHub-backed identity is familiar for developer visitors.
- Simple copy and lightweight page structure.

What not to borrow for v1:

- Do not make the guestbook an embedded Giscus thread. The current site already
  uses Giscus for post/snippet comments, and a guestbook should have stronger
  visual ownership, moderation controls, and data shape control.

## Decision

Build a **custom guestbook backed by Supabase Postgres + GitHub OAuth**.

Rationale:

- The site already has Supabase Postgres access via `postgres` and `getSql()`.
- A custom implementation can match the StudioShell visual language and avoid
  looking like a generic GitHub discussion.
- We can keep Giscus for content comments and use custom storage for guestbook
  entries.
- Moderation, spam handling, and future export/import are easier with a table we
  control.

## Product Requirements

### Visitor experience

- `/guestbook` is reachable from the site navigation where appropriate.
- Anonymous visitors can read approved entries.
- Anonymous visitors see a clear "Sign in with GitHub" call-to-action.
- Signed-in visitors can submit:
  - message, required, 1-500 characters;
  - optional display name override, defaulting to GitHub profile name/login;
  - optional drawn signature, stored as SVG path data or compact JSON strokes;
  - hidden honeypot field for bots.
- After submit, the new entry appears immediately if auto-approved is enabled;
  otherwise show a "pending review" state.
- Entries render newest-first by default.
- Load more entries without full-page navigation.

### Owner/admin experience

- Admin identities are configured by GitHub login via env.
- Admin can hide/unhide entries without deleting rows.
- Admin can optionally approve pending entries.
- No destructive delete in v1.

### Non-goals for v1

- Replies or nested threads.
- Email notifications.
- Markdown rendering.
- Anonymous posting.
- Full admin dashboard beyond inline moderation controls on `/guestbook`.
- Migrating existing Giscus comments.

## UX Direction

Use the current v4 portfolio language:

- `BaseLayout` + `StudioShell` page shell.
- Compact mono labels and muted borders matching existing widgets.
- A guestbook header with short copy:
  - title: `guestbook`
  - subtitle: `Leave a small trace on the wall.`
- Entry cards should feel like collected notes:
  - message body;
  - GitHub avatar + display name/login;
  - timestamp;
  - optional signature area at the bottom.
- Empty state: "No notes yet. Be the first to sign."

## Data Model

Create the table manually in Supabase. This repo currently has no migration
system.

```sql
create table if not exists guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  github_id bigint not null,
  github_login text not null,
  github_name text,
  github_avatar_url text,
  display_name text not null,
  message text not null,
  signature jsonb,
  status text not null default 'approved'
    check (status in ('pending', 'approved', 'hidden')),
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  hidden_at timestamptz,
  hidden_by text
);

create index if not exists guestbook_entries_status_created_idx
  on guestbook_entries (status, created_at desc);

create index if not exists guestbook_entries_github_created_idx
  on guestbook_entries (github_id, created_at desc);
```

Optional session table if stateless signed cookies are not enough:

```sql
create table if not exists guestbook_oauth_sessions (
  id uuid primary key default gen_random_uuid(),
  github_id bigint not null,
  github_login text not null,
  github_name text,
  github_avatar_url text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
```

Prefer a signed, HTTP-only cookie for v1 unless implementation reveals a hard
need for server-side session revocation.

## Environment Variables

Server-only:

- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`
- `GUESTBOOK_SESSION_SECRET`
- `GUESTBOOK_ADMIN_GITHUB_LOGINS=hta218`
- `GUESTBOOK_AUTO_APPROVE=true` (default can be true for GitHub-authenticated
  users; set false if spam appears)

Existing:

- `DATABASE_URL`

Do not prefix OAuth secrets or session secret with `PUBLIC_`.

## Security / Abuse Controls

- Store only a signed session cookie; never expose OAuth tokens to the browser.
- Use GitHub OAuth `state` to prevent CSRF.
- Use HTTP-only, secure, same-site lax cookies.
- Validate all input server-side.
- Escape message text; no raw HTML or Markdown in v1.
- Message max length: 500 chars.
- Display name max length: 80 chars.
- Signature max payload: 20 KB JSON before storage.
- Honeypot field must remain empty.
- Basic rate limits:
  - max 3 entries per GitHub user per 24 hours;
  - max 5 entries per IP hash per 24 hours.
- Hide obvious spam by default if message includes too many URLs/emails.
- Use soft moderation only (`hidden`), not hard delete.

## CSP / Headers

If GitHub avatars are rendered directly, update `vercel.json` image/CSP rules to
allow:

- `https://avatars.githubusercontent.com`

If OAuth redirects or GitHub API calls are server-side only, no browser CSP entry
is needed for GitHub OAuth/API endpoints.

## Open Questions

- Should auto-approve be enabled on day one? Recommendation: yes, for GitHub
  auth, with soft-hide admin controls.
- Should the signature drawing be v1 or v1.1? Recommendation: implement optional
  signature in v1 if it stays lightweight; otherwise ship message-only first.
- Should the nav include `/guestbook` immediately? Recommendation: yes, but keep
  it low-priority in nav after `builds`/`shelf` if the nav is already crowded.
