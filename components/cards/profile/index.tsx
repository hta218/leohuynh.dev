'use client'

import { clsx } from 'clsx'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Image } from '~/components/ui/image'
import { SpotifyNowPlaying } from '~/components/ui/now-playing'
import { SITE_METADATA } from '~/data/site-metadata'
import { ProfileCardInfo } from './profile-info'

export function ProfileCard() {
  let ref = useRef<HTMLDivElement>(null)
  let [style, setStyle] = useState<React.CSSProperties>({})

  let onMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || window.innerWidth < 1280) return

    let { clientX, clientY } = e
    let { width, height, x, y } = ref.current.getBoundingClientRect()
    let mouseX = Math.abs(clientX - x)
    let mouseY = Math.abs(clientY - y)
    let rotateMin = -15
    let rotateMax = 15
    let rotateRange = rotateMax - rotateMin

    let rotate = {
      x: rotateMax - (mouseY / height) * rotateRange,
      y: rotateMin + (mouseX / width) * rotateRange,
    }

    setStyle({
      transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
    })
  }, [])

  let onMouseLeave = useCallback(() => {
    setStyle({ transform: 'rotateX(0deg) rotateY(0deg)' })
  }, [])

  useEffect(() => {
    let { current } = ref
    if (!current) return
    current.addEventListener('mousemove', onMouseMove)
    current.addEventListener('mouseleave', onMouseLeave)
    return () => {
      if (!current) return
      current.removeEventListener('mousemove', onMouseMove)
      current.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [onMouseLeave, onMouseMove])

  return (
    <div
      className="z-10 mb-8 scale-100 transition-all duration-200 ease-out hover:z-50 md:mb-0 md:hover:scale-[1.15]"
      style={{ perspective: '600px' }}
      ref={ref}
    >
      <div
        style={style}
        className={clsx(
          'flex flex-col overflow-hidden transition-all duration-200 ease-out md:rounded-lg',
          'bg-white shadow-demure dark:bg-dark dark:shadow-mondegreen',
          'outline outline-1 outline-gray-100 dark:outline-gray-600'
        )}
      >
        <Image
          src={SITE_METADATA.siteLogo}
          alt={SITE_METADATA.title}
          width={550}
          height={350}
          style={{
            objectPosition: '50% 15%',
            aspectRatio: '383/240',
          }}
          loading="eager"
        />
        <SpotifyNowPlaying
          className={clsx([
            'bg-gray-900 px-3 py-1.5 xl:px-5',
            '[--song-color:theme(colors.gray.200)]',
            '[--artist-color:theme(colors.gray.400)]',
          ])}
        />
        <ProfileCardInfo />
        <span className="h-1.5 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600" />
      </div>
    </div>
  )
}
