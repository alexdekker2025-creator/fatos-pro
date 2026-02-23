import { NextIntlClientProvider } from 'next-intl';
import '../globals.css';
import MagicCursor from '@/components/MagicCursor';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'FATOS.pro - Numerology Calculator',
  description: 'Professional numerology calculator with Pythagorean Square, Destiny Number and Matrix',
};

export default async function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = (await import('@/messages/en.json')).default;

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <div className="flex flex-col min-h-screen">
        <MagicCursor />
        <main className="flex-grow">
          {children}
        </main>
        <Footer locale="en" />
      </div>
    </NextIntlClientProvider>
  );
}
