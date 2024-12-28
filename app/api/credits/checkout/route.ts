import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import {
  stripe,
  CREDIT_PRICES,
  createStripeCheckoutSession,
  createOrRetrieveCustomer,
} from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await currentUser()
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse('User email not found', { status: 400 })
    }

    const { tier } = await req.json()
    const creditPlan = CREDIT_PRICES[tier as keyof typeof CREDIT_PRICES]
    if (!creditPlan) {
      return new NextResponse('Invalid credit tier', { status: 400 })
    }

    // Create or get Stripe customer
    const customer = await createOrRetrieveCustomer(userId, user.emailAddresses[0].emailAddress)

    // Create Stripe price for the credits
    const price = await stripe.prices.create({
      currency: 'usd',
      unit_amount: creditPlan.price,
      product_data: {
        name: `${creditPlan.credits} Credits`,
        metadata: {
          description: `Purchase ${creditPlan.credits} credits for image generation`,
        },
      },
    })

    // Create checkout session
    const session = await createStripeCheckoutSession({
      priceId: price.id,
      userId,
      credits: creditPlan.credits,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new NextResponse('Error creating checkout session. Please try again later.', {
      status: 500,
    })
  }
}
