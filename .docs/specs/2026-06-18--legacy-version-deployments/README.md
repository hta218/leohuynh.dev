# Legacy version deployments (v1 / v2 / v3 archive sites)

| Field            | Value                                          |
| ---------------- | ---------------------------------------------- |
| **Status**       | in-progress                                    |
| **Owner**        | @hta218                                         |
| **Issue**        | N/A                                            |
| **Branch**       | `feat/legacy-version-deployments`              |
| **Created**      | 2026-06-18                                      |
| **Last Updated** | 2026-06-18                                      |

## Original Prompt

> _(translated from Vietnamese)_
>
> Now, can you deploy those old versions to Vercel for me? I'd like some legacy
> URLs like `v1.leohuynh.dev`, `v2.leohuynh.dev`, … — ok?
>
> (follow-up) I think we need a spec for this legacy handling. Write a full spec
> for me first.

## Summary

Preserve and publish each historical version of `leohuynh.dev` as its own
long-lived, read-only archive site at a versioned subdomain
(`v1.leohuynh.dev`, `v2.leohuynh.dev`, `v3.leohuynh.dev`). Each version is a
different framework (Gatsby → Next.js → Next.js), so each gets its own Vercel
project pinned to its branch, deployed as a frozen snapshot. The current
`leohuynh.dev` (`www`) stays the production site and will be replaced by the
Astro **v4** app via a separate cutover.

## Why

- v4 (Astro) is about to be promoted to `main`/`www`, retiring the live Next.js
  site. Without archives, the previous designs and content presentations are lost.
- Versioned URLs give a permanent, shareable history of the blog's evolution.

See `plan.md` for the implementation plan, open decisions, and scope.
