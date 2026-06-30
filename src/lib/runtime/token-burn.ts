import type { TokenBurnPayload, TokenBurnWindow } from '~/types/integrations'
import { hanoiDateRangeOffset, todayInHanoi } from './hanoi-date'
import { env, timeoutSignal } from './shared'

const TOKEN_BURN_SUMMARY_ENDPOINT =
  'https://api.github.com/repos/hta218/token-burn/contents/public/summary.json'

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
