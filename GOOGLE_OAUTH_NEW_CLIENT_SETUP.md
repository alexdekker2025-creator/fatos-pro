# Создание нового Google OAuth Client (решение проблемы с отсутствующим code)

## Проблема
Google не отправляет параметр `code` в callback URL, что приводит к ошибке "missing_parameters".

## Решение: Создать новый OAuth Client с нуля

### Шаг 1: Удалить старый OAuth Client (опционально)
1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Выберите проект `fatos-pro-oauth`
3. Перейдите в **APIs & Services** → **Credentials**
4. Найдите старый OAuth Client ID и удалите его (или просто создайте новый)

### Шаг 2: Создать новый OAuth Client
1. В разделе **Credentials** нажмите **+ CREATE CREDENTIALS**
2. Выберите **OAuth client ID**
3. Application type: **Web application**
4. Name: `fatos-pro-oauth-v2` (или любое другое имя)

### Шаг 3: Настроить Authorized JavaScript origins
Добавьте ТОЛЬКО:
```
https://fatos-pro.vercel.app
```

**ВАЖНО:** НЕ добавляйте:
- `http://localhost:3000` (только для production)
- Никакие другие домены

### Шаг 4: Настроить Authorized redirect URIs
Добавьте ТОЛЬКО:
```
https://fatos-pro.vercel.app/api/auth/oauth/google/callback
```

**ВАЖНО:** 
- Убедитесь, что URL точно совпадает (без лишних слэшей)
- НЕ добавляйте localhost redirect URIs

### Шаг 5: Сохранить и получить credentials
1. Нажмите **CREATE**
2. Скопируйте **Client ID** и **Client Secret**
3. Сохраните их в безопасном месте

### Шаг 6: Обновить переменные окружения на Vercel
1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите проект `fatos-pro`
3. Перейдите в **Settings** → **Environment Variables**
4. Обновите следующие переменные:

```
GOOGLE_OAUTH_CLIENT_ID=<новый Client ID>
GOOGLE_OAUTH_CLIENT_SECRET=<новый Client Secret>
```

5. Нажмите **Save**
6. Перейдите в **Deployments** и сделайте **Redeploy** последнего деплоя

### Шаг 7: Проверить OAuth Consent Screen
1. Перейдите в **APIs & Services** → **OAuth consent screen**
2. Убедитесь, что:
   - Publishing status: **In production** (или **Testing**)
   - User type: **External**
   - Scopes включают: `email`, `profile`, `openid`

### Шаг 8: Тестирование
1. Дождитесь завершения redeploy на Vercel (1-2 минуты)
2. Откройте https://fatos-pro.vercel.app
3. Нажмите "Войти через Google"
4. Проверьте, что Google теперь отправляет параметр `code` в callback URL

## Дополнительные проверки

### Проверка redirect URI в Google Console
Убедитесь, что redirect URI в Google Console ТОЧНО совпадает с тем, что использует приложение:
```
https://fatos-pro.vercel.app/api/auth/oauth/google/callback
```

### Проверка переменных окружения
Убедитесь, что на Vercel установлены:
```
OAUTH_REDIRECT_BASE_URL=https://fatos-pro.vercel.app
GOOGLE_OAUTH_CLIENT_ID=<ваш новый Client ID>
GOOGLE_OAUTH_CLIENT_SECRET=<ваш новый Client Secret>
```

### Проверка логов Vercel
После попытки входа проверьте логи в Vercel:
1. Откройте проект на Vercel
2. Перейдите в **Deployments** → выберите последний деплой
3. Нажмите **View Function Logs**
4. Найдите логи с префиксом `[OAuth Authorize]` и `[OAuth Callback]`

## Возможные причины проблемы

1. **Несовпадение redirect URI** - Google очень строго проверяет redirect URI
2. **Кэширование старых настроек** - Google может кэшировать старые настройки OAuth Client
3. **Проблемы с cookies** - Cookie `oauth_state` может не сохраняться
4. **Проблемы с CORS** - Хотя это маловероятно для OAuth flow

## Альтернативное решение: Использовать PKCE

Если проблема сохраняется, можно попробовать использовать PKCE (Proof Key for Code Exchange):

1. Генерировать `code_verifier` и `code_challenge` в authorize endpoint
2. Отправлять `code_challenge` в Google
3. Использовать `code_verifier` при обмене code на tokens

Это более безопасный метод и может решить проблему с отсутствующим `code`.

## Контакты для поддержки
Если проблема сохраняется после всех шагов, проверьте:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google OAuth Troubleshooting](https://developers.google.com/identity/protocols/oauth2/web-server#troubleshooting)
