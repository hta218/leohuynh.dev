import { Terminal } from './terminal'
import { Window } from './window'

export function TerminalHome() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      <Terminal />
    </div>
  )
}

// Export components for reuse
export { Terminal, Window }
