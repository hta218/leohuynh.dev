'use client'

import { clsx } from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { BlogViewer } from './blog-viewer'
import { MOCK_BLOGS, executeCommand } from './command-executor'
import { COMMANDS } from './commands'
import { FontSelector } from './font-selector'
import { History } from './history'
import { Suggestion } from './suggestion'
import { ThemeSelector } from './theme-selector'
import type { Command, TerminalLine } from './types'

const ASCII_ART = `
██╗     ███████╗ ██████╗ ██╗  ██╗██╗   ██╗██╗   ██╗███╗   ██╗██╗  ██╗    ██████╗ ███████╗██╗   ██╗
██║     ██╔════╝██╔═══██╗██║  ██║██║   ██║╚██╗ ██╔╝████╗  ██║██║  ██║    ██╔══██╗██╔════╝██║   ██║
██║     █████╗  ██║   ██║███████║██║   ██║ ╚████╔╝ ██╔██╗ ██║███████║    ██║  ██║█████╗  ██║   ██║
██║     ██╔══╝  ██║   ██║██╔══██║██║   ██║  ╚██╔╝  ██║╚██╗██║██╔══██║    ██║  ██║██╔══╝  ╚██╗ ██╔╝
███████╗███████╗╚██████╔╝██║  ██║╚██████╔╝   ██║   ██║ ╚████║██║  ██║    ██████╔╝███████╗ ╚████╔╝ 
╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═══╝╚═╝  ╚═╝    ╚═════╝ ╚══════╝  ╚═══╝  
`

const WELCOME_TEXT = [
  "welcome to leo's interactive terminal!",
  "type 'help' to see available commands or start typing for suggestions.",
  '---',
]

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<Command[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [font, setFont] = useState('mono')
  const [theme, setTheme] = useState('solarized-light')
  const [currentBlog, setCurrentBlog] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Initialize terminal
  useEffect(() => {
    const initialLines: TerminalLine[] = [
      { type: 'ascii', content: ASCII_ART },
      ...WELCOME_TEXT.map((text) => ({ type: 'info' as const, content: text })),
    ]
    setLines(initialLines)
  }, [])

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Scroll to bottom when new lines are added
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo(0, terminalRef.current.scrollHeight)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines.length])

  // Handle input suggestions
  useEffect(() => {
    if (currentInput.trim() === '') {
      setShowSuggestions(false)
      return
    }

    const matchingCommands = COMMANDS.filter(
      (cmd) =>
        cmd.command.includes(currentInput.toLowerCase()) ||
        cmd.aliases?.some((alias) =>
          alias.includes(currentInput.toLowerCase()),
        ),
    )

    setSuggestions(matchingCommands)
    setShowSuggestions(matchingCommands.length > 0)
    setSelectedSuggestion(0)
  }, [currentInput])

  const executeCommandHandler = async (command: string) => {
    const trimmedCommand = command.trim().toLowerCase()

    // Add command to history
    if (trimmedCommand) {
      setCommandHistory((prev) => [...prev, trimmedCommand])
      setHistoryIndex(-1)
    }

    // Add command line to terminal
    setLines((prev) => [...prev, { type: 'command', content: `$ ${command}` }])

    // Execute command with blog opener callback
    const result = await executeCommand(trimmedCommand, (blogId: string) => {
      setCurrentBlog(blogId)
    })

    if (result.lines && result.lines.length > 0) {
      setLines((prev) => [...prev, ...result.lines])
    }

    if (result.clear) {
      setLines([
        { type: 'ascii', content: ASCII_ART },
        ...WELCOME_TEXT.map((text) => ({
          type: 'info' as const,
          content: text,
        })),
      ])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showSuggestions && suggestions[selectedSuggestion]) {
        // Use selected suggestion
        const selectedCmd = suggestions[selectedSuggestion]
        setCurrentInput(selectedCmd.command)
        setShowSuggestions(false)
        executeCommandHandler(selectedCmd.command)
      } else {
        // Execute current input
        executeCommandHandler(currentInput)
      }
      setCurrentInput('')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (showSuggestions && suggestions[selectedSuggestion]) {
        setCurrentInput(suggestions[selectedSuggestion].command)
        setShowSuggestions(false)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (showSuggestions) {
        setSelectedSuggestion((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        )
      } else if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (showSuggestions) {
        setSelectedSuggestion((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        )
      } else if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedSuggestion(0)
    }
  }

  const getFontClass = () => {
    switch (font) {
      case 'mono':
        return 'font-mono'
      case 'jetbrains':
        return 'font-jetbrains'
      case 'fira':
        return 'font-fira'
      case 'source':
        return 'font-source'
      default:
        return 'font-mono'
    }
  }

  const getThemeClasses = () => {
    switch (theme) {
      case 'solarized-light':
        return {
          bg: 'bg-orange-50',
          text: 'text-gray-800',
          prompt: 'text-green-600',
          command: 'text-blue-600',
          info: 'text-gray-600',
          error: 'text-red-600',
          accent: 'text-purple-600',
        }
      case 'solarized-dark':
        return {
          bg: 'bg-slate-900',
          text: 'text-orange-100',
          prompt: 'text-green-400',
          command: 'text-blue-400',
          info: 'text-gray-400',
          error: 'text-red-400',
          accent: 'text-purple-400',
        }
      case 'github-light':
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          prompt: 'text-green-500',
          command: 'text-blue-500',
          info: 'text-gray-600',
          error: 'text-red-500',
          accent: 'text-purple-500',
        }
      default:
        return {
          bg: 'bg-orange-50',
          text: 'text-gray-800',
          prompt: 'text-green-600',
          command: 'text-blue-600',
          info: 'text-gray-600',
          error: 'text-red-600',
          accent: 'text-purple-600',
        }
    }
  }

  const themeClasses = getThemeClasses()
  const currentBlogData = currentBlog
    ? MOCK_BLOGS.find((blog) => blog.id === currentBlog)
    : null

  return (
    <>
      {' '}
      <div
        className={clsx(
          'relative mx-auto w-full max-w-6xl rounded-lg border shadow-2xl',
          themeClasses.bg,
          getFontClass(),
        )}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <span
              className={clsx('ml-4 text-sm font-medium', themeClasses.text)}
            >
              leo@leohuynh.dev: ~
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FontSelector
              currentFont={font}
              onChange={setFont}
              theme={themeClasses}
            />
            <ThemeSelector currentTheme={theme} onChange={setTheme} />
          </div>
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="h-[60vh] min-h-[400px] overflow-y-auto p-4"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="space-y-1">
            {lines.map((line, index) => (
              <div key={`line-${index}-${line.type}`} className="relative">
                {line.type === 'ascii' && (
                  <pre
                    className={clsx(
                      'text-xs leading-tight font-mono overflow-x-auto whitespace-pre ascii-art',
                      themeClasses.accent,
                    )}
                    style={{
                      fontFamily:
                        'monospace, "Courier New", Courier, "Lucida Console", Monaco',
                      letterSpacing: '0',
                      fontVariantLigatures: 'none',
                    }}
                  >
                    {line.content}
                  </pre>
                )}
                {line.type === 'command' && (
                  <div className={themeClasses.command}>{line.content}</div>
                )}
                {line.type === 'output' && (
                  <div
                    className={clsx('whitespace-pre-wrap', themeClasses.text)}
                  >
                    {line.content}
                  </div>
                )}
                {line.type === 'info' && (
                  <div className={themeClasses.info}>{line.content}</div>
                )}
                {line.type === 'error' && (
                  <div className={themeClasses.error}>{line.content}</div>
                )}
                {line.type === 'component' && line.component}
              </div>
            ))}

            {/* Current Input Line */}
            <div className="flex items-center">
              <span className={clsx('mr-2', themeClasses.prompt)}>$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={clsx(
                  'flex-1 bg-transparent outline-none',
                  themeClasses.text,
                )}
                placeholder="type a command..."
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <Suggestion
                suggestions={suggestions}
                selectedIndex={selectedSuggestion}
                onSelect={(cmd) => {
                  setCurrentInput(cmd.command)
                  setShowSuggestions(false)
                  executeCommandHandler(cmd.command)
                }}
                theme={themeClasses}
              />
            )}
          </div>
        </div>
      </div>
      {/* Blog Viewer Modal */}
      {currentBlogData && (
        <BlogViewer
          post={{
            id: currentBlogData.id,
            title: currentBlogData.title,
            date: currentBlogData.date,
            content: currentBlogData.content,
            views: currentBlogData.views,
            tags: currentBlogData.tags,
          }}
          theme={themeClasses}
          onClose={() => setCurrentBlog(null)}
        />
      )}
    </>
  )
}
