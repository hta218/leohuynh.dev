import type { GuestbookEntry, GuestbookStatus } from '~/types/guestbook'

export interface GuestbookRow {
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

export interface RequestMeta {
  ipHash: string | null
  userAgentHash: string | null
  nowSeconds: number
}

export interface Cursor {
  createdAt: string
  id: string
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string }

export type CreateResult =
  | { ok: true; entry: GuestbookEntry; status: 'approved' | 'pending' }
  | { ok: false; status: 400 | 429; message: string }
