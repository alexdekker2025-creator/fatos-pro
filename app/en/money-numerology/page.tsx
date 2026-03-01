'use client';

import Link from 'next/link';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';

export default function MoneyNumerologyPage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      <StarryBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 animate-fade-in">
          <Link
            href="/en"
            className="text-white hover:text-purple-200 transition-colors"
          >
            ← Back
          </Link>
          <AuthButton />
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Money Numerology
          </h1>
          <p className="text-purple-200">
            Unlock your path to financial success
          </p>
        </div>
      </div>
    </main>
  );
}
