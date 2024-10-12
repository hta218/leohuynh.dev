'use client'

import { clsx } from 'clsx'
import type { ImageProps as NextImageProps } from 'next/image'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

let loadedImages: string[] = []

function useImageLoadedState(src: string) {
  let pathname = usePathname()
  let uniqueImagePath = pathname + '__' + src
  let [loaded, setLoaded] = useState(() => loadedImages.includes(uniqueImagePath))
  return [
    loaded,
    () => {
      if (loaded) return
      loadedImages.push(uniqueImagePath)
      setLoaded(true)
    },
  ] as const
}

interface ImageProps extends Omit<NextImageProps, 'priority'> {}

export function Image(props: ImageProps) {
  let { alt, src, loading = 'lazy', style = { objectFit: 'cover' }, className, ...rest } = props
  let [loaded, onLoad] = useImageLoadedState(src as string)

  return (
    <div
      className={clsx(
        'image-container overflow-hidden',
        !loaded && 'animate-pulse [animation-duration:4s]',
        className
      )}
    >
      <NextImage
        className={clsx(
          '[transition:filter_500ms_cubic-bezier(.4,0,.2,1)]',
          'h-full max-h-full w-full object-center',
          loaded ? 'blur-0' : 'blur-xl'
        )}
        src={src}
        alt={alt}
        style={{ objectFit: 'cover', ...style }}
        loading={loading}
        priority={loading === 'eager'}
        quality={100}
        onLoad={onLoad}
        {...rest}
      />
    </div>
  )
}
