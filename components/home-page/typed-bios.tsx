'use client'

import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'
import Typed from 'typed.js'
import { Twemoji } from '~/components/ui/twemoji'

function createTypedInstance(el: HTMLElement) {
  return new Typed(el, {
    stringsElement: '#bios',
    typeSpeed: 40,
    backSpeed: 10,
    loop: true,
    backDelay: 1000,
  })
}

export function TypedBios() {
  let el = useRef(null)
  let typed = useRef<Typed | null>(null)

  useEffect(() => {
    if (el.current) {
      typed.current?.destroy()
      typed.current = createTypedInstance(el.current)
    }
  }, [])

  return (
    <div
      className={clsx([
        'flex min-h-8 items-center gap-0.5',
        [
          '[&_.typed-cursor]:inline-block',
          '[&_.typed-cursor]:w-2',
          '[&_.typed-cursor]:h-5.5',
          '[&_.typed-cursor]:text-transparent',
          '[&_.typed-cursor]:bg-slate-800',
          'dark:[&_.typed-cursor]:bg-slate-100',
        ],
      ])}
    >
      <ul id="bios" className="hidden">
        <li>
          I'm aliased as <span className="font-medium">Leo</span> at work.
        </li>
        <li>I'm a learner, builder, and freedom seeker.</li>
        <li>I live in Ha Noi, Viet Nam.</li>
        <li>I was born in the beautiful Moc Chau plateau.</li>
        <li>My first programming language I learned was Pascal.</li>
        <li>I love web development.</li>
        <li>I'm focusing on building eCommerce software.</li>
        <li>I work mostly with JS/TS technologies.</li>
        <li>I'm Tu Le's husband.</li>
        <li>
          I'm a dog-person. <Twemoji emoji="dog" />
        </li>
        <li>
          I'm a sport-guy. I love
          <span className="ml-1">
            <Twemoji emoji="soccer-ball" />,
            <Twemoji emoji="man-swimming" />,
            <Twemoji emoji="ping-pong" />,
            <Twemoji emoji="volleyball" />
          </span>
        </li>
        <li>I love watching football.</li>
        <li>
          I love playing piano & guitar. <Twemoji emoji="musical-keyboard" /> &{' '}
          <Twemoji emoji="guitar" />
        </li>
        <li>I love rock music.</li>
        <li>
          I love playing chess. <Twemoji emoji="chess-pawn" />
        </li>
        <li>
          I love playing video games, PES is my favorite one. <Twemoji emoji="video-game" />.
        </li>
      </ul>
      <span ref={el} className="text-neutral-900 dark:text-neutral-200" />
    </div>
  )
}
