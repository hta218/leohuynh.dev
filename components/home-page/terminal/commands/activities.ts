import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'recent activities' },
      { type: 'output', content: '=================' },
      {
        type: 'output',
        content: '🎵 last played: "the scientist" by coldplay',
      },
      {
        type: 'output',
        content: '📚 currently reading: "the pragmatic programmer"',
      },
      {
        type: 'output',
        content: '🎬 last watched: "dune: part two" (2024)',
      },
      {
        type: 'output',
        content:
          '💻 last commit: "fix: terminal ui responsiveness" (2 hours ago)',
      },
      { type: 'output', content: '🔥 github streak: 42 days' },
      {
        type: 'info',
        content: 'data fetched from spotify, goodreads, imdb, and github apis',
      },
    ],
  }
}
