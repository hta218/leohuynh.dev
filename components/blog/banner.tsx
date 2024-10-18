import { clsx } from 'clsx'
import { GritBackground } from '~/components/ui/grit-background'
import { Image, Zoom } from '~/components/ui/image'

export function Banner({
  banner,
  title,
  className,
}: {
  banner: string
  title: string
  className?: string
}) {
  return (
    <div className={clsx('relative', className)}>
      <Zoom>
        <Image
          src={banner}
          alt={title}
          width={1600}
          height={1200}
          className="h-auto w-full rounded-lg"
        />
      </Zoom>
      <GritBackground className="inset-0 rounded-lg opacity-75" />
    </div>
  )
}
