/**
 * API эндпоинты для управления статьями
 * GET /api/admin/articles - получение списка статей
 * POST /api/admin/articles - создание статьи
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/admin';
import { AuthService } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

const adminService = new AdminService();
const authService = new AuthService();

/**
 * GET /api/admin/articles
 * Получение списка статей с фильтрацией и пагинацией
 */
export async function GET(request: NextRequest) {
  try {
    // Проверяем аутентификацию - сначала cookie, потом query параметр
    let sessionToken = request.cookies.get('session')?.value;
    
    if (!sessionToken) {
      const { searchParams } = new URL(request.url);
      sessionToken = searchParams.get('sessionId') || undefined;
    }
    
    if (!sessionToken) {
      // Пробуем получить из заголовка Authorization
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        sessionToken = authHeader.substring(7);
      }
    }
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = await authService.verifySession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Проверяем права администратора
    const isAdmin = await adminService.isAdmin(session.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const language = searchParams.get('language') || undefined;
    const relatedValue = searchParams.get('relatedValue') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Получаем статьи
    const result = await adminService.getArticles({
      category,
      language,
      relatedValue,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/articles
 * Создание новой статьи
 */
export async function POST(request: NextRequest) {
  try {
    // Проверяем аутентификацию - сначала cookie, потом заголовок
    let sessionToken = request.cookies.get('session')?.value;
    
    if (!sessionToken) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        sessionToken = authHeader.substring(7);
      }
    }
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = await authService.verifySession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Проверяем права администратора
    const isAdmin = await adminService.isAdmin(session.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Получаем данные из тела запроса
    const body = await request.json();

    // Создаем статью
    const article = await adminService.createArticle(body, session.id);

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error('Error creating article:', error);

    // Обрабатываем ошибки валидации
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
