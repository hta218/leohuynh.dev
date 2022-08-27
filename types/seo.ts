import type { AuthorFrontMatter, MdxFrontMatter } from './mdx'

export type PageSeoProps = {
  title: string
  description: string
}

export interface BlogSeoProps extends MdxFrontMatter {
  authorDetails: AuthorFrontMatter[]
  url: string
}

export type AuthorSEO = {
  '@type': string
  name: string
}
