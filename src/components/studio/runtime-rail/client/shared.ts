export const stat = (value: number | null | undefined) =>
  typeof value === 'number' ? value.toLocaleString() : '—'

export async function fetchRuntimeJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const response = await fetch(url, init)
    if (!response.ok) return null
    return (await response.json()) as T
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      console.warn(`[runtime-rail] failed to fetch ${url}`, error)
    }
    return null
  }
}
