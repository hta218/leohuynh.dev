import { SignaturePad } from '~/components/guestbook/SignaturePad'
import {
  MESSAGE_MAX_LENGTH,
  type useGuestbook,
} from '~/components/guestbook/use-guestbook'
import { TerminalChrome } from './TerminalChrome'

export function Composer({ gb }: { gb: ReturnType<typeof useGuestbook> }) {
  return (
    <TerminalChrome
      title={
        <>
          <span className="ml-1 font-mono text-[11px] text-slate-500">
            sign — guestbook
          </span>
          <a
            href="/api/auth/logout"
            className="ml-auto font-mono text-[11px] text-muted underline decoration-slate-300 underline-offset-2 hover:text-slate-950"
          >
            sign out
          </a>
        </>
      }
    >
      <form
        onSubmit={gb.handleSubmit}
        className="px-4 py-4 font-mono text-[13px]"
      >
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-emerald-700">leo@guestbook</span>
          <span className="text-slate-400">~</span>
          <span className="text-sky-700">$</span>
          <span className="text-slate-400">sign --as</span>
          <input
            type="text"
            value={gb.displayName}
            onChange={(event) => gb.setDisplayName(event.target.value)}
            maxLength={80}
            aria-label="Display name"
            className="min-w-0 flex-1 border-b border-dashed border-line bg-transparent pb-0.5 text-ink outline-none focus:border-slate-400"
          />
        </div>

        <label htmlFor="cl-message" className="sr-only">
          Your note
        </label>
        <textarea
          id="cl-message"
          value={gb.message}
          onChange={(event) =>
            gb.setMessage(event.target.value.slice(0, MESSAGE_MAX_LENGTH))
          }
          rows={3}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="> write your message and commit it to the wall…"
          className="mt-4 min-h-18 w-full resize-y bg-transparent leading-relaxed text-slate-800 outline-none placeholder:text-slate-400"
        />

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={gb.website}
          onChange={(event) => gb.setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <SignaturePad value={gb.signature} onChange={gb.setSignature} />

        {gb.error && <p className="mt-4 text-xs text-code-red">{gb.error}</p>}
        {gb.pendingNotice && (
          <p className="mt-4 text-xs text-amber-700">
            Staged for review — it lands once approved.
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="text-[11px] text-slate-400">
            {gb.remaining} chars left
          </span>
          <button
            type="submit"
            disabled={gb.submitting || gb.message.trim().length === 0}
            className="rounded-lg border border-ink bg-ink px-4 py-2 text-xs text-white shadow-[3px_3px_0_var(--color-line)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {gb.submitting ? 'committing…' : 'git commit'}
          </button>
        </div>
      </form>
    </TerminalChrome>
  )
}
