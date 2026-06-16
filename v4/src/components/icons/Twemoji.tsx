import { emojiCodepoint } from '~/lib/emoji'

interface TwemojiProps {
  emoji: string
  className?: string
  size?: 'base' | 'lg' | '2x'
  label?: string
}

const SIZE_CLASS = {
  base: 'h-[1em] w-[1em]',
  lg: 'h-[1.25em] w-[1.25em]',
  '2x': 'h-[2em] w-[2em]',
}

export default function Twemoji({
  emoji,
  className = '',
  size = 'lg',
  label,
}: TwemojiProps) {
  const codepoint = emojiCodepoint(emoji)
  if (!codepoint) return null

  const text = label ?? emoji.replace(/-/g, ' ')

  return (
    <img
      src={`/static/twemoji/${codepoint}.svg`}
      alt={text}
      title={text}
      loading="lazy"
      decoding="async"
      className={`twemoji inline-block align-[-0.15em] ${SIZE_CLASS[size]} ${className}`}
    />
  )
}
