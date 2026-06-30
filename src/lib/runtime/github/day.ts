import type { GithubDayPayload, GithubTodayPayload } from '~/types/integrations'
import {
  githubHeatmapDateWindow,
  hanoiDateRangeFromDate,
  todayInHanoi,
} from '../hanoi-date'
import { githubGraphql, githubUsername } from './client'
import type { GithubDayGraphqlResponse } from './types'

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
