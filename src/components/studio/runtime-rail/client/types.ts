export type SpotifyPayload = {
  ok?: boolean
  song?: {
    album?: string
    albumImageUrl?: string
    artist?: string
    songUrl?: string
    title?: string
    playedAt?: string
  } | null
  status?:
    | 'playing'
    | 'recently-played'
    | 'not-playing'
    | 'unavailable'
    | string
}

export type GithubContributionDay = {
  date: string
  contributionCount: number
  contributionLevel: string
  weekday?: number
}

export type GithubDayPayload = {
  additions?: number | null
  commits?: number | null
  contributions?: number | null
  date: string
  deletions?: number | null
  error?: string
  issues?: number | null
  ok?: boolean
  pullRequests?: number | null
  reviews?: number | null
}

export type GithubTodayPayload = GithubDayPayload

export type GithubStreakPayload = {
  error?: string
  fromDate?: string
  heatmap?: GithubContributionDay[]
  ok?: boolean
  toDate?: string
  username?: string
}

export type ActivityItem = {
  imageUrl?: string
  meta?: string
  subtitle?: string
  title: string
  type: 'book' | 'movie' | 'spotify' | 'github' | 'build'
  url?: string
}

export type ActivityPayload = {
  items?: ActivityItem[]
}

export type TokenBurnWindow = {
  cost?: number
  tokens?: number
  sessions?: number
  messages?: number
}

export type TokenBurnModelSlice = {
  model: string
  cost: number
  tokens: number
}

export type TokenBurnPayload = {
  ok?: boolean
  allTime?: TokenBurnWindow
  today?: TokenBurnWindow
  last7Days?: TokenBurnWindow
  topModels?: TokenBurnModelSlice[]
  lastActivity?: string
  error?: string
}
