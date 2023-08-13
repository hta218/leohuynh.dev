import type { Data, Node } from 'unist'

export interface ViewApiResponse {
  data?: {
    total: string
  }
}

export interface SpotifyNowPlayingData {
  isPlaying: boolean
  songUrl?: string
  title?: string
  artist?: string
  album?: string
  albumImageUrl?: string
}

export interface GithubRepository {
  stargazerCount: number
  description: string
  homepageUrl: string
  languages: {
    color: string
    name: string
  }[]
  name: string
  nameWithOwner: string
  url: string
  forkCount: number
  repositoryTopics: string[]
}

export interface TagsCount {
  [tag: string]: number
}

export interface PaginationType {
  currentPage: number
  totalPages: number
}

export interface UnistTreeType extends Node<Data> {
  children: Node<Data>[]
}
export interface UnistNodeType extends Node<Data> {
  lang?: string
  children: Node<Data>[]
  properties?: { [key: string]: string[] }
  depth?: number
}
export interface UnistImageNode extends UnistNodeType {
  url: string
  alt: string
  name: string
  attributes: unknown[]
}

export type TOC = {
  value: string
  depth: number
  data: { hProperties?: { id?: string } }
  children: TOC[]
  url: string
}

export interface RemarkTocHeadingOptions {
  exportRef: Array<{ value: string; url: string; depth: number }>
  cleaned?: boolean
}
