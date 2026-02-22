/**
 * React hook для отслеживания смены даты (полночь)
 * 
 * Периодически проверяет текущую дату и вызывает callback
 * при обнаружении смены даты.
 */

import { useEffect, useState, useRef } from 'react';

/**
 * Опции для хука useMidnightCheck
 */
export interface UseMidnightCheckOptions {
  /**
   * Callback функция, вызываемая при смене даты
   */
  onMidnight: () => void;
  
  /**
   * Включить/выключить проверку
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Интервал проверки в миллисекундах
   * @default 60000 (1 минута)
   */
  checkIntervalMs?: number;
}

/**
 * Возвращаемое значение хука useMidnightCheck
 */
export interface UseMidnightCheckReturn {
  /**
   * Дата последней проверки
   */
  lastCheckDate: Date | null;
  
  /**
   * Активна ли проверка в данный момент
   */
  isChecking: boolean;
}

/**
 * Hook для отслеживания смены даты
 * 
 * Устанавливает интервал для периодической проверки текущей даты.
 * При обнаружении смены даты (переход через полночь) вызывает callback.
 * 
 * @param options - Опции хука
 * @returns Объект с информацией о состоянии проверки
 * 
 * @example
 * ```tsx
 * const { lastCheckDate, isChecking } = useMidnightCheck({
 *   onMidnight: () => {
 *     console.log('Midnight reached! Recalculating...');
 *     recalculateArcana();
 *   },
 *   enabled: hasResults,
 *   checkIntervalMs: 60000, // Проверка каждую минуту
 * });
 * ```
 */
export function useMidnightCheck(options: UseMidnightCheckOptions): UseMidnightCheckReturn {
  const {
    onMidnight,
    enabled = true,
    checkIntervalMs = 60000, // По умолчанию 1 минута
  } = options;

  const [lastCheckDate, setLastCheckDate] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  // Используем ref для хранения последней даты, чтобы избежать лишних ререндеров
  const lastDateStringRef = useRef<string | null>(null);
  
  // Используем ref для callback, чтобы избежать пересоздания интервала при изменении callback
  const onMidnightRef = useRef(onMidnight);
  
  // Обновляем ref при изменении callback
  useEffect(() => {
    onMidnightRef.current = onMidnight;
  }, [onMidnight]);

  useEffect(() => {
    // Если проверка отключена, ничего не делаем
    if (!enabled) {
      setIsChecking(false);
      return;
    }

    setIsChecking(true);

    // Инициализация: сохраняем текущую дату
    const now = new Date();
    const currentDateString = now.toDateString();
    lastDateStringRef.current = currentDateString;
    setLastCheckDate(now);

    // Функция проверки смены даты
    const checkDate = () => {
      const now = new Date();
      const currentDateString = now.toDateString();
      
      // Сравниваем строковое представление дат (игнорирует время)
      if (lastDateStringRef.current && lastDateStringRef.current !== currentDateString) {
        console.log('[useMidnightCheck] Date changed detected:', {
          previous: lastDateStringRef.current,
          current: currentDateString,
        });
        
        // Дата изменилась - вызываем callback
        onMidnightRef.current();
        
        // Обновляем сохраненную дату
        lastDateStringRef.current = currentDateString;
        setLastCheckDate(now);
      } else {
        // Дата не изменилась, просто обновляем время последней проверки
        setLastCheckDate(now);
      }
    };

    // Устанавливаем интервал для периодической проверки
    const intervalId = setInterval(checkDate, checkIntervalMs);

    // Cleanup: очищаем интервал при размонтировании или изменении зависимостей
    return () => {
      clearInterval(intervalId);
      setIsChecking(false);
    };
  }, [enabled, checkIntervalMs]);

  return {
    lastCheckDate,
    isChecking,
  };
}
