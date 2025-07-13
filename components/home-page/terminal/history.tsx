interface HistoryProps {
  commands: string[]
  onSelect: (command: string) => void
}

export function History({ commands, onSelect }: HistoryProps) {
  if (commands.length === 0) return null

  return (
    <div className="mt-2 space-y-1">
      <div className="text-xs text-gray-500">command history:</div>
      {commands.slice(-5).map((command, index) => (
        <div
          key={`${command}-${index}`}
          className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
          onClick={() => onSelect(command)}
        >
          {command}
        </div>
      ))}
    </div>
  )
}
