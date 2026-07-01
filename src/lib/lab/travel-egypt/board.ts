import type { Board, SlideDirection } from './types'

/**
 * The blank's home cell is the bottom-left corner (row `size-1`, col 0), matching
 * the original game where the missing tile sits at the lower-left of the picture.
 */
export function blankHomeIndex(size: number): number {
  return (size - 1) * size
}

/** The solved board: every cell holds its own index, except the blank home (null). */
export function createSolvedBoard(size: number): Board {
  const home = blankHomeIndex(size)
  return Array.from({ length: size * size }, (_, i) => (i === home ? null : i))
}

export function findBlank(board: Board): number {
  return board.indexOf(null)
}

/** Orthogonal neighbours of `index` on a size×size grid. */
export function neighbors(index: number, size: number): number[] {
  const row = Math.floor(index / size)
  const col = index % size
  const out: number[] = []
  if (row > 0) out.push(index - size)
  if (row < size - 1) out.push(index + size)
  if (col > 0) out.push(index - 1)
  if (col < size - 1) out.push(index + 1)
  return out
}

/** A tile can move only if it is orthogonally adjacent to the blank. */
export function canMove(board: Board, index: number, size: number): boolean {
  return neighbors(findBlank(board), size).includes(index)
}

/**
 * Slide the tile at `index` into the blank, returning a new board. If the move is
 * illegal the same board reference is returned unchanged.
 */
export function slide(board: Board, index: number, size: number): Board {
  const blank = findBlank(board)
  if (!neighbors(blank, size).includes(index)) return board
  const next = board.slice()
  next[blank] = board[index]
  next[index] = null
  return next
}

/**
 * The tile that an arrow key should slide, or `null` if that move is illegal.
 * The direction is the way the tile travels, e.g. `right` slides the tile on the
 * blank's left edge rightwards into it.
 */
export function tileForDirection(
  board: Board,
  direction: SlideDirection,
  size: number,
): number | null {
  const blank = findBlank(board)
  const row = Math.floor(blank / size)
  const col = blank % size
  switch (direction) {
    case 'up':
      return row < size - 1 ? blank + size : null
    case 'down':
      return row > 0 ? blank - size : null
    case 'left':
      return col < size - 1 ? blank + 1 : null
    case 'right':
      return col > 0 ? blank - 1 : null
  }
}

/** Win when every tile sits on its home cell (which also puts the blank home). */
export function isWin(board: Board): boolean {
  return board.every((tile, i) => tile === null || tile === i)
}

/**
 * Shuffle by performing `moves` random adjacent slides from the solved board.
 * This guarantees a solvable arrangement (mirrors the original `set_blocks_pos`).
 * Immediate backtracking is avoided so tiles actually travel, and a solved result
 * is reshuffled so the player never starts on a finished board.
 */
export function shuffleBoard(size: number, moves: number): Board {
  let board = createSolvedBoard(size)
  let blank = findBlank(board)
  let previousBlank = -1
  for (let m = 0; m < moves; m++) {
    const options = neighbors(blank, size).filter((n) => n !== previousBlank)
    const pick = options[Math.floor(Math.random() * options.length)]
    board = slide(board, pick, size)
    previousBlank = blank
    blank = pick
  }
  return isWin(board) ? shuffleBoard(size, moves) : board
}
