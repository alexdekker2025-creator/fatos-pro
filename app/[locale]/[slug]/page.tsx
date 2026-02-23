/**
 * Динамическая страница контента
 * Отображает статические страницы: О проекте, Политика конфиденциальности, FAQ и т.д.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import StarryBackground from '@/components/StarryBackground';

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
  const backText = locale === 'ru' ? '← Назад на главную' : '← Back to Home';

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#2D1B4E] via-purple-900 to-indigo-950 relative overflow-hidden">
      <StarryBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
        {/* Кнопка назад */}
        <div className="mb-6 animate-fade-in">
          <Link 
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-4 py-2 glass hover:glass-strong text-white rounded-lg transition-all border border-purple-400/30 hover:border-purple-400/50 active:scale-95"
          >
            <span className="text-lg">←</span>
            <span>{backText}</span>
          </Link>
        </div>

        {/* Заголовок с логотипом */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href={`/${locale}`} className="inline-block">
            <h1 className="text-3xl sm:text-4xl font-bold text-white hover:text-[#FFD700] transition-colors cursor-pointer animate-glow mb-2">
              FATOS.pro
            </h1>
          </Link>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Контент страницы */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-2xl border border-white/20 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
            {title}
          </h2>
          
          <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mb-8"></div>
          
          <div 
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold prose-headings:mb-4
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:bg-gradient-to-r prose-h2:from-purple-200 prose-h2:to-pink-200 prose-h2:bg-clip-text prose-h2:text-transparent
              prose-h3:text-xl prose-h3:mt-6 prose-h3:text-purple-200
              prose-p:text-purple-100 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-purple-300 prose-a:underline prose-a:decoration-purple-400/50 hover:prose-a:text-purple-200 hover:prose-a:decoration-purple-300
              prose-strong:text-white prose-strong:font-semibold
              prose-ul:text-purple-100 prose-ul:my-4
              prose-ol:text-purple-100 prose-ol:my-4
              prose-li:text-purple-100 prose-li:my-2 prose-li:leading-relaxed
              prose-blockquote:border-l-4 prose-blockquote:border-purple-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-purple-200
              prose-code:text-pink-300 prose-code:bg-purple-900/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Кнопка назад внизу */}
        <div className="mt-8 text-center animate-fade-in">
          <Link 
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 glass hover:glass-strong text-white rounded-lg transition-all border border-purple-400/30 hover:border-purple-400/50 active:scale-95 text-lg font-medium"
          >
            <span className="text-xl">←</span>
            <span>{backText}</span>
          </Link>
        </div>
      </div>
    </main>
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
