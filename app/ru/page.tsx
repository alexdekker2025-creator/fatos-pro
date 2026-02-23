'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Calculator from '@/components/Calculator';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';
import PremiumServices from '@/components/PremiumServices';
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
              href="/ru/about" 
              className="inline-block px-4 sm:px-6 py-2 min-h-[44px] glass hover:glass-strong active:scale-95 text-white rounded-lg transition-all text-sm sm:text-base border border-purple-400/30 hover:border-purple-400/50"
            >
              О проекте
            </Link>
            <Link 
              href="/ru/faq" 
              className="inline-block px-4 sm:px-6 py-2 min-h-[44px] glass hover:glass-strong active:scale-95 text-white rounded-lg transition-all text-sm sm:text-base border border-purple-400/30 hover:border-purple-400/50"
            >
              FAQ
            </Link>
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

        <Calculator userId={user?.id} />

        {/* Premium Services Section */}
        <div className="mt-12 sm:mt-16">
          <PremiumServices />
        </div>
      </div>
    </main>
  );
}
