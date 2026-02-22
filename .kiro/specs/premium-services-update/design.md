# Дизайн: Обновление премиум услуг

## Обзор

Этот дизайн описывает обновление системы премиум услуг на платформе FATOS.pro. Система должна поддерживать новую двухуровневую структуру тарифов (СТАРТ и ГЛУБОКИЙ) для каждой услуги, включая специальную обработку услуги "Профи-доступ" с тремя вариантами подписки.

### Цели

1. Обновить структуру данных в базе PostgreSQL для поддержки новых описаний и тарифов
2. Модифицировать React компонент для отображения двухуровневой структуры тарифов
3. Реализовать специальную логику для услуги "Профи-доступ" с тремя вариантами
4. Обеспечить полную локализацию на русский и английский языки
5. Сохранить обратную совместимость с fallback данными

### Технологический стек

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL с Prisma ORM
- **Локализация**: next-intl
- **Тестирование**: Jest, fast-check (property-based testing)

## Архитектура

### Компоненты системы

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PremiumServices.tsx (React Component)                 │ │
│  │  - Отображение карточек услуг                          │ │
│  │  - Управление состоянием (loading, modals)             │ │
│  │  - Обработка выбора тарифов                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  /api/services (GET)                                   │ │
│  │  - Получение активных услуг                            │ │
│  │  - Сортировка по sortOrder                             │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  /api/admin/services (GET, POST, PUT, DELETE)          │ │
│  │  - Управление услугами (только для админов)            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Prisma Client                                         │ │
│  │  - ORM для работы с PostgreSQL                         │ │
│  │  - Type-safe queries                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL - PremiumService Table                     │ │
│  │  - Хранение данных услуг                               │ │
│  │  - Поддержка локализации (ru/en)                       │ │
│  │  - Структура тарифов (basic/full)                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Поток данных

1. **Загрузка услуг**:
   - Компонент PremiumServices монтируется
   - useEffect вызывает fetchServices()
   - GET запрос к /api/services
   - API запрашивает данные через Prisma
   - Данные маппятся в формат компонента
   - При ошибке используются fallback данные

2. **Отображение услуг**:
   - Компонент получает массив услуг
   - Для каждой услуги рендерится карточка
   - Отображаются два тарифа: СТАРТ и ГЛУБОКИЙ
   - Для "Профи-доступ" специальная логика с тремя вариантами

3. **Покупка услуги**:
   - Пользователь выбирает тариф
   - Открывается модальное окно оплаты
   - Для gift_certificate и consultation - дополнительные модальные окна
   - После успешной оплаты - обновление состояния

## Компоненты и интерфейсы

### Интерфейс PremiumService

```typescript
interface PremiumService {
  id: string;                    // Уникальный идентификатор услуги
  titleRu: string;               // Название на русском
  titleEn: string;               // Название на английском
  descriptionRu: string;         // Описание на русском
  descriptionEn: string;         // Описание на английском
  hookRu: string;                // Слоган на русском
  hookEn: string;                // Слоган на английском
  priceBasicRUB: number;         // Цена тарифа СТАРТ в рублях
  priceBasicUSD: number;         // Цена тарифа СТАРТ в долларах
  priceFullRUB?: number;         // Цена тарифа ГЛУБОКИЙ в рублях (опционально)
  priceFullUSD?: number;         // Цена тарифа ГЛУБОКИЙ в долларах (опционально)
  icon: string;                  // Emoji иконка
  color: string;                 // Tailwind gradient класс
  features: {
    basic: string[];             // Список возможностей тарифа СТАРТ
    full?: string[];             // Список возможностей тарифа ГЛУБОКИЙ
  };
  buttonTextRu: string;          // Текст кнопки на русском
  buttonTextEn: string;          // Текст кнопки на английском
}
```

### Компонент PremiumServices

**Состояние**:
- `services: PremiumService[]` - массив услуг
- `loading: boolean` - индикатор загрузки
- `selectedService: PremiumService | null` - выбранная услуга
- `selectedTier: 'basic' | 'full'` - выбранный тариф
- `isPaymentModalOpen: boolean` - состояние модального окна оплаты
- `isGiftModalOpen: boolean` - состояние модального окна подарка
- `isConsultationModalOpen: boolean` - состояние модального окна консультации

**Методы**:
- `fetchServices()` - загрузка услуг из API
- `handleBuyClick(service, tier)` - обработка клика на кнопку покупки
- `handleGiftDataSubmit(data)` - обработка данных подарочного сертификата
- `handleConsultationDataSubmit(data)` - обработка данных консультации
- `handlePaymentSuccess()` - обработка успешной оплаты
- `getPaymentService()` - подготовка данных для модального окна оплаты

### API Endpoint: /api/services

**Метод**: GET

**Ответ**:
```typescript
{
  services: Array<{
    serviceId: string;
    titleRu: string;
    titleEn: string;
    descriptionRu: string;
    descriptionEn: string;
    hookRu: string;
    hookEn: string;
    priceBasicRUB: number;
    priceBasicUSD: number;
    priceFullRUB: number | null;
    priceFullUSD: number | null;
    icon: string;
    color: string;
    featuresBasic: string[];
    featuresFull: string[] | null;
    buttonTextRu: string;
    buttonTextEn: string;
  }>
}
```

**Обработка ошибок**:
- При ошибке базы данных возвращается статус 500
- Компонент использует fallback данные при любой ошибке API

## Модели данных

### Таблица PremiumService (PostgreSQL)

```prisma
model PremiumService {
  id              String   @id @default(cuid())
  serviceId       String   @unique
  titleRu         String
  titleEn         String
  descriptionRu   String   @db.Text
  descriptionEn   String   @db.Text
  hookRu          String
  hookEn          String
  priceBasicRUB   Int
  priceBasicUSD   Int
  priceFullRUB    Int?
  priceFullUSD    Int?
  icon            String
  color           String
  featuresBasic   Json
  featuresFull    Json?
  buttonTextRu    String
  buttonTextEn    String
  isActive        Boolean  @default(true)
  sortOrder       Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([isActive])
  @@index([sortOrder])
}
```

### Структура данных для услуг

#### Стандартная услуга (например, "Матрица судьбы")

```json
{
  "serviceId": "destiny_matrix",
  "titleRu": "Матрица судьбы",
  "titleEn": "Destiny Matrix",
  "descriptionRu": "Всё, чтобы понять главное",
  "descriptionEn": "Everything to understand the main thing",
  "hookRu": "Для тех, кто хочет заглянуть в себя",
  "hookEn": "For those who want to look inside themselves",
  "priceBasicRUB": 3500,
  "priceBasicUSD": 39,
  "priceFullRUB": 5500,
  "priceFullUSD": 61,
  "icon": "🔮",
  "color": "from-purple-600 to-indigo-700",
  "featuresBasic": [
    "Базовый расчёт матрицы",
    "4 ключевых аркана",
    "Основные кармические задачи",
    "Направление развития"
  ],
  "featuresFull": [
    "Всё из тарифа «Старт»",
    "Полная расшифровка всех арканов (до 12 позиций)",
    "Детальный разбор теневых зон",
    "Предназначение по сферам: деньги, отношения, карьера",
    "Конкретные шаги под вашу дату"
  ],
  "buttonTextRu": "Рассчитать матрицу",
  "buttonTextEn": "Calculate Matrix",
  "isActive": true,
  "sortOrder": 1
}
```

#### Специальная услуга "Профи-доступ"

```json
{
  "serviceId": "pro_access",
  "titleRu": "Профи-доступ",
  "titleEn": "Pro Access",
  "descriptionRu": "Для профессиональных нумерологов",
  "descriptionEn": "For professional numerologists",
  "hookRu": "Сухие профессиональные данные, минимум воды, только расчёты",
  "hookEn": "Dry professional data, minimum water, only calculations",
  "priceBasicRUB": 500,
  "priceBasicUSD": 6,
  "priceFullRUB": 2500,
  "priceFullUSD": 28,
  "icon": "🧠",
  "color": "from-slate-600 to-gray-700",
  "featuresBasic": [
    "Разовый отчёт",
    "Для одного клиента",
    "Готовая основа для консультации",
    "Экономия времени"
  ],
  "featuresFull": [
    "До 30 отчётов/месяц",
    "Единый стиль для всех клиентов",
    "Можно использовать как основу",
    "Экономия времени",
    "Профессиональный формат"
  ],
  "buttonTextRu": "Начать работать",
  "buttonTextEn": "Start Working",
  "isActive": true,
  "sortOrder": 7
}
```

**Примечание**: Для "Профи-доступ" в будущем может потребоваться расширение для поддержки третьего варианта (годовая подписка за 20000₽). Текущая структура поддерживает только два тарифа.

### Маппинг данных

API возвращает данные в формате базы данных, компонент маппит их в свой формат:

```typescript
const mappedServices: PremiumService[] = data.services.map((s: any) => ({
  id: s.serviceId,
  titleRu: s.titleRu,
  titleEn: s.titleEn,
  descriptionRu: s.descriptionRu,
  descriptionEn: s.descriptionEn,
  hookRu: s.hookRu,
  hookEn: s.hookEn,
  priceBasicRUB: s.priceBasicRUB,
  priceBasicUSD: s.priceBasicUSD,
  priceFullRUB: s.priceFullRUB,
  priceFullUSD: s.priceFullUSD,
  icon: s.icon,
  color: s.color,
  features: {
    basic: s.featuresBasic,
    full: s.featuresFull,
  },
  buttonTextRu: s.buttonTextRu,
  buttonTextEn: s.buttonTextEn,
}));
```

## Correctness Properties

*Свойство (property) — это характеристика или поведение, которое должно оставаться истинным для всех допустимых выполнений системы. По сути, это формальное утверждение о том, что должна делать система. Свойства служат мостом между человекочитаемыми спецификациями и машинно-проверяемыми гарантиями корректности.*


### Property Reflection

После анализа всех acceptance criteria, выявлены следующие группы свойств:

**Группа 1: Структура данных услуг**
- 1.2, 1.4, 1.5 - все проверяют наличие обязательных полей в структуре услуги
- Можно объединить в одно свойство: "Полнота структуры данных услуги"

**Группа 2: Локализация**
- 2.4, 6.1, 6.2, 6.3, 6.5 - все проверяют корректность локализации
- Можно объединить в два свойства: "Наличие переводов" и "Переключение языка"

**Группа 3: Отображение цен**
- 6.4, 7.8 - оба проверяют отображение цен в двух валютах
- Это одно и то же свойство, можно оставить одно

**Группа 4: Fallback логика**
- 5.1, 5.2, 5.5 - все проверяют fallback при ошибках
- Можно объединить в одно свойство: "Fallback при ошибках API"

**Группа 5: Отображение тарифов**
- 2.2, 2.3, 8.1 - все проверяют отображение содержимого тарифа
- Можно объединить в одно свойство: "Полнота отображения тарифа"

**Избыточные свойства**:
- 3.3, 3.4 - не реализуемы в текущей структуре (третий тариф для pro_access)
- 8.5 - поле для целевой аудитории отсутствует в структуре данных

После reflection остаются следующие уникальные свойства для тестирования.

### Property 1: Полнота структуры данных услуги

*For any* услуга, возвращаемая из API, должна содержать все обязательные поля: serviceId, titleRu, titleEn, descriptionRu, descriptionEn, hookRu, hookEn, priceBasicRUB, priceBasicUSD, icon, color, featuresBasic, buttonTextRu, buttonTextEn.

**Validates: Requirements 1.2, 1.4, 1.5**

### Property 2: Двухуровневая структура тарифов

*For any* услуга с заполненным priceFullRUB, компонент должен отображать два блока тарифов: базовый и полный.

**Validates: Requirements 2.1**

### Property 3: Полнота отображения тарифа

*For any* тариф услуги, отрендеренный HTML должен содержать название тарифа, цену в рублях, цену в долларах, и список возможностей (features).

**Validates: Requirements 2.2, 2.3, 8.1**

### Property 4: Визуальное выделение премиум тарифа

*For any* услуга с полным тарифом, отрендеренный HTML полного тарифа должен содержать специальные CSS классы или badge для визуального выделения (например, border-[#FFD700] или текст "ПОЛНЫЙ"/"FULL").

**Validates: Requirements 2.5**

### Property 5: Корректность локализации при переключении языка

*For any* услуга и любой locale ('ru' или 'en'), при рендеринге компонента должны отображаться тексты на соответствующем языке: при locale='ru' используются поля *Ru, при locale='en' используются поля *En.

**Validates: Requirements 2.4, 6.2, 6.3, 6.5**

### Property 6: Отображение цен в двух валютах

*For any* тариф услуги, независимо от выбранного языка, должны отображаться цены в обеих валютах: рубли (₽) и доллары ($).

**Validates: Requirements 6.4, 7.8**

### Property 7: Сортировка услуг по sortOrder

*For any* набор услуг, возвращаемых из API, они должны быть отсортированы по полю sortOrder в порядке возрастания.

**Validates: Requirements 4.4**

### Property 8: Fallback при ошибках API

*For any* ошибка API (сетевая ошибка, статус 500, пустой массив), компонент должен отображать hardcoded fallback данные из defaultServices вместо пустого экрана или ошибки.

**Validates: Requirements 5.1, 5.2, 5.5**

### Property 9: Индикатор загрузки

*For any* состояние компонента, пока loading === true, должен отображаться индикатор загрузки (spinner), а не список услуг.

**Validates: Requirements 5.4**

### Property 10: Наличие переводов для всех услуг

*For any* услуга в базе данных, все текстовые поля должны иметь переводы на оба языка: titleRu и titleEn, descriptionRu и descriptionEn, hookRu и hookEn, buttonTextRu и buttonTextEn должны быть непустыми строками.

**Validates: Requirements 6.1**

### Property 11: Описание полного тарифа включает базовый

*For any* услуга с полным тарифом (featuresFull не null), первый элемент массива featuresFull должен содержать указание на включение базового тарифа (например, "Всё из тарифа «Старт»" или "Всё из базового").

**Validates: Requirements 8.2**

### Property 12: Отображение слогана услуги

*For any* услуга, компонент должен отображать слоган (hook) в соответствии с выбранным языком: hookRu для locale='ru', hookEn для locale='en'.

**Validates: Requirements 8.4**

### Примеры (Example-based tests)

Следующие требования проверяются через конкретные примеры, а не через property-based тесты:

**Example 1: Количество услуг в базе**
- После миграции база данных должна содержать ровно 7 активных услуг
- **Validates: Requirements 1.1, 4.3**

**Example 2: Специфичные цены услуг**
- "Матрица судьбы": СТАРТ 3500₽, ГЛУБОКИЙ 5500₽
- "Детская нумерология": СТАРТ 2900₽, ГЛУБОКИЙ 4900₽
- "Совместимость": СТАРТ 3900₽, ГЛУБОКИЙ 5900₽
- "Денежная нумерология": СТАРТ 3900₽, ГЛУБОКИЙ 5900₽
- "Годовой прогноз": СТАРТ 4900₽, ГЛУБОКИЙ 6900₽
- "Квадрат Пифагора": СТАРТ 2900₽, ГЛУБОКИЙ 4900₽
- "Профи-доступ": разовый 500₽, месяц 2500₽
- **Validates: Requirements 7.1-7.7**

**Example 3: Структура Pro_Access**
- Услуга pro_access должна иметь priceBasicRUB=500, priceFullRUB=2500
- **Validates: Requirements 1.3, 3.1**

**Example 4: Описание месячной подписки Pro_Access**
- Для услуги pro_access, featuresFull должен содержать текст "До 30 отчётов"
- **Validates: Requirements 3.2**

**Example 5: Наличие миграционных скриптов**
- Должен существовать SQL скрипт для удаления старых данных
- Должен существовать SQL скрипт для вставки новых данных
- **Validates: Requirements 4.1, 4.2**

**Example 6: Успешный ответ API после миграции**
- GET /api/services должен возвращать статус 200 и массив из 7 услуг
- **Validates: Requirements 4.5**

**Example 7: Структура fallback данных**
- defaultServices должен содержать все необходимые поля в соответствии с новой структурой
- **Validates: Requirements 5.3**

## Обработка ошибок

### Уровни обработки ошибок

1. **API Layer** (`/api/services`):
   - Ошибки базы данных → статус 500, JSON с полем error
   - Логирование ошибок в консоль
   - Не выбрасывает исключения наружу

2. **Component Layer** (`PremiumServices.tsx`):
   - Ошибки сети → catch блок в fetchServices()
   - Пустой ответ API → проверка `mappedServices.length === 0`
   - Любая ошибка → использование defaultServices
   - Установка loading = false в finally блоке

3. **Fallback Strategy**:
   - Hardcoded массив defaultServices всегда доступен
   - Содержит актуальные данные всех услуг
   - Обеспечивает работоспособность UI даже при полном отказе backend

### Типы ошибок и их обработка

| Тип ошибки | Обработка | Результат для пользователя |
|------------|-----------|----------------------------|
| База данных недоступна | API возвращает 500 | Отображаются fallback данные |
| Сетевая ошибка | catch в fetchServices() | Отображаются fallback данные |
| Пустой ответ API | Проверка длины массива | Отображаются fallback данные |
| Невалидные данные | Маппинг может упасть | Отображаются fallback данные |
| Ошибка рендеринга | React Error Boundary (если есть) | Graceful degradation |

### Логирование

```typescript
// В API
console.error('Error fetching services:', error);

// В компоненте
console.error('Error fetching services:', error);
```

Все ошибки логируются в консоль для отладки, но не показываются пользователю.

## Стратегия тестирования

### Двойной подход к тестированию

Система тестирования использует комбинацию unit-тестов и property-based тестов:

**Unit-тесты** (Jest + React Testing Library):
- Конкретные примеры (7 услуг, специфичные цены)
- Интеграционные точки (API endpoints)
- Edge cases (пустые данные, специальные символы)
- Специфичные сценарии (pro_access с двумя тарифами)

**Property-based тесты** (fast-check):
- Универсальные свойства для всех услуг
- Генерация случайных данных услуг
- Проверка инвариантов (структура данных, локализация)
- Минимум 100 итераций на тест

### Конфигурация property-based тестов

Библиотека: **fast-check** (уже установлена в проекте)

Каждый property-based тест должен:
1. Запускаться минимум 100 раз с разными данными
2. Иметь комментарий с ссылкой на property из дизайна
3. Использовать генераторы для создания валидных данных услуг

Пример структуры теста:

```typescript
import fc from 'fast-check';

// Feature: premium-services-update, Property 1: Полнота структуры данных услуги
test('any service from API contains all required fields', () => {
  fc.assert(
    fc.property(
      serviceGenerator(), // генератор случайных услуг
      (service) => {
        expect(service).toHaveProperty('serviceId');
        expect(service).toHaveProperty('titleRu');
        expect(service).toHaveProperty('titleEn');
        // ... остальные поля
      }
    ),
    { numRuns: 100 }
  );
});
```

### Генераторы данных

Для property-based тестов необходимо создать генераторы:

```typescript
// Генератор услуги
const serviceGenerator = () => fc.record({
  serviceId: fc.string({ minLength: 3, maxLength: 30 }),
  titleRu: fc.string({ minLength: 5, maxLength: 50 }),
  titleEn: fc.string({ minLength: 5, maxLength: 50 }),
  descriptionRu: fc.string({ minLength: 10, maxLength: 200 }),
  descriptionEn: fc.string({ minLength: 10, maxLength: 200 }),
  hookRu: fc.string({ minLength: 10, maxLength: 100 }),
  hookEn: fc.string({ minLength: 10, maxLength: 100 }),
  priceBasicRUB: fc.integer({ min: 500, max: 10000 }),
  priceBasicUSD: fc.integer({ min: 5, max: 150 }),
  priceFullRUB: fc.option(fc.integer({ min: 1000, max: 20000 })),
  priceFullUSD: fc.option(fc.integer({ min: 10, max: 250 })),
  icon: fc.constantFrom('🔮', '👶', '💞', '💰', '📅', '🧮', '🧠'),
  color: fc.constantFrom(
    'from-purple-600 to-indigo-700',
    'from-pink-500 to-rose-600',
    'from-red-500 to-pink-600'
  ),
  featuresBasic: fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 3, maxLength: 6 }),
  featuresFull: fc.option(fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 4, maxLength: 8 })),
  buttonTextRu: fc.string({ minLength: 5, maxLength: 30 }),
  buttonTextEn: fc.string({ minLength: 5, maxLength: 30 }),
});
```

### Покрытие тестами

**API Layer**:
- Unit-тесты для GET /api/services
- Тесты обработки ошибок базы данных
- Тесты сортировки по sortOrder

**Component Layer**:
- Property-based тесты для всех 12 свойств
- Unit-тесты для 7 примеров
- Тесты модальных окон (payment, gift, consultation)
- Тесты обработки кликов и состояния

**Database Layer**:
- Тесты миграционных скриптов
- Проверка структуры данных после миграции
- Проверка индексов и constraints

**Integration Tests**:
- End-to-end тест: загрузка страницы → отображение услуг → клик на кнопку
- Тест переключения языка
- Тест fallback при недоступности API

### Баланс между unit и property тестами

- **Property-based тесты** покрывают общие правила и инварианты (60% покрытия)
- **Unit-тесты** покрывают конкретные примеры и edge cases (40% покрытия)
- Избегаем дублирования: если свойство проверено property-тестом, не пишем unit-тест на то же самое
- Фокус unit-тестов: специфичные цены, конкретные услуги, интеграционные точки

### Приоритеты тестирования

1. **Критичные свойства** (высокий приоритет):
   - Property 1: Полнота структуры данных
   - Property 8: Fallback при ошибках
   - Property 5: Корректность локализации

2. **Важные свойства** (средний приоритет):
   - Property 2: Двухуровневая структура тарифов
   - Property 6: Отображение цен в двух валютах
   - Property 7: Сортировка услуг

3. **Дополнительные свойства** (низкий приоритет):
   - Property 4: Визуальное выделение премиум тарифа
   - Property 9: Индикатор загрузки
   - Property 12: Отображение слогана

## Детали реализации

### Миграция данных

Для обновления данных услуг необходимо создать SQL скрипт:

**Файл**: `prisma/migrations/update-premium-services.sql`

```sql
-- Удаление старых данных
DELETE FROM "PremiumService";

-- Вставка новых данных
INSERT INTO "PremiumService" (
  id, serviceId, titleRu, titleEn, descriptionRu, descriptionEn,
  hookRu, hookEn, priceBasicRUB, priceBasicUSD, priceFullRUB, priceFullUSD,
  icon, color, featuresBasic, featuresFull, buttonTextRu, buttonTextEn,
  isActive, sortOrder, createdAt, updatedAt
) VALUES
  -- Матрица судьбы
  (
    gen_random_uuid(),
    'destiny_matrix',
    'Матрица судьбы',
    'Destiny Matrix',
    'Всё, чтобы понять главное',
    'Everything to understand the main thing',
    'Для тех, кто хочет заглянуть в себя',
    'For those who want to look inside themselves',
    3500, 39, 5500, 61,
    '🔮',
    'from-purple-600 to-indigo-700',
    '["Базовый расчёт матрицы", "4 ключевых аркана", "Основные кармические задачи", "Направление развития"]'::jsonb,
    '["Всё из тарифа «Старт»", "Полная расшифровка всех арканов (до 12 позиций)", "Детальный разбор теневых зон", "Предназначение по сферам: деньги, отношения, карьера", "Конкретные шаги под вашу дату"]'::jsonb,
    'Рассчитать матрицу',
    'Calculate Matrix',
    true, 1,
    NOW(), NOW()
  ),
  -- ... остальные услуги
;
```

### Обновление fallback данных

Необходимо обновить массив `defaultServices` в компоненте `PremiumServices.tsx` в соответствии с новой структурой данных. Это обеспечит работоспособность UI даже при недоступности API.

### Специальная обработка Pro_Access

Текущая структура данных поддерживает только два тарифа (basic и full). Для полной реализации требования 3 (три варианта для Pro_Access) необходимо:

**Вариант 1: Расширение структуры данных**
- Добавить поля priceYearlyRUB, priceYearlyUSD
- Добавить поле featuresYearly
- Модифицировать компонент для отображения третьего тарифа

**Вариант 2: Использование текущей структуры**
- Использовать basic для разового отчёта (500₽)
- Использовать full для месячной подписки (2500₽)
- Создать отдельную услугу pro_access_yearly для годовой подписки (20000₽)

**Рекомендация**: Вариант 2 проще в реализации и не требует изменения схемы базы данных.

### Локализация

Компонент использует хук `useLocale()` из next-intl для определения текущего языка. Все тексты должны выбираться на основе значения locale:

```typescript
const locale = useLocale(); // 'ru' или 'en'

// Использование
{locale === 'ru' ? service.titleRu : service.titleEn}
```

Названия тарифов также локализуются:
- 'ru': "Базовый" / "Полный"
- 'en': "Basic" / "Full"

### Производительность

**Оптимизации**:
1. Кэширование данных услуг на клиенте (useState)
2. Использование индексов в базе данных (isActive, sortOrder)
3. Минимизация ререндеров через правильное управление состоянием
4. Lazy loading модальных окон

**Метрики**:
- Время загрузки данных из API: < 200ms
- Время рендеринга компонента: < 100ms
- Размер fallback данных: ~15KB

### Безопасность

1. **API endpoint** `/api/services` - публичный, не требует аутентификации
2. **Валидация данных**: Prisma обеспечивает type-safety
3. **XSS защита**: React автоматически экранирует все строки
4. **SQL injection**: Prisma использует параметризованные запросы

### Мониторинг и логирование

Все ошибки логируются в консоль:
```typescript
console.error('Error fetching services:', error);
```

В production рекомендуется добавить:
- Отправку ошибок в систему мониторинга (Sentry, LogRocket)
- Метрики использования fallback данных
- Отслеживание времени загрузки API

## Будущие улучшения

1. **Поддержка третьего тарифа для Pro_Access**
   - Расширение схемы базы данных
   - Модификация компонента для отображения трёх тарифов

2. **Кэширование на уровне API**
   - Использование Redis для кэширования данных услуг
   - Уменьшение нагрузки на базу данных

3. **A/B тестирование**
   - Возможность показывать разные варианты описаний
   - Отслеживание конверсии по тарифам

4. **Динамическое ценообразование**
   - Поддержка скидок и промокодов
   - Персонализированные цены

5. **Расширенная аналитика**
   - Отслеживание кликов по тарифам
   - Анализ популярности услуг
   - Воронка конверсии

6. **Улучшение UX**
   - Сравнение тарифов side-by-side
   - Калькулятор экономии для годовой подписки
   - Рекомендации на основе истории пользователя

## Заключение

Этот дизайн описывает обновление системы премиум услуг с поддержкой двухуровневой структуры тарифов, полной локализации и надёжной fallback стратегии. Система спроектирована с учётом требований к тестируемости, производительности и расширяемости.

Ключевые решения:
- Использование существующей схемы Prisma без изменений
- Fallback данные для обеспечения работоспособности UI
- Property-based тестирование для проверки универсальных свойств
- Модульная архитектура для лёгкого расширения

Ограничения текущей реализации:
- Поддержка только двух тарифов (требование о трёх тарифах для Pro_Access не реализовано полностью)
- Отсутствие поля для целевой аудитории (требование 8.5)
