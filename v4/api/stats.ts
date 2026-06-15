import postgres from 'postgres'

type StatsType = 'blog' | 'snippet'
type StatsField = 'views' | 'loves' | 'applauses' | 'ideas' | 'bullseyes'

interface StatsRow extends Record<StatsField, number> {
  type: StatsType
  slug: string
}

interface StatsRequest {
  method?: string
  query: Record<string, string | string[] | undefined>
  body?: unknown
}

interface StatsResponse {
  setHeader(name: string, value: string): void
  status(code: number): StatsResponse
  json(body: unknown): void
}

const STATS_FIELDS: StatsField[] = [
  'views',
  'loves',
  'applauses',
  'ideas',
  'bullseyes',
]

let sql: ReturnType<typeof postgres> | undefined

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.')
  }

  sql ??= postgres(process.env.DATABASE_URL, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 8,
  })

  return sql
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function parseType(value: string | undefined): StatsType | null {
  return value === 'blog' || value === 'snippet' ? value : null
}

function parseSlug(value: string | undefined): string | null {
  const slug = value?.trim()
  if (!slug || slug.length > 255) return null
  return slug
}

function jsonError(res: StatsResponse, status: number, message: string) {
  return res.status(status).json({ message })
}

async function parseBody(body: unknown): Promise<Record<string, unknown>> {
  if (!body) return {}
  if (typeof body === 'string')
    return JSON.parse(body) as Record<string, unknown>
  if (typeof body === 'object') return body as Record<string, unknown>
  return {}
}

function normalizeCount(value: unknown): number | undefined {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) return undefined
  return Math.max(0, Math.floor(numberValue))
}

async function ensureStats(type: StatsType, slug: string): Promise<StatsRow> {
  const db = getSql()

  await db`
    insert into stats (type, slug)
    values (${type}, ${slug})
    on conflict (type, slug) do nothing
  `

  const [row] = await db<StatsRow[]>`
    select type, slug, views, loves, applauses, ideas, bullseyes
    from stats
    where type = ${type} and slug = ${slug}
    limit 1
  `

  return row
}

async function getStats(req: StatsRequest, res: StatsResponse) {
  const type = parseType(first(req.query.type))
  const slug = parseSlug(first(req.query.slug))

  if (!type || !slug) {
    return jsonError(res, 400, 'Missing or invalid `type` or `slug` parameter!')
  }

  const row = await ensureStats(type, slug)
  return res.status(200).json(row)
}

async function updateStats(req: StatsRequest, res: StatsResponse) {
  let body: Record<string, unknown>
  try {
    body = await parseBody(req.body)
  } catch {
    return jsonError(res, 400, 'Invalid JSON body.')
  }

  const type = parseType(typeof body.type === 'string' ? body.type : undefined)
  const slug = parseSlug(typeof body.slug === 'string' ? body.slug : undefined)

  if (!type || !slug) {
    return jsonError(res, 400, 'Missing or invalid `type` or `slug` parameter!')
  }

  const current = await ensureStats(type, slug)
  const next: StatsRow = { ...current }

  for (const field of STATS_FIELDS) {
    const value = normalizeCount(body[field])
    if (value !== undefined) next[field] = Math.max(current[field], value)
  }

  const db = getSql()
  const [updated] = await db<StatsRow[]>`
    update stats
    set
      views = ${next.views},
      loves = ${next.loves},
      applauses = ${next.applauses},
      ideas = ${next.ideas},
      bullseyes = ${next.bullseyes}
    where type = ${type} and slug = ${slug}
    returning type, slug, views, loves, applauses, ideas, bullseyes
  `

  return res.status(200).json(updated)
}

export default async function handler(req: StatsRequest, res: StatsResponse) {
  res.setHeader('cache-control', 'no-store')

  try {
    if (req.method === 'GET') return await getStats(req, res)
    if (req.method === 'POST') return await updateStats(req, res)

    res.setHeader('allow', 'GET, POST')
    return jsonError(res, 405, 'Method not allowed.')
  } catch (error) {
    console.error('[api/stats]', error)
    return jsonError(res, 503, 'Stats service unavailable.')
  }
}
