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
    // max:1 deadlocks: two concurrent queries (e.g. /api/activity + /api/stats
    // firing on the same page load) pipeline onto a single pgbouncer
    // transaction-pooler connection and hang. A small pool gives each its own
    // connection. The Supabase transaction pooler (port 6543) multiplexes
    // fine, so a few connections per serverless instance is safe.
    max: 3,
    idle_timeout: 20,
    connect_timeout: 8,
    types: {
      // Some json/jsonb cells hold scraped HTML/text that isn't valid JSON
      // (e.g. a failed Goodreads/OMDB fetch wrote an error page into the cell).
      // The default parser JSON.parse()s every json column and throws on these,
      // which kills the whole `select *` query. Parse leniently: fall back to
      // the raw string instead of throwing so one bad cell can't break the read.
      jsonSafe: {
        to: 3802,
        from: [114, 3802],
        serialize: (value: unknown) => JSON.stringify(value),
        parse: (value: string) => {
          try {
            return JSON.parse(value)
          } catch {
            return value
          }
        },
      },
    },
  })

  return sql
}
