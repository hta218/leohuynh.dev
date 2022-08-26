import type { ImageProps as NextImageProps } from 'next/image'
import type React from 'react'
import type { SocialIconsMap } from '~/components/SocialIcon'
import type { projectsData } from '~/data'

export type PageTitleProps = {
  children: React.ReactNode
}

export interface ImageLightBoxProps extends Pick<NextImageProps, 'src'> {
  closeLightbox: () => void
}

export type SocialIconProps = {
  name: keyof typeof SocialIconsMap
  href: string
  size?: number
}

export interface ImageProps extends NextImageProps {
  shouldOpenLightbox?: boolean
}

export type PaginationProps = {
  totalPages: number
  currentPage: number
}

export type SpotifyNowPlayingData = {
  songUrl?: string
  title?: string
  artist?: string
}

export type ProjectDataType = typeof projectsData[0]

export type ProjectCardProps = {
  project: ProjectDataType
}

export type PageSeoProps = {
  title: string
  description: string
}

export type BlogSeoProps = {
  authorDetails: any
  title: string
  summary: string
  date: string
  lastmod: string
  url: string
  images: any[]
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

export type AuthorLayoutProps = {
  children: React.ReactNode
  frontMatter: any
}

export type ListLayoutProps = {
  posts: any[]
  title: string
  initialDisplayPosts?: any[]
  pagination?: any
}

export type BlogHeaderProps = {
  title: string
  date: string
  readingTime: any
}

export type PostSimpleProps = {
  frontMatter: any
  type: string
  children: React.ReactNode
  authorDetails: any
}

export type BlogMetaProps = {
  date: string
  slug: string
  readingTime: {
    text: string
  }
}
