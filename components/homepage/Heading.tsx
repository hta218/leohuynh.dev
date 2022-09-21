import { Twemoji } from '~/components'
import { siteMetadata } from '~/data'

export function Heading() {
  return (
    <h1 className="text-neutral-900 dark:text-neutral-200">
      I'm <span className="font-medium">{siteMetadata.fullName}</span> - an open-minded{' '}
      <span className="font-medium">Cloud Architect</span> in{' '}
      <span className="font-medium hidden">Boston, MA</span>
      <span className="align-middle flag-usa">
        <Twemoji emoji="flag-usa" />
      </span>
    </h1>
  )
}
