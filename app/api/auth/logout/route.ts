import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth/AuthService';

const authService = new AuthService();

/**
 * POST /api/auth/logout
 * 
 * Выход пользователя из системы
 * 
 * Body:
 * {
 *   sessionId: string
 * }
 * 
 * Response:
 * {
 *   success: true
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Парсим тело запроса
    const body = await request.json();
    const { sessionId } = body;

    // Проверяем наличие sessionId
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Session ID is required',
        },
        { status: 400 }
      );
    }

    // Выполняем выход
    await authService.logout(sessionId);

    // Возвращаем успешный ответ
    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    // Обработка ошибок
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
