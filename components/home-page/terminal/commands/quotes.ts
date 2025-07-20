import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'favorite quotes' },
      { type: 'output', content: '===============' },
      {
        type: 'output',
        content: '"the best way to predict the future is to create it."',
      },
      { type: 'output', content: '- peter drucker' },
      {
        type: 'output',
        content:
          '"code is like humor. when you have to explain it, it\'s bad."',
      },
      { type: 'output', content: '- cory house' },
      {
        type: 'output',
        content: '"first, solve the problem. then, write the code."',
      },
      { type: 'output', content: '- john johnson' },
    ],
  }
}
