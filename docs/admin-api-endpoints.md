# Admin API Endpoints

Документация по API эндпоинтам для административной панели FATOS.pro.

## Аутентификация

Все эндпоинты требуют:
1. Валидную сессию (cookie `session`)
2. Права администратора (проверяется через `AdminService.isAdmin()`)

## Эндпоинты

### GET /api/admin/articles

Получение списка статей с фильтрацией и пагинацией.

**Query параметры:**
- `category` (optional) - фильтр по категории
- `language` (optional) - фильтр по языку (ru/en)
- `relatedValue` (optional) - фильтр по связанному значению
- `limit` (optional, default: 50) - количество статей на странице
- `offset` (optional, default: 0) - смещение для пагинации

**Ответ (200 OK):**
```json
{
  "articles": [
    {
      "id": "clx...",
      "title": "Число судьбы 1",
      "content": "Описание...",
      "category": "destiny_number",
      "language": "ru",
      "relatedValue": "1",
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

**Ошибки:**
- `401 Unauthorized` - нет сессии или сессия невалидна
- `403 Forbidden` - пользователь не является администратором
- `500 Internal Server Error` - ошибка сервера

---

### POST /api/admin/articles

Создание новой статьи.

**Тело запроса:**
```json
{
  "title": "Число судьбы 1",
  "content": "Полное описание числа судьбы 1...",
  "category": "destiny_number",
  "language": "ru",
  "relatedValue": "1"
}
```

**Поля:**
- `title` (required, string, max 200) - заголовок статьи
- `content` (required, string) - содержание статьи
- `category` (required, string) - категория статьи
- `language` (required, enum: ru/en) - язык статьи
- `relatedValue` (optional, string) - связанное нумерологическое значение

**Ответ (201 Created):**
```json
{
  "id": "clx...",
  "title": "Число судьбы 1",
  "content": "Полное описание...",
  "category": "destiny_number",
  "language": "ru",
  "relatedValue": "1",
  "publishedAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Ошибки:**
- `400 Bad Request` - ошибка валидации данных
- `401 Unauthorized` - нет сессии или сессия невалидна
- `403 Forbidden` - пользователь не является администратором
- `500 Internal Server Error` - ошибка сервера

---

### PUT /api/admin/articles/[id]

Обновление существующей статьи.

**URL параметры:**
- `id` (required) - ID статьи

**Тело запроса (все поля optional):**
```json
{
  "title": "Обновленный заголовок",
  "content": "Обновленное содержание...",
  "category": "destiny_number",
  "language": "ru",
  "relatedValue": "1"
}
```

**Ответ (200 OK):**
```json
{
  "id": "clx...",
  "title": "Обновленный заголовок",
  "content": "Обновленное содержание...",
  "category": "destiny_number",
  "language": "ru",
  "relatedValue": "1",
  "publishedAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Ошибки:**
- `400 Bad Request` - ошибка валидации данных
- `401 Unauthorized` - нет сессии или сессия невалидна
- `403 Forbidden` - пользователь не является администратором
- `404 Not Found` - статья не найдена
- `500 Internal Server Error` - ошибка сервера

---

### DELETE /api/admin/articles/[id]

Удаление статьи.

**URL параметры:**
- `id` (required) - ID статьи

**Ответ (200 OK):**
```json
{
  "success": true
}
```

**Ошибки:**
- `401 Unauthorized` - нет сессии или сессия невалидна
- `403 Forbidden` - пользователь не является администратором
- `404 Not Found` - статья не найдена
- `500 Internal Server Error` - ошибка сервера

---

### GET /api/admin/statistics

Получение статистики платформы.

**Ответ (200 OK):**
```json
{
  "totalUsers": 1250,
  "totalCalculations": 5430,
  "totalOrders": 320,
  "completedOrders": 305,
  "totalRevenue": 152500.00,
  "totalArticles": 45,
  "recentUsers": 87,
  "recentCalculations": 432
}
```

**Поля:**
- `totalUsers` - общее количество пользователей
- `totalCalculations` - общее количество расчетов
- `totalOrders` - общее количество заказов
- `completedOrders` - количество завершенных заказов
- `totalRevenue` - общий доход (в рублях/долларах)
- `totalArticles` - количество статей
- `recentUsers` - новые пользователи за последние 30 дней
- `recentCalculations` - новые расчеты за последние 30 дней

**Ошибки:**
- `401 Unauthorized` - нет сессии или сессия невалидна
- `403 Forbidden` - пользователь не является администратором
- `500 Internal Server Error` - ошибка сервера

---

### GET /api/admin/logs

Получение логов действий администраторов.

**Query параметры:**
- `adminId` (optional) - фильтр по ID администратора
- `action` (optional) - фильтр по типу действия
- `limit` (optional, default: 50) - количество логов на странице
- `offset` (optional, default: 0) - смещение для пагинации

**Ответ (200 OK):**
```json
{
  "logs": [
    {
      "id": "clx...",
      "adminId": "clx...",
      "action": "CREATE_ARTICLE",
      "details": {
        "articleId": "clx...",
        "title": "Число судьбы 1",
        "category": "destiny_number"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "admin": {
        "id": "clx...",
        "email": "admin@fatos.pro",
        "name": "Admin User"
      }
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

**Типы действий:**
- `CREATE_ARTICLE` - создание статьи
- `UPDATE_ARTICLE` - обновление статьи
- `DELETE_ARTICLE` - удаление статьи

**Ошибки:**
- `401 Unauthorized` - нет сессии или сессия невалидна
- `403 Forbidden` - пользователь не является администратором
- `500 Internal Server Error` - ошибка сервера

---

## Примеры использования

### Получение списка статей на русском языке

```bash
curl -X GET "https://fatos.pro/api/admin/articles?language=ru&limit=10" \
  -H "Cookie: session=your_session_token"
```

### Создание новой статьи

```bash
curl -X POST "https://fatos.pro/api/admin/articles" \
  -H "Cookie: session=your_session_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Число судьбы 1",
    "content": "Люди с числом судьбы 1...",
    "category": "destiny_number",
    "language": "ru",
    "relatedValue": "1"
  }'
```

### Обновление статьи

```bash
curl -X PUT "https://fatos.pro/api/admin/articles/clx123" \
  -H "Cookie: session=your_session_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Обновленный заголовок"
  }'
```

### Удаление статьи

```bash
curl -X DELETE "https://fatos.pro/api/admin/articles/clx123" \
  -H "Cookie: session=your_session_token"
```

### Получение статистики

```bash
curl -X GET "https://fatos.pro/api/admin/statistics" \
  -H "Cookie: session=your_session_token"
```

### Получение логов

```bash
curl -X GET "https://fatos.pro/api/admin/logs?limit=20" \
  -H "Cookie: session=your_session_token"
```

---

## Безопасность

### Проверка прав администратора

Все эндпоинты проверяют права администратора через `AdminService.isAdmin()`:

```typescript
const isAdmin = await adminService.isAdmin(session.userId);
if (!isAdmin) {
  return NextResponse.json(
    { error: 'Forbidden: Admin access required' },
    { status: 403 }
  );
}
```

### Настройка администраторов

Администраторы настраиваются через переменную окружения `ADMIN_EMAILS`:

```env
ADMIN_EMAILS=admin@fatos.pro,admin2@fatos.pro
```

**TODO**: В production добавить поле `isAdmin` в модель User.

### Логирование

Все действия администраторов автоматически логируются в таблицу `AdminLog`:
- Создание статьи
- Обновление статьи
- Удаление статьи

Логи включают:
- ID администратора
- Тип действия
- Детали действия (ID статьи, изменения)
- Временная метка

---

## Категории статей

Рекомендуемые категории для статей:

- `destiny_number` - числа судьбы (1-9, 11, 22, 33)
- `destiny_matrix` - позиции матрицы судьбы
- `pythagorean_square` - ячейки квадрата Пифагора (1-9)
- `general` - общие статьи о нумерологии

---

## Связывание статей с расчетами

Поле `relatedValue` используется для связывания статей с нумерологическими значениями:

- Для чисел судьбы: `"1"`, `"2"`, ..., `"9"`, `"11"`, `"22"`, `"33"`
- Для ячеек квадрата Пифагора: `"1"`, `"2"`, ..., `"9"`
- Для позиций матрицы: зависит от реализации

При отображении результатов расчетов система будет искать статьи по `category` и `relatedValue`.
