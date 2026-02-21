/**
 * Unit-тесты для валидации дат
 * Требования: 3.2, 3.3, 3.5
 */

import { validateBirthDate } from '@/lib/validation/date';

describe('Birth Date Validation', () => {
  describe('Корректные даты', () => {
    it('должен принимать корректную дату', () => {
      const result = validateBirthDate({ day: 15, month: 6, year: 1990 });
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('должен принимать дату 1 января 1900', () => {
      const result = validateBirthDate({ day: 1, month: 1, year: 1900 });
      expect(result.isValid).toBe(true);
    });

    it('должен принимать текущую дату', () => {
      const today = new Date();
      const result = validateBirthDate({
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
      });
      expect(result.isValid).toBe(true);
    });

    it('должен принимать високосный день (29 февраля 2000)', () => {
      const result = validateBirthDate({ day: 29, month: 2, year: 2000 });
      expect(result.isValid).toBe(true);
    });
  });

  describe('Некорректные даты', () => {
    it('должен отклонять 31 февраля', () => {
      const result = validateBirthDate({ day: 31, month: 2, year: 2000 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('должен отклонять 32 января', () => {
      const result = validateBirthDate({ day: 32, month: 1, year: 2000 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('должен отклонять 29 февраля в невисокосный год', () => {
      const result = validateBirthDate({ day: 29, month: 2, year: 2001 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('должен отклонять 31 апреля', () => {
      const result = validateBirthDate({ day: 31, month: 4, year: 2000 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('должен отклонять день 0', () => {
      const result = validateBirthDate({ day: 0, month: 1, year: 2000 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('должен отклонять месяц 0', () => {
      const result = validateBirthDate({ day: 1, month: 0, year: 2000 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('должен отклонять месяц 13', () => {
      const result = validateBirthDate({ day: 1, month: 13, year: 2000 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Будущие даты', () => {
    it('должен отклонять дату в будущем', () => {
      const futureYear = new Date().getFullYear() + 1;
      const result = validateBirthDate({ day: 1, month: 1, year: futureYear });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('будущем');
    });

    it('должен отклонять завтрашнюю дату', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = validateBirthDate({
        day: tomorrow.getDate(),
        month: tomorrow.getMonth() + 1,
        year: tomorrow.getFullYear(),
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('будущем');
    });
  });

  describe('Даты до 1900 года', () => {
    it('должен отклонять дату 31 декабря 1899', () => {
      const result = validateBirthDate({ day: 31, month: 12, year: 1899 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('должен отклонять дату 1 января 1800', () => {
      const result = validateBirthDate({ day: 1, month: 1, year: 1800 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
