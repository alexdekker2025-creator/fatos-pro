/**
 * API эндпоинт для получения статистики платформы
 * GET /api/admin/statistics - получение статистики
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/admin';
import { AuthService } from '@/lib/services/auth';

const adminService = new AdminService();
const authService = new AuthService();

/**
 * GET /api/admin/statistics
 * Получение статистики платформы
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

    // Получаем статистику
    const statistics = await adminService.getStatistics();

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
