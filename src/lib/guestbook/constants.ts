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
