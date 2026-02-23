/**
 * API для получения статистики посещений (только для админов)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Проверка админской сессии
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Получаем общее количество посещений
    const totalVisits = await prisma.siteVisit.count();

    // Получаем посещения за сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayVisits = await prisma.siteVisit.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Получаем уникальных посетителей за сегодня (по IP)
    const uniqueVisitorsToday = await prisma.siteVisit.groupBy({
      by: ['ipAddress'],
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _count: true,
    });

    // Получаем посещения за последние 7 дней
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const last7DaysVisits = await prisma.siteVisit.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Получаем посещения за последние 30 дней
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const last30DaysVisits = await prisma.siteVisit.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Получаем статистику по дням за последние 30 дней
    const dailyStats = await prisma.siteVisit.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: true,
    });

    // Группируем по дням
    const visitsByDay: { [key: string]: number } = {};
    dailyStats.forEach((stat) => {
      const date = new Date(stat.createdAt);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().split('T')[0];
      visitsByDay[dateKey] = (visitsByDay[dateKey] || 0) + stat._count;
    });

    // Получаем топ страниц
    const topPages = await prisma.siteVisit.groupBy({
      by: ['path'],
      _count: true,
      orderBy: {
        _count: {
          path: 'desc',
        },
      },
      take: 10,
    });

    return NextResponse.json({
      totalVisits,
      todayVisits,
      uniqueVisitorsToday: uniqueVisitorsToday.length,
      last7DaysVisits,
      last30DaysVisits,
      visitsByDay,
      topPages: topPages.map((page) => ({
        path: page.path,
        visits: page._count,
      })),
    });
  } catch (error) {
    console.error('Error fetching visit stats:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch visit stats' },
      { status: 500 }
    );
  }
}
