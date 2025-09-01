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
import { toast } from 'sonner'

interface CreditDisplayProps {
  credits: number
}

export function CreditDisplay({ credits }: CreditDisplayProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handlePurchaseCredits = async () => {
    toast.info('Purchasing credits is currently unavailable.')
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Credits</CardTitle>
        <CardDescription>You have {credits} credits remaining</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Purchase Credits</h3>
              <p className="text-sm text-muted-foreground">Purchasing is disabled.</p>
            </div>
            <Button onClick={handlePurchaseCredits} variant="default" disabled>
              Unavailable
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Each image generation costs 3 credits
      </CardFooter>
    </Card>
  )
}
