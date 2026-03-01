import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth/AuthService';
import { upgradeEligibilityService } from '@/lib/services/upgrade/UpgradeEligibilityService';

export const dynamic = 'force-dynamic';

const authService = new AuthService();

/**
 * GET /api/upgrades/available
 * Get all available upgrades for the current user
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

    // Get available upgrades
    const upgrades = await upgradeEligibilityService.getAvailableUpgrades(
      user.id
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
