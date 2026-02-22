/**
 * Утилиты для сериализации и десериализации данных арканов
 * 
 * Обеспечивает типобезопасное преобразование данных арканов между
 * объектами TypeScript и JSON строками для хранения в localStorage.
 */

import { DayCardResult } from './arcanaCalculator';

/**
 * Результат парсинга данных арканов
 */
export interface ParseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Сериализует данные арканов в JSON строку
 * 
 * Валидирует, что все значения арканов находятся в диапазоне 1-22
 * перед сериализацией.
 * 
 * @param arcana - Объект с данными арканов
 * @returns JSON строка с данными арканов
 * @throws Error если значения арканов вне диапазона 1-22
 * 
 * @example
 * const arcana = { morning: 15, day: 8, evening: 12, night: 20 };
 * const json = serializeArcanaData(arcana);
 * // '{"morning":15,"day":8,"evening":12,"night":20}'
 */
export function serializeArcanaData(arcana: DayCardResult): string {
  // Валидация значений перед сериализацией
  const values = [arcana.morning, arcana.day, arcana.evening, arcana.night];
  
  for (const value of values) {
    if (typeof value !== 'number' || value < 1 || value > 22) {
      throw new Error(`Invalid arcana value: ${value}. Must be between 1 and 22.`);
    }
  }
  
  return JSON.stringify(arcana);
}

/**
 * Десериализует JSON строку в объект арканов
 * 
 * Выполняет полную валидацию:
 * - Проверка валидности JSON
 * - Проверка наличия всех обязательных полей
 * - Проверка типов (все значения должны быть числами)
 * - Проверка диапазона значений (1-22)
 * 
 * @param jsonString - JSON строка с данными арканов
 * @returns Результат парсинга с данными или ошибкой
 * 
 * @example
 * const json = '{"morning":15,"day":8,"evening":12,"night":20}';
 * const result = parseArcanaData(json);
 * if (result.success) {
 *   console.log(result.data); // { morning: 15, day: 8, evening: 12, night: 20 }
 * } else {
 *   console.error(result.error);
 * }
 */
export function parseArcanaData(jsonString: string): ParseResult<DayCardResult> {
  try {
    // Парсинг JSON
    const data = JSON.parse(jsonString);
    
    // Проверка структуры
    if (!data || typeof data !== 'object') {
      return { 
        success: false, 
        error: 'Invalid data structure: expected an object' 
      };
    }
    
    // Проверка наличия всех обязательных полей
    const requiredFields: (keyof DayCardResult)[] = ['morning', 'day', 'evening', 'night'];
    
    for (const field of requiredFields) {
      if (!(field in data)) {
        return { 
          success: false, 
          error: `Missing required field: ${field}` 
        };
      }
      
      // Проверка типа
      if (typeof data[field] !== 'number') {
        return { 
          success: false, 
          error: `Field ${field} must be a number, got ${typeof data[field]}` 
        };
      }
      
      // Проверка диапазона
      if (data[field] < 1 || data[field] > 22) {
        return { 
          success: false, 
          error: `Field ${field} must be between 1 and 22, got ${data[field]}` 
        };
      }
    }
    
    // Все проверки пройдены
    return { 
      success: true, 
      data: {
        morning: data.morning,
        day: data.day,
        evening: data.evening,
        night: data.night,
      }
    };
    
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown parsing error' 
    };
  }
}

/**
 * Форматирует данные арканов для отображения пользователю
 * 
 * Возвращает локализованные строки с названиями периодов дня
 * и номерами арканов.
 * 
 * @param arcana - Объект с данными арканов
 * @param locale - Язык интерфейса ('ru' | 'en')
 * @returns Объект с форматированными строками для каждого периода
 * 
 * @example
 * const arcana = { morning: 15, day: 8, evening: 12, night: 20 };
 * const formatted = formatArcanaForDisplay(arcana, 'ru');
 * console.log(formatted.morning); // "Утро: Аркан 15"
 * 
 * const formattedEn = formatArcanaForDisplay(arcana, 'en');
 * console.log(formattedEn.morning); // "Morning: Arcana 15"
 */
export function formatArcanaForDisplay(
  arcana: DayCardResult,
  locale: string
): {
  morning: string;
  day: string;
  evening: string;
  night: string;
} {
  const isRussian = locale === 'ru';
  
  const labels = {
    morning: isRussian ? 'Утро' : 'Morning',
    day: isRussian ? 'День' : 'Day',
    evening: isRussian ? 'Вечер' : 'Evening',
    night: isRussian ? 'Ночь' : 'Night',
    arcana: isRussian ? 'Аркан' : 'Arcana',
  };
  
  return {
    morning: `${labels.morning}: ${labels.arcana} ${arcana.morning}`,
    day: `${labels.day}: ${labels.arcana} ${arcana.day}`,
    evening: `${labels.evening}: ${labels.arcana} ${arcana.evening}`,
    night: `${labels.night}: ${labels.arcana} ${arcana.night}`,
  };
}
