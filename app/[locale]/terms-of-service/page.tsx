import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import TermsOfServiceContent from '@/components/legal/TermsOfServiceContent';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'terms' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function TermsOfServicePage({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B4E] via-purple-900 to-indigo-950 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <Link 
          href={`/${params.locale}`}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/20"
        >
          <span>←</span>
          <span>{params.locale === 'ru' ? 'На главную' : 'Back to Home'}</span>
        </Link>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-h-[80vh] overflow-y-auto">
          <TermsOfServiceContent locale={params.locale} />
        </div>
      </div>
    </div>
  );
}
