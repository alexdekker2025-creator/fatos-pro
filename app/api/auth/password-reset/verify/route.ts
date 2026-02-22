import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const verifySchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Validate token parameter
    const validation = verifySchema.safeParse({ token });

    if (!validation.success) {
      return NextResponse.json(
        { valid: false, expired: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Import TokenService at runtime
    const { getTokenService } = await import('@/lib/services/auth/TokenService');
    const tokenService = getTokenService();

    // Validate password reset token
    const result = await tokenService.validatePasswordResetToken(validation.data.token);

    return NextResponse.json(
      {
        valid: result.valid,
        expired: result.expired || false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset verify error:', error);
    return NextResponse.json(
      { valid: false, expired: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}
