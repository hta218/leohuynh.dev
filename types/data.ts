import type { Document, MDX } from 'contentlayer2/core'

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
  links?: { title: string; url: string }[]
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

export type ImdbMovie = {
  const: string
  your_rating: string
  date_rated: string
  title: string
  original_title: string
  url: string
  title_type: string
  imdb_rating: string
  runtime: string
  year: string
  genres: string
  num_votes: string
  release_date: string
  directors: string
  // Additional fields from the OMDB API
  actors: string
  plot: string
  poster: string
  language: string
  country: string
  awards: string
  box_office: string
  total_seasons: string
  ratings: Array<{ source: string; value: string }>
}

export type OmdbMovie = {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Array<{ Source: string; Value: string }>
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  totalSeasons: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
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
  lastCommit?: GithubRepositoryCommit
}

// https://docs.github.com/en/graphql/reference/enums#statusstate
export type CommitState = 'SUCCESS' | 'PENDING' | 'FAILURE' | 'ERROR' | 'EXPECTED'

export type GithubRepositoryCommit = {
  id: string
  abbreviatedOid: string
  committedDate: string
  message: string
  url: string
  status: {
    state: CommitState
  }
}

export type MDXDocument = Document & { body: MDX }
export type MDXDocumentDate = MDXDocument & {
  date: string
}

export type CoreContent<T> = Omit<T, 'body' | '_raw' | '_id'>
