import NextImage from 'next/image'
import { useState } from 'react'
import ImageLightbox from './ImageLightbox'

// eslint-disable-next-line jsx-a11y/alt-text
const Image = ({ shouldOpenLightbox = true, ...rest }) => {
  let blurData = {
    placeholder: 'blur',
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcvWS1LgAGJQIpt50GkgAAAABJRU5ErkJggg==',
  }
  if (rest.src === '/static/images/logo.jpg') blurData = {}
  const [openLightbox, setOpenLightbox] = useState(false)
  const handleOpenLightbox = () => {
    if (!shouldOpenLightbox) return
    document.documentElement.classList.add('lightbox-loading')
    setOpenLightbox(true)
  }
  return (
    <>
      <div className={`flex justify-center ${shouldOpenLightbox ? 'cursor-[zoom-in]' : ''}`}>
        <NextImage {...rest} {...blurData} onClick={handleOpenLightbox} />
      </div>
      {openLightbox ? (
        <ImageLightbox closeLightbox={() => setOpenLightbox(false)} src={rest.src} />
      ) : null}
    </>
  )
}

export default Image
