'use client';

import React from 'react';
import { DestinyMatrixResult } from '@/lib/calculators/destinyMatrix';

interface ParentsSectionProps {
  result: DestinyMatrixResult;
}

/**
 * ParentsSection Component
 * Displays parent energies in two columns:
 * - Man (Муж): E, G, X
 * - Woman (Жен): F, H, X
 */
export default function ParentsSection({ result }: ParentsSectionProps) {
  const parents = [
    {
      title: 'Муж',
      values: [result.parents.man.E, result.parents.man.G, result.parents.man.X],
    },
    {
      title: 'Жен',
      values: [result.parents.woman.F, result.parents.woman.H, result.parents.woman.X],
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg p-6">
      {/* Desktop/Tablet Layout */}
      <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-md mx-auto">
        {parents.map((parent, index) => (
          <div key={index} className="flex flex-col items-center">
            <h4 className="text-base font-semibold text-gray-900 mb-6 mt-6">
              {parent.title}
            </h4>
            <div className="flex items-center gap-3">
              {parent.values.map((value, idx) => (
                <div
                  key={idx}
                  className="w-[40px] h-[40px] rounded-full border-2 border-purple-600 flex items-center justify-center text-base font-bold text-purple-700"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Stacked Layout */}
      <div className="md:hidden flex flex-col gap-6">
        {parents.map((parent, index) => (
          <div key={index} className="flex flex-col items-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {parent.title}
            </h4>
            <div className="flex items-center gap-3">
              {parent.values.map((value, idx) => (
                <div
                  key={idx}
                  className="w-[40px] h-[40px] rounded-full border-2 border-purple-600 flex items-center justify-center text-base font-bold text-purple-700"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
