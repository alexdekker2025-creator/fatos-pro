import { useTranslations } from 'next-intl';

interface TermsOfServiceContentProps {
  locale: string;
}

export default function TermsOfServiceContent({ locale }: TermsOfServiceContentProps) {
  const t = useTranslations('terms');

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
          {t('acceptance.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('acceptance.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">
          {t('services.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('services.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">
          {t('userResponsibilities.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('userResponsibilities.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">
          {t('payments.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('payments.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">
          {t('intellectualProperty.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('intellectualProperty.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">
          {t('limitation.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('limitation.content')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-purple-600 mt-8 mb-4">
          {t('changes.title')}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {t('changes.content')}
        </p>
      </section>
    </article>
  );
}
