type BannerInfoProps = {
  photoURL?: string
  author?: string
}

export function BannerInfo({ photoURL, author }: BannerInfoProps) {
  if (!photoURL || !author) return null
  return (
    <div className="text-right text-sm italic">
      Photo by{' '}
      <a
        className="text-primary-500 underline-offset-4 hover:underline"
        href={photoURL}
        target="_blank"
        rel="noreferrer"
      >
        {author}
      </a>{' '}
      on{' '}
      <a
        className="text-primary-500 underline-offset-4 hover:underline"
        href="https://unsplash.com/"
        target="_blank"
        rel="noreferrer"
      >
        Unsplash
      </a>
    </div>
  )
}

export default BannerInfo
