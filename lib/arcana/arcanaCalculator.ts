/**
 * Калькулятор арканов дня
 * 
 * Вычисляет 4 аркана дня на основе даты рождения, текущей даты и имени:
 * - Утро (Morning): основан на дне рождения
 * - День (Day): основан на текущей дате
 * - Вечер (Evening): сумма имени + утро + день
 * - Ночь (Night): день + вечер
 * 
 * Все значения приводятся к диапазону 1-22 (22 аркана Таро)
 */

/**
 * Приводит число к диапазону 1-22
 * 
 * Правила:
 * - Если число > 22, вычитаем 22 до тех пор, пока не войдет в диапазон 1-22
 * - Если число = 0, возвращаем 22 (Шут)
 * - Если число < 0, берем абсолютное значение и применяем те же правила
 * 
 * @param num - Число для приведения
 * @returns Число в диапазоне 1-22
 */
function reduceToArcana(num: number): number {
  // Обработка отрицательных чисел
  if (num < 0) {
    num = Math.abs(num);
  }
  
  // Обработка нуля
  if (num === 0) {
    return 22;
  }
  
  // Приведение к диапазону 1-22
  while (num > 22) {
    num -= 22;
  }
  
  return num;
}

/**
 * Вычисляет аркан утра на основе дня рождения
 * 
 * @param birthDay - День рождения (1-31)
 * @returns Аркан утра (1-22)
 * 
 * @example
 * calculateMorning(15) // 15
 * calculateMorning(25) // 3 (25 - 22 = 3)
 */
export function calculateMorning(birthDay: number): number {
  return reduceToArcana(birthDay);
}

/**
 * Вычисляет аркан дня на основе текущей даты
 * 
 * Суммирует все цифры текущей даты (день + месяц + год) и приводит к 1-22
 * 
 * @param currentDate - Текущая дата
 * @returns Аркан дня (1-22)
 * 
 * @example
 * calculateDay(new Date(2024, 0, 15)) // 15 + 1 + 2 + 0 + 2 + 4 = 24 -> 2 (24 - 22 = 2)
 */
export function calculateDay(currentDate: Date): number {
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // getMonth() возвращает 0-11
  const year = currentDate.getFullYear();
  
  // Суммируем все цифры даты
  const dateString = `${day}${month}${year}`;
  let sum = 0;
  
  for (const char of dateString) {
    sum += parseInt(char, 10);
  }
  
  return reduceToArcana(sum);
}

/**
 * Вычисляет аркан вечера
 * 
 * Формула: сумма имени + утро + день, приведенная к 1-22
 * 
 * @param nameSum - Сумма букв имени (из sumNameLetters)
 * @param morning - Аркан утра
 * @param day - Аркан дня
 * @returns Аркан вечера (1-22)
 * 
 * @example
 * calculateEvening(32, 15, 2) // 32 + 15 + 2 = 49 -> 5 (49 - 22 - 22 = 5)
 */
export function calculateEvening(nameSum: number, morning: number, day: number): number {
  const sum = nameSum + morning + day;
  return reduceToArcana(sum);
}

/**
 * Вычисляет аркан ночи
 * 
 * Формула: день + вечер, приведенная к 1-22
 * 
 * @param day - Аркан дня
 * @param evening - Аркан вечера
 * @returns Аркан ночи (1-22)
 * 
 * @example
 * calculateNight(2, 5) // 2 + 5 = 7
 */
export function calculateNight(day: number, evening: number): number {
  const sum = day + evening;
  return reduceToArcana(sum);
}

/**
 * Интерфейс для результата расчета карты дня
 */
export interface DayCardResult {
  morning: number;   // Аркан утра (1-22)
  day: number;       // Аркан дня (1-22)
  evening: number;   // Аркан вечера (1-22)
  night: number;     // Аркан ночи (1-22)
}

/**
 * Вычисляет все 4 аркана дня
 * 
 * @param birthDay - День рождения (1-31)
 * @param nameSum - Сумма букв имени
 * @param currentDate - Текущая дата (по умолчанию - сегодня)
 * @returns Объект с 4 арканами дня
 * 
 * @example
 * calculateDayCard(15, 32) // { morning: 15, day: 2, evening: 5, night: 7 }
 */
export function calculateDayCard(
  birthDay: number,
  nameSum: number,
  currentDate: Date = new Date()
): DayCardResult {
  const morning = calculateMorning(birthDay);
  const day = calculateDay(currentDate);
  const evening = calculateEvening(nameSum, morning, day);
  const night = calculateNight(day, evening);
  
  return {
    morning,
    day,
    evening,
    night,
  };
}


/**
 * Класс-обертка для функций расчета арканов
 * Предоставляет объектно-ориентированный интерфейс
 */
export class ArcanaCalculator {
  /**
   * Вычисляет аркан утра на основе дня рождения
   */
  calculateMorning(birthDay: number): number {
    return calculateMorning(birthDay);
  }

  /**
   * Вычисляет аркан дня на основе текущей даты
   */
  calculateDay(currentDate: Date): number {
    return calculateDay(currentDate);
  }

  /**
   * Вычисляет аркан вечера
   */
  calculateEvening(nameSum: number, morning: number, day: number): number {
    return calculateEvening(nameSum, morning, day);
  }

  /**
   * Вычисляет аркан ночи
   */
  calculateNight(day: number, evening: number): number {
    return calculateNight(day, evening);
  }

  /**
   * Вычисляет все 4 аркана дня
   */
  calculateDayCard(
    birthDay: number,
    nameSum: number,
    currentDate: Date = new Date()
  ): DayCardResult {
    return calculateDayCard(birthDay, nameSum, currentDate);
  }
}
