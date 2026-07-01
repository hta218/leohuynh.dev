export type Mode = 'easy' | 'medium' | 'hard'

export type Phase =
  | 'welcome'
  | 'mode-select'
  | 'playing'
  | 'level-cleared'
  | 'ending'
  | 'done'

/** A tile is identified by its solved index (`row * size + col`); `null` is the blank. */
export type Tile = number | null

/** Row-major grid of tiles; exactly one cell holds `null` (the blank). */
export type Board = Tile[]

export type SlideDirection = 'up' | 'down' | 'left' | 'right'

export interface LevelConfig {
  /** 1-based level number. */
  no: number
  /** Grid dimension (cols === rows). */
  size: number
  /** Board image, a public path. */
  image: string
  /** Looping music track, a public path (lazy-loaded when the level starts). */
  music: string
}

export interface RunStats {
  /** Total tiles moved across every level of the run. */
  moves: number
  /** Total elapsed play time in milliseconds. */
  elapsedMs: number
}
