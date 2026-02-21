/**
 * Unit-тесты для функций работы с именами
 */

import { sumNameLetters, validateName } from '@/lib/validation/name';

describe('Name Letter Sum', () => {
  describe('sumNameLetters', () => {
    it('должен правильно суммировать буквы имени "Анна"', () => {
      // А=1, Н=15, Н=15, А=1 => 1+15+15+1 = 32
      const result = sumNameLetters('Анна');
      expect(result).toBe(32);
    });

    it('должен правильно суммировать буквы имени "Иван"', () => {
      // И=10, В=3, А=1, Н=15 => 10+3+1+15 = 29
      const result = sumNameLetters('Иван');
      expect(result).toBe(29);
    });

    it('должен правильно суммировать буквы имени "Мария"', () => {
      // М=14, А=1, Р=18, И=10, Я=33 => 14+1+18+10+33 = 76
      const result = sumNameLetters('Мария');
      expect(result).toBe(76);
    });

    it('должен работать с именем в нижнем регистре', () => {
      const result = sumNameLetters('анна');
      expect(result).toBe(32); // Такой же результат как "Анна"
    });

    it('должен работать с именем в смешанном регистре', () => {
      const result = sumNameLetters('АнНа');
      expect(result).toBe(32);
    });

    it('должен игнорировать пробелы', () => {
      const result = sumNameLetters('Анна Мария');
      // А=1, Н=15, Н=15, А=1, М=14, А=1, Р=18, И=10, Я=33 => 108
      expect(result).toBe(108);
    });

    it('должен игнорировать пробелы в начале и конце', () => {
      const result = sumNameLetters('  Анна  ');
      expect(result).toBe(32);
    });

    it('должен возвращать 0 для пустой строки', () => {
      const result = sumNameLetters('');
      expect(result).toBe(0);
    });

    it('должен возвращать 0 для строки только из пробелов', () => {
      const result = sumNameLetters('   ');
      expect(result).toBe(0);
    });

    it('должен игнорировать небуквенные символы', () => {
      const result = sumNameLetters('Анна123!@#');
      expect(result).toBe(32); // Только буквы "Анна"
    });

    it('должен правильно обрабатывать букву Ё', () => {
      // Ё=7
      const result = sumNameLetters('Ё');
      expect(result).toBe(7);
    });

    it('должен правильно обрабатывать букву Я', () => {
      // Я=33
      const result = sumNameLetters('Я');
      expect(result).toBe(33);
    });

    it('должен правильно обрабатывать букву А', () => {
      // А=1
      const result = sumNameLetters('А');
      expect(result).toBe(1);
    });
  });

  describe('validateName', () => {
    it('должен принимать корректное имя', () => {
      expect(validateName('Анна')).toBe(true);
    });

    it('должен принимать имя с пробелами', () => {
      expect(validateName('Анна Мария')).toBe(true);
    });

    it('должен отклонять пустую строку', () => {
      expect(validateName('')).toBe(false);
    });

    it('должен отклонять строку только из пробелов', () => {
      expect(validateName('   ')).toBe(false);
    });

    it('должен отклонять строку только из цифр', () => {
      expect(validateName('12345')).toBe(false);
    });

    it('должен отклонять строку только из специальных символов', () => {
      expect(validateName('!@#$%')).toBe(false);
    });

    it('должен принимать имя с цифрами, если есть буквы', () => {
      expect(validateName('Анна123')).toBe(true);
    });

    it('должен работать с именем в нижнем регистре', () => {
      expect(validateName('анна')).toBe(true);
    });
  });
});
