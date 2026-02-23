/**
 * API для получения детальных логов посещений (только для админов)
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

    // Получаем параметры из query
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const ipFilter = searchParams.get('ip') || '';
    const pathFilter = searchParams.get('path') || '';

    const skip = (page - 1) * limit;

    // Формируем условия фильтрации
    const where: any = {};
    if (ipFilter) {
      where.ipAddress = { contains: ipFilter };
    }
    if (pathFilter) {
      where.path = { contains: pathFilter };
    }

    // Получаем общее количество записей
    const total = await prisma.siteVisit.count({ where });

    // Получаем логи посещений
    const visits = await prisma.siteVisit.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Группируем посещения по IP для подсчета времени на сайте
    const visitsWithDuration = visits.map((visit, index) => {
      // Находим следующее посещение с того же IP
      const nextVisit = visits.find(
        (v, i) => i > index && v.ipAddress === visit.ipAddress
      );

      let duration = null;
      if (nextVisit) {
        const diff = visit.createdAt.getTime() - nextVisit.createdAt.getTime();
        duration = Math.round(diff / 1000); // в секундах
      }

      return {
        ...visit,
        duration,
      };
    });

    return NextResponse.json({
      visits: visitsWithDuration,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching visit logs:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch visit logs' },
      { status: 500 }
    );
  }
}
