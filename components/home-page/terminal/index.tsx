import { Container } from '~/components/ui/container'
import { Terminal } from './terminal'

export function TerminalHome() {
  return (
    <Container as="div" className="min-h-screen bg-white">
      <div className="py-8">
        <Terminal />
      </div>
    </Container>
  )
}
