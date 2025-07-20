'use client'

import { useEffect, useRef, useState } from 'react'
import { AsciiArtText } from './ascii-art-text'
import { ASCII_ART, COMMANDS, WELCOME_TEXT, executeCommand } from './commands'
import { MOCK_BLOGS } from './commands/blogs'
import type { TerminalLine } from './types'
import { Window } from './window'

const DEFAULT_LINES: TerminalLine[] = [
  { type: 'ascii', content: ASCII_ART },
  ...WELCOME_TEXT.map((text) => ({ type: 'info' as const, content: text })),
]

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>(DEFAULT_LINES)
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [currentBlog, setCurrentBlog] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Calculate suggestions - simple derived state
  const suggestions =
    currentInput.trim() === ''
      ? []
      : COMMANDS.filter(
          (cmd) =>
            cmd.command.startsWith(currentInput.toLowerCase()) ||
            cmd.aliases?.some((alias) =>
              alias.startsWith(currentInput.toLowerCase()),
            ),
        )

  // Calculate ghost text using suggestions - simple derived state
  let ghostText = ''
  if (suggestions.length > 0 && selectedSuggestion < suggestions.length) {
    const selectedMatch = suggestions[selectedSuggestion]
    const matchingCommand = selectedMatch.command.startsWith(
      currentInput.toLowerCase(),
    )
      ? selectedMatch.command
      : selectedMatch.aliases?.find((alias) =>
          alias.startsWith(currentInput.toLowerCase()),
        ) || selectedMatch.command

    // Only show ghost text if there's more to complete
    if (matchingCommand.length > currentInput.length) {
      ghostText = matchingCommand.slice(currentInput.length)
    }
  }

  const showSuggestions = suggestions.length > 0

  // Reset selected suggestion when input changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to reset when currentInput changes
  useEffect(() => {
    setSelectedSuggestion(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInput])

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Global keydown listener to handle typing from anywhere
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in a different input/textarea
      const target = e.target as HTMLElement
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') &&
        target !== inputRef.current
      ) {
        return
      }

      // Check if user is typing a character (not control keys)
      const isCharacterKey =
        e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey

      if (isCharacterKey) {
        // Focus input and scroll to bottom when user starts typing
        inputRef.current?.focus()
        scrollToBottom()
      }
    }

    // Add global event listener
    window.addEventListener('keydown', handleGlobalKeyDown)

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [])

  // Scroll to bottom when new lines are added
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo(0, terminalRef.current.scrollHeight)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines.length])

  // Function to scroll to bottom
  function scrollToBottom() {
    if (terminalRef.current) {
      terminalRef.current.scrollTo(0, terminalRef.current.scrollHeight)
    }
  }

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

    if (
      result.lines &&
      Array.isArray(result.lines) &&
      result.lines.length > 0
    ) {
      setLines((prev) => [
        ...prev,
        ...(result.lines as TerminalLine[]),
        { type: 'output', content: '' }, // Add empty line after command output
      ])
    } else {
      // Add empty line even if there's no output
      setLines((prev) => [...prev, { type: 'output', content: '' }])
    }

    if (result.clear) {
      setLines(DEFAULT_LINES)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showSuggestions && suggestions[selectedSuggestion]) {
        // Use selected suggestion
        const selectedCmd = suggestions[selectedSuggestion]
        setCurrentInput(selectedCmd.command)
        executeCommandHandler(selectedCmd.command)
      } else {
        // Execute current input
        executeCommandHandler(currentInput)
      }
      setCurrentInput('')
    } else if (e.key === 'Tab' || e.key === 'ArrowRight') {
      e.preventDefault()
      if (ghostText) {
        // Accept ghost text completion
        setCurrentInput(currentInput + ghostText)
      } else if (showSuggestions && suggestions[selectedSuggestion]) {
        // Fallback to suggestion if no ghost text
        setCurrentInput(suggestions[selectedSuggestion].command)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (showSuggestions) {
        const newIndex =
          selectedSuggestion > 0
            ? selectedSuggestion - 1
            : suggestions.length - 1
        setSelectedSuggestion(newIndex)
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
        const newIndex =
          selectedSuggestion < suggestions.length - 1
            ? selectedSuggestion + 1
            : 0
        setSelectedSuggestion(newIndex)
      } else if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    } else if (e.key === 'Escape') {
      setSelectedSuggestion(0)
    }
  }

  const currentBlogData = currentBlog
    ? MOCK_BLOGS.find((blog) => blog.id === currentBlog)
    : null

  return (
    <>
      <Window defaultWidth={1200} defaultHeight={800}>
        <div ref={terminalRef} className="overflow-y-auto p-4 h-full">
          <div className="space-y-1">
            {lines.map(({ type, content, component: Component }, idx) => (
              <div key={`line-${idx}-${type}`} className="relative">
                {type === 'ascii' && (
                  <AsciiArtText data-terminal-accent>{content}</AsciiArtText>
                )}
                {type === 'command' && (
                  <div data-terminal-command>{content}</div>
                )}
                {type === 'output' && (
                  <div className="whitespace-pre-wrap min-h-3">{content}</div>
                )}
                {type === 'info' && <div data-terminal-info>{content}</div>}
                {type === 'error' && <div data-terminal-error>{content}</div>}
                {type === 'component' && Component && <Component />}
              </div>
            ))}

            {/* Current Input Line */}
            <div className="flex items-center pt-1">
              <span data-terminal-prompt className="mr-2.5">
                $
              </span>
              <div className="flex-1 relative">
                {/* Input with ghost text overlay */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent outline-none relative z-10"
                    placeholder="type a command..."
                    autoComplete="off"
                    spellCheck={false}
                  />

                  {/* Ghost text overlay */}
                  {ghostText && (
                    <div className="absolute top-0 left-0 w-full pointer-events-none z-0 opacity-40">
                      <span className="invisible">{currentInput}</span>
                      <span>{ghostText}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Window>

      {/* Blog Viewer Modal */}
      {/* {currentBlogData && (
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
      )} */}
    </>
  )
}
