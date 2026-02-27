import { useTranslations } from 'next-intl';

interface PrivacyPolicyContentProps {
  locale: string;
}

export default function PrivacyPolicyContent({ locale }: PrivacyPolicyContentProps) {
  const t = useTranslations('privacy');

  return (
    <article className="prose prose-purple max-w-none">
      <h1 className="text-4xl font-bold text-purple-700 mb-6">{t('title')}</h1>
      
      <p className="text-sm text-gray-500 mb-8">
        {t('lastUpdated', { date: new Date().toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US') })}
      </p>

      <section className="mb-8">
        <p className="text-gray-700 mb-4 leading-relaxed">{t('intro')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">
          {t('dataCollection.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('dataCollection.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">
          {t('dataUsage.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('dataUsage.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">
          {t('dataProtection.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('dataProtection.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">
          {t('userRights.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('userRights.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">
          {t('cookies.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('cookies.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">
          {t('contact.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('contact.content')}
        </p>
      </section>
    </article>
  );
}
