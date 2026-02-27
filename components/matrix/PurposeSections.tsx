'use client';

import React from 'react';
import Image from 'next/image';
import { DestinyMatrixResult } from '@/lib/calculators/destinyMatrix';

interface PurposeSectionsProps {
  result: DestinyMatrixResult;
}

/**
 * PurposeSections Component
 * Displays three purpose sections with ellipse diagrams:
 * - Personal (20-40 years): LN, LZ, LP1
 * - Social (40-60 years): LO, LM, Y
 * - Spiritual (60+ years): LP1, Y, LP3
 */
export default function PurposeSections({ result }: PurposeSectionsProps) {
  const sections = [
    {
      title: 'Личное',
      subtitle: '(20-40 лет)',
      values: [
        { label: 'ЛН', value: result.personal.LN },
        { label: 'ЛЗ', value: result.personal.LZ },
        { label: 'ЛП1', value: result.personal.LP1 },
      ],
    },
    {
      title: 'Социальное',
      subtitle: '(40-60 лет)',
      values: [
        { label: 'ЛО', value: result.social.LO },
        { label: 'ЛМ', value: result.social.LM },
        { label: 'Y', value: result.social.Y },
      ],
    },
    {
      title: 'Духовное',
      subtitle: '(60+ лет)',
      values: [
        { label: 'ЛП1', value: result.spirit.LP1 },
        { label: 'Y', value: result.spirit.Y },
        { label: 'ЛП3', value: result.spirit.LP3 },
      ],
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg p-6">
      {/* Desktop/Tablet Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 gap-8 justify-items-center">
        {sections.map((section, index) => (
          <div key={index} className="flex flex-col items-center max-w-[160px]">
            <h3 className="text-base font-semibold text-gray-900 text-center mb-1">
              {section.title}
            </h3>
            <p className="text-sm text-gray-700 text-center mb-6">
              {section.subtitle}
            </p>

            {/* Ellipse Diagram */}
            <div className="relative w-[95px] mt-[55px]">
              <Image
                src="/matrix/elipses.svg"
                alt={section.title}
                width={95}
                height={150}
                className="w-full h-auto"
              />

              {/* Positioned Numbers */}
              <div className="absolute top-[8px] left-0 w-[30px] flex items-center justify-center text-sm font-bold text-purple-700">
                {section.values[0].value}
              </div>
              <div className="absolute top-[8px] left-[64.3px] w-[30px] flex items-center justify-center text-sm font-bold text-purple-700">
                {section.values[1].value}
              </div>
              <div className="absolute top-[48px] left-[30.5px] w-[30px] flex items-center justify-center text-sm font-bold text-purple-700">
                {section.values[2].value}
              </div>
            </div>

            {/* Labels */}
            <div className="flex items-center gap-2 mt-3">
              <h4 className="text-sm font-semibold text-gray-900 mr-1.5">
                Итого
              </h4>
              {section.values.map((item, idx) => (
                <div
                  key={idx}
                  className="w-[35px] h-[35px] rounded-full border-2 border-purple-600 flex items-center justify-center text-sm font-bold text-purple-700"
                >
                  {item.value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Stacked Layout */}
      <div className="md:hidden flex flex-col gap-8">
        {sections.map((section, index) => (
          <div key={index} className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
              {section.title}
            </h3>
            <p className="text-base text-gray-700 text-center mb-6">
              {section.subtitle}
            </p>

            {/* Ellipse Diagram */}
            <div className="relative w-[95px] mt-[55px]">
              <Image
                src="/matrix/elipses.svg"
                alt={section.title}
                width={95}
                height={150}
                className="w-full h-auto"
              />

              {/* Positioned Numbers */}
              <div className="absolute top-[12px] left-0 w-[30px] flex items-center justify-center text-sm font-bold text-purple-700">
                {section.values[0].value}
              </div>
              <div className="absolute top-[12px] left-[64.3px] w-[30px] flex items-center justify-center text-sm font-bold text-purple-700">
                {section.values[1].value}
              </div>
              <div className="absolute top-[52px] left-[30.5px] w-[30px] flex items-center justify-center text-sm font-bold text-purple-700">
                {section.values[2].value}
              </div>
            </div>

            {/* Labels */}
            <div className="flex items-center gap-2 mt-3">
              <h4 className="text-sm font-semibold text-gray-900 mr-1.5">
                Итого
              </h4>
              {section.values.map((item, idx) => (
                <div
                  key={idx}
                  className="w-[30px] h-[30px] rounded-full border-2 border-purple-600 flex items-center justify-center text-sm font-bold text-purple-700"
                >
                  {item.value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
