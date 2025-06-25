import { type GraphQlQueryResponseData, graphql } from '@octokit/graphql'
import type { GithubRepository, GithubUserActivity } from '~/types/data'

const HISTORY_QUERY = `
  defaultBranchRef {
    target {
      ... on Commit {
        history(first: 1) {
          edges {
            node {
              ... on Commit {
                id
                abbreviatedOid
                committedDate
                message
                url
                status {
                  state
                }
              }
            }
          }
        }
      }
    }
  }
`

export async function fetchRepoData({
  repo = '',
  includeLastCommit = false,
}: {
  repo: string
  includeLastCommit?: boolean
}): Promise<GithubRepository | null> {
  if (!process.env.GITHUB_API_TOKEN || !repo) {
    console.error('Missing `GITHUB_API_TOKEN` or `repo`')
    return null
  }
  try {
    let { repository }: GraphQlQueryResponseData = await graphql(
      `
        query repository($owner: String!, $repo: String!) {
          repository(owner: $owner, name: $repo) {
            stargazerCount
            description
            homepageUrl
            owner {
              avatarUrl
              login
              url
            }
            ${includeLastCommit ? HISTORY_QUERY : ''}
            languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
              edges {
                node {
                  color
                  name
                }
              }
            }
            name
            nameWithOwner
            url
            forkCount
            repositoryTopics(first: 20) {
              edges {
                node {
                  topic {
                    name
                  }
                }
              }
            }
          }
        }
      `,
      {
        owner: repo.split('/')[0],
        repo: repo.split('/')[1],
        headers: {
          authorization: `token ${process.env.GITHUB_API_TOKEN}`,
        },
      },
    )
    if (includeLastCommit) {
      repository.lastCommit =
        repository.defaultBranchRef.target.history.edges[0].node
      repository.defaultBranchRef = undefined
    }
    repository.languages = repository.languages.edges.map((edge) => {
      return {
        color: edge.node.color,
        name: edge.node.name,
      }
    })
    repository.repositoryTopics = repository.repositoryTopics.edges.map(
      (edge) => edge.node.topic.name,
    )
    return repository
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * Fetches the latest GitHub user activity including pull requests only
 */
export async function fetchUserPullRequests({
  username,
}: {
  username: string
}): Promise<GithubUserActivity[]> {
  if (!process.env.GITHUB_API_TOKEN || !username) {
    console.error('Missing `GITHUB_API_TOKEN` or `username`')
    return []
  }

  try {
    let { user }: GraphQlQueryResponseData = await graphql(
      `
        query userActivity($username: String!) {
          user(login: $username) {
            pullRequests(first: 10, orderBy: { field: CREATED_AT, direction: DESC }) {
              edges {
                node {
                  title
                  url
                  number
                  state
                  createdAt
                  repository {
                    name
                    nameWithOwner
                    url
                    owner {
                      avatarUrl
                      login
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `,
      {
        username,
        headers: {
          authorization: `token ${process.env.GITHUB_API_TOKEN}`,
        },
      },
    )

    let activities: GithubUserActivity[] = []

    // Add the latest pull request (only PRs to repositories owned by others)
    if (user.pullRequests?.edges && user.pullRequests.edges.length > 0) {
      for (let prEdge of user.pullRequests.edges) {
        let pr = prEdge.node
        // Only include PRs that are opened to repositories NOT owned by the user
        if (pr.repository.owner.login !== username) {
          activities.push({
            type: 'pullRequest',
            createdAt: pr.createdAt,
            url: pr.url,
            title: pr.title,
            state: pr.state,
            number: pr.number,
            repository: {
              name: pr.repository.name,
              nameWithOwner: pr.repository.nameWithOwner,
              url: pr.repository.url,
              owner: {
                avatarUrl: pr.repository.owner.avatarUrl,
                login: pr.repository.owner.login,
                url: pr.repository.owner.url,
              },
            },
          })
          break // Only take the first (latest) PR to external repositories
        }
      }
    }

    return activities
  } catch (err) {
    console.error('Error fetching user activity:', err)
    return []
  }
}

/**
 * Fetches the latest commits for a specific user across their repositories
 */
export async function fetchUserCommits({
  username,
}: {
  username: string
}): Promise<GithubUserActivity[]> {
  if (!process.env.GITHUB_API_TOKEN || !username) {
    console.error('Missing `GITHUB_API_TOKEN` or `username`')
    return []
  }

  try {
    let { search }: GraphQlQueryResponseData = await graphql(
      `
        query userCommits($searchQuery: String!) {
          search(query: $searchQuery, type: REPOSITORY, first: 20) {
            edges {
              node {
                ... on Repository {
                  name
                  nameWithOwner
                  url
                  owner {
                    avatarUrl
                    login
                    url
                  }
                  defaultBranchRef {
                    target {
                      ... on Commit {
                        history(first: 5) {
                          edges {
                            node {
                              ... on Commit {
                                id
                                abbreviatedOid
                                committedDate
                                message
                                url
                                author {
                                  user {
                                    login
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      {
        searchQuery: `user:${username} sort:updated-desc`,
        headers: {
          authorization: `token ${process.env.GITHUB_API_TOKEN}`,
        },
      },
    )

    let commits: GithubUserActivity[] = []

    if (search?.edges) {
      for (let repoEdge of search.edges) {
        let repo = repoEdge.node
        if (repo.defaultBranchRef?.target?.history?.edges) {
          for (let commitEdge of repo.defaultBranchRef.target.history.edges) {
            let commit = commitEdge.node
            // Only include commits by the specified user and filter out merge commits
            if (
              commit.author?.user?.login === username &&
              !/^Merge pull request/i.test(commit.message.split('\n')[0])
            ) {
              commits.push({
                type: 'commit',
                createdAt: commit.committedDate,
                url: commit.url,
                title: commit.message.split('\n')[0], // Use first line of commit message as title
                message: commit.message,
                abbreviatedOid: commit.abbreviatedOid,
                repository: {
                  name: repo.name,
                  nameWithOwner: repo.nameWithOwner,
                  url: repo.url,
                  owner: {
                    avatarUrl: repo.owner.avatarUrl,
                    login: repo.owner.login,
                    url: repo.owner.url,
                  },
                },
              })
            }
          }
        }
      }
    }

    // Sort commits by date (most recent first) and return only the latest one
    return commits
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 1)
  } catch (err) {
    console.error('Error fetching user commits:', err)
    return []
  }
}

/**
 * Fetches comprehensive user activity including the latest commit and pull request
 */
export async function getGithubUserActivities({
  username,
}: {
  username?: string
}): Promise<GithubUserActivity[]> {
  if (!username) {
    console.error('Username is required to fetch user activities')
    return []
  }
  try {
    let [generalActivity, commits] = await Promise.all([
      fetchUserPullRequests({ username }),
      fetchUserCommits({ username }),
    ])

    // Combine and sort all activities (should be max 2 items: 1 PR + 1 commit)
    let allActivities = [...generalActivity, ...commits]
    return allActivities.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  } catch (err) {
    console.error('Error fetching comprehensive user activity:', err)
    return []
  }
}
