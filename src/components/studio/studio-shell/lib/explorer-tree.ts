import type { TreeItem, TreeLeaf } from './types'

export const exact = (href: string) => (path: string) => path === href
export const startsWith = (prefix: string) => (path: string) =>
  path === prefix || path.startsWith(`${prefix}/`)

export type ExplorerTree = {
  items: TreeItem[]
  postsIndex: TreeLeaf
  snippetsIndex: TreeLeaf
  miscIndex: TreeLeaf
}

/**
 * Builds the left-sidebar file tree. The post/snippet "detail template" leaves
 * deep-link to the latest entry so the tab seeds to a real page; `statsUrl` is
 * the external Umami share link.
 */
export function buildExplorerTree(opts: {
  latestPostId?: string
  latestSnippetId?: string
  latestMiscId?: string
  statsUrl: string
}): ExplorerTree {
  const postsIndex: TreeLeaf = {
    kind: 'leaf',
    id: 'posts-index',
    href: '/log',
    file: 'index.astro',
    title: 'Posts index',
    icon: { type: 'brand', name: 'astro' },
    activeWhen: (path) => path === '/log' || path.startsWith('/log/page/'),
  }
  const postsSlug: TreeLeaf = {
    kind: 'leaf',
    id: 'posts-slug',
    href: opts.latestPostId ? `/log/${opts.latestPostId}` : '/log',
    file: '[...slug].astro',
    title: 'Post detail template',
    icon: { type: 'brand', name: 'astro' },
    activeWhen: (path) =>
      path.startsWith('/log/') && !path.startsWith('/log/page/'),
  }
  const snippetsIndex: TreeLeaf = {
    kind: 'leaf',
    id: 'snippets-index',
    href: '/gists',
    file: 'index.astro',
    title: 'Snippets index',
    icon: { type: 'brand', name: 'astro' },
    activeWhen: exact('/gists'),
  }
  const snippetsSlug: TreeLeaf = {
    kind: 'leaf',
    id: 'snippets-slug',
    href: opts.latestSnippetId ? `/gists/${opts.latestSnippetId}` : '/gists',
    file: '[...slug].astro',
    title: 'Snippet detail template',
    icon: { type: 'brand', name: 'astro' },
    activeWhen: (path) => path.startsWith('/gists/'),
  }
  const miscIndex: TreeLeaf = {
    kind: 'leaf',
    id: 'misc-index',
    href: '/misc',
    file: 'index.astro',
    title: 'Misc index',
    icon: { type: 'brand', name: 'astro' },
    activeWhen: exact('/misc'),
  }
  const miscSlug: TreeLeaf = {
    kind: 'leaf',
    id: 'misc-slug',
    href: opts.latestMiscId ? `/misc/${opts.latestMiscId}` : '/misc',
    file: '[...slug].astro',
    title: 'Misc note detail template',
    icon: { type: 'brand', name: 'astro' },
    activeWhen: (path) => path.startsWith('/misc/'),
  }

  const items: TreeItem[] = [
    {
      kind: 'leaf',
      id: 'readme',
      href: '/',
      file: 'README.md',
      title: 'Home',
      icon: { type: 'brand', name: 'markdown' },
      activeWhen: exact('/'),
    },
    {
      kind: 'folder',
      id: 'posts-folder',
      file: 'logs',
      title: 'Logs',
      icon: { type: 'huge', name: 'folder' },
      children: [postsIndex, postsSlug],
      activeWhen: startsWith('/log'),
    },
    {
      kind: 'folder',
      id: 'snippets-folder',
      file: 'gists',
      title: 'Gists',
      icon: { type: 'huge', name: 'folder' },
      children: [snippetsIndex, snippetsSlug],
      activeWhen: startsWith('/gists'),
    },
    {
      kind: 'folder',
      id: 'misc-folder',
      file: 'misc',
      title: 'Misc',
      icon: { type: 'huge', name: 'book' },
      children: [miscIndex, miscSlug],
      activeWhen: startsWith('/misc'),
    },
    {
      kind: 'leaf',
      id: 'projects',
      href: '/builds',
      file: 'builds.astro',
      title: 'Builds',
      icon: { type: 'huge', name: 'rocket' },
      activeWhen: exact('/builds'),
    },
    {
      kind: 'leaf',
      id: 'about',
      href: '/whoami',
      file: 'whoami.astro',
      title: 'whoami',
      icon: { type: 'brand', name: 'markdown' },
      activeWhen: exact('/whoami'),
    },
    {
      kind: 'leaf',
      id: 'takes',
      href: '/takes',
      file: 'takes.md',
      title: 'Takes',
      icon: { type: 'huge', name: 'compass' },
      activeWhen: exact('/takes'),
    },
    {
      kind: 'leaf',
      id: 'shelf',
      href: '/shelf',
      file: 'shelf.astro',
      title: 'Shelf',
      icon: { type: 'huge', name: 'gallery' },
      activeWhen: startsWith('/shelf'),
    },
    {
      kind: 'leaf',
      id: 'heatmap',
      href: '/heatmap',
      file: 'heatmap.astro',
      title: 'Heatmap',
      icon: { type: 'huge', name: 'land-plot' },
      activeWhen: startsWith('/heatmap'),
    },
    {
      kind: 'leaf',
      id: 'tags',
      href: '/topics',
      file: 'topics.astro',
      title: 'Topics',
      icon: { type: 'huge', name: 'tag' },
      activeWhen: startsWith('/topics'),
    },
    {
      kind: 'leaf',
      id: 'guestbook',
      href: '/guestbook',
      file: 'guestbook.astro',
      title: 'Guestbook',
      icon: { type: 'huge', name: 'quill' },
      activeWhen: exact('/guestbook'),
    },
    {
      kind: 'leaf',
      id: 'llms',
      href: '/llms',
      file: 'llms.json',
      title: 'LLM token burn',
      icon: { type: 'huge', name: 'braces' },
      activeWhen: exact('/llms'),
    },
    {
      kind: 'leaf',
      id: 'stats',
      href: opts.statsUrl,
      file: 'stats.umami',
      title: 'Stats',
      icon: { type: 'brand', name: 'umami' },
      external: true,
      openHint: true,
    },
  ]

  return { items, postsIndex, snippetsIndex, miscIndex }
}
