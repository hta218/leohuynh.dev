import { clsx } from 'clsx'

export function GritBackground({ className }: { className?: string }) {
  return (
    <div
      className={clsx([
        'absolute z-[-1]',
        'bg-cover bg-center',
        'grit-bg',
        className,
      ])}
    />
  )
}
