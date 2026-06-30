import { TerminalChrome } from './TerminalChrome'

export function SignedOutPrompt() {
  return (
    <TerminalChrome
      title={
        <span className="ml-1 font-mono text-[11px] text-slate-500">
          login w GitHub and sign my guestbook
        </span>
      }
    >
      <div className="px-4 py-4 font-mono text-[13px]">
        <p className="m-0 text-slate-500">
          <span className="text-emerald-700">leo@guestbook</span>{' '}
          <span className="text-slate-400">~</span>{' '}
          <span className="text-sky-700">$</span> sign{' '}
          <span className="animate-pulse">▌</span>
        </p>
        <p className="mt-3 mb-5 text-slate-400">
          # only your public profile is used — no repo or email access
        </p>
        <a
          href="/api/auth/github"
          className="inline-flex items-center gap-2 rounded-lg border border-ink bg-ink px-4 py-2 text-xs text-white no-underline shadow-[3px_3px_0_var(--color-line)]"
          data-umami-event="guestbook-signin"
        >
          Sign in with GitHub
        </a>
      </div>
    </TerminalChrome>
  )
}
