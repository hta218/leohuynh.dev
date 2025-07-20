import { PROJECTS } from '~/data/projects'
import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'featured projects' },
      { type: 'output', content: '=================' },
      ...PROJECTS.slice(0, 5).flatMap((project, index) => [
        {
          type: 'output' as const,
          content: `${index + 1}. ${project.title}`,
        },
        { type: 'output' as const, content: `   ${project.description}` },
        {
          type: 'output' as const,
          content: `   built with: ${project.builtWith?.join(', ') || 'various technologies'}`,
        },
        ...(project.url
          ? [
              {
                type: 'output' as const,
                content: `   link: ${project.url}`,
              },
            ]
          : []),
        { type: 'output' as const, content: '' },
      ]),
      { type: 'info', content: 'visit /projects for the complete list' },
    ],
  }
}
