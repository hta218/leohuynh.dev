import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [{ type: 'output', content: new Date().toLocaleString() }],
  }
}
