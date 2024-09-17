import { clsx } from 'clsx'

export function RadiantCard({
  children,
  className,
  radius = '12px',
}: {
  children: React.ReactNode
  radius?: string
  className?: string
}) {
  return (
    <div
      className="relative mx-auto w-[calc(100vw-2.5rem)] md:w-full"
      style={{ '--radius': radius } as React.CSSProperties}
    >
      <div className="absolute -inset-1.5 z-[0] rounded-[calc(var(--radius)+8px)] shadow-sm ring-1 ring-black/5 md:-inset-2" />
      <div
        className={clsx(['relative z-[1] rounded-[--radius] shadow-2xl', className])}
        style={{ background: 'conic-gradient(at 0% 0%, snow, white)' }}
      >
        {children}
      </div>
    </div>
  )
}
