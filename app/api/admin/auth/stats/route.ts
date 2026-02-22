import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/AuthService';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/auth/stats
 * 
 * Получение статистики по аутентификации пользователей
 * Требует admin прав
 */
export async function GET(request: NextRequest) {
  try {
    // Извлечение sessionId из cookies
    const sessionId = request.cookies.get('sessionId')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    // Проверка валидности сессии
    const user = await authService.verifySession(sessionId);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Проверка admin прав
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Получение статистики
    const [
      totalUsers,
      verifiedEmails,
      twoFactorEnabled,
      googleLinked,
      facebookLinked,
      totalOAuthLinked,
    ] = await Promise.all([
      // Всего пользователей
      prisma.user.count(),
      
      // Подтвержденные email
      prisma.user.count({
        where: { emailVerified: true },
      }),
      
      // 2FA включен
      prisma.user.count({
        where: { twoFactorEnabled: true },
      }),
      
      // Google OAuth
      prisma.oAuthProvider.count({
        where: { provider: 'google' },
      }),
      
      // Facebook OAuth
      prisma.oAuthProvider.count({
        where: { provider: 'facebook' },
      }),
      
      // Всего OAuth связей
      prisma.oAuthProvider.count(),
    ]);

    // Статистика по security events за последние 30 дней
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEvents = await prisma.securityLog.groupBy({
      by: ['event'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        event: true,
      },
    });

    const eventStats = recentEvents.reduce((acc, item) => {
      acc[item.event] = item._count.event;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          verifiedEmails,
          twoFactorEnabled,
          verifiedEmailsPercentage: totalUsers > 0 
            ? Math.round((verifiedEmails / totalUsers) * 100) 
            : 0,
          twoFactorPercentage: totalUsers > 0 
            ? Math.round((twoFactorEnabled / totalUsers) * 100) 
            : 0,
        },
        oauth: {
          totalLinked: totalOAuthLinked,
          google: googleLinked,
          facebook: facebookLinked,
        },
        recentActivity: {
          period: '30 days',
          events: eventStats,
        },
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching auth stats:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch stats' 
      },
      { status: 500 }
    );
  }
}
