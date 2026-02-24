# Руководство по Frontend компонентам аутентификации

## Созданные компоненты

### 1. **PasswordResetModal** (`components/auth/PasswordResetModal.tsx`)
Модальное окно для запроса сброса пароля.

**Использование:**
```tsx
import PasswordResetModal from '@/components/auth/PasswordResetModal';

<PasswordResetModal
  isOpen={showPasswordReset}
  onClose={() => setShowPasswordReset(false)}
/>
```

**Функциональность:**
- Ввод email
- Отправка запроса на `/api/auth/password-reset/request`
- Показ сообщения об успехе

---

### 2. **TwoFactorSetup** (`components/auth/TwoFactorSetup.tsx`)
Компонент для настройки двухфакторной аутентификации.

**Использование:**
```tsx
import TwoFactorSetup from '@/components/auth/TwoFactorSetup';

<TwoFactorSetup
  onComplete={() => {
    // 2FA успешно настроена
  }}
  onCancel={() => {
    // Отмена настройки
  }}
/>
```

**Функциональность:**
- Генерация QR кода
- Показ секретного ключа для ручного ввода
- Генерация 10 резервных кодов
- Подтверждение с помощью TOTP кода

---

### 3. **TwoFactorVerify** (`components/auth/TwoFactorVerify.tsx`)
Компонент для верификации 2FA при входе.

**Использование:**
```tsx
import TwoFactorVerify from '@/components/auth/TwoFactorVerify';

<TwoFactorVerify
  userId={userId}
  onSuccess={() => {
    // Успешная верификация
  }}
  onCancel={() => {
    // Отмена верификации
  }}
/>
```

**Функциональность:**
- Ввод 6-значного TOTP кода
- Переключение на резервные коды
- Ввод резервного кода (формат XXXX-XXXX)

---

### 4. **OAuthButtons** (`components/auth/OAuthButtons.tsx`)
Кнопки для OAuth входа/привязки (Google и Facebook).

**Использование:**
```tsx
import OAuthButtons from '@/components/auth/OAuthButtons';

// Для входа
<OAuthButtons mode="login" disabled={loading} />

// Для привязки аккаунта
<OAuthButtons mode="link" disabled={loading} />
```

**Функциональность:**
- Редирект на `/api/auth/oauth/google/authorize`
- Редирект на `/api/auth/oauth/facebook/authorize`
- Стилизованные кнопки с логотипами

---

### 5. **SecuritySettings** (`components/auth/SecuritySettings.tsx`)
Полный компонент настроек безопасности для профиля пользователя.

**Использование:**
```tsx
import SecuritySettings from '@/components/auth/SecuritySettings';

<SecuritySettings
  user={{
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    twoFactorEnabled: user.twoFactorEnabled,
    linkedProviders: user.linkedProviders
  }}
/>
```

**Функциональность:**
- Верификация email (повторная отправка)
- Включение/отключение 2FA
- Привязка OAuth провайдеров
- Отвязка OAuth провайдеров

---

### 6. **Обновленный AuthModal** (`components/AuthModal.tsx`)
Расширенный модальный компонент для входа/регистрации.

**Новые возможности:**
- Кнопка "Forgot password?" для сброса пароля
- OAuth кнопки (Google/Facebook)
- Автоматический переход к 2FA верификации при необходимости

---

## Страницы

### 1. **Verify Email Page** (`app/[locale]/auth/verify-email/page.tsx`)
Страница для подтверждения email по ссылке из письма.

**URL:** `/auth/verify-email?token=xxx`

**Функциональность:**
- Автоматическая верификация токена
- Показ статуса (загрузка/успех/ошибка)
- Кнопка возврата на главную

---

### 2. **Reset Password Page** (`app/[locale]/auth/reset-password/page.tsx`)
Страница для сброса пароля по ссылке из письма.

**URL:** `/auth/reset-password?token=xxx`

**Функциональность:**
- Проверка валидности токена
- Форма ввода нового пароля
- Подтверждение пароля
- Валидация (минимум 8 символов)

---

## Интеграция

### Шаг 1: Добавьте переводы
Скопируйте переводы из `AUTH_TRANSLATIONS.md` в ваши файлы локализации:
- `messages/en.json`
- `messages/ru.json`

### Шаг 2: Обновите AuthModal
Замените существующий `components/AuthModal.tsx` на обновленную версию.

### Шаг 3: Добавьте SecuritySettings в профиль
```tsx
// В вашей странице профиля
import SecuritySettings from '@/components/auth/SecuritySettings';

export default function ProfilePage() {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>Profile</h1>
      <SecuritySettings user={user} />
    </div>
  );
}
```

### Шаг 4: Настройте маршруты
Убедитесь, что созданы страницы:
- `app/[locale]/auth/verify-email/page.tsx`
- `app/[locale]/auth/reset-password/page.tsx`

---

## Стилизация

Все компоненты используют единый мистический стиль:
- Градиенты purple/indigo
- Золотые акценты (amber)
- Анимации и эффекты свечения
- Адаптивный дизайн

Компоненты совместимы с существующими UI компонентами:
- `Button` из `@/components/ui`
- `MysticalInput` из `@/components/ui/MysticalInput`

---

## API Endpoints

Компоненты взаимодействуют со следующими endpoints:

**Password Reset:**
- `POST /api/auth/password-reset/request` - запрос сброса
- `GET /api/auth/password-reset/verify?token=xxx` - проверка токена
- `POST /api/auth/password-reset/confirm` - подтверждение нового пароля

**Email Verification:**
- `POST /api/auth/email/verify` - верификация email
- `POST /api/auth/email/resend` - повторная отправка

**Two-Factor Authentication:**
- `POST /api/auth/2fa/setup` - настройка 2FA
- `POST /api/auth/2fa/confirm` - подтверждение 2FA
- `POST /api/auth/2fa/verify` - верификация при входе
- `POST /api/auth/2fa/disable` - отключение 2FA

**OAuth:**
- `GET /api/auth/oauth/{provider}/authorize` - начало OAuth flow
- `GET /api/auth/oauth/{provider}/callback` - callback после OAuth
- `POST /api/auth/oauth/link` - привязка провайдера
- `POST /api/auth/oauth/unlink` - отвязка провайдера

---

## Тестирование

### Локальное тестирование:
1. Запустите dev сервер: `npm run dev`
2. Откройте `http://localhost:3000`
3. Протестируйте каждый компонент

### Production тестирование:
После деплоя на Vercel и настройки RESEND_API_KEY:
1. Протестируйте сброс пароля
2. Протестируйте верификацию email
3. Протестируйте настройку 2FA
4. Протестируйте OAuth (после настройки провайдеров)

---

## Troubleshooting

### Email не приходят
- Проверьте RESEND_API_KEY в Vercel
- Проверьте верификацию домена в Resend
- Проверьте логи в Vercel

### OAuth не работает
- Настройте redirect URLs в Google/Facebook консолях
- Добавьте CLIENT_ID и CLIENT_SECRET в Vercel
- Проверьте OAUTH_REDIRECT_BASE_URL

### 2FA QR код не отображается
- Проверьте что `qrcode` пакет установлен
- Проверьте что API endpoint `/api/auth/2fa/setup` работает

---

## Следующие шаги

1. ✅ Frontend компоненты созданы
2. ⏳ Добавить переводы в локализацию
3. ⏳ Интегрировать SecuritySettings в профиль
4. ⏳ Настроить OAuth провайдеры
5. ⏳ Протестировать на production после верификации домена

