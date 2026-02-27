import { getTranslations } from 'next-intl/server';
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'privacy' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <PrivacyPolicyContent locale={params.locale} />
    </div>
  );
}
