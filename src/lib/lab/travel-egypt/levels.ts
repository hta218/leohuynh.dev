import {
  ASSET_BASE,
  LARGE_GRID,
  LARGE_GRID_FROM_LEVEL,
  SMALL_GRID,
  TOTAL_LEVELS,
} from './constants'
import type { LevelConfig } from './types'

export const LEVELS: LevelConfig[] = Array.from(
  { length: TOTAL_LEVELS },
  (_, i): LevelConfig => {
    const no = i + 1
    return {
      no,
      size: no >= LARGE_GRID_FROM_LEVEL ? LARGE_GRID : SMALL_GRID,
      image: `${ASSET_BASE}/images/levels/${no}.jpg`,
      music: `${ASSET_BASE}/audio/levels/${no}.mp3`,
    }
  },
)

export function getLevel(no: number): LevelConfig {
  return LEVELS[no - 1]
}
