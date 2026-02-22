import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/AuthService';

// Helper to get user ID from session
async function getUserIdFromSession(request: NextRequest): Promise<string | null> {
  const sessionId = request.cookies.get('session')?.value;
  
  if (!sessionId) {
    return null;
  }

  const user = await authService.verifySession(sessionId);
  return user?.id || null;
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const userId = await getUserIdFromSession(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Resend email verification (includes rate limiting check)
    const result = await authService.resendEmailVerification(userId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Email resend error:', error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { 
            status: 429,
            headers: {
              'Retry-After': '3600', // 1 hour in seconds
            },
          }
        );
      }
      if (error.message.includes('already verified')) {
        return NextResponse.json(
          { error: 'Email is already verified' },
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
