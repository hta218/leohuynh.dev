import { BLUR_IMAGE_DATA_URL, LOGO_IMAGE_PATH } from 'constant'
import NextImage from 'next/image'
import { useState } from 'react'
import type { ImageProps } from 'types'
import { ImageLightbox } from './ImageLightbox'
import clsx from 'clsx'

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
  let className = clsx(`flex justify-center`, shouldOpenLightbox && 'cursor-zoom-in')

  return (
    <>
      <div className={className}>
        <NextImage {...rest} blurDataURL={blurDataURL} onClick={handleOpenLightbox} />
      </div>
      {openLightbox && (
        <ImageLightbox closeLightbox={() => setOpenLightbox(false)} src={rest.src} />
      )}
    </>
  )
}
