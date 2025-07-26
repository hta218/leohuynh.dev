import { COMMANDS } from '../commands'
import type { CommandResult, TerminalLine } from '../types'

export const execute = async (): Promise<CommandResult> => {
  let lines: TerminalLine[] = [{ type: 'info', content: 'available commands:' }]

  for (let cmd of COMMANDS) {
    // Add the main command description line
    lines.push({
      type: 'output',
      content: `  ${cmd.command.padEnd(12)} - ${cmd.description}`,
    })

    // Add aliases on a separate line if they exist
    if (cmd.aliases && cmd.aliases.length > 0) {
      let aliasesText = cmd.aliases.map((a) => `\`${a}\``).join(', ')
      lines.push({
        type: 'info',
        content: `${''.padEnd(16)} aliases: ${aliasesText}`,
      })
    }
  }

  lines.push({
    type: 'info',
    content:
      'tips: `tab` or `→` for autocomplete, `↑/↓` for cycling through suggestions/history',
  })

  return { lines }
}
