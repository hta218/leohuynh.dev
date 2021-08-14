import NextImage from 'next/image'
import { useState } from 'react'
import ImageLightbox from './ImageLightbox'

// eslint-disable-next-line jsx-a11y/alt-text
const Image = ({ ...rest }) => {
  let blurData = {
    placeholder: 'blur',
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcvWS1LgAGJQIpt50GkgAAAABJRU5ErkJggg==',
  }
  if (rest.src === '/static/images/logo.jpg') blurData = {}

  const [openLightbox, setOpenLightbox] = useState(false)

  const openImageLightbox = () => {
    setOpenLightbox(true)
  }

  const nextImage = <NextImage {...rest} {...blurData} />
  return (
    <>
      <div
        className="flex justify-center cursor-[zoom-in]"
        onClick={openImageLightbox}
        role="button"
        onKeyDown={openImageLightbox}
        tabIndex={0}
      >
        {nextImage}
      </div>
      {openLightbox ? (
        <ImageLightbox closeLightbox={() => setOpenLightbox(false)} src={rest.src} />
      ) : null}
    </>
  )
}

export default Image
