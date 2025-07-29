import { COMMANDS } from '../commands'
import type { CommandResult, TerminalLine } from '../types'

// Table column sizes
const COMMAND_WIDTH = 20
const DESCRIPTION_WIDTH = 50
const ALIASES_WIDTH = 20

export const execute = async (): Promise<CommandResult> => {
  let lines: TerminalLine[] = [
    { type: 'info', content: 'available commands:' },
    { type: 'output', content: '' },
  ]

  // Add table header
  lines.push({
    type: 'output',
    content: `${'COMMAND'.padEnd(COMMAND_WIDTH)} ${'DESCRIPTION'.padEnd(DESCRIPTION_WIDTH)} ALIASES`,
  })

  // Add separator line
  lines.push({
    type: 'output',
    content: `${'─'.repeat(COMMAND_WIDTH)} ${'─'.repeat(DESCRIPTION_WIDTH)} ${'─'.repeat(ALIASES_WIDTH)}`,
  })

  for (let cmd of COMMANDS) {
    let aliasesText =
      cmd.aliases && cmd.aliases.length > 0
        ? cmd.aliases.map((a) => `${a}`).join(', ')
        : ''

    lines.push({
      type: 'output',
      content: `${cmd.command.padEnd(COMMAND_WIDTH)} ${cmd.description.padEnd(DESCRIPTION_WIDTH)} ${aliasesText}`,
    })
  }

  lines.push(
    { type: 'output', content: '' },
    {
      type: 'info',
      content:
        'tips: `tab` or `→` for autocomplete, `↑/↓` for cycling through suggestions/history',
    },
  )

  return { lines }
}
