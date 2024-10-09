'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  let posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  let posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
  if (posthogKey && posthogHost) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    })
  } else {
    console.log('Missing POSTHOG credentials')
  }
}

export function CSPostHogProvider({ children }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
