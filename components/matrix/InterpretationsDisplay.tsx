'use client';

import React, { useState } from 'react';
import { DestinyMatrixResult } from '@/lib/calculators/destinyMatrix';
import { getArcanaField, getUniqueArcana } from '@/lib/interpretations/destinyMatrixInterpretations';

interface InterpretationsDisplayProps {
  result: DestinyMatrixResult;
}

interface Section {
  title: string;
  field: 'positive' | 'negative' | 'communication' | 'superpower' | 'health' | 'purpose' | 'tests' | 'love';
  arcanaNumbers: number[];
}

/**
 * InterpretationsDisplay Component
 * Displays 7 collapsible sections with arcana interpretations
 * Filters duplicate arcana (shows each only once)
 */
export default function InterpretationsDisplay({ result }: InterpretationsDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  // Collect all arcana numbers from the result
  const allArcana = [
    result.A,
    result.B,
    result.C,
    result.D,
    result.E,
    result.F,
    result.G,
    result.H,
    result.X,
    result.chakra1.K1,
    result.chakra2.K2,
    result.chakra3.K3,
    result.chakra4.K4,
    result.chakra5.K5,
    result.chakra6.K6,
    result.totals.T1,
    result.totals.T2,
    result.totals.T3,
  ];

  // Get unique arcana numbers
  const uniqueArcana = getUniqueArcana(allArcana);

  // Define sections with their corresponding fields
  const sections: Section[] = [
    {
      title: 'Личные качества',
      field: 'positive',
      arcanaNumbers: uniqueArcana,
    },
    {
      title: 'Таланты',
      field: 'superpower',
      arcanaNumbers: uniqueArcana,
    },
    {
      title: 'Прошлые жизни',
      field: 'negative',
      arcanaNumbers: uniqueArcana,
    },
    {
      title: 'Здоровье',
      field: 'health',
      arcanaNumbers: uniqueArcana,
    },
    {
      title: 'Предназначение',
      field: 'purpose',
      arcanaNumbers: uniqueArcana,
    },
    {
      title: 'Испытания',
      field: 'tests',
      arcanaNumbers: uniqueArcana,
    },
    {
      title: 'Отношения',
      field: 'love',
      arcanaNumbers: uniqueArcana,
    },
  ];

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {sections.map((section, index) => {
        const isExpanded = expandedSections.has(index);

        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              aria-expanded={isExpanded}
              aria-controls={`section-content-${index}`}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {section.title}
              </h3>
              <svg
                className={`w-6 h-6 text-gray-600 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Section Content */}
            {isExpanded && (
              <div
                id={`section-content-${index}`}
                className="px-6 py-4 border-t border-gray-200 max-h-96 overflow-y-auto"
              >
                <div className="space-y-6">
                  {section.arcanaNumbers.map((arcanaNumber) => {
                    const content = getArcanaField(arcanaNumber, section.field);
                    if (!content) return null;

                    return (
                      <div key={arcanaNumber} className="space-y-2">
                        <h4 className="font-semibold text-purple-600">
                          Аркан {arcanaNumber}
                        </h4>
                        <div
                          className="text-gray-700 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
