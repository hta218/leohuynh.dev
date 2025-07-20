import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: "when i'm not coding" },
      { type: 'output', content: '===================' },
      {
        type: 'output',
        content: '🎵 listening to music (mostly indie, alternative rock)',
      },
      {
        type: 'output',
        content: '📚 reading tech books and sci-fi novels',
      },
      {
        type: 'output',
        content: '🎬 watching movies (sci-fi, thriller, drama)',
      },
      { type: 'output', content: '☕ exploring coffee shops in saigon' },
      { type: 'output', content: '🏃 jogging and staying active' },
      { type: 'output', content: '🎮 occasional gaming (strategy games)' },
    ],
  }
}
