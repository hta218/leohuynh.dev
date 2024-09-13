import { MoveLeft } from 'lucide-react'
import Link from '../Link'

export function BackToPosts() {
  return (
    <Link href="/blog" className="background-underline flex w-fit gap-3">
      <MoveLeft strokeWidth={1} />
      <span>Back to the blog</span>
    </Link>
  )
}
