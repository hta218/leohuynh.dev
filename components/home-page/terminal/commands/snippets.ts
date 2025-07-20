import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'code snippets collection' },
      { type: 'output', content: '=======================' },
      {
        type: 'output',
        content: '• parse function from string - javascript utility',
      },
      {
        type: 'output',
        content: '• responsive image component - react/next.js',
      },
      {
        type: 'output',
        content: '• custom hooks collection - react utilities',
      },
      {
        type: 'output',
        content: '• shopify liquid filters - theme development',
      },
      {
        type: 'info',
        content: 'visit /snippets for the complete collection',
      },
    ],
  }
}
