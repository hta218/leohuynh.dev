import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'favorite quotes' },
      { type: 'output', content: '===============' },
      {
        type: 'output',
        content: `"i'm one of those weirdos who think the most rewarding things in life take effort`,
      },
      { type: 'info', content: '- a random one' },
      {
        type: 'output',
        content: `"a man who doesn't spend time with his family can never be a real man."`,
      },
      { type: 'info', content: '- mario puzo, the godfather' },
    ],
  }
}
