import { useTheme } from 'next-themes'
import { useState, useEffect, useCallback } from 'react'
import Twemoji from './Twemoji'

const ImageLightbox = ({ src, closeLightbox }) => {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [close, setClose] = useState(false)
  const { theme } = useTheme()

  const handleClose = useCallback(() => {
    setClose(true)
    document.documentElement.classList.remove('prevent-scroll', 'lightbox-loading')
    setTimeout(() => {
      closeLightbox()
    }, 300)
  }, [closeLightbox])

  const handleKeydown = useCallback(
    (e) => {
      if (e.key === 'Escape') handleClose()
    },
    [handleClose]
  )

  useEffect(() => {
    document.documentElement.classList.add('prevent-scroll')
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [handleKeydown])

  useEffect(() => {
    if (imgLoaded) {
      setTimeout(() => {
        document.documentElement.classList.remove('lightbox-loading')
      }, 150)
    }
  }, [imgLoaded])

  return (
    <div
      className="lightbox-overlay fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-300 ease-out"
      style={{
        '--tw-bg-opacity': theme === 'dark' ? 0.7 : 0.8,
        opacity: !close && imgLoaded ? 1 : 0,
      }}
      onClick={handleClose}
      onKeyDown={handleKeydown}
      role="button"
      tabIndex={0}
    >
      <div className="w-full h-full relative flex justify-center items-center">
        <div className="absolute flex justify-between top-0 inset-x-0">
          <button className="p-4 text-xl text-white" onClick={handleClose}>
            Esc
          </button>
          <button className="p-4" onClick={handleClose}>
            <Twemoji emoji="cross-mark" />
          </button>
        </div>
        {/* eslint-disable @next/next/no-img-element */}
        <img
          src={src}
          onLoad={() => setImgLoaded(true)}
          className="cursor-[zoom-out] max-w-[90vw] max-h-[80vh]"
          alt="Lightbox"
        />
      </div>
    </div>
  )
}

export default ImageLightbox
