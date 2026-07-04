export type BrandIconName =
  | 'astro'
  | 'goodreads'
  | 'imdb'
  | 'markdown'
  | 'umami'

export type HugeIconName =
  | 'analytics'
  | 'book'
  | 'braces'
  | 'caret-down'
  | 'caret-right'
  | 'comment'
  | 'compass'
  | 'external'
  | 'file'
  | 'folder'
  | 'folder-open'
  | 'gallery'
  | 'keyboard'
  | 'land-plot'
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
