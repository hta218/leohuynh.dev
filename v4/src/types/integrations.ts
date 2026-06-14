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

export interface GithubTodayPayload {
  ok: boolean
  username: string
  date: string
  contributions: number | null
  commits: number | null
  additions: number | null
  deletions: number | null
  topRepo?: {
    nameWithOwner: string
    url: string
    commits: number
  }
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
