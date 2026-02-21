# Кеширование результатов расчетов

## Обзор

Модуль `CalculationCache` предоставляет in-memory кеширование результатов нумерологических расчетов для повышения производительности при повторных запросах с идентичными датами рождения.

## Основные возможности

- **In-memory кеширование**: Быстрое хранение и получение результатов
- **TTL (Time To Live)**: Автоматическое истечение устаревших записей
- **Ограничение размера**: FIFO удаление при достижении максимального размера
- **Автоматическая очистка**: Метод cleanup для удаления устаревших записей
- **Уникальные ключи**: Генерация ключей на основе даты рождения

## Использование

### Базовое использование

```typescript
import { calculationCache } from '@/lib/services/cache';
import { PythagoreanCalculator } from '@/lib/calculators/pythagorean';
import { DestinyCalculator } from '@/lib/calculators/destiny';

const birthDate = { day: 15, month: 6, year: 1990 };

// Проверяем кеш перед вычислением
let result = calculationCache.get(birthDate);

if (!result) {
  // Кеш пуст - выполняем расчеты
  const pythCalc = new PythagoreanCalculator();
  const destinyCalc = new DestinyCalculator();

  const workingNumbers = pythCalc.calculateWorkingNumbers(birthDate);
  const pythagoreanSquare = pythCalc.buildSquare(birthDate, workingNumbers);
  const destinyNumber = destinyCalc.calculateDestinyNumber(birthDate);
  const destinyMatrix = destinyCalc.calculateDestinyMatrix(birthDate);

  // Сохраняем в кеш
  calculationCache.set(birthDate, {
    birthDate,
    workingNumbers,
    pythagoreanSquare,
    destinyNumber,
    destinyMatrix,
  });

  result = calculationCache.get(birthDate);
}

// Используем результат
console.log('Число судьбы:', result.destinyNumber.value);
```

### Создание собственного экземпляра кеша

```typescript
import { CalculationCache } from '@/lib/services/cache';

// Кеш с максимум 500 записей и TTL 30 минут
const customCache = new CalculationCache(500, 1800000);

customCache.set(birthDate, result);
const cached = customCache.get(birthDate);
```

## API

### CalculationCache

#### Конструктор

```typescript
constructor(maxSize?: number, ttl?: number)
```

- `maxSize` - Максимальное количество записей (по умолчанию: 1000)
- `ttl` - Время жизни записи в миллисекундах (по умолчанию: 3600000 = 1 час)

#### Методы

##### get(date: BirthDate): CalculationResult | null

Получает результат расчета из кеша.

```typescript
const result = cache.get({ day: 15, month: 6, year: 1990 });
if (result) {
  console.log('Найдено в кеше');
} else {
  console.log('Не найдено в кеше');
}
```

##### set(date: BirthDate, result: Omit<CalculationResult, 'timestamp'>): void

Сохраняет результат расчета в кеш.

```typescript
cache.set(birthDate, {
  birthDate,
  workingNumbers,
  pythagoreanSquare,
  destinyNumber,
  destinyMatrix,
});
```

##### clear(): void

Очищает весь кеш.

```typescript
cache.clear();
console.log('Кеш очищен');
```

##### size(): number

Возвращает текущее количество записей в кеше.

```typescript
console.log(`Записей в кеше: ${cache.size()}`);
```

##### cleanup(): number

Удаляет все устаревшие записи и возвращает количество удаленных.

```typescript
const deletedCount = cache.cleanup();
console.log(`Удалено устаревших записей: ${deletedCount}`);
```

## Типы данных

### CalculationResult

```typescript
interface CalculationResult {
  birthDate: BirthDate;
  workingNumbers: WorkingNumbers;
  pythagoreanSquare: PythagoreanSquare;
  destinyNumber: DestinyNumber;
  destinyMatrix: DestinyMatrix;
  timestamp: number; // Время создания кеша
}
```

### BirthDate

```typescript
interface BirthDate {
  day: number;
  month: number;
  year: number;
}
```

## Генерация ключей

Ключи кеша генерируются в формате `DD-MM-YYYY`:

```typescript
{ day: 5, month: 3, year: 1990 } → "05-03-1990"
{ day: 15, month: 12, year: 2000 } → "15-12-2000"
```

Это обеспечивает:
- Уникальность для каждой даты
- Консистентность при повторных запросах
- Читаемость для отладки

## Управление памятью

### Ограничение размера (maxSize)

Когда кеш достигает максимального размера, самая старая запись удаляется (FIFO):

```typescript
const cache = new CalculationCache(2); // Максимум 2 записи

cache.set(date1, result1); // Кеш: [date1]
cache.set(date2, result2); // Кеш: [date1, date2]
cache.set(date3, result3); // Кеш: [date2, date3] (date1 удалена)
```

### Time To Live (TTL)

Записи автоматически истекают после TTL:

```typescript
const cache = new CalculationCache(1000, 60000); // TTL = 1 минута

cache.set(birthDate, result);

// Через 30 секунд
cache.get(birthDate); // Возвращает результат

// Через 2 минуты
cache.get(birthDate); // Возвращает null (запись истекла)
```

### Автоматическая очистка

Рекомендуется периодически вызывать `cleanup()` для освобождения памяти:

```typescript
// Очистка каждые 5 минут
setInterval(() => {
  const deleted = calculationCache.cleanup();
  console.log(`Очищено записей: ${deleted}`);
}, 300000);
```

## Производительность

### Преимущества кеширования

- **Скорость**: O(1) доступ к результатам
- **Снижение нагрузки**: Избегание повторных вычислений
- **Улучшение UX**: Мгновенные результаты для повторных запросов

### Метрики

```typescript
const startTime = performance.now();

// Первый расчет (без кеша)
let result = calculationCache.get(birthDate);
if (!result) {
  // Выполняем расчеты...
  calculationCache.set(birthDate, result);
}

const firstTime = performance.now() - startTime;
console.log(`Первый расчет: ${firstTime}ms`);

// Второй расчет (из кеша)
const cacheStartTime = performance.now();
result = calculationCache.get(birthDate);
const cacheTime = performance.now() - cacheStartTime;

console.log(`Из кеша: ${cacheTime}ms`);
console.log(`Ускорение: ${(firstTime / cacheTime).toFixed(2)}x`);
```

Ожидаемые результаты:
- Первый расчет: ~50-100ms
- Из кеша: <1ms
- Ускорение: 50-100x

## Интеграция с компонентами

### Пример в React компоненте

```typescript
'use client';

import { useState } from 'react';
import { calculationCache } from '@/lib/services/cache';
import { PythagoreanCalculator } from '@/lib/calculators/pythagorean';
import { DestinyCalculator } from '@/lib/calculators/destiny';

export function Calculator() {
  const [result, setResult] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  const handleCalculate = (birthDate) => {
    // Проверяем кеш
    let cached = calculationCache.get(birthDate);
    
    if (cached) {
      setResult(cached);
      setFromCache(true);
      return;
    }

    // Выполняем расчеты
    const pythCalc = new PythagoreanCalculator();
    const destinyCalc = new DestinyCalculator();

    const workingNumbers = pythCalc.calculateWorkingNumbers(birthDate);
    const pythagoreanSquare = pythCalc.buildSquare(birthDate, workingNumbers);
    const destinyNumber = destinyCalc.calculateDestinyNumber(birthDate);
    const destinyMatrix = destinyCalc.calculateDestinyMatrix(birthDate);

    const newResult = {
      birthDate,
      workingNumbers,
      pythagoreanSquare,
      destinyNumber,
      destinyMatrix,
    };

    // Сохраняем в кеш
    calculationCache.set(birthDate, newResult);
    
    setResult(newResult);
    setFromCache(false);
  };

  return (
    <div>
      {/* UI компонента */}
      {fromCache && <span>⚡ Результат из кеша</span>}
    </div>
  );
}
```

## Тестирование

### Unit-тесты

Полный набор unit-тестов доступен в `__tests__/lib/services/cache/CalculationCache.test.ts`:

- Сохранение и получение результатов
- Генерация ключей
- TTL и истечение записей
- Ограничение размера
- Очистка кеша
- Идемпотентность

Запуск тестов:

```bash
npm test __tests__/lib/services/cache/CalculationCache.test.ts
```

### Пример теста

```typescript
describe('CalculationCache', () => {
  it('should cache and retrieve results', () => {
    const cache = new CalculationCache();
    const birthDate = { day: 15, month: 6, year: 1990 };
    
    cache.set(birthDate, mockResult);
    const retrieved = cache.get(birthDate);
    
    expect(retrieved).toBeDefined();
    expect(retrieved?.birthDate).toEqual(birthDate);
  });
});
```

## Лучшие практики

### 1. Используйте глобальный экземпляр

```typescript
// ✅ Хорошо
import { calculationCache } from '@/lib/services/cache';

// ❌ Плохо - создание нового экземпляра
const cache = new CalculationCache();
```

### 2. Проверяйте кеш перед вычислениями

```typescript
// ✅ Хорошо
let result = cache.get(birthDate);
if (!result) {
  result = performCalculations(birthDate);
  cache.set(birthDate, result);
}

// ❌ Плохо - всегда вычисляем
const result = performCalculations(birthDate);
cache.set(birthDate, result);
```

### 3. Периодически очищайте устаревшие записи

```typescript
// ✅ Хорошо
setInterval(() => cache.cleanup(), 300000);

// ❌ Плохо - никогда не очищаем
```

### 4. Настраивайте TTL под ваши нужды

```typescript
// ✅ Хорошо - короткий TTL для часто меняющихся данных
const cache = new CalculationCache(1000, 600000); // 10 минут

// ✅ Хорошо - длинный TTL для статичных данных
const cache = new CalculationCache(1000, 86400000); // 24 часа
```

## Ограничения

### In-memory хранение

- Кеш хранится в памяти процесса
- Данные теряются при перезапуске сервера
- Не подходит для распределенных систем

### Для production

Для production-окружения рекомендуется использовать:
- **Redis** для распределенного кеширования
- **Memcached** для высокой производительности
- **CDN** для кеширования на уровне сети

### Миграция на Redis

```typescript
// Пример с Redis
import { createClient } from 'redis';

const redis = createClient();

async function getCached(birthDate: BirthDate) {
  const key = `calc:${birthDate.day}-${birthDate.month}-${birthDate.year}`;
  const cached = await redis.get(key);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  return null;
}

async function setCached(birthDate: BirthDate, result: any) {
  const key = `calc:${birthDate.day}-${birthDate.month}-${birthDate.year}`;
  await redis.setEx(key, 3600, JSON.stringify(result)); // TTL 1 час
}
```

## Мониторинг

### Метрики кеша

```typescript
function getCacheStats() {
  return {
    size: calculationCache.size(),
    hitRate: calculateHitRate(), // Реализуйте свою логику
    memoryUsage: process.memoryUsage().heapUsed,
  };
}

// Логирование каждые 5 минут
setInterval(() => {
  const stats = getCacheStats();
  console.log('Cache stats:', stats);
}, 300000);
```

## Заключение

Модуль `CalculationCache` обеспечивает эффективное кеширование результатов нумерологических расчетов, значительно улучшая производительность приложения при повторных запросах. Используйте его для оптимизации пользовательского опыта и снижения вычислительной нагрузки.
