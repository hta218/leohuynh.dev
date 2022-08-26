import { Twemoji } from '~/components'
import { siteMetadata } from '~/data'

export function Heading() {
  return (
    <h1 className="text-neutral-900 dark:text-neutral-200">
      I'm <span className="font-medium">{siteMetadata.fullName}</span> - an open-minded{' '}
      <span className="font-medium">Software Engineer</span> in{' '}
      <span className="font-medium hidden">Ha Noi, VN</span>
      <span className="align-middle flag-vn">
        <Twemoji emoji="flag-vietnam" />
      </span>
    </h1>
  )
}
