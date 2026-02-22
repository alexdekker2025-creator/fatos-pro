import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '@/lib/services/auth/AuthService';

// Validation schema
const disableSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

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

    // Parse and validate request body
    const body = await request.json();
    const validation = disableSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const { password } = validation.data;

    // Disable 2FA
    await authService.disable2FA(userId, password);

    return NextResponse.json(
      {
        success: true,
        message: 'Two-factor authentication has been disabled successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('2FA disable error:', error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid password')) {
        return NextResponse.json(
          { error: 'Invalid password. Please try again.' },
          { status: 400 }
        );
      }
      if (error.message.includes('not enabled')) {
        return NextResponse.json(
          { error: 'Two-factor authentication is not enabled' },
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
