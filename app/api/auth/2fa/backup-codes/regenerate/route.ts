import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '@/lib/services/auth/AuthService';

// Validation schema
const regenerateSchema = z.object({
  code: z.string().regex(/^\d{6}$|^[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Invalid code format'),
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
    const validation = regenerateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Valid TOTP code or backup code is required' },
        { status: 400 }
      );
    }

    const { code } = validation.data;

    // Regenerate backup codes
    const result = await authService.regenerateBackupCodes(userId, code);

    return NextResponse.json(
      {
        success: true,
        backupCodes: result.backupCodes,
        message: 'Backup codes have been regenerated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Backup codes regenerate error:', error);

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
