'use client';

import { useState } from 'react';
import { Article } from '@/lib/hooks/useArticles';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePurchases } from '@/lib/hooks/usePurchases';
import PaymentModal from './PaymentModal';

interface DestinyMatrixDisplayProps {
  matrix: {
    positions: Map<string, number>;
  };
  articles?: Map<string, Article | null>;
}

const positionLabels: Record<string, string> = {
  dayNumber: 'Число дня',
  monthNumber: 'Число месяца',
  yearNumber: 'Число года',
  lifePathNumber: 'Число жизненного пути',
  personalityNumber: 'Число личности',
  soulNumber: 'Число души',
  powerNumber: 'Число силы',
  karmicNumber: 'Кармическое число',
};

export default function DestinyMatrixDisplay({ matrix, articles }: DestinyMatrixDisplayProps) {
  const { user } = useAuth();
  const { hasPurchased } = usePurchases();
  const positions = Array.from(matrix.positions.entries());
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Проверяем, куплена ли матрица судьбы
  const hasFullAccess = user && hasPurchased('destiny_matrix');
  
  // Бесплатные позиции
  const freePositions = ['lifePathNumber', 'soulNumber'];
  
  // Проверяем, доступна ли позиция
  const isPositionFree = (key: string) => freePositions.includes(key);

  // Данные для оплаты матрицы судьбы
  const destinyMatrixService = {
    id: 'destiny_matrix',
    titleKey: 'premium.destinyMatrix',
    descriptionKey: 'premium.destinyMatrixDesc',
    priceRUB: 490,
    priceEUR: 7,
    features: [
      'premium.features.fullMatrix',
      'premium.features.allPositions',
      'premium.features.personalGuidance',
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {positions.map(([key, value]) => {
          const isFree = isPositionFree(key);
          const isLocked = !isFree && !hasFullAccess;

          return (
            <div
              key={key}
              className={`rounded-lg p-3 sm:p-4 border-2 transition-all min-h-[100px] flex flex-col justify-center relative ${
                isLocked
                  ? 'bg-gray-800/50 border-gray-600/30'
                  : 'bg-white/5 border-purple-400/30 hover:border-purple-400/60 hover:scale-105 hover:bg-white/10'
              }`}
            >
              {isLocked ? (
                <>
                  {/* Замок для заблокированных позиций */}
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 rounded-lg z-10">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 text-center leading-tight opacity-50">
                    {positionLabels[key] || key}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">
                    {value}
                  </div>
                  <div className="text-xs sm:text-sm text-purple-200 text-center leading-tight">
                    {positionLabels[key] || key}
                  </div>
                  {(value === 11 || value === 22 || value === 33) && (
                    <div className="text-xs text-yellow-400 text-center mt-1 animate-pulse">
                      Мастер-число
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Сообщение о разблокировке - кликабельная кнопка */}
      {!hasFullAccess && (
        <>
          {/* Payment Modal */}
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            service={destinyMatrixService}
            onSuccess={() => {
              setIsPaymentModalOpen(false);
              // Страница перезагрузится после успешной оплаты
            }}
          />
        </>
      )}

      {/* Articles for accessible positions */}
      {articles && (
        <div className="space-y-3 max-w-2xl mx-auto">
          {positions.map(([key, value]) => {
            const article = articles.get(key);
            if (!article) return null;

            const isFree = isPositionFree(key);
            const isVisible = isFree || hasFullAccess;
            
            if (!isVisible) return null;

            return (
              <div key={key} className="bg-white/5 rounded-lg p-4">
                <h4 className="text-sm sm:text-base font-semibold text-purple-200 mb-2">
                  {positionLabels[key] || key} ({value}): {article.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-200 whitespace-pre-wrap">
                  {article.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Кнопка перехода на полную страницу */}
      <div className="flex justify-center mt-6">
        <button
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          Подробнее о матрице судьбы →
        </button>
      </div>
    </div>
  );
}
