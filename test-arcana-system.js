/**
 * Скрипт для ручного тестирования системы арканов
 * 
 * Проверяет:
 * 1. Корректность алгоритма расчета
 * 2. Сериализацию/десериализацию данных
 * 3. Форматирование для отображения
 */

const { calculateDayCard, calculateDateSum } = require('./lib/arcana/arcanaCalculator.ts');
const { serializeArcanaData, parseArcanaData, formatArcanaForDisplay } = require('./lib/arcana/serialization.ts');

console.log('=== Тестирование системы арканов ===\n');

// Тест 1: Проверка примера из спецификации
console.log('Тест 1: Пример из спецификации');
console.log('Дата рождения: 13.12.1984');
console.log('Текущая дата: 20.02.2026');
console.log('Имя: Алексей (сумма = 5)\n');

const birthDate = new Date(1984, 11, 13);
const currentDate = new Date(2026, 1, 20);
const nameSum = 5;

const birthDateSum = calculateDateSum(birthDate);
const currentDateSum = calculateDateSum(currentDate);

console.log(`Сумма даты рождения: ${birthDateSum} (ожидается 11)`);
console.log(`Сумма текущей даты: ${currentDateSum} (ожидается 5)\n`);

const arcana = calculateDayCard(birthDate, nameSum, currentDate);

console.log('Результаты расчета:');
console.log(`  Утро: ${arcana.morning} (ожидается 16)`);
console.log(`  День: ${arcana.day} (ожидается 11)`);
console.log(`  Вечер: ${arcana.evening} (ожидается 10)`);
console.log(`  Ночь: ${arcana.night} (ожидается 15)\n`);

// Проверка результатов
const isCorrect = 
  arcana.morning === 16 &&
  arcana.day === 11 &&
  arcana.evening === 10 &&
  arcana.night === 15;

console.log(`Результат: ${isCorrect ? '✅ УСПЕХ' : '❌ ОШИБКА'}\n`);

// Тест 2: Сериализация и десериализация
console.log('Тест 2: Сериализация и десериализация');
const serialized = serializeArcanaData(arcana);
console.log(`Сериализованные данные: ${serialized}`);

const parsed = parseArcanaData(serialized);
console.log(`Парсинг успешен: ${parsed.success ? '✅' : '❌'}`);
console.log(`Данные совпадают: ${JSON.stringify(parsed.data) === JSON.stringify(arcana) ? '✅' : '❌'}\n`);

// Тест 3: Форматирование для отображения
console.log('Тест 3: Форматирование для отображения');
const formattedRu = formatArcanaForDisplay(arcana, 'ru');
const formattedEn = formatArcanaForDisplay(arcana, 'en');

console.log('Русский язык:');
console.log(`  ${formattedRu.morning}`);
console.log(`  ${formattedRu.day}`);
console.log(`  ${formattedRu.evening}`);
console.log(`  ${formattedRu.night}\n`);

console.log('Английский язык:');
console.log(`  ${formattedEn.morning}`);
console.log(`  ${formattedEn.day}`);
console.log(`  ${formattedEn.evening}`);
console.log(`  ${formattedEn.night}\n`);

// Тест 4: Проверка изменения арканов при смене даты
console.log('Тест 4: Изменение арканов при смене даты');
const tomorrow = new Date(2026, 1, 21);
const arcanaTomorrow = calculateDayCard(birthDate, nameSum, tomorrow);

const hasChanged = 
  arcana.morning !== arcanaTomorrow.morning ||
  arcana.day !== arcanaTomorrow.day ||
  arcana.evening !== arcanaTomorrow.evening ||
  arcana.night !== arcanaTomorrow.night;

console.log(`Арканы изменились: ${hasChanged ? '✅ ДА' : '❌ НЕТ'}`);
console.log(`  Утро: ${arcana.morning} → ${arcanaTomorrow.morning}`);
console.log(`  День: ${arcana.day} → ${arcanaTomorrow.day}`);
console.log(`  Вечер: ${arcana.evening} → ${arcanaTomorrow.evening}`);
console.log(`  Ночь: ${arcana.night} → ${arcanaTomorrow.night}\n`);

console.log('=== Тестирование завершено ===');
