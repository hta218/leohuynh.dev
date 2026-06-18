export interface SpotifyTrack {
  title: string
  artist: string
  album: string
  albumImageUrl?: string
  songUrl?: string
  playedAt?: string
}

export interface SpotifyPayload {
  ok: boolean
  status: 'playing' | 'recently-played' | 'unavailable'
  isPlaying: boolean
  song?: SpotifyTrack
  error?: string
}

export interface GithubContributionDay {
  date: string
  contributionCount: number
  contributionLevel:
    | 'NONE'
    | 'FIRST_QUARTILE'
    | 'SECOND_QUARTILE'
    | 'THIRD_QUARTILE'
    | 'FOURTH_QUARTILE'
    | string
  weekday?: number
}

export interface GithubDayPayload {
  ok: boolean
  username: string
  date: string
  contributions: number | null
  commits: number | null
  additions: number | null
  deletions: number | null
  issues?: number | null
  pullRequests?: number | null
  reviews?: number | null
  error?: string
}

export interface GithubTodayPayload extends GithubDayPayload {}

export interface GithubStreakPayload {
  ok: boolean
  username: string
  fromDate: string
  toDate: string
  heatmap: GithubContributionDay[]
  error?: string
}

export interface ActivityItem {
  type: 'book' | 'movie' | 'spotify' | 'github' | 'build'
  title: string
  subtitle?: string
  url?: string
  imageUrl?: string
  meta?: string
}

export interface ActivityPayload {
  ok: boolean
  items: ActivityItem[]
  error?: string
}
