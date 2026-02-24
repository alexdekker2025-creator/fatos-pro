'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n-config';

export default function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: Locale) => {
    // Get current path without locale prefix
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Navigate to the same path with new locale
    router.push(`/${newLocale}${pathWithoutLocale || ''}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-200">{t('language')}:</span>
      <div className="flex gap-2">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              locale === loc
                ? 'bg-white text-purple-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            aria-label={`Switch to ${loc === 'ru' ? 'Russian' : 'English'}`}
          >
            {loc === 'ru' ? t('russian') : t('english')}
          </button>
        ))}
      </div>
    </div>
  );
}
