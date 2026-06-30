import type { GuestbookSignature, GuestbookUser } from '~/types/guestbook'
import {
  DISPLAY_NAME_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  SIGNATURE_COORD_MAX,
  SIGNATURE_MAX_BYTES,
} from './constants'
import type { ValidationResult } from './types'

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
