# Feature: Bilingual Blog Posts

| Field            | Value                            |
| ---------------- | -------------------------------- |
| **Status**       | completed                        |
| **Owner**        | @hta218                          |
| **Issue**        | N/A                              |
| **Branch**       | `feat/bilingual-blog-posts`      |
| **Created**      | 2026-07-15                       |
| **Last Updated** | 2026-07-15                       |

## Original Prompt

> I find this really good and could share it on my blog. Write the full article out to a markdown file for me, then look at my blog (available locally) and see which section it should be moved into. I need both Vietnamese + English.
>
> (Follow-up decision: place both posts in `data/blog/` and port the bilingual support from the `misc` collection to the `blog` collection.)

## Summary

Ports the `lang`/`translationOf` bilingual pattern from the `misc` collection to the `blog` collection, so blog posts can ship in English (canonical) and Vietnamese (translation) with a language switcher and hreflang alternates. Ships the first bilingual pair: "Git worktree: one repo, many working directories" (EN + VI).
