import type { Data, Node } from 'unist'

export interface ViewApiResponse {
  data?: {
    total: string
  }
}

export type SpotifyNowPlayingData = {
  isPlaying: boolean
  songUrl?: string
  title?: string
  artist?: string
  album?: string
  albumImageUrl?: string
}

export type TagsCount = {
  [key: string]: number
}

export type Pagination = {
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
}
export interface UnistImageNode extends UnistNodeType {
  url: string
  alt: string
  name: string
  attributes: unknown[]
}
