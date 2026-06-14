// Makes the legacy `/static/*` assets (blog images, resume.pdf, favicons) available
// to the v4 Astro app WITHOUT duplicating 21MB into git.
//
// During migration the single source of truth for assets is the legacy repo's
// `public/static`. We symlink `v4/public/static -> ../../public/static` so dev +
// build resolve `/static/...` URLs exactly like the legacy site. The symlink is
// git-ignored (see v4/.gitignore); at cutover, when v4 is hoisted to the repo root,
// this script becomes a no-op and the real `public/static` is used directly.
import { existsSync, lstatSync, mkdirSync, symlinkSync, unlinkSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const linkPath = resolve(here, '../public/static')
const targetAbs = resolve(here, '../../public/static')
// Relative target keeps the symlink portable across machines/checkouts.
const targetRel = '../../public/static'

if (!existsSync(targetAbs)) {
  console.warn(
    `[link-static] legacy assets not found at ${targetAbs} — skipping. ` +
      'Blog images/resume may 404 until the static dir is available.',
  )
  process.exit(0)
}

mkdirSync(dirname(linkPath), { recursive: true })

// Refresh any stale link/dir so reruns are idempotent.
if (existsSync(linkPath) || isSymlink(linkPath)) {
  if (isSymlink(linkPath)) {
    unlinkSync(linkPath)
  } else {
    console.warn(
      `[link-static] ${linkPath} exists and is not a symlink — leaving as-is.`,
    )
    process.exit(0)
  }
}

symlinkSync(targetRel, linkPath, 'dir')
console.log(`[link-static] linked ${linkPath} -> ${targetRel}`)

function isSymlink(p) {
  try {
    return lstatSync(p).isSymbolicLink()
  } catch {
    return false
  }
}
