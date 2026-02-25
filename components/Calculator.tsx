'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Input } from '@/components/ui';
import { validateBirthDate } from '@/lib/validation/date';
import { sumNameLetters } from '@/lib/validation/name';
import { PythagoreanCalculator } from '@/lib/calculators/pythagorean';
import { DestinyCalculator } from '@/lib/calculators/destiny';
import { ArcanaCalculator } from '@/lib/arcana/arcanaCalculator';
import { serializeArcanaData, parseArcanaData } from '@/lib/arcana/serialization';
import { useMidnightCheck } from '@/lib/hooks/useMidnightCheck';
import { calculationCache } from '@/lib/services/cache';
import { useCalculations } from '@/lib/hooks/useCalculations';
import { useArticles, Article } from '@/lib/hooks/useArticles';
import CardOfDay from './CardOfDay';
import PythagoreanSquareDisplay from './PythagoreanSquareDisplay';
import DestinyMatrixDisplay from './DestinyMatrixDisplay';
import PersonalizedGreeting from './PersonalizedGreeting';
import AdBanner from './AdBanner';

interface CalculatorState {
  name: string;
  day: string;
  month: string;
  year: string;
  errors: {
    name?: string;
    date?: string;
  };
  results: {
    workingNumbers?: any;
    square?: any;
    destinyNumber?: any;
    matrix?: any;
    arcana?: {
      morning: number;
      day: number;
      evening: number;
      night: number;
    };
  } | null;
  fromCache?: boolean;
  lastCalculationDate?: string | null; // ISO дата последнего расчета
  articles?: {
    destinyArticle?: Article | null;
    matrixArticles?: Map<string, Article | null>;
    squareArticles?: Map<number, Article | null>;
  };
}

interface CalculatorProps {
  userId?: string; // Optional: if user is logged in
}

export default function Calculator({ userId }: CalculatorProps = {}) {
  const t = useTranslations('calculator');
  const locale = useLocale();
  const { saveCalculation } = useCalculations();
  const { getDestinyNumberArticle, getMatrixPositionArticle, getSquareCellArticle } = useArticles();
  const [state, setState] = useState<CalculatorState>({
    name: '',
    day: '',
    month: '',
    year: '',
    errors: {},
    results: null,
    fromCache: false,
  });

  // Загрузка сохраненного имени при монтировании
  useEffect(() => {
    loadUserName();
  }, []);

  // Функция загрузки имени пользователя
  const loadUserName = async () => {
    // Попытка загрузить из сессии для аутентифицированных пользователей
    if (userId) {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.name) {
            setState(prev => ({ ...prev, name: data.user.name }));
            localStorage.setItem('userName', data.user.name);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to load user name from session:', error);
      }
    }

    // Fallback к localStorage
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setState(prev => ({ ...prev, name: savedName }));
    }
  };

  // Функция сохранения имени пользователя
  const saveUserName = async (name: string) => {
    // Синхронное сохранение в localStorage
    localStorage.setItem('userName', name.trim());

    // Асинхронное сохранение в БД для аутентифицированных пользователей
    if (userId) {
      try {
        await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name.trim() }),
        });
      } catch (error) {
        console.error('Failed to save user name to profile:', error);
        // Не показываем ошибку пользователю, имя уже сохранено в localStorage
      }
    }
  };

  // Функция пересчета арканов при смене даты
  const recalculateArcana = () => {
    if (!state.results?.arcana || !state.day || !state.name) {
      return;
    }

    try {
      // Получаем дату рождения из state
      const birthDate = new Date(
        parseInt(state.year, 10),
        parseInt(state.month, 10) - 1, // месяцы в JS начинаются с 0
        parseInt(state.day, 10)
      );
      const nameSum = sumNameLetters(state.name);
      const arcana = new ArcanaCalculator();

      // Пересчитываем ВСЕ арканы для новой даты (все зависят от текущей даты)
      const currentDate = new Date();
      const morning = arcana.calculateMorning(birthDate, currentDate);
      const dayArcana = arcana.calculateDay(birthDate, currentDate);
      const evening = arcana.calculateEvening(nameSum, currentDate);
      const night = arcana.calculateNight(morning, dayArcana, evening);

      // Обновляем state
      setState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          arcana: {
            morning,
            day: dayArcana,
            evening,
            night,
          },
        },
        lastCalculationDate: new Date().toISOString(),
      }));

      // Сохраняем в localStorage
      const newDate = new Date().toISOString();
      localStorage.setItem('lastCalculationDate', newDate);
      localStorage.setItem('arcanaData', serializeArcanaData({
        morning,
        day: dayArcana,
        evening,
        night,
      }));

      console.log('[Calculator] Arcana recalculated at midnight:', {
        morning,
        day: dayArcana,
        evening,
        night,
      });
    } catch (error) {
      console.error('[Calculator] Failed to recalculate arcana:', error);
    }
  };

  // Проверка при открытии страницы после полуночи
  useEffect(() => {
    const lastDate = localStorage.getItem('lastCalculationDate');
    
    if (lastDate && state.results?.arcana) {
      const lastCalculation = new Date(lastDate);
      const now = new Date();
      
      // Сравниваем даты (игнорируя время)
      if (lastCalculation.toDateString() !== now.toDateString()) {
        console.log('[Calculator] Date changed since last calculation, recalculating...');
        recalculateArcana();
      }
    }
  }, [state.results?.arcana]);

  // Автообновление в полночь через useMidnightCheck
  useMidnightCheck({
    onMidnight: () => {
      console.log('[Calculator] Midnight reached, recalculating arcana...');
      recalculateArcana();
    },
    enabled: !!state.results?.arcana,
    checkIntervalMs: 60000, // Проверка каждую минуту
  });

  const collectArcanas = async (arcanaNumbers: number[]) => {
    if (!userId) return;

    try {
      const response = await fetch('/api/arcana/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          arcanaNumbers,
        }),
      });

      if (!response.ok) {
        console.error('Failed to collect arcanas');
      }
    } catch (error) {
      console.error('Error collecting arcanas:', error);
    }
  };

  const loadArticles = async (results: any) => {
    try {
      const destinyArticle = results.destinyNumber
        ? await getDestinyNumberArticle(results.destinyNumber.value, locale)
        : null;

      const matrixArticles = new Map<string, Article | null>();
      if (results.matrix) {
        for (const [positionName, value] of results.matrix.positions.entries()) {
          const article = await getMatrixPositionArticle(positionName, value, locale);
          matrixArticles.set(positionName, article);
        }
      }

      const squareArticles = new Map<number, Article | null>();
      if (results.square) {
        for (const [digit, count] of results.square.digitCounts.entries()) {
          const article = await getSquareCellArticle(digit, count, locale);
          squareArticles.set(digit, article);
        }
      }

      setState(prev => ({
        ...prev,
        articles: {
          destinyArticle,
          matrixArticles,
          squareArticles,
        },
      }));
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  };

  const handleCalculate = async () => {
    // Reset errors
    setState(prev => ({ ...prev, errors: {} }));

    // Validate name
    if (!state.name.trim()) {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, name: t('nameRequired') }
      }));
      return;
    }


    // Validate and parse date
    const day = parseInt(state.day, 10);
    const month = parseInt(state.month, 10);
    const year = parseInt(state.year, 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, date: t('invalidDate') }
      }));
      return;
    }

    const dateValidation = validateBirthDate({ day, month, year });
    if (!dateValidation.isValid) {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, date: dateValidation.error || t('invalidDate') }
      }));
      return;
    }

    // Perform calculations
    try {
      const date = { day, month, year };
      
      // Проверяем кеш перед выполнением расчетов
      let cachedResult = calculationCache.get(date);
      
      if (cachedResult) {
        // Результат найден в кеше
        const birthDate = new Date(year, month - 1, day);
        const nameSum = sumNameLetters(state.name);
        const arcana = new ArcanaCalculator();
        
        // Пересчитываем ВСЕ арканы (все зависят от текущей даты)
        const currentDate = new Date();
        const morning = arcana.calculateMorning(birthDate, currentDate);
        const dayArcana = arcana.calculateDay(birthDate, currentDate);
        const evening = arcana.calculateEvening(nameSum, currentDate);
        const night = arcana.calculateNight(morning, dayArcana, evening);

        // Сохраняем дату расчета
        const calculationDate = new Date().toISOString();
        localStorage.setItem('lastCalculationDate', calculationDate);
        localStorage.setItem('arcanaData', serializeArcanaData({
          morning,
          day: dayArcana,
          evening,
          night,
        }));

        setState(prev => ({
          ...prev,
          results: {
            workingNumbers: cachedResult.workingNumbers,
            square: cachedResult.pythagoreanSquare,
            destinyNumber: cachedResult.destinyNumber,
            matrix: cachedResult.destinyMatrix,
            arcana: {
              morning,
              day: dayArcana,
              evening,
              night,
            },
          },
          fromCache: true,
          lastCalculationDate: calculationDate,
        }));

        // Load articles for cached results
        loadArticles({
          workingNumbers: cachedResult.workingNumbers,
          square: cachedResult.pythagoreanSquare,
          destinyNumber: cachedResult.destinyNumber,
          matrix: cachedResult.destinyMatrix,
        });

        // Collect arcanas if user is logged in
        if (userId) {
          collectArcanas([morning, dayArcana, evening, night]);
        }
        
        return;
      }

      // Кеш пуст - выполняем полные расчеты
      const pythagorean = new PythagoreanCalculator();
      const destiny = new DestinyCalculator();
      const arcana = new ArcanaCalculator();
      const nameSum = sumNameLetters(state.name);

      // Calculate all results
      const workingNumbers = pythagorean.calculateWorkingNumbers(date);
      const square = pythagorean.buildSquare(date, workingNumbers);
      const destinyNumber = destiny.calculateDestinyNumber(date);
      const matrix = destiny.calculateDestinyMatrix(date);

      // Сохраняем в кеш (без арканов, так как они зависят от имени и текущей даты)
      calculationCache.set(date, {
        birthDate: date,
        workingNumbers,
        pythagoreanSquare: square,
        destinyNumber,
        destinyMatrix: matrix,
      });

      // Calculate arcana (Card of the Day) - используем новый алгоритм
      const birthDate = new Date(year, month - 1, day);
      const currentDate = new Date();
      const morning = arcana.calculateMorning(birthDate, currentDate);
      const dayArcana = arcana.calculateDay(birthDate, currentDate);
      const evening = arcana.calculateEvening(nameSum, currentDate);
      const night = arcana.calculateNight(morning, dayArcana, evening);

      // Сохраняем имя пользователя
      if (state.name.trim()) {
        await saveUserName(state.name);
      }

      // Сохраняем дату расчета
      const calculationDate = new Date().toISOString();
      localStorage.setItem('lastCalculationDate', calculationDate);
      localStorage.setItem('arcanaData', serializeArcanaData({
        morning,
        day: dayArcana,
        evening,
        night,
      }));

      setState(prev => ({
        ...prev,
        results: {
          workingNumbers,
          square,
          destinyNumber,
          matrix,
          arcana: {
            morning,
            day: dayArcana,
            evening,
            night,
          },
        },
        fromCache: false,
        lastCalculationDate: calculationDate,
      }));

      // Load articles for new results
      loadArticles({
        workingNumbers,
        square,
        destinyNumber,
        matrix,
      });

      // Collect arcanas if user is logged in
      if (userId) {
        collectArcanas([morning, dayArcana, evening, night]);
        
        // Auto-save calculation to database
        try {
          await saveCalculation(
            date,
            'all',
            {
              workingNumbers,
              pythagoreanSquare: square,
              destinyNumber,
              destinyMatrix: matrix,
            }
          );
          console.log('Calculation saved to database');
        } catch (saveError) {
          console.error('Failed to save calculation:', saveError);
          // Не показываем ошибку пользователю, просто логируем
        }
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, date: 'Ошибка при расчете' }
      }));
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 text-white animate-fade-in">
        {t('title')}
      </h1>

      {/* Input Form */}
      <div className="glass-strong rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 animate-slide-up shadow-xl border border-[#FFD700]/20">
        <div className="mb-4">
          <Input
            type="text"
            value={state.name}
            onChange={(value) => setState(prev => ({ ...prev, name: value }))}
            label={t('name')}
            placeholder={t('namePlaceholder')}
            error={state.errors.name}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
          {/* Day Select */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              {t('day')}
            </label>
            <select
              value={state.day}
              onChange={(e) => setState(prev => ({ ...prev, day: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1a0b2e]/50 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all"
            >
              <option value="">{locale === 'ru' ? 'День' : 'Day'}</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day.toString().padStart(2, '0')}>
                  {day.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          {/* Month Select */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              {t('month')}
            </label>
            <select
              value={state.month}
              onChange={(e) => setState(prev => ({ ...prev, month: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1a0b2e]/50 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all"
            >
              <option value="">{locale === 'ru' ? 'Месяц' : 'Month'}</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month.toString().padStart(2, '0')}>
                  {month.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          {/* Year Select */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              {t('year')}
            </label>
            <select
              value={state.year}
              onChange={(e) => setState(prev => ({ ...prev, year: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1a0b2e]/50 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all"
            >
              <option value="">{locale === 'ru' ? 'Год' : 'Year'}</option>
              {Array.from({ length: 125 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {state.errors.date && (
          <p className="text-red-400 text-sm mb-4 animate-shake">{state.errors.date}</p>
        )}

        <button
          onClick={handleCalculate}
          className="w-full min-h-[44px] bg-gradient-to-r from-[#2D1B4E] to-purple-700 hover:from-purple-700 hover:to-[#2D1B4E] active:scale-95 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] border border-[#FFD700]/30"
        >
          {t('calculate')}
        </button>
      </div>

      {/* Results */}
      {state.results && (
        <div className="space-y-6 sm:space-y-8">
          {/* Ad Banner - First in results */}
          <div className="animate-fade-in">
            <AdBanner />
          </div>

          {/* Персонализированное приветствие */}
          {state.name && state.results.arcana && (
            <PersonalizedGreeting 
              userName={state.name}
              arcanaNumber={state.results.arcana.day}
              arcanaTitle={state.articles?.destinyArticle?.title}
            />
          )}

          {/* Cache indicator */}
          {state.fromCache && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center animate-fade-in">
              <span className="text-green-300 text-sm sm:text-base">
                {t('fromCache')}
              </span>
            </div>
          )}

          {/* Card of the Day */}
          <div className="animate-fade-in-up animation-delay-100">
            <CardOfDay arcana={state.results.arcana!} />
          </div>

          {/* Pythagorean Square */}
          {state.results.square && (
            <div className="animate-fade-in-up animation-delay-300">
              <ResultSection title={t('pythagoreanSquare')}>
                <PythagoreanSquareDisplay 
                  square={state.results.square.cells.flat()}
                  squareData={state.results.square}
                  articles={state.articles?.squareArticles}
                />
              </ResultSection>
            </div>
          )}

          {/* Destiny Number */}
          {state.results.destinyNumber && (
            <div className="animate-fade-in-up animation-delay-400">
              <ResultSection title={t('destinyNumber')}>
                <div className="text-center">
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#FFD700] mb-2 animate-pulse-slow drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                    {state.results.destinyNumber.value}
                  </div>
                  {state.results.destinyNumber.isMasterNumber && (
                    <div className="text-purple-300 text-sm sm:text-base animate-glow">Мастер-число</div>
                  )}
                </div>
                
                {/* Destiny Number Article */}
                {state.articles?.destinyArticle && (
                  <div className="mt-6 p-4 glass rounded-lg border border-purple-400/20">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#FFD700] mb-3">
                      {state.articles.destinyArticle.title}
                    </h3>
                    <div className="text-sm sm:text-base text-gray-200 whitespace-pre-wrap">
                      {state.articles.destinyArticle.content}
                    </div>
                  </div>
                )}
              </ResultSection>
            </div>
          )}

          {/* Destiny Matrix */}
          {state.results.matrix && (
            <div className="animate-fade-in-up animation-delay-500">
              <ResultSection title={t('destinyMatrix')}>
                <DestinyMatrixDisplay 
                  matrix={state.results.matrix} 
                  articles={state.articles?.matrixArticles}
                />
              </ResultSection>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper Components
function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-strong rounded-lg p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-shadow border border-purple-400/20">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">{title}</h2>
      {children}
    </div>
  );
}
