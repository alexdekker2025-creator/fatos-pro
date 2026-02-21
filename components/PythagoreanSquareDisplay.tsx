'use client';

import { useState } from 'react';
import { usePurchases } from '@/lib/hooks/usePurchases';
import { useAuth } from '@/lib/hooks/useAuth';
import { Article } from '@/lib/hooks/useArticles';
import { useLocale } from 'next-intl';
import PaymentModal from './PaymentModal';

interface PythagoreanSquareDisplayProps {
  square: number[];
  squareData?: {
    cells: number[][];
    digitCounts: Map<number, number>;
  };
  articles?: Map<number, Article | null>;
}

export default function PythagoreanSquareDisplay({ square, squareData, articles }: PythagoreanSquareDisplayProps) {
  const { user } = useAuth();
  const { hasPurchased, loading } = usePurchases();
  const locale = useLocale();
  // Порядок ячеек: первый столбец 1,2,3, второй столбец 4,5,6, третий столбец 7,8,9
  const gridNumbers = [1, 4, 7, 2, 5, 8, 3, 6, 9];
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Проверяем, куплен ли полный квадрат Пифагора
  const hasFullAccess = user && hasPurchased('full_pythagorean');

  // Данные для оплаты квадрата Пифагора
  const pythagoreanService = {
    id: 'full_pythagorean',
    titleKey: 'premium.fullPythagorean',
    descriptionKey: 'premium.fullPythagoreanDesc',
    priceRUB: 490,
    priceEUR: 7,
    features: [
      'premium.features.oneFreeDailyCalculation',
      'premium.features.unlimitedAccess',
      'premium.features.detailedAnalysis',
    ],
  };

  // Краткие названия для ячеек
  const cellNames: Record<number, string> = {
    1: locale === 'ru' ? 'Характер' : 'Character',
    2: locale === 'ru' ? 'Энергия' : 'Energy',
    3: locale === 'ru' ? 'Наука' : 'Science',
    4: locale === 'ru' ? 'Здоровье' : 'Health',
    5: locale === 'ru' ? 'Логика' : 'Logic',
    6: locale === 'ru' ? 'Труд' : 'Work',
    7: locale === 'ru' ? 'Удача' : 'Luck',
    8: locale === 'ru' ? 'Долг' : 'Duty',
    9: locale === 'ru' ? 'Память' : 'Memory'
  };

  // Линии квадрата (платные)
  const squareLines = [
    {
      name: locale === 'ru' ? 'Самооценка' : 'Self-esteem',
      cells: [1, 2, 3],
      description: locale === 'ru' ? 'Показывает уровень самооценки и уверенности в себе' : 'Shows level of self-esteem and self-confidence'
    },
    {
      name: locale === 'ru' ? 'Семья, быт' : 'Family, household',
      cells: [4, 5, 6],
      description: locale === 'ru' ? 'Отражает отношение к семье и домашнему хозяйству' : 'Reflects attitude to family and household'
    },
    {
      name: locale === 'ru' ? 'Стабильность' : 'Stability',
      cells: [7, 8, 9],
      description: locale === 'ru' ? 'Показывает стабильность и устойчивость в жизни' : 'Shows stability and resilience in life'
    },
    {
      name: locale === 'ru' ? 'Целеустремленность' : 'Purposefulness',
      cells: [1, 4, 7],
      description: locale === 'ru' ? 'Отражает способность ставить и достигать цели' : 'Reflects ability to set and achieve goals'
    },
    {
      name: locale === 'ru' ? 'Качество семьянина' : 'Family quality',
      cells: [2, 5, 8],
      description: locale === 'ru' ? 'Показывает качества семейного человека' : 'Shows qualities of a family person'
    },
    {
      name: locale === 'ru' ? 'Талант' : 'Talent',
      cells: [3, 6, 9],
      description: locale === 'ru' ? 'Отражает таланты и способности' : 'Reflects talents and abilities'
    },
    {
      name: locale === 'ru' ? 'Темперамент' : 'Temperament',
      cells: [1, 5, 9],
      description: locale === 'ru' ? 'Показывает темперамент и эмоциональность' : 'Shows temperament and emotionality'
    },
    {
      name: locale === 'ru' ? 'Духовность' : 'Spirituality',
      cells: [3, 5, 7],
      description: locale === 'ru' ? 'Отражает духовное развитие и интуицию' : 'Reflects spiritual development and intuition'
    }
  ];

  // Функция для подсчета суммы цифр в линии
  const calculateLineSum = (cells: number[]) => {
    return cells.reduce((sum, cellNum) => {
      const count = square[cellNum - 1];
      return sum + count;
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 max-w-2xl mx-auto">
        {gridNumbers.map((num, index) => {
          const count = square[index];
          
          // Показываем повторяющиеся цифры (11111, 222, 333 и т.д.)
          // square[index] содержит количество цифр
          // Нужно показать их как строку "11111" для 5 единиц, "222" для 3 двоек и т.д.
          let repeatedDigits = '---';
          if (count > 0) {
            // Создаем строку из повторяющихся цифр
            repeatedDigits = num.toString().repeat(count);
          }

          return (
            <div
              key={num}
              className="rounded-lg border-2 transition-all flex flex-col items-center justify-center p-3 sm:p-4 min-h-[100px] bg-white/5 border-purple-400/30 hover:border-purple-400/60 hover:scale-105 hover:bg-white/10"
            >
              {/* Название ячейки сверху */}
              <div className="text-xs sm:text-sm text-purple-300 mb-2 font-semibold text-center uppercase">
                {cellNames[num]}
              </div>
              
              {/* Повторяющиеся цифры */}
              <div className="text-xl sm:text-2xl font-bold text-amber-400 mb-1">
                {repeatedDigits}
              </div>
              
              {/* Количество в скобках снизу */}
              {count > 0 && (
                <div className="text-xs text-purple-200">
                  ({count})
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Линии квадрата (платные) - в стиле ячеек выше */}
      <div className="max-w-2xl mx-auto mt-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 text-center">
          {locale === 'ru' ? 'Линии Квадрата' : 'Square Lines'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
          {squareLines.map((line, index) => {
            const lineSum = hasFullAccess ? calculateLineSum(line.cells) : 0;
            
            return (
              <div
                key={index}
                className="relative rounded-lg border-2 transition-all flex flex-col items-center justify-center p-3 sm:p-4 min-h-[100px] bg-white/5 border-purple-400/30 hover:border-purple-400/60 hover:scale-105 hover:bg-white/10"
              >
                {!hasFullAccess && (
                  <>
                    {/* Полупрозрачное содержимое для неоплаченных */}
                    <div className="opacity-30 blur-[1px] select-none pointer-events-none w-full">
                      <div className="text-xs sm:text-sm text-purple-300 mb-2 font-semibold text-center uppercase">
                        {line.name}
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-amber-400 mb-1 text-center">
                        ••
                      </div>
                      <div className="text-xs text-purple-200 text-center">
                        ({line.cells.join('-')})
                      </div>
                    </div>
                    
                    {/* Иконка замка по центру */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-2xl">🔒</div>
                    </div>
                  </>
                )}
                
                {hasFullAccess && (
                  <>
                    {/* Название линии сверху */}
                    <div className="text-xs sm:text-sm text-purple-300 mb-2 font-semibold text-center uppercase">
                      {line.name}
                    </div>
                    
                    {/* Сумма линии */}
                    <div className="text-xl sm:text-2xl font-bold text-amber-400 mb-1">
                      {lineSum}
                    </div>
                    
                    {/* Ячейки в скобках снизу */}
                    <div className="text-xs text-purple-200 text-center">
                      ({line.cells.join('-')})
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Сообщение о покупке - кликабельная кнопка */}
        {!hasFullAccess && (
          <>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full text-center py-4 bg-purple-500/20 rounded-lg border border-purple-400/30 mt-4 hover:bg-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer active:scale-95"
            >
              <p className="text-purple-100 text-sm mb-2 font-semibold">
                {locale === 'ru' 
                  ? '🔓 Полный Квадрат Пифагора' 
                  : '🔓 Full Pythagorean Square'}
              </p>
              <p className="text-purple-200 text-xs">
                {locale === 'ru'
                  ? 'Получите доступ ко всем скрытым линиям квадрата и детальному анализу за 490 ₽'
                  : 'Get access to all hidden square lines and detailed analysis for 490 ₽'}
              </p>
            </button>

            {/* Payment Modal */}
            <PaymentModal
              isOpen={isPaymentModalOpen}
              onClose={() => setIsPaymentModalOpen(false)}
              service={pythagoreanService}
              onSuccess={() => {
                setIsPaymentModalOpen(false);
                // Страница перезагрузится после успешной оплаты
              }}
            />
          </>
        )}
      </div>

      {/* Articles for all cells */}
      {articles && (
        <div className="space-y-3 max-w-2xl mx-auto mt-6">
          {gridNumbers.map((num, index) => {
            const article = articles.get(num);
            if (!article) return null;

            return (
              <div key={num} className="bg-white/5 rounded-lg p-4">
                <h4 className="text-sm sm:text-base font-semibold text-purple-200 mb-2">
                  {locale === 'ru' ? 'Цифра' : 'Digit'} {num}: {article.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-200 whitespace-pre-wrap">
                  {article.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
