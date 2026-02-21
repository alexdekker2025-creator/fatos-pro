/**
 * Сервис кеширования результатов нумерологических расчетов
 * 
 * Кеширует результаты расчетов в памяти для повышения производительности
 * при повторных запросах с идентичными датами рождения.
 */

import { BirthDate, WorkingNumbers, PythagoreanSquare } from '@/types/numerology';
import { DestinyNumber, DestinyMatrix } from '@/lib/calculators/destiny';

/**
 * Полный результат всех нумерологических расчетов
 */
export interface CalculationResult {
  birthDate: BirthDate;
  workingNumbers: WorkingNumbers;
  pythagoreanSquare: PythagoreanSquare;
  destinyNumber: DestinyNumber;
  destinyMatrix: DestinyMatrix;
  timestamp: number; // Время создания кеша
}

/**
 * Класс для кеширования результатов расчетов в памяти
 */
export class CalculationCache {
  private cache: Map<string, CalculationResult>;
  private readonly maxSize: number;
  private readonly ttl: number; // Time to live в миллисекундах

  /**
   * Создает новый экземпляр кеша
   * 
   * @param maxSize - Максимальное количество записей в кеше (по умолчанию 1000)
   * @param ttl - Время жизни записи в миллисекундах (по умолчанию 1 час)
   */
  constructor(maxSize: number = 1000, ttl: number = 3600000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  /**
   * Генерирует уникальный ключ кеша на основе даты рождения
   * 
   * @param date - Дата рождения
   * @returns Строковый ключ в формате "DD-MM-YYYY"
   * 
   * @example
   * generateKey({ day: 15, month: 6, year: 1990 }) // "15-06-1990"
   */
  private generateKey(date: BirthDate): string {
    const day = date.day.toString().padStart(2, '0');
    const month = date.month.toString().padStart(2, '0');
    const year = date.year.toString();
    return `${day}-${month}-${year}`;
  }

  /**
   * Проверяет, истек ли срок действия записи кеша
   * 
   * @param result - Результат расчета
   * @returns true, если запись устарела
   */
  private isExpired(result: CalculationResult): boolean {
    const now = Date.now();
    return (now - result.timestamp) > this.ttl;
  }

  /**
   * Получает результат расчета из кеша
   * 
   * @param date - Дата рождения
   * @returns Результат расчета или null, если не найден или устарел
   * 
   * @example
   * const result = cache.get({ day: 15, month: 6, year: 1990 });
   * if (result) {
   *   console.log('Результат из кеша:', result);
   * }
   */
  get(date: BirthDate): CalculationResult | null {
    const key = this.generateKey(date);
    const result = this.cache.get(key);

    if (!result) {
      return null;
    }

    // Проверяем, не истек ли срок действия
    if (this.isExpired(result)) {
      this.cache.delete(key);
      return null;
    }

    return result;
  }

  /**
   * Сохраняет результат расчета в кеш
   * 
   * Если кеш переполнен, удаляет самую старую запись (FIFO)
   * 
   * @param date - Дата рождения
   * @param result - Результат расчета (без timestamp)
   * 
   * @example
   * cache.set(
   *   { day: 15, month: 6, year: 1990 },
   *   {
   *     birthDate: { day: 15, month: 6, year: 1990 },
   *     workingNumbers: { first: 31, second: 4, third: 29, fourth: 11 },
   *     pythagoreanSquare: { cells: [[3, 1, 1], [1, 0, 1], [0, 0, 2]], digitCounts: new Map() },
   *     destinyNumber: { value: 4, isMasterNumber: false },
   *     destinyMatrix: { positions: new Map() }
   *   }
   * );
   */
  set(date: BirthDate, result: Omit<CalculationResult, 'timestamp'>): void {
    const key = this.generateKey(date);

    // Если кеш переполнен, удаляем самую старую запись
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    // Добавляем timestamp и сохраняем
    const cachedResult: CalculationResult = {
      ...result,
      timestamp: Date.now(),
    };

    this.cache.set(key, cachedResult);
  }

  /**
   * Очищает весь кеш
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Возвращает текущий размер кеша
   * 
   * @returns Количество записей в кеше
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Удаляет устаревшие записи из кеша
   * 
   * @returns Количество удаленных записей
   */
  cleanup(): number {
    let deletedCount = 0;
    const now = Date.now();

    for (const [key, result] of this.cache.entries()) {
      if ((now - result.timestamp) > this.ttl) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    return deletedCount;
  }
}

// Создаем глобальный экземпляр кеша для использования в приложении
export const calculationCache = new CalculationCache();
