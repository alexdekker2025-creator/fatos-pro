'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

/**
 * Страница отмены оплаты
 */
export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
        {/* Иконка отмены */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Оплата отменена
        </h1>

        {/* Описание */}
        <p className="text-purple-200 mb-6">
          Вы отменили процесс оплаты. Заказ не был создан, и средства не были
          списаны с вашего счета.
        </p>

        {/* Информация */}
        <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4 mb-6">
          <p className="text-purple-100 text-sm">
            Если у вас возникли проблемы с оплатой или вопросы, пожалуйста,
            свяжитесь с нами.
          </p>
        </div>

        {/* Кнопки */}
        <div className="space-y-3">
          <Link href="/ru" className="block">
            <Button variant="primary" className="w-full">
              Вернуться на главную
            </Button>
          </Link>
          <Link href="/ru" className="block">
            <Button variant="secondary" className="w-full">
              Попробовать снова
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';
