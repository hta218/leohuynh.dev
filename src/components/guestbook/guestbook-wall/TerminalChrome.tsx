export function TerminalChrome({
  title,
  children,
}: {
  title: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[4px_4px_0_var(--color-line)]">
      <div className="flex items-center gap-2 border-b border-line bg-[#f8fafc] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
        </span>
        {title}
      </div>
      {children}
    </div>
  )
}
