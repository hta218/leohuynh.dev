import type { ImageProps as NextImageProps } from 'next/image'
import type React from 'react'
import type { projectsData } from '~/data/en/projectsData'
import type { commentConfig } from '~/data/siteMetadata'
import type { MdxFrontMatter, ReadingTime } from './mdx'

export interface PageTitleProps {
  children: React.ReactNode
}

export interface ImageLightBoxProps extends Pick<NextImageProps, 'src'> {
  closeLightbox: () => void
}

export interface ImageProps extends NextImageProps {
  shouldOpenLightbox?: boolean
}

export type ProjectDataType = (typeof projectsData)[0]

export interface ProjectCardProps {
  project: ProjectDataType
}

export interface SocialButtonsProps {
  postUrl: string
  title: string
  fileName: string
}

export type TwemojiProps = {
  emoji: string
  size?: string
  className?: string
}

export interface UnsplashPhotoProps {
  photoURL: string
  author: string
}

export interface ViewCounterProps {
  slug: string
  className?: string
}

export interface BlogHeaderProps {
  title: string
  date: string
  readingTime: ReadingTime
}

export type CommentConfigType = typeof commentConfig

export interface BlogMetaProps {
  date: string
  slug: string
  readingTime: ReadingTime
}

export interface CommentsProps {
  frontMatter: MdxFrontMatter
  config: CommentConfigType
}

export interface GiscusProps {
  config: CommentConfigType['giscusConfig']
}

export interface UtterancesProps {
  config: CommentConfigType['utterancesConfig']
}

export interface DisqusProps {
  identifier: string
  disqus: CommentConfigType['disqus']
}
