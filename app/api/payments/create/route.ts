import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/services/auth/AuthService';
import { PaymentFactory } from '@/lib/services/payment';
import { withSecurityMiddleware, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const authService = new AuthService();

/**
 * Схема валидации для создания платежа
 */
const CreatePaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters (ISO 4217)'),
  countryCode: z.string().length(2, 'Country code must be 2 characters (ISO 3166-1 alpha-2)'),
  serviceId: z.string().min(1, 'Service ID is required'),
});

/**
 * POST /api/payments/create
 * 
 * Инициация платежа
 * 
 * Безопасность:
 * - CSRF защита (withSecurityMiddleware)
 * - Rate limiting: 10 запросов за 1 час (защита от злоупотреблений)
 * - Проверка аутентификации
 * - Валидация входных данных
 * 
 * Headers:
 * - Authorization: Bearer <sessionId>
 * 
 * Body:
 * {
 *   amount: number,        // Сумма в минимальных единицах валюты (копейки, центы)
 *   currency: string,      // Валюта (ISO 4217): RUB, USD, EUR
 *   countryCode: string    // Код страны (ISO 3166-1 alpha-2): RU, US, GB
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   order: { id, amount, currency, status },
 *   paymentUrl: string
 * }
 */
async function createPaymentHandler(request: NextRequest) {
  try {
    // Получаем sessionId из заголовка Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authorization header is required',
        },
        { status: 401 }
      );
    }

    const sessionId = authHeader.substring(7); // Убираем "Bearer "

    // Проверяем сессию
    const user = await authService.verifySession(sessionId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired session',
        },
        { status: 401 }
      );
    }

    // Парсим и валидируем тело запроса
    const body = await request.json();
    const validatedData = CreatePaymentSchema.parse(body);

    const { amount, currency, countryCode, serviceId } = validatedData;

    // Определяем регион и провайдера
    const region = PaymentFactory.getRegionFromCountryCode(countryCode);
    const providerType = PaymentFactory.getProviderType(region);

    // Создаем заказ в базе данных со статусом PENDING
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        amount,
        currency,
        status: 'PENDING',
        paymentProvider: providerType,
        serviceId,
      },
    });

    // Получаем провайдера платежной системы
    const provider = PaymentFactory.getProvider(region);

    // Определяем язык из заголовков или используем по умолчанию
    const acceptLanguage = request.headers.get('accept-language') || 'ru';
    const locale = acceptLanguage.startsWith('en') ? 'en' : 'ru';

    // Создаем платежную сессию
    const session = await provider.createSession(
      amount,
      currency,
      user.id,
      order.id,
      serviceId,
      locale
    );

    // Обновляем заказ с externalId
    await prisma.order.update({
      where: { id: order.id },
      data: { externalId: session.id },
    });

    // Возвращаем успешный ответ
    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          status: order.status,
          paymentProvider: order.paymentProvider,
          createdAt: order.createdAt,
        },
        paymentUrl: session.url,
        expiresAt: session.expiresAt,
      },
      { status: 201 }
    );
  } catch (error) {
    // Обработка ошибок валидации Zod
    if (error instanceof z.ZodError) {
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

    // Обработка ошибок платежной системы
    if (error instanceof Error) {
      console.error('Payment creation error:', error.message);
      
      // Если ошибка связана с платежной системой
      if (error.message.includes('Payment provider') || error.message.includes('API')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Payment provider error',
            message: 'Unable to create payment session. Please try again later.',
          },
          { status: 503 }
        );
      }
    }

    // Обработка других ошибок
    console.error('Create payment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Применяем middleware безопасности (CSRF + Rate Limiting для платежей)
export const POST = withSecurityMiddleware(createPaymentHandler, RATE_LIMIT_CONFIGS.payment);
