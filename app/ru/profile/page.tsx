'use client';

import { useState } from 'react';
import Link from 'next/link';
import ArcanaCollection from '@/components/ArcanaCollection';

export default function ProfilePage() {
  // For demo purposes, using a test user ID
  // In production, this would come from authentication
  const [userId] = useState('demo-user-123');

  return (
    <main className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <Link href="/ru" className="inline-block mb-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-white hover:text-purple-200 transition-colors cursor-pointer">
              FATOS.pro
            </h1>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-200 mb-4">
            Профиль
          </h2>
          <Link 
            href="/ru" 
            className="inline-block px-4 sm:px-6 py-2 min-h-[44px] bg-white/20 hover:bg-white/30 active:scale-95 text-white rounded-lg transition-all text-sm sm:text-base"
          >
            ← Назад к калькулятору
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <ArcanaCollection userId={userId} />
        </div>

        <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg text-center">
          <p className="text-purple-200 text-sm">
            💡 Совет: Выполняйте расчеты каждый день, чтобы собрать все 22 аркана!
          </p>
        </div>
      </div>
    </main>
  );
}
