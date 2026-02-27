import { getTranslations } from 'next-intl/server';
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
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <TermsOfServiceContent locale={params.locale} />
    </div>
  );
}
