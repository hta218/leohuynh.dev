import type React from 'react'
import type { CommentConfigType } from './components'
import type { PaginationType, TOC } from './server'
import type { AuthorFrontMatter, BlogFrontMatter, MdxFrontMatter, SnippetFrontMatter } from './mdx'

export interface AuthorLayoutProps {
  children: React.ReactNode
  frontMatter: BlogFrontMatter
}

export interface ListLayoutProps {
  posts: BlogFrontMatter[]
  title: string
  initialDisplayPosts?: BlogFrontMatter[]
  pagination?: PaginationType
}

export interface PostSimpleLayoutProps {
  frontMatter: BlogFrontMatter
  type: string
  children: React.ReactNode
  authorDetails: AuthorFrontMatter[]
  commentConfig: CommentConfigType
  page: number
}

export interface PostLayoutProps extends PostSimpleLayoutProps {}

export interface SnippetLayoutProps {
  snippets: SnippetFrontMatter[]
  description: string
}

export interface ResumeLayoutProps {
  children: React.ReactNode
  frontMatter: MdxFrontMatter
  toc: TOC
}
