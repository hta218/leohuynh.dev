import postgres from 'postgres'

/**
 * Shared Postgres (Supabase) connection. Used by `/api/stats` for persisted
 * views/reactions and by `lib/media` for the live books/movies shelf data.
 *
 * `astro dev` loads `.env` into `import.meta.env`, not `process.env`.
 * On Vercel the Function runtime injects real env into `process.env`.
 * Read both so the code works locally and in production.
 */
const DATABASE_URL = import.meta.env.DATABASE_URL ?? process.env.DATABASE_URL

let sql: ReturnType<typeof postgres> | undefined

export function getSql() {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.')
  }

  sql ??= postgres(DATABASE_URL, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 8,
  })

  return sql
}
