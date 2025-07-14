import { Terminal } from './terminal'
import { Window } from './window'

export function TerminalHome() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <Terminal />
    </div>
  )
}

// Export components for reuse
export { Terminal, Window }
