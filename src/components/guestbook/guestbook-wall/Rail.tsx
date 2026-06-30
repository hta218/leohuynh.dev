/** The graph gutter: a node dot with a connecting rail beneath it. */
export function Rail({
  head = false,
  isLast = false,
}: {
  head?: boolean
  isLast?: boolean
}) {
  return (
    <div className="relative flex w-3 shrink-0 flex-col items-center">
      <span
        className={[
          'z-10 mt-1.25 h-2.75 w-2.75 shrink-0 rounded-full border-2 border-ink',
          head ? 'bg-ink' : 'bg-bg',
        ].join(' ')}
      />
      {!isLast && <span className="-mt-px w-px flex-1 bg-line" />}
    </div>
  )
}
