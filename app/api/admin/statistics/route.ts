/**
 * API эндпоинт для получения статистики платформы
 * GET /api/admin/statistics - получение статистики
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/admin/AdminService';
import { authService } from '@/lib/services/auth/AuthService';
import { LRUCache } from 'lru-cache';

export const dynamic = 'force-dynamic';

const adminService = new AdminService();

// Кэш для статистики с TTL 30 секунд
const statsCache = new LRUCache<string, any>({
  max: 100,
  ttl: 30000, // 30 секунд
});

/**
 * GET /api/admin/statistics
 * Получение расширенной статистики платформы
 * 
 * Query параметры:
 * - sessionId: ID сессии (обязательный)
 * - timeRange: Временной диапазон (7d, 30d, 90d, all, custom) - по умолчанию 30d
 * - startDate: Начальная дата для custom диапазона (ISO формат)
 * - endDate: Конечная дата для custom диапазона (ISO формат)
 */
export async function GET(request: NextRequest) {
  try {
    // Проверяем аутентификацию - получаем sessionId из query параметров или заголовков
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || request.headers.get('x-session-id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await authService.verifySession(sessionId);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Проверяем права администратора
    const isAdmin = await adminService.isAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Получаем параметры временного диапазона
    const timeRange = (searchParams.get('timeRange') || '30d') as '7d' | '30d' | '90d' | 'all' | 'custom';
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Валидация временного диапазона
    if (!['7d', '30d', '90d', 'all', 'custom'].includes(timeRange)) {
      return NextResponse.json(
        { error: 'Invalid timeRange parameter. Must be one of: 7d, 30d, 90d, all, custom' },
        { status: 400 }
      );
    }

    // Валидация custom диапазона
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (timeRange === 'custom') {
      if (!startDateParam || !endDateParam) {
        return NextResponse.json(
          { error: 'startDate and endDate are required for custom time range' },
          { status: 400 }
        );
      }

      startDate = new Date(startDateParam);
      endDate = new Date(endDateParam);

      // Проверяем валидность дат
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)' },
          { status: 400 }
        );
      }

      // Проверяем, что startDate < endDate
      if (startDate >= endDate) {
        return NextResponse.json(
          { error: 'startDate must be before endDate' },
          { status: 400 }
        );
      }
    }

    // Создаем ключ кэша
    const cacheKey = timeRange === 'custom' 
      ? `stats:custom:${startDate?.toISOString()}:${endDate?.toISOString()}`
      : `stats:${timeRange}`;

    // Проверяем кэш
    const cached = statsCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Получаем расширенную статистику
    const statistics = await adminService.getEnhancedStatistics(timeRange, startDate, endDate);

    // Кэшируем результат
    statsCache.set(cacheKey, statistics);

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
