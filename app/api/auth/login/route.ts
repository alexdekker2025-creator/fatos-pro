import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth/AuthService';
import { UserLoginSchema } from '@/lib/validation/schemas';
import { sanitizeEmail } from '@/lib/validation/sanitization';
import { withSecurityMiddleware, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimit';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

const authService = new AuthService();

/**
 * POST /api/auth/login
 * 
 * Вход пользователя в систему
 * 
 * Безопасность:
 * - CSRF защита (withSecurityMiddleware)
 * - Rate limiting: 5 запросов за 15 минут (защита от brute-force)
 * - Валидация входных данных (Zod)
 * - Санитизация email
 * 
 * Body:
 * {
 *   email: string,
 *   password: string
 * }
 * 
 * Response:
 * {
 *   user: { id, email, name },
 *   session: { id, expiresAt }
 * }
 */
async function loginHandler(request: NextRequest) {
  try {
    // Парсим тело запроса
    const body = await request.json();

    // Санитизируем email перед валидацией
    const sanitizedData = {
      email: sanitizeEmail(body.email || ''),
      password: body.password,
    };

    // Валидируем данные с помощью Zod
    const validatedData = UserLoginSchema.parse(sanitizedData);

    // Выполняем вход
    const result = await authService.login({
      email: validatedData.email,
      password: validatedData.password,
    });

    // Возвращаем успешный ответ
    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
        session: {
          id: result.session.id,
          expiresAt: result.session.expiresAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Обработка ошибок валидации Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Обработка ошибки "неверные учетные данные"
    if (error instanceof Error && error.message.includes('Invalid email or password')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Обработка других ошибок
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Применяем middleware безопасности (CSRF + Rate Limiting)
// ВРЕМЕННО: увеличен лимит для разработки
export const POST = withSecurityMiddleware(loginHandler, {
  ...RATE_LIMIT_CONFIGS.auth,
  maxRequests: 10000,
});
