'use client';

import React from 'react';
import { DestinyMatrixResult } from '@/lib/calculators/destinyMatrix';
import MatrixDiagram from './MatrixDiagram';
import HealthTable from './HealthTable';

interface MatrixWithHealthProps {
  result: DestinyMatrixResult;
  name?: string;
  birthDate: {
    day: number;
    month: number;
    year: number;
  };
  age?: number | null;
}

/**
 * MatrixWithHealth Component
 * Combines Matrix Diagram and Health Table in a single layout
 * Displays user info, matrix diagram on the right, and health table on the left
 */
export default function MatrixWithHealth({ result, name, birthDate, age }: MatrixWithHealthProps) {
  return (
    <div className="glass-strong rounded-lg p-6 sm:p-8 border border-purple-400/30">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-6 text-center">
        Ваш персональный расчет Матрицы Судьбы
      </h2>

      {/* User Info */}
      <div className="text-center mb-6">
        {name && (
          <p className="text-lg font-semibold text-white mb-1">{name}</p>
        )}
        <p className="text-purple-200">
          Дата рождения: {birthDate.day}.{birthDate.month}.{birthDate.year}
          {age !== null && age !== undefined && ` • Возраст: ${age} лет`}
        </p>
      </div>

      {/* Main Content: White background container */}
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Health Table */}
          <div className="order-2 lg:order-1">
            <h3 className="text-lg font-bold mb-4 text-center" style={{ color: '#FF6B6B' }}>
              Ваша карта здоровья
            </h3>
            <HealthTable result={result} />
          </div>

          {/* Right: Matrix Diagram */}
          <div className="order-1 lg:order-2">
            <MatrixDiagram result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
