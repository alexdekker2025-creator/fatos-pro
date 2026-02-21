'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Input } from '@/components/ui';
import { validateBirthDate } from '@/lib/validation/date';
import { sumNameLetters } from '@/lib/validation/name';
import { PythagoreanCalculator } from '@/lib/calculators/pythagorean';
import { DestinyCalculator } from '@/lib/calculators/destiny';
import { ArcanaCalculator } from '@/lib/arcana/arcanaCalculator';
import { calculationCache } from '@/lib/services/cache';
import { useCalculations } from '@/lib/hooks/useCalculations';
import { useArticles, Article } from '@/lib/hooks/useArticles';
import CardOfDay from './CardOfDay';
import PythagoreanSquareDisplay from './PythagoreanSquareDisplay';
import DestinyMatrixDisplay from './DestinyMatrixDisplay';
import PersonalizedGreeting from './PersonalizedGreeting';

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
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setState(prev => ({ ...prev, name: savedName }));
    }
  }, []);

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
        const nameSum = sumNameLetters(state.name);
        const arcana = new ArcanaCalculator();
        
        // Пересчитываем только арканы (зависят от имени и текущей даты)
        const morning = arcana.calculateMorning(day);
        const dayArcana = arcana.calculateDay(new Date());
        const evening = arcana.calculateEvening(nameSum, morning, dayArcana);
        const night = arcana.calculateNight(dayArcana, evening);

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

      // Calculate arcana (Card of the Day)
      const morning = arcana.calculateMorning(day);
      const dayArcana = arcana.calculateDay(new Date());
      const evening = arcana.calculateEvening(nameSum, morning, dayArcana);
      const night = arcana.calculateNight(dayArcana, evening);

      // Сохраняем имя пользователя в localStorage
      if (state.name.trim()) {
        localStorage.setItem('userName', state.name.trim());
      }

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          <Input
            type="number"
            value={state.day}
            onChange={(value) => setState(prev => ({ ...prev, day: value }))}
            label={t('day')}
            placeholder="15"
          />
          <Input
            type="number"
            value={state.month}
            onChange={(value) => setState(prev => ({ ...prev, month: value }))}
            label={t('month')}
            placeholder="8"
          />
          <Input
            type="number"
            value={state.year}
            onChange={(value) => setState(prev => ({ ...prev, year: value }))}
            label={t('year')}
            placeholder="1990"
          />
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

          {/* Working Numbers */}
          {state.results.workingNumbers && (
            <div className="animate-fade-in-up animation-delay-200">
              <ResultSection title={t('workingNumbers')}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {Object.entries(state.results.workingNumbers).map(([key, value]) => {
                  // Русские названия для рабочих чисел
                  const workingNumberNames: Record<string, string> = {
                    first: locale === 'ru' ? 'Первое рабочее число' : 'First Working Number',
                    second: locale === 'ru' ? 'Второе рабочее число' : 'Second Working Number',
                    third: locale === 'ru' ? 'Третье рабочее число' : 'Third Working Number',
                    fourth: locale === 'ru' ? 'Четвёртое рабочее число' : 'Fourth Working Number',
                  };
                  
                  return (
                    <div key={key} className="glass p-3 sm:p-4 rounded-lg text-center hover:glass-strong transition-all hover:scale-105 border border-purple-400/20">
                      <div className="text-xl sm:text-2xl font-bold text-[#FFD700]">{value as number}</div>
                      <div className="text-xs sm:text-sm text-purple-200 mt-1">{workingNumberNames[key] || key}</div>
                    </div>
                  );
                })}
              </div>
            </ResultSection>
            </div>
          )}

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
          <div className="animate-fade-in-up animation-delay-500">
            <ResultSection title={t('destinyMatrix')}>
              <DestinyMatrixDisplay 
                matrix={state.results.matrix} 
                articles={state.articles?.matrixArticles}
              />
            </ResultSection>
          </div>
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
