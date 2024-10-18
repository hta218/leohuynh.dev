import { clsx } from 'clsx'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { SITE_METADATA } from '~/data/site-metadata'

export function DiscussAndEdit({
  postUrl,
  filePath,
  className,
}: {
  postUrl: string
  filePath: string
  className?: string
}) {
  return (
    <div className={clsx('space-x-1', className)}>
      <Link href={`https://x.com/search?q=${encodeURIComponent(postUrl)}`} rel="nofollow">
        <GrowingUnderline data-umami-event="discuss-on-x">
          Discuss on <span className="font-semibold">X</span>
          <span className="font-semibold">(Twitter)</span>
        </GrowingUnderline>
      </Link>
      <span className="text-gray-400 dark:text-gray-400">|</span>
      <Link href={`${SITE_METADATA.siteRepo}/blob/main/data/${filePath}?plain=1`}>
        <GrowingUnderline data-umami-event="view-on-github">
          Edit on <span className="font-semibold">GitHub</span>
        </GrowingUnderline>
      </Link>
    </div>
  )
}
