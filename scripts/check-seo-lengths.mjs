#!/usr/bin/env node
/**
 * Non-blocking SEO length check for content frontmatter. Warns (doesn't fail)
 * on titles/summaries that Google is likely to truncate or rewrite. Run with
 * `bun run seo:check`.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const AUTHOR_SUFFIX = ' — Leo Huynh'
const TITLE_LIMIT = 60
const SUMMARY_LIMIT = 160
const CONTENT_DIRS = ['data/blog', 'data/snippets', 'data/misc']

function frontmatterField(content, field) {
  const match = content.match(new RegExp(`^${field}:\\s*['"](.+?)['"]\\s*$`, 'm'))
  return match?.[1]
}

const files = CONTENT_DIRS.flatMap((dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => join(dir, f)),
).sort()

let warnings = 0
for (const file of files) {
  const content = readFileSync(file, 'utf8')
  // Effective SEO metadata — must mirror what the detail routes render as the
  // `<title>`/meta description. All three routes (blog/gists/misc) use
  // `seoTitle ?? title` and `seoDescription ?? summary`. For snippets, `heading`
  // is the on-page H1 only (NOT the rendered `<title>`), so it's excluded here.
  const displayTitle =
    frontmatterField(content, 'seoTitle') ?? frontmatterField(content, 'title')
  const summary =
    frontmatterField(content, 'seoDescription') ?? frontmatterField(content, 'summary')

  if (displayTitle) {
    const full = `${displayTitle}${AUTHOR_SUFFIX}`
    if (full.length > TITLE_LIMIT) {
      warnings++
      console.warn(`[title ${full.length}/${TITLE_LIMIT}] ${file}\n  "${full}"`)
    }
  }
  if (summary && summary.length > SUMMARY_LIMIT) {
    warnings++
    console.warn(`[summary ${summary.length}/${SUMMARY_LIMIT}] ${file}`)
  }
}

if (warnings === 0) {
  console.log('All titles and summaries are within SEO length guidelines.')
} else {
  console.log(
    `\n${warnings} field(s) over the recommended length. Informational only — Google may rewrite these in search results, but nothing here fails the build.`,
  )
}
