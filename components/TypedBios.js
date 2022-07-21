import React from 'react'
import Typed from 'typed.js'
import Twemoji from './Twemoji'

const TypedBios = () => {
  const el = React.useRef(null)
  const typed = React.useRef(null)

  React.useEffect(() => {
    const options = {
      stringsElement: '#bios',
      typeSpeed: 40,
      backSpeed: 10,
      loop: true,
      backDelay: 1000,
      // shuffle: true,
    }
    typed.current = new Typed(el.current, options)
    return () => typed.current.destroy()
  }, [])

  return (
    <div>
      <ul id="bios" className="hidden">
        <li>
          I'm aliased as <b className="font-medium">Vic</b> at work.
        </li>
        <li>I'm a builder, learner and freedom seeker.</li>
        <li>
          I live in <b className="font-medium">Nairobi, Kenya</b>.
        </li>
        <li>
          I was born in the beautiful <b className="font-medium">Migori County</b> in Awendo Town.
        </li>
        <li>
          My first programming language I learned was <b className="font-medium">Python</b>.
        </li>
        <li>I love Data Science.</li>
        <li>I'm focusing on building data pipelines.</li>
        <li>I work mostly with Matplotlib, Numpy, Pandas, Sklearn and Tensorflow.</li>
        <li>I'm Nobody's boyfriend or husband.</li>
        <li>
          I'm a cat person <Twemoji emoji="cat" />.
        </li>
        <li>
          I'm an anime-guy. I love
          <span className="ml-1">
            <Twemoji emoji="soccer-ball" />,
            <Twemoji emoji="man-swimming" />,
            <Twemoji emoji="ping-pong" />,
            <Twemoji emoji="volleyball" />
          </span>
          .
        </li>
        <li>I love watching anime.</li>
        <li>
          I love playing guitar <Twemoji emoji="guitar" />.
        </li>
        <li>I love RnB music.</li>
        <li>
          I love playing video games <Twemoji emoji="video-game" />, Forza Horizon is my favorite
          one.
        </li>
      </ul>
      <span ref={el} className="text-neutral-900 dark:text-neutral-200" />
    </div>
  )
}

export default TypedBios
