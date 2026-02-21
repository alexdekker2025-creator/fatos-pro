import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale, defaultLocale } from './i18n-utils';

export default getRequestConfig(async ({ locale }) => {
  // Use default locale if none provided
  const validLocale = locale || defaultLocale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(validLocale as Locale)) {
    notFound();
  }

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});
