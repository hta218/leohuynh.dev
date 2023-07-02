import { GraphqlResponseError, graphql, type GraphQlQueryResponseData } from '@octokit/graphql'
import type { NextApiRequest, NextApiResponse } from 'next'
import { siteMetadata } from '~/data/siteMetadata'

export default async function fetchGithubRepo(req: NextApiRequest, res: NextApiResponse) {
  let repo = req.query.repo as string
  if (!repo) {
    return res.status(400).json({ message: 'Missing repo query param' })
  }
  if (!process.env.GITHUB_API_TOKEN) {
    return res.status(500).json({ message: 'Missing `GITHUB_API_TOKEN` env variable' })
  }
  let owner = siteMetadata.socialAccounts.github
  if (repo.includes('/')) {
    ;[owner, repo] = repo.split('/')
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
        owner,
        repo,
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
    return res.status(200).json({ message: 'ok', repository })
  } catch (error) {
    if (error instanceof GraphqlResponseError) {
      return res.status(500).json({ message: error.errors[0].message })
    } else {
      return res.status(500).json({ message: 'Unable to fetch repo data' + error?.toString() })
    }
  }
}
