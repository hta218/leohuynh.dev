export type BrandIconName =
  | 'astro'
  | 'goodreads'
  | 'imdb'
  | 'markdown'
  | 'umami'

export type HugeIconName =
  | 'analytics'
  | 'book'
  | 'caret-down'
  | 'caret-right'
  | 'comment'
  | 'external'
  | 'file'
  | 'folder'
  | 'folder-open'
  | 'gallery'
  | 'keyboard'
  | 'markdown'
  | 'project'
  | 'quill'
  | 'rocket'
  | 'star'
  | 'tag'
  | 'user'
  | 'code'

export type IconSpec =
  | { type: 'brand'; name: BrandIconName }
  | { type: 'huge'; name: HugeIconName }

export type TreeLeaf = {
  kind: 'leaf'
  id: string
  href: string
  file: string
  title?: string
  icon: IconSpec
  external?: boolean
  openHint?: boolean
  activeWhen?: (path: string) => boolean
}

export type TreeFolder = {
  kind: 'folder'
  id: string
  href?: string
  file: string
  title?: string
  icon: IconSpec
  children: TreeLeaf[]
  activeWhen?: (path: string) => boolean
}

export type TreeItem = TreeLeaf | TreeFolder
