# Настройка Google OAuth - Пошаговая инструкция

## Проблема: redirect_uri_mismatch

Эта ошибка означает, что redirect URI в вашем приложении не совпадает с тем, что указано в Google Console.

## Решение

### 1. Google Cloud Console

Откройте: https://console.cloud.google.com/apis/credentials

Найдите ваш OAuth 2.0 Client ID и настройте:

**Authorized JavaScript origins** (БЕЗ слэша в конце):
```
https://fatos-pro.vercel.app
```

**Authorized redirect URIs** (ТОЧНО так):
```
https://fatos-pro.vercel.app/api/auth/oauth/google/callback
```

⚠️ **ВАЖНО**: 
- НЕ добавляйте слэш в конце в "JavaScript origins"
- Redirect URI должен быть ТОЧНО таким, включая `/callback` в конце
- После сохранения подождите 5-10 минут - изменения применяются не сразу

### 2. Vercel Environment Variables

Проверьте на https://vercel.com/your-project/settings/environment-variables

Должны быть установлены:
```
GOOGLE_OAUTH_CLIENT_ID=ваш-client-id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=ваш-client-secret
OAUTH_REDIRECT_BASE_URL=https://fatos-pro.vercel.app
```

⚠️ **ВАЖНО**: `OAUTH_REDIRECT_BASE_URL` БЕЗ слэша в конце!

### 3. Проверка

После настройки:

1. Сделайте redeploy на Vercel (или подождите автодеплой)
2. Откройте https://fatos-pro.vercel.app
3. Нажмите "Войти через Google"
4. Проверьте Vercel Runtime Logs - там будет видно точный redirect URI:
   ```
   [OAuth] Provider: google
   [OAuth] Redirect Base URL: https://fatos-pro.vercel.app
   [OAuth] Full Redirect URI: https://fatos-pro.vercel.app/api/auth/oauth/google/callback
   ```

### 4. Если всё равно не работает

1. Проверьте, что в Google Console нет лишних пробелов в URI
2. Убедитесь, что используете правильный Client ID (не перепутали с другим проектом)
3. Попробуйте удалить и заново добавить redirect URI в Google Console
4. Очистите кэш браузера и попробуйте в режиме инкогнито

## Как это работает

Когда пользователь нажимает "Войти через Google":

1. Приложение перенаправляет на Google с параметром `redirect_uri`
2. Google проверяет, что этот URI есть в списке разрешённых
3. После авторизации Google перенаправляет обратно на этот URI с кодом
4. Приложение обменивает код на токены

Если URI не совпадает - Google отклоняет запрос с ошибкой `redirect_uri_mismatch`.
