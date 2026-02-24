# 🚀 Руководство по деплою Advanced Authentication

## Обзор

Этот документ содержит инструкции по деплою системы расширенной аутентификации на Vercel.

## ✅ Что реализовано

### Основные функции
- ✅ Password Reset (восстановление пароля)
- ✅ Email Verification (подтверждение email)
- ✅ Two-Factor Authentication (2FA с TOTP)
- ✅ OAuth Integration (Google, Facebook)
- ✅ Security Logging (логирование событий безопасности)
- ✅ Rate Limiting (ограничение запросов)
- ✅ Token Cleanup (автоматическая очистка токенов)
- ✅ Audit Log Cleanup (очистка старых логов)
- ✅ Admin Statistics (статистика для админов)

### API Endpoints (18 endpoints)

**Password Reset:**
- POST `/api/auth/password-reset/request`
- GET `/api/auth/password-reset/verify`
- POST `/api/auth/password-reset/confirm`

**Email Verification:**
- POST `/api/auth/email/verify`
- POST `/api/auth/email/resend`

**2FA:**
- POST `/api/auth/2fa/setup`
- POST `/api/auth/2fa/confirm`
- POST `/api/auth/2fa/verify`
- POST `/api/auth/2fa/disable`
- POST `/api/auth/2fa/backup-codes/regenerate`

**OAuth:**
- GET `/api/auth/oauth/[provider]/authorize`
- GET `/api/auth/oauth/[provider]/callback`
- POST `/api/auth/oauth/link`
- POST `/api/auth/oauth/unlink`

**Admin:**
- GET `/api/admin/auth/stats`
- GET `/api/admin/users`

**User Profile:**
- GET `/api/user/profile`
- PUT `/api/user/profile`

**Cron Jobs:**
- GET `/api/cron/cleanup-tokens`
- GET `/api/cron/cleanup-logs`

---

## 📋 Предварительные требования

### 1. Neon PostgreSQL
- ✅ База данных создана
- ✅ Миграции применены
- ✅ Connection string доступен

### 2. Resend Account
1. Зарегистрируйтесь на [resend.com](https://resend.com)
2. Создайте API key
3. Добавьте и верифицируйте домен для отправки email

### 3. Google OAuth (опционально)
1. Перейдите в [Google Cloud Console](https://console.cloud.google.com)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Создайте OAuth 2.0 credentials
5. Добавьте authorized redirect URIs:
   - `http://localhost:3000/api/auth/oauth/google/callback` (dev)
   - `https://yourdomain.com/api/auth/oauth/google/callback` (prod)

### 4. Facebook OAuth (опционально)
1. Перейдите в [Facebook Developers](https://developers.facebook.com)
2. Создайте новое приложение
3. Добавьте Facebook Login product
4. Настройте Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/oauth/facebook/callback` (dev)
   - `https://yourdomain.com/api/auth/oauth/facebook/callback` (prod)

---

## 🔧 Настройка Environment Variables

### Vercel Dashboard

1. Откройте ваш проект на Vercel
2. Перейдите в Settings → Environment Variables
3. Добавьте следующие переменные:

#### Обязательные переменные

```env
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Encryption (генерируйте случайную строку минимум 32 символа)
ENCRYPTION_SECRET=your-random-32-plus-character-string-here

# Email Service
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=FATOS.pro <noreply@yourdomain.com>

# Base URLs
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
OAUTH_REDIRECT_BASE_URL=https://yourdomain.com

# Session Security
SESSION_SECRET=your-session-secret-here

# Cron Jobs Security
CRON_SECRET=your-cron-secret-here
```

#### Опциональные переменные (OAuth)

```env
# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret

# Facebook OAuth
FACEBOOK_OAUTH_CLIENT_ID=your-facebook-app-id
FACEBOOK_OAUTH_CLIENT_SECRET=your-facebook-app-secret
```

### Генерация секретов

Используйте следующие команды для генерации случайных секретов:

```bash
# В Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# В PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# В Linux/Mac
openssl rand -base64 32
```

---

## 🚀 Деплой на Vercel

### Шаг 1: Подготовка кода

```bash
# Убедитесь что все изменения закоммичены
git add .
git commit -m "Add advanced authentication system"
git push origin main
```

### Шаг 2: Деплой через Vercel CLI

```bash
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Деплой
vercel --prod
```

### Шаг 3: Настройка Cron Jobs

Vercel автоматически настроит cron jobs из `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-tokens",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/cleanup-logs",
      "schedule": "0 3 * * *"
    }
  ]
}
```

**Расписание:**
- Token cleanup: каждый день в 2:00 AM UTC
- Log cleanup: каждый день в 3:00 AM UTC

### Шаг 4: Проверка деплоя

После деплоя проверьте:

1. **Health check:**
   ```bash
   curl https://yourdomain.com/api/auth/session
   ```

2. **Password reset:**
   ```bash
   curl -X POST https://yourdomain.com/api/auth/password-reset/request \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

3. **Admin stats (требует admin сессию):**
   ```bash
   curl https://yourdomain.com/api/admin/auth/stats \
     -H "Cookie: sessionId=YOUR_SESSION_ID"
   ```

---

## 🔒 Безопасность

### Checklist перед production

- [ ] Все секреты сгенерированы случайным образом
- [ ] `ENCRYPTION_SECRET` минимум 32 символа
- [ ] `CRON_SECRET` установлен для защиты cron endpoints
- [ ] OAuth redirect URLs настроены для production домена
- [ ] Resend домен верифицирован
- [ ] Database connection использует SSL (`sslmode=require`)
- [ ] Rate limiting включен
- [ ] CORS настроен правильно

### Рекомендации

1. **Регулярно ротируйте секреты** (каждые 90 дней)
2. **Мониторьте Security Logs** через admin dashboard
3. **Настройте алерты** для подозрительной активности
4. **Backup базы данных** регулярно
5. **Тестируйте OAuth flows** после каждого деплоя

---

## 📊 Мониторинг

### Vercel Logs

Просмотр логов в реальном времени:

```bash
vercel logs --follow
```

### Database Queries

Проверка security logs:

```sql
-- Последние 100 событий
SELECT * FROM "SecurityLog" 
ORDER BY "createdAt" DESC 
LIMIT 100;

-- События за последние 24 часа
SELECT event, COUNT(*) as count
FROM "SecurityLog"
WHERE "createdAt" > NOW() - INTERVAL '24 hours'
GROUP BY event
ORDER BY count DESC;

-- Неудачные попытки входа
SELECT * FROM "SecurityLog"
WHERE event = 'login_failed'
AND "createdAt" > NOW() - INTERVAL '7 days'
ORDER BY "createdAt" DESC;
```

### Admin Dashboard

Используйте admin endpoints для мониторинга:

```bash
# Статистика аутентификации
curl https://yourdomain.com/api/admin/auth/stats \
  -H "Cookie: sessionId=YOUR_ADMIN_SESSION"

# Список пользователей
curl https://yourdomain.com/api/admin/users?page=1&limit=50 \
  -H "Cookie: sessionId=YOUR_ADMIN_SESSION"
```

---

## 🧪 Тестирование на Production

### 1. Password Reset Flow

```bash
# Запрос сброса
curl -X POST https://yourdomain.com/api/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'

# Проверьте email
# Используйте токен из письма для подтверждения
curl -X POST https://yourdomain.com/api/auth/password-reset/confirm \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN_FROM_EMAIL","newPassword":"newpass123"}'
```

### 2. Email Verification

```bash
# После регистрации проверьте email
# Используйте токен из письма
curl -X POST https://yourdomain.com/api/auth/email/verify \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN_FROM_EMAIL"}'
```

### 3. 2FA Setup

```bash
# Настройка (требует аутентификацию)
curl -X POST https://yourdomain.com/api/auth/2fa/setup \
  -H "Cookie: sessionId=YOUR_SESSION"

# Сканируйте QR код в Google Authenticator
# Подтвердите с TOTP кодом
curl -X POST https://yourdomain.com/api/auth/2fa/confirm \
  -H "Cookie: sessionId=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"code":"123456","secret":"SECRET","backupCodes":[...]}'
```

### 4. OAuth Login

Откройте в браузере:
```
https://yourdomain.com/api/auth/oauth/google/authorize
```

---

## 🐛 Troubleshooting

### Проблема: Email не отправляются

**Решение:**
1. Проверьте `RESEND_API_KEY` в Vercel
2. Убедитесь что домен верифицирован в Resend
3. Проверьте логи: `vercel logs --follow`
4. Проверьте `EMAIL_FROM` соответствует верифицированному домену

### Проблема: OAuth не работает

**Решение:**
1. Проверьте redirect URLs в Google/Facebook консоли
2. Убедитесь что `OAUTH_REDIRECT_BASE_URL` правильный
3. Проверьте client ID и secret в Vercel
4. Проверьте логи для ошибок OAuth

### Проблема: Cron jobs не выполняются

**Решение:**
1. Убедитесь что `vercel.json` задеплоен
2. Проверьте Vercel dashboard → Cron Jobs
3. Проверьте `CRON_SECRET` установлен
4. Тестируйте вручную:
   ```bash
   curl https://yourdomain.com/api/cron/cleanup-tokens \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

### Проблема: Rate limiting слишком строгий

**Решение:**
Измените лимиты в соответствующих route handlers:
- Password reset: `app/api/auth/password-reset/request/route.ts`
- Email resend: `app/api/auth/email/resend/route.ts`
- 2FA verify: `app/api/auth/2fa/verify/route.ts`

---

## 📚 Дополнительные ресурсы

- [API Documentation](API_ENDPOINTS_SUMMARY.md)
- [Testing Guide](КАК_ТЕСТИРОВАТЬ_API.md)
- [Requirements](.kiro/specs/advanced-authentication/requirements.md)
- [Design Document](.kiro/specs/advanced-authentication/design.md)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Resend Documentation](https://resend.com/docs)

---

## ✅ Post-Deployment Checklist

После успешного деплоя:

- [ ] Протестировать password reset flow
- [ ] Протестировать email verification
- [ ] Протестировать 2FA setup и login
- [ ] Протестировать OAuth login (Google, Facebook)
- [ ] Проверить admin statistics endpoint
- [ ] Проверить admin users list
- [ ] Проверить user profile endpoint
- [ ] Убедиться что cron jobs работают
- [ ] Проверить security logs в базе данных
- [ ] Настроить мониторинг и алерты
- [ ] Обновить документацию для пользователей

---

**Дата создания:** 22.02.2026  
**Версия:** 1.0  
**Статус:** Production Ready ✅
