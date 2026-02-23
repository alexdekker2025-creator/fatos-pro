/**
 * API для отслеживания посещений сайта
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referrer } = body;

    // Получаем IP адрес
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // Получаем User Agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Сохраняем посещение
    await prisma.siteVisit.create({
      data: {
        ipAddress,
        userAgent,
        path: path || '/',
        referrer: referrer || null,
      },
    });

    // Обновляем дневную статистику
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.dailyStats.upsert({
      where: { date: today },
      create: {
        date: today,
        totalVisits: 1,
        uniqueVisitors: 1,
      },
      update: {
        totalVisits: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}
