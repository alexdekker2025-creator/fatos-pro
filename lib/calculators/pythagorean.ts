/**
 * Калькулятор Квадрата Пифагора
 * 
 * Вычисляет рабочие числа и строит квадрат Пифагора 3x3 на основе даты рождения.
 * Квадрат Пифагора - это нумерологическая сетка, где каждая ячейка содержит
 * количество повторений соответствующей цифры (1-9) из даты рождения и рабочих чисел.
 */

import { BirthDate, WorkingNumbers, PythagoreanSquare } from '@/types/numerology';

/**
 * Суммирует все цифры числа
 * 
 * @param num - Число для суммирования цифр
 * @returns Сумма всех цифр числа
 * 
 * @example
 * sumDigits(123) // 1 + 2 + 3 = 6
 * sumDigits(45) // 4 + 5 = 9
 */
function sumDigits(num: number): number {
  return Math.abs(num)
    .toString()
    .split('')
    .map(digit => parseInt(digit, 10))
    .reduce((sum, digit) => sum + digit, 0);
}

/**
 * Извлекает первую цифру числа
 * 
 * @param num - Число
 * @returns Первая цифра числа
 * 
 * @example
 * getFirstDigit(123) // 1
 * getFirstDigit(5) // 5
 */
function getFirstDigit(num: number): number {
  const str = Math.abs(num).toString();
  return parseInt(str[0], 10);
}

export class PythagoreanCalculator {
  /**
   * Вычисляет четыре рабочих числа из даты рождения
   * 
   * Алгоритм:
   * 1. Первое рабочее число: сумма всех цифр даты рождения (день + месяц + год)
   * 2. Второе рабочее число: сумма цифр первого рабочего числа
   * 3. Третье рабочее число: первое рабочее число - (удвоенная первая цифра дня рождения)
   * 4. Четвертое рабочее число: сумма цифр третьего рабочего числа
   * 
   * @param date - Дата рождения
   * @returns Объект с четырьмя рабочими числами
   * 
   * @example
   * calculateWorkingNumbers({ day: 15, month: 6, year: 1990 })
   * // { first: 31, second: 4, third: 29, fourth: 11 }
   */
  calculateWorkingNumbers(date: BirthDate): WorkingNumbers {
    // Первое рабочее число: сумма всех цифр даты
    const first = sumDigits(date.day) + sumDigits(date.month) + sumDigits(date.year);
    
    // Второе рабочее число: сумма цифр первого
    const second = sumDigits(first);
    
    // Третье рабочее число: первое - удвоенная первая цифра дня
    const firstDigitOfDay = getFirstDigit(date.day);
    const third = first - (firstDigitOfDay * 2);
    
    // Четвертое рабочее число: сумма цифр третьего
    const fourth = sumDigits(third);
    
    return {
      first,
      second,
      third,
      fourth,
    };
  }

  /**
   * Строит квадрат Пифагора 3x3 с подсчетом цифр
   * 
   * Квадрат представляет собой сетку 3x3, где каждая ячейка соответствует цифре от 1 до 9:
   * 
   * | 1 | 2 | 3 |
   * | 4 | 5 | 6 |
   * | 7 | 8 | 9 |
   * 
   * Каждая ячейка содержит количество повторений соответствующей цифры
   * из даты рождения и всех четырех рабочих чисел.
   * 
   * @param date - Дата рождения
   * @param working - Рабочие числа
   * @returns Объект с сеткой 3x3 и картой подсчета цифр
   * 
   * @example
   * buildSquare({ day: 15, month: 6, year: 1990 }, { first: 31, second: 4, third: 29, fourth: 11 })
   * // {
   * //   cells: [[3, 1, 1], [1, 0, 1], [0, 0, 2]],
   * //   digitCounts: Map { 1 => 3, 2 => 1, 3 => 1, 4 => 1, 5 => 0, 6 => 1, 7 => 0, 8 => 0, 9 => 2 }
   * // }
   */
  buildSquare(date: BirthDate, working: WorkingNumbers): PythagoreanSquare {
    // Собираем все цифры из даты и рабочих чисел
    const allDigits: number[] = [];
    
    // Добавляем цифры из даты рождения
    allDigits.push(...date.day.toString().split('').map(d => parseInt(d, 10)));
    allDigits.push(...date.month.toString().split('').map(d => parseInt(d, 10)));
    allDigits.push(...date.year.toString().split('').map(d => parseInt(d, 10)));
    
    // Добавляем цифры из рабочих чисел
    allDigits.push(...working.first.toString().split('').map(d => parseInt(d, 10)));
    allDigits.push(...working.second.toString().split('').map(d => parseInt(d, 10)));
    allDigits.push(...Math.abs(working.third).toString().split('').map(d => parseInt(d, 10)));
    allDigits.push(...working.fourth.toString().split('').map(d => parseInt(d, 10)));
    
    // Подсчитываем количество каждой цифры от 1 до 9
    const digitCounts = new Map<number, number>();
    for (let digit = 1; digit <= 9; digit++) {
      const count = allDigits.filter(d => d === digit).length;
      digitCounts.set(digit, count);
    }
    
    // Строим сетку 3x3
    const cells: number[][] = [
      [digitCounts.get(1) || 0, digitCounts.get(2) || 0, digitCounts.get(3) || 0],
      [digitCounts.get(4) || 0, digitCounts.get(5) || 0, digitCounts.get(6) || 0],
      [digitCounts.get(7) || 0, digitCounts.get(8) || 0, digitCounts.get(9) || 0],
    ];
    
    return {
      cells,
      digitCounts,
    };
  }
}
