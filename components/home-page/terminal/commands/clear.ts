import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return { clear: true }
}
