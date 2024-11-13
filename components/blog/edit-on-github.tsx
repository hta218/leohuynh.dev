import { Link } from '~/components/ui/link'
import { SITE_METADATA } from '~/data/site-metadata'

export function EditOnGithub({ filePath }: { filePath: string }) {
  return (
    <Link
      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
      href={`${SITE_METADATA.siteRepo}/blob/main/data/${filePath}?plain=1`}
    >
      <span data-umami-event="edit-on-github">
        Edit on <span className="font-semibold">GitHub</span>
      </span>
    </Link>
  )
}
