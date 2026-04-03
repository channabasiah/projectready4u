import { NextResponse } from 'next/server'
import { db } from '@/lib/db-client'
import { sendPasswordChangedEmail } from '@/lib/email'
import { users, passwordResetTokens } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password, confirmPassword } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find the reset token
    const tokenResult = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1)

    if (!tokenResult || tokenResult.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    const resetToken = tokenResult[0]

    // Check if token is expired
    if (new Date(resetToken.expiresAt) < new Date()) {
      // Delete expired token
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, resetToken.id))

      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, resetToken.userId))

    // Delete the used token
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, resetToken.id))

    // Get updated user and send confirmation email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, resetToken.userId))
      .limit(1)

    if (userResult && userResult[0]) {
      await sendPasswordChangedEmail(userResult[0].email)
    }

    return NextResponse.json({
      message: 'Password has been reset successfully. You can now log in.',
    })
  } catch (error) {
    console.error('Error in reset password:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}
