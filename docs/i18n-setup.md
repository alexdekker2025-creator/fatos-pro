# Настройка многоязычности (i18n) в FATOS.pro

## Обзор

Платформа FATOS.pro поддерживает два языка:
- Русский (ru) - язык по умолчанию
- Английский (en)

Для реализации многоязычности используется библиотека `next-intl`.

## Структура файлов

```
├── i18n.ts                          # Конфигурация next-intl
├── middleware.ts                    # Middleware для определения языка
├── messages/
│   ├── ru.json                      # Русские переводы
│   └── en.json                      # Английские переводы
├── components/
│   └── LanguageSwitcher.tsx         # Компонент переключателя языка
└── lib/
    └── i18n-utils.ts                # Утилиты для работы с языком
```

## Конфигурация

### i18n.ts

Основной файл конфигурации, который:
- Определяет поддерживаемые языки (`ru`, `en`)
- Устанавливает язык по умолчанию (`ru`)
- Загружает файлы переводов динамически

### middleware.ts

Middleware автоматически:
- Определяет язык из настроек браузера пользователя
- Сохраняет выбор языка в cookie (срок действия: 1 год)
- Добавляет префикс языка к URL (например, `/ru/`, `/en/`)
- Перенаправляет пользователя на правильный URL с языком

### Файлы переводов

Файлы `messages/ru.json` и `messages/en.json` содержат все переводы, организованные по категориям:

- `common` - общие элементы интерфейса
- `calculator` - калькулятор и расчеты
- `validation` - сообщения валидации
- `auth` - аутентификация
- `admin` - административная панель
- `payment` - платежи

## Использование в компонентах

### Серверные компоненты

```typescript
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('calculator');
  
  return <h1>{t('title')}</h1>;
}
```

### Клиентские компоненты

```typescript
'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function MyClientComponent() {
  const t = useTranslations('common');
  const locale = useLocale();
  
  return (
    <div>
      <p>{t('language')}: {locale}</p>
    </div>
  );
}
```

## Компонент переключателя языка

Компонент `LanguageSwitcher` позволяет пользователям переключаться между языками:

```typescript
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

## Добавление новых переводов

1. Откройте `messages/ru.json` и `messages/en.json`
2. Добавьте новый ключ в соответствующую категорию
3. Убедитесь, что ключ добавлен в оба файла

Пример:

```json
// messages/ru.json
{
  "calculator": {
    "newFeature": "Новая функция"
  }
}

// messages/en.json
{
  "calculator": {
    "newFeature": "New Feature"
  }
}
```

## Требования

Реализация соответствует следующим требованиям из спецификации:

- **Требование 2.1**: Поддержка русского и английского языков через next-intl ✅
- **Требование 2.2**: Отображение всего интерфейса на выбранном языке ✅
- **Требование 2.3**: Сохранение выбора языка между сессиями (cookie на 1 год) ✅
- **Требование 2.4**: Автоматическое определение языка из настроек браузера ✅

## Тестирование

Тесты для проверки переводов находятся в `__tests__/i18n/translations.test.ts`.

Запуск тестов:

```bash
npm test -- __tests__/i18n
```

## Примечания

- Язык по умолчанию: русский (ru)
- Cookie для хранения языка: `NEXT_LOCALE`
- Срок действия cookie: 1 год
- URL всегда содержит префикс языка (например, `/ru/calculator`, `/en/calculator`)
- Middleware автоматически перенаправляет с `/` на `/ru/` или `/en/` в зависимости от настроек браузера
