/**
 * On-demand reader for the public `hta218/dotfiles` repo.
 *
 * The sidebar shows the repo's file tree and each file is rendered in-app at
 * `/dotfiles/[...slug]`. Content is fetched from the GitHub API on demand and
 * cached two ways: a short-lived in-memory cache here (per lambda) plus
 * `Cache-Control` headers set by the consumers (CDN). Dotfiles change rarely,
 * so TTLs are generous.
 */

const OWNER = 'hta218'
const REPO = 'dotfiles'
const BRANCH = 'main'
const API = 'https://api.github.com'
const RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`

/** Files we never surface in the explorer. */
const DENY = new Set(['.DS_Store', '.git', 'node_modules'])
/** Skip rendering content for anything larger than this (bytes). */
const MAX_CONTENT_BYTES = 512 * 1024
const TREE_TTL_MS = 60 * 60 * 1000
const ENTRY_TTL_MS = 60 * 60 * 1000

export interface DotfileNode {
  name: string
  /** Repo-relative path, e.g. `.vscode/settings.json`. */
  path: string
  type: 'file' | 'dir'
  children?: DotfileNode[]
}

export interface DotfileContent {
  kind: 'file'
  name: string
  path: string
  size: number
  lang: string
  text: string
  htmlUrl: string
  rawUrl: string
}

export interface DotfileDir {
  kind: 'dir'
  name: string
  path: string
  children: DotfileNode[]
  htmlUrl: string
}

export type DotfileEntry =
  | DotfileContent
  | DotfileDir
  | {
      kind: 'too-large'
      name: string
      path: string
      size: number
      htmlUrl: string
    }
  | { kind: 'missing' }

/** Shown when GitHub is unreachable so the sidebar still renders something. */
const FALLBACK_TREE: DotfileNode[] = [
  { name: '.vscode', path: '.vscode', type: 'dir', children: [] },
  { name: '.claude', path: '.claude', type: 'dir', children: [] },
  { name: '.copilot', path: '.copilot', type: 'dir', children: [] },
  { name: '.opencode', path: '.opencode', type: 'dir', children: [] },
  { name: '.zshrc', path: '.zshrc', type: 'file' },
  { name: '.gitconfig', path: '.gitconfig', type: 'file' },
  { name: '.editorconfig', path: '.editorconfig', type: 'file' },
  { name: 'README.md', path: 'README.md', type: 'file' },
]

const memo = new Map<string, { value: unknown; expires: number }>()

function getCached<T>(key: string): T | undefined {
  const hit = memo.get(key)
  if (hit && hit.expires > Date.now()) return hit.value as T
  return undefined
}

function setCached(key: string, value: unknown, ttl: number): void {
  memo.set(key, { value, expires: Date.now() + ttl })
}

function token(): string | undefined {
  const viteEnv =
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env as Record<string, string | undefined>)
      : undefined
  return (
    (viteEnv?.GITHUB_API_TOKEN ?? process.env.GITHUB_API_TOKEN)?.trim() ||
    undefined
  )
}

function headers(): HeadersInit {
  const t = token()
  return {
    accept: 'application/vnd.github+json',
    'user-agent': 'leohuynh.dev',
    ...(t ? { authorization: `Bearer ${t}` } : {}),
  }
}

function basename(path: string): string {
  return path.split('/').pop() ?? path
}

/** Reject path traversal / absolute paths; return a clean repo-relative path. */
function sanitize(path: string): string | null {
  const clean = decodeURIComponent(path).replace(/^\/+|\/+$/g, '')
  if (!clean) return ''
  const parts = clean.split('/')
  if (parts.some((p) => p === '..' || p === '.' || p === '')) return null
  return parts.join('/')
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/')
}

const LANG_BY_NAME: Record<string, string> = {
  '.zshrc': 'bash',
  '.bashrc': 'bash',
  '.bash_profile': 'bash',
  '.zprofile': 'bash',
  '.gitconfig': 'ini',
  '.editorconfig': 'ini',
  '.npmrc': 'ini',
}
const LANG_BY_EXT: Record<string, string> = {
  json: 'json',
  jsonc: 'json',
  md: 'markdown',
  mdx: 'markdown',
  toml: 'toml',
  yml: 'yaml',
  yaml: 'yaml',
  sh: 'bash',
  zsh: 'bash',
  lua: 'lua',
  vim: 'viml',
  js: 'js',
  ts: 'ts',
  css: 'css',
}

function langFor(name: string): string {
  if (LANG_BY_NAME[name]) return LANG_BY_NAME[name]
  const ext = name.includes('.') ? name.split('.').pop()! : ''
  return LANG_BY_EXT[ext] ?? 'text'
}

/** Folders first, then files; alphabetical within each group (VS Code style). */
function sortNodes(nodes: DotfileNode[]): void {
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  for (const node of nodes) if (node.children) sortNodes(node.children)
}

function buildTree(entries: { path: string; type: string }[]): DotfileNode[] {
  const root: DotfileNode[] = []
  const dirs = new Map<string, DotfileNode>()
  // Shallow paths first so a parent folder always exists before its children.
  const ordered = [...entries].sort(
    (a, b) => a.path.split('/').length - b.path.split('/').length,
  )
  for (const entry of ordered) {
    if (entry.path.split('/').some((p) => DENY.has(p))) continue
    const parts = entry.path.split('/')
    const name = parts.at(-1)!
    const parentPath = parts.slice(0, -1).join('/')
    const node: DotfileNode = {
      name,
      path: entry.path,
      type: entry.type === 'tree' ? 'dir' : 'file',
    }
    if (node.type === 'dir') node.children = []
    const siblings = parentPath ? dirs.get(parentPath)?.children : root
    if (!siblings) continue
    siblings.push(node)
    if (node.type === 'dir') dirs.set(entry.path, node)
  }
  sortNodes(root)
  return root
}

export async function getDotfilesTree(): Promise<DotfileNode[]> {
  const cached = getCached<DotfileNode[]>('tree')
  if (cached) return cached
  try {
    const res = await fetch(
      `${API}/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`,
      { headers: headers(), signal: AbortSignal.timeout(8000) },
    )
    if (!res.ok) throw new Error(`GitHub tree ${res.status}`)
    const data = (await res.json()) as {
      tree?: { path: string; type: string }[]
    }
    const tree = buildTree(data.tree ?? [])
    const value = tree.length ? tree : FALLBACK_TREE
    setCached('tree', value, TREE_TTL_MS)
    return value
  } catch {
    return FALLBACK_TREE
  }
}

function decodeBase64(content: string): string {
  const binary = atob(content.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}

export function dotfileGithubUrl(
  path: string,
  type: 'blob' | 'tree' = 'blob',
): string {
  return `https://github.com/${OWNER}/${REPO}/${type}/${BRANCH}/${path}`
}

export function dotfileRawUrl(path: string): string {
  return `${RAW}/${path}`
}

export async function getDotfileEntry(rawPath: string): Promise<DotfileEntry> {
  const path = sanitize(rawPath)
  if (path === null) return { kind: 'missing' }
  const cacheKey = `entry:${path}`
  const cached = getCached<DotfileEntry>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetch(
      `${API}/repos/${OWNER}/${REPO}/contents/${encodePath(path)}?ref=${BRANCH}`,
      { headers: headers(), signal: AbortSignal.timeout(8000) },
    )
    if (res.status === 404) return { kind: 'missing' }
    if (!res.ok) throw new Error(`GitHub contents ${res.status}`)
    const data = await res.json()

    let entry: DotfileEntry
    if (Array.isArray(data)) {
      const children: DotfileNode[] = data.map(
        (d: { name: string; path: string; type: string }) => ({
          name: d.name,
          path: d.path,
          type: d.type === 'dir' ? 'dir' : 'file',
        }),
      )
      sortNodes(children)
      entry = {
        kind: 'dir',
        name: basename(path),
        path,
        children,
        htmlUrl: dotfileGithubUrl(path, 'tree'),
      }
    } else if (typeof data.size === 'number' && data.size > MAX_CONTENT_BYTES) {
      entry = {
        kind: 'too-large',
        name: data.name,
        path,
        size: data.size,
        htmlUrl: data.html_url,
      }
    } else {
      entry = {
        kind: 'file',
        name: data.name,
        path,
        size: data.size,
        lang: langFor(data.name),
        text: data.content ? decodeBase64(data.content) : '',
        htmlUrl: data.html_url,
        rawUrl: data.download_url ?? dotfileRawUrl(path),
      }
    }
    setCached(cacheKey, entry, ENTRY_TTL_MS)
    return entry
  } catch {
    return { kind: 'missing' }
  }
}
