import { DEFAULT_LIMIT, MAX_LIMIT } from './constants'
import type { Cursor } from './types'

export function encodeCursor(createdAt: string, id: string): string {
  return Buffer.from(`${createdAt}_${id}`, 'utf8').toString('base64url')
}

export function decodeCursor(raw: string | null | undefined): Cursor | null {
  if (!raw) return null
  try {
    const decoded = Buffer.from(raw, 'base64url').toString('utf8')
    const separator = decoded.lastIndexOf('_')
    if (separator <= 0) return null
    const createdAt = decoded.slice(0, separator)
    const id = decoded.slice(separator + 1)
    if (!createdAt || !id || Number.isNaN(Date.parse(createdAt))) return null
    return { createdAt, id }
  } catch {
    return null
  }
}

export function clampLimit(raw: string | null | undefined): number {
  if (raw == null || raw.trim() === '') return DEFAULT_LIMIT
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT
  return Math.min(MAX_LIMIT, Math.max(1, Math.floor(parsed)))
}
