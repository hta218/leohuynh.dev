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
    <div className={clsx('flex flex-col gap-2', className)}>
      <Link
        className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
        href={`https://x.com/search?q=${encodeURIComponent(postUrl)}`}
        rel="nofollow"
      >
        <GrowingUnderline data-umami-event="discuss-on-x">
          Discuss on <span className="font-semibold">X</span>
          <span className="font-semibold"> (Twitter)</span>
        </GrowingUnderline>
      </Link>
      <Link
        className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
        href={`${SITE_METADATA.siteRepo}/blob/main/data/${filePath}?plain=1`}
      >
        <GrowingUnderline data-umami-event="view-on-github">
          Edit on <span className="font-semibold">GitHub</span>
        </GrowingUnderline>
      </Link>
    </div>
  )
}
