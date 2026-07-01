/** Tiny class-name joiner (the codebase has no `cn`/`clsx`); drops falsy parts. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
