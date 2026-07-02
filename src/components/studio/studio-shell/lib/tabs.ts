import type { TreeItem, TreeLeaf } from './types'

export function isActive(
  item: { href?: string; activeWhen?: (path: string) => boolean },
  currentPath: string,
): boolean {
  return item.activeWhen
    ? item.activeWhen(currentPath)
    : currentPath === item.href
}

/** The always-pinned README tab descriptor. */
export function getReadmeTab(items: TreeItem[]): TreeLeaf {
  return items.find(
    (item) => item.kind === 'leaf' && item.id === 'readme',
  ) as TreeLeaf
}

type TabContext = {
  items: TreeItem[]
  postsIndex: TreeLeaf
  snippetsIndex: TreeLeaf
  miscIndex: TreeLeaf
}

/**
 * Resolves the descriptor for the page currently being viewed, used to seed the
 * editor tab bar on the server. Detail routes synthesize a leaf whose `file`
 * reads like the opened source file (e.g. `my-post.mdx`).
 */
export function resolveCurrentTab(path: string, ctx: TabContext): TreeLeaf {
  const { items, postsIndex, snippetsIndex, miscIndex } = ctx

  if (path === '/log' || path.startsWith('/log/page/')) {
    return {
      ...postsIndex,
      id: 'current',
      href: '/log',
      file: 'log/index.astro',
    }
  }
  if (path === '/gists') {
    return {
      ...snippetsIndex,
      id: 'current',
      href: '/gists',
      file: 'gists/index.astro',
    }
  }
  if (path.startsWith('/log/')) {
    const slug = decodeURIComponent(path.slice('/log/'.length))
    return {
      kind: 'leaf',
      id: 'current',
      href: path,
      file: `${slug}.mdx`,
      icon: { type: 'brand', name: 'astro' },
    }
  }
  if (path.startsWith('/gists/')) {
    const slug = decodeURIComponent(path.slice('/gists/'.length))
    return {
      kind: 'leaf',
      id: 'current',
      href: path,
      file: `${slug}.mdx`,
      icon: { type: 'brand', name: 'astro' },
    }
  }
  if (path === '/misc') {
    return {
      ...miscIndex,
      id: 'current',
      href: '/misc',
      file: 'misc/index.astro',
    }
  }
  if (path.startsWith('/misc/')) {
    const slug = decodeURIComponent(path.slice('/misc/'.length))
    return {
      kind: 'leaf',
      id: 'current',
      href: path,
      file: `${slug}.mdx`,
      icon: { type: 'brand', name: 'astro' },
    }
  }
  if (path.startsWith('/topics/')) {
    const tag = decodeURIComponent(path.slice('/topics/'.length))
    return {
      kind: 'leaf',
      id: 'current',
      href: path,
      file: tag || 'topics',
      icon: { type: 'huge', name: 'tag' },
    }
  }
  if (path.startsWith('/dotfiles/')) {
    const rel = decodeURIComponent(path.slice('/dotfiles/'.length))
    const base = rel.split('/').pop() || 'dotfiles'
    return {
      kind: 'leaf',
      id: 'current',
      href: path,
      file: base,
      icon: { type: 'huge', name: 'markdown' },
    }
  }

  const allTabLeaves: TreeLeaf[] = items.flatMap((item) =>
    item.kind === 'folder' ? item.children : [item],
  )
  const match = allTabLeaves.find((leaf) => isActive(leaf, path))
  if (match) return { ...match, id: 'current' }

  const segment = path.replace(/^\//, '').split('/').pop() || 'index'
  return {
    kind: 'leaf',
    id: 'current',
    href: path,
    file: segment,
    icon: { type: 'huge', name: 'file' },
  }
}

/** README is always shown; the current page is added unless it *is* the README. */
export function getSeedTabs(
  readmeTab: TreeLeaf,
  currentTab: TreeLeaf,
): TreeLeaf[] {
  return currentTab.href === readmeTab.href
    ? [readmeTab]
    : [readmeTab, currentTab]
}
