import type { UnsplashPhotoProps } from '~/types/components'

export function UnsplashPhotoInfo({ photoURL, author }: UnsplashPhotoProps) {
  return (
    <div className="-mt-6 mb-12 text-right text-sm italic">
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
