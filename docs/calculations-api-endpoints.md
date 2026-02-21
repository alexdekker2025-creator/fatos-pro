# API Эндпоинты для расчетов

## Обзор

API для сохранения и получения истории нумерологических расчетов пользователей.

## Базовый URL

```
http://localhost:3000/api/calculations
```

## Аутентификация

Все эндпоинты требуют аутентификации через заголовок Authorization:

```
Authorization: Bearer <sessionId>
```

## Эндпоинты

### 1. POST /api/calculations

Сохранение результатов расчета в базу данных.

#### Request

```http
POST /api/calculations
Authorization: Bearer session-abc123
Content-Type: application/json

{
  "birthDate": {
    "day": 15,
    "month": 6,
    "year": 1990
  },
  "calculationType": "all",
  "results": {
    "workingNumbers": {
      "first": 31,
      "second": 4,
      "third": 29,
      "fourth": 11
    },
    "pythagoreanSquare": {
      "cells": [[3, 1, 1], [1, 0, 1], [0, 0, 2]]
    },
    "destinyNumber": {
      "value": 4,
      "isMasterNumber": false
    },
    "destinyMatrix": {
      "positions": {
        "dayNumber": 6,
        "monthNumber": 6,
        "yearNumber": 1
      }
    }
  }
}
```

#### Request Headers

| Заголовок | Значение | Обязательно | Описание |
|-----------|----------|-------------|----------|
| Authorization | Bearer <sessionId> | Да | ID сессии пользователя |
| Content-Type | application/json | Да | Тип контента |

#### Request Body

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| birthDate | object | Да | Дата рождения |
| birthDate.day | number | Да | День (1-31) |
| birthDate.month | number | Да | Месяц (1-12) |
| birthDate.year | number | Да | Год |
| calculationType | string | Да | Тип расчета: "pythagorean", "destiny", "matrix", "all" |
| results | object | Да | Результаты расчета |

#### Response (201 Created)

```json
{
  "success": true,
  "calculation": {
    "id": "calc-123",
    "userId": "user-456",
    "birthDate": "1990-06-15T00:00:00.000Z",
    "calculationType": "all",
    "results": {
      "workingNumbers": { ... },
      "pythagoreanSquare": { ... },
      "destinyNumber": { ... },
      "destinyMatrix": { ... }
    },
    "createdAt": "2026-02-21T12:00:00.000Z"
  }
}
```

#### Error Responses

**400 Bad Request** - Отсутствуют обязательные поля

```json
{
  "success": false,
  "error": "Birth date is required"
}
```

**401 Unauthorized** - Невалидная или отсутствующая сессия

```json
{
  "success": false,
  "error": "Invalid or expired session"
}
```

**500 Internal Server Error** - Внутренняя ошибка сервера

```json
{
  "success": false,
  "error": "Internal server error"
}
```

#### Пример использования

```typescript
const sessionId = localStorage.getItem('sessionId');

const response = await fetch('/api/calculations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${sessionId}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    birthDate: {
      day: 15,
      month: 6,
      year: 1990,
    },
    calculationType: 'all',
    results: {
      workingNumbers: { first: 31, second: 4, third: 29, fourth: 11 },
      pythagoreanSquare: { cells: [[3, 1, 1], [1, 0, 1], [0, 0, 2]] },
      destinyNumber: { value: 4, isMasterNumber: false },
      destinyMatrix: { positions: { dayNumber: 6, monthNumber: 6, yearNumber: 1 } },
    },
  }),
});

const data = await response.json();

if (data.success) {
  console.log('Расчет сохранен:', data.calculation);
} else {
  console.error('Ошибка сохранения:', data.error);
}
```

---

### 2. GET /api/calculations

Получение истории расчетов пользователя с пагинацией.

#### Request

```http
GET /api/calculations?limit=10&offset=0
Authorization: Bearer session-abc123
```

#### Request Headers

| Заголовок | Значение | Обязательно | Описание |
|-----------|----------|-------------|----------|
| Authorization | Bearer <sessionId> | Да | ID сессии пользователя |

#### Query Parameters

| Параметр | Тип | Обязательно | По умолчанию | Описание |
|----------|-----|-------------|--------------|----------|
| limit | number | Нет | 10 | Количество записей на странице |
| offset | number | Нет | 0 | Смещение для пагинации |

#### Response (200 OK)

```json
{
  "success": true,
  "calculations": [
    {
      "id": "calc-123",
      "birthDate": "1990-06-15T00:00:00.000Z",
      "calculationType": "all",
      "results": {
        "workingNumbers": { ... },
        "pythagoreanSquare": { ... },
        "destinyNumber": { ... },
        "destinyMatrix": { ... }
      },
      "createdAt": "2026-02-21T12:00:00.000Z"
    },
    {
      "id": "calc-124",
      "birthDate": "1985-03-20T00:00:00.000Z",
      "calculationType": "destiny",
      "results": {
        "destinyNumber": { ... }
      },
      "createdAt": "2026-02-20T10:30:00.000Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

#### Error Responses

**401 Unauthorized** - Невалидная или отсутствующая сессия

```json
{
  "success": false,
  "error": "Invalid or expired session"
}
```

**500 Internal Server Error** - Внутренняя ошибка сервера

```json
{
  "success": false,
  "error": "Internal server error"
}
```

#### Пример использования

```typescript
const sessionId = localStorage.getItem('sessionId');

const response = await fetch('/api/calculations?limit=10&offset=0', {
  headers: {
    'Authorization': `Bearer ${sessionId}`,
  },
});

const data = await response.json();

if (data.success) {
  console.log(`Найдено ${data.total} расчетов`);
  console.log('Расчеты:', data.calculations);
  
  // Пагинация
  const hasMore = data.offset + data.limit < data.total;
  if (hasMore) {
    console.log('Есть еще расчеты');
  }
} else {
  console.error('Ошибка получения расчетов:', data.error);
}
```

---

## Типы расчетов

| Тип | Описание |
|-----|----------|
| pythagorean | Только Квадрат Пифагора |
| destiny | Только Число Судьбы |
| matrix | Только Матрица Судьбы |
| all | Все расчеты (рекомендуется) |

## Структура результатов

### Квадрат Пифагора (pythagorean)

```typescript
{
  workingNumbers: {
    first: number,
    second: number,
    third: number,
    fourth: number
  },
  pythagoreanSquare: {
    cells: number[][]  // 3x3 массив
  }
}
```

### Число Судьбы (destiny)

```typescript
{
  destinyNumber: {
    value: number,
    isMasterNumber: boolean
  }
}
```

### Матрица Судьбы (matrix)

```typescript
{
  destinyMatrix: {
    positions: {
      dayNumber: number,
      monthNumber: number,
      yearNumber: number,
      lifePathNumber: number,
      personalityNumber: number,
      soulNumber: number,
      powerNumber: number,
      karmicNumber: number
    }
  }
}
```

### Все расчеты (all)

Комбинация всех вышеперечисленных структур.

## Пагинация

API поддерживает пагинацию через параметры `limit` и `offset`:

```typescript
// Первая страница (10 записей)
GET /api/calculations?limit=10&offset=0

// Вторая страница (10 записей)
GET /api/calculations?limit=10&offset=10

// Третья страница (10 записей)
GET /api/calculations?limit=10&offset=20
```

### Расчет количества страниц

```typescript
const totalPages = Math.ceil(total / limit);
const currentPage = Math.floor(offset / limit) + 1;
```

## Интеграция с клиентом

### React Hook для расчетов

```typescript
import { useState, useEffect } from 'react';

interface Calculation {
  id: string;
  birthDate: string;
  calculationType: string;
  results: any;
  createdAt: string;
}

export function useCalculations() {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const saveCalculation = async (
    birthDate: { day: number; month: number; year: number },
    calculationType: string,
    results: any
  ) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/api/calculations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionId}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        birthDate,
        calculationType,
        results,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return data.calculation;
  };

  const loadCalculations = async (limit = 10, offset = 0) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/calculations?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${sessionId}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setCalculations(data.calculations);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Load calculations error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    calculations,
    total,
    loading,
    saveCalculation,
    loadCalculations,
  };
}
```

### Использование в компоненте

```typescript
function CalculationHistory() {
  const { calculations, total, loading, loadCalculations } = useCalculations();
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    loadCalculations(limit, page * limit);
  }, [page]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h2>История расчетов ({total})</h2>
      
      {calculations.map((calc) => (
        <div key={calc.id}>
          <p>Дата рождения: {new Date(calc.birthDate).toLocaleDateString()}</p>
          <p>Тип: {calc.calculationType}</p>
          <p>Создано: {new Date(calc.createdAt).toLocaleString()}</p>
        </div>
      ))}

      {/* Пагинация */}
      <div>
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Назад
        </button>
        
        <span>Страница {page + 1} из {Math.ceil(total / limit)}</span>
        
        <button
          disabled={(page + 1) * limit >= total}
          onClick={() => setPage(page + 1)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
}
```

### Автоматическое сохранение после расчета

```typescript
function Calculator() {
  const { saveCalculation } = useCalculations();

  const handleCalculate = async (birthDate, name) => {
    // Выполняем расчеты
    const results = performCalculations(birthDate, name);

    // Сохраняем в базу данных (если пользователь авторизован)
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      try {
        await saveCalculation(birthDate, 'all', results);
        console.log('Расчет сохранен');
      } catch (error) {
        console.error('Ошибка сохранения:', error);
      }
    }

    // Отображаем результаты
    setResults(results);
  };

  return (
    // ... UI компонента
  );
}
```

## Безопасность

### Аутентификация

- Все эндпоинты требуют валидную сессию
- SessionId передается через заголовок Authorization
- Сессия проверяется через AuthService

### Авторизация

- Пользователи могут видеть только свои расчеты
- Фильтрация по userId происходит на уровне базы данных
- Невозможно получить расчеты других пользователей

### Валидация

- Все входные данные валидируются
- Проверка типов и обязательных полей
- Защита от SQL injection через Prisma ORM

## Тестирование

### Тестирование с curl

```bash
# Сохранение расчета
curl -X POST http://localhost:3000/api/calculations \
  -H "Authorization: Bearer SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "birthDate": {"day": 15, "month": 6, "year": 1990},
    "calculationType": "all",
    "results": {
      "workingNumbers": {"first": 31, "second": 4, "third": 29, "fourth": 11}
    }
  }'

# Получение истории
curl http://localhost:3000/api/calculations?limit=10&offset=0 \
  -H "Authorization: Bearer SESSION_ID"
```

## Ограничения

### Размер результатов

- Результаты хранятся в JSON поле
- Рекомендуемый максимальный размер: 1MB
- Для больших данных рассмотрите отдельное хранилище

### Пагинация

- Максимальный limit: 100 записей
- Для больших выборок используйте cursor-based пагинацию

### Production

Для production рекомендуется:
- Добавить rate limiting
- Кеширование часто запрашиваемых данных
- Индексы на userId и createdAt
- Архивация старых расчетов

## Связанные документы

- [API аутентификации](./auth-api-endpoints.md)
- [Схема базы данных](./database-schema.md)
- [Кеширование расчетов](./calculation-cache.md)
