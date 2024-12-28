import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/db/drizzle'
import { Users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const [user] = await db
      .select({ credits: Users.credits })
      .from(Users)
      .where(eq(Users.id, userId))
      .limit(1)

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json({ credits: user.credits ?? 0 })
  } catch (error) {
    console.error('Error fetching credits:', error)
    return new NextResponse('Error fetching credits. Please try again later.', { status: 500 })
  }
}
