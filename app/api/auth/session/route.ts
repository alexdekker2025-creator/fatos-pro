import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth/AuthService';

export const dynamic = 'force-dynamic';

const authService = new AuthService();

/**
 * GET /api/auth/session?sessionId=xxx
 * 
 * Проверка валидности сессии
 * 
 * Query params:
 * - sessionId: string
 * 
 * Response:
 * {
 *   valid: boolean,
 *   user?: { id, email, name }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Получаем sessionId из query параметров
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    // Проверяем наличие sessionId
    if (!sessionId) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Session ID is required',
        },
        { status: 400 }
      );
    }

    // Проверяем сессию
    const user = await authService.verifySession(sessionId);

    if (!user) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Invalid or expired session',
        },
        { status: 401 }
      );
    }

    // Возвращаем успешный ответ
    return NextResponse.json(
      {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Обработка ошибок
    console.error('Session verification error:', error);
    return NextResponse.json(
      {
        valid: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
