# OAuth Callback Parameters Fix - Bugfix Design

## Overview

OAuth callback endpoint в production на Vercel Edge Runtime не может прочитать параметры `code` и `state` из URL после редиректа от Google/Facebook. Проблема проявляется только в production, в то время как в DevTools параметры видны в URL. Анализ показывает, что Edge Runtime может обрабатывать URL параметры по-другому после внешнего редиректа от OAuth провайдера. Стратегия исправления включает переход на Node.js Runtime и добавление альтернативных методов парсинга параметров для обеспечения надежности.

## Glossary

- **Bug_Condition (C)**: Условие, при котором проявляется баг - когда OAuth провайдер (Google/Facebook) редиректит пользователя на callback endpoint с параметрами `code` и `state` в URL, но `request.nextUrl.searchParams` и `new URL(request.url).searchParams` возвращают пустой объект в production на Vercel Edge Runtime
- **Property (P)**: Желаемое поведение - callback endpoint должен успешно извлекать параметры `code` и `state` из URL и передавать их в `authService.handleOAuthCallback()` для завершения OAuth flow
- **Preservation**: Существующее поведение обработки ошибок, валидации provider, определения locale и создания сессии должно остаться неизменным
- **Edge Runtime**: Легковесная среда выполнения Vercel, оптимизированная для скорости, но с ограниченным API
- **Node.js Runtime**: Полная среда выполнения Node.js с доступом ко всем стандартным API
- **OAuth Flow**: Процесс авторизации через внешний провайдер (Google/Facebook), включающий редирект на провайдера, авторизацию пользователя и возврат на callback endpoint с параметрами
- **searchParams**: API для чтения query параметров из URL в Next.js

## Bug Details

### Fault Condition

Баг проявляется когда OAuth провайдер (Google или Facebook) возвращает пользователя на callback endpoint после успешной авторизации. Провайдер добавляет параметры `code` и `state` в URL (например, `/api/auth/oauth/google/callback?state=xyz&code=abc`), но в production на Vercel Edge Runtime эти параметры не читаются через стандартные API Next.js.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type NextRequest
  OUTPUT: boolean
  
  RETURN input.url CONTAINS '?code=' AND input.url CONTAINS '&state='
         AND input.nextUrl.searchParams.get('code') === null
         AND input.nextUrl.searchParams.get('state') === null
         AND environment === 'production'
         AND runtime === 'edge'
END FUNCTION
```

### Examples

- **Пример 1**: Google редиректит на `https://fatos-pro.vercel.app/api/auth/oauth/google/callback?state=abc123&code=xyz789`
  - Ожидается: `searchParams.get('code')` возвращает `'xyz789'`, `searchParams.get('state')` возвращает `'abc123'`
  - Фактически: `searchParams.get('code')` возвращает `null`, `searchParams.get('state')` возвращает `null`
  - Результат: Endpoint возвращает ошибку "missing_parameters"

- **Пример 2**: Facebook редиректит на `https://fatos-pro.vercel.app/api/auth/oauth/facebook/callback?code=def456&state=ghi789`
  - Ожидается: Параметры успешно извлекаются и передаются в `authService.handleOAuthCallback()`
  - Фактически: `Object.fromEntries(searchParams.entries())` возвращает `{}`
  - Результат: OAuth flow не может быть завершен

- **Пример 3**: В DevTools видно полный URL с параметрами, но логи Vercel показывают `[OAuth Callback] Search params: {}`
  - Ожидается: Логи должны показывать `{code: 'xyz789', state: 'abc123'}`
  - Фактически: Параметры "теряются" между внешним редиректом и обработкой в Edge Runtime

- **Edge Case**: В локальной разработке (Node.js Runtime) параметры читаются корректно
  - Ожидается: Одинаковое поведение в dev и production
  - Фактически: Проблема проявляется только в production на Edge Runtime

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Валидация provider через `isValidProvider()` должна продолжать работать
- Обработка ошибок от OAuth провайдера (параметр `error`) должна продолжать работать
- Определение locale из referer должно продолжать работать
- Создание сессии и редирект на oauth-success страницу должны продолжать работать
- Удаление cookie `oauth_state` после успешного callback должно продолжать работать
- Обработка специфичных типов ошибок (state, code) и редирект на страницу ошибки должны продолжать работать

**Scope:**
Все входные данные, которые НЕ связаны с чтением параметров `code` и `state` из URL после OAuth редиректа, должны быть полностью не затронуты этим исправлением. Это включает:
- Обработку невалидного provider
- Обработку ошибок от OAuth провайдера
- Логику определения locale
- Логику создания и управления сессией
- Логику обработки cookies

## Hypothesized Root Cause

На основе анализа кода и описания бага, наиболее вероятные причины:

1. **Edge Runtime URL Parsing Issue**: Edge Runtime может иметь особенности в обработке URL параметров после внешнего редиректа от OAuth провайдера
   - Vercel Edge Runtime использует упрощенный API, который может по-другому обрабатывать query параметры
   - Внешний редирект от Google/Facebook может приводить к потере параметров в Edge Runtime
   - В DevTools параметры видны, но Edge Runtime их не "видит" через стандартные API

2. **Request URL Normalization**: Edge Runtime может нормализовать или модифицировать `request.url` перед передачей в handler
   - Параметры могут быть "отрезаны" или перемещены в другое место
   - `request.nextUrl.searchParams` может не синхронизироваться с фактическим URL

3. **Middleware Interference**: Middleware может модифицировать request перед передачей в callback endpoint
   - Текущий middleware редиректит root на `/ru`, но не обрабатывает API routes
   - Однако Edge Runtime может применять дополнительную обработку

4. **Vercel Platform Specifics**: Vercel может применять дополнительную обработку к Edge Runtime routes
   - Возможна проблема с проксированием внешних редиректов
   - Edge Runtime может иметь ограничения на размер или формат URL параметров

## Correctness Properties

Property 1: Fault Condition - OAuth Callback Parameters Extraction

_For any_ HTTP request where an OAuth provider redirects to the callback endpoint with `code` and `state` parameters in the URL, the fixed callback handler SHALL successfully extract these parameters and pass them to `authService.handleOAuthCallback()`, enabling the OAuth flow to complete successfully.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Error Handling and Session Management

_For any_ input that involves error handling (invalid provider, OAuth provider errors), locale determination, session creation, or cookie management, the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing functionality for non-parameter-extraction logic.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct (Edge Runtime URL parsing issue):

**File**: `app/api/auth/oauth/[provider]/callback/route.ts`

**Function**: `GET` handler

**Specific Changes**:

1. **Switch to Node.js Runtime**: Добавить `export const runtime = 'nodejs'` в начало файла
   - Edge Runtime имеет ограничения, которые могут вызывать проблемы с OAuth редиректами
   - Node.js Runtime предоставляет полный API и более надежную обработку URL
   - Это решение рекомендуется Vercel для OAuth callbacks

2. **Add Manual URL Parsing Fallback**: Добавить функцию для ручного парсинга параметров из URL string
   - Если `searchParams` API не работает, парсить параметры напрямую из `request.url`
   - Использовать regex или string manipulation для извлечения `code` и `state`
   - Это обеспечит надежность даже если стандартные API не работают

3. **Enhanced Logging**: Добавить детальное логирование для диагностики
   - Логировать raw URL string
   - Логировать результаты разных методов парсинга
   - Логировать runtime environment
   - Это поможет понять root cause если проблема сохранится

4. **Try Multiple Parsing Methods**: Использовать каскад методов для извлечения параметров
   - Сначала попробовать `request.nextUrl.searchParams`
   - Затем попробовать `new URL(request.url).searchParams`
   - Затем попробовать ручной парсинг из URL string
   - Использовать первый успешный результат

5. **Add Runtime Detection**: Добавить проверку runtime environment для условной логики
   - Определять, работает ли код в Edge или Node.js Runtime
   - Применять разные стратегии парсинга в зависимости от runtime
   - Логировать runtime для мониторинга

### Implementation Example

```typescript
// Add at the top of the file
export const runtime = 'nodejs'; // Switch from Edge to Node.js Runtime

// Add helper function for manual URL parsing
function parseUrlParams(url: string): { code: string | null; state: string | null } {
  try {
    // Method 1: Extract from query string manually
    const queryStart = url.indexOf('?');
    if (queryStart === -1) return { code: null, state: null };
    
    const queryString = url.substring(queryStart + 1);
    const params = new URLSearchParams(queryString);
    
    return {
      code: params.get('code'),
      state: params.get('state')
    };
  } catch (e) {
    console.error('[OAuth Callback] Manual URL parsing failed:', e);
    return { code: null, state: null };
  }
}

// In GET handler, replace parameter extraction logic:
// Try multiple methods to get parameters
let code: string | null = null;
let state: string | null = null;

// Method 1: nextUrl.searchParams (standard Next.js API)
code = request.nextUrl.searchParams.get('code');
state = request.nextUrl.searchParams.get('state');

// Method 2: new URL().searchParams (standard Web API)
if (!code || !state) {
  const url = new URL(request.url);
  code = code || url.searchParams.get('code');
  state = state || url.searchParams.get('state');
}

// Method 3: Manual parsing (fallback)
if (!code || !state) {
  const manualParams = parseUrlParams(request.url);
  code = code || manualParams.code;
  state = state || manualParams.state;
}

console.log('[OAuth Callback] Runtime:', process.env.NEXT_RUNTIME || 'unknown');
console.log('[OAuth Callback] Final code:', code);
console.log('[OAuth Callback] Final state:', state);
```

## Testing Strategy

### Validation Approach

Стратегия тестирования следует двухфазному подходу: сначала воспроизвести баг на unfixed коде в production-like окружении, затем проверить, что исправление работает корректно и сохраняет существующее поведение.

### Exploratory Fault Condition Checking

**Goal**: Воспроизвести баг ПЕРЕД внедрением исправления. Подтвердить или опровергнуть анализ root cause. Если опровергнем, нужно будет пересмотреть гипотезу.

**Test Plan**: Создать тестовое окружение, максимально близкое к production (Edge Runtime на Vercel), и симулировать OAuth редирект с параметрами. Запустить тесты на UNFIXED коде для наблюдения failures и понимания root cause.

**Test Cases**:
1. **Edge Runtime Parameter Loss Test**: Развернуть unfixed код на Vercel с Edge Runtime, выполнить реальный OAuth flow с Google (will fail on unfixed code)
2. **URL Parsing Methods Test**: Протестировать все три метода парсинга (`nextUrl.searchParams`, `new URL().searchParams`, manual parsing) на unfixed коде в Edge Runtime (will fail on unfixed code)
3. **DevTools vs Server Logs Test**: Сравнить URL в DevTools с тем, что видит сервер в логах (will show discrepancy on unfixed code)
4. **Node.js Runtime Comparison Test**: Протестировать тот же код в Node.js Runtime для подтверждения, что проблема специфична для Edge Runtime (may pass on unfixed code with Node.js)

**Expected Counterexamples**:
- `searchParams.get('code')` возвращает `null` несмотря на то, что параметр присутствует в URL
- Логи показывают `Search params: {}` в то время как DevTools показывает полный URL с параметрами
- Possible causes: Edge Runtime URL normalization, request object modification, Vercel platform-specific behavior

### Fix Checking

**Goal**: Проверить, что для всех входных данных, где выполняется условие бага, исправленная функция производит ожидаемое поведение.

**Pseudocode:**
```
FOR ALL request WHERE isBugCondition(request) DO
  result := GET_handler_fixed(request)
  ASSERT result.code !== null
  ASSERT result.state !== null
  ASSERT authService.handleOAuthCallback was called with correct parameters
END FOR
```

### Preservation Checking

**Goal**: Проверить, что для всех входных данных, где условие бага НЕ выполняется, исправленная функция производит тот же результат, что и оригинальная функция.

**Pseudocode:**
```
FOR ALL request WHERE NOT isBugCondition(request) DO
  ASSERT GET_handler_original(request) = GET_handler_fixed(request)
END FOR
```

**Testing Approach**: Property-based testing рекомендуется для preservation checking, потому что:
- Автоматически генерирует множество тестовых случаев для различных входных данных
- Находит edge cases, которые могут быть пропущены в ручных unit тестах
- Предоставляет сильные гарантии, что поведение не изменилось для всех не-багованных входных данных

**Test Plan**: Наблюдать поведение на UNFIXED коде для обработки ошибок, валидации provider, определения locale, затем написать property-based тесты, фиксирующие это поведение.

**Test Cases**:
1. **Invalid Provider Preservation**: Наблюдать, что невалидный provider возвращает ошибку "invalid_provider" на unfixed коде, затем написать тест для проверки, что это продолжает работать после исправления
2. **OAuth Error Handling Preservation**: Наблюдать, что параметр `error` от провайдера обрабатывается корректно на unfixed коде, затем написать тест для проверки сохранения этого поведения
3. **Locale Detection Preservation**: Наблюдать, что locale определяется из referer на unfixed коде, затем написать тест для проверки сохранения этой логики
4. **Session Creation Preservation**: Наблюдать, что сессия создается и cookie удаляется на unfixed коде, затем написать тест для проверки сохранения этого поведения

### Unit Tests

- Тестировать извлечение параметров `code` и `state` для каждого метода парсинга
- Тестировать edge cases (отсутствие параметров, пустые значения, специальные символы в параметрах)
- Тестировать, что валидация provider продолжает работать
- Тестировать, что обработка ошибок от OAuth провайдера продолжает работать

### Property-Based Tests

- Генерировать случайные валидные OAuth callback URLs и проверять, что параметры извлекаются корректно
- Генерировать случайные невалидные requests (без параметров, с ошибками) и проверять, что обработка ошибок работает
- Тестировать, что все не-OAuth-параметры (locale, provider validation) продолжают работать для множества сценариев

### Integration Tests

- Тестировать полный OAuth flow с Google в production-like окружении (Vercel preview deployment)
- Тестировать полный OAuth flow с Facebook в production-like окружении
- Тестировать переключение между разными providers и проверять, что параметры извлекаются корректно
- Тестировать, что визуальный feedback (редирект на oauth-success) происходит после успешного callback
