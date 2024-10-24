import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'

export function DiscussOnX({ postUrl }: { postUrl: string }) {
  return (
    <Link
      className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
      href={`https://x.com/search?q=${encodeURIComponent(postUrl)}`}
      rel="nofollow"
    >
      <GrowingUnderline data-umami-event="discuss-on-x">
        Discuss on <span className="font-semibold">X</span>
        <span className="hidden font-semibold md:inline"> (Twitter)</span>
      </GrowingUnderline>
    </Link>
  )
}
