import React from 'react'
import Typed from 'typed.js'
import { Twemoji } from '../Twemoji'
import { useTranslation } from 'next-i18next'

export function TypedBios() {
  let el = React.useRef(null)
  let typed = React.useRef(null)
  let { t } = useTranslation('common')

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
        <li>{t('bio_1')}</li>
        <li>{t('bio_2')}</li>
        <li>{t('bio_3')}</li>
        <li>{t('bio_4')}</li>
        <li>{t('bio_5')}</li>
        <li>{t('bio_6')}</li>
        <li>{t('bio_7')}</li>
        <li>{t('bio_8')}</li>
        <li>{t('bio_9')}</li>
        <li>
          {t('bio_10')} <Twemoji emoji="dog" />
        </li>
        <li>
          {t('bio_11')}
          <span className="ml-1">
            <Twemoji emoji="soccer-ball" />,
            <Twemoji emoji="man-swimming" />,
            <Twemoji emoji="ping-pong" />,
            <Twemoji emoji="volleyball" />
          </span>
        </li>
        <li>{t('bio_12')}</li>
        <li>
          {t('bio_13')} <Twemoji emoji="musical-keyboard" /> & <Twemoji emoji="guitar" />
        </li>
        <li>{t('bio_14')}</li>
        <li>
          {t('bio_15')} <Twemoji emoji="chess-pawn" />
        </li>
        <li>
          {t('bio_16')} <Twemoji emoji="video-game" />.
        </li>
      </ul>
      <span ref={el} className="text-neutral-900 dark:text-neutral-200" />
    </div>
  )
}
