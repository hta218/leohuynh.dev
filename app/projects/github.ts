import { graphql, type GraphQlQueryResponseData } from '@octokit/graphql'
import type { Project, GithubRepository } from '~/types/data'

export async function fetchProjectRepoData(pro: Project): Promise<GithubRepository | null> {
  let repo = pro?.repo as string
  if (!repo || !process.env.GITHUB_API_TOKEN) {
    console.error(pro.title, 'Missing repo or GITHUB_API_TOKEN')
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
      }
    )
    repository.languages = repository.languages.edges.map((edge) => {
      return {
        color: edge.node.color,
        name: edge.node.name,
      }
    })
    repository.repositoryTopics = repository.repositoryTopics.edges.map(
      (edge) => edge.node.topic.name
    )
    return repository
  } catch (err) {
    console.error(err)
    return null
  }
}
