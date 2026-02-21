/**
 * Unit-тесты для калькулятора арканов дня
 */

import {
  calculateMorning,
  calculateDay,
  calculateEvening,
  calculateNight,
  calculateDayCard,
} from '@/lib/arcana/arcanaCalculator';

describe('Arcana Calculator', () => {
  describe('calculateMorning', () => {
    it('должен возвращать день рождения, если он <= 22', () => {
      expect(calculateMorning(1)).toBe(1);
      expect(calculateMorning(15)).toBe(15);
      expect(calculateMorning(22)).toBe(22);
    });

    it('должен приводить день рождения к диапазону 1-22', () => {
      expect(calculateMorning(23)).toBe(1); // 23 - 22 = 1
      expect(calculateMorning(25)).toBe(3); // 25 - 22 = 3
      expect(calculateMorning(31)).toBe(9); // 31 - 22 = 9
    });

    it('должен обрабатывать граничные случаи', () => {
      expect(calculateMorning(44)).toBe(22); // 44 - 22 - 22 = 0 -> 22
      expect(calculateMorning(45)).toBe(1); // 45 - 22 - 22 = 1
    });
  });

  describe('calculateDay', () => {
    it('должен правильно вычислять аркан для простой даты', () => {
      // 15.01.2024 -> 1+5+0+1+2+0+2+4 = 15
      const date = new Date(2024, 0, 15);
      expect(calculateDay(date)).toBe(15);
    });

    it('должен приводить сумму к диапазону 1-22', () => {
      // 29.12.2024 -> 2+9+1+2+2+0+2+4 = 22
      const date = new Date(2024, 11, 29);
      expect(calculateDay(date)).toBe(22);
    });

    it('должен правильно обрабатывать даты с большой суммой цифр', () => {
      // 31.12.2099 -> 3+1+1+2+2+0+9+9 = 27 -> 5 (27 - 22 = 5)
      const date = new Date(2099, 11, 31);
      expect(calculateDay(date)).toBe(5);
    });

    it('должен правильно обрабатывать даты с малой суммой цифр', () => {
      // 01.01.2000 -> 0+1+0+1+2+0+0+0 = 4
      const date = new Date(2000, 0, 1);
      expect(calculateDay(date)).toBe(4);
    });
  });

  describe('calculateEvening', () => {
    it('должен правильно вычислять аркан вечера', () => {
      // 32 + 15 + 2 = 49 -> 5 (49 - 22 - 22 = 5)
      expect(calculateEvening(32, 15, 2)).toBe(5);
    });

    it('должен обрабатывать малые суммы', () => {
      // 1 + 1 + 1 = 3
      expect(calculateEvening(1, 1, 1)).toBe(3);
    });

    it('должен обрабатывать большие суммы', () => {
      // 100 + 22 + 22 = 144 -> 12 (144 - 22*6 = 12)
      expect(calculateEvening(100, 22, 22)).toBe(12);
    });

    it('должен обрабатывать сумму равную 22', () => {
      // 10 + 10 + 2 = 22
      expect(calculateEvening(10, 10, 2)).toBe(22);
    });
  });

  describe('calculateNight', () => {
    it('должен правильно вычислять аркан ночи', () => {
      // 2 + 5 = 7
      expect(calculateNight(2, 5)).toBe(7);
    });

    it('должен приводить сумму к диапазону 1-22', () => {
      // 15 + 15 = 30 -> 8 (30 - 22 = 8)
      expect(calculateNight(15, 15)).toBe(8);
    });

    it('должен обрабатывать сумму равную 22', () => {
      // 11 + 11 = 22
      expect(calculateNight(11, 11)).toBe(22);
    });

    it('должен обрабатывать сумму равную 44', () => {
      // 22 + 22 = 44 -> 0 -> 22
      expect(calculateNight(22, 22)).toBe(22);
    });
  });

  describe('calculateDayCard', () => {
    it('должен правильно вычислять все 4 аркана', () => {
      // День рождения: 15
      // Сумма имени: 32
      // Текущая дата: 15.01.2024 (сумма цифр = 15)
      const currentDate = new Date(2024, 0, 15);
      const result = calculateDayCard(15, 32, currentDate);
      
      expect(result.morning).toBe(15); // день рождения
      expect(result.day).toBe(15); // сумма цифр даты
      expect(result.evening).toBe(18); // 32 + 15 + 15 = 62 -> 18 (62 - 22 - 22 = 18)
      expect(result.night).toBe(11); // 15 + 18 = 33 -> 11 (33 - 22 = 11)
    });

    it('должен использовать текущую дату по умолчанию', () => {
      const result = calculateDayCard(15, 32);
      
      expect(result.morning).toBe(15);
      expect(result.day).toBeGreaterThanOrEqual(1);
      expect(result.day).toBeLessThanOrEqual(22);
      expect(result.evening).toBeGreaterThanOrEqual(1);
      expect(result.evening).toBeLessThanOrEqual(22);
      expect(result.night).toBeGreaterThanOrEqual(1);
      expect(result.night).toBeLessThanOrEqual(22);
    });

    it('должен обрабатывать день рождения > 22', () => {
      // День рождения: 31 -> 9 (31 - 22 = 9)
      const currentDate = new Date(2024, 0, 1);
      const result = calculateDayCard(31, 10, currentDate);
      
      expect(result.morning).toBe(9);
    });

    it('должен возвращать все значения в диапазоне 1-22', () => {
      const currentDate = new Date(2024, 11, 31);
      const result = calculateDayCard(31, 100, currentDate);
      
      expect(result.morning).toBeGreaterThanOrEqual(1);
      expect(result.morning).toBeLessThanOrEqual(22);
      expect(result.day).toBeGreaterThanOrEqual(1);
      expect(result.day).toBeLessThanOrEqual(22);
      expect(result.evening).toBeGreaterThanOrEqual(1);
      expect(result.evening).toBeLessThanOrEqual(22);
      expect(result.night).toBeGreaterThanOrEqual(1);
      expect(result.night).toBeLessThanOrEqual(22);
    });
  });

  describe('Интеграционные тесты', () => {
    it('должен правильно вычислять карту дня для реального примера', () => {
      // Пример: Анна, родилась 15 числа
      // Сумма имени "Анна" = 32 (А=1, Н=15, Н=15, А=1)
      // Текущая дата: 15.06.2024
      const currentDate = new Date(2024, 5, 15);
      const result = calculateDayCard(15, 32, currentDate);
      
      // Утро: 15 (день рождения)
      expect(result.morning).toBe(15);
      
      // День: 1+5+0+6+2+0+2+4 = 20
      expect(result.day).toBe(20);
      
      // Вечер: 32 + 15 + 20 = 67 -> 1 (67 - 22 - 22 - 22 = 1)
      expect(result.evening).toBe(1);
      
      // Ночь: 20 + 1 = 21
      expect(result.night).toBe(21);
    });
  });
});
