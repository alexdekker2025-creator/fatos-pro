'use client';

import { useState, useCallback } from 'react';

interface Calculation {
  id: string;
  birthDate: string;
  calculationType: string;
  results: any;
  createdAt: string;
}

interface CalculationsResponse {
  success: boolean;
  calculations: Calculation[];
  total: number;
  limit: number;
  offset: number;
  error?: string;
}

export function useCalculations() {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCalculations = useCallback(async (limit = 10, offset = 0) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setError('Not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/calculations?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${sessionId}`,
          },
        }
      );

      const data: CalculationsResponse = await response.json();

      if (data.success && data.calculations) {
        // Transform API response to match expected format
        const transformedCalculations = data.calculations.map((calc: any) => ({
          id: calc.id,
          birthDate: `${calc.birthDay}/${calc.birthMonth}/${calc.birthYear}`,
          calculationType: 'all',
          results: {
            workingNumbers: calc.workingNumbers,
            square: calc.square,
            pythagoreanSquare: calc.square, // Alias for compatibility
            destinyNumber: calc.destinyNumber,
            matrix: calc.matrix,
          },
          createdAt: calc.createdAt,
        }));
        
        setCalculations(transformedCalculations);
        setTotal(data.total || 0);
      } else {
        setCalculations([]);
        setTotal(0);
        setError(data.error || 'Failed to load calculations');
      }
    } catch (err) {
      console.error('Load calculations error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCalculation = useCallback(async (
    birthDate: { day: number; month: number; year: number },
    calculationType: string,
    results: any
  ) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/api/calculations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionId}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        birthDate,
        calculationType,
        results,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to save calculation');
    }

    return data.calculation;
  }, []);

  return {
    calculations,
    total,
    loading,
    error,
    loadCalculations,
    saveCalculation,
  };
}
