import type { TreeItem, TreeLeaf } from './types'

export const exact = (href: string) => (path: string) => path === href
export const startsWith = (prefix: string) => (path: string) =>
  path === prefix || path.startsWith(`${prefix}/`)

export type ExplorerTree = {
  items: TreeItem[]
  postsIndex: TreeLeaf
  snippetsIndex: TreeLeaf
}

/**
 * Builds the left-sidebar file tree. The post/snippet "detail template" leaves
 * deep-link to the latest entry so the tab seeds to a real page; `statsUrl` is
 * the external Umami share link.
 */
export function buildExplorerTree(opts: {
  latestPostId?: string
  latestSnippetId?: string
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
      file: 'whoami',
      title: 'whoami',
      icon: { type: 'brand', name: 'markdown' },
      activeWhen: exact('/whoami'),
    },
    {
      kind: 'leaf',
      id: 'beliefs',
      href: '/beliefs',
      file: 'beliefs.md',
      title: 'Beliefs',
      icon: { type: 'brand', name: 'markdown' },
      activeWhen: exact('/beliefs'),
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
      id: 'tags',
      href: '/topics',
      file: 'topics',
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
      id: 'stats',
      href: opts.statsUrl,
      file: 'stats',
      title: 'Stats',
      icon: { type: 'brand', name: 'umami' },
      external: true,
      openHint: true,
    },
  ]

  return { items, postsIndex, snippetsIndex }
}
