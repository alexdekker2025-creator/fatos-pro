/**
 * Модуль валидации дат рождения
 */

import { BirthDateSchema } from './schemas';
import { BirthDate } from '@/types/numerology';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Валидирует дату рождения
 * 
 * Проверки:
 * - Корректность даты (существует ли такая дата)
 * - Диапазон дат (1900 - текущий год)
 * - Будущие даты (не допускаются)
 * 
 * @param date - Дата рождения для валидации
 * @returns Результат валидации с флагом isValid и сообщением об ошибке
 */
export function validateBirthDate(date: BirthDate): ValidationResult {
  try {
    // Проверка на будущую дату перед Zod-валидацией
    const inputDate = new Date(date.year, date.month - 1, date.day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Сброс времени для корректного сравнения
    
    if (inputDate > today) {
      return {
        isValid: false,
        error: 'Дата рождения не может быть в будущем',
      };
    }
    
    // Валидация через Zod-схему
    BirthDateSchema.parse(date);
    
    return {
      isValid: true,
    };
  } catch (error: any) {
    // Обработка ошибок Zod
    if (error.errors && error.errors.length > 0) {
      const firstError = error.errors[0];
      return {
        isValid: false,
        error: firstError.message,
      };
    }
    
    return {
      isValid: false,
      error: 'Ошибка валидации даты',
    };
  }
}
