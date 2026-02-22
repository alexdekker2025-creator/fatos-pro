import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Vercel Cron Job endpoint для очистки старых security logs (90 дней)
// Настройте в vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/cleanup-logs",
//     "schedule": "0 3 * * *"
//   }]
// }

// Force dynamic rendering for cron jobs
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    // Удаляем логи старше 90 дней
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await prisma.securityLog.deleteMany({
      where: {
        createdAt: {
          lt: ninetyDaysAgo,
        },
      },
    });

    console.log('[Log Cleanup] Completed:', {
      deletedLogs: result.count,
      cutoffDate: ninetyDaysAgo.toISOString(),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      deleted: result.count,
      cutoffDate: ninetyDaysAgo.toISOString(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Log Cleanup] Error:', error);
    return NextResponse.json(
      { error: 'Log cleanup failed' },
      { status: 500 }
    );
  }
}
