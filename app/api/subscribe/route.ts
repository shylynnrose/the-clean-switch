import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY!
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!
  const DC = API_KEY.split('-')[1] // e.g. "us19"

  const url = `https://${DC}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `apikey ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: email,
      status: 'subscribed',
    }),
  })

  const data = await response.json()

  if (response.ok) {
    return NextResponse.json({ success: true })
  } else if (data.title === 'Member Exists') {
    return NextResponse.json({ error: 'already_subscribed' }, { status: 400 })
  } else {
    return NextResponse.json({ error: data.detail || 'Something went wrong' }, { status: 500 })
  }
}
