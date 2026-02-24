/**
 * API эндпоинт для получения логов действий администратора
 * GET /api/admin/logs - получение логов
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/admin';
import { AuthService } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

const adminService = new AdminService();
const authService = new AuthService();

/**
 * GET /api/admin/logs
 * Получение логов действий администратора
 */
export async function GET(request: NextRequest) {
  try {
    // Проверяем аутентификацию
    const sessionToken = request.cookies.get('session')?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = await authService.verifySession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Проверяем права администратора
    const isAdmin = await adminService.isAdmin(session.userId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId') || undefined;
    const action = searchParams.get('action') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Получаем логи
    const result = await adminService.getAdminLogs({
      adminId,
      action,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
