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
███████╗███████╗╚██████╔╝██║  ██║╚██████╔╝   ██║   ██║ ╚████║██║  ██║ ██╗██████╔╝███████╗ ╚████╔╝ 
╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═╝╚═════╝ ╚══════╝  ╚═══╝  
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

  // Terminal resizing state
  const [terminalSize, setTerminalSize] = useState({ width: 1200, height: 600 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string>('')

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Handle terminal resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const minWidth = 600
      const minHeight = 400
      const maxWidth = window.innerWidth - 100
      const maxHeight = window.innerHeight - 100

      let newWidth = terminalSize.width
      let newHeight = terminalSize.height

      if (resizeDirection.includes('right')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - rect.left))
      }
      if (resizeDirection.includes('left')) {
        newWidth = Math.max(
          minWidth,
          Math.min(maxWidth, rect.right - e.clientX),
        )
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(
          minHeight,
          Math.min(maxHeight, e.clientY - rect.top),
        )
      }
      if (resizeDirection.includes('top')) {
        newHeight = Math.max(
          minHeight,
          Math.min(maxHeight, rect.bottom - e.clientY),
        )
      }

      setTerminalSize({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeDirection('')
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = getResizeCursor(resizeDirection)
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeDirection, terminalSize])

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

  const getResizeCursor = (direction: string) => {
    switch (direction) {
      case 'right':
      case 'left':
        return 'ew-resize'
      case 'bottom':
      case 'top':
        return 'ns-resize'
      case 'bottom-right':
      case 'top-left':
        return 'nw-resize'
      case 'bottom-left':
      case 'top-right':
        return 'ne-resize'
      default:
        return 'default'
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
      <div
        ref={containerRef}
        className={clsx(
          'terminal-container relative mx-auto rounded-lg border shadow-2xl',
          themeClasses.bg,
          getFontClass(),
        )}
        style={{
          width: `${terminalSize.width}px`,
          height: `${terminalSize.height}px`,
          maxWidth: '95vw',
          maxHeight: '90vh',
        }}
        onMouseMove={(e) => {
          if (isResizing) return

          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const edgeThreshold = 10

          let cursor = 'default'
          let direction = ''

          // Check edges
          const nearRight = x >= rect.width - edgeThreshold
          const nearBottom = y >= rect.height - edgeThreshold

          if (nearRight && nearBottom) {
            cursor = 'nw-resize'
            direction = 'bottom-right'
          } else if (nearRight) {
            cursor = 'ew-resize'
            direction = 'right'
          } else if (nearBottom) {
            cursor = 'ns-resize'
            direction = 'bottom'
          }

          e.currentTarget.style.cursor = cursor
        }}
        onMouseLeave={(e) => {
          if (!isResizing) {
            e.currentTarget.style.cursor = 'default'
          }
        }}
        onMouseDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const edgeThreshold = 10

          let direction = ''
          const nearRight = x >= rect.width - edgeThreshold
          const nearBottom = y >= rect.height - edgeThreshold

          if (nearRight && nearBottom) {
            direction = 'bottom-right'
          } else if (nearRight) {
            direction = 'right'
          } else if (nearBottom) {
            direction = 'bottom'
          }

          if (direction) {
            e.preventDefault()
            setIsResizing(true)
            setResizeDirection(direction)
          }
        }}
      >
        {/* Resize indicator in bottom-right corner */}
        <div className="absolute bottom-1 right-1 w-3 h-3 opacity-40 pointer-events-none">
          <svg
            viewBox="0 0 12 12"
            className={clsx('w-full h-full', themeClasses.text)}
            fill="currentColor"
            aria-label="Resize terminal"
          >
            <title>Resize terminal</title>
            <path d="M12 0v12L0 12z" opacity="0.15" />
            <path d="M8 4v8L4 8z" opacity="0.4" />
            <path d="M12 4v8L8 8z" opacity="0.6" />
            <path d="M8 0v4L4 4z" opacity="0.4" />
            <path d="M12 0v4L8 4z" opacity="0.8" />
          </svg>
        </div>

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
          className="overflow-y-auto p-4"
          style={{ height: `${terminalSize.height - 60}px` }}
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
