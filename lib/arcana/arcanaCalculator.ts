/**
 * Калькулятор арканов дня (ИСПРАВЛЕННЫЙ АЛГОРИТМ)
 * 
 * Вычисляет 4 аркана дня на основе даты рождения, текущей даты и имени:
 * - Утро (Morning): (сумма даты рождения + сумма текущей даты) mod 22
 * - День (Day): (сумма даты рождения × сумма текущей даты) mod 22
 * - Вечер (Evening): (сумма имени + сумма текущей даты) mod 22
 * - Ночь (Night): (утро + день + вечер) mod 22
 * 
 * ВАЖНО: Мастер-числа 11 и 22 НЕ сводятся дальше при расчете сумм дат
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
 * Вычисляет сумму цифр даты с учетом мастер-чисел (11, 22)
 * 
 * Правила:
 * 1. Суммируем все цифры даты (DD + MM + YYYY)
 * 2. Сводим к однозначному числу путем повторного суммирования
 * 3. ИСКЛЮЧЕНИЕ: Если результат 11 или 22, ОСТАНАВЛИВАЕМСЯ (мастер-числа)
 * 
 * @param date - Дата для расчета
 * @returns Сумма цифр (может быть 11 или 22 как мастер-числа, иначе 1-9)
 * 
 * @example
 * calculateDateSum(new Date(1984, 11, 13)) // 13.12.1984
 * // 1+3+1+2+1+9+8+4 = 29 -> 2+9 = 11 (СТОП, мастер-число)
 * 
 * calculateDateSum(new Date(2026, 1, 20)) // 20.02.2026
 * // 2+0+0+2+2+0+2+6 = 14 -> 1+4 = 5
 */
export function calculateDateSum(date: Date): number {
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() возвращает 0-11
  const year = date.getFullYear();
  
  // Суммируем все цифры даты
  const dateString = `${day}${month}${year}`;
  let sum = 0;
  
  for (const char of dateString) {
    sum += parseInt(char, 10);
  }
  
  // Сводим к однозначному числу, но останавливаемся на мастер-числах
  while (sum > 22) {
    const digits = sum.toString().split('');
    sum = digits.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    
    // Проверка на мастер-числа
    if (sum === 11 || sum === 22) {
      return sum;
    }
  }
  
  // Если sum <= 22 и не мастер-число, продолжаем сводить до однозначного
  while (sum > 9 && sum !== 11 && sum !== 22) {
    const digits = sum.toString().split('');
    sum = digits.reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  
  return sum;
}

/**
 * Вычисляет аркан утра (НОВЫЙ АЛГОРИТМ)
 * 
 * Формула: (сумма даты рождения + сумма текущей даты) mod 22
 * 
 * @param birthDate - Дата рождения
 * @param currentDate - Текущая дата
 * @returns Аркан утра (1-22)
 * 
 * @example
 * // Дата рождения: 13.12.1984 (сумма = 11)
 * // Текущая дата: 20.02.2026 (сумма = 5)
 * calculateMorning(new Date(1984, 11, 13), new Date(2026, 1, 20))
 * // 11 + 5 = 16 -> Аркан 16 (Башня)
 */
export function calculateMorning(birthDate: Date, currentDate: Date): number {
  const birthDateSum = calculateDateSum(birthDate);
  const currentDateSum = calculateDateSum(currentDate);
  
  return reduceToArcana(birthDateSum + currentDateSum);
}

/**
 * Вычисляет аркан дня (НОВЫЙ АЛГОРИТМ)
 * 
 * Формула: (сумма даты рождения × сумма текущей даты) mod 22
 * 
 * @param birthDate - Дата рождения
 * @param currentDate - Текущая дата
 * @returns Аркан дня (1-22)
 * 
 * @example
 * // Дата рождения: 13.12.1984 (сумма = 11)
 * // Текущая дата: 20.02.2026 (сумма = 5)
 * calculateDay(new Date(1984, 11, 13), new Date(2026, 1, 20))
 * // 11 × 5 = 55 -> 55-22=33 -> 33-22=11 -> Аркан 11 (Справедливость)
 */
export function calculateDay(birthDate: Date, currentDate: Date): number {
  const birthDateSum = calculateDateSum(birthDate);
  const currentDateSum = calculateDateSum(currentDate);
  
  return reduceToArcana(birthDateSum * currentDateSum);
}

/**
 * Вычисляет аркан вечера (НОВЫЙ АЛГОРИТМ)
 * 
 * Формула: (сумма имени + сумма текущей даты) mod 22
 * 
 * @param nameSum - Сумма букв имени (всегда однозначное число 1-9)
 * @param currentDate - Текущая дата
 * @returns Аркан вечера (1-22)
 * 
 * @example
 * // Имя: Алексей (сумма = 5)
 * // Текущая дата: 20.02.2026 (сумма = 5)
 * calculateEvening(5, new Date(2026, 1, 20))
 * // 5 + 5 = 10 -> Аркан 10 (Колесо Фортуны)
 */
export function calculateEvening(nameSum: number, currentDate: Date): number {
  const currentDateSum = calculateDateSum(currentDate);
  
  return reduceToArcana(nameSum + currentDateSum);
}

/**
 * Вычисляет аркан ночи (НОВЫЙ АЛГОРИТМ)
 * 
 * Формула: (утро + день + вечер) mod 22
 * 
 * @param morning - Аркан утра
 * @param day - Аркан дня
 * @param evening - Аркан вечера
 * @returns Аркан ночи (1-22)
 * 
 * @example
 * // Утро: 16, День: 11, Вечер: 10
 * calculateNight(16, 11, 10)
 * // 16 + 11 + 10 = 37 -> 37-22=15 -> Аркан 15 (Дьявол)
 */
export function calculateNight(morning: number, day: number, evening: number): number {
  const sum = morning + day + evening;
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
 * Вычисляет все 4 аркана дня (НОВЫЙ АЛГОРИТМ)
 * 
 * @param birthDate - Дата рождения
 * @param nameSum - Сумма букв имени (однозначное число 1-9)
 * @param currentDate - Текущая дата (по умолчанию - сегодня)
 * @returns Объект с 4 арканами дня
 * 
 * @example
 * // Дата рождения: 13.12.1984, Имя: Алексей (сумма=5), Дата: 20.02.2026
 * calculateDayCard(new Date(1984, 11, 13), 5, new Date(2026, 1, 20))
 * // { morning: 16, day: 11, evening: 10, night: 15 }
 */
export function calculateDayCard(
  birthDate: Date,
  nameSum: number,
  currentDate: Date = new Date()
): DayCardResult {
  const morning = calculateMorning(birthDate, currentDate);
  const day = calculateDay(birthDate, currentDate);
  const evening = calculateEvening(nameSum, currentDate);
  const night = calculateNight(morning, day, evening);
  
  return {
    morning,
    day,
    evening,
    night,
  };
}


/**
 * Класс-обертка для функций расчета арканов (НОВЫЙ АЛГОРИТМ)
 * Предоставляет объектно-ориентированный интерфейс
 */
export class ArcanaCalculator {
  /**
   * Вычисляет аркан утра
   */
  calculateMorning(birthDate: Date, currentDate: Date): number {
    return calculateMorning(birthDate, currentDate);
  }

  /**
   * Вычисляет аркан дня
   */
  calculateDay(birthDate: Date, currentDate: Date): number {
    return calculateDay(birthDate, currentDate);
  }

  /**
   * Вычисляет аркан вечера
   */
  calculateEvening(nameSum: number, currentDate: Date): number {
    return calculateEvening(nameSum, currentDate);
  }

  /**
   * Вычисляет аркан ночи
   */
  calculateNight(morning: number, day: number, evening: number): number {
    return calculateNight(morning, day, evening);
  }

  /**
   * Вычисляет все 4 аркана дня
   */
  calculateDayCard(
    birthDate: Date,
    nameSum: number,
    currentDate: Date = new Date()
  ): DayCardResult {
    return calculateDayCard(birthDate, nameSum, currentDate);
  }
  
  /**
   * Вычисляет сумму цифр даты с учетом мастер-чисел
   */
  calculateDateSum(date: Date): number {
    return calculateDateSum(date);
  }
}
