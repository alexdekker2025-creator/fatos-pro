import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET /api/content/[slug] - получить опубликованную страницу по slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const page = await prisma.contentPage.findUnique({
      where: {
        slug: params.slug,
      },
      select: {
        id: true,
        slug: true,
        titleRu: true,
        titleEn: true,
        contentRu: true,
        contentEn: true,
        updatedAt: true,
      },
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
