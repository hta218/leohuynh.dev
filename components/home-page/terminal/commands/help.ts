import { COMMANDS } from '../commands'
import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'info', content: 'available commands:' },
      ...COMMANDS.map((cmd) => ({
        type: 'output' as const,
        content: `  ${cmd.command.padEnd(12)} - ${cmd.description}${cmd.aliases ? ` (${cmd.aliases.map((a) => `\`${a}\``).join(', ')})` : ''}`,
      })),
      {
        type: 'info',
        content:
          'tips: `tab` or `→` for autocomplete, `↑/↓` for cycling through suggestions/history',
      },
    ],
  }
}
