import { getSql } from '~/lib/db'
import {
  getServerEnv,
  hashWithSecret,
  verifyGuestbookSession,
} from '~/lib/github-oauth'
import type {
  GuestbookEntry,
  GuestbookSignature,
  GuestbookStatus,
  GuestbookUser,
} from '~/types/guestbook'

export const MESSAGE_MIN_LENGTH = 1
export const MESSAGE_MAX_LENGTH = 500
export const DISPLAY_NAME_MAX_LENGTH = 80
/** Cap the stored signature JSON to keep rows small and block payload abuse. */
export const SIGNATURE_MAX_BYTES = 20 * 1024
/** Signatures are normalized client-side to this fixed coordinate space. */
export const SIGNATURE_COORD_MAX = 1000
export const DEFAULT_LIMIT = 20
export const MAX_LIMIT = 50
/** Abuse windows. */
export const MAX_ENTRIES_PER_USER_PER_DAY = 3
export const MAX_ENTRIES_PER_IP_PER_DAY = 5

interface GuestbookRow {
  id: string
  github_id: string | number
  github_login: string
  github_name: string | null
  github_avatar_url: string | null
  display_name: string
  message: string
  signature: unknown
  status: GuestbookStatus
  created_at: Date | string
}

interface RequestMeta {
  ipHash: string | null
  userAgentHash: string | null
  nowSeconds: number
}

interface Cursor {
  createdAt: string
  id: string
}

type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string }

type CreateResult =
  | { ok: true; entry: GuestbookEntry; status: 'approved' | 'pending' }
  | { ok: false; status: 400 | 429; message: string }

/** Admin GitHub logins, configured via env as a comma-separated list. */
export function isGuestbookAdmin(login: string | undefined | null): boolean {
  if (!login) return false
  const raw = getServerEnv('GUESTBOOK_ADMIN_GITHUB_LOGINS') ?? ''
  const admins = raw
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
  return admins.includes(login.toLowerCase())
}

/** Auto-approve GitHub-authenticated entries unless explicitly disabled. */
export function isAutoApproveEnabled(): boolean {
  return getServerEnv('GUESTBOOK_AUTO_APPROVE') !== 'false'
}

/** Resolve the signed-in user from the raw session cookie value. */
export function getGuestbookCurrentUser(
  cookieValue: string | undefined,
  nowSeconds: number,
): GuestbookUser | null {
  return verifyGuestbookSession(cookieValue, nowSeconds)
}

export function validateMessage(raw: unknown): ValidationResult<string> {
  if (typeof raw !== 'string') {
    return { ok: false, message: 'Message is required.' }
  }
  const value = raw.trim()
  if (value.length < MESSAGE_MIN_LENGTH) {
    return { ok: false, message: 'Message cannot be empty.' }
  }
  if (value.length > MESSAGE_MAX_LENGTH) {
    return {
      ok: false,
      message: `Message must be ${MESSAGE_MAX_LENGTH} characters or fewer.`,
    }
  }
  return { ok: true, value }
}

/** Fall back to the GitHub name, then login, when no override is given. */
export function resolveDisplayName(
  raw: unknown,
  user: GuestbookUser,
): ValidationResult<string> {
  const fallback = (user.name ?? user.login).trim()
  if (raw === undefined || raw === null || raw === '') {
    return { ok: true, value: fallback }
  }
  if (typeof raw !== 'string') {
    return { ok: false, message: 'Display name must be text.' }
  }
  const value = raw.trim()
  if (!value) return { ok: true, value: fallback }
  if (value.length > DISPLAY_NAME_MAX_LENGTH) {
    return {
      ok: false,
      message: `Display name must be ${DISPLAY_NAME_MAX_LENGTH} characters or fewer.`,
    }
  }
  return { ok: true, value }
}

function isValidPoint(point: unknown): point is [number, number] {
  return (
    Array.isArray(point) &&
    point.length === 2 &&
    typeof point[0] === 'number' &&
    typeof point[1] === 'number' &&
    Number.isFinite(point[0]) &&
    Number.isFinite(point[1]) &&
    point[0] >= 0 &&
    point[0] <= SIGNATURE_COORD_MAX &&
    point[1] >= 0 &&
    point[1] <= SIGNATURE_COORD_MAX
  )
}

/** Validate an optional signature payload (shape, bounds, size). */
export function validateSignature(
  raw: unknown,
): ValidationResult<GuestbookSignature | null> {
  if (raw === undefined || raw === null) return { ok: true, value: null }
  if (typeof raw !== 'object') {
    return { ok: false, message: 'Signature is malformed.' }
  }

  const candidate = raw as Partial<GuestbookSignature>
  const { width, height, strokes } = candidate
  if (
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    !Array.isArray(strokes)
  ) {
    return { ok: false, message: 'Signature is malformed.' }
  }
  if (strokes.length === 0) return { ok: true, value: null }

  for (const stroke of strokes) {
    if (!Array.isArray(stroke) || !stroke.every(isValidPoint)) {
      return { ok: false, message: 'Signature is malformed.' }
    }
  }

  const value: GuestbookSignature = {
    width,
    height,
    strokes: strokes as Array<Array<[number, number]>>,
  }
  if (Buffer.byteLength(JSON.stringify(value), 'utf8') > SIGNATURE_MAX_BYTES) {
    return { ok: false, message: 'Signature is too large.' }
  }
  return { ok: true, value }
}

/** Heuristic spam check: hold entries with too many links/emails for review. */
export function looksLikeSpam(message: string): boolean {
  const urls = message.match(/https?:\/\/|www\./gi) ?? []
  const emails = message.match(/[^\s@]+@[^\s@]+\.[^\s@]+/g) ?? []
  return urls.length > 2 || emails.length > 1 || urls.length + emails.length > 3
}

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
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT
  return Math.min(MAX_LIMIT, Math.max(1, Math.floor(parsed)))
}

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

function toEntryDTO(
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

/**
 * Fetch a page of entries newest-first using stable `(created_at, id)` keyset
 * pagination. Anonymous/non-admin viewers see approved entries only.
 */
export async function getGuestbookEntries(options: {
  cursor?: string | null
  limit?: number
  viewer?: GuestbookUser | null
  isAdmin?: boolean
}): Promise<{ entries: GuestbookEntry[]; nextCursor: string | null }> {
  const db = getSql()
  const limit = options.limit ?? DEFAULT_LIMIT
  const cursor = decodeCursor(options.cursor)
  const viewer = options.viewer ?? null
  const isAdmin = options.isAdmin ?? false

  const rows = await db<GuestbookRow[]>`
    select
      id, github_id, github_login, github_name, github_avatar_url,
      display_name, message, signature, status, created_at
    from guestbook_entries
    where ${isAdmin ? db`true` : db`status = 'approved'`}
      ${
        cursor
          ? db`and (created_at, id) < (${cursor.createdAt}, ${cursor.id})`
          : db``
      }
    order by created_at desc, id desc
    limit ${limit + 1}
  `

  const hasMore = rows.length > limit
  const page = hasMore ? rows.slice(0, limit) : rows
  const entries = page.map((row) => toEntryDTO(row, viewer))
  const last = page.at(-1)
  const nextCursor =
    hasMore && last
      ? encodeCursor(
          last.created_at instanceof Date
            ? last.created_at.toISOString()
            : new Date(last.created_at).toISOString(),
          last.id,
        )
      : null

  return { entries, nextCursor }
}

/** Create an entry for an authenticated GitHub user. Server controls identity. */
export async function createGuestbookEntry(
  input: {
    message: unknown
    displayName?: unknown
    signature?: unknown
  },
  user: GuestbookUser,
  meta: RequestMeta,
): Promise<CreateResult> {
  const message = validateMessage(input.message)
  if (!message.ok) return { ok: false, status: 400, message: message.message }

  const displayName = resolveDisplayName(input.displayName, user)
  if (!displayName.ok) {
    return { ok: false, status: 400, message: displayName.message }
  }

  const signature = validateSignature(input.signature)
  if (!signature.ok) {
    return { ok: false, status: 400, message: signature.message }
  }

  // Auto-approve GitHub-authenticated entries, but hold spammy-looking ones for
  // manual review rather than publishing them.
  const status: GuestbookStatus =
    isAutoApproveEnabled() && !looksLikeSpam(message.value)
      ? 'approved'
      : 'pending'

  const db = getSql()
  return db.begin(async (tx) => {
    // Serialize per-user and per-IP checks so parallel submissions cannot all
    // observe the same pre-insert count and bypass the 24h limits.
    await tx`
      select pg_advisory_xact_lock(
        hashtextextended(${`guestbook:user:${user.id}`}, 0)
      )
    `
    if (meta.ipHash) {
      await tx`
        select pg_advisory_xact_lock(
          hashtextextended(${`guestbook:ip:${meta.ipHash}`}, 0)
        )
      `
    }

    const [userCount] = await tx<{ count: number }[]>`
      select count(*)::int as count
      from guestbook_entries
      where github_id = ${user.id}
        and created_at > now() - interval '24 hours'
    `
    if ((userCount?.count ?? 0) >= MAX_ENTRIES_PER_USER_PER_DAY) {
      return {
        ok: false,
        status: 429,
        message: 'Daily limit reached. Try again tomorrow.',
      }
    }

    if (meta.ipHash) {
      const [ipCount] = await tx<{ count: number }[]>`
        select count(*)::int as count
        from guestbook_entries
        where ip_hash = ${meta.ipHash}
          and created_at > now() - interval '24 hours'
      `
      if ((ipCount?.count ?? 0) >= MAX_ENTRIES_PER_IP_PER_DAY) {
        return {
          ok: false,
          status: 429,
          message: 'Daily limit reached. Try again tomorrow.',
        }
      }
    }

    const [row] = await tx<GuestbookRow[]>`
      insert into guestbook_entries (
        github_id, github_login, github_name, github_avatar_url,
        display_name, message, signature, status, ip_hash, user_agent_hash
      ) values (
        ${user.id}, ${user.login}, ${user.name}, ${user.avatarUrl},
        ${displayName.value}, ${message.value},
        ${
          signature.value
            ? tx.json(signature.value as unknown as Parameters<typeof tx.json>[0])
            : null
        },
        ${status}, ${meta.ipHash}, ${meta.userAgentHash}
      )
      returning
        id, github_id, github_login, github_name, github_avatar_url,
        display_name, message, signature, status, created_at
    `

    return {
      ok: true,
      entry: toEntryDTO(row, user),
      status: status === 'approved' ? 'approved' : 'pending',
    }
  })
}

/** Admin moderation: soft-hide or restore an entry. Never deletes. */
export async function moderateGuestbookEntry(
  id: string,
  nextStatus: 'approved' | 'hidden',
  adminLogin: string,
): Promise<GuestbookEntry | null> {
  const db = getSql()
  const [row] = await db<GuestbookRow[]>`
    update guestbook_entries
    set
      status = ${nextStatus},
      hidden_at = ${nextStatus === 'hidden' ? db`now()` : null},
      hidden_by = ${nextStatus === 'hidden' ? adminLogin : null},
      updated_at = now()
    where id = ${id}
    returning
      id, github_id, github_login, github_name, github_avatar_url,
      display_name, message, signature, status, created_at
  `
  return row ? toEntryDTO(row, null) : null
}

/** Hash request metadata so we never persist raw IP / user-agent values. */
export function buildRequestMeta(
  ip: string | null,
  userAgent: string | null,
  nowSeconds: number,
): RequestMeta {
  return {
    ipHash: ip ? hashWithSecret(ip) : null,
    userAgentHash: userAgent ? hashWithSecret(userAgent) : null,
    nowSeconds,
  }
}
