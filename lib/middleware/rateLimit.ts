/**
 * Rate Limiting Middleware
 * 
 * Защита от DDoS-атак путем ограничения количества запросов от одного IP
 * Требование 20.5: Платформа ДОЛЖНА ограничивать количество запросов от одного IP-адреса
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Интерфейс для хранения информации о запросах
 */
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

/**
 * In-memory хранилище для rate limiting
 * В production рекомендуется использовать Redis
 */
const rateLimitStore = new Map<string, RateLimitInfo>();

/**
 * Конфигурация rate limiting
 */
interface RateLimitConfig {
  /**
   * Максимальное количество запросов в окне
   */
  maxRequests: number;
  
  /**
   * Размер временного окна в миллисекундах
   */
  windowMs: number;
  
  /**
   * Сообщение об ошибке при превышении лимита
   */
  message?: string;
}

/**
 * Конфигурации по умолчанию для разных типов эндпоинтов
 */
export const RATE_LIMIT_CONFIGS = {
  // Строгий лимит для аутентификации (защита от brute-force)
  // ВРЕМЕННО увеличен для разработки
  auth: {
    maxRequests: 1000,
    windowMs: 15 * 60 * 1000, // 15 минут
    message: 'Too many authentication attempts. Please try again later.',
  },
  
  // Средний лимит для API эндпоинтов
  api: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 минут
    message: 'Too many requests. Please try again later.',
  },
  
  // Мягкий лимит для публичных эндпоинтов
  public: {
    maxRequests: 200,
    windowMs: 15 * 60 * 1000, // 15 минут
    message: 'Too many requests. Please try again later.',
  },
  
  // Очень строгий лимит для платежей
  payment: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 час
    message: 'Too many payment attempts. Please try again later.',
  },
} as const;

/**
 * Получает IP адрес из запроса
 */
function getClientIp(request: NextRequest): string {
  // Проверяем заголовки от прокси/CDN
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Берем первый IP из списка
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback на IP из request (может быть undefined в некоторых окружениях)
  return request.ip || 'unknown';
}

/**
 * Очищает устаревшие записи из хранилища
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  for (const [key, info] of rateLimitStore.entries()) {
    if (now > info.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Периодическая очистка устаревших записей (каждые 5 минут)
 */
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Rate Limiting Middleware
 * 
 * Ограничивает количество запросов от одного IP адреса
 * 
 * @param request - Next.js request object
 * @param config - Конфигурация rate limiting
 * @returns NextResponse с ошибкой или null если лимит не превышен
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): NextResponse | null {
  const clientIp = getClientIp(request);
  const now = Date.now();
  
  // Создаем ключ для хранилища (IP + путь для более гранулярного контроля)
  const key = `${clientIp}:${request.nextUrl.pathname}`;
  
  // Получаем информацию о запросах
  let rateLimitInfo = rateLimitStore.get(key);
  
  // Если записи нет или окно истекло, создаем новую
  if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
    rateLimitInfo = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, rateLimitInfo);
    
    return null; // Первый запрос в окне
  }
  
  // Увеличиваем счетчик
  rateLimitInfo.count++;
  
  // Проверяем, не превышен ли лимит
  if (rateLimitInfo.count > config.maxRequests) {
    const retryAfter = Math.ceil((rateLimitInfo.resetTime - now) / 1000);
    
    console.warn('Rate limit exceeded', {
      ip: clientIp,
      path: request.nextUrl.pathname,
      count: rateLimitInfo.count,
      limit: config.maxRequests,
      retryAfter,
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json(
      {
        success: false,
        error: config.message || 'Too many requests',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitInfo.resetTime).toISOString(),
        },
      }
    );
  }
  
  // Лимит не превышен
  return null;
}

/**
 * Wrapper для применения rate limiting к API route handler
 * 
 * @example
 * export const POST = withRateLimit(
 *   async (request: NextRequest) => {
 *     // Your handler logic
 *   },
 *   RATE_LIMIT_CONFIGS.auth
 * );
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Применяем rate limiting
    const rateLimitError = rateLimit(request, config);
    if (rateLimitError) {
      return rateLimitError;
    }
    
    // Вызываем оригинальный handler
    return handler(request);
  };
}

/**
 * Комбинированный wrapper для применения и CSRF защиты, и rate limiting
 * 
 * @example
 * export const POST = withSecurityMiddleware(
 *   async (request: NextRequest) => {
 *     // Your handler logic
 *   },
 *   RATE_LIMIT_CONFIGS.api
 * );
 */
export function withSecurityMiddleware(
  handler: (request: NextRequest) => Promise<NextResponse>,
  rateLimitConfig: RateLimitConfig
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Сначала проверяем rate limit
    const rateLimitError = rateLimit(request, rateLimitConfig);
    if (rateLimitError) {
      return rateLimitError;
    }
    
    // Затем проверяем CSRF (импортируем динамически чтобы избежать циклических зависимостей)
    const { csrfProtection } = await import('./csrf');
    const csrfError = csrfProtection(request);
    if (csrfError) {
      return csrfError;
    }
    
    // Вызываем оригинальный handler
    return handler(request);
  };
}
