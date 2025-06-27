import clsx from 'clsx'
import { Twemoji } from '~/components/ui/twemoji'

export function Greeting() {
  return (
    <div
      className={clsx(
        'font-greeting font-extrabold tracking-tight',
        'text-[40px] leading-[60px] md:text-[68px] md:leading-[100px]',
        'bg-clip-text text-transparent',
        'bg-linear-to-l from-yellow-500 to-green-600',
        'dark:bg-linear-to-l dark:from-emerald-500 dark:to-lime-600',
      )}
    >
      Howdy, fellow! <Twemoji emoji="waving-hand" size="base" />
    </div>
  )
}
