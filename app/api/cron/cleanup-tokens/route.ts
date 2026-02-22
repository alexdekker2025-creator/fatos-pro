import { NextRequest, NextResponse } from 'next/server';
import { getTokenService } from '@/lib/services/auth/TokenService';

// Vercel Cron Job endpoint для очистки expired токенов
// Настройте в vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/cleanup-tokens",
//     "schedule": "0 2 * * *"
//   }]
// }

export async function GET(request: NextRequest) {
  try {
    // Проверка authorization header для безопасности
    const authHeader = request.headers.get('authorization');
    
    // В production используйте CRON_SECRET из environment variables
    if (process.env.NODE_ENV === 'production') {
      const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
      if (authHeader !== expectedAuth) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const tokenService = getTokenService();
    const result = await tokenService.cleanupExpiredTokens();

    console.log('[Token Cleanup] Completed:', {
      passwordResetTokens: result.passwordResetTokens,
      emailVerificationTokens: result.emailVerificationTokens,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      deleted: {
        passwordResetTokens: result.passwordResetTokens,
        emailVerificationTokens: result.emailVerificationTokens,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Token Cleanup] Error:', error);
    return NextResponse.json(
      { error: 'Token cleanup failed' },
      { status: 500 }
    );
  }
}
