'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePurchases } from '@/lib/hooks/usePurchases';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';
import PaymentModal from '@/components/PaymentModal';
import { validateBirthDate } from '@/lib/validation/date';
import { PythagoreanCalculator } from '@/lib/calculators/pythagorean';

export default function PythagoreanPage() {
  const { user } = useAuth();
  const { hasPurchased } = usePurchases();
  const [selectedTier, setSelectedTier] = useState<'basic' | 'full' | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Calculator state
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [dateError, setDateError] = useState('');
  const [square, setSquare] = useState<number[] | null>(null);

  // Проверяем покупки
  const hasBasic = user && hasPurchased('pythagorean_basic');
  const hasFull = user && hasPurchased('pythagorean_full');

  const handleCalculate = () => {
    // Validate date
    const birthDate = {
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year)
    };
    
    const validation = validateBirthDate(birthDate);
    if (!validation.isValid) {
      setDateError(validation.error || 'Неверная дата');
      return;
    }
    
    setDateError('');
    
    // Calculate Pythagorean Square
    const calculator = new PythagoreanCalculator();
    const workingNumbers = calculator.calculateWorkingNumbers(birthDate);
    const result = calculator.buildSquare(birthDate, workingNumbers);
    
    // Flatten the cells array to match the display format
    setSquare(result.cells.flat());
  };

  const handleBuyClick = (tier: 'basic' | 'full') => {
    setSelectedTier(tier);
    setIsPaymentModalOpen(true);
  };

  const getPaymentService = () => {
    if (!selectedTier) return null;
    
    return {
      id: selectedTier === 'basic' ? 'pythagorean_basic' : 'pythagorean_full',
      titleKey: selectedTier === 'basic' ? 'Квадрат Пифагора (Базовый)' : 'Квадрат Пифагора (Полный)',
      priceRUB: selectedTier === 'basic' ? 2900 : 4900,
      priceEUR: selectedTier === 'basic' ? 32 : 54,
    };
  };

  const cellNames: Record<number, string> = {
    1: 'Характер',
    2: 'Энергия',
    3: 'Наука',
    4: 'Здоровье',
    5: 'Логика',
    6: 'Труд',
    7: 'Удача',
    8: 'Долг',
    9: 'Память'
  };

  // Порядок отображения ячеек в квадрате (по столбцам)
  const gridNumbers = [1, 4, 7, 2, 5, 8, 3, 6, 9];

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
            Квадрат Пифагора
          </h1>
          <p className="text-purple-200">
            Ваш цифровой портрет личности
          </p>
        </div>

        {/* Calculator */}
        <div className="mb-8 glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6 text-center">
            Введите дату рождения
          </h2>
          
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Day Select */}
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50"
              >
                <option value="" className="bg-purple-900">День</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d} className="bg-purple-900">
                    {d}
                  </option>
                ))}
              </select>

              {/* Month Select */}
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50"
              >
                <option value="" className="bg-purple-900">Месяц</option>
                {[
                  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
                ].map((m, i) => (
                  <option key={i + 1} value={i + 1} className="bg-purple-900">
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Select */}
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50"
              >
                <option value="" className="bg-purple-900">Год</option>
                {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y} className="bg-purple-900">
                    {y}
                  </option>
                ))}
              </select>
            </div>
            
            {dateError && (
              <div className="text-red-400 text-sm mb-4 text-center">
                {dateError}
              </div>
            )}
            
            <button
              onClick={handleCalculate}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-purple-950 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Рассчитать
            </button>
          </div>
        </div>

        {/* Pythagorean Square (9 cells) */}
        {square && (
          <div className="mb-8 glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30 animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6 text-center">
              Ваш Квадрат Пифагора
            </h2>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 max-w-2xl mx-auto">
              {gridNumbers.map((num) => {
                const count = square[num - 1];
                let repeatedDigits = '---';
                if (count > 0) {
                  repeatedDigits = num.toString().repeat(count);
                }

                return (
                  <div
                    key={num}
                    className="rounded-lg border-2 transition-all flex flex-col items-center justify-center p-3 sm:p-4 min-h-[100px] bg-white/5 border-purple-400/30 hover:border-purple-400/60 hover:scale-105 hover:bg-white/10"
                  >
                    <div className="text-xs sm:text-sm text-purple-300 mb-2 font-semibold text-center uppercase">
                      {cellNames[num]}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-amber-400 mb-1">
                      {repeatedDigits}
                    </div>
                    {count > 0 && (
                      <div className="text-xs text-purple-200">
                        ({count})
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pricing Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Basic Tier - 2900₽ */}
          <div className="glass-strong rounded-xl p-6 sm:p-8 border border-purple-400/30 flex flex-col">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="text-2xl font-bold text-white mb-2">СТАРТ</h3>
              <div className="text-3xl font-bold text-amber-400 mb-1">2900 ₽</div>
              <div className="text-sm text-purple-300">$32</div>
            </div>
            
            <div className="flex-grow mb-6">
              <h4 className="text-white font-semibold mb-3 text-center">
                Всё, чтобы понять главное
              </h4>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li>✓ Готовая таблица 3×3</li>
                <li>✓ Краткое значение каждой ячейки</li>
                <li>✓ Сильные стороны</li>
                <li>✓ Слабые стороны</li>
              </ul>
            </div>
            
            <button
              onClick={() => handleBuyClick('basic')}
              disabled={!!(hasBasic || hasFull)}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                hasBasic || hasFull
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              {hasBasic || hasFull ? 'Куплено' : 'Купить'}
            </button>
          </div>

          {/* Full Tier - 4900₽ */}
          <div className="glass-strong rounded-xl p-6 sm:p-8 border-2 border-amber-500/50 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-purple-950 text-xs font-bold px-3 py-1 rounded-bl-lg">
              🔥 ПОПУЛЯРНЫЙ
            </div>
            
            <div className="text-center mb-4 mt-2">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-2xl font-bold text-white mb-2">ГЛУБОКИЙ</h3>
              <div className="text-3xl font-bold text-amber-400 mb-1">4900 ₽</div>
              <div className="text-sm text-purple-300">$54</div>
            </div>
            
            <div className="flex-grow mb-6">
              <h4 className="text-white font-semibold mb-3 text-center">
                Всё из тарифа «Старт» +
              </h4>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li>✓ Подробная расшифровка каждой ячейки</li>
                <li>✓ Линии силы (строки, столбцы, диагонали)</li>
                <li>✓ Пустые ячейки</li>
                <li>✓ Рекомендации под ваш профиль</li>
                <li>✓ Как усилить то, что дано от природы</li>
              </ul>
            </div>
            
            <button
              onClick={() => handleBuyClick('full')}
              disabled={!!hasFull}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                hasFull
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-purple-950 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              {hasFull ? 'Куплено' : 'Купить'}
            </button>
          </div>
        </div>

        {/* Interpretations Section */}
        <div className="glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6 text-center">
            Расшифровка вашего квадрата
          </h2>
          
          <div className="space-y-4">
              {/* Basic Interpretations - Available with basic tier */}
              <div className={`relative ${!hasBasic && !hasFull ? 'pointer-events-none' : ''}`}>
                <h3 className="text-lg font-semibold text-white mb-4">
                  📋 Базовая расшифровка ячеек
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gridNumbers.map((num) => {
                    const count = square ? square[num - 1] : 0;
                    const isLocked = !hasBasic && !hasFull;
                    
                    return (
                      <div
                        key={num}
                        className={`bg-white/5 rounded-lg p-4 border border-purple-400/20 relative ${
                          isLocked ? 'overflow-hidden' : ''
                        }`}
                      >
                        {isLocked && (
                          <>
                            {/* Blur overlay */}
                            <div className="absolute inset-0 backdrop-blur-md bg-black/30 rounded-lg z-10 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-4xl mb-2">🔒</div>
                                <p className="text-white text-sm font-semibold">Доступно после покупки</p>
                              </div>
                            </div>
                          </>
                        )}
                        
                        <h4 className="text-white font-semibold mb-2">
                          {cellNames[num]} ({num}): {count > 0 ? num.toString().repeat(count) : '---'}
                        </h4>
                        <p className="text-purple-200 text-sm">
                          {isLocked 
                            ? 'Здесь будет краткое описание значения этой ячейки в вашем квадрате Пифагора...'
                            : `Краткое описание ячейки ${cellNames[num]}. Количество цифр: ${count}. Это влияет на...`
                          }
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Full Interpretations - Available only with full tier */}
              <div className={`relative ${!hasFull ? 'pointer-events-none' : ''}`}>
                <h3 className="text-lg font-semibold text-white mb-4 mt-8">
                  🔥 Полная расшифровка (только в тарифе &quot;Глубокий&quot;)
                </h3>
                
                <div className="space-y-4">
                  {/* Lines Analysis */}
                  <div className={`bg-white/5 rounded-lg p-4 border border-purple-400/20 relative ${
                    !hasFull ? 'overflow-hidden' : ''
                  }`}>
                    {!hasFull && (
                      <div className="absolute inset-0 backdrop-blur-md bg-black/30 rounded-lg z-10 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🔒</div>
                          <p className="text-white text-sm font-semibold">Доступно в тарифе &quot;Глубокий&quot;</p>
                        </div>
                      </div>
                    )}
                    
                    <h4 className="text-white font-semibold mb-2">
                      📊 Линии силы
                    </h4>
                    <p className="text-purple-200 text-sm">
                      {!hasFull
                        ? 'Детальный анализ строк, столбцов и диагоналей вашего квадрата. Узнайте о своих скрытых способностях...'
                        : 'Анализ линий силы в вашем квадрате Пифагора показывает...'
                      }
                    </p>
                  </div>

                  {/* Empty Cells Analysis */}
                  <div className={`bg-white/5 rounded-lg p-4 border border-purple-400/20 relative ${
                    !hasFull ? 'overflow-hidden' : ''
                  }`}>
                    {!hasFull && (
                      <div className="absolute inset-0 backdrop-blur-md bg-black/30 rounded-lg z-10 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🔒</div>
                          <p className="text-white text-sm font-semibold">Доступно в тарифе &quot;Глубокий&quot;</p>
                        </div>
                      </div>
                    )}
                    
                    <h4 className="text-white font-semibold mb-2">
                      ⚠️ Пустые ячейки
                    </h4>
                    <p className="text-purple-200 text-sm">
                      {!hasFull
                        ? 'Что означают пустые ячейки в вашем квадрате и как с ними работать...'
                        : 'Анализ пустых ячеек показывает области, требующие развития...'
                      }
                    </p>
                  </div>

                  {/* Personal Recommendations */}
                  <div className={`bg-white/5 rounded-lg p-4 border border-purple-400/20 relative ${
                    !hasFull ? 'overflow-hidden' : ''
                  }`}>
                    {!hasFull && (
                      <div className="absolute inset-0 backdrop-blur-md bg-black/30 rounded-lg z-10 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🔒</div>
                          <p className="text-white text-sm font-semibold">Доступно в тарифе &quot;Глубокий&quot;</p>
                        </div>
                      </div>
                    )}
                    
                    <h4 className="text-white font-semibold mb-2">
                      💡 Персональные рекомендации
                    </h4>
                    <p className="text-purple-200 text-sm">
                      {!hasFull
                        ? 'Конкретные советы по развитию ваших сильных сторон и работе со слабыми...'
                        : 'Рекомендации специально для вашего квадрата Пифагора...'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedTier && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedTier(null);
          }}
          service={getPaymentService()!}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
            setSelectedTier(null);
          }}
        />
      )}
    </main>
  );
}
