import { config } from 'dotenv'
import Stripe from 'stripe'
config({ path: ['.env.local', '.env'] })
// import '/'
// import { loadStripe } from '@stripe/stripe-js'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set')
}

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const CREDIT_PRICES = {
  TIER_1: { credits: 50, price: 500 }, // $5 for 50 credits
  TIER_2: { credits: 100, price: 900 }, // $9 for 100 credits
  TIER_3: { credits: 200, price: 1500 }, // $15 for 200 credits
}

export async function createStripeCheckoutSession({
  priceId,
  userId,
  credits,
}: {
  priceId: string
  userId: string
  credits: number
}) {
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    metadata: {
      userId,
      credits,
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
  })

  return checkoutSession
}

export async function createOrRetrieveCustomer(userId: string, email: string) {
  const customers = await stripe.customers.list({
    email,
  })

  if (customers.data.length) {
    return customers.data[0]
  }

  return stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })
}
