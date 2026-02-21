import { NextIntlClientProvider } from 'next-intl';
import '../globals.css';
import MagicCursor from '@/components/MagicCursor';

export const metadata = {
  title: 'FATOS.pro - Нумерологический калькулятор',
  description: 'Профессиональный нумерологический калькулятор с Квадратом Пифагора, Числом Судьбы и Матрицей',
};

export default async function RuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = (await import('@/messages/ru.json')).default;

  return (
    <NextIntlClientProvider locale="ru" messages={messages}>
      <MagicCursor />
      {children}
    </NextIntlClientProvider>
  );
}
