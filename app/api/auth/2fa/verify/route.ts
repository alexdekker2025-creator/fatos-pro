import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '@/lib/services/auth/AuthService';

// Validation schema
const verifySchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  code: z.string().regex(/^\d{6}$|^[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Invalid code format'),
});

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(userId);

  if (!limit || now > limit.resetAt) {
    // Reset or create new limit
    rateLimitStore.set(userId, {
      count: 1,
      resetAt: now + 15 * 60 * 1000, // 15 minutes
    });
    return true;
  }

  if (limit.count >= 5) {
    return false; // Rate limit exceeded
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { userId, code } = validation.data;

    // Check rate limit: 5 attempts per 15 minutes per user
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': '900', // 15 minutes in seconds
          },
        }
      );
    }

    // Verify 2FA code
    const result = await authService.verify2FALogin(userId, code);

    // Set session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Two-factor authentication verified successfully',
      },
      { status: 200 }
    );

    response.cookies.set('session', result.session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('2FA verify error:', error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: 'Invalid authentication code. Please try again.' },
          { status: 400 }
        );
      }
      if (error.message.includes('not enabled')) {
        return NextResponse.json(
          { error: 'Two-factor authentication is not enabled for this user' },
          { status: 400 }
        );
      }
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
