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

    // Setup 2FA
    const result = await authService.setup2FA(userId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('2FA setup error:', error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('already enabled')) {
        return NextResponse.json(
          { error: 'Two-factor authentication is already enabled' },
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
