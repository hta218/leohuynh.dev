import type { NextRequest } from 'next/server'
import { fetchRepoData } from '~/utils/github'

export async function GET(request: NextRequest) {
  let { searchParams: params } = new URL(request.url)
  let repo = params.get('repo')
  if (!repo) {
    return Response.json(
      { message: 'Missing repo parameter' },
      {
        status: 400,
      }
    )
  }
  let data = await fetchRepoData({ repo, includeLastCommit: true })
  return Response.json(data)
}
