import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'

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
          className="flex flex-col transition-all duration-200 ease-out xl:hover:shadow-xl xl:shadow-md xl:rounded-lg bg-white dark:bg-gray-800 xl:border border-gray-200 overflow-hidden"
        >
          <Image
            src={'/static/images/logo.jpg'}
            alt="avatar"
            shouldOpenLightbox={false}
            width="550px"
            height="370px"
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
    <div className="flex items-center px-3 xl:px-6 py-2 bg-gray-900">
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

    <p className="py-2 text-gray-700 dark:text-gray-400">Software Engineer</p>

    <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
      <svg
        className="w-6 h-6 fill-current"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14 11H10V13H14V11Z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7 5V4C7 2.89545 7.89539 2 9 2H15C16.1046 2 17 2.89545 17 4V5H20C21.6569 5 23 6.34314 23 8V18C23 19.6569 21.6569 21 20 21H4C2.34314 21 1 19.6569 1 18V8C1 6.34314 2.34314 5 4 5H7ZM9 4H15V5H9V4ZM4 7C3.44775 7 3 7.44769 3 8V14H21V8C21 7.44769 20.5522 7 20 7H4ZM3 18V16H21V18C21 18.5523 20.5522 19 20 19H4C3.44775 19 3 18.5523 3 18Z"
        />
      </svg>

      <h1 className="px-2 text-sm">Software Engineer @ Insights Studio</h1>
    </div>

    <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
      <svg
        className="w-6 h-6 fill-current"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.2721 10.2721C16.2721 12.4813 14.4813 14.2721 12.2721 14.2721C10.063 14.2721 8.27214 12.4813 8.27214 10.2721C8.27214 8.063 10.063 6.27214 12.2721 6.27214C14.4813 6.27214 16.2721 8.063 16.2721 10.2721ZM14.2721 10.2721C14.2721 11.3767 13.3767 12.2721 12.2721 12.2721C11.1676 12.2721 10.2721 11.3767 10.2721 10.2721C10.2721 9.16757 11.1676 8.27214 12.2721 8.27214C13.3767 8.27214 14.2721 9.16757 14.2721 10.2721Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.79417 16.5183C2.19424 13.0909 2.05438 7.3941 5.48178 3.79418C8.90918 0.194258 14.6059 0.0543983 18.2059 3.48179C21.8058 6.90919 21.9457 12.606 18.5183 16.2059L12.3124 22.7241L5.79417 16.5183ZM17.0698 14.8268L12.243 19.8965L7.17324 15.0698C4.3733 12.404 4.26452 7.9732 6.93028 5.17326C9.59603 2.37332 14.0268 2.26454 16.8268 4.93029C19.6267 7.59604 19.7355 12.0269 17.0698 14.8268Z"
        />
      </svg>

      <h1 className="px-2 text-sm">Ha Noi, VN</h1>
    </div>

    <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
      <svg
        className="w-6 h-6 fill-current"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.00977 5.83789C3.00977 5.28561 3.45748 4.83789 4.00977 4.83789H20C20.5523 4.83789 21 5.28561 21 5.83789V17.1621C21 18.2667 20.1046 19.1621 19 19.1621H5C3.89543 19.1621 3 18.2667 3 17.1621V6.16211C3 6.11449 3.00333 6.06765 3.00977 6.0218V5.83789ZM5 8.06165V17.1621H19V8.06199L14.1215 12.9405C12.9499 14.1121 11.0504 14.1121 9.87885 12.9405L5 8.06165ZM6.57232 6.80554H17.428L12.7073 11.5263C12.3168 11.9168 11.6836 11.9168 11.2931 11.5263L6.57232 6.80554Z"
        />
      </svg>

      <h1 className="px-2 text-sm">leo@insights.is</h1>
    </div>
  </div>
)

export default ProfileCard
