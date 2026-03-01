'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePurchases } from '@/lib/hooks/usePurchases';
import { useUpgradeEligibility } from '@/lib/hooks/useUpgradeEligibility';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';
import AuthModal from '@/components/AuthModal';
import UpgradeButton from '@/components/UpgradeButton';
import { validateBirthDate } from '@/lib/validation/date';
import { DestinyMatrixCalculator, DestinyMatrixResult } from '@/lib/calculators/destinyMatrix';
import { calculateAge } from '@/lib/utils/ageCalculation';
import MatrixWithHealth from '@/components/matrix/MatrixWithHealth';

export default function MatrixPage() {
  const { user } = useAuth();
  const { hasPurchased } = usePurchases();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [dateError, setDateError] = useState('');
  const [matrix, setMatrix] = useState<DestinyMatrixResult | null>(null);
  const [age, setAge] = useState<number | null>(null);
  
  // Check purchases
  const hasBasic = user && hasPurchased('matrix_basic');
  const hasFull = user && hasPurchased('matrix_full');
  
  // Check upgrade eligibility
  const { isEligible: isUpgradeEligible, upgradePrice } = useUpgradeEligibility('matrix_full');

  const handleCalculate = () => {
    // Check if user is logged in
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    const birthDate = {
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year)
    };
    
    const validation = validateBirthDate(birthDate);
    if (!validation.isValid) {
      setDateError(validation.error || 'Invalid date');
      return;
    }
    
    setDateError('');
    const calculator = new DestinyMatrixCalculator();
    const result = calculator.calculate(birthDate);
    setMatrix(result);
    const calculatedAge = calculateAge(birthDate);
    setAge(calculatedAge);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      <StarryBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6 sm:mb-8 animate-fade-in">
          <Link href="/en" className="text-white hover:text-purple-200 transition-colors">
            ← Back
          </Link>
          <AuthButton />
        </div>

        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Destiny Matrix
          </h1>
          <p className="text-purple-200">Your path through the lens of Tarot arcana</p>
        </div>

        <div className="mb-8 glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-6 text-center">
            Destiny Matrix: What is it?
          </h2>
          <div className="space-y-6 text-purple-100">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">What is this system?</h3>
              <p className="text-purple-200 leading-relaxed">
                Destiny Matrix is a method of numerological personality analysis based on date of birth and the Tarot arcana system. 
                It is a diagram that shows your talents, purpose, karmic tasks and life cycles.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">How does it work?</h3>
              <p className="text-purple-200 leading-relaxed">
                The method uses the date of birth to calculate key arcana that affect different aspects of your life: personality, 
                talents, relationships, career, health and spiritual development.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6 text-center">
            Enter Your Data for Calculation
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
              className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50 placeholder-purple-300" />
            
            <div className="grid grid-cols-3 gap-3">
              <select value={day} onChange={(e) => setDay(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50">
                <option value="" className="bg-purple-900">Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d} className="bg-purple-900">{d}</option>
                ))}
              </select>
              <select value={month} onChange={(e) => setMonth(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50">
                <option value="" className="bg-purple-900">Month</option>
                {monthNames.map((m, i) => (
                  <option key={i + 1} value={i + 1} className="bg-purple-900">{m}</option>
                ))}
              </select>
              <select value={year} onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px] bg-white/10 backdrop-blur-sm text-white border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50">
                <option value="" className="bg-purple-900">Year</option>
                {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y} className="bg-purple-900">{y}</option>
                ))}
              </select>
            </div>
            {dateError && <div className="text-red-400 text-sm mb-4 text-center">{dateError}</div>}
            <button onClick={handleCalculate}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-purple-950 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105">
              Calculate Matrix
            </button>
          </div>
        </div>

        {matrix && (
          <div className="space-y-8 animate-fade-in">
            <MatrixWithHealth 
              result={matrix}
              name={name}
              birthDate={{ day: parseInt(day), month: parseInt(month), year: parseInt(year) }}
              age={age}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-12">
          <div className="glass-strong rounded-xl p-6 sm:p-8 border border-purple-400/30 flex flex-col">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">🔮</div>
              <h3 className="text-xl font-bold text-white mb-2">DESTINY MATRIX — START</h3>
              <div className="text-3xl font-bold text-amber-400 mb-1">$39</div>
            </div>
            <div className="flex-grow mb-6">
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Your first step to understanding yourself. A map of your life based on your birth date. 22 arcana, 5 key positions.
              </p>
            </div>
            <button disabled className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-600 text-gray-400 cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          <div className="glass-strong rounded-xl p-6 sm:p-8 border-2 border-amber-500/50 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-purple-950 text-xs font-bold px-3 py-1 rounded-bl-lg">
              🔥 POPULAR
            </div>
            <div className="text-center mb-4 mt-2">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-xl font-bold text-white mb-2">DESTINY MATRIX — DEEP ANALYSIS</h3>
              <p className="text-purple-200 text-sm mb-3">Not just more pages. The answer to &quot;what to do with all this&quot;</p>
              <div className="text-3xl font-bold text-amber-400 mb-1">$61</div>
            </div>
            <div className="flex-grow mb-6">
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Full analysis including ancestral square, karmic tail, money zone, relationships zone, and practical recommendations.
              </p>
            </div>
            {/* Conditional button rendering based on purchase status and upgrade eligibility */}
            {hasFull ? (
              <div className="w-full py-3 px-6 rounded-lg font-semibold text-center bg-green-600 text-white">
                ✅ You have access
              </div>
            ) : hasBasic && isUpgradeEligible && upgradePrice ? (
              <UpgradeButton
                serviceId="matrix_full"
                price={upgradePrice}
                currency="USD"
                locale="en"
                onUpgradeClick={() => {}}
              />
            ) : !hasBasic && !hasFull ? (
              <button
                disabled={true}
                className="w-full py-3 px-6 rounded-lg font-semibold transition-all bg-gray-600 text-gray-400 cursor-not-allowed"
              >
                Coming Soon
              </button>
            ) : (
              <button
                disabled={true}
                className="w-full py-3 px-6 rounded-lg font-semibold transition-all bg-gray-600 text-gray-400 cursor-not-allowed"
              >
                Coming Soon
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </main>
  );
}
