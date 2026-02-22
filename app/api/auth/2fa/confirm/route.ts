import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '@/lib/services/auth/AuthService';

// Validation schema
const confirmSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Code must be exactly 6 digits'),
  secret: z.string().min(1, 'Secret is required'),
  backupCodes: z.array(z.string()).length(10, 'Must provide exactly 10 backup codes'),
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
    const validation = confirmSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { code, secret, backupCodes } = validation.data;

    // Confirm 2FA setup
    const result = await authService.confirm2FA(userId, code, secret, backupCodes);

    return NextResponse.json(
      {
        success: true,
        enabled: result.enabled,
        message: 'Two-factor authentication has been enabled successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('2FA confirm error:', error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: 'Invalid authentication code. Please try again.' },
          { status: 400 }
        );
      }
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
