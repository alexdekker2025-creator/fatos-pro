'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Calculator from '@/components/Calculator';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';
import PremiumServices from '@/components/PremiumServices';
import { useAuth } from '@/lib/hooks/useAuth';

export default function EnPage() {
  const t = useTranslations();
  const { user } = useAuth();

  return (
    <main className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-[#2D1B4E] via-purple-900 to-indigo-950">
      <StarryBackground />
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header with Auth */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 animate-fade-in">
          <div className="flex-1"></div>
          <AuthButton />
        </div>

        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <Link href="/en" className="inline-block">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-white hover:text-[#FFD700] transition-colors cursor-pointer animate-glow">
              FATOS.pro
            </h1>
          </Link>
          <p className="text-purple-200 mb-3 sm:mb-4 text-lg sm:text-xl">
            {t('home.subtitle')}
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Link 
              href="/en/about" 
              className="inline-block px-4 sm:px-6 py-2 min-h-[44px] glass hover:glass-strong active:scale-95 text-white rounded-lg transition-all text-sm sm:text-base border border-purple-400/30 hover:border-purple-400/50"
            >
              About Us
            </Link>
            <Link 
              href="/en/faq" 
              className="inline-block px-4 sm:px-6 py-2 min-h-[44px] glass hover:glass-strong active:scale-95 text-white rounded-lg transition-all text-sm sm:text-base border border-purple-400/30 hover:border-purple-400/50"
            >
              FAQ
            </Link>
            <Link 
              href="/en/privacy" 
              className="inline-block px-4 sm:px-6 py-2 min-h-[44px] glass hover:glass-strong active:scale-95 text-white rounded-lg transition-all text-sm sm:text-base border border-purple-400/30 hover:border-purple-400/50"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/ru" 
              className="inline-block px-4 sm:px-6 py-2 min-h-[44px] glass hover:glass-strong active:scale-95 text-white rounded-lg transition-all text-sm sm:text-base border border-[#FFD700]/30 hover:border-[#FFD700]/50"
            >
              Переключить на русский
            </Link>
            {user && (
              <>
                <Link 
                  href="/en/history" 
                  className="inline-block px-4 sm:px-6 py-2 min-h-[44px] glass hover:glass-strong active:scale-95 text-white rounded-lg transition-all text-sm sm:text-base border border-purple-400/30 hover:border-purple-400/50"
                >
                  📊 Calculation History
                </Link>
                <Link 
                  href="/en/profile" 
                  className="inline-block px-4 sm:px-6 py-2 min-h-[44px] glass hover:glass-strong active:scale-95 text-white rounded-lg transition-all text-sm sm:text-base border border-purple-400/30 hover:border-purple-400/50"
                >
                  📚 My Arcana Collection
                </Link>
              </>
            )}
          </div>
        </div>

        <Calculator userId={user?.id} />

        {/* Premium Services Section */}
        <div className="mt-6 sm:mt-8">
          <PremiumServices />
        </div>
      </div>
    </main>
  );
}
