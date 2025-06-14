import type React from 'react'
import { useRef, useState } from 'react'

export interface NewsletterFormProps {
  title?: string
  apiUrl?: string
}

export function NewsletterForm({
  title = 'Subscribe to the newsletter',
  apiUrl = '/api/newsletter',
}: NewsletterFormProps) {
  let inputEl = useRef<HTMLInputElement>(null)
  let [error, setError] = useState(false)
  let [message, setMessage] = useState('')
  let [subscribed, setSubscribed] = useState(false)

  async function subscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    let res = await fetch(apiUrl, {
      body: JSON.stringify({
        email: inputEl.current?.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    let { error } = await res.json()
    if (error) {
      setError(true)
      setMessage('Your e-mail address is invalid or you are already subscribed!')
      return
    }

    if (inputEl.current) {
      inputEl.current.value = ''
    }
    setError(false)
    setSubscribed(true)
  }

  return (
    <div>
      <div className="pb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</div>
      <form className="flex flex-col sm:flex-row" onSubmit={subscribe}>
        <div>
          <label htmlFor="email-input">
            <span className="sr-only">Email address</span>
            <input
              autoComplete="email"
              className="focus:ring-primary-600 w-72 rounded-md px-4 focus:border-transparent focus:ring-2 focus:outline-hidden dark:bg-black"
              id="email-input"
              name="email"
              placeholder={subscribed ? "You're subscribed !  🎉" : 'Enter your email'}
              ref={inputEl}
              required
              type="email"
              disabled={subscribed}
            />
          </label>
        </div>
        <div className="mt-2 flex w-full rounded-md shadow-xs sm:mt-0 sm:ml-3">
          <button
            className={`bg-primary-500 w-full rounded-md px-4 py-2 font-medium text-white sm:py-0 ${subscribed ? 'cursor-default' : 'hover:bg-primary-700 dark:hover:bg-primary-400'} focus:ring-primary-600 focus:ring-2 focus:ring-offset-2 focus:outline-hidden dark:ring-offset-black`}
            type="submit"
            disabled={subscribed}
          >
            {subscribed ? 'Thank you!' : 'Sign up'}
          </button>
        </div>
      </form>
      {error && (
        <div className="w-72 pt-2 text-sm text-red-500 sm:w-96 dark:text-red-400">{message}</div>
      )}
    </div>
  )
}
