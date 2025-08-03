import { clsx } from 'clsx'
import TiltedGrid from '~/icons/tilted-grid.svg'

export function TiltedGridBackground({ className }: { className?: string }) {
  return (
    <div
      className={clsx([
        'absolute overflow-hidden mask-[linear-gradient(white,transparent)]',
        className,
      ])}
    >
      <TiltedGrid
        className={clsx([
          'w-full h-full',
          'absolute inset-x-0 inset-y-[-30%]',
          'dark:fill-white/1 dark:stroke-white/2.5',
          'fill-black/2 stroke-black/5',
        ])}
      />
    </div>
  )
}
