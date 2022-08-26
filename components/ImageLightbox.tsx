import { useTheme } from 'next-themes'
import React, { useState, useEffect, useCallback, KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { ImageLightBoxProps } from '~/types'
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
      className="lightbox-overlay fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-300 ease-out"
      style={style}
      onClick={handleClose}
      onKeyDown={handleKeydown}
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
          src={src.toString()}
          onLoad={() => setImgLoaded(true)}
          className="cursor-zoom-out max-w-[90vw] max-h-[80vh]"
          alt="Lightbox"
        />
      </div>
    </div>
  )
}
