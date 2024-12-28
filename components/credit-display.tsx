'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CREDIT_PRICES } from '@/lib/stripe'
import { toast } from 'sonner'

interface CreditDisplayProps {
  credits: number
}

export function CreditDisplay({ credits }: CreditDisplayProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handlePurchaseCredits = async (tier: string) => {
    try {
      setIsLoading(tier)
      const response = await fetch('/api/credits/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Error purchasing credits:', error)
      toast.error('Failed to initiate purchase. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Credits</CardTitle>
        <CardDescription>You have {credits} credits remaining</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {Object.entries(CREDIT_PRICES).map(([tier, { credits: amount, price }]) => (
            <div key={tier} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{amount} Credits</h3>
                <p className="text-sm text-muted-foreground">${price / 100}</p>
              </div>
              <Button
                onClick={() => handlePurchaseCredits(tier)}
                disabled={!!isLoading}
                variant="default"
              >
                {isLoading === tier ? 'Loading...' : 'Purchase'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Each image generation costs 3 credits
      </CardFooter>
    </Card>
  )
}
