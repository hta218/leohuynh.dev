import type readingTime from 'reading-time'

export type MdxPageLayout =
  | 'AuthorLayout'
  | 'ListLayout'
  | 'PostLayout'
  | 'PostSimple'
  | 'ResumeLayout'
  | 'SnippetLayout'

export interface MdxFrontMatter {
  layout?: MdxPageLayout
  title: string
  name?: string
  date: string
  lastmod?: string
  tags: string[]
  draft?: boolean
  summary: string
  images?: string[] | string
  authors?: string[]
  slug: string
}

export type ReadingTime = ReturnType<typeof readingTime>

export interface BlogFrontMatter extends MdxFrontMatter {
  readingTime: ReadingTime
  fileName: string
}
