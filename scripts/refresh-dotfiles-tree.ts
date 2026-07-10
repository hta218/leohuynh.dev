#!/usr/bin/env bun
/**
 * Refresh the checked-in dotfiles tree snapshot (`json/dotfiles-tree.json`).
 *
 * The sidebar renders its dotfiles explorer from that snapshot so that no page
 * render depends on a request-time GitHub call (see `src/lib/dotfiles.ts`). The
 * tree changes rarely, so refreshing it is a manual maintenance step:
 *
 *   bun run dotfiles:refresh
 *
 * Shaping (deny list, folders-first/alphabetical sort, nesting) is delegated to
 * the same `buildTree` the app reads back, so the snapshot can never drift from
 * the runtime rules. Set `GITHUB_API_TOKEN` to avoid unauthenticated rate
 * limits. The script refuses to overwrite the snapshot with an empty tree.
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildTree, type DotfileNode } from '../src/lib/dotfiles'

const OWNER = 'hta218'
const REPO = 'dotfiles'
const BRANCH = 'main'
const OUT = resolve(process.cwd(), 'json/dotfiles-tree.json')

function headers(): HeadersInit {
  const token = process.env.GITHUB_API_TOKEN?.trim()
  return {
    accept: 'application/vnd.github+json',
    'user-agent': 'leohuynh.dev',
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  }
}

async function main(): Promise<void> {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`,
    { headers: headers() },
  )
  if (!res.ok) {
    throw new Error(`GitHub tree ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as { tree?: { path: string; type: string }[] }
  const tree: DotfileNode[] = buildTree(data.tree ?? [])
  if (!tree.length) {
    throw new Error('GitHub returned an empty tree; refusing to overwrite snapshot')
  }
  writeFileSync(OUT, `${JSON.stringify(tree, null, 2)}\n`)
  console.log(`Wrote ${tree.length} top-level nodes to json/dotfiles-tree.json`)
}

main().catch((error) => {
  console.error('[dotfiles:refresh]', error)
  process.exit(1)
})
