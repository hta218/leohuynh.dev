import type React from 'react'
import type { CommentConfigType } from './components'
import type { BlogFrontMatter, SnippetFrontMatter } from './mdx'
import type { Pagination } from './server'

export type AuthorLayoutProps = {
  children: React.ReactNode
  frontMatter: any
}

export type ListLayoutProps = {
  posts: BlogFrontMatter[]
  title: string
  initialDisplayPosts?: BlogFrontMatter[]
  pagination?: Pagination
}

export interface PostSimpleLayoutProps {
  frontMatter: any
  type: string
  children: React.ReactNode
  authorDetails: any
  commentConfig: CommentConfigType
}

export interface SnippetLayoutProps {
  snippets: SnippetFrontMatter[]
  description: string
}
