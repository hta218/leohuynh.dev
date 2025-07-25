import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'about me' },
      { type: 'output', content: '=================' },
      { type: 'output', content: 'background:' },
      {
        type: 'output',
        content:
          '• i learned pascal as my first programming language when i was in high school.',
      },
      {
        type: 'output',
        content:
          '• i wrote my first line of C/C++ code in 2016 and have been hooked ever since.',
      },
      {
        type: 'output',
        content: '• landed my first job as a python coding mentor in 2017.',
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
