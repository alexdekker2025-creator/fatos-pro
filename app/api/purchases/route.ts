import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/services/auth/AuthService';

export const dynamic = 'force-dynamic';

const authService = new AuthService();

/**
 * GET /api/purchases
 * 
 * Получение списка покупок пользователя
 * 
 * Headers:
 * - Authorization: Bearer <sessionId>
 * 
 * Response:
 * {
 *   success: true,
 *   purchases: [
 *     {
 *       id: string,
 *       userId: string,
 *       serviceId: string,
 *       orderId: string,
 *       createdAt: string,
 *       expiresAt: string | null
 *     }
 *   ]
 * }
 */
export async function GET(request: NextRequest) {
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

    // Получаем покупки пользователя
    const purchases = await prisma.purchase.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Возвращаем список покупок
    return NextResponse.json(
      {
        success: true,
        purchases: purchases.map((purchase) => ({
          id: purchase.id,
          userId: purchase.userId,
          serviceId: purchase.serviceId,
          orderId: purchase.orderId,
          createdAt: purchase.createdAt.toISOString(),
          expiresAt: purchase.expiresAt ? purchase.expiresAt.toISOString() : null,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get purchases error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
