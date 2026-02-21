# Быстрый старт: Многоязычность

## Использование переводов в компонентах

### Серверный компонент

```typescript
import { useTranslations } from 'next-intl';

export default function MyPage() {
  const t = useTranslations('calculator');
  
  return <h1>{t('title')}</h1>;
}
```

### Клиентский компонент

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  
  return <button>{t('save')}</button>;
}
```

## Добавление переключателя языка

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
2. Добавьте ключ в обоих файлах:

```json
// messages/ru.json
{
  "mySection": {
    "myKey": "Мой текст"
  }
}

// messages/en.json
{
  "mySection": {
    "myKey": "My text"
  }
}
```

3. Используйте в компоненте:

```typescript
const t = useTranslations('mySection');
return <p>{t('myKey')}</p>;
```

## Проверка

Запустите тесты:

```bash
npm test -- __tests__/i18n
```

Все тесты должны пройти успешно ✅
