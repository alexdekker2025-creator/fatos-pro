import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '@/lib/services/auth/AuthService';

// Validation schema
const confirmSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  currentSessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = confirmSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { token, newPassword, currentSessionId } = validation.data;

    // Confirm password reset
    await authService.confirmPasswordReset(token, newPassword, currentSessionId);

    return NextResponse.json(
      { success: true, message: 'Password has been reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset confirm error:', error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        return NextResponse.json(
          { error: 'Password reset link has expired. Please request a new one.' },
          { status: 400 }
        );
      }
      if (error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: 'Invalid password reset link. Please request a new one.' },
          { status: 400 }
        );
      }
      if (error.message.includes('8 characters')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
