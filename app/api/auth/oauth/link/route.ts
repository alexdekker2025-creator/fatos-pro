import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '@/lib/services/auth/AuthService';

// Validation schema
const linkSchema = z.object({
  provider: z.enum(['google', 'facebook'], {
    errorMap: () => ({ message: 'Provider must be "google" or "facebook"' }),
  }),
  code: z.string().min(1, 'Authorization code is required'),
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
    const validation = linkSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { provider, code } = validation.data;

    // Link OAuth provider
    const result = await authService.linkOAuthProvider(userId, provider, code);

    return NextResponse.json(
      {
        success: true,
        linkedProviders: result.linkedProviders,
        message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} account linked successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('OAuth link error:', error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('already linked to another user')) {
        return NextResponse.json(
          { error: 'This account is already linked to another user' },
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
