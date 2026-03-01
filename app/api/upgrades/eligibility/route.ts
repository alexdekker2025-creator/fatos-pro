import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth/AuthService';
import { upgradeEligibilityService } from '@/lib/services/upgrade/UpgradeEligibilityService';

export const dynamic = 'force-dynamic';

const authService = new AuthService();

/**
 * GET /api/upgrades/eligibility
 * Check if user is eligible for upgrade
 * Query params: serviceId
 */
export async function GET(request: NextRequest) {
  try {
    // Get sessionId from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const sessionId = authHeader.substring(7);

    // Verify session
    const user = await authService.verifySession(sessionId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Get serviceId from query params
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: 'serviceId is required' },
        { status: 400 }
      );
    }

    // Check eligibility
    const result = await upgradeEligibilityService.checkEligibility(
      user.id,
      serviceId
    );

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error checking upgrade eligibility:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
