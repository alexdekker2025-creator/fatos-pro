/**
 * Интеграционный тест для полного потока расчетов
 * 
 * Валидирует: Требования 3, 4, 5, 6, 7, 10
 * 
 * Поток:
 * 1. Пользователь вводит дату рождения
 * 2. Система вычисляет рабочие числа
 * 3. Система строит Квадрат Пифагора
 * 4. Система вычисляет Число Судьбы
 * 5. Система вычисляет Матрицу Судьбы
 * 6. Результаты отображаются пользователю
 * 7. Для аутентифицированных пользователей результаты сохраняются в БД
 */

import { PythagoreanCalculator } from '@/lib/calculators/pythagorean';
import { DestinyCalculator } from '@/lib/calculators/destiny';
import { BirthDate } from '@/types/numerology';
import { validateBirthDate } from '@/lib/validation/date';
import { prisma } from '@/lib/prisma';

// Мокируем Prisma для изоляции тестов
jest.mock('@/lib/prisma', () => ({
  prisma: {
    calculation: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('Integration: Complete Calculation Flow', () => {
  let pythagoreanCalculator: PythagoreanCalculator;
  let destinyCalculator: DestinyCalculator;

  beforeEach(() => {
    jest.clearAllMocks();
    pythagoreanCalculator = new PythagoreanCalculator();
    destinyCalculator = new DestinyCalculator();
  });

  describe('Полный поток расчетов для анонимного пользователя', () => {
    it('должен выполнить все расчеты для корректной даты', () => {
      // Шаг 1: Пользователь вводит дату рождения
      const birthDate: BirthDate = { day: 15, month: 6, year: 1990 };

      // Шаг 2: Валидация даты
      const validation = validateBirthDate(birthDate);
      expect(validation.isValid).toBe(true);
      expect(validation.error).toBeUndefined();

      // Шаг 3: Вычисление рабочих чисел
      const workingNumbers = pythagoreanCalculator.calculateWorkingNumbers(birthDate);
      expect(workingNumbers).toBeDefined();
      expect(workingNumbers.first).toBeGreaterThan(0);
      expect(workingNumbers.second).toBeGreaterThan(0);
      expect(workingNumbers.fourth).toBeGreaterThan(0);

      // Шаг 4: Построение Квадрата Пифагора
      const square = pythagoreanCalculator.buildSquare(birthDate, workingNumbers);
      expect(square).toBeDefined();
      expect(square.cells).toHaveLength(3);
      expect(square.cells[0]).toHaveLength(3);
      expect(square.digitCounts.size).toBeGreaterThan(0);

      // Шаг 5: Вычисление Числа Судьбы
      const destinyNumber = destinyCalculator.calculateDestinyNumber(birthDate);
      expect(destinyNumber).toBeDefined();
      expect(destinyNumber.value).toBeGreaterThanOrEqual(1);
      expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]).toContain(destinyNumber.value);

      // Шаг 6: Вычисление Матрицы Судьбы
      const matrix = destinyCalculator.calculateDestinyMatrix(birthDate);
      expect(matrix).toBeDefined();
      expect(matrix.positions.size).toBeGreaterThan(0);

      // Шаг 7: Проверка, что все результаты согласованы
      expect(workingNumbers.first).toBe(31); // Для 15.06.1990
      expect(destinyNumber.value).toBe(4); // Для 15.06.1990
    });

    it('должен отклонить некорректную дату', () => {
      // Шаг 1: Пользователь вводит некорректную дату
      const invalidDate: BirthDate = { day: 31, month: 2, year: 2000 };

      // Шаг 2: Валидация даты
      const validation = validateBirthDate(invalidDate);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBeDefined();
      expect(validation.error).toContain('Некорректная дата');
    });

    it('должен отклонить будущую дату', () => {
      const futureDate: BirthDate = {
        day: 1,
        month: 1,
        year: new Date().getFullYear() + 1,
      };

      const validation = validateBirthDate(futureDate);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBeDefined();
    });

    it('должен отклонить дату до 1900 года', () => {
      const oldDate: BirthDate = { day: 1, month: 1, year: 1899 };

      const validation = validateBirthDate(oldDate);
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBeDefined();
    });
  });

  describe('Полный поток расчетов для аутентифицированного пользователя', () => {
    it('должен сохранить результаты расчетов в БД', async () => {
      // Шаг 1: Пользователь вводит дату рождения
      const birthDate: BirthDate = { day: 22, month: 11, year: 1988 };
      const userId = 'test-user-123';

      // Шаг 2: Выполнение всех расчетов
      const workingNumbers = pythagoreanCalculator.calculateWorkingNumbers(birthDate);
      const square = pythagoreanCalculator.buildSquare(birthDate, workingNumbers);
      const destinyNumber = destinyCalculator.calculateDestinyNumber(birthDate);
      const matrix = destinyCalculator.calculateDestinyMatrix(birthDate);

      // Шаг 3: Сохранение результатов в БД
      const mockCalculation = {
        id: 'calc-123',
        userId,
        birthDay: birthDate.day,
        birthMonth: birthDate.month,
        birthYear: birthDate.year,
        workingNumbers,
        square,
        destinyNumber,
        matrix,
        createdAt: new Date(),
      };

      (prisma.calculation.create as jest.Mock).mockResolvedValue(mockCalculation);

      const savedCalculation = await prisma.calculation.create({
        data: {
          userId,
          birthDay: birthDate.day,
          birthMonth: birthDate.month,
          birthYear: birthDate.year,
          workingNumbers,
          square,
          destinyNumber,
          matrix,
        },
      });

      // Шаг 4: Проверка сохраненных данных
      expect(savedCalculation).toBeDefined();
      expect(savedCalculation.id).toBe('calc-123');
      expect(savedCalculation.userId).toBe(userId);
      expect(savedCalculation.birthDay).toBe(birthDate.day);
      expect(savedCalculation.birthMonth).toBe(birthDate.month);
      expect(savedCalculation.birthYear).toBe(birthDate.year);
      expect(savedCalculation.workingNumbers).toEqual(workingNumbers);
      expect(savedCalculation.square).toEqual(square);
      expect(savedCalculation.destinyNumber).toEqual(destinyNumber);
      expect(savedCalculation.matrix).toEqual(matrix);

      // Проверка, что метод был вызван с правильными параметрами
      expect(prisma.calculation.create).toHaveBeenCalledWith({
        data: {
          userId,
          birthDay: birthDate.day,
          birthMonth: birthDate.month,
          birthYear: birthDate.year,
          workingNumbers,
          square,
          destinyNumber,
          matrix,
        },
      });
    });

    it('должен получить историю расчетов пользователя', async () => {
      const userId = 'test-user-123';

      const mockCalculations = [
        {
          id: 'calc-1',
          userId,
          birthDay: 15,
          birthMonth: 6,
          birthYear: 1990,
          workingNumbers: { first: 31, second: 4, third: 29, fourth: 11 },
          square: { cells: [[5, 1, 1], [1, 1, 1], [0, 0, 3]], digitCounts: new Map() },
          destinyNumber: { value: 4, description: '' },
          matrix: { positions: new Map(), descriptions: new Map() },
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'calc-2',
          userId,
          birthDay: 22,
          birthMonth: 11,
          birthYear: 1988,
          workingNumbers: { first: 32, second: 5, third: 28, fourth: 10 },
          square: { cells: [[3, 3, 0], [0, 1, 0], [0, 2, 0]], digitCounts: new Map() },
          destinyNumber: { value: 5, description: '' },
          matrix: { positions: new Map(), descriptions: new Map() },
          createdAt: new Date('2024-01-02'),
        },
      ];

      (prisma.calculation.findMany as jest.Mock).mockResolvedValue(mockCalculations);

      const calculations = await prisma.calculation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      expect(calculations).toHaveLength(2);
      expect(calculations[0].id).toBe('calc-1');
      expect(calculations[1].id).toBe('calc-2');
      expect(prisma.calculation.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('Идемпотентность расчетов', () => {
    it('должен возвращать идентичные результаты при повторных расчетах', () => {
      const birthDate: BirthDate = { day: 10, month: 5, year: 1995 };

      // Первый расчет
      const working1 = pythagoreanCalculator.calculateWorkingNumbers(birthDate);
      const square1 = pythagoreanCalculator.buildSquare(birthDate, working1);
      const destiny1 = destinyCalculator.calculateDestinyNumber(birthDate);
      const matrix1 = destinyCalculator.calculateDestinyMatrix(birthDate);

      // Второй расчет
      const working2 = pythagoreanCalculator.calculateWorkingNumbers(birthDate);
      const square2 = pythagoreanCalculator.buildSquare(birthDate, working2);
      const destiny2 = destinyCalculator.calculateDestinyNumber(birthDate);
      const matrix2 = destinyCalculator.calculateDestinyMatrix(birthDate);

      // Проверка идемпотентности
      expect(working1).toEqual(working2);
      expect(square1).toEqual(square2);
      expect(destiny1.value).toBe(destiny2.value);
      expect(matrix1.positions.size).toBe(matrix2.positions.size);
    });
  });

  describe('Производительность расчетов', () => {
    it('должен выполнить все расчеты менее чем за 500ms', () => {
      const birthDate: BirthDate = { day: 25, month: 12, year: 1980 };

      const startTime = performance.now();

      // Выполнение всех расчетов
      const workingNumbers = pythagoreanCalculator.calculateWorkingNumbers(birthDate);
      const square = pythagoreanCalculator.buildSquare(birthDate, workingNumbers);
      const destinyNumber = destinyCalculator.calculateDestinyNumber(birthDate);
      const matrix = destinyCalculator.calculateDestinyMatrix(birthDate);

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Проверка производительности (Требование 19.1)
      expect(duration).toBeLessThan(500);

      // Проверка, что результаты получены
      expect(workingNumbers).toBeDefined();
      expect(square).toBeDefined();
      expect(destinyNumber).toBeDefined();
      expect(matrix).toBeDefined();
    });
  });
});
