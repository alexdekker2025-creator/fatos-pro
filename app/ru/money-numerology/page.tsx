'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';
import AuthModal from '@/components/AuthModal';

const digitDescriptions: Record<number, string> = {
  1: 'Лидерство, инициатива, независимость. Деньги приходят через личные проекты, смелость и умение быть первым.',
  2: 'Партнёрство, дипломатия, сотрудничество. Деньги приходят через союзы, команду, доверительные отношения.',
  3: 'Творчество, общение, самовыражение. Деньги приходят через креатив, публичность, умение вдохновлять.',
  4: 'Стабильность, труд, системность. Деньги приходят через упорную работу, структуру, надёжность.',
  5: 'Свобода, перемены, риск. Деньги приходят через новые возможности, путешествия, гибкость.',
  6: 'Забота, дом, гармония. Деньги приходят через уют, семью, помощь другим.',
  7: 'Знания, анализ, духовность. Деньги приходят через экспертность, глубину, уникальные знания.',
  8: 'Власть, ресурсы, масштаб. Вы умеете управлять финансами, если не боитесь масштаба.',
  9: 'Мудрость, завершение, служение. Деньги приходят через помощь миру, завершение больших дел.'
};

export default function MoneyNumerologyPage() {
  const { user } = useAuth();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [moneyCode, setMoneyCode] = useState<number[] | null>(null);
  const [visibleDigits, setVisibleDigits] = useState<number>(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const calculateMoneyCode = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (!d || !m || !y) return;

    const reduceToSingle = (num: number): number => {
      while (num > 9) {
        num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      }
      return num;
    };

    const digit1 = reduceToSingle(d);
    const digit2 = reduceToSingle(m);
    const digit3 = reduceToSingle(y);
    const digit4 = reduceToSingle(digit1 + digit2 + digit3);

    const code = [digit1, digit2, digit3, digit4];
    setMoneyCode(code);
    setVisibleDigits(0);
    
    code.forEach((_, index) => {
      setTimeout(() => {
        setVisibleDigits(index + 1);
      }, index * 300);
    });
  };

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      <StarryBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6 sm:mb-8 animate-fade-in">
          <Link href="/ru" className="text-white hover:text-purple-200 transition-colors">
             Назад
          </Link>
          <AuthButton />
        </div>

        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Узнайте свой личный денежный код
          </h1>
          <p className="text-purple-200 text-lg">
            Откройте путь к финансовому успеху через нумерологию
          </p>
        </div>

        <div className="mb-8 glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6 text-center">
            Введите дату рождения
          </h2>
          
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50"
              >
                <option value="" className="bg-purple-900">День</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d} className="bg-purple-900">{d}</option>
                ))}
              </select>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50"
              >
                <option value="" className="bg-purple-900">Месяц</option>
                {['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'].map((m, i) => (
                  <option key={i + 1} value={i + 1} className="bg-purple-900">{m}</option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50"
              >
                <option value="" className="bg-purple-900">Год</option>
                {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y} className="bg-purple-900">{y}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={calculateMoneyCode}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-purple-950 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Рассчитать
            </button>
          </div>
        </div>

        {moneyCode && (
          <div className="mb-8 glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30 animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6 text-center">
              Ваш денежный код
            </h2>
            
            <div className="flex justify-center gap-4 mb-8">
              {moneyCode.map((digit, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-3xl sm:text-4xl font-bold text-purple-950 shadow-lg transition-all duration-500 ${
                    index < visibleDigits ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {digit}
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Кратко, что означают эти цифры:
              </h3>
              {moneyCode.map((digit, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-purple-400/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-xl font-bold text-purple-950 flex-shrink-0">
                      {digit}
                    </div>
                    <p className="text-purple-200 text-sm leading-relaxed">
                      {digitDescriptions[digit]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-lg p-6 border border-amber-500/30 text-center">
              <p className="text-white text-lg mb-4">
                Хотите узнать, как активировать этот код и убрать финансовые блоки?
              </p>
              <Link
                href="/ru#premium-services"
                className="inline-block py-3 px-8 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-purple-950 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Выберите тариф
              </Link>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </main>
  );
}
