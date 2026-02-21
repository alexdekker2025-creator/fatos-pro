import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth/AuthService';
import { UserRegistrationSchema } from '@/lib/validation/schemas';
import { sanitizeEmail, sanitizeName } from '@/lib/validation/sanitization';
import { withSecurityMiddleware, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimit';
import { ZodError } from 'zod';

const authService = new AuthService();

/**
 * POST /api/auth/register
 * 
 * Регистрация нового пользователя
 * 
 * Безопасность:
 * - CSRF защита (withSecurityMiddleware)
 * - Rate limiting: 5 запросов за 15 минут (RATE_LIMIT_CONFIGS.auth)
 * - Валидация входных данных (Zod)
 * - Санитизация email и имени
 * - Хеширование пароля (bcrypt)
 * 
 * Body:
 * {
 *   email: string,
 *   password: string,
 *   name: string
 * }
 * 
 * Response:
 * {
 *   user: { id, email, name },
 *   session: { id, expiresAt }
 * }
 */
async function registerHandler(request: NextRequest) {
  try {
    // Парсим тело запроса
    const body = await request.json();

    // Санитизируем входные данные перед валидацией
    const sanitizedData = {
      email: sanitizeEmail(body.email || ''),
      password: body.password,
      name: sanitizeName(body.name || ''),
    };

    // Валидируем данные с помощью Zod
    const validatedData = UserRegistrationSchema.parse(sanitizedData);

    // Регистрируем пользователя
    const result = await authService.register({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
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
      { status: 201 }
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

    // Обработка ошибки "пользователь уже существует"
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists',
        },
        { status: 409 }
      );
    }

    // Обработка других ошибок
    console.error('Registration error:', error);
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
export const POST = withSecurityMiddleware(registerHandler, RATE_LIMIT_CONFIGS.auth);
