import { clsx } from 'clsx'

type BannerInfoProps = {
  photoURL?: string
  author?: string
  className?: string
}

export function BannerInfo({ photoURL, author, className }: BannerInfoProps) {
  if (!photoURL || !author) return null
  return (
    <div className={clsx('text-right text-sm italic', className)}>
      Photo by{' '}
      <a
        className="text-primary-500 underline-offset-4 hover:underline dark:text-primary-400"
        href={photoURL}
        target="_blank"
        rel="noreferrer"
      >
        <span data-umami-event="banner-author">{author}</span>
      </a>{' '}
      on{' '}
      <a
        className="text-primary-500 underline-offset-4 hover:underline dark:text-primary-400"
        href="https://unsplash.com/"
        target="_blank"
        rel="noreferrer"
        data-umami-event="unsplash-link"
      >
        <span data-umami-event="banner-unsplash">Unsplash</span>
      </a>
    </div>
  )
}
