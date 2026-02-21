// Supported locales
export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'ru';
