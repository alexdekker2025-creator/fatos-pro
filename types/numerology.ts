/**
 * Типы для нумерологических расчетов
 */

export interface BirthDate {
  day: number;
  month: number;
  year: number;
}

export interface WorkingNumbers {
  first: number;
  second: number;
  third: number;
  fourth: number;
}

export interface PythagoreanSquare {
  cells: number[][];
  digitCounts: Map<number, number>;
}

export interface DestinyNumber {
  value: number;
  description: string;
}

export interface DestinyMatrix {
  positions: Map<string, number>;
  descriptions: Map<string, string>;
}
