import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/AuthService';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/user/profile
 * 
 * Получение профиля текущего пользователя
 * Требует валидной сессии
 */
export async function GET(request: NextRequest) {
  try {
    // Извлечение sessionId из cookies
    const sessionId = request.cookies.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      );
    }

    // Проверка валидности сессии
    const user = await authService.verifySession(sessionId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Получение полного профиля с auth статусом
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
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
    });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...userProfile,
        linkedProviders: userProfile.oauthProviders.map(p => p.provider),
        oauthProviders: undefined,
      },
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch profile' 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile
 * 
 * Обновление профиля пользователя (имя, предпочитаемый язык)
 * Требует валидной сессии
 */
export async function PUT(request: NextRequest) {
  try {
    // Извлечение sessionId из cookies
    const sessionId = request.cookies.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      );
    }

    // Проверка валидности сессии
    const user = await authService.verifySession(sessionId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Парсинг тела запроса
    const body = await request.json();
    const { name, preferredLang } = body;

    // Валидация имени
    if (name !== undefined) {
      if (typeof name !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Name must be a string' },
          { status: 400 }
        );
      }

      if (name.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: 'Name cannot be empty' },
          { status: 400 }
        );
      }

      if (name.length > 100) {
        return NextResponse.json(
          { success: false, error: 'Name must be less than 100 characters' },
          { status: 400 }
        );
      }
    }

    // Валидация языка
    if (preferredLang !== undefined) {
      if (typeof preferredLang !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Preferred language must be a string' },
          { status: 400 }
        );
      }

      if (!['ru', 'en'].includes(preferredLang)) {
        return NextResponse.json(
          { success: false, error: 'Preferred language must be "ru" or "en"' },
          { status: 400 }
        );
      }
    }

    // Подготовка данных для обновления
    const updateData: { name?: string; preferredLang?: string } = {};
    
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    
    if (preferredLang !== undefined) {
      updateData.preferredLang = preferredLang;
    }

    // Проверка что есть что обновлять
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Обновление профиля в базе данных
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        preferredLang: true,
        emailVerified: true,
        twoFactorEnabled: true,
        oauthProviders: {
          select: {
            provider: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        linkedProviders: updatedUser.oauthProviders.map(p => p.provider),
        oauthProviders: undefined,
      },
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      },
      { status: 500 }
    );
  }
}
