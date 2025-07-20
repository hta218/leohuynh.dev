import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'about leo huynh' },
      { type: 'output', content: '=================' },
      {
        type: 'output',
        content:
          'i started learning to code in 2016 and have been hooked ever since.',
      },
      {
        type: 'output',
        content: 'landed my first job as a python coding mentor in 2017.',
      },
      { type: 'output', content: 'passionate about:' },
      { type: 'output', content: '• javascript/typescript ecosystem' },
      { type: 'output', content: '• web development & modern frameworks' },
      { type: 'output', content: '• ecommerce & shopify development' },
      { type: 'output', content: '• building tools that help developers' },
      {
        type: 'output',
        content:
          'currently working on weaverse - the first hydrogen-driven website builder.',
      },
    ],
  }
}
