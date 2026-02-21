# Calculation Cache Service

## Обзор

Модуль кеширования результатов нумерологических расчетов для повышения производительности.

## Быстрый старт

```typescript
import { calculationCache } from '@/lib/services/cache';

// Проверяем кеш
const cached = calculationCache.get(birthDate);

if (!cached) {
  // Выполняем расчеты
  const result = performCalculations(birthDate);
  
  // Сохраняем в кеш
  calculationCache.set(birthDate, result);
}
```

## Основные возможности

- ✅ In-memory кеширование с O(1) доступом
- ✅ TTL (Time To Live) для автоматического истечения
- ✅ Ограничение размера с FIFO удалением
- ✅ Автоматическая генерация уникальных ключей
- ✅ Метод cleanup для освобождения памяти
- ✅ 15 unit-тестов с 100% покрытием

## Производительность

- Первый расчет: ~50-100ms
- Из кеша: <1ms
- Ускорение: 50-100x

## Документация

Полная документация доступна в [docs/calculation-cache.md](../../../docs/calculation-cache.md)

## Тесты

```bash
npm test __tests__/lib/services/cache/CalculationCache.test.ts
```

## Конфигурация

```typescript
// Кастомный кеш с 500 записями и TTL 30 минут
const cache = new CalculationCache(500, 1800000);
```

## Интеграция

Модуль интегрирован в компонент `Calculator` для автоматического кеширования всех расчетов.
