import type { CSSProperties } from 'react'

/**
 * CSS background that slices tile `value`'s home cell out of the full board image
 * using the percentage-sprite trick: with `background-size` scaled to the whole
 * board, a position of `col/(size-1)` maps cleanly onto each column (and likewise
 * for rows). A single-cell board (never used here) falls back to the top-left.
 */
export function tileSprite(
  value: number,
  size: number,
  image: string,
): CSSProperties {
  const col = value % size
  const row = Math.floor(value / size)
  const span = size - 1
  return {
    backgroundImage: `url(${image})`,
    backgroundSize: `${size * 100}% ${size * 100}%`,
    backgroundPosition: span
      ? `${(col / span) * 100}% ${(row / span) * 100}%`
      : '0% 0%',
  }
}

/** Translate a tile to its current cell; combined with a CSS transition this animates slides. */
export function tileTransform(index: number, size: number): string {
  const col = index % size
  const row = Math.floor(index / size)
  return `translate(${col * 100}%, ${row * 100}%)`
}
