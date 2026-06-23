import type { APIRoute } from 'astro'
import { getSql } from '~/lib/db'

/**
 * Site-wide global hit counter, backed by a single `site_counters` row (`key = 'hits'`).
 *
 * - GET  → `{ ok, hits }`, lazily seeding the row from `SUM(stats.views)` if it's missing.
 * - POST → increments and returns the new total (also seeds on first hit via `on conflict`).
 *
 * Mirrors `api/stats.ts`: `prerender = false`, shared `getSql()` pool, try/catch → 503, and
 * graceful failure when `DATABASE_URL` is absent (plain `astro preview`). The home page card
 * falls back to `—` rather than faking a number when this endpoint can't answer.
 *
 * Seed query is idempotent: `insert … on conflict (key) do nothing/update` never resets a
 * live count, so re-running the migration or hitting a fresh deploy is safe.
 */

const HITS_KEY = 'hits'

const JSON_HEADERS = {
  // Approximate vanity counter — a short shared cache is fine and spares the DB.
  'cache-control': 'public, max-age=0, s-maxage=30',
  'content-type': 'application/json; charset=utf-8',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS })
}

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    const db = getSql()

    // Lazily seed from accumulated post + snippet views the first time it's read.
    await db`
      insert into site_counters (key, value)
      values (${HITS_KEY}, (select coalesce(sum(views), 0) from stats))
      on conflict (key) do nothing
    `

    const [row] = await db<{ value: number }[]>`
      select value from site_counters where key = ${HITS_KEY} limit 1
    `

    return json({ ok: true, hits: Number(row?.value ?? 0) })
  } catch (error) {
    console.error('[api/hits]', error)
    return json({ ok: false, hits: 0 }, 503)
  }
}

export const POST: APIRoute = async () => {
  try {
    const db = getSql()

    // Seed-and-increment in one statement: the first ever hit also establishes the
    // baseline from existing post views, so order of deploy vs. migration doesn't matter.
    const [row] = await db<{ value: number }[]>`
      insert into site_counters (key, value)
      values (${HITS_KEY}, (select coalesce(sum(views), 0) from stats) + 1)
      on conflict (key) do update set value = site_counters.value + 1
      returning value
    `

    return json({ ok: true, hits: Number(row?.value ?? 0) })
  } catch (error) {
    console.error('[api/hits]', error)
    return json({ ok: false, hits: 0 }, 503)
  }
}
