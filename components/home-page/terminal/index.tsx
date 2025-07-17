'use client'

import { useEffect, useRef, useState } from 'react'
import { AsciiArtText } from './ascii-art-text'
import { MOCK_BLOGS, executeCommand } from './command-executor'
import { ASCII_ART, COMMANDS, WELCOME_TEXT } from './commands'
import type { Command, TerminalLine } from './types'
import { Window } from './window'

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<Command[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [ghostText, setGhostText] = useState('')
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

  // Handle input suggestions and ghost text
  useEffect(() => {
    if (currentInput.trim() === '') {
      setShowSuggestions(false)
      setGhostText('')
      return
    }

    const matchingCommands = COMMANDS.filter(
      (cmd) =>
        cmd.command.startsWith(currentInput.toLowerCase()) ||
        cmd.aliases?.some((alias) =>
          alias.startsWith(currentInput.toLowerCase()),
        ),
    )

    setSuggestions(matchingCommands)
    setShowSuggestions(matchingCommands.length > 0)
    setSelectedSuggestion(0)

    // Set ghost text for the best match
    if (matchingCommands.length > 0) {
      const bestMatch = matchingCommands[0]
      const matchingCommand = bestMatch.command.startsWith(
        currentInput.toLowerCase(),
      )
        ? bestMatch.command
        : bestMatch.aliases?.find((alias) =>
            alias.startsWith(currentInput.toLowerCase()),
          ) || bestMatch.command

      // Only show ghost text if there's more to complete
      if (matchingCommand.length > currentInput.length) {
        setGhostText(matchingCommand.slice(currentInput.length))
      } else {
        setGhostText('')
      }
    } else {
      setGhostText('')
    }
  }, [currentInput])

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo(0, terminalRef.current.scrollHeight)
    }
  }

  // Function to check if input is visible
  const isInputVisible = () => {
    if (!terminalRef.current || !inputRef.current) return false

    const terminalRect = terminalRef.current.getBoundingClientRect()
    const inputRect = inputRef.current.getBoundingClientRect()

    // Check if input is within the visible area of the terminal
    return (
      inputRect.bottom <= terminalRect.bottom &&
      inputRect.top >= terminalRect.top
    )
  }

  // Handle terminal click
  const handleTerminalClick = () => {
    if (isInputVisible()) {
      inputRef.current?.focus()
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
      setLines((prev) => [...prev, ...(result.lines as TerminalLine[])])
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
        setGhostText('')
        executeCommandHandler(selectedCmd.command)
      } else {
        // Execute current input
        executeCommandHandler(currentInput)
      }
      setCurrentInput('')
      setGhostText('')
    } else if (e.key === 'Tab' || e.key === 'ArrowRight') {
      e.preventDefault()
      if (ghostText) {
        // Accept ghost text completion
        setCurrentInput(currentInput + ghostText)
        setGhostText('')
      } else if (showSuggestions && suggestions[selectedSuggestion]) {
        // Fallback to suggestion if no ghost text
        setCurrentInput(suggestions[selectedSuggestion].command)
        setShowSuggestions(false)
        setGhostText('')
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (showSuggestions) {
        const newIndex =
          selectedSuggestion > 0
            ? selectedSuggestion - 1
            : suggestions.length - 1
        setSelectedSuggestion(newIndex)

        // Update ghost text for new selection
        const selectedCmd = suggestions[newIndex]
        const matchingCommand = selectedCmd.command.startsWith(
          currentInput.toLowerCase(),
        )
          ? selectedCmd.command
          : selectedCmd.aliases?.find((alias) =>
              alias.startsWith(currentInput.toLowerCase()),
            ) || selectedCmd.command

        if (matchingCommand.length > currentInput.length) {
          setGhostText(matchingCommand.slice(currentInput.length))
        } else {
          setGhostText('')
        }
      } else if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
          setGhostText('')
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

        // Update ghost text for new selection
        const selectedCmd = suggestions[newIndex]
        const matchingCommand = selectedCmd.command.startsWith(
          currentInput.toLowerCase(),
        )
          ? selectedCmd.command
          : selectedCmd.aliases?.find((alias) =>
              alias.startsWith(currentInput.toLowerCase()),
            ) || selectedCmd.command

        if (matchingCommand.length > currentInput.length) {
          setGhostText(matchingCommand.slice(currentInput.length))
        } else {
          setGhostText('')
        }
      } else if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
        setGhostText('')
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentInput('')
        setGhostText('')
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedSuggestion(0)
      setGhostText('')
    }
  }

  const currentBlogData = currentBlog
    ? MOCK_BLOGS.find((blog) => blog.id === currentBlog)
    : null

  return (
    <>
      <Window
        title="leo@leohuynh.dev: ~"
        defaultWidth={1200}
        defaultHeight={800}
      >
        <div
          ref={terminalRef}
          className="overflow-y-auto p-4 h-full"
          onClick={handleTerminalClick}
        >
          <div className="space-y-1">
            {lines.map((line, index) => (
              <div key={`line-${index}-${line.type}`} className="relative">
                {line.type === 'ascii' && (
                  <AsciiArtText data-terminal-accent>
                    {line.content}
                  </AsciiArtText>
                )}
                {line.type === 'command' && (
                  <div data-terminal-command>{line.content}</div>
                )}
                {line.type === 'output' && (
                  <div data-terminal-text className="whitespace-pre-wrap">
                    {line.content}
                  </div>
                )}
                {line.type === 'info' && (
                  <div data-terminal-info>{line.content}</div>
                )}
                {line.type === 'error' && (
                  <div data-terminal-error>{line.content}</div>
                )}
                {line.type === 'component' && line.component}
              </div>
            ))}

            {/* Current Input Line */}
            <div className="flex items-center">
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
                    data-terminal-text
                    placeholder="type a command..."
                    autoComplete="off"
                    spellCheck={false}
                  />

                  {/* Ghost text overlay */}
                  {ghostText && (
                    <div
                      data-terminal-text
                      className="absolute top-0 left-0 w-full pointer-events-none z-0 opacity-40"
                    >
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
