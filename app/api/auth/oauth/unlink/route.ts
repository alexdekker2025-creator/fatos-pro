import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '@/lib/services/auth/AuthService';

// Validation schema
const unlinkSchema = z.object({
  provider: z.enum(['google', 'facebook'], {
    errorMap: () => ({ message: 'Provider must be "google" or "facebook"' }),
  }),
  password: z.string().optional(),
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
    const validation = unlinkSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { provider, password } = validation.data;

    // Unlink OAuth provider
    await authService.unlinkOAuthProvider(userId, provider, password);

    return NextResponse.json(
      {
        success: true,
        message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} account unlinked successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('OAuth unlink error:', error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('only authentication method')) {
        return NextResponse.json(
          { error: 'Cannot unlink the only authentication method. Please set a password first or link another provider.' },
          { status: 400 }
        );
      }
      if (error.message.includes('Password confirmation required')) {
        return NextResponse.json(
          { error: 'Password confirmation is required to unlink this provider' },
          { status: 400 }
        );
      }
      if (error.message.includes('Invalid password')) {
        return NextResponse.json(
          { error: 'Invalid password. Please try again.' },
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
