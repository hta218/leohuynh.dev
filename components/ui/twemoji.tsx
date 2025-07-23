import { type VariantProps, cva } from 'class-variance-authority'
import clsx from 'clsx'

let variants = cva('twa inline-block', {
  variants: {
    size: {
      base: '',
      lg: 'twa-lg',
      '2x': 'twa-2x',
      '3x': 'twa-3x',
      '4x': 'twa-4x',
      '5x': 'twa-5x',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

interface TwemojiProps
  extends VariantProps<typeof variants>,
    React.HTMLAttributes<HTMLSpanElement> {
  emoji: string
  className?: string
}

export function Twemoji({ emoji, size, className, ...props }: TwemojiProps) {
  return (
    <i
      className={clsx(variants({ size }), `twa-${emoji}`, className)}
      {...props}
    />
  )
}
