import { QuillWrite02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRef, useState } from 'react'
import type { GuestbookSignature } from '~/types/guestbook'

const COORD_MAX = 1000

/** Build an SVG path string from normalized strokes. */
export function strokesToPath(strokes: Array<Array<[number, number]>>): string {
  return strokes
    .map((stroke) =>
      stroke
        .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`)
        .join(' '),
    )
    .join(' ')
}

export function SignaturePad({
  value,
  onChange,
}: {
  value: GuestbookSignature | null
  onChange: (value: GuestbookSignature | null) => void
}) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const drawingRef = useRef(false)
  const [height, setHeight] = useState(value?.height ?? 320)
  const strokes = value?.strokes ?? []

  function toPoint(event: React.PointerEvent): [number, number] | null {
    const surface = surfaceRef.current
    if (!surface) return null
    const rect = surface.getBoundingClientRect()
    if (rect.width === 0) return null
    // Normalize against width on both axes so the aspect ratio is preserved.
    const x = ((event.clientX - rect.left) / rect.width) * COORD_MAX
    const y = ((event.clientY - rect.top) / rect.width) * COORD_MAX
    const clamp = (n: number) => Math.max(0, Math.min(COORD_MAX, Math.round(n)))
    return [clamp(x), clamp(y)]
  }

  function emit(
    nextStrokes: Array<Array<[number, number]>>,
    viewHeight: number,
  ) {
    const meaningful = nextStrokes.filter((stroke) => stroke.length > 0)
    if (meaningful.length === 0) {
      onChange(null)
      return
    }
    onChange({ width: COORD_MAX, height: viewHeight, strokes: meaningful })
  }

  function handlePointerDown(event: React.PointerEvent) {
    const surface = surfaceRef.current
    if (!surface) return
    const rect = surface.getBoundingClientRect()
    const viewHeight = Math.round((rect.height / rect.width) * COORD_MAX)
    setHeight(viewHeight)
    const point = toPoint(event)
    if (!point) return
    drawingRef.current = true
    surface.setPointerCapture(event.pointerId)
    emit([...strokes, [point]], viewHeight)
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (!drawingRef.current) return
    const point = toPoint(event)
    if (!point) return
    const next = strokes.map((stroke) => [...stroke])
    const current = next.at(-1)
    if (!current) return
    current.push(point)
    emit(next, height)
  }

  function handlePointerUp(event: React.PointerEvent) {
    if (!drawingRef.current) return
    drawingRef.current = false
    surfaceRef.current?.releasePointerCapture(event.pointerId)
  }

  function handleClear() {
    drawingRef.current = false
    onChange(null)
  }

  const hasInk = strokes.some((stroke) => stroke.length > 0)

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">
          Signature (optional)
        </span>
        <button
          type="button"
          onClick={handleClear}
          disabled={!hasInk}
          className="font-mono text-[11px] text-muted underline decoration-slate-300 underline-offset-2 hover:text-slate-950 disabled:opacity-40 disabled:no-underline"
        >
          clear
        </button>
      </div>
      <div
        ref={surfaceRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative h-44 w-full touch-none rounded-xl border border-dashed border-line bg-[#fbfcff] [background-image:linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] [background-size:24px_24px]"
        role="img"
        aria-label="Draw an optional signature"
      >
        {!hasInk && (
          <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300">
            <HugeiconsIcon
              icon={QuillWrite02Icon}
              size={30}
              strokeWidth={1.8}
            />
            <span className="font-mono text-xs text-slate-400">draw here</span>
          </span>
        )}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${COORD_MAX} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          aria-hidden="true"
        >
          <path
            d={strokesToPath(strokes)}
            stroke="var(--color-ink)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
