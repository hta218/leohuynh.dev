import {
  blankHomeIndex,
  findBlank,
  neighbors,
} from '~/lib/arcade/travel-egypt/board'
import { SLIDE_MS } from '~/lib/arcade/travel-egypt/constants'
import { cx } from '~/lib/arcade/travel-egypt/cx'
import { tileSprite, tileTransform } from '~/lib/arcade/travel-egypt/sprite'
import type { Board } from '~/lib/arcade/travel-egypt/types'

interface PuzzleBoardProps {
  board: Board
  size: number
  image: string
  interactive: boolean
  onTile: (index: number) => void
}

/**
 * Renders the sliding-puzzle grid as absolutely-positioned tiles. Tiles are emitted
 * in a *stable* order (ascending home value), never in board order, so a move only
 * changes each tile's `transform` — React never reorders the DOM nodes. Reordering
 * DOM nodes mid-move suppresses the CSS transition (notably on downward slides), so
 * a fixed order is what keeps the slide animation firing in every direction.
 */
export function PuzzleBoard({
  board,
  size,
  image,
  interactive,
  onTile,
}: PuzzleBoardProps) {
  const movable = interactive
    ? new Set(neighbors(findBlank(board), size))
    : new Set<number>()

  // Current cell index for each tile, keyed by its home value.
  const indexOfTile = new Array<number>(size * size)
  for (let i = 0; i < board.length; i++) {
    const value = board[i]
    if (value !== null) indexOfTile[value] = i
  }

  // Stable, ascending list of tile home values (all cells except the blank's home).
  const home = blankHomeIndex(size)
  const tiles: number[] = []
  for (let value = 0; value < size * size; value++) {
    if (value !== home) tiles.push(value)
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-135 overflow-hidden rounded-xl border border-line bg-[#ece5d6] shadow-[0_1px_0_rgba(255,255,255,0.6),0_18px_40px_-24px_rgba(15,23,42,0.5)]">
      {tiles.map((value) => {
        const index = indexOfTile[value]
        const isMovable = movable.has(index)
        return (
          <button
            key={value}
            type="button"
            aria-label={`Tile ${value + 1}`}
            disabled={!interactive}
            onClick={() => onTile(index)}
            className={cx(
              'absolute left-0 top-0 block border-0 p-0 outline-none',
              'shadow-[inset_0_0_0_1px_rgba(15,23,42,0.14)]',
              interactive && isMovable
                ? 'cursor-pointer hover:brightness-105 focus-visible:z-10 focus-visible:shadow-[inset_0_0_0_2px_rgba(15,23,42,0.85)]'
                : 'cursor-default',
            )}
            style={{
              width: `${100 / size}%`,
              height: `${100 / size}%`,
              transform: tileTransform(index, size),
              transition: `transform ${SLIDE_MS}ms ease`,
              ...tileSprite(value, size, image),
            }}
          />
        )
      })}
    </div>
  )
}
