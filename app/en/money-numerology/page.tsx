'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';
import AuthModal from '@/components/AuthModal';

// Money code digit descriptions
const digitDescriptions: Record<number, string> = {
  1: 'Leadership, initiative, independence. Money comes through personal projects, courage, and being first.',
  2: 'Partnership, diplomacy, cooperation. Money comes through alliances, teamwork, and trusting relationships.',
  3: 'Creativity, communication, self-expression. Money comes through creativity, publicity, and inspiring others.',
  4: 'Stability, work, structure. Money comes through hard work, systems, and reliability.',
  5: 'Freedom, change, risk. Money comes through new opportunities, travel, and flexibility.',
  6: 'Care, home, harmony. Money comes through comfort, family, and helping others.',
  7: 'Knowledge, analysis, spirituality. Money comes through expertise, depth, and unique knowledge.',
  8: 'Power, resources, scale. You can manage finances if you\'re not afraid of scale.',
  9: 'Wisdom, completion, service. Money comes through helping the world and completing big projects.'
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function MoneyNumerologyPage() {
  const { user } = useAuth();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [moneyCode, setMoneyCode] = useState<number[] | null>(null);
  const [visibleDigits, setVisibleDigits] = useState<number>(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const calculateMoneyCode = () => {
    // Check if user is logged in
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (!d || !m || !y) return;

    // Function to reduce number to single digit
    const reduceToSingle = (num: number): number => {
      while (num > 9) {
        num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      }
      return num;
    };

    // 1. Day
    const digit1 = reduceToSingle(d);
    
    // 2. Month
    const digit2 = reduceToSingle(m);
    
    // 3. Year
    const digit3 = reduceToSingle(y);
    
    // 4. Sum of first three
    const digit4 = reduceToSingle(digit1 + digit2 + digit3);

    const code = [digit1, digit2, digit3, digit4];
    setMoneyCode(code);
    setVisibleDigits(0);
    
    // Animate digits appearing one by one
    code.forEach((_, index) => {
      setTimeout(() => {
        setVisibleDigits(index + 1);
      }, index * 300); // 300ms delay between digits
    });
  };

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
            Discover Your Personal Money Code
          </h1>
          <p className="text-purple-200 text-lg">
            Unlock your path to financial success through numerology
          </p>
        </div>

        {/* Calculator */}
        <div className="mb-8 glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6 text-center">
            Enter your birth date
          </h2>
          
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Day Select */}
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50"
              >
                <option value="" className="bg-purple-900">Day</option>
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
                <option value="" className="bg-purple-900">Month</option>
                {monthNames.map((m, i) => (
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
                <option value="" className="bg-purple-900">Year</option>
                {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y} className="bg-purple-900">
                    {y}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={calculateMoneyCode}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-purple-950 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Calculate
            </button>
          </div>
        </div>

        {/* Result */}
        {moneyCode && (
          <div className="mb-8 glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30 animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6 text-center">
              Your Money Code
            </h2>
            
            {/* Code Display */}
            <div className="flex justify-center gap-4 mb-8">
              {moneyCode.map((digit, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-3xl sm:text-4xl font-bold text-purple-950 shadow-lg transition-all duration-500 ${
                    index < visibleDigits 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-50'
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  {digit}
                </div>
              ))}
            </div>

            {/* Descriptions */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                What these numbers mean:
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

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-lg p-6 border border-amber-500/30 text-center">
              <p className="text-white text-lg mb-4">
                Want to learn how to activate this code and remove financial blocks?
              </p>
              <Link
                href="/en#premium-services"
                className="inline-block py-3 px-8 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-purple-950 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Choose a Plan
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </main>
  );
}
