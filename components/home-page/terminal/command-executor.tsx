import { COMMANDS } from './commands'
import { execute as executeAboutCommand } from './commands/about'
import { execute as executeActivitiesCommand } from './commands/activities'
import { execute as executeBlogsCommand } from './commands/blogs'
import { execute as executeClearCommand } from './commands/clear'
import { execute as executeHelpCommand } from './commands/help'
import { execute as executeHobbiesCommand } from './commands/hobbies'
import { execute as executeMusicCommand } from './commands/music'
import { execute as executeProjectsCommand } from './commands/projects'
import { execute as executePwdCommand } from './commands/pwd'
import { execute as executeQuotesCommand } from './commands/quotes'
import { execute as executeReadCommand } from './commands/read'
import { execute as executeSkillsCommand } from './commands/skills'
import { execute as executeSnippetsCommand } from './commands/snippets'
import { execute as executeDateCommand } from './commands/time'
import { execute as executeWhoamiCommand } from './commands/whoami'
import type { CommandResult } from './types'

export async function executeCommand(
  command: string,
  openBlog?: (blogId: string) => void,
): Promise<CommandResult> {
  const cmd = command.toLowerCase().trim()

  // Find command by name or alias
  const foundCommand = COMMANDS.find(
    (c) => c.command === cmd || c.aliases?.includes(cmd),
  )

  switch (foundCommand?.command || cmd) {
    case 'help':
      return executeHelpCommand()

    case 'whoami':
      return executeWhoamiCommand()

    case 'about':
      return executeAboutCommand()

    case 'skills':
      return executeSkillsCommand()

    case 'projects':
      return executeProjectsCommand()

    case 'blogs':
      return executeBlogsCommand()

    case 'snippets':
      return executeSnippetsCommand()

    case 'activities':
      return executeActivitiesCommand()

    case 'hobbies':
      return executeHobbiesCommand()

    case 'quotes':
      return executeQuotesCommand()

    case 'music':
      return executeMusicCommand()

    case 'clear':
      return executeClearCommand()

    case 'pwd':
      return executePwdCommand()

    case 'date':
      return executeDateCommand()

    default:
      // Check if it's a "read" command
      if (cmd.startsWith('read ')) {
        const blogNum = Number.parseInt(cmd.split(' ')[1])
        return executeReadCommand(blogNum, openBlog)
      }

      return {
        lines: [
          { type: 'error', content: `command not found: ${cmd}` },
          {
            type: 'info',
            content: "type 'help' or '?' to see available commands",
          },
        ],
      }
  }
}
