import type { CommentConfigType } from './components'
import type { BlogFrontMatter, MdxFileData } from './mdx'
import type { Pagination } from './server'

export interface SnippetProps {
  snippet: MdxFileData
  commentConfig: CommentConfigType
}

export type BlogListProps = {
  posts: BlogFrontMatter[]
  initialDisplayPosts: BlogFrontMatter[]
  pagination: Pagination
}

export interface BlogProps {
  post: MdxFileData
  authorDetails: BlogFrontMatter[]
  prev: BlogFrontMatter
  next: BlogFrontMatter
  page: number
  commentConfig: CommentConfigType
}
