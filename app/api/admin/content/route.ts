import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminAuth } from '@/lib/auth/adminAuth';
import { checkRateLimit } from '@/lib/utils/rateLimit';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET /api/admin/content - получить все страницы
export async function GET(request: NextRequest) {
  try {
    // Проверка rate limit
    const rateLimitResult = await checkRateLimit(request, 'admin-content-list', 30);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many requests' },
        { status: 429 }
      );
    }

    // Проверка админских прав
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: authResult.error },
        { status: 401 }
      );
    }

    // Получаем все страницы
    const pages = await prisma.contentPage.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching content pages:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch content pages' },
      { status: 500 }
    );
  }
}

// POST /api/admin/content - создать новую страницу
export async function POST(request: NextRequest) {
  try {
    // Проверка rate limit
    const rateLimitResult = await checkRateLimit(request, 'admin-content-create', 10);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many requests' },
        { status: 429 }
      );
    }

    // Проверка админских прав
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slug, titleRu, titleEn, contentRu, contentEn, isPublished, sortOrder } = body;

    // Валидация
    if (!slug || !titleRu || !titleEn || !contentRu || !contentEn) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Проверка уникальности slug
    const existing = await prisma.contentPage.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'DUPLICATE_SLUG', message: 'Page with this slug already exists' },
        { status: 400 }
      );
    }

    // Создаём страницу
    const page = await prisma.contentPage.create({
      data: {
        slug,
        titleRu,
        titleEn,
        contentRu,
        contentEn,
        isPublished: isPublished ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });

    // Логируем действие
    await prisma.adminLog.create({
      data: {
        adminId: authResult.sessionId!,
        action: 'CREATE_CONTENT_PAGE',
        details: { pageId: page.id, slug: page.slug },
      },
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    console.error('Error creating content page:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to create content page' },
      { status: 500 }
    );
  }
}
