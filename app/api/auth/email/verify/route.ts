import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '@/lib/services/auth/AuthService';

// Validation schema
const verifySchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const { token } = validation.data;

    // Verify email
    const result = await authService.verifyEmail(token);

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully',
        user: result.user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        return NextResponse.json(
          { error: 'Email verification link has expired. Please request a new one.' },
          { status: 400 }
        );
      }
      if (error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: 'Invalid email verification link. Please request a new one.' },
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
