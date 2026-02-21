/**
 * Unit-тесты для калькулятора Квадрата Пифагора
 */

import { PythagoreanCalculator } from '@/lib/calculators/pythagorean';
import { BirthDate } from '@/types/numerology';

describe('PythagoreanCalculator', () => {
  let calculator: PythagoreanCalculator;

  beforeEach(() => {
    calculator = new PythagoreanCalculator();
  });

  describe('calculateWorkingNumbers', () => {
    it('should calculate working numbers for date 15.06.1990', () => {
      const date: BirthDate = { day: 15, month: 6, year: 1990 };
      const result = calculator.calculateWorkingNumbers(date);

      // Первое: 1+5 + 6 + 1+9+9+0 = 6 + 6 + 19 = 31
      expect(result.first).toBe(31);
      
      // Второе: 3+1 = 4
      expect(result.second).toBe(4);
      
      // Третье: 31 - (1*2) = 31 - 2 = 29
      expect(result.third).toBe(29);
      
      // Четвертое: 2+9 = 11
      expect(result.fourth).toBe(11);
    });

    it('should calculate working numbers for date 01.01.2000', () => {
      const date: BirthDate = { day: 1, month: 1, year: 2000 };
      const result = calculator.calculateWorkingNumbers(date);

      // Первое: 1 + 1 + 2+0+0+0 = 4
      expect(result.first).toBe(4);
      
      // Второе: 4
      expect(result.second).toBe(4);
      
      // Третье: 4 - (1*2) = 2
      expect(result.third).toBe(2);
      
      // Четвертое: 2
      expect(result.fourth).toBe(2);
    });

    it('should calculate working numbers for date 28.12.1985', () => {
      const date: BirthDate = { day: 28, month: 12, year: 1985 };
      const result = calculator.calculateWorkingNumbers(date);

      // Первое: 2+8 + 1+2 + 1+9+8+5 = 10 + 3 + 23 = 36
      expect(result.first).toBe(36);
      
      // Второе: 3+6 = 9
      expect(result.second).toBe(9);
      
      // Третье: 36 - (2*2) = 32
      expect(result.third).toBe(32);
      
      // Четвертое: 3+2 = 5
      expect(result.fourth).toBe(5);
    });

    it('should handle single digit day', () => {
      const date: BirthDate = { day: 5, month: 10, year: 1995 };
      const result = calculator.calculateWorkingNumbers(date);

      // Первое: 5 + 1+0 + 1+9+9+5 = 5 + 1 + 24 = 30
      expect(result.first).toBe(30);
      
      // Второе: 3+0 = 3
      expect(result.second).toBe(3);
      
      // Третье: 30 - (5*2) = 20
      expect(result.third).toBe(20);
      
      // Четвертое: 2+0 = 2
      expect(result.fourth).toBe(2);
    });

    it('should return identical results for repeated calls (idempotency)', () => {
      const date: BirthDate = { day: 15, month: 6, year: 1990 };
      
      const result1 = calculator.calculateWorkingNumbers(date);
      const result2 = calculator.calculateWorkingNumbers(date);
      
      expect(result1).toEqual(result2);
    });
  });

  describe('buildSquare', () => {
    it('should build square for date 15.06.1990', () => {
      const date: BirthDate = { day: 15, month: 6, year: 1990 };
      const working = calculator.calculateWorkingNumbers(date);
      const square = calculator.buildSquare(date, working);

      // Все цифры: 1,5,6,1,9,9,0,3,1,4,2,9,1,1
      // Подсчет (без 0):
      // 1: 5 раз (15, 1990, 31, 11)
      // 2: 1 раз (29)
      // 3: 1 раз (31)
      // 4: 1 раз (4)
      // 5: 1 раз (15)
      // 6: 1 раз (6)
      // 7: 0 раз
      // 8: 0 раз
      // 9: 3 раза (1990, 29)

      expect(square.digitCounts.get(1)).toBe(5);
      expect(square.digitCounts.get(2)).toBe(1);
      expect(square.digitCounts.get(3)).toBe(1);
      expect(square.digitCounts.get(4)).toBe(1);
      expect(square.digitCounts.get(5)).toBe(1);
      expect(square.digitCounts.get(6)).toBe(1);
      expect(square.digitCounts.get(7)).toBe(0);
      expect(square.digitCounts.get(8)).toBe(0);
      expect(square.digitCounts.get(9)).toBe(3);

      // Проверка структуры сетки 3x3
      expect(square.cells).toHaveLength(3);
      expect(square.cells[0]).toEqual([5, 1, 1]); // 1, 2, 3
      expect(square.cells[1]).toEqual([1, 1, 1]); // 4, 5, 6
      expect(square.cells[2]).toEqual([0, 0, 3]); // 7, 8, 9
    });

    it('should build square for date 01.01.2000', () => {
      const date: BirthDate = { day: 1, month: 1, year: 2000 };
      const working = calculator.calculateWorkingNumbers(date);
      const square = calculator.buildSquare(date, working);

      // Все цифры: 1,1,2,0,0,0,4,4,2,2
      // Подсчет (без 0):
      // 1: 2 раза
      // 2: 3 раза (2000, 2, 2)
      // 3: 0 раз
      // 4: 2 раза (4, 4)
      // 5-9: 0 раз

      expect(square.digitCounts.get(1)).toBe(2);
      expect(square.digitCounts.get(2)).toBe(3);
      expect(square.digitCounts.get(3)).toBe(0);
      expect(square.digitCounts.get(4)).toBe(2);
      expect(square.digitCounts.get(5)).toBe(0);
      expect(square.digitCounts.get(6)).toBe(0);
      expect(square.digitCounts.get(7)).toBe(0);
      expect(square.digitCounts.get(8)).toBe(0);
      expect(square.digitCounts.get(9)).toBe(0);
    });

    it('should handle negative third working number', () => {
      // Создаем дату, где третье рабочее число будет отрицательным
      const date: BirthDate = { day: 10, month: 1, year: 1900 };
      const working = calculator.calculateWorkingNumbers(date);
      const square = calculator.buildSquare(date, working);

      // Должно корректно обработать отрицательное третье число
      expect(square.cells).toHaveLength(3);
      expect(square.cells[0]).toHaveLength(3);
      
      // Все значения должны быть неотрицательными
      square.cells.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBeGreaterThanOrEqual(0);
        });
      });
    });

    it('should return empty cells for missing digits', () => {
      const date: BirthDate = { day: 1, month: 1, year: 2000 };
      const working = calculator.calculateWorkingNumbers(date);
      const square = calculator.buildSquare(date, working);

      // Цифры 3, 5, 6, 7, 8, 9 отсутствуют
      expect(square.digitCounts.get(3)).toBe(0);
      expect(square.digitCounts.get(5)).toBe(0);
      expect(square.digitCounts.get(6)).toBe(0);
      expect(square.digitCounts.get(7)).toBe(0);
      expect(square.digitCounts.get(8)).toBe(0);
      expect(square.digitCounts.get(9)).toBe(0);
    });

    it('should correctly count all digits from date and working numbers', () => {
      const date: BirthDate = { day: 22, month: 11, year: 1988 };
      const working = calculator.calculateWorkingNumbers(date);
      const square = calculator.buildSquare(date, working);

      // Вручную подсчитываем все цифры
      const allDigits = [
        ...date.day.toString().split('').map(Number),
        ...date.month.toString().split('').map(Number),
        ...date.year.toString().split('').map(Number),
        ...working.first.toString().split('').map(Number),
        ...working.second.toString().split('').map(Number),
        ...Math.abs(working.third).toString().split('').map(Number),
        ...working.fourth.toString().split('').map(Number),
      ];

      // Проверяем, что подсчет совпадает
      for (let digit = 1; digit <= 9; digit++) {
        const expectedCount = allDigits.filter(d => d === digit).length;
        expect(square.digitCounts.get(digit)).toBe(expectedCount);
      }
    });
  });
});
