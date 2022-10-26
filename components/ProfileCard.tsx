import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ProfileCardInfo, SpotifyNowPlaying } from '~/components'
import { fetcher } from '~/utils'
import type { SpotifyNowPlayingData } from '~/types'
const { default: useSWR } = require('swr')

export function ProfileCard() {
  let response = useSWR('/api/spotify', fetcher)
  let nowPlayingData = response.data as SpotifyNowPlayingData

  let ref = useRef(null)
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
      className="scale-100 xl:hover:scale-[1.15] z-10 hover:z-50 transition-all duration-200 ease-out mb-8 xl:mb-0"
      style={{ perspective: '600px' }}
      ref={ref}
    >
      <div
        style={style}
        className="flex flex-col transition-all duration-200 ease-out xl:shadow-lg shadow-cyan-100/50 dark:shadow-cyan-700/50 xl:rounded-lg bg-white dark:bg-dark overflow-hidden"
      >
        <Image
          src={'/static/images/logo.jpg'}
          alt="avatar"
          width={550}
          height={350}
          className="object-cover"
          style={{ objectPosition: '50% 16%', width: 340, height: 220 }}
        />
        <SpotifyNowPlaying {...nowPlayingData} />
        <ProfileCardInfo />
        <span className="h-1.5 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
      </div>
    </div>
  )
}
