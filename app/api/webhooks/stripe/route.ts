import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/db/drizzle'
import { Payments, Users } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return new NextResponse('No signature found', { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return new NextResponse(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`,
      {
        status: 400,
      }
    )
  }

  const session = event.data.object as any

  if (event.type === 'checkout.session.completed') {
    const { userId, credits } = session.metadata

    // Update user credits
    await db
      .update(Users)
      .set({
        credits: sql`${Users.credits} + ${credits}`,
      })
      .where(eq(Users.id, userId))

    // Create payment record
    await db.insert(Payments).values({
      userId,
      amount: session.amount_total,
      credits: parseInt(credits),
      status: 'succeeded',
      stripePaymentId: session.payment_intent,
    })
  }

  return new NextResponse(null, { status: 200 })
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'
