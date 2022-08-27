import type readingTime from 'reading-time'
import type { DevIconsMap } from '~/components'

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
  date: string
  tags: string[]
  draft?: boolean
  summary: string
  images?: string[]
  authors?: string[]
}

export interface BlogFrontMatter extends MdxFrontMatter {
  readingTime: ReturnType<typeof readingTime>
  slug: string
  fileName: string
}

export interface SnippetFrontMatter extends BlogFrontMatter {
  type: keyof typeof DevIconsMap
}

export interface MdxFileData {
  mdxSource: string
  frontMatter: BlogFrontMatter
}

export type MdxLayoutRendererProps = {
  layout: MdxPageLayout
  mdxSource: string
  frontMatter: MdxFrontMatter
  [key: string]: any
}
