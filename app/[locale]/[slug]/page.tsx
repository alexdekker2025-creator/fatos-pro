/**
 * Динамическая страница контента
 * Отображает статические страницы: О проекте, Политика конфиденциальности, FAQ и т.д.
 */

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

async function getContentPage(slug: string, locale: string) {
  try {
    const page = await prisma.contentPage.findUnique({
      where: {
        slug: slug,
        isPublished: true,
      },
    });

    return page;
  } catch (error) {
    console.error('Error fetching content page:', error);
    return null;
  }
}

export default async function ContentPage({ params }: PageProps) {
  const { locale, slug } = params;
  
  const page = await getContentPage(slug, locale);

  if (!page) {
    notFound();
  }

  const title = locale === 'ru' ? page.titleRu : page.titleEn;
  const content = locale === 'ru' ? page.contentRu : page.contentEn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-8">{title}</h1>
          
          <div 
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white 
              prose-p:text-purple-100 
              prose-a:text-purple-300 hover:prose-a:text-purple-200
              prose-strong:text-white
              prose-ul:text-purple-100
              prose-ol:text-purple-100
              prose-li:text-purple-100"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}

// Метаданные для SEO
export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = params;
  const page = await getContentPage(slug, locale);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  const title = locale === 'ru' ? page.titleRu : page.titleEn;

  return {
    title: `${title} | FATOS.pro`,
    description: title,
  };
}

// Делаем страницу динамической
export const dynamic = 'force-dynamic';
