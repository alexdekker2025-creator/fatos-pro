import { cookies } from 'next/headers';
import { defaultLocale, type Locale } from '@/i18n';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * Get the user's preferred locale from cookies
 */
export async function getUserLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  return (locale as Locale) || defaultLocale;
}

/**
 * Set the user's preferred locale in cookies
 */
export async function setUserLocale(locale: Locale): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: '/',
    sameSite: 'lax',
  });
}
