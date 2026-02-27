'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DestinyMatrixResult } from '@/lib/calculators/destinyMatrix';
import {
  getPositionsForBreakpoint,
  getMatrixWidth,
  getBaseFontSize,
  POSITION_KEY_MAP,
} from '@/lib/data/matrixPositions';

/**
 * Функция расчета аркана (приведение числа к диапазону 1-22)
 */
function calculation(number: number): number {
  let sumNumber = number
    .toString()
    .split('')
    .reduce((prev, curr) => +prev + +curr, 0);

  while (parseInt(number.toString()) > 22 || sumNumber > 22) {
    number = number
      .toString()
      .split('')
      .reduce((prev, curr) => +prev + +curr, 0);

    if (parseInt(number.toString()) > 22) {
      number = number
        .toString()
        .split('')
        .reduce((prev, curr) => +prev + +curr, 0);
    }

    return number;
  }

  return number;
}

interface MatrixDiagramProps {
  result: DestinyMatrixResult;
}

/**
 * MatrixDiagram Component
 * Displays the Destiny Matrix diagram with all calculated values positioned on the matrix image
 * Responsive design with different layouts for desktop, tablet, and mobile
 */
export default function MatrixDiagram({ result }: MatrixDiagramProps) {
  const [windowWidth, setWindowWidth] = useState(1024); // Default to desktop

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get positions and sizes for current breakpoint
  const positions = getPositionsForBreakpoint(windowWidth);
  const matrixWidth = getMatrixWidth(windowWidth);
  const baseFontSize = getBaseFontSize(windowWidth);

  // Prepare all values to display on the matrix
  // Mapping based on original calculator.html structure
  
  // Calculate additional derived values
  const E2 = calculation(result.E + result.social.Y);
  const E1 = calculation(result.E + E2);
  const F2 = calculation(result.F + result.social.Y);
  const F1 = calculation(result.F + F2);
  const G2 = calculation(result.G + result.social.Y);
  const G1 = calculation(G2 + result.G);
  const H2 = calculation(result.H + result.social.Y);
  const H1 = calculation(result.H + H2);
  const G4 = calculation(result.chakra2.C2 + result.chakra2.D2);
  const L = calculation(result.chakra2.D2 + G4);
  const M = calculation(G4 + result.chakra2.C2);
  
  const matrixValues: Record<string, number> = {
    // Main positions (outer ring)
    number1: result.B,           // B - Month (top, 20 years)
    number2: result.E,           // E - A+B (left top, 10 years)
    number3: result.F,           // F - B+C (right top, 30 years)
    number4: result.A,           // A - Day (left center, 0 years)
    number5: result.C,           // C - Year (right center, 40 years)
    number6: result.H,           // H - D+A (left bottom, 70 years)
    number7: result.G,           // G - C+D (right bottom, 50 years)
    number8: result.D,           // D - A+B+C (bottom, 60 years)
    'number-center': result.X,   // X - Center

    // Derived positions from chakras and calculations
    number12: result.chakra6.B1,  // B1
    number13: result.chakra5.B2,  // B2
    number14: result.chakra4.B3,  // B3
    
    number22: E1,                 // E1 = calculation(E + E2)
    number23: E2,                 // E2 = calculation(E + Y)
    
    number32: F1,                 // F1 = calculation(F + F2)
    number33: F2,                 // F2 = calculation(F + Y)
    
    number42: result.chakra6.A1,  // A1
    number43: result.chakra5.A2,  // A2
    number44: result.chakra4.A3,  // A3
    
    number52: result.chakra2.C2,  // C1 (from chakra2, labeled as C2 in calculator)
    number53: result.C,           // C2 (actually C, duplicate for position)
    number54: result.social.Y,    // Y
    
    number62: H1,                 // H1 = calculation(H + H2)
    number63: H2,                 // H2 = calculation(H + Y)
    
    number72: G1,                 // G1 = calculation(G2 + G)
    number73: G2,                 // G2 = calculation(G + Y)
    number74: G4,                 // G4 = calculation(C2 + D2)
    number75: L,                  // L = calculation(D2 + G4)
    number76: M,                  // M = calculation(G4 + C2)
    
    number82: result.chakra2.D2,  // D1 (from chakra2, labeled as D2 in calculator)
    number83: result.D,           // D2 (actually D, duplicate for position)
  };

  return (
    <div className="w-full flex justify-center bg-white rounded-lg p-4">
      <div
        className="relative mx-auto"
        style={{
          width: matrixWidth,
        }}
      >
        {/* Matrix background image */}
        <Image
          src="/matrix/matrix.png"
          alt="Матрица Судьбы"
          width={600}
          height={600}
          className="w-full h-auto"
          priority
        />

        {/* Positioned numbers */}
        {Object.entries(matrixValues).map(([key, value]) => {
          const position = positions[key];
          if (!position) return null;

          return (
            <div
              key={key}
              className="absolute flex items-center justify-center font-bold"
              style={{
                top: position.top,
                left: position.left,
                width: '30px',
                fontSize: position.fontSize || baseFontSize,
                lineHeight: position.fontSize || baseFontSize,
                textAlign: 'center',
                color: '#7C3AED', // Purple-600 for strong contrast on white
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            >
              {value}
            </div>
          );
        })}
      </div>
    </div>
  );
}
