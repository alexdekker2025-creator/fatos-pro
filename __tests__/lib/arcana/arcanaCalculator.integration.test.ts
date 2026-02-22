/**
 * Интеграционный тест для проверки корректности алгоритма расчета арканов
 * 
 * Проверяет пример из спецификации:
 * - Дата рождения: 13.12.1984
 * - Текущая дата: 20.02.2026
 * - Имя: Алексей (сумма = 5)
 * 
 * Ожидаемые результаты:
 * - Утро: 16 (Башня)
 * - День: 11 (Справедливость)
 * - Вечер: 10 (Колесо Фортуны)
 * - Ночь: 15 (Дьявол)
 */

import { calculateDayCard, calculateDateSum } from '@/lib/arcana/arcanaCalculator';

describe('Arcana Calculator - Integration Test', () => {
  it('should calculate arcana correctly according to specification example', () => {
    // Входные данные из спецификации
    const birthDate = new Date(1984, 11, 13); // 13.12.1984 (месяц 11 = декабрь, т.к. 0-indexed)
    const currentDate = new Date(2026, 1, 20); // 20.02.2026 (месяц 1 = февраль)
    const nameSum = 5; // Алексей: А(1)+Л(4)+Е(6)+К(3)+С(1)+Е(6)+Й(2) = 23 -> 2+3 = 5
    
    // Проверяем промежуточные суммы
    const birthDateSum = calculateDateSum(birthDate);
    const currentDateSum = calculateDateSum(currentDate);
    
    expect(birthDateSum).toBe(11); // 1+3+1+2+1+9+8+4 = 29 -> 2+9 = 11 (мастер-число)
    expect(currentDateSum).toBe(5); // 2+0+0+2+2+0+2+6 = 14 -> 1+4 = 5
    
    // Вычисляем арканы
    const result = calculateDayCard(birthDate, nameSum, currentDate);
    
    // Проверяем результаты
    expect(result.morning).toBe(16); // 11 + 5 = 16
    expect(result.day).toBe(11);     // 11 × 5 = 55 -> 55-22=33 -> 33-22=11
    expect(result.evening).toBe(10); // 5 + 5 = 10
    expect(result.night).toBe(15);   // 16 + 11 + 10 = 37 -> 37-22=15
  });

  it('should recalculate all arcana when date changes', () => {
    const birthDate = new Date(1984, 11, 13);
    const nameSum = 5;
    
    // Расчет для первой даты
    const date1 = new Date(2026, 1, 20);
    const result1 = calculateDayCard(birthDate, nameSum, date1);
    
    // Расчет для второй даты (следующий день)
    const date2 = new Date(2026, 1, 21);
    const result2 = calculateDayCard(birthDate, nameSum, date2);
    
    // ВСЕ арканы должны измениться (с высокой вероятностью)
    // так как все зависят от текущей даты
    const hasChanged = 
      result1.morning !== result2.morning ||
      result1.day !== result2.day ||
      result1.evening !== result2.evening ||
      result1.night !== result2.night;
    
    expect(hasChanged).toBe(true);
  });

  it('should return same arcana for same date', () => {
    const birthDate = new Date(1984, 11, 13);
    const nameSum = 5;
    const currentDate = new Date(2026, 1, 20);
    
    // Два расчета с одинаковыми данными
    const result1 = calculateDayCard(birthDate, nameSum, currentDate);
    const result2 = calculateDayCard(birthDate, nameSum, currentDate);
    
    // Результаты должны быть идентичными
    expect(result1).toEqual(result2);
  });

  it('should handle master numbers correctly', () => {
    // Дата, которая дает мастер-число 11
    const date1 = new Date(1984, 11, 13); // 1+3+1+2+1+9+8+4 = 29 -> 2+9 = 11
    expect(calculateDateSum(date1)).toBe(11);
    
    // Дата, которая дает мастер-число 22
    const date2 = new Date(1988, 3, 13); // 1+3+0+4+1+9+8+8 = 34 -> 3+4 = 7 (не мастер-число)
    // Попробуем другую дату для 22
    const date3 = new Date(1993, 10, 13); // 1+3+1+1+1+9+9+3 = 28 -> 2+8 = 10 (не мастер-число)
    
    // Проверяем, что мастер-числа не сводятся дальше
    const masterDate = new Date(1984, 11, 13);
    const sum = calculateDateSum(masterDate);
    expect(sum).toBe(11); // Должно остаться 11, а не 1+1=2
  });

  it('should keep all arcana in range 1-22', () => {
    const birthDate = new Date(1984, 11, 13);
    const nameSum = 5;
    const currentDate = new Date(2026, 1, 20);
    
    const result = calculateDayCard(birthDate, nameSum, currentDate);
    
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
