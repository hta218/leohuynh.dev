# Route rebrand (workspace-flavored routes for v4)

| Field            | Value                          |
| ---------------- | ------------------------------ |
| **Status**       | reopened — blog URL canonical rollback |
| **Owner**        | @hta218                         |
| **Issue**        | N/A                            |
| **Branch**       | `feat/route-rebrand`           |
| **Created**      | 2026-06-18                      |
| **Last Updated** | 2026-07-08                      |

## Original Prompt

> _(translated from Vietnamese)_
>
> I'd like you to review the routing of this new version. I don't want the
> old-style routes (`/blog`, `/snippets`, `/projects`, …). Got any ideas?
>
> (after review) Initial decisions: `/about → /whoami`; `/blog → /log`;
> `/snippets → /gists`; `/projects → /builds`; merge `/books` + `/movies`
> into `/shelf`; `/tags → /topics`.
>
> 2026-07-08 SEO rollback decision: restore the public/canonical blog URL
> pattern to `/blog` while keeping the dev-flavored UI label `logs` / `Log`.

## Summary

Rebrand v4's top-level routes to fit the "code workspace" identity, replacing
most generic paths with developer/terminal-flavored ones. The exception is blog
content: after SEO review, `/blog` stays the canonical public URL pattern while
the UI can still call the section `logs` / `Log`. Post/snippet **slugs are
preserved**, and every non-canonical path gets a 301 redirect so existing SEO and
deep links keep working. The home page stays the workspace `README`. `/books`
and `/movies` merge into a single `/shelf`.

See `plan.md` for the full route map, redirects, touched files, and rollout.
For the 2026-07-08 implementation handoff, see
`handoff--2026-07-08--restore-blog-url-canonical.md`.
