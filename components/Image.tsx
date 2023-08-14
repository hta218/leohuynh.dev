import clsx from 'clsx'
import { BLUR_IMAGE_DATA_URL, LOGO_IMAGE_PATH } from 'constant'
import NextImage from 'next/image'
import { useState } from 'react'
import type { ImageProps } from '~/types/components'
import { ImageLightbox } from './ImageLightbox'

export function Image({ shouldOpenLightbox = true, ...rest }: ImageProps) {
  let blurDataURL = ''
  if (rest.src !== LOGO_IMAGE_PATH) {
    blurDataURL = BLUR_IMAGE_DATA_URL
  }

  let [openLightbox, setOpenLightbox] = useState(false)
  let handleOpenLightbox = () => {
    if (!shouldOpenLightbox) return
    document.documentElement.classList.add('lightbox-loading')
    setOpenLightbox(true)
  }
  let isThumb = rest.id === 'thumbnail-image'
  let className = clsx(
    `flex justify-center`,
    shouldOpenLightbox && 'cursor-zoom-in',
    isThumb && 'thumbnail-image'
  )

  return (
    <>
      <div
        className={className}
        data-umami-event={isThumb ? 'view-post-thumbnail' : 'view-image-in-lightbox'}
      >
        <NextImage {...rest} blurDataURL={blurDataURL} onClick={handleOpenLightbox} />
      </div>
      {openLightbox && (
        <ImageLightbox closeLightbox={() => setOpenLightbox(false)} src={rest.src} />
      )}
    </>
  )
}
