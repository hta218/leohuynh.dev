/**
 * Personal notes pinned to a province, keyed by unit `id`. Kept in its own
 * client-safe module (no Node imports) so both the map island and the static
 * list can use it, and so the gody re-crawl of `json/places.json` never
 * overwrites them.
 */
export const PROVINCE_NOTES: Record<string, string> = {
  'son-la': '🌱 I was born here',
  'ha-noi': '🏠 Where I live',
}
