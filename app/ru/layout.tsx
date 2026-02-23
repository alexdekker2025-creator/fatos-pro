import { NextIntlClientProvider } from 'next-intl';
import '../globals.css';
import MagicCursor from '@/components/MagicCursor';
import Footer from '@/components/Footer';

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
      <div className="flex flex-col min-h-screen">
        <MagicCursor />
        <main className="flex-grow">
          {children}
        </main>
        <Footer locale="ru" />
      </div>
    </NextIntlClientProvider>
  );
}
