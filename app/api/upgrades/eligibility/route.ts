import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { upgradeEligibilityService } from '@/lib/services/upgrade/UpgradeEligibilityService';

/**
 * GET /api/upgrades/eligibility
 * Check if user is eligible for upgrade
 * Query params: serviceId
 */
export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
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
      session.userId,
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
