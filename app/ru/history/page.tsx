'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCalculations } from '@/lib/hooks/useCalculations';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';
import CalculationCard from '@/components/CalculationCard';
import { Button } from '@/components/ui';

export default function HistoryPage() {
  const t = useTranslations();
  const { user, loading: authLoading } = useAuth();
  const { calculations, total, loading, error, loadCalculations } = useCalculations();
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    if (user) {
      loadCalculations(limit, page * limit);
    }
  }, [user, page, loadCalculations]);

  if (authLoading) {
    return (
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        <StarryBackground />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center text-white">Загрузка...</div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        <StarryBackground />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <Link
              href="/ru"
              className="text-white hover:text-purple-200 transition-colors"
            >
              ← Назад
            </Link>
            <AuthButton />
          </div>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              История расчетов
            </h1>
            <p className="text-purple-200 mb-6">
              Войдите, чтобы увидеть историю ваших расчетов
            </p>
          </div>
        </div>
      </main>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      <StarryBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 animate-fade-in">
          <Link
            href="/ru"
            className="text-white hover:text-purple-200 transition-colors"
          >
            ← Назад
          </Link>
          <AuthButton />
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            История расчетов
          </h1>
          <p className="text-purple-200">
            Всего расчетов: {total}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-white mb-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2">Загрузка...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && calculations.length === 0 && (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-6">
              <p className="text-white text-lg mb-4">
                У вас пока нет сохраненных расчетов
              </p>
              <Link href="/ru">
                <Button variant="primary">
                  Сделать первый расчет
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Calculations Grid */}
        {!loading && calculations.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
              {calculations.map((calculation) => (
                <div key={calculation.id} className="animate-fade-in-up">
                  <CalculationCard calculation={calculation} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mb-8">
                <Button
                  variant="outline"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  ← Назад
                </Button>
                
                <span className="text-white">
                  Страница {page + 1} из {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                >
                  Вперед →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
