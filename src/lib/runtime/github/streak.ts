import type { GithubStreakPayload } from '~/types/integrations'
import { githubHeatmapDateWindow } from '../hanoi-date'
import { githubGraphql, githubUsername } from './client'
import type { GithubStreakGraphqlResponse } from './types'

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
