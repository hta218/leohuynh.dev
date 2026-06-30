import type { GithubContributionDay } from '~/types/integrations'

export type GithubContributionCollection = {
  totalCommitContributions: number
  totalIssueContributions: number
  totalPullRequestContributions: number
  totalPullRequestReviewContributions: number
}

export type GithubRepoCommit = {
  committedDate: string
  additions?: number
  deletions?: number
  author?: { user?: { login?: string } }
}

export type GithubRepoNode = {
  defaultBranchRef?: {
    target?: {
      history?: {
        nodes: GithubRepoCommit[]
      }
    }
  }
}

export type GithubDayGraphqlResponse = {
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

export type GithubStreakGraphqlResponse = {
  user?: {
    contributionsCollection?: {
      contributionCalendar?: {
        weeks: Array<{ contributionDays: GithubContributionDay[] }>
      }
    }
  }
}
