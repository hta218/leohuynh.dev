import clsx from 'clsx'

export function Greeting() {
  return (
    <div
      className={clsx(
        'font-extrabold',
        'bg-gradient-to-r from-yellow-600 to-red-600 dark:bg-gradient-to-l dark:from-emerald-500 dark:to-lime-600',
        'bg-clip-text text-[40px] leading-[60px] tracking-tight text-transparent md:text-7xl md:leading-[86px]'
      )}
    >
      Howdy, fellow! <i className="twa twa-waving-hand"></i>
    </div>
  )
}
