import { kebabCase } from 'utils/string'

type TwemojiProps = {
  emoji: string
  size?: string
  className?: string
}

export function Twemoji({ emoji, size = 'twa-lg', className }: TwemojiProps) {
  let cls = `inline-block twa ${size} twa-${kebabCase(emoji)} ${className || ''}`
  return <i className={cls.trim()} />
}
