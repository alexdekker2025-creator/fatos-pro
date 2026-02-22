import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/AuthService';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/users
 * 
 * Получение списка пользователей с authentication статусом
 * Требует admin прав
 * 
 * Query параметры:
 * - page: номер страницы (default: 1)
 * - limit: количество на странице (default: 50, max: 100)
 * - search: поиск по email или имени
 */
export async function GET(request: NextRequest) {
  try {
    // Извлечение sessionId из cookies
    const sessionId = request.cookies.get('sessionId')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    // Проверка валидности сессии
    const user = await authService.verifySession(sessionId);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Проверка admin прав
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Парсинг query параметров
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const search = searchParams.get('search') || '';

    // Построение where условия для поиска
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // Получение пользователей с пагинацией
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          preferredLang: true,
          emailVerified: true,
          twoFactorEnabled: true,
          isAdmin: true,
          createdAt: true,
          oauthProviders: {
            select: {
              provider: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Форматирование данных
    const formattedUsers = users.map(u => ({
      ...u,
      linkedProviders: u.oauthProviders.map(p => p.provider),
      oauthProviders: undefined,
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch users' 
      },
      { status: 500 }
    );
  }
}
