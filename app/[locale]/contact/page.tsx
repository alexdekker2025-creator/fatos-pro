import { getTranslations } from 'next-intl/server';
import ContactForm from '@/components/legal/ContactForm';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function ContactPage({ params }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl min-h-screen">
      <ContactForm locale={params.locale} />
    </div>
  );
}
