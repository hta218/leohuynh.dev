import type { Document, MDX } from 'contentlayer2/core'

export type SpotifySong = {
  songUrl: string
  title: string
  artist: string
  album: string
  albumImageUrl: string
}

export type SpotifyNowPlayingData =
  | { isPlaying: false }
  | { isPlaying: true; song: SpotifySong }

export type NowPlayingData =
  | { ok: true; song: SpotifySong }
  | { ok: false; error: string }

export type RecentlyPlayedData =
  | { ok: true; song: SpotifySong & { playedAt: string } }
  | { ok: false; error: string }

export type Project = {
  type: 'work' | 'self'
  title: string
  description?: string
  imgSrc: string
  url?: string
  repo?: string
  builtWith: string[]
  links?: { title: string; url: string }[]
}

export type GoodreadsBook = {
  guid: string
  pubDate: string
  title: string
  link: string
  id: string
  bookImageUrl: string
  bookSmallImageUrl: string
  bookMediumImageUrl: string
  bookLargeImageUrl: string
  bookDescription: string
  authorName: string
  isbn: string
  userName: string
  userRating: string
  userReadAt: string
  userDateAdded: string
  userDateCreated: string
  userShelves: string
  userReview: string
  averageRating: string
  bookPublished: string
  content: string
}

export type GoodreadsCsvBook = {
  id: string
  title: string
  authorName: string
  isbn?: string
  userRating: string
  averageRating: string
  publisher?: string
  numberOfPages?: string
  yearPublished?: string
  bookPublished?: string
  userReadAt?: string
  userDateAdded: string
  userShelves?: string
  exclusiveShelves?: string
  userReview?: string
  binding?: string
  [key: string]: string | undefined // For other CSV columns we don't explicitly handle
}

export type ImdbMovie = {
  id: string
  yourRating: string
  dateRated: string
  title: string
  originalTitle: string
  url: string
  titleType: string
  imdbRating: string
  runtime: string
  year: string
  genres: string
  numVotes: string
  releaseDate: string
  directors: string
  // Additional fields from the OMDB API
  actors: string
  plot: string
  poster: string
  language: string
  country: string
  awards: string
  boxOffice: string
  totalSeasons: string
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
  owner: {
    avatarUrl: string
    login: string
    url: string
  }
}

// https://docs.github.com/en/graphql/reference/enums#statusstate
export type CommitState =
  | 'SUCCESS'
  | 'PENDING'
  | 'FAILURE'
  | 'ERROR'
  | 'EXPECTED'

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

export type GithubActivity = {
  type: 'commit' | 'pullRequest' | 'issue'
  createdAt: string
  url: string
  title: string
  repository: {
    name: string
    nameWithOwner: string
    url: string
    owner: {
      avatarUrl: string
      login: string
      url: string
    }
  }
}

export type GithubCommitActivity = GithubActivity & {
  type: 'commit'
  message: string
  abbreviatedOid: string
}

export type GithubPullRequestActivity = GithubActivity & {
  type: 'pullRequest'
  state: 'OPEN' | 'CLOSED' | 'MERGED'
  number: number
}

export type GithubUserActivity = {
  commit: GithubCommitActivity | null
  pullRequest: GithubPullRequestActivity | null
}

export type MDXDocument = Document & { body: MDX }
export type MDXDocumentDate = MDXDocument & {
  date: string
}

export type CoreContent<T> = Omit<T, 'body' | '_raw' | '_id'>
