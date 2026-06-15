import { getBooks, getMovies } from '~/lib/media'
import { SITE } from '~/lib/site'
import type {
  ActivityItem,
  ActivityPayload,
  GithubTodayPayload,
  SpotifyPayload,
  SpotifyTrack,
} from '~/types/integrations'

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const CURRENTLY_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_ENDPOINT =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1'
const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql'
const HANOI_UTC_OFFSET_MS = 7 * 60 * 60 * 1000

function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined
}

function timeoutSignal(ms = 8000): AbortSignal {
  return AbortSignal.timeout(ms)
}

export function getUmamiWebsiteId(): string | undefined {
  return env('PUBLIC_UMAMI_WEBSITE_ID') ?? env('NEXT_UMAMI_ID')
}

export function jsonHeaders(ttl = 60): HeadersInit {
  return {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 10}`,
  }
}

interface SpotifyApiImage {
  url?: string
}

interface SpotifyApiItem {
  type?: 'track' | 'episode' | string
  name?: string
  images?: SpotifyApiImage[]
  external_urls?: { spotify?: string }
  artists?: Array<{ name: string }>
  album?: { name?: string; images?: SpotifyApiImage[] }
  show?: { name?: string; images?: SpotifyApiImage[] }
}

function unavailableSpotify(
  error = 'Spotify credentials are not configured.',
): SpotifyPayload {
  return { ok: false, status: 'unavailable', isPlaying: false, error }
}

function normalizeTrack(
  item: SpotifyApiItem | null | undefined,
  playedAt?: string,
): SpotifyTrack | undefined {
  if (!item) return undefined

  if (item.type === 'episode') {
    return {
      title: item.name ?? 'Unknown episode',
      artist: item.show?.name ?? 'Unknown show',
      album: item.show?.name ?? 'Podcast',
      albumImageUrl: item.images?.[0]?.url ?? item.show?.images?.[0]?.url,
      songUrl: item.external_urls?.spotify,
      playedAt,
    }
  }

  if (item.type === 'track') {
    return {
      title: item.name ?? 'Unknown track',
      artist: Array.isArray(item.artists)
        ? item.artists.map((artist: { name: string }) => artist.name).join(', ')
        : 'Unknown artist',
      album: item.album?.name ?? 'Unknown album',
      albumImageUrl: item.album?.images?.[0]?.url,
      songUrl: item.external_urls?.spotify,
      playedAt,
    }
  }

  return undefined
}

async function getSpotifyAccessToken(): Promise<string | null> {
  const clientId = env('SPOTIFY_CLIENT_ID')
  const clientSecret = env('SPOTIFY_CLIENT_SECRET')
  const refreshToken = env('SPOTIFY_REFRESH_TOKEN')

  if (!clientId || !clientSecret || !refreshToken) return null

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    signal: timeoutSignal(),
  })

  if (!response.ok) return null

  const data = (await response.json()) as { access_token?: string }
  return data.access_token ?? null
}

export async function fetchSpotifyStatus(): Promise<SpotifyPayload> {
  try {
    const accessToken = await getSpotifyAccessToken()
    if (!accessToken) return unavailableSpotify()

    const currentUrl = new URL(CURRENTLY_PLAYING_ENDPOINT)
    currentUrl.searchParams.set('additional_types', 'track,episode')

    const current = await fetch(currentUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: timeoutSignal(),
    })

    if (current.ok && current.status !== 204) {
      const data = await current.json()
      const song = normalizeTrack(data.item)
      if (song && data.is_playing === true) {
        return {
          ok: true,
          status: 'playing',
          isPlaying: true,
          song,
        }
      }
    }

    const recent = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: timeoutSignal(),
    })

    if (recent.ok) {
      const data = await recent.json()
      const last = data.items?.[0]
      const song = normalizeTrack(last?.track, last?.played_at)
      if (song) {
        return { ok: true, status: 'recently-played', isPlaying: false, song }
      }
    }

    return unavailableSpotify('No current or recent Spotify track found.')
  } catch (error) {
    return unavailableSpotify(
      error instanceof Error ? error.message : 'Spotify request failed.',
    )
  }
}

function todayInHanoi(): { date: string; from: string; to: string } {
  const now = new Date()
  const hanoiNow = new Date(now.getTime() + HANOI_UTC_OFFSET_MS)
  const y = hanoiNow.getUTCFullYear()
  const m = hanoiNow.getUTCMonth()
  const d = hanoiNow.getUTCDate()
  const startUtc = new Date(Date.UTC(y, m, d) - HANOI_UTC_OFFSET_MS)
  const endUtc = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000 - 1)
  return {
    date: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    from: startUtc.toISOString(),
    to: endUtc.toISOString(),
  }
}

function githubUsername(): string {
  return SITE.github.split('/').filter(Boolean).at(-1) ?? 'hta218'
}

async function githubGraphql<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const token = env('GITHUB_API_TOKEN')
  if (!token) throw new Error('GITHUB_API_TOKEN is not configured.')

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    signal: timeoutSignal(),
  })

  if (!response.ok) {
    throw new Error(`GitHub GraphQL failed with HTTP ${response.status}.`)
  }

  const json = await response.json()
  if (json.errors?.length) {
    throw new Error(
      json.errors[0]?.message ?? 'GitHub GraphQL returned errors.',
    )
  }

  return json.data as T
}

export async function fetchGithubToday(): Promise<GithubTodayPayload> {
  const username = githubUsername()
  const { date, from, to } = todayInHanoi()

  try {
    type GraphqlResponse = {
      user?: {
        contributionsCollection?: {
          totalCommitContributions: number
          totalIssueContributions: number
          totalPullRequestContributions: number
          totalPullRequestReviewContributions: number
          commitContributionsByRepository: Array<{
            repository: { nameWithOwner: string; url: string }
            contributions: { totalCount: number }
          }>
        }
      }
      search?: {
        nodes: Array<{
          nameWithOwner: string
          url: string
          defaultBranchRef?: {
            target?: {
              history?: {
                nodes: Array<{
                  committedDate: string
                  message: string
                  url: string
                  additions?: number
                  deletions?: number
                  author?: { user?: { login?: string } }
                }>
              }
            }
          }
        }>
      }
    }

    const data = await githubGraphql<GraphqlResponse>(
      `query GithubToday($username: String!, $fromDateTime: DateTime!, $toDateTime: DateTime!, $fromGitTimestamp: GitTimestamp!, $searchQuery: String!) {
        user(login: $username) {
          contributionsCollection(from: $fromDateTime, to: $toDateTime) {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            commitContributionsByRepository(maxRepositories: 10) {
              repository { nameWithOwner url }
              contributions(first: 100) { totalCount }
            }
          }
        }
        search(query: $searchQuery, type: REPOSITORY, first: 8) {
          nodes {
            ... on Repository {
              nameWithOwner
              url
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(first: 20, since: $fromGitTimestamp) {
                      nodes {
                        committedDate
                        message
                        url
                        additions
                        deletions
                        author { user { login } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      {
        username,
        fromDateTime: from,
        toDateTime: to,
        fromGitTimestamp: from,
        searchQuery: `user:${username} sort:updated-desc`,
      },
    )

    const collection = data.user?.contributionsCollection
    const repos = collection?.commitContributionsByRepository ?? []
    const topRepo = repos
      .map((repo) => ({
        nameWithOwner: repo.repository.nameWithOwner,
        url: repo.repository.url,
        commits: repo.contributions.totalCount,
      }))
      .sort((a, b) => b.commits - a.commits)[0]

    const todayCommits =
      data.search?.nodes.flatMap((repo) =>
        (repo.defaultBranchRef?.target?.history?.nodes ?? [])
          .filter((commit) => commit.author?.user?.login === username)
          .filter(
            (commit) =>
              commit.committedDate >= from && commit.committedDate <= to,
          ),
      ) ?? []

    const fallbackCommits = collection?.totalCommitContributions ?? null
    const commits = todayCommits.length || fallbackCommits
    const additions = todayCommits.length
      ? todayCommits.reduce((sum, commit) => sum + (commit.additions ?? 0), 0)
      : null
    const deletions = todayCommits.length
      ? todayCommits.reduce((sum, commit) => sum + (commit.deletions ?? 0), 0)
      : null
    const contributions = collection
      ? collection.totalCommitContributions +
        collection.totalIssueContributions +
        collection.totalPullRequestContributions +
        collection.totalPullRequestReviewContributions
      : null

    return {
      ok: true,
      username,
      date,
      contributions,
      commits,
      additions,
      deletions,
      topRepo,
    }
  } catch (error) {
    return {
      ok: false,
      username,
      date,
      contributions: null,
      commits: null,
      additions: null,
      deletions: null,
      error: error instanceof Error ? error.message : 'GitHub request failed.',
    }
  }
}

export async function fetchLatestGithubActivity(): Promise<ActivityItem | null> {
  const username = githubUsername()

  try {
    type GraphqlResponse = {
      user?: {
        pullRequests?: {
          nodes: Array<{
            title: string
            url: string
            createdAt: string
            repository: { nameWithOwner: string; owner: { login: string } }
          }>
        }
      }
      search?: {
        nodes: Array<{
          nameWithOwner: string
          defaultBranchRef?: {
            target?: {
              history?: {
                nodes: Array<{
                  committedDate: string
                  message: string
                  url: string
                  abbreviatedOid: string
                  author?: { user?: { login?: string } }
                }>
              }
            }
          }
        }>
      }
    }

    const data = await githubGraphql<GraphqlResponse>(
      `query LatestGithubActivity($username: String!, $searchQuery: String!) {
        user(login: $username) {
          pullRequests(first: 2, orderBy: { field: CREATED_AT, direction: DESC }) {
            nodes {
              title
              url
              createdAt
              repository { nameWithOwner owner { login } }
            }
          }
        }
        search(query: $searchQuery, type: REPOSITORY, first: 5) {
          nodes {
            ... on Repository {
              nameWithOwner
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(first: 5) {
                      nodes {
                        committedDate
                        message
                        url
                        abbreviatedOid
                        author { user { login } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      { username, searchQuery: `user:${username} sort:updated-desc` },
    )

    const commits =
      data.search?.nodes.flatMap((repo) =>
        (repo.defaultBranchRef?.target?.history?.nodes ?? [])
          .filter((commit) => commit.author?.user?.login === username)
          .map((commit) => ({ ...commit, repo: repo.nameWithOwner })),
      ) ?? []

    const commit = commits.sort(
      (a, b) =>
        new Date(b.committedDate).getTime() -
        new Date(a.committedDate).getTime(),
    )[0]

    if (commit) {
      return {
        type: 'github',
        title: commit.message.split('\n')[0],
        subtitle: commit.repo,
        url: commit.url,
        meta: commit.abbreviatedOid,
      }
    }

    const pr = data.user?.pullRequests?.nodes.find(
      (node) => node.repository.owner.login !== username,
    )

    if (pr) {
      return {
        type: 'github',
        title: pr.title,
        subtitle: pr.repository.nameWithOwner,
        url: pr.url,
        meta: 'pull request',
      }
    }
  } catch {
    return null
  }

  return null
}

export async function fetchActivity(): Promise<ActivityPayload> {
  const items: ActivityItem[] = []
  const books = getBooks()
  const movies = getMovies()
  const reading = books.find((book) =>
    book.userShelves.includes('currently-reading'),
  )
  const watched = movies.sort((a, b) => b.yourRating - a.yourRating)[0]
  const [spotify, github] = await Promise.all([
    fetchSpotifyStatus(),
    fetchLatestGithubActivity(),
  ])

  if (reading) {
    items.push({
      type: 'book',
      title: reading.title,
      subtitle: reading.authorName,
      url: reading.link,
      imageUrl: reading.imageUrl,
      meta: 'currently reading',
    })
  }

  if (watched) {
    items.push({
      type: 'movie',
      title: watched.title,
      subtitle: `${watched.year} · ★ ${watched.yourRating}`,
      url: watched.url,
      imageUrl: watched.poster,
      meta: 'top rated recently',
    })
  }

  if (spotify.ok && spotify.song) {
    items.push({
      type: 'spotify',
      title: spotify.song.title,
      subtitle: spotify.song.artist,
      url: spotify.song.songUrl,
      imageUrl: spotify.song.albumImageUrl,
      meta: spotify.status === 'playing' ? 'now playing' : 'recently played',
    })
  }

  if (github) items.push(github)

  if (items.length === 0) {
    items.push({
      type: 'build',
      title: 'scaffolded v4',
      subtitle: 'astro + bun workspace',
      meta: 'build log',
    })
  }

  return { ok: true, items: items.slice(0, 4) }
}
