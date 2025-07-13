import type { Command, ThemeClasses } from './types'

interface SuggestionProps {
  suggestions: Command[]
  selectedIndex: number
  onSelect: (command: Command) => void
  theme: ThemeClasses
}

export function Suggestion({
  suggestions,
  selectedIndex,
  onSelect,
  theme,
}: SuggestionProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="mt-2 space-y-1">
      {suggestions.slice(0, 5).map((suggestion, index) => (
        <div
          key={suggestion.command}
          className={`cursor-pointer rounded px-2 py-1 text-sm ${
            index === selectedIndex
              ? 'bg-blue-100 dark:bg-blue-900'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => onSelect(suggestion)}
        >
          <div className="flex items-center justify-between">
            <span className={theme.text}>{suggestion.command}</span>
            <span className={`text-xs ${theme.info}`}>
              {suggestion.category}
            </span>
          </div>
          <div className={`text-xs ${theme.info}`}>
            {suggestion.description}
          </div>
          {suggestion.aliases && (
            <div className={`text-xs ${theme.info}`}>
              aliases: {suggestion.aliases.join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
