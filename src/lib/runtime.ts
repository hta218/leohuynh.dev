import { getBooks, getMovies } from '~/lib/media'
import { SITE } from '~/lib/site'
import type {
  ActivityItem,
  ActivityPayload,
  GithubContributionDay,
  GithubDayPayload,
  GithubStreakPayload,
  GithubTodayPayload,
  SpotifyPayload,
  SpotifyTrack,
  TokenBurnPayload,
  TokenBurnWindow,
} from '~/types/integrations'

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const CURRENTLY_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_ENDPOINT =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1'
const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql'
const TOKEN_BURN_SUMMARY_ENDPOINT =
  'https://api.github.com/repos/hta218/token-burn/contents/public/summary.json'
const HANOI_UTC_OFFSET_MS = 7 * 60 * 60 * 1000

/**
 * Reads a runtime env var from both Astro/Vite (`import.meta.env`) and Node
 * (`process.env`). In `astro dev`, values from `.env.local` are loaded into
 * `import.meta.env` (server-side) but NOT into `process.env`, so the old
 * `process.env`-only lookup reported tokens as missing locally.
 *
 * Dynamic key access on `import.meta.env` is never statically inlined by Vite,
 * and this module is only imported by server endpoints + `.astro` frontmatter,
 * so non-public secrets are never shipped to the client.
 */
function env(name: string): string | undefined {
  const viteEnv =
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env as Record<string, string | undefined>)
      : undefined
  const value = viteEnv?.[name] ?? process.env[name]
  return value?.trim() || undefined
}

function timeoutSignal(ms = 8000): AbortSignal {
  return AbortSignal.timeout(ms)
}

export function getUmamiWebsiteId(): string | undefined {
  return env('PUBLIC_UMAMI_WEBSITE_ID')
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

export function todayInHanoi(): {
  date: string
  from: string
  to: string
  startMs: number
} {
  const now = new Date()
  const hanoiNow = new Date(now.getTime() + HANOI_UTC_OFFSET_MS)
  return hanoiDateRange(
    hanoiNow.getUTCFullYear(),
    hanoiNow.getUTCMonth(),
    hanoiNow.getUTCDate(),
  )
}

function hanoiDateRange(
  year: number,
  zeroBasedMonth: number,
  day: number,
): { date: string; from: string; to: string; startMs: number } {
  const startMs = Date.UTC(year, zeroBasedMonth, day) - HANOI_UTC_OFFSET_MS
  const startUtc = new Date(startMs)
  const endUtc = new Date(startMs + 24 * 60 * 60 * 1000 - 1)
  return {
    date: `${year}-${String(zeroBasedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    from: startUtc.toISOString(),
    to: endUtc.toISOString(),
    startMs,
  }
}

function hanoiDateRangeFromDate(date: string): {
  date: string
  from: string
  to: string
  startMs: number
} {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) throw new Error('Expected date in YYYY-MM-DD format.')

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const normalized = new Date(Date.UTC(year, month - 1, day))
  if (
    normalized.getUTCFullYear() !== year ||
    normalized.getUTCMonth() !== month - 1 ||
    normalized.getUTCDate() !== day
  ) {
    throw new Error('Invalid calendar date.')
  }

  return hanoiDateRange(year, month - 1, day)
}

function hanoiDateRangeOffset(
  baseStartMs: number,
  offsetDays: number,
): {
  date: string
  from: string
  to: string
  startMs: number
} {
  const hanoiDate = new Date(
    baseStartMs + offsetDays * 24 * 60 * 60 * 1000 + HANOI_UTC_OFFSET_MS,
  )
  return hanoiDateRange(
    hanoiDate.getUTCFullYear(),
    hanoiDate.getUTCMonth(),
    hanoiDate.getUTCDate(),
  )
}

export function githubHeatmapDateWindow(): {
  fromDate: string
  toDate: string
  from: string
  to: string
} {
  const today = todayInHanoi()
  const yesterday = hanoiDateRangeOffset(today.startMs, -1)
  const start = hanoiDateRangeOffset(yesterday.startMs, -27)
  return {
    fromDate: start.date,
    toDate: yesterday.date,
    from: start.from,
    to: yesterday.to,
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

type GithubContributionCollection = {
  totalCommitContributions: number
  totalIssueContributions: number
  totalPullRequestContributions: number
  totalPullRequestReviewContributions: number
}

type GithubRepoCommit = {
  committedDate: string
  additions?: number
  deletions?: number
  author?: { user?: { login?: string } }
}

type GithubRepoNode = {
  defaultBranchRef?: {
    target?: {
      history?: {
        nodes: GithubRepoCommit[]
      }
    }
  }
}

type GithubDayGraphqlResponse = {
  user?: {
    selected?: GithubContributionCollection
  }
  // Commit totals from `contributionsCollection` hide private contributions
  // (collapsed into `restrictedContributionsCount`). To count LOCs in private
  // repos too, the LOC walk uses `viewer.repositories` instead — the token's
  // own repos, including private ones it has `repo` scope for.
  viewer?: {
    repositories?: {
      nodes: GithubRepoNode[]
    }
  }
}

function buildGithubDayPayload(
  response: GithubDayGraphqlResponse,
  username: string,
  range: { date: string; from: string; to: string },
): GithubDayPayload {
  const collection = response.user?.selected
  const repos = response.viewer?.repositories?.nodes ?? []

  // Today's commits across each repo's default branch. Keep the user's commits,
  // plus commits whose author email isn't linked to a GitHub login (author.user
  // is null) — otherwise unlinked-email commits get dropped.
  const dayCommits = repos.flatMap((repo) =>
    (repo.defaultBranchRef?.target?.history?.nodes ?? [])
      .filter(
        (commit) =>
          !commit.author?.user?.login || commit.author.user.login === username,
      )
      .filter(
        (commit) =>
          commit.committedDate >= range.from &&
          commit.committedDate <= range.to,
      ),
  )

  const fallbackCommits = collection?.totalCommitContributions ?? null
  const commits = dayCommits.length || fallbackCommits
  const additions = dayCommits.length
    ? dayCommits.reduce((sum, commit) => sum + (commit.additions ?? 0), 0)
    : null
  const deletions = dayCommits.length
    ? dayCommits.reduce((sum, commit) => sum + (commit.deletions ?? 0), 0)
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
    date: range.date,
    contributions,
    commits,
    additions,
    deletions,
    issues: collection?.totalIssueContributions ?? null,
    pullRequests: collection?.totalPullRequestContributions ?? null,
    reviews: collection?.totalPullRequestReviewContributions ?? null,
  }
}

type GithubStreakGraphqlResponse = {
  user?: {
    contributionsCollection?: {
      contributionCalendar?: {
        weeks: Array<{ contributionDays: GithubContributionDay[] }>
      }
    }
  }
}

async function fetchGithubSingleDayGraphql(range: {
  date: string
  from: string
  to: string
}): Promise<GithubDayGraphqlResponse> {
  const username = githubUsername()
  return githubGraphql<GithubDayGraphqlResponse>(
    `query GithubSingleDay($username: String!, $fromDateTime: DateTime!, $toDateTime: DateTime!, $fromGitTimestamp: GitTimestamp!, $toGitTimestamp: GitTimestamp!) {
      user(login: $username) {
        selected: contributionsCollection(from: $fromDateTime, to: $toDateTime) {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
        }
      }
      viewer {
        repositories(first: 30, orderBy: { field: PUSHED_AT, direction: DESC }, affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
          nodes {
            defaultBranchRef {
              target {
                ... on Commit {
                  history(first: 60, since: $fromGitTimestamp, until: $toGitTimestamp) {
                    nodes {
                      committedDate
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
      fromDateTime: range.from,
      toDateTime: range.to,
      fromGitTimestamp: range.from,
      toGitTimestamp: range.to,
    },
  )
}

async function fetchGithubStreakGraphql(window: {
  from: string
  to: string
}): Promise<GithubStreakGraphqlResponse> {
  const username = githubUsername()
  return githubGraphql<GithubStreakGraphqlResponse>(
    `query GithubStreak($username: String!, $fromDateTime: DateTime!, $toDateTime: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $fromDateTime, to: $toDateTime) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
                weekday
              }
            }
          }
        }
      }
    }`,
    {
      username,
      fromDateTime: window.from,
      toDateTime: window.to,
    },
  )
}

export async function fetchGithubStreak(): Promise<GithubStreakPayload> {
  const username = githubUsername()
  const window = githubHeatmapDateWindow()

  try {
    const data = await fetchGithubStreakGraphql(window)
    const heatmap =
      data.user?.contributionsCollection?.contributionCalendar?.weeks
        .flatMap((week) => week.contributionDays)
        .filter(
          (day) => day.date >= window.fromDate && day.date <= window.toDate,
        )
        .slice(-28) ?? []

    return {
      ok: true,
      username,
      fromDate: window.fromDate,
      toDate: window.toDate,
      heatmap,
    }
  } catch (error) {
    return {
      ok: false,
      username,
      fromDate: window.fromDate,
      toDate: window.toDate,
      heatmap: [],
      error: error instanceof Error ? error.message : 'GitHub request failed.',
    }
  }
}

export async function fetchGithubDay(date: string): Promise<GithubDayPayload> {
  const username = githubUsername()

  try {
    const range = hanoiDateRangeFromDate(date)
    const window = githubHeatmapDateWindow()
    if (range.date < window.fromDate || range.date > window.toDate) {
      throw new Error(
        `Date must be within ${window.fromDate} and ${window.toDate}.`,
      )
    }
    const data = await fetchGithubSingleDayGraphql(range)
    return buildGithubDayPayload(data, username, range)
  } catch (error) {
    return {
      ok: false,
      username,
      date,
      contributions: null,
      commits: null,
      additions: null,
      deletions: null,
      issues: null,
      pullRequests: null,
      reviews: null,
      error: error instanceof Error ? error.message : 'GitHub request failed.',
    }
  }
}

export async function fetchGithubToday(): Promise<GithubTodayPayload> {
  const username = githubUsername()
  const today = todayInHanoi()

  try {
    const data = await fetchGithubSingleDayGraphql(today)
    return buildGithubDayPayload(data, username, today)
  } catch (error) {
    return {
      ok: false,
      username,
      date: today.date,
      contributions: null,
      commits: null,
      additions: null,
      deletions: null,
      issues: null,
      pullRequests: null,
      reviews: null,
      error: error instanceof Error ? error.message : 'GitHub request failed.',
    }
  }
}

export async function fetchLatestGithubActivity(): Promise<ActivityItem | null> {
  const username = githubUsername()
  type GraphqlResponse = {
    user?: {
      pullRequests?: {
        nodes: Array<{
          title: string
          url: string
          createdAt: string
          repository: {
            nameWithOwner: string
            isPrivate: boolean
            owner: { login: string; avatarUrl: string }
          }
        }>
      }
    }
    search?: {
      nodes: Array<{
        nameWithOwner: string
        url: string
        isPrivate: boolean
        owner: { login: string; avatarUrl: string }
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

  try {
    const data = await githubGraphql<GraphqlResponse>(
      `query LatestGithubActivity($username: String!, $searchQuery: String!) {
        user(login: $username) {
          pullRequests(first: 2, orderBy: { field: CREATED_AT, direction: DESC }) {
            nodes {
              title
              url
              createdAt
              repository { nameWithOwner isPrivate owner { login avatarUrl } }
            }
          }
        }
        search(query: $searchQuery, type: REPOSITORY, first: 5) {
          nodes {
            ... on Repository {
              nameWithOwner
              url
              isPrivate
              owner { login avatarUrl }
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
      { username, searchQuery: `user:${username} is:public sort:updated-desc` },
    )

    const commits =
      data.search?.nodes
        .filter((repo) => !repo.isPrivate)
        .flatMap((repo) =>
          (repo.defaultBranchRef?.target?.history?.nodes ?? [])
            .filter((commit) => commit.author?.user?.login === username)
            .map((commit) => ({
              ...commit,
              repo: repo.nameWithOwner,
              imageUrl: repo.owner.avatarUrl,
            })),
        ) ?? []

    const commit = commits.sort(
      (a, b) =>
        new Date(b.committedDate).getTime() -
        new Date(a.committedDate).getTime(),
    )[0]

    if (commit) {
      const mergeMatch = /#(\d+)/.exec(commit.message)
      const title = mergeMatch
        ? `Merged PR #${mergeMatch[1]}`
        : commit.message.split('\n')[0]
      return {
        type: 'github',
        title,
        subtitle: commit.repo,
        url: commit.url,
        meta: commit.abbreviatedOid,
        imageUrl: commit.imageUrl,
      }
    }

    const pr = data.user?.pullRequests?.nodes.find(
      (node) =>
        node.repository.owner.login !== username && !node.repository.isPrivate,
    )

    if (pr) {
      return {
        type: 'github',
        title: pr.title,
        subtitle: pr.repository.nameWithOwner,
        url: pr.url,
        meta: 'pull request',
        imageUrl: pr.repository.owner.avatarUrl,
      }
    }
  } catch {
    return null
  }

  return null
}

export async function fetchActivity(): Promise<ActivityPayload> {
  const items: ActivityItem[] = []
  const [books, movies] = await Promise.all([getBooks(), getMovies()])
  const currentlyReading = books.filter((book) =>
    book.userShelves.includes('currently-reading'),
  )
  // Prefer an actively-read book over a paused one for the rail.
  const reading =
    currentlyReading.find((book) => !book.userShelves.includes('paused')) ??
    currentlyReading[0]
  const watched = movies.sort((a, b) =>
    b.dateRated.localeCompare(a.dateRated),
  )[0]
  const github = await fetchLatestGithubActivity()

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
      subtitle: `${watched.year} • ${watched.runtime} mins • ★ ${watched.yourRating}`,
      url: watched.url,
      imageUrl: watched.poster,
      meta: 'last watched',
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

  return { ok: true, items: items.slice(0, 3) }
}

// token-burn: AI coding token spend, read from the private repo's pre-aggregated
// `public/summary.json` via the GitHub Contents API. The PAT lives in env and is
// only used server-side, so it never reaches the client. The committed file holds
// only time-absolute data — `today` / `last7Days` / `last30Days` are derived here
// from `daily[]` using the same Hanoi calendar the GitHub rail uses.
type TokenBurnTotals = {
  tokens?: number
  cost?: number
  sessions?: number
  messages?: number
}

type TokenBurnDailyRow = TokenBurnTotals & {
  date: string
  byModel?: Record<string, TokenBurnTotals>
}

type TokenBurnSummary = {
  lastActivity?: string
  machines?: string[]
  allTime?: TokenBurnTotals
  byModel?: Record<string, TokenBurnTotals>
  daily?: TokenBurnDailyRow[]
}

const EMPTY_TOKEN_BURN_WINDOW: TokenBurnWindow = {
  cost: 0,
  tokens: 0,
  sessions: 0,
  messages: 0,
}

function unavailableTokenBurn(error: string): TokenBurnPayload {
  return {
    ok: false,
    allTime: EMPTY_TOKEN_BURN_WINDOW,
    today: EMPTY_TOKEN_BURN_WINDOW,
    last7Days: EMPTY_TOKEN_BURN_WINDOW,
    last30Days: EMPTY_TOKEN_BURN_WINDOW,
    topModels: [],
    machines: [],
    error,
  }
}

function tokenBurnWindow(rows: TokenBurnTotals[]): TokenBurnWindow {
  return rows.reduce<TokenBurnWindow>(
    (acc, row) => ({
      cost: acc.cost + (row.cost ?? 0),
      tokens: acc.tokens + (row.tokens ?? 0),
      sessions: acc.sessions + (row.sessions ?? 0),
      messages: acc.messages + (row.messages ?? 0),
    }),
    { ...EMPTY_TOKEN_BURN_WINDOW },
  )
}

function buildTokenBurnPayload(summary: TokenBurnSummary): TokenBurnPayload {
  const today = todayInHanoi()
  const from7 = hanoiDateRangeOffset(today.startMs, -6).date
  const from30 = hanoiDateRangeOffset(today.startMs, -29).date
  const daily = summary.daily ?? []

  const todayRow = daily.find((row) => row.date === today.date)
  // Top models for *today* by token count (tokens lead the widget; cost is
  // secondary). Sourced from todayRow.byModel so it tracks the same Hanoi day as
  // the rest of the widget. The UI shows a few and expands the rest via "+n more".
  const topModels = Object.entries(todayRow?.byModel ?? {})
    .map(([model, totals]) => ({
      model,
      cost: totals.cost ?? 0,
      tokens: totals.tokens ?? 0,
    }))
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, 10)

  return {
    ok: true,
    allTime: tokenBurnWindow([summary.allTime ?? {}]),
    today: tokenBurnWindow(todayRow ? [todayRow] : []),
    last7Days: tokenBurnWindow(daily.filter((row) => row.date >= from7)),
    last30Days: tokenBurnWindow(daily.filter((row) => row.date >= from30)),
    topModels,
    machines: summary.machines ?? [],
    lastActivity: summary.lastActivity,
  }
}

export async function fetchTokenBurn(): Promise<TokenBurnPayload> {
  // Reuses GITHUB_API_TOKEN — it already has read access to the private
  // token-burn repo, so no separate PAT is needed.
  const token = env('GITHUB_API_TOKEN')
  if (!token) {
    return unavailableTokenBurn('GITHUB_API_TOKEN is not configured.')
  }

  try {
    const response = await fetch(TOKEN_BURN_SUMMARY_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.raw+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      signal: timeoutSignal(),
    })

    if (!response.ok) {
      return unavailableTokenBurn(
        `token-burn fetch failed with HTTP ${response.status}.`,
      )
    }

    const summary = (await response.json()) as TokenBurnSummary
    return buildTokenBurnPayload(summary)
  } catch (error) {
    return unavailableTokenBurn(
      error instanceof Error ? error.message : 'token-burn request failed.',
    )
  }
}
