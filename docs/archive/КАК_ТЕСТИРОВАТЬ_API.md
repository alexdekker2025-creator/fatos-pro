# Как протестировать API endpoints

## 🚀 Быстрый старт

### 1. Запустить dev сервер
```cmd
npm run dev
```

Сервер запустится на http://localhost:3002

### 2. Установить Zod (если еще не установлен)
```cmd
npm install zod
```

---

## 📋 Тестирование endpoints

### Password Reset

#### 1. Запрос сброса пароля
```bash
curl -X POST http://localhost:3002/api/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@fatos.pro\"}"
```

**Ожидаемый ответ**:
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

#### 2. Проверка токена
```bash
curl "http://localhost:3002/api/auth/password-reset/verify?token=YOUR_TOKEN"
```

#### 3. Подтверждение нового пароля
```bash
curl -X POST http://localhost:3002/api/auth/password-reset/confirm \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"YOUR_TOKEN\",\"newPassword\":\"newpass123\"}"
```

---

### Email Verification

#### 1. Подтверждение email
```bash
curl -X POST http://localhost:3002/api/auth/email/verify \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"YOUR_TOKEN\"}"
```

#### 2. Повторная отправка (требует аутентификацию)
```bash
curl -X POST http://localhost:3002/api/auth/email/resend \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_ID"
```

---

### Two-Factor Authentication

#### 1. Настройка 2FA (требует аутентификацию)
```bash
curl -X POST http://localhost:3002/api/auth/2fa/setup \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_ID"
```

**Ожидаемый ответ**:
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,...",
  "backupCodes": ["ABCD-1234", "EFGH-5678", ...]
}
```

#### 2. Подтверждение 2FA
```bash
curl -X POST http://localhost:3002/api/auth/2fa/confirm \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_ID" \
  -d "{\"code\":\"123456\",\"secret\":\"YOUR_SECRET\",\"backupCodes\":[...]}"
```

#### 3. Верификация при логине
```bash
curl -X POST http://localhost:3002/api/auth/2fa/verify \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"USER_ID\",\"code\":\"123456\"}"
```

#### 4. Отключение 2FA
```bash
curl -X POST http://localhost:3002/api/auth/2fa/disable \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_ID" \
  -d "{\"password\":\"yourpassword\"}"
```

#### 5. Регенерация backup кодов
```bash
curl -X POST http://localhost:3002/api/auth/2fa/backup-codes/regenerate \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_ID" \
  -d "{\"code\":\"123456\"}"
```

---

### OAuth

#### 1. Инициация OAuth (Google)
Откройте в браузере:
```
http://localhost:3002/api/auth/oauth/google/authorize
```

Вас перенаправит на Google для авторизации.

#### 2. Инициация OAuth (Facebook)
```
http://localhost:3002/api/auth/oauth/facebook/authorize
```

#### 3. Связывание OAuth провайдера (требует аутентификацию)
```bash
curl -X POST http://localhost:3002/api/auth/oauth/link \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_ID" \
  -d "{\"provider\":\"google\",\"code\":\"AUTH_CODE\"}"
```

#### 4. Отвязывание OAuth провайдера
```bash
curl -X POST http://localhost:3002/api/auth/oauth/unlink \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_ID" \
  -d "{\"provider\":\"google\",\"password\":\"yourpassword\"}"
```

---

## 🧪 Тестирование Rate Limiting

### Password Reset (3 запроса / 15 минут)
```bash
# Запрос 1
curl -X POST http://localhost:3002/api/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\"}"

# Запрос 2
curl -X POST http://localhost:3002/api/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\"}"

# Запрос 3
curl -X POST http://localhost:3002/api/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\"}"

# Запрос 4 (должен вернуть 429)
curl -X POST http://localhost:3002/api/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\"}"
```

**Ожидаемый ответ на 4-й запрос**:
```json
{
  "error": "Too many requests. Please try again later."
}
```
HTTP Status: 429  
Header: `Retry-After: 900`

---

## 🔍 Проверка валидации

### Невалидный email
```bash
curl -X POST http://localhost:3002/api/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"invalid-email\"}"
```

**Ожидаемый ответ**:
```json
{
  "error": "Invalid email address"
}
```
HTTP Status: 400

### Короткий пароль
```bash
curl -X POST http://localhost:3002/api/auth/password-reset/confirm \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"abc\",\"newPassword\":\"short\"}"
```

**Ожидаемый ответ**:
```json
{
  "error": "Password must be at least 8 characters long"
}
```
HTTP Status: 400

### Невалидный TOTP код
```bash
curl -X POST http://localhost:3002/api/auth/2fa/confirm \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_ID" \
  -d "{\"code\":\"12345\",\"secret\":\"...\",\"backupCodes\":[...]}"
```

**Ожидаемый ответ**:
```json
{
  "error": "Code must be exactly 6 digits"
}
```
HTTP Status: 400

---

## 🛠️ Инструменты для тестирования

### 1. Postman
- Импортируйте коллекцию endpoints
- Настройте environment variables
- Используйте автоматические тесты

### 2. Thunder Client (VS Code extension)
- Легковесная альтернатива Postman
- Интеграция с VS Code

### 3. curl (командная строка)
- Быстрое тестирование
- Скрипты автоматизации

### 4. Browser DevTools
- Тестирование OAuth flow
- Проверка cookies
- Network tab для debugging

---

## ⚠️ Важные замечания

### 1. Environment Variables
Убедитесь, что в `.env` настроены:
```env
ENCRYPTION_SECRET=your-32-byte-secret
RESEND_API_KEY=re_...
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
FACEBOOK_OAUTH_CLIENT_ID=...
FACEBOOK_OAUTH_CLIENT_SECRET=...
OAUTH_REDIRECT_BASE_URL=http://localhost:3002
```

### 2. Database
Убедитесь, что:
- Prisma Client сгенерирован: `npx prisma generate`
- Миграции применены в Neon
- База данных доступна

### 3. Email Service
Для тестирования email:
- Настройте Resend API key
- Проверьте логи в консоли
- Используйте тестовые email адреса

### 4. OAuth Providers
Для тестирования OAuth:
- Настройте OAuth приложения в Google/Facebook
- Добавьте redirect URLs
- Используйте тестовые аккаунты

---

## 📊 Проверка логов

### Security Logs
```sql
SELECT * FROM "SecurityLog" 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

### Sessions
```sql
SELECT * FROM "Session" 
WHERE "userId" = 'YOUR_USER_ID';
```

### OAuth Providers
```sql
SELECT * FROM "OAuthProvider" 
WHERE "userId" = 'YOUR_USER_ID';
```

---

## ✅ Чеклист тестирования

- [ ] Password reset request
- [ ] Password reset verify
- [ ] Password reset confirm
- [ ] Email verification
- [ ] Email resend
- [ ] 2FA setup
- [ ] 2FA confirm
- [ ] 2FA verify
- [ ] 2FA disable
- [ ] Backup codes regenerate
- [ ] OAuth Google authorize
- [ ] OAuth Google callback
- [ ] OAuth Facebook authorize
- [ ] OAuth Facebook callback
- [ ] OAuth link
- [ ] OAuth unlink
- [ ] Rate limiting (password reset)
- [ ] Rate limiting (email resend)
- [ ] Rate limiting (2FA verify)
- [ ] Validation errors
- [ ] CSRF protection (OAuth)
- [ ] Session management
- [ ] Security logging

---

**Дата**: 22.02.2026  
**Статус**: Готово к тестированию
