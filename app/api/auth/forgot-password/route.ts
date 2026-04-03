import { NextResponse } from 'next/server'
import { db } from '@/lib/db-client'
import { sendPasswordResetEmail } from '@/lib/email'
import { users, passwordResetTokens } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    // Don't reveal if email exists (security measure)
    if (!userResult || userResult.length === 0) {
      return NextResponse.json({
        message: 'If the email exists in our system, a reset link will be sent',
      })
    }

    const user = userResult[0]

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000).toISOString() // 1 hour

    // Save reset token
    await db.insert(passwordResetTokens).values({
      id: `token-${Date.now()}`,
      userId: user.id,
      token: resetToken,
      expiresAt,
    })

    // Send email with reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password/${resetToken}`
    
    await sendPasswordResetEmail(user.email, resetLink)

    return NextResponse.json({
      message: 'If the email exists in our system, a reset link will be sent',
    })
  } catch (error) {
    console.error('Error in forgot password:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
