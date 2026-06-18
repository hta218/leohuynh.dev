/**
 * Views + reactions stats shape, ported from the legacy `db/schema.ts` `statsTable`
 * (`type`, `slug`, `views`, `loves`, `applauses`, `ideas`, `bullseyes`).
 *
 * v4 is static today, so these types back the client widgets and a graceful-fallback
 * fetch layer (`src/lib/stats.ts`). DB-backed persistence is cutover/runtime work — see
 * the spec docs. Nothing here writes to a database.
 */
export type StatsType = 'blog' | 'snippet'

export type ReactionKey = 'loves' | 'applauses' | 'ideas' | 'bullseyes'

export interface BlogStats {
  type: StatsType
  slug: string
  views: number
  loves: number
  applauses: number
  ideas: number
  bullseyes: number
}
