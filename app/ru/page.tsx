'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Calculator from '@/components/Calculator';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';
import PremiumServices from '@/components/PremiumServices';
import AdCarousel from '@/components/AdCarousel';
import { useAuth } from '@/lib/hooks/useAuth';

export default function RuPage() {
  const t = useTranslations();
  const { user } = useAuth();

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-[#2D1B4E] via-purple-900 to-indigo-950 relative overflow-hidden">
      <StarryBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Auth */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 animate-fade-in">
          <div className="flex-1"></div>
          <AuthButton />
        </div>

        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <Link href="/ru" className="inline-block">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-white hover:text-[#FFD700] transition-colors cursor-pointer animate-glow">
              FATOS.pro
            </h1>
          </Link>
          <p className="text-purple-200 mb-3 sm:mb-4 text-lg sm:text-xl">
            {t('home.subtitle')}
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Link 
              href="/en" 
              className="inline-block px-4 sm:px-6 py-2 min-h-[44px] glass hover:glass-strong active:scale-95 text-white rounded-lg transition-all text-sm sm:text-base border border-[#FFD700]/30 hover:border-[#FFD700]/50"
            >
              Switch to English
            </Link>
            {user && (
              <>
                <Link 
                  href="/ru/history" 
                  className="inline-block px-4 sm:px-6 py-2 min-h-[44px] glass hover:glass-strong active:scale-95 text-white rounded-lg transition-all text-sm sm:text-base border border-purple-400/30 hover:border-purple-400/50"
                >
                  📊 История расчетов
                </Link>
                <Link 
                  href="/ru/profile" 
                  className="inline-block px-4 sm:px-6 py-2 min-h-[44px] glass hover:glass-strong active:scale-95 text-white rounded-lg transition-all text-sm sm:text-base border border-purple-400/30 hover:border-purple-400/50"
                >
                  📚 Моя коллекция арканов
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Numerology Services Grid */}
        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
            Выберите расчет
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Квадрат Пифагора */}
            <Link 
              href="/ru/pythagorean"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-900/20 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <div className="p-6">
                <div className="text-4xl mb-3">🔢</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  Квадрат Пифагора
                </h3>
                <p className="text-purple-200 text-sm">
                  Узнайте свои сильные стороны и таланты
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            {/* Матрица Судьбы */}
            <Link 
              href="/ru/matrix"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 backdrop-blur-sm border border-indigo-400/30 hover:border-indigo-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/50"
            >
              <div className="p-6">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  Матрица Судьбы
                </h3>
                <p className="text-indigo-200 text-sm">
                  Раскройте свое предназначение
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            {/* Денежная Нумерология */}
            <Link 
              href="/ru/money-numerology"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-600/20 to-amber-900/20 backdrop-blur-sm border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50"
            >
              <div className="p-6">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  Денежная Нумерология
                </h3>
                <p className="text-amber-200 text-sm">
                  Откройте путь к финансовому успеху
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            {/* Годовой Прогноз */}
            <div 
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-600/20 to-pink-900/20 backdrop-blur-sm border border-pink-400/30 opacity-60 cursor-not-allowed"
            >
              <div className="p-6">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Годовой Прогноз
                </h3>
                <p className="text-pink-200 text-sm">
                  Узнайте, что ждет вас в этом году
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">
                  Скоро
                </span>
              </div>
            </div>

            {/* Детская Нумерология */}
            <div 
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-600/20 to-cyan-900/20 backdrop-blur-sm border border-cyan-400/30 opacity-60 cursor-not-allowed"
            >
              <div className="p-6">
                <div className="text-4xl mb-3">👶</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Детская Нумерология
                </h3>
                <p className="text-cyan-200 text-sm">
                  Раскройте потенциал вашего ребенка
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">
                  Скоро
                </span>
              </div>
            </div>

            {/* Совместимость */}
            <div 
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-600/20 to-rose-900/20 backdrop-blur-sm border border-rose-400/30 opacity-60 cursor-not-allowed"
            >
              <div className="p-6">
                <div className="text-4xl mb-3">💕</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Совместимость
                </h3>
                <p className="text-rose-200 text-sm">
                  Проверьте совместимость с партнером
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-rose-500/20 text-rose-300 text-xs rounded-full">
                  Скоро
                </span>
              </div>
            </div>
          </div>
        </div>

        <Calculator userId={user?.id} />

        {/* Ad Banner */}
        <div className="mt-3 sm:mt-4">
          <AdCarousel />
        </div>

        {/* Premium Services Section */}
        <div className="mt-6 sm:mt-8">
          <PremiumServices />
        </div>
      </div>
    </main>
  );
}
