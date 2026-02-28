'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';
import { validateBirthDate } from '@/lib/validation/date';
import { DestinyMatrixCalculator, DestinyMatrixResult } from '@/lib/calculators/destinyMatrix';
import { calculateAge } from '@/lib/utils/ageCalculation';
import MatrixWithHealth from '@/components/matrix/MatrixWithHealth';

export default function MatrixPage() {
  const { user } = useAuth();
  
  // Calculator state
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [dateError, setDateError] = useState('');
  const [matrix, setMatrix] = useState<DestinyMatrixResult | null>(null);
  const [age, setAge] = useState<number | null>(null);

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
    
    // Calculate Destiny Matrix
    const calculator = new DestinyMatrixCalculator();
    const result = calculator.calculate(birthDate);
    setMatrix(result);
    
    // Calculate age
    const calculatedAge = calculateAge(birthDate);
    setAge(calculatedAge);
  };

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
            Матрица Судьбы
          </h1>
          <p className="text-purple-200">
            Ваш путь через призму арканов Таро
          </p>
        </div>

        {/* Info Block */}
        <div className="mb-8 glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-6 text-center">
            Матрица Судьбы: что это такое?
          </h2>

          <div className="space-y-6 text-purple-100">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Что это за система?
              </h3>
              <p className="text-purple-200 leading-relaxed">
                Матрица Судьбы — это метод нумерологического анализа личности, основанный на дате рождения 
                и системе арканов Таро. Это диаграмма, которая показывает ваши таланты, предназначение, 
                кармические задачи и жизненные циклы.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Как это работает?
              </h3>
              <p className="text-purple-200 leading-relaxed">
                Метод использует дату рождения для расчета ключевых арканов, которые влияют на разные 
                аспекты вашей жизни: личность, таланты, отношения, карьеру, здоровье и духовное развитие.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Что вы узнаете?
              </h3>
              <p className="text-purple-200 leading-relaxed">
                Матрица покажет ваши сильные стороны, скрытые таланты, кармические задачи, 
                особенности отношений с родителями и партнерами, а также ваш жизненный путь 
                и предназначение.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div className="mb-8 glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6 text-center">
            Введите данные для расчета
          </h2>
          
          <div className="max-w-md mx-auto space-y-4">
            {/* Name Input */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50 placeholder-purple-300"
            />
            
            <div className="grid grid-cols-3 gap-3">
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
              Рассчитать матрицу
            </button>
          </div>
        </div>

        {/* Matrix Display */}
        {matrix && (
          <div className="space-y-8 animate-fade-in">
            {/* Combined Matrix and Health */}
            <MatrixWithHealth 
              result={matrix}
              name={name}
              birthDate={{ day: parseInt(day), month: parseInt(month), year: parseInt(year) }}
              age={age}
            />
          </div>
        )}

        {/* Pricing Blocks - TODO: Add pricing tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-12">
          {/* Basic Tier */}
          <div className="glass-strong rounded-xl p-6 sm:p-8 border border-purple-400/30 flex flex-col">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="text-xl font-bold text-white mb-2">БАЗОВЫЙ РАЗБОР</h3>
              <div className="text-3xl font-bold text-amber-400 mb-1">2900 ₽</div>
              <div className="text-sm text-purple-300">$32</div>
            </div>
            
            <div className="flex-grow mb-6">
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Базовый разбор вашей Матрицы Судьбы с ключевыми арканами и их значениями.
              </p>

              <ul className="space-y-2 text-purple-200 text-sm">
                <li>✓ Расчет всех позиций матрицы</li>
                <li>✓ Основные арканы личности</li>
                <li>✓ Таланты и способности</li>
                <li>✓ PDF-отчет</li>
              </ul>
            </div>
            
            <button
              disabled
              className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-600 text-gray-400 cursor-not-allowed"
            >
              Скоро доступно
            </button>
          </div>

          {/* Full Tier */}
          <div className="glass-strong rounded-xl p-6 sm:p-8 border-2 border-amber-500/50 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-purple-950 text-xs font-bold px-3 py-1 rounded-bl-lg">
              🔥 ПОПУЛЯРНЫЙ
            </div>
            
            <div className="text-center mb-4 mt-2">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-2xl font-bold text-white mb-2">ПОЛНЫЙ РАЗБОР</h3>
              <div className="text-3xl font-bold text-amber-400 mb-1">4900 ₽</div>
              <div className="text-sm text-purple-300">$54</div>
            </div>
            
            <div className="flex-grow mb-6">
              <h4 className="text-white font-semibold mb-3 text-center">
                Всё из базового тарифа +
              </h4>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li>✓ Детальный разбор всех позиций</li>
                <li>✓ Кармические задачи</li>
                <li>✓ Отношения и совместимость</li>
                <li>✓ Линии судьбы</li>
                <li>✓ Персональные рекомендации</li>
              </ul>
            </div>
            
            <button
              disabled
              className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-600 text-gray-400 cursor-not-allowed"
            >
              Скоро доступно
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
