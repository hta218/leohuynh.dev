/**
 * Emoji-name → Unicode codepoint map, ported from the legacy `css/twemoji.css`
 * (which mapped each name to a Twemoji SVG by codepoint). Instead of fetching
 * remote SVG assets, v4 renders the real Unicode glyph — non-breaking, zero
 * network cost, and visually consistent with native emoji.
 *
 * Codepoint strings keep the legacy `-` separator for multi-codepoint sequences
 * (ZWJ, skin tone, keycaps, variation selectors), e.g. `1f486-200d-2642-fe0f`.
 */
const EMOJI_CODEPOINTS: Record<string, string> = {
  'grinning-squinting-face': '1f606',
  'lying-face': '1f925',
  'sneezing-face': '1f927',
  'loudly-crying-face': '1f62d',
  'face-with-steam-from-nose': '1f624',
  'beaming-face-with-smiling-eyes': '1f601',
  'cat-with-tears-of-joy': '1f639',
  'star-struck': '1f929',
  eyes: '1f440',
  'check-mark-button': '2705',
  warning: '26a0',
  'light-bulb': '1f4a1',
  'grinning-face-with-sweat': '1f605',
  'grinning-face-with-big-eyes': '1f603',
  'face-with-tears-of-joy': '1f602',
  'smiling-face-with-sunglasses': '1f60e',
  'waving-hand': '1f44b',
  'desktop-computer': '1f5a5',
  laptop: '1f4bb',
  'party-popper': '1f389',
  sparkles: '2728',
  'astonished-face': '1f632',
  'smiling-face-with-tear': '1f972',
  'backhand-index-pointing-down': '1f447',
  'folded-hands': '1f64f',
  'glowing-star': '1f31f',
  'thinking-face': '1f914',
  'thumbs-up': '1f44d',
  'thumbs-down': '1f44e',
  'clapping-hands': '1f44f',
  'writing-hand': '270d',
  star: '2b50',
  'pig-face': '1f437',
  baby: '1f476',
  'chart-increasing': '1f4c8',
  rocket: '1f680',
  'man-getting-massage': '1f486-200d-2642-fe0f',
  'delivery-truck': '1f69a',
  'man-construction-worker-medium-light-skin-tone':
    '1f477-1f3fc-200d-2642-fe0f',
  'see-no-evil-monkey': '1f648',
  'hear-no-evil-monkey': '1f649',
  'smiling-face-with-heart-eyes': '1f60d',
  'sparkling-heart': '1f496',
  'man-swimming': '1f3ca-200d-2642-fe0f',
  house: '1f3e0',
  'money-with-wings': '1f4b8',
  'magnifying-glass-tilted-right': '1f50e',
  stopwatch: '23f1-fe0f',
  'hourglass-not-done': '23f3',
  calendar: '1f4c5',
  'cross-mark': '274c',
  'clinking-beer-mugs': '1f37b',
  'beer-mug': '1f37a',
  'partying-face': '1f973',
  'exploding-head': '1f92f',
  'flexed-biceps': '1f4aa',
  'keycap-1': '31-20e3',
  'keycap-2': '32-20e3',
  'keycap-3': '33-20e3',
  'keycap-4': '34-20e3',
  'keycap-5': '35-20e3',
  'keycap-6': '36-20e3',
  owl: '1f989',
  'face-with-symbols-on-mouth': '1f92c',
  'flag-vietnam': '1f1fb-1f1f3',
  'hammer-and-wrench': '1f6e0',
  'face-with-monocle': '1f9d0',
  briefcase: '1f4bc',
  dna: '1f9ec',
  memo: '1f4dd',
  'video-game': '1f3ae',
  'soccer-ball': '26bd',
  volleyball: '1f3d0',
  'ping-pong': '1f3d3',
  dog: '1f415',
  guitar: '1f3b8',
  eye: '1f441',
  'man-technologist': '1f468-200d-1f4bb',
  'man-student': '1f468-200d-1f393',
  'inbox-tray': '1f4e5',
  guard: '1f482',
  'man-shrugging': '1f937-200d-2642-fe0f',
  'face-with-rolling-eyes': '1f644',
  'atom-symbol': '269b',
  'musical-keyboard': '1f3b9',
  'chess-pawn': '265f',
  'bar-chart': '1f4ca',
  'open-book': '1f4d6',
  'page-facing-up': '1f4c4',
  'spiral-notepad': '1f5d2',
  books: '1f4da',
  label: '1f3f7',
  'clapper-board': '1f3ac',
  'billed-cap': '1f9e2',
  'movie-camera': '1f3a5',
  'film-frames': '1f39e',
  glasses: '1f453',
  'sports-medal': '1f3c5',
  popcorn: '1f37f',
  'man-gesturing-no': '1f645-200d-2642-fe0f',
  'hundred-points': '1f4af',
  television: '1f4fa',
  'three-o-clock': '1f552',
  'love-you-gesture': '1f91f',
  'magic-wand': '1fa84',
  bullseye: '1f3af',
  robot: '1f916',
  'artist-palette': '1f3a8',
  'safety-vest': '1f9ba',
  'card-file-box': '1f5c3',
  'building-construction': '1f3d7',
  'first-quarter-moon': '1f313',
  'party popper': '1f389',
}

/** Convert a hyphen-separated codepoint string into its Unicode glyph. */
function codepointsToGlyph(codepoints: string): string {
  return codepoints
    .split('-')
    .map((cp) => String.fromCodePoint(Number.parseInt(cp, 16)))
    .join('')
}

function normalizeTwemojiCodepoint(codepoint: string): string {
  // Twemoji's SVG filenames omit U+FE0F for standalone emoji like stopwatch.
  return codepoint === '23f1-fe0f' ? '23f1' : codepoint
}

/**
 * Resolve an emoji name to a local Twemoji SVG filename stem.
 */
export function emojiCodepoint(name: string): string {
  const cp = EMOJI_CODEPOINTS[name]
  return cp ? normalizeTwemojiCodepoint(cp) : ''
}

/**
 * Resolve an emoji name to its Unicode glyph. Kept as a fallback/utility for places
 * where plain text is preferable to an image.
 */
export function emojiGlyph(name: string): string {
  const cp = EMOJI_CODEPOINTS[name]
  return cp ? codepointsToGlyph(cp) : ''
}
