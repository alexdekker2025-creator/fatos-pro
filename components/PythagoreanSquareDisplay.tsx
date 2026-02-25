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

      {/* Кнопка перехода на полную страницу */}
      <div className="flex justify-center mt-6">
        <a
          href="/ru/pythagorean"
          className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          {locale === 'ru' ? 'Подробнее о Квадрате Пифагора →' : 'Learn More About Pythagorean Square →'}
        </a>
      </div>
    </div>
  );
}
