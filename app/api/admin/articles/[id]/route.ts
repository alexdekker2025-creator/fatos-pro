/**
 * API эндпоинты для управления конкретной статьей
 * PUT /api/admin/articles/[id] - обновление статьи
 * DELETE /api/admin/articles/[id] - удаление статьи
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/lib/services/admin';
import { AuthService } from '@/lib/services/auth';

const adminService = new AdminService();
const authService = new AuthService();

/**
 * PUT /api/admin/articles/[id]
 * Обновление статьи
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Обновляем статью
    const article = await adminService.updateArticle(
      params.id,
      body,
      session.id
    );

    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Error updating article:', error);

    // Обрабатываем ошибки валидации
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    // Обрабатываем ошибку "статья не найдена"
    if (error.message === 'Article not found') {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/articles/[id]
 * Удаление статьи
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Удаляем статью
    await adminService.deleteArticle(params.id, session.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting article:', error);

    // Обрабатываем ошибку "статья не найдена"
    if (error.message === 'Article not found') {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
