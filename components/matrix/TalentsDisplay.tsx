'use client';

import React from 'react';
import { DestinyMatrixResult } from '@/lib/calculators/destinyMatrix';
import { getArcanaField } from '@/lib/interpretations/destinyMatrixInterpretations';

interface TalentsDisplayProps {
  result: DestinyMatrixResult;
}

/**
 * TalentsDisplay Component
 * Displays T1, T2, T3 talent values with interpretations
 * Uses amber/gold gradient background styling
 */
export default function TalentsDisplay({ result }: TalentsDisplayProps) {
  const talents = [
    { label: 'T1', value: result.totals.T1 },
    { label: 'T2', value: result.totals.T2 },
    { label: 'T3', value: result.totals.T3 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-amber-100 via-amber-200 to-yellow-100 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-amber-900 mb-8">
          Таланты
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {talents.map((talent, index) => {
            const interpretation = getArcanaField(talent.value, 'superpower');

            return (
              <div
                key={index}
                className="flex flex-col items-center bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-md"
              >
                <div className="text-sm font-semibold text-amber-800 mb-3">
                  {talent.label}
                </div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg mb-4">
                  <span className="text-3xl font-bold text-white">
                    {talent.value}
                  </span>
                </div>
                {interpretation && (
                  <div
                    className="text-xs text-gray-700 text-center leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: interpretation }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
