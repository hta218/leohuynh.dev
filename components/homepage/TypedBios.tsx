import React from 'react'
import Typed from 'typed.js'
import { Twemoji } from '../Twemoji'
import { useTranslation } from 'next-i18next' // Import the hook

export function TypedBios() {
  let el = React.useRef(null)
  let typed = React.useRef(null)
  let { t } = useTranslation('common') // Use the hook to get the translation function

  React.useEffect(() => {
    typed.current = new Typed(el.current, {
      stringsElement: '#bios',
      typeSpeed: 40,
      backSpeed: 10,
      loop: true,
      backDelay: 1000,
    })
    return () => typed.current.destroy()
  }, [])

  return (
    <div>
      <ul id="bios" className="hidden">
        <li>{t('bio1')}</li>
        <li>{t('bio2')}</li>
        <li>{t('bio3')}</li>
        <li>{t('bio4')}</li>
        <li>{t('bio5')}</li>
        <li>{t('bio6')}</li>
        <li>{t('bio7')}</li>
        <li>{t('bio8')}</li>
        <li>{t('bio9')}</li>
        <li>
          {t('bio10')} <Twemoji emoji="dog" />
        </li>
        <li>
          {t('bio11')}
          <span className="ml-1">
            <Twemoji emoji="soccer-ball" />,
            <Twemoji emoji="man-swimming" />,
            <Twemoji emoji="ping-pong" />,
            <Twemoji emoji="volleyball" />
          </span>
        </li>
        <li>{t('bio12')}</li>
        <li>
          {t('bio13')} <Twemoji emoji="musical-keyboard" /> & <Twemoji emoji="guitar" />
        </li>
        <li>{t('bio14')}</li>
        <li>
          {t('bio15')} <Twemoji emoji="chess-pawn" />
        </li>
        <li>
          {t('bio16')} <Twemoji emoji="video-game" />.
        </li>
      </ul>
      <span ref={el} className="text-neutral-900 dark:text-neutral-200" />
    </div>
  )
}
