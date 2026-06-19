# Plan: Token Burn Widget

## Data flow

```
token-burn (private) → public/summary.json
        │  GitHub Contents API (Accept: raw, PAT in TOKEN_BURN_GH_TOKEN)
        ▼
src/lib/runtime.ts  fetchTokenBurn()  → normalize + compute today/7d/30d windows
        ▼
src/pages/api/token-burn.json.ts  (cached JSON, prerender=false)
        ▼
src/components/studio/RuntimeRail.astro  → "token burn" card (vanilla JS hydrate)
```

## Files touched

- `src/types/integrations.ts` — add `TokenBurnWindow`, `TokenBurnModelSlice`,
  `TokenBurnPayload`.
- `src/lib/runtime.ts` — add `fetchTokenBurn()` + helpers (Contents API fetch
  via the existing `GITHUB_API_TOKEN`, window aggregation from `daily[]`,
  top-model pick). Reuse `env`, `timeoutSignal`, `todayInHanoi`,
  `hanoiDateRangeOffset`.
- `src/pages/api/token-burn.json.ts` — new endpoint, `jsonHeaders(600)` (data
  changes ~once/day per machine).
- `src/components/studio/RuntimeRail.astro` — add card markup + hydration
  (`updateTokenBurn`, fetch in `hydrateGithubActivity`, once per session).

## Normalized payload

```ts
TokenBurnPayload {
  ok: boolean
  allTime / today / last7Days / last30Days: TokenBurnWindow  // {cost,tokens,sessions,messages}
  topModel?: TokenBurnModelSlice                              // all-time top by cost
  machines: string[]
  lastActivity?: string
  error?: string
}
```

## Notes / caveats

- `summary.json` dates are the machine's local calendar day; treated as Hanoi days.
- Window `sessions` are summed across `daily[]` → slight over-count for sessions
  that span days (acceptable for a widget); `allTime` uses the true distinct count.
- `tokensEstimated:true` (Copilot) means token/cost are approximate — folded into
  totals as-is, consistent with the repo's own docs.
- Graceful fallback: missing token / non-200 / fetch error → `ok:false`, card
  shows "unavailable" instead of throwing (same pattern as Spotify).

## Manual setup required (outside code)

None — reuses the existing `GITHUB_API_TOKEN`, which already has read access to
the private `hta218/token-burn` repo (set in local `.env` and on Vercel).
</content>
