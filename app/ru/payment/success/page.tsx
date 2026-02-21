'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';

/**
 * Страница успешной оплаты
 */
export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState<{
    orderId: string;
    serviceId: string;
    amount: string;
  } | null>(null);

  useEffect(() => {
    // Получаем параметры из URL
    const orderId = searchParams.get('orderId');
    const serviceId = searchParams.get('serviceId');
    const amount = searchParams.get('amount');

    if (orderId && serviceId && amount) {
      setOrderInfo({ orderId, serviceId, amount });
    }

    setLoading(false);
  }, [searchParams]);

  const getServiceName = (serviceId: string) => {
    switch (serviceId) {
      case 'full_pythagorean':
        return 'Полный Квадрат Пифагора';
      case 'destiny_matrix':
        return 'Матрица Судьбы';
      default:
        return 'Премиум услуга';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
        {/* Иконка успеха */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Оплата успешна!
        </h1>

        {/* Описание */}
        <p className="text-purple-200 mb-6">
          Спасибо за покупку! Ваш платеж был успешно обработан.
        </p>

        {/* Информация о заказе */}
        {orderInfo && (
          <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
            <div className="text-purple-200 text-sm mb-2">
              <span className="font-semibold">Услуга:</span>{' '}
              {getServiceName(orderInfo.serviceId)}
            </div>
            <div className="text-purple-200 text-sm mb-2">
              <span className="font-semibold">Сумма:</span> {orderInfo.amount}
            </div>
            <div className="text-purple-200 text-sm">
              <span className="font-semibold">Номер заказа:</span>{' '}
              {orderInfo.orderId}
            </div>
          </div>
        )}

        {/* Информация о разблокировке */}
        <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4 mb-6">
          <p className="text-purple-100 text-sm">
            ✨ Премиум контент разблокирован! Теперь вы можете использовать все
            функции приобретенной услуги.
          </p>
        </div>

        {/* Кнопки */}
        <div className="space-y-3">
          <Link href="/ru" className="block">
            <Button variant="primary" className="w-full">
              Вернуться на главную
            </Button>
          </Link>
          <Link href="/ru/profile" className="block">
            <Button variant="secondary" className="w-full">
              Перейти в профиль
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
