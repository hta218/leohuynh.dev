## Verdict

Both prior blocking issues are resolved with concrete, non-negotiable rules rather than soft guidance. No new blocking issues found in the updated `findings.md` / `plan.md`. Spec is implementation-ready for P0, contingent on the auth-boundary caution being carried into code for P1.1.

## Prior blockers status

**1. Guestbook cache leak (admin/pending entries via CDN) — Resolved.**
`plan.md` P1.1 step 6 now states caching is only permitted "when it is implemented as a separate safe response branch," explicitly requiring `viewer` absent AND `isAdmin === false`, with authenticated/admin responses pinned to `no-store` and forbidden from sharing a cache entry with anonymous responses (plan.md:117-120). The risk is also restated in Risks (plan.md:337) and folded into acceptance criteria (plan.md:138) and verification steps. This matches the audit's required fix precisely — it's now a hard branching rule, not an optional nice-to-have.

**2. `viewport` prefetch on `/guestbook` acting as eager/every-load prefetch — Resolved.**
`plan.md` P0.2 now states as a hard rule: "`/guestbook` — never `viewport` ... In a persistent visible sidebar, `viewport` behaves like eager prefetch on every page load/swap" (plan.md:75), and extends the same caution to `/llms` and `/dotfiles/*` fan-out (plan.md:76-77). The "measure and decide" framing the audit flagged is gone; it's now unconditional until P1 removes the underlying server blocker.

## Remaining non-blocking notes

- Astro version, dotfiles memoization framing, unmeasured one-hop routes, and the Vercel cache-control-normalization overstatement — all four prior non-blocking findings were addressed (findings.md:20, 200-202, 99-109, 133; plan.md:148-149).
- The audit's "Implementation cautions" bullet — empirically confirm whether sidebar links are truly always in-viewport (making `viewport` prefetch equivalent to `load` even for the static routes like `/shelf`, `/heatmap`) — is only partially reflected in plan.md's P0.2 verification steps (DOM/network inspection), not called out as a load-budgeting concern for the *static* target routes. Minor; worth a one-line addition but not blocking.
- Only `/blog` and `/topics` pagination/tag pages were spot-checked as one-hop routes; `/gists` and `/misc` pagination pages remain unchecked. Low risk given they're structurally similar, but worth a footnote if thoroughness matters here.

## Go/no-go for implementation

**Go**, starting with P0.1/P0.2, then P1.1. The two blocking issues are now hard rules in the spec text, not judgment calls left to the implementer — so as long as the code review for P1.1 explicitly re-verifies the anonymous/admin cache-branch boundary at commit time (as plan.md's own verification step already requires), there's no remaining reason to hold implementation.
