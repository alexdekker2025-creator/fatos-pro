# API Эндпоинты для аутентификации

## Обзор

API для регистрации, входа, выхода и проверки сессий пользователей.

## Базовый URL

```
http://localhost:3000/api/auth
```

## Эндпоинты

### 1. POST /api/auth/register

Регистрация нового пользователя.

#### Request

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "Иван Иванов"
}
```

#### Request Body

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| email | string | Да | Email пользователя (валидный email) |
| password | string | Да | Пароль (минимум 8 символов) |
| name | string | Да | Имя пользователя |

#### Response (201 Created)

```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "Иван Иванов"
  },
  "session": {
    "id": "session-abc123",
    "expiresAt": "2026-03-23T12:00:00.000Z"
  }
}
```

#### Error Responses

**400 Bad Request** - Ошибка валидации

```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

**409 Conflict** - Пользователь уже существует

```json
{
  "success": false,
  "error": "User with this email already exists"
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
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123',
    name: 'Иван Иванов',
  }),
});

const data = await response.json();

if (data.success) {
  // Сохраняем sessionId в localStorage или cookie
  localStorage.setItem('sessionId', data.session.id);
  console.log('Регистрация успешна:', data.user);
} else {
  console.error('Ошибка регистрации:', data.error);
}
```

---

### 2. POST /api/auth/login

Вход пользователя в систему.

#### Request

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Request Body

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| email | string | Да | Email пользователя |
| password | string | Да | Пароль пользователя |

#### Response (200 OK)

```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "Иван Иванов"
  },
  "session": {
    "id": "session-abc123",
    "expiresAt": "2026-03-23T12:00:00.000Z"
  }
}
```

#### Error Responses

**400 Bad Request** - Ошибка валидации

```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

**401 Unauthorized** - Неверные учетные данные

```json
{
  "success": false,
  "error": "Invalid email or password"
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
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123',
  }),
});

const data = await response.json();

if (data.success) {
  // Сохраняем sessionId
  localStorage.setItem('sessionId', data.session.id);
  console.log('Вход выполнен:', data.user);
} else {
  console.error('Ошибка входа:', data.error);
}
```

---

### 3. POST /api/auth/logout

Выход пользователя из системы.

#### Request

```http
POST /api/auth/logout
Content-Type: application/json

{
  "sessionId": "session-abc123"
}
```

#### Request Body

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| sessionId | string | Да | ID сессии пользователя |

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Error Responses

**400 Bad Request** - Отсутствует sessionId

```json
{
  "success": false,
  "error": "Session ID is required"
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

const response = await fetch('/api/auth/logout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sessionId,
  }),
});

const data = await response.json();

if (data.success) {
  // Удаляем sessionId
  localStorage.removeItem('sessionId');
  console.log('Выход выполнен');
} else {
  console.error('Ошибка выхода:', data.error);
}
```

---

### 4. GET /api/auth/session

Проверка валидности сессии.

#### Request

```http
GET /api/auth/session?sessionId=session-abc123
```

#### Query Parameters

| Параметр | Тип | Обязательно | Описание |
|----------|-----|-------------|----------|
| sessionId | string | Да | ID сессии для проверки |

#### Response (200 OK)

```json
{
  "valid": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "Иван Иванов"
  }
}
```

#### Error Responses

**400 Bad Request** - Отсутствует sessionId

```json
{
  "valid": false,
  "error": "Session ID is required"
}
```

**401 Unauthorized** - Невалидная или истекшая сессия

```json
{
  "valid": false,
  "error": "Invalid or expired session"
}
```

**500 Internal Server Error** - Внутренняя ошибка сервера

```json
{
  "valid": false,
  "error": "Internal server error"
}
```

#### Пример использования

```typescript
const sessionId = localStorage.getItem('sessionId');

const response = await fetch(`/api/auth/session?sessionId=${sessionId}`);
const data = await response.json();

if (data.valid) {
  console.log('Сессия валидна:', data.user);
} else {
  console.log('Сессия невалидна, требуется повторный вход');
  localStorage.removeItem('sessionId');
}
```

---

## Коды состояния HTTP

| Код | Описание |
|-----|----------|
| 200 | OK - Запрос выполнен успешно |
| 201 | Created - Ресурс создан (регистрация) |
| 400 | Bad Request - Ошибка валидации данных |
| 401 | Unauthorized - Неверные учетные данные или невалидная сессия |
| 409 | Conflict - Конфликт (пользователь уже существует) |
| 500 | Internal Server Error - Внутренняя ошибка сервера |

## Безопасность

### Хеширование паролей

Пароли хешируются с использованием bcrypt с 10 раундами соли перед сохранением в базу данных.

### Сессии

- Сессии хранятся в памяти (для development)
- TTL сессии: 30 дней
- Для production рекомендуется использовать Redis

### Валидация

Все входные данные валидируются с помощью Zod схем:
- Email: валидный email формат
- Password: минимум 8 символов
- Name: обязательное поле

## Интеграция с клиентом

### React Hook для аутентификации

```typescript
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/auth/session?sessionId=${sessionId}`);
      const data = await response.json();

      if (data.valid) {
        setUser(data.user);
      } else {
        localStorage.removeItem('sessionId');
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('sessionId', data.session.id);
      setUser(data.user);
      return { success: true };
    }

    return { success: false, error: data.error };
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('sessionId', data.session.id);
      setUser(data.user);
      return { success: true };
    }

    return { success: false, error: data.error };
  };

  const logout = async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });

    localStorage.removeItem('sessionId');
    setUser(null);
  };

  return { user, loading, register, login, logout };
}
```

### Использование в компоненте

```typescript
function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

## Тестирование

### Тестирование с curl

```bash
# Регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Вход
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Проверка сессии
curl "http://localhost:3000/api/auth/session?sessionId=SESSION_ID"

# Выход
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type": "application/json" \
  -d '{"sessionId":"SESSION_ID"}'
```

## Ограничения

### Development

- Сессии хранятся в памяти
- Данные теряются при перезапуске сервера
- Не подходит для распределенных систем

### Production

Для production рекомендуется:
- Миграция сессий на Redis
- Использование HTTP-only cookies вместо localStorage
- Добавление CSRF защиты
- Настройка rate limiting
- Логирование попыток входа

## Дополнительные ресурсы

- [Документация AuthService](./authentication.md)
- [Схема базы данных](./database-schema.md)
- [Валидация данных](../lib/validation/README.md)
