import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse, type NextRequest } from 'next/server'

async function NewsletterAPIHandler(req: NextApiRequest, res: NextApiResponse) {
  let { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }
  try {
    let response = await convertkitSubscribe(email)
    if (response.status >= 400) {
      res.status(response.status).json({ error: `There was an error subscribing to the list.` })
    }
    res.status(201).json({ message: 'Successfully subscribed to the newsletter' })
  } catch (error) {
    res.status(500).json({ error: error.message || error.toString() })
  }
}

async function convertkitSubscribe(email: string) {
  let { CONVERTKIT_FORM_ID, CONVERTKIT_API_KEY } = process.env
  return await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
    body: JSON.stringify({ email, api_key: CONVERTKIT_API_KEY }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
}

async function NewsletterRouteHandler(req: NextRequest) {
  let { email } = await req.json()
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }
  try {
    let response = await convertkitSubscribe(email)
    if (response.status >= 400) {
      return NextResponse.json(
        { error: `There was an error subscribing to the list` },
        { status: response.status }
      )
    }
    return NextResponse.json(
      { message: 'Successfully subscribed to the newsletter' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: error.message || error.toString() }, { status: 500 })
  }
}

async function handler(req: NextApiRequest | NextRequest, res: NextApiResponse) {
  // For route handlers, 2nd argument contains the 'params' property instead of a response object
  if ('params' in res) {
    return await NewsletterRouteHandler(req as NextRequest)
  }
  return await NewsletterAPIHandler(req as NextApiRequest, res)
}

export { handler as GET, handler as POST }
