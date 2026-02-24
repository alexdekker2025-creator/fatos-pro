# Настройка OAuth (Google и Facebook)

## Обзор

OAuth вход уже реализован в коде. Нужно только:
1. Создать приложения в Google и Facebook
2. Добавить переменные окружения на Vercel
3. Протестировать

---

## 1. Настройка Google OAuth

### Шаг 1: Создание проекта в Google Cloud Console

1. Перейдите на https://console.cloud.google.com/
2. Создайте новый проект или выберите существующий
3. Название проекта: `FATOS.pro`

### Шаг 2: Включение Google+ API

1. В меню слева выберите "APIs & Services" → "Library"
2. Найдите "Google+ API"
3. Нажмите "Enable"

### Шаг 3: Создание OAuth 2.0 Client ID

1. Перейдите в "APIs & Services" → "Credentials"
2. Нажмите "Create Credentials" → "OAuth client ID"
3. Если требуется, настройте OAuth consent screen:
   - User Type: External
   - App name: FATOS.pro
   - User support email: alex.dekker2025@gmail.com
   - Developer contact: alex.dekker2025@gmail.com
   - Scopes: email, profile, openid
   - Test users: добавьте свой email

4. Создайте OAuth client ID:
   - Application type: Web application
   - Name: FATOS.pro Web Client
   - Authorized JavaScript origins:
     - `https://fatos-pro.vercel.app`
     - `http://localhost:3002` (для локальной разработки)
   - Authorized redirect URIs:
     - `https://fatos-pro.vercel.app/api/auth/oauth/google/callback`
     - `http://localhost:3002/api/auth/oauth/google/callback`

5. Сохраните:
   - **Client ID** (начинается с цифр, заканчивается на `.apps.googleusercontent.com`)
   - **Client Secret**

---

## 2. Настройка Facebook OAuth

### Шаг 1: Создание приложения Facebook

1. Перейдите на https://developers.facebook.com/
2. Нажмите "My Apps" → "Create App"
3. Выберите тип: "Consumer" (для входа пользователей)
4. Название приложения: `FATOS.pro`
5. Email: alex.dekker2025@gmail.com

### Шаг 2: Настройка Facebook Login

1. В Dashboard приложения найдите "Facebook Login"
2. Нажмите "Set Up"
3. Выберите "Web"
4. Site URL: `https://fatos-pro.vercel.app`

### Шаг 3: Настройка OAuth Redirect URIs

1. В левом меню выберите "Facebook Login" → "Settings"
2. В поле "Valid OAuth Redirect URIs" добавьте:
   - `https://fatos-pro.vercel.app/api/auth/oauth/facebook/callback`
   - `http://localhost:3002/api/auth/oauth/facebook/callback`
3. Сохраните изменения

### Шаг 4: Получение учетных данных

1. В левом меню выберите "Settings" → "Basic"
2. Сохраните:
   - **App ID** (это будет FACEBOOK_OAUTH_CLIENT_ID)
   - **App Secret** (нажмите "Show", это будет FACEBOOK_OAUTH_CLIENT_SECRET)

### Шаг 5: Перевод приложения в Production

1. В верхнем меню переключите режим с "Development" на "Live"
2. Может потребоваться заполнить дополнительную информацию:
   - Privacy Policy URL: `https://fatos-pro.vercel.app/ru/privacy`
   - Terms of Service URL: `https://fatos-pro.vercel.app/ru/privacy`
   - App Icon: загрузите логотип (минимум 1024x1024px)

---

## 3. Добавление переменных окружения на Vercel

1. Перейдите на https://vercel.com/dashboard
2. Откройте проект `fatos-pro`
3. Перейдите в Settings → Environment Variables
4. Добавьте следующие переменные:

### Google OAuth:
```
GOOGLE_OAUTH_CLIENT_ID=ваш-client-id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=ваш-client-secret
```

### Facebook OAuth:
```
FACEBOOK_OAUTH_CLIENT_ID=ваш-app-id
FACEBOOK_OAUTH_CLIENT_SECRET=ваш-app-secret
```

### OAuth Redirect Base URL (уже должен быть установлен):
```
OAUTH_REDIRECT_BASE_URL=https://fatos-pro.vercel.app
```

5. Для каждой переменной выберите окружения: Production, Preview, Development
6. Нажмите "Save"

---

## 4. Redeploy приложения

После добавления переменных окружения:

1. Перейдите в Deployments
2. Найдите последний деплоймент
3. Нажмите три точки (⋯) → "Redeploy"
4. Выберите "Use existing Build Cache"
5. Нажмите "Redeploy"

---

## 5. Тестирование

1. Откройте https://fatos-pro.vercel.app
2. Нажмите "Войти"
3. В модальном окне должны появиться кнопки:
   - "Войти через Google"
   - "Войти через Facebook"
4. Попробуйте войти через каждый провайдер

---

## Текущий статус переменных окружения

Проверьте, что у вас установлены следующие переменные на Vercel:

✅ Уже установлены:
- `NEXT_PUBLIC_BASE_URL` = `https://fatos-pro.vercel.app`
- `DATABASE_URL` (Neon PostgreSQL)
- `SESSION_SECRET`
- `ENCRYPTION_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`

❓ Нужно добавить:
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `FACEBOOK_OAUTH_CLIENT_ID`
- `FACEBOOK_OAUTH_CLIENT_SECRET`
- `OAUTH_REDIRECT_BASE_URL` (если еще не установлен)

---

## Локальная разработка

Для локальной разработки добавьте переменные в `.env.local`:

```env
# OAuth - Google
GOOGLE_OAUTH_CLIENT_ID="ваш-client-id.apps.googleusercontent.com"
GOOGLE_OAUTH_CLIENT_SECRET="ваш-client-secret"

# OAuth - Facebook
FACEBOOK_OAUTH_CLIENT_ID="ваш-app-id"
FACEBOOK_OAUTH_CLIENT_SECRET="ваш-app-secret"

# OAuth Redirect URL
OAUTH_REDIRECT_BASE_URL="http://localhost:3002"
```

---

## Troubleshooting

### Google OAuth не работает:
- Проверьте, что Google+ API включен
- Убедитесь, что redirect URI точно совпадает
- Проверьте, что OAuth consent screen настроен

### Facebook OAuth не работает:
- Убедитесь, что приложение в режиме "Live"
- Проверьте Valid OAuth Redirect URIs
- Убедитесь, что добавлены Privacy Policy и Terms of Service URLs

### Общие проблемы:
- Проверьте логи в Vercel (Runtime Logs)
- Убедитесь, что все переменные окружения установлены
- Проверьте, что сделан redeploy после добавления переменных

---

## Дополнительная информация

### Реализованные функции:
- ✅ Вход через Google
- ✅ Вход через Facebook
- ✅ Привязка аккаунтов (можно привязать Google/Facebook к существующему аккаунту)
- ✅ Отвязка аккаунтов
- ✅ Автоматическое создание пользователя при первом входе
- ✅ Email verification не требуется для OAuth пользователей
- ✅ Безопасное хранение токенов (зашифрованы)

### API Endpoints:
- `GET /api/auth/oauth/google/authorize` - начало OAuth flow для Google
- `GET /api/auth/oauth/google/callback` - callback для Google
- `GET /api/auth/oauth/facebook/authorize` - начало OAuth flow для Facebook
- `GET /api/auth/oauth/facebook/callback` - callback для Facebook
- `POST /api/auth/oauth/link` - привязка OAuth провайдера к аккаунту
- `POST /api/auth/oauth/unlink` - отвязка OAuth провайдера

### Компоненты:
- `components/auth/OAuthButtons.tsx` - кнопки входа через OAuth
- `components/AuthModal.tsx` - модальное окно с OAuth кнопками
- `components/auth/SecuritySettings.tsx` - управление привязанными аккаунтами

---

## Следующие шаги

1. Создайте приложения в Google и Facebook консолях
2. Добавьте переменные окружения на Vercel
3. Сделайте redeploy
4. Протестируйте вход через Google и Facebook
5. Если нужна помощь - дайте знать!
