'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCalculations } from '@/lib/hooks/useCalculations';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';
import CalculationCard from '@/components/CalculationCard';
import { Button } from '@/components/ui';

export default function HistoryPage() {
  const t = useTranslations();
  const { user, loading: authLoading } = useAuth();
  const { calculations, total, loading, error, loadCalculations } = useCalculations();
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    if (user) {
      loadCalculations(limit, page * limit);
    }
  }, [user, page, loadCalculations]);

  if (authLoading) {
    return (
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        <StarryBackground />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center text-white">Loading...</div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        <StarryBackground />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <Link
              href="/en"
              className="text-white hover:text-purple-200 transition-colors"
            >
              ← Back
            </Link>
            <AuthButton />
          </div>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Calculation History
            </h1>
            <p className="text-purple-200 mb-6">
              Please login to see your calculation history
            </p>
          </div>
        </div>
      </main>
    );
  }

  const totalPages = Math.ceil(total / limit);

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
            Calculation History
          </h1>
          <p className="text-purple-200">
            Total calculations: {total}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-white mb-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2">Loading...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && calculations.length === 0 && (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-6">
              <p className="text-white text-lg mb-4">
                You don&apos;t have any saved calculations yet
              </p>
              <Link href="/en">
                <Button variant="primary">
                  Make your first calculation
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Calculations Grid */}
        {!loading && calculations.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
              {calculations.map((calculation) => (
                <div key={calculation.id} className="animate-fade-in-up">
                  <CalculationCard calculation={calculation} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mb-8">
                <Button
                  variant="outline"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  ← Previous
                </Button>
                
                <span className="text-white">
                  Page {page + 1} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
