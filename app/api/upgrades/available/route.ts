import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { upgradeEligibilityService } from '@/lib/services/upgrade/UpgradeEligibilityService';

/**
 * GET /api/upgrades/available
 * Get all available upgrades for the current user
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

    // Get available upgrades
    const upgrades = await upgradeEligibilityService.getAvailableUpgrades(
      session.userId
    );

    return NextResponse.json({
      success: true,
      upgrades
    });
  } catch (error) {
    console.error('Error getting available upgrades:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
