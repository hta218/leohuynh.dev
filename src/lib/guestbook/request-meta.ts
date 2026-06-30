import { hashWithSecret } from '~/lib/github-oauth'
import type { RequestMeta } from './types'

/** Hash request metadata so we never persist raw IP / user-agent values. */
export function buildRequestMeta(
  ip: string | null,
  userAgent: string | null,
  nowSeconds: number,
): RequestMeta {
  return {
    ipHash: ip ? hashWithSecret(ip) : null,
    userAgentHash: userAgent ? hashWithSecret(userAgent) : null,
    nowSeconds,
  }
}
