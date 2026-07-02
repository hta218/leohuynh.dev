import { getSql } from '~/lib/db'
import type { SiteStatsPayload } from '~/types/integrations'
import { githubGraphql } from './github/client'
import { fetchUmamiTraffic } from './umami'

const REPO_OWNER = 'hta218'
const REPO_NAME = 'leohuynh.dev'

/** Repo stargazers + total commit count on the default branch, via GitHub GraphQL. */
async function fetchGithubRepoStats(): Promise<{
  commits: number | null
  stars: number | null
}> {
  try {
    const data = await githubGraphql<{
      repository: {
        stargazerCount: number
        defaultBranchRef: {
          target: { history: { totalCount: number } }
        } | null
      } | null
    }>(
      `query ($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          stargazerCount
          defaultBranchRef {
            target { ... on Commit { history { totalCount } } }
          }
        }
      }`,
      { owner: REPO_OWNER, name: REPO_NAME },
    )

    const repo = data.repository
    return {
      commits: repo?.defaultBranchRef?.target.history.totalCount ?? null,
      stars:
        typeof repo?.stargazerCount === 'number' ? repo.stargazerCount : null,
    }
  } catch {
    return { commits: null, stars: null }
  }
}

/** Total reactions across the whole site: SUM of every reaction column in `stats`. */
async function fetchTotalReactions(): Promise<number | null> {
  try {
    const db = getSql()
    const [row] = await db<{ total: number }[]>`
      select coalesce(sum(loves + applauses + ideas + bullseyes), 0)::int as total
      from stats
    `
    return typeof row?.total === 'number' ? row.total : null
  } catch {
    return null
  }
}

/**
 * Live site-wide stats for the home cards + build-log manifest, fanned out across Umami, the
 * GitHub repo, and the `stats` table. Each source degrades independently to `null`, so a partial
 * outage still returns the rest. `ok` is true when at least one number resolved.
 */
export async function fetchSiteStats(): Promise<SiteStatsPayload> {
  const [traffic, repo, reactions] = await Promise.all([
    fetchUmamiTraffic(),
    fetchGithubRepoStats(),
    fetchTotalReactions(),
  ])

  const payload: Omit<SiteStatsPayload, 'ok'> = {
    hits: traffic.hits,
    online: traffic.online,
    visitors: traffic.visitors,
    hits24h: traffic.hits24h,
    visitors24h: traffic.visitors24h,
    reactions,
    commits: repo.commits,
    stars: repo.stars,
  }

  const ok = Object.values(payload).some((value) => value !== null)
  return { ok, ...payload }
}
