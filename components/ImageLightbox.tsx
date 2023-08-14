import { useTheme } from 'next-themes'
import React, {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { ImageLightBoxProps } from '~/types/components'
import { Twemoji } from './Twemoji'

export function ImageLightbox({ src, closeLightbox }: ImageLightBoxProps) {
  let { theme } = useTheme()
  let [imgLoaded, setImgLoaded] = useState(false)
  let [close, setClose] = useState(false)

  let handleClose = useCallback(() => {
    setClose(true)
    document.documentElement.classList.remove('prevent-scroll', 'lightbox-loading')
    setTimeout(() => closeLightbox(), 300)
  }, [closeLightbox])

  let handleKeydown = useCallback(
    (e: ReactKeyboardEvent | KeyboardEvent) => {
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

  let style = {
    '--tw-bg-opacity': theme === 'dark' ? 0.7 : 0.8,
    opacity: !close && imgLoaded ? 1 : 0,
  } as React.CSSProperties

  return (
    <div
      role="button"
      tabIndex={0}
      className="lightbox-overlay fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ease-out"
      style={style}
      onClick={handleClose}
      onKeyDown={handleKeydown}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute inset-x-0 top-0 flex justify-between">
          <button className="p-4 text-xl text-white" onClick={handleClose}>
            Esc
          </button>
          <button className="p-4" onClick={handleClose}>
            <Twemoji emoji="cross-mark" />
          </button>
        </div>
        {/* eslint-disable @next/next/no-img-element */}
        <img
          src={src.toString()}
          onLoad={() => setImgLoaded(true)}
          className="max-h-[80vh] max-w-[90vw] cursor-zoom-out"
          alt="Lightbox"
        />
      </div>
    </div>
  )
}
