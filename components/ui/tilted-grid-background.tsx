import { clsx } from 'clsx'
import TiltedGrid from '~/icons/tilted-grid.svg'

export function TiltedGridBackground() {
  return (
    <div
      className={clsx([
        'absolute inset-0 z-[0] rounded-2xl',
        'transition duration-300',
        '[mask-image:linear-gradient(white,transparent)]',
      ])}
    >
      <TiltedGrid
        className={clsx([
          'h-[160%] w-full',
          'absolute inset-x-0 inset-y-[-30%] skew-y-[-18deg]',
          'dark:fill-white/[.01] dark:stroke-white/[.025]',
          'fill-black/[0.02] stroke-black/5',
        ])}
      />
    </div>
  )
}
