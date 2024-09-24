export type SpotifyNowPlayingData = {
  isPlaying: boolean
  songUrl?: string
  title?: string
  artist?: string
  album?: string
  albumImageUrl?: string
}

export type Project = {
  type: 'work' | 'self'
  title: string
  description?: string
  imgSrc: string
  url?: string
  repo?: string | GithubRepository | null
  builtWith: string[]
}

export type GoodreadsBook = {
  guid: string
  pubDate: string
  title: string
  link: string
  book_id: string
  book_image_url: string
  book_small_image_url: string
  book_medium_image_url: string
  book_large_image_url: string
  book_description: string
  author_name: string
  isbn: string
  user_name: string
  user_rating: string
  user_read_at: string
  user_date_added: string
  user_date_created: string
  user_shelves: string
  user_review: string
  average_rating: number
  book_published: string
  content: string
}

export interface ViewApiResponse {
  data?: {
    total: string
  }
}

export type GithubRepository = {
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
