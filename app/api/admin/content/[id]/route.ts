import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import { checkRateLimit } from '@/lib/utils/rateLimit';

export const dynamic = 'force-dynamic';

// GET /api/admin/content/[id] - получить одну страницу
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    if (!checkRateLimit(session.userId, 60)) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many requests' },
        { status: 429 }
      );
    }

    const page = await prisma.contentPage.findUnique({
      where: { id: params.id },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Error fetching content page:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch content page' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/content/[id] - обновить страницу
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    if (!checkRateLimit(session.userId, 20)) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { slug, titleRu, titleEn, contentRu, contentEn, isPublished, sortOrder } = body;

    // Проверяем существование страницы
    const existing = await prisma.contentPage.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Page not found' },
        { status: 404 }
      );
    }

    // Если меняется slug, проверяем уникальность
    if (slug && slug !== existing.slug) {
      const duplicateSlug = await prisma.contentPage.findUnique({
        where: { slug },
      });

      if (duplicateSlug) {
        return NextResponse.json(
          { error: 'DUPLICATE_SLUG', message: 'Page with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Обновляем страницу
    const page = await prisma.contentPage.update({
      where: { id: params.id },
      data: {
        ...(slug && { slug }),
        ...(titleRu && { titleRu }),
        ...(titleEn && { titleEn }),
        ...(contentRu && { contentRu }),
        ...(contentEn && { contentEn }),
        ...(typeof isPublished === 'boolean' && { isPublished }),
        ...(typeof sortOrder === 'number' && { sortOrder }),
      },
    });

    // Логируем действие
    await prisma.adminLog.create({
      data: {
        adminId: session.userId,
        action: 'UPDATE_CONTENT_PAGE',
        details: { pageId: page.id, slug: page.slug },
      },
    });

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Error updating content page:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to update content page' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/content/[id] - удалить страницу
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    if (!checkRateLimit(session.userId, 10)) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many requests' },
        { status: 429 }
      );
    }

    // Проверяем существование страницы
    const existing = await prisma.contentPage.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Page not found' },
        { status: 404 }
      );
    }

    // Удаляем страницу
    await prisma.contentPage.delete({
      where: { id: params.id },
    });

    // Логируем действие
    await prisma.adminLog.create({
      data: {
        adminId: session.userId,
        action: 'DELETE_CONTENT_PAGE',
        details: { pageId: params.id, slug: existing.slug },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content page:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to delete content page' },
      { status: 500 }
    );
  }
}
