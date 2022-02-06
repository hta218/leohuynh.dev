import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import Twemoji from './Twemoji'

const ProfileCard = () => {
  const { data } = useSWR('/api/spotify', fetcher)

  const ref = useRef(null)
  const [style, setStyle] = useState({})

  const onMouseMove = useCallback((e) => {
    if (!ref.current || window.innerWidth < 1280) return

    const { clientX, clientY } = e
    const { width, height, x, y } = ref.current.getBoundingClientRect()
    const mouseX = Math.abs(clientX - x)
    const mouseY = Math.abs(clientY - y)
    const rotateMin = -15
    const rotateMax = 15
    const rotateRange = rotateMax - rotateMin

    const rotate = {
      x: rotateMax - (mouseY / height) * rotateRange,
      y: rotateMin + (mouseX / width) * rotateRange,
    }

    setStyle({
      transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
    })
  }, [])

  const onMouseLeave = useCallback(() => {
    setStyle({ transform: 'rotateX(0deg) rotateY(0deg)' })
  }, [])

  useEffect(() => {
    const { current } = ref
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
    <>
      <div
        className="scale-100 xl:hover:scale-[1.15] z-10 hover:z-50 transition-all duration-200 ease-out mb-8 xl:mb-0"
        style={{ perspective: '600px' }}
        ref={ref}
      >
        <div
          style={style}
          className="flex flex-col transition-all duration-200 ease-out xl:hover:shadow-xl xl:shadow-md xl:rounded-lg bg-white dark:bg-dark xl:border border-gray-200 overflow-hidden"
        >
          <Image
            src={'/static/images/logo.jpg'}
            alt="avatar"
            shouldOpenLightbox={false}
            width="550px"
            height="400px"
            className="object-cover object-top"
          />
          <Spotify data={data} />
          <ProfileInfo />
        </div>
      </div>
    </>
  )
}

const Spotify = ({ data }) => {
  return (
    <div className="flex items-center px-3 xl:px-6 py-2 bg-gray-800">
      <svg
        fill="#1DB954"
        className="w-[22px] h-[22px] flex-shrink-0"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
      <div className="ml-2 inline-flex truncate">
        {data?.songUrl ? (
          <>
            <div className="h-5 flex items-end mr-2 pt-1 pb-0.5">
              <div className="bg-[#1DB954] w-0.5 h-full animate-music-play-1"></div>
              <div className="bg-[#1DB954] mx-0.5 w-0.5 h-1/2 animate-music-play-2"></div>
              <div className="bg-[#1DB954] w-0.5 h-full animate-music-play-3"></div>
              <div className="bg-[#1DB954] mx-0.5 w-0.5 h-1/2 animate-music-play-4"></div>
            </div>
            <a
              className="text-gray-200 font-medium"
              href={data.songUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`${data.title} - ${data?.artist ?? 'Spotify'}`}
            >
              {data.title}
            </a>
          </>
        ) : (
          <p className="text-gray-200 font-medium">Not Playing</p>
        )}
        <span className="mx-2 text-gray-300">{' – '}</span>
        <p className="text-gray-300 max-w-max truncate">{data?.artist ?? 'Spotify'}</p>
      </div>
    </div>
  )
}

const ProfileInfo = () => (
  <div className="hidden xl:block xl:px-6 py-4">
    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Tuan Anh Huynh (Leo)</h1>

    <p className="py-2 text-gray-700 dark:text-gray-400">Learner | Thinker</p>

    <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>

      <h1 className="px-2 text-sm">Building Shopify stuff @ FoxEcom</h1>
    </div>

    <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>

      <h1 className="px-2 text-sm">
        Ha Noi, VN{' '}
        <span className="align-middle">
          <Twemoji emoji="flag-vietnam" />
        </span>
      </h1>
    </div>

    <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <h1 className="px-2 text-sm">leo@insights.is</h1>
    </div>
  </div>
)

export default ProfileCard
