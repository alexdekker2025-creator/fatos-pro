import { NextIntlClientProvider } from 'next-intl';
import '../globals.css';
import MagicCursor from '@/components/MagicCursor';

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
      <MagicCursor />
      {children}
    </NextIntlClientProvider>
  );
}
