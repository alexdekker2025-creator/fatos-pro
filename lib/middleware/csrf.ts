/**
 * CSRF Protection Middleware
 * 
 * Защита от CSRF-атак для API-эндпоинтов
 * Требование 20.3: Платформа ДОЛЖНА защищать API-эндпоинты от CSRF-атак
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Проверяет, является ли запрос безопасным методом (GET, HEAD, OPTIONS)
 */
function isSafeMethod(method: string): boolean {
  return ['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());
}

/**
 * Проверяет, является ли origin доверенным
 */
function isTrustedOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false;
  
  // Проверяем точное совпадение
  if (allowedOrigins.includes(origin)) return true;
  
  // Проверяем Vercel domains (*.vercel.app)
  try {
    const url = new URL(origin);
    if (url.hostname.endsWith('.vercel.app') || url.hostname === 'vercel.app') {
      return true;
    }
  } catch {
    // Ignore invalid URLs
  }
  
  // Проверяем localhost для разработки
  if (process.env.NODE_ENV === 'development') {
    try {
      const url = new URL(origin);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return true;
      }
    } catch {
      return false;
    }
  }
  
  return false;
}

/**
 * CSRF Protection Middleware
 * 
 * Проверяет Origin и Referer заголовки для защиты от CSRF-атак
 * 
 * @param request - Next.js request object
 * @returns NextResponse или null если проверка прошла успешно
 */
export function csrfProtection(request: NextRequest): NextResponse | null {
  // Пропускаем безопасные методы
  if (isSafeMethod(request.method)) {
    return null;
  }

  // Получаем разрешенные origins из переменных окружения
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const allowedOrigins = [appUrl];

  // Добавляем дополнительные разрешенные origins если указаны
  if (process.env.ALLOWED_ORIGINS) {
    allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
  }

  // Проверяем Origin заголовок
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Проверяем Origin
  if (origin && !isTrustedOrigin(origin, allowedOrigins)) {
    console.warn('CSRF: Untrusted origin', {
      origin,
      method: request.method,
      path: request.nextUrl.pathname,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: 'CSRF validation failed: Untrusted origin',
      },
      { status: 403 }
    );
  }

  // Если Origin отсутствует, проверяем Referer
  if (!origin && referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      
      if (!isTrustedOrigin(refererOrigin, allowedOrigins)) {
        console.warn('CSRF: Untrusted referer', {
          referer,
          method: request.method,
          path: request.nextUrl.pathname,
          timestamp: new Date().toISOString(),
        });

        return NextResponse.json(
          {
            success: false,
            error: 'CSRF validation failed: Untrusted referer',
          },
          { status: 403 }
        );
      }
    } catch (error) {
      console.warn('CSRF: Invalid referer URL', {
        referer,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return NextResponse.json(
        {
          success: false,
          error: 'CSRF validation failed: Invalid referer',
        },
        { status: 403 }
      );
    }
  }

  // Если ни Origin, ни Referer не предоставлены для небезопасного метода
  if (!origin && !referer) {
    console.warn('CSRF: Missing origin and referer', {
      method: request.method,
      path: request.nextUrl.pathname,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: 'CSRF validation failed: Missing origin and referer headers',
      },
      { status: 403 }
    );
  }

  // Проверка прошла успешно
  return null;
}

/**
 * Wrapper для применения CSRF защиты к API route handler
 * 
 * @example
 * export const POST = withCsrfProtection(async (request: NextRequest) => {
 *   // Your handler logic
 * });
 */
export function withCsrfProtection(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Применяем CSRF защиту
    const csrfError = csrfProtection(request);
    if (csrfError) {
      return csrfError;
    }

    // Вызываем оригинальный handler
    return handler(request);
  };
}
