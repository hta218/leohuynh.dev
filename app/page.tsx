import { Terminal } from '~/components/home-page/terminal'

export default function HomePage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center p-4">
      <div className="h-40" />
      <Terminal />
    </div>
  )
}
