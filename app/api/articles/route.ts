import { NextRequest, NextResponse } from 'next/server';
import { ArticleService } from '@/lib/services/articles';

export const dynamic = 'force-dynamic';

const articleService = new ArticleService();

/**
 * GET /api/articles
 * 
 * Получить статьи по связанному значению
 * 
 * Query параметры:
 * - relatedValue: значение для поиска (обязательный)
 * - language: язык статей (ru или en, по умолчанию ru)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const relatedValue = searchParams.get('relatedValue');
    const language = searchParams.get('language') || 'ru';

    if (!relatedValue) {
      return NextResponse.json(
        { error: 'relatedValue is required' },
        { status: 400 }
      );
    }

    const articles = await articleService.getArticlesByRelatedValue(
      relatedValue,
      language
    );

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
