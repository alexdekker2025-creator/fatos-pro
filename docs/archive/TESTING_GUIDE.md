# Руководство по тестированию Advanced Authentication

## Проблема с PowerShell

В вашей системе отключено выполнение скриптов PowerShell. Есть два решения:

### Решение 1: Разрешить выполнение скриптов (Рекомендуется)

Откройте PowerShell **от имени администратора** и выполните:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

После этого закройте и снова откройте терминал.

### Решение 2: Использовать CMD вместо PowerShell

Откройте **Command Prompt (CMD)** вместо PowerShell и выполните команды там.

## Шаги для тестирования

### 1. Регенерация Prisma Client

Выполните в терминале (CMD или PowerShell после изменения политики):

```bash
cd C:\Users\user\Desktop\fatos.pro
npx prisma generate
```

Ожидаемый результат:
```
✔ Generated Prisma Client (v5.22.0) to .\node_modules\@prisma\client in XXms
```

### 2. Запуск всех тестов

```bash
npm test
```

Это запустит все тесты Jest, включая новые тесты для authentication.

### 3. Запуск только тестов authentication

Если хотите запустить только тесты для новых сервисов:

```bash
npm test -- --testPathPattern=auth
```

### 4. Запуск конкретных тестовых файлов

**Тесты Email Verification:**
```bash
npm test -- AuthService.emailVerification.test.ts
```

**Тесты 2FA Login:**
```bash
npm test -- AuthService.2fa-login.test.ts
```

**Тесты 2FA Management:**
```bash
npm test -- AuthService.2fa-management.test.ts
```

**Тесты OAuth:**
```bash
npm test -- AuthService.oauth.test.ts
```

### 5. Проверка TypeScript ошибок

После регенерации Prisma client проверьте, что нет TypeScript ошибок:

```bash
npm run lint
```

## Что тестируется

### ✅ Email Verification (9 тестов)
- Отправка verification email
- Проверка токена
- Повторная отправка с rate limiting
- Обработка ошибок (expired token, invalid token, user not found)

### ✅ 2FA Login (7 тестов)
- Login flow с включенным 2FA
- Верификация TOTP кода
- Использование backup кодов
- Логирование security events
- Обработка ошибок

### ✅ 2FA Management (8 тестов)
- Отключение 2FA с подтверждением пароля
- Регенерация backup кодов
- Верификация кодов перед операциями
- Обработка ошибок

### ✅ OAuth (12 тестов)
- Инициация OAuth login (Google, Facebook)
- Обработка callback
- Создание новых пользователей
- Связывание с существующими аккаунтами
- Управление OAuth провайдерами
- CSRF защита через state parameter
- Security logging

## Ожидаемые результаты

После успешного запуска тестов вы должны увидеть:

```
PASS  lib/services/auth/__tests__/AuthService.emailVerification.test.ts
PASS  lib/services/auth/__tests__/AuthService.2fa-login.test.ts
PASS  lib/services/auth/__tests__/AuthService.2fa-management.test.ts
PASS  lib/services/auth/__tests__/AuthService.oauth.test.ts

Test Suites: 4 passed, 4 total
Tests:       36 passed, 36 total
Snapshots:   0 total
Time:        X.XXXs
```

## Проверка работы сервисов

Также можете запустить тестовый скрипт для проверки всех сервисов:

```bash
node test-auth-services.js
```

Этот скрипт проверит:
- ✅ Все таблицы в базе данных
- ✅ Все environment variables
- ✅ Работу всех сервисов (Encryption, Token, Email, TwoFactor, OAuth)

## Troubleshooting

### Ошибка: "Cannot find module '@prisma/client'"

**Решение:** Запустите `npx prisma generate`

### Ошибка: "Property 'oAuthProvider' does not exist"

**Решение:** Это TypeScript ошибка до регенерации Prisma client. После `npx prisma generate` она исчезнет.

### Ошибка: "EPERM: operation not permitted"

**Решение:** 
1. Закройте все терминалы и VS Code
2. Откройте заново
3. Попробуйте снова

### Тесты падают с ошибками подключения к БД

**Решение:** Тесты используют моки (mocks), поэтому реальное подключение к БД не требуется. Если видите такие ошибки, проверьте что моки правильно настроены в тестовых файлах.

## Следующие шаги

После успешного прохождения тестов:

1. ✅ Все сервисы работают корректно
2. ✅ AuthService расширен всеми необходимыми методами
3. ⏳ Следующий этап: создание API endpoints

Можно продолжить с реализацией API endpoints или сначала протестировать на реальной базе данных.
