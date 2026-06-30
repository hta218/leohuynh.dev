import { SITE } from '~/lib/site'
import { env, timeoutSignal } from '../shared'

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql'

export function githubUsername(): string {
  return SITE.github.split('/').filter(Boolean).at(-1) ?? 'hta218'
}

export async function githubGraphql<T>(
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
