import type {
  GuestbookEntry,
  GuestbookSignature,
  GuestbookUser,
} from '~/types/guestbook'
import type { GuestbookRow } from './types'

function normalizeSignatureForRead(value: unknown): GuestbookSignature | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Partial<GuestbookSignature>
  if (
    typeof candidate.width !== 'number' ||
    typeof candidate.height !== 'number' ||
    !Array.isArray(candidate.strokes)
  ) {
    return null
  }
  return candidate as GuestbookSignature
}

export function toEntryDTO(
  row: GuestbookRow,
  viewer: GuestbookUser | null,
): GuestbookEntry {
  const createdAt =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : new Date(row.created_at).toISOString()
  return {
    id: row.id,
    displayName: row.display_name,
    githubLogin: row.github_login,
    githubAvatarUrl: row.github_avatar_url,
    message: row.message,
    signature: normalizeSignatureForRead(row.signature),
    status: row.status,
    createdAt,
    isOwnEntry: viewer ? Number(row.github_id) === viewer.id : false,
  }
}
