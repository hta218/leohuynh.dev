import type { AuthorFrontMatter, MdxFrontMatter } from './mdx'

export interface PageSeoProps {
  title: string
  description: string
}

export interface BlogSeoProps extends MdxFrontMatter {
  authorDetails: AuthorFrontMatter[]
  url: string
}

export interface AuthorSEO {
  '@type': string
  name: string
}
