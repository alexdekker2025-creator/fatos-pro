import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import '../globals.css';
import MagicCursor from '@/components/MagicCursor';
import Footer from '@/components/Footer';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const locales = ['ru', 'en'];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(params.locale)) {
    notFound();
  }

  // Load messages for the locale
  const messages = (await import(`@/messages/${params.locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <MagicCursor />
        <main className="flex-grow">
          {children}
        </main>
        <Footer locale={params.locale} />
      </div>
    </NextIntlClientProvider>
  );
}
