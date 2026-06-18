# Route rebrand (workspace-flavored routes for v4)

| Field            | Value                          |
| ---------------- | ------------------------------ |
| **Status**       | completed                      |
| **Owner**        | @hta218                         |
| **Issue**        | N/A                            |
| **Branch**       | `feat/route-rebrand`           |
| **Created**      | 2026-06-18                      |
| **Last Updated** | 2026-06-18                      |

## Original Prompt

> _(translated from Vietnamese)_
>
> I'd like you to review the routing of this new version. I don't want the
> old-style routes (`/blog`, `/snippets`, `/projects`, …). Got any ideas?
>
> (after review) Decisions: `/about → /whoami`; `/blog → /log`;
> `/snippets → /gists`; `/projects → /builds`; merge `/books` + `/movies`
> into `/shelf`; `/tags → /topics`.

## Summary

Rebrand v4's top-level routes to fit the "code workspace" identity, replacing the
generic blog-style paths with developer/terminal-flavored ones. Post/snippet
**slugs are preserved**; only section prefixes change, and every old path gets a
301 redirect so existing SEO and deep links keep working. The home page stays the
workspace `README`. `/books` and `/movies` merge into a single `/shelf`.

See `plan.md` for the full route map, redirects, touched files, and rollout.
