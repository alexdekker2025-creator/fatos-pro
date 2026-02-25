# Bugfix Requirements Document

## Introduction

OAuth callback endpoint в production на Vercel не может прочитать параметры `code` и `state` из URL, которые возвращаются от Google и Facebook после авторизации пользователя. Это приводит к тому, что OAuth flow не может быть завершен, и пользователи не могут войти через социальные сети. Проблема проявляется только в production на Vercel Edge Runtime, в то время как параметры видны в DevTools и присутствуют в URL.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN Google/Facebook возвращает пользователя на `/api/auth/oauth/[provider]/callback?state=...&code=...` в production на Vercel THEN `request.nextUrl.searchParams` и `new URL(request.url).searchParams` возвращают пустой объект `{}`

1.2 WHEN параметры `code` и `state` не читаются из URL THEN endpoint возвращает ошибку "missing_parameters" и перенаправляет на страницу ошибки

1.3 WHEN логи Vercel выполняются THEN они показывают `[OAuth Callback] Search params: {}` несмотря на то, что DevTools показывает полный URL с параметрами

### Expected Behavior (Correct)

2.1 WHEN Google/Facebook возвращает пользователя на `/api/auth/oauth/[provider]/callback?state=...&code=...` в production на Vercel THEN endpoint SHALL успешно извлекать параметры `code` и `state` из URL

2.2 WHEN параметры `code` и `state` успешно извлечены THEN endpoint SHALL передавать их в `authService.handleOAuthCallback()` для завершения OAuth flow

2.3 WHEN OAuth flow успешно завершен THEN пользователь SHALL быть перенаправлен на страницу `oauth-success` с валидным `sessionId`

### Unchanged Behavior (Regression Prevention)

3.1 WHEN OAuth callback вызывается с невалидным provider THEN система SHALL CONTINUE TO возвращать ошибку "invalid_provider"

3.2 WHEN OAuth callback вызывается с параметром `error` от провайдера THEN система SHALL CONTINUE TO обрабатывать ошибку и перенаправлять на страницу ошибки

3.3 WHEN OAuth callback успешно завершается THEN система SHALL CONTINUE TO удалять cookie `oauth_state` и создавать сессию пользователя

3.4 WHEN определяется locale из referer THEN система SHALL CONTINUE TO использовать его для формирования redirect URL

3.5 WHEN `authService.handleOAuthCallback()` выбрасывает ошибку THEN система SHALL CONTINUE TO обрабатывать специфичные типы ошибок (state, code) и перенаправлять на соответствующую страницу ошибки
