import type { ImageProps as NextImageProps } from 'next/image'
import type React from 'react'
import type { SocialIconsMap } from '~/components/SocialIcon'
import type { commentConfig, projectsData } from '~/data'
import type { MdxFrontMatter, ReadingTime } from './mdx'

export type PageTitleProps = {
  children: React.ReactNode
}

export interface ImageLightBoxProps extends Pick<NextImageProps, 'src'> {
  closeLightbox: () => void
}

export type SocialIconProps = {
  name: keyof typeof SocialIconsMap
  href: string
}

export interface ImageProps extends NextImageProps {
  shouldOpenLightbox?: boolean
}

export type ProjectDataType = typeof projectsData[0]

export type ProjectCardProps = {
  project: ProjectDataType
}

export type SocialButtonsProps = {
  postUrl: string
  title: string
  fileName: string
}

export type TwemojiProps = {
  emoji: string
  size?: string
  className?: string
}

export type UnsplashPhotoProps = {
  photoURL: string
  author: string
}

export type ViewCounterProps = {
  slug: string
  className?: string
}

export type BlogHeaderProps = {
  title: string
  date: string
  readingTime: ReadingTime
}

export type CommentConfigType = typeof commentConfig

export type BlogMetaProps = {
  date: string
  slug: string
  readingTime: ReadingTime
}

export interface CommentsProps {
  frontMatter: MdxFrontMatter
  config: CommentConfigType
}

export type GiscusProps = {
  config: CommentConfigType['giscusConfig']
}

export type UtterancesProps = {
  config: CommentConfigType['utterancesConfig']
}

export type DisqusProps = {
  identifier: string
  disqus: CommentConfigType['disqus']
}
