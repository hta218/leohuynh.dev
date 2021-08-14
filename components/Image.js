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
  return (
    <>
      <div
        className="flex justify-center cursor-[zoom-in]"
        onClick={() => setOpenLightbox(true)}
        role="button"
        onKeyDown={() => setOpenLightbox(true)}
        tabIndex={0}
      >
        <NextImage {...rest} {...blurData} />
      </div>
      {openLightbox ? (
        <ImageLightbox closeLightbox={() => setOpenLightbox(false)} src={rest.src} />
      ) : null}
    </>
  )
}

export default Image
