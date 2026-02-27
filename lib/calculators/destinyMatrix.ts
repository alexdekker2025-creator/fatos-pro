/**
 * Калькулятор Матрицы Судьбы
 * 
 * Вычисляет все позиции матрицы судьбы на основе даты рождения.
 * Использует систему арканов Таро (числа от 1 до 22).
 */

import { BirthDate } from '@/types/numerology';

export interface DestinyMatrixResult {
  // Базовые значения из даты
  A: number; // День
  B: number; // Месяц
  C: number; // Год
  
  // Чакры (7 уровней)
  chakra1: { D: number; C: number; K1: number };
  chakra2: { D2: number; C2: number; K2: number };
  chakra3: { X: number; X2: number; K3: number };
  chakra4: { B3: number; A3: number; K4: number };
  chakra5: { B2: number; A2: number; K5: number };
  chakra6: { B1: number; A1: number; K6: number };
  chakra7: { B: number; A: number; E: number };
  
  // Итоговые значения
  totals: { T1: number; T2: number; T3: number };
  
  // Личное (приватное)
  personal: { LN: number; LZ: number; LP1: number };
  
  // Социальное
  social: { LO: number; LM: number; Y: number; G: number; F: number; H: number };
  
  // Духовное
  spirit: { LP1: number; Y: number; LP3: number };
  
  // Родители
  parents: {
    man: { E: number; G: number; X: number };
    woman: { F: number; H: number; X: number };
  };
  
  // Дополнительные значения
  D: number;
  X: number;
  E: number;
  G: number;
  F: number;
  H: number;
}

/**
 * Функция расчета аркана (приведение числа к диапазону 1-22)
 * Суммирует цифры числа до тех пор, пока результат не станет <= 22
 */
function calculation(number: number): number {
  // Суммируем цифры числа
  let sumNumber = number
    .toString()
    .split('')
    .reduce((prev, curr) => +prev + +curr, 0);

  // Пока число или сумма его цифр больше 22, продолжаем суммировать
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

export class DestinyMatrixCalculator {
  /**
   * Рассчитывает полную матрицу судьбы по дате рождения
   */
  calculate(date: BirthDate): DestinyMatrixResult {
    // Базовые значения из даты рождения
    const A = calculation(date.day);
    const B = calculation(date.month);
    const C = calculation(date.year);

    // Первая чакра
    const D = calculation(A + B + C);
    const K1 = calculation(D + C);

    // Центральная точка X
    const X = calculation(A + B + C + D);

    // Вторая чакра
    const D2 = calculation(D + X);
    const D1 = calculation(D + D2);
    const C2 = calculation(C + X);
    const C1 = calculation(C + C2);
    const K2 = calculation(D2 + C2);

    // Третья чакра
    const K3 = calculation(X + X);

    // Четвертая чакра
    const B2 = calculation(B + X);
    const B3 = calculation(B2 + X);
    const A2 = calculation(A + X);
    const A3 = calculation(A2 + X);
    const K4 = calculation(B3 + A3);

    // Пятая чакра
    const K5 = calculation(B2 + A2);

    // Шестая чакра
    const B1 = calculation(B + B2);
    const A1 = calculation(A + A2);
    const K6 = calculation(B1 + A1);

    // Седьмая чакра
    const E = calculation(A + B);

    // Итоговые значения (таланты)
    const T1 = calculation(D + D2 + B3 + X + B1 + B2 + B);
    const T2 = calculation(A + A1 + A2 + A3 + X + C2 + C);
    const T3 = calculation(E + K6 + K5 + K4 + K3 + K2 + K1);

    // Личное (приватное)
    const LN = calculation(B + D);
    const LZ = calculation(A + C);
    const LP1 = calculation(LN + LZ);

    // Социальное
    const G = calculation(C + D);
    const F = calculation(B + C);
    const H = calculation(D + A);
    const LO = calculation(E + G);
    const LM = calculation(F + H);
    const Y = calculation(E + F + G + H);

    // Духовное
    const LP3 = calculation(LP1 + Y);

    return {
      A,
      B,
      C,
      D,
      X,
      E,
      G,
      F,
      H,
      chakra1: { D, C, K1 },
      chakra2: { D2, C2, K2 },
      chakra3: { X, X2: X, K3 },
      chakra4: { B3, A3, K4 },
      chakra5: { B2, A2, K5 },
      chakra6: { B1, A1, K6 },
      chakra7: { B, A, E },
      totals: { T1, T2, T3 },
      personal: { LN, LZ, LP1 },
      social: { LO, LM, Y, G, F, H },
      spirit: { LP1, Y, LP3 },
      parents: {
        man: { E, G, X },
        woman: { F, H, X },
      },
    };
  }
}
