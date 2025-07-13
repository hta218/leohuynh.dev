export interface Command {
  command: string
  aliases?: string[]
  description: string
  category: 'info' | 'data' | 'system' | 'fun'
}

export interface TerminalLine {
  type: 'command' | 'output' | 'info' | 'error' | 'ascii' | 'component'
  content?: string
  component?: React.ReactNode
}

export interface CommandResult {
  lines?: TerminalLine[]
  clear?: boolean
}

export interface ThemeClasses {
  bg: string
  text: string
  prompt: string
  command: string
  info: string
  error: string
  accent: string
}
