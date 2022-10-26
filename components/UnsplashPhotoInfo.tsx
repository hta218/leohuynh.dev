import type { UnsplashPhotoProps } from '~/types'

export function UnsplashPhotoInfo({ photoURL, author }: UnsplashPhotoProps) {
  return (
    <div className="text-right italic text-sm -mt-6 mb-12">
      Photo by{' '}
      <a className="!no-underline" href={photoURL} target="_blank" rel="noreferrer">
        {author}
      </a>{' '}
      on{' '}
      <a className="!no-underline" href="https://unsplash.com/" target="_blank" rel="noreferrer">
        Unsplash
      </a>
    </div>
  )
}

export default UnsplashPhotoInfo
