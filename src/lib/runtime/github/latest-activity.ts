import type { ActivityItem } from '~/types/integrations'
import { githubGraphql, githubUsername } from './client'

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
