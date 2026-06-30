import { getSql } from '~/lib/db'
import type {
  GuestbookEntry,
  GuestbookStatus,
  GuestbookUser,
} from '~/types/guestbook'
import { isAutoApproveEnabled } from './config'
import {
  DEFAULT_LIMIT,
  MAX_ENTRIES_PER_IP_PER_DAY,
  MAX_ENTRIES_PER_USER_PER_DAY,
} from './constants'
import { decodeCursor, encodeCursor } from './cursor'
import { toEntryDTO } from './mappers'
import type { CreateResult, GuestbookRow, RequestMeta } from './types'
import {
  looksLikeSpam,
  resolveDisplayName,
  validateMessage,
  validateSignature,
} from './validation'

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
            ? tx.json(
                signature.value as unknown as Parameters<typeof tx.json>[0],
              )
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
