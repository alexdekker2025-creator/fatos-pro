import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // This config is used for static locale routing (/ru, /en)
  return {
    locale: locale || 'ru',
    messages: (await import(`./messages/${locale || 'ru'}.json`)).default
  };
});
