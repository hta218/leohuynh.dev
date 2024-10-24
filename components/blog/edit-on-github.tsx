import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { SITE_METADATA } from '~/data/site-metadata'

export function EditOnGithub({ filePath }: { filePath: string }) {
  return (
    <Link
      className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
      href={`${SITE_METADATA.siteRepo}/blob/main/data/${filePath}?plain=1`}
    >
      <GrowingUnderline data-umami-event="view-on-github">
        Edit on <span className="font-semibold">GitHub</span>
      </GrowingUnderline>
    </Link>
  )
}
