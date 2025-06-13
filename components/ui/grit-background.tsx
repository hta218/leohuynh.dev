import { clsx } from 'clsx'

export function GritBackground({ className }: { className?: string }) {
  return (
    <div
      className={clsx([
        'absolute z-[-1]',
        'bg-cover bg-center',
        'bg-[url("/static/images/black-grit.png")]',
        'dark:bg-[url("/static/images/white-grit.png")]',
        className,
      ])}
    />
  )
}
