/**
 * Reads a runtime env var from both Astro/Vite (`import.meta.env`) and Node
 * (`process.env`). In `astro dev`, values from `.env.local` are loaded into
 * `import.meta.env` (server-side) but NOT into `process.env`, so the old
 * `process.env`-only lookup reported tokens as missing locally.
 *
 * Dynamic key access on `import.meta.env` is never statically inlined by Vite,
 * and this module is only imported by server endpoints + `.astro` frontmatter,
 * so non-public secrets are never shipped to the client.
 */
export function env(name: string): string | undefined {
  const viteEnv =
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env as Record<string, string | undefined>)
      : undefined
  const value = viteEnv?.[name] ?? process.env[name]
  return value?.trim() || undefined
}

export function timeoutSignal(ms = 8000): AbortSignal {
  return AbortSignal.timeout(ms)
}

export function jsonHeaders(ttl = 60): HeadersInit {
  return {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 10}`,
  }
}

export function noStoreJsonHeaders(): HeadersInit {
  return {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'private, no-store, max-age=0',
  }
}
