'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DestinyMatrixResult } from '@/lib/calculators/destinyMatrix';
import { CHAKRAS } from '@/lib/data/chakraInfo';

interface HealthTableProps {
  result: DestinyMatrixResult;
}

/**
 * HealthTable Component
 * Displays the health table with 7 chakra rows and totals
 * Each chakra has three columns: Physical, Energy, Emotions
 * Responsive layout: table on desktop, stacked cards on mobile
 */
export default function HealthTable({ result }: HealthTableProps) {
  const [hoveredChakra, setHoveredChakra] = useState<number | null>(null);

  // Map chakra data from result
  const chakraData = [
    {
      chakra: CHAKRAS[0], // Муладхара
      physical: result.chakra1.C,
      energy: result.chakra1.D,
      emotions: result.chakra1.K1,
    },
    {
      chakra: CHAKRAS[1], // Свадхистана
      physical: result.chakra2.C2,
      energy: result.chakra2.D2,
      emotions: result.chakra2.K2,
    },
    {
      chakra: CHAKRAS[2], // Манипура
      physical: result.chakra3.X2,
      energy: result.chakra3.X,
      emotions: result.chakra3.K3,
    },
    {
      chakra: CHAKRAS[3], // Анахата
      physical: result.chakra4.A3,
      energy: result.chakra4.B3,
      emotions: result.chakra4.K4,
    },
    {
      chakra: CHAKRAS[4], // Вишудха
      physical: result.chakra5.A2,
      energy: result.chakra5.B2,
      emotions: result.chakra5.K5,
    },
    {
      chakra: CHAKRAS[5], // Аджна
      physical: result.chakra6.A1,
      energy: result.chakra6.B1,
      emotions: result.chakra6.K6,
    },
    {
      chakra: CHAKRAS[6], // Сахасрара
      physical: result.chakra7.A,
      energy: result.chakra7.B,
      emotions: result.chakra7.E,
    },
  ];

  return (
    <div className="w-full">
      {/* Desktop/Tablet Table View */}
      <div className="hidden md:block">
        <table className="w-full max-w-[446px] mx-auto" style={{ borderSpacing: '6px' }}>
          <thead>
            <tr>
              <th className="text-xs font-semibold text-gray-600 pb-2 text-center">
                Чакра
              </th>
              <th className="text-xs font-semibold text-gray-600 pb-2 text-center">
                Физика
              </th>
              <th className="text-xs font-semibold text-gray-600 pb-2 text-center">
                Энергия
              </th>
              <th className="text-xs font-semibold text-gray-600 pb-2 text-center">
                Эмоции
              </th>
            </tr>
          </thead>
          <tbody>
            {chakraData.map((row, index) => (
              <tr key={index}>
                <td className="rounded-[20px] text-center">
                  <div className="flex items-center gap-5 ml-4 font-semibold text-[13px] relative">
                    <span
                      className="text-[25px] font-semibold"
                      style={{ color: row.chakra.color }}
                    >
                      {row.chakra.number}
                    </span>
                    <span style={{ color: row.chakra.color }}>{row.chakra.name}</span>
                    
                    {/* Tooltip Icon */}
                    <div
                      className="relative inline-block ml-auto mr-4"
                      onMouseEnter={() => setHoveredChakra(index)}
                      onMouseLeave={() => setHoveredChakra(null)}
                      onFocus={() => setHoveredChakra(index)}
                      onBlur={() => setHoveredChakra(null)}
                      tabIndex={0}
                      role="button"
                      aria-describedby={`chakra-tooltip-${index}`}
                    >
                      <div className="w-4 h-4 flex items-center justify-center border-2 border-blue-500 rounded-full cursor-pointer">
                        <Image
                          src="/matrix/i.svg"
                          alt="Информация"
                          width={2.5}
                          height={8.5}
                          className="mt-[1.5px]"
                        />
                      </div>
                      
                      {/* Tooltip */}
                      {hoveredChakra === index && (
                        <div
                          id={`chakra-tooltip-${index}`}
                          className="absolute z-10 w-[200px] p-[9px_18px] bg-white shadow-[9px_8px_17px_10px_rgba(179,179,179,0.43)] rounded-[55px_55px_55px_0] text-[9px] font-semibold text-gray-600 leading-3"
                          style={{
                            bottom: '125%',
                            left: '50%',
                            marginLeft: '0',
                          }}
                          role="tooltip"
                        >
                          {row.chakra.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="rounded-[20px] text-center">
                  <div
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold text-gray-600 mx-auto"
                    style={{
                      border: `1px solid ${row.chakra.color}`,
                    }}
                  >
                    {row.physical}
                  </div>
                </td>
                <td className="rounded-[20px] text-center">
                  <div
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold text-gray-600 mx-auto"
                    style={{
                      border: `1px solid ${row.chakra.color}`,
                    }}
                  >
                    {row.energy}
                  </div>
                </td>
                <td className="rounded-[20px] text-center">
                  <div
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold text-gray-600 mx-auto"
                    style={{
                      border: `1px solid ${row.chakra.color}`,
                    }}
                  >
                    {row.emotions}
                  </div>
                </td>
              </tr>
            ))}
            {/* Totals Row */}
            <tr>
              <td className="rounded-[20px] text-center">
                <div className="flex items-center gap-5 ml-[52px] font-semibold text-[13px] text-gray-600">
                  Итого
                </div>
              </td>
              <td className="rounded-[20px] text-center">
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold text-gray-600 mx-auto border border-gray-600">
                  {result.totals.T1}
                </div>
              </td>
              <td className="rounded-[20px] text-center">
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold text-gray-600 mx-auto border border-gray-600">
                  {result.totals.T2}
                </div>
              </td>
              <td className="rounded-[20px] text-center">
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold text-gray-600 mx-auto border border-gray-600">
                  {result.totals.T3}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View */}
      <div className="md:hidden flex flex-col gap-2">
        {chakraData.map((row, index) => (
          <div
            key={index}
            className="bg-white rounded-[20px] shadow-md p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 font-semibold text-[13px]"
                style={{ color: row.chakra.color }}
              >
                <span className="text-[25px] font-semibold">{row.chakra.number}</span>
                {row.chakra.name}
              </div>
              
              {/* Tooltip Icon for Mobile */}
              <div
                className="relative inline-block"
                onTouchStart={() => setHoveredChakra(index)}
                onTouchEnd={() => setHoveredChakra(null)}
                onClick={() => setHoveredChakra(hoveredChakra === index ? null : index)}
                role="button"
                aria-describedby={`chakra-tooltip-mobile-${index}`}
                tabIndex={0}
              >
                <div className="w-4 h-4 flex items-center justify-center border-2 border-blue-500 rounded-full">
                  <Image
                    src="/matrix/i.svg"
                    alt="Информация"
                    width={2.5}
                    height={8.5}
                    className="mt-[1.5px]"
                  />
                </div>
              </div>
            </div>
            
            {/* Tooltip for Mobile */}
            {hoveredChakra === index && (
              <div
                id={`chakra-tooltip-mobile-${index}`}
                className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600"
                role="tooltip"
              >
                {row.chakra.description}
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-600 font-semibold">Физика</span>
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold text-gray-600"
                  style={{
                    border: `1px solid ${row.chakra.color}`,
                  }}
                >
                  {row.physical}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-600 font-semibold">Энергия</span>
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold text-gray-600"
                  style={{
                    border: `1px solid ${row.chakra.color}`,
                  }}
                >
                  {row.energy}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-600 font-semibold">Эмоции</span>
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold text-gray-600"
                  style={{
                    border: `1px solid ${row.chakra.color}`,
                  }}
                >
                  {row.emotions}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Totals Card */}
        <div className="bg-white rounded-[20px] shadow-md p-4 flex flex-col gap-3">
          <div className="font-semibold text-[13px] text-gray-600">Итого</div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-600 font-semibold">Физика</span>
              <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold text-gray-600 border border-gray-600">
                {result.totals.T1}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-600 font-semibold">Энергия</span>
              <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold text-gray-600 border border-gray-600">
                {result.totals.T2}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-600 font-semibold">Эмоции</span>
              <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold text-gray-600 border border-gray-600">
                {result.totals.T3}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
