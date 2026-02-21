import { CalculationCache } from '@/lib/services/cache/CalculationCache';
import { BirthDate } from '@/types/numerology';

describe('CalculationCache', () => {
  let cache: CalculationCache;

  const mockBirthDate: BirthDate = {
    day: 15,
    month: 6,
    year: 1990,
  };

  const mockResult = {
    birthDate: mockBirthDate,
    workingNumbers: {
      first: 31,
      second: 4,
      third: 29,
      fourth: 11,
    },
    pythagoreanSquare: {
      cells: [[3, 1, 1], [1, 0, 1], [0, 0, 2]],
      digitCounts: new Map([
        [1, 3], [2, 1], [3, 1],
        [4, 1], [5, 0], [6, 1],
        [7, 0], [8, 0], [9, 2],
      ]),
    },
    destinyNumber: {
      value: 4,
      isMasterNumber: false,
    },
    destinyMatrix: {
      positions: new Map([
        ['dayNumber', 6],
        ['monthNumber', 6],
        ['yearNumber', 1],
      ]),
    },
  };

  beforeEach(() => {
    cache = new CalculationCache();
  });

  describe('set and get', () => {
    it('should store and retrieve calculation result', () => {
      cache.set(mockBirthDate, mockResult);
      const retrieved = cache.get(mockBirthDate);

      expect(retrieved).toBeDefined();
      expect(retrieved?.birthDate).toEqual(mockBirthDate);
      expect(retrieved?.workingNumbers).toEqual(mockResult.workingNumbers);
      expect(retrieved?.destinyNumber).toEqual(mockResult.destinyNumber);
    });

    it('should return null for non-existent key', () => {
      const result = cache.get({ day: 1, month: 1, year: 2000 });
      expect(result).toBeNull();
    });

    it('should add timestamp when storing result', () => {
      const beforeTime = Date.now();
      cache.set(mockBirthDate, mockResult);
      const afterTime = Date.now();

      const retrieved = cache.get(mockBirthDate);
      expect(retrieved?.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(retrieved?.timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('key generation', () => {
    it('should generate same key for same date', () => {
      cache.set(mockBirthDate, mockResult);
      
      const sameDateDifferentObject = {
        day: 15,
        month: 6,
        year: 1990,
      };

      const retrieved = cache.get(sameDateDifferentObject);
      expect(retrieved).toBeDefined();
      expect(retrieved?.birthDate).toEqual(mockBirthDate);
    });

    it('should generate different keys for different dates', () => {
      cache.set(mockBirthDate, mockResult);

      const differentDate = { day: 20, month: 6, year: 1990 };
      const retrieved = cache.get(differentDate);
      
      expect(retrieved).toBeNull();
    });

    it('should pad single digit day and month with zero', () => {
      const singleDigitDate = { day: 5, month: 3, year: 1990 };
      cache.set(singleDigitDate, { ...mockResult, birthDate: singleDigitDate });

      const retrieved = cache.get(singleDigitDate);
      expect(retrieved).toBeDefined();
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should return null for expired entries', () => {
      // Создаем кеш с TTL 100ms
      const shortTtlCache = new CalculationCache(1000, 100);
      
      shortTtlCache.set(mockBirthDate, mockResult);
      
      // Сразу после добавления должен быть доступен
      let retrieved = shortTtlCache.get(mockBirthDate);
      expect(retrieved).toBeDefined();

      // Ждем истечения TTL
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          retrieved = shortTtlCache.get(mockBirthDate);
          expect(retrieved).toBeNull();
          resolve();
        }, 150);
      });
    });

    it('should delete expired entry when accessed', () => {
      const shortTtlCache = new CalculationCache(1000, 50);
      
      shortTtlCache.set(mockBirthDate, mockResult);
      expect(shortTtlCache.size()).toBe(1);

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          shortTtlCache.get(mockBirthDate);
          expect(shortTtlCache.size()).toBe(0);
          resolve();
        }, 100);
      });
    });
  });

  describe('maxSize limit', () => {
    it('should remove oldest entry when maxSize is reached', () => {
      const smallCache = new CalculationCache(2); // Максимум 2 записи

      const date1 = { day: 1, month: 1, year: 1990 };
      const date2 = { day: 2, month: 2, year: 1991 };
      const date3 = { day: 3, month: 3, year: 1992 };

      smallCache.set(date1, { ...mockResult, birthDate: date1 });
      smallCache.set(date2, { ...mockResult, birthDate: date2 });
      
      expect(smallCache.size()).toBe(2);
      expect(smallCache.get(date1)).toBeDefined();
      expect(smallCache.get(date2)).toBeDefined();

      // Добавляем третью запись - первая должна быть удалена
      smallCache.set(date3, { ...mockResult, birthDate: date3 });
      
      expect(smallCache.size()).toBe(2);
      expect(smallCache.get(date1)).toBeNull(); // Удалена
      expect(smallCache.get(date2)).toBeDefined();
      expect(smallCache.get(date3)).toBeDefined();
    });
  });

  describe('clear', () => {
    it('should remove all entries', () => {
      cache.set(mockBirthDate, mockResult);
      cache.set({ day: 1, month: 1, year: 2000 }, mockResult);
      
      expect(cache.size()).toBe(2);
      
      cache.clear();
      
      expect(cache.size()).toBe(0);
      expect(cache.get(mockBirthDate)).toBeNull();
    });
  });

  describe('size', () => {
    it('should return correct cache size', () => {
      expect(cache.size()).toBe(0);

      cache.set(mockBirthDate, mockResult);
      expect(cache.size()).toBe(1);

      cache.set({ day: 1, month: 1, year: 2000 }, mockResult);
      expect(cache.size()).toBe(2);
    });
  });

  describe('cleanup', () => {
    it('should remove all expired entries', () => {
      const shortTtlCache = new CalculationCache(1000, 50);

      const date1 = { day: 1, month: 1, year: 1990 };
      const date2 = { day: 2, month: 2, year: 1991 };

      shortTtlCache.set(date1, { ...mockResult, birthDate: date1 });
      shortTtlCache.set(date2, { ...mockResult, birthDate: date2 });

      expect(shortTtlCache.size()).toBe(2);

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const deletedCount = shortTtlCache.cleanup();
          
          expect(deletedCount).toBe(2);
          expect(shortTtlCache.size()).toBe(0);
          resolve();
        }, 100);
      });
    });

    it('should not remove non-expired entries', () => {
      cache.set(mockBirthDate, mockResult);
      
      const deletedCount = cache.cleanup();
      
      expect(deletedCount).toBe(0);
      expect(cache.size()).toBe(1);
    });
  });

  describe('idempotency', () => {
    it('should return same result for multiple gets', () => {
      cache.set(mockBirthDate, mockResult);

      const result1 = cache.get(mockBirthDate);
      const result2 = cache.get(mockBirthDate);
      const result3 = cache.get(mockBirthDate);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });

    it('should overwrite existing entry with same key', () => {
      cache.set(mockBirthDate, mockResult);

      const updatedResult = {
        ...mockResult,
        destinyNumber: {
          value: 11,
          isMasterNumber: true,
        },
      };

      cache.set(mockBirthDate, updatedResult);

      const retrieved = cache.get(mockBirthDate);
      expect(retrieved?.destinyNumber.value).toBe(11);
      expect(retrieved?.destinyNumber.isMasterNumber).toBe(true);
      expect(cache.size()).toBe(1); // Размер не изменился
    });
  });
});
