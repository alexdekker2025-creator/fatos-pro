# ✅ Deployment Checklist

## Pre-Deployment

### 1. Code & Tests
- [x] Все изменения закоммичены
- [x] Unit тесты проходят (51/51)
- [x] API endpoints протестированы
- [x] TypeScript компилируется без ошибок
- [x] Prisma schema синхронизирована с БД

### 2. Environment Setup
- [ ] Resend account создан
- [ ] Resend API key получен
- [ ] Resend домен верифицирован
- [ ] Google OAuth app создан (опционально)
- [ ] Facebook OAuth app создан (опционально)
- [ ] Секреты сгенерированы (ENCRYPTION_SECRET, SESSION_SECRET, CRON_SECRET)

### 3. Database
- [x] Neon PostgreSQL настроен
- [x] Миграции применены
- [x] Connection string доступен
- [x] SSL включен

---

## Vercel Configuration

### 1. Environment Variables

#### Обязательные
- [ ] `DATABASE_URL` - Neon connection string
- [ ] `ENCRYPTION_SECRET` - минимум 32 символа
- [ ] `SESSION_SECRET` - случайная строка
- [ ] `CRON_SECRET` - случайная строка
- [ ] `RESEND_API_KEY` - Resend API key
- [ ] `EMAIL_FROM` - FATOS.pro <noreply@yourdomain.com>
- [ ] `NEXT_PUBLIC_BASE_URL` - https://yourdomain.com
- [ ] `OAUTH_REDIRECT_BASE_URL` - https://yourdomain.com

#### Опциональные (OAuth)
- [ ] `GOOGLE_OAUTH_CLIENT_ID`
- [ ] `GOOGLE_OAUTH_CLIENT_SECRET`
- [ ] `FACEBOOK_OAUTH_CLIENT_ID`
- [ ] `FACEBOOK_OAUTH_CLIENT_SECRET`

### 2. Deployment
- [ ] `vercel.json` закоммичен
- [ ] Код запушен в Git
- [ ] Деплой выполнен: `vercel --prod`
- [ ] Deployment успешен

### 3. Cron Jobs
- [ ] Vercel Cron Jobs настроены автоматически
- [ ] Token cleanup: daily at 2 AM UTC
- [ ] Log cleanup: daily at 3 AM UTC

---

## Post-Deployment Testing

### 1. Basic Health Checks
- [ ] Сайт открывается: `https://yourdomain.com`
- [ ] API отвечает: `GET /api/auth/session`
- [ ] Database connection работает

### 2. Password Reset Flow
- [ ] Request: `POST /api/auth/password-reset/request`
- [ ] Email получен
- [ ] Verify: `GET /api/auth/password-reset/verify?token=...`
- [ ] Confirm: `POST /api/auth/password-reset/confirm`
- [ ] Password изменен

### 3. Email Verification
- [ ] Регистрация нового пользователя
- [ ] Verification email получен
- [ ] Verify: `POST /api/auth/email/verify`
- [ ] emailVerified = true

### 4. 2FA Setup
- [ ] Login с существующим пользователем
- [ ] Setup: `POST /api/auth/2fa/setup`
- [ ] QR код получен
- [ ] Сканирование в Google Authenticator
- [ ] Confirm: `POST /api/auth/2fa/confirm`
- [ ] Backup коды сохранены
- [ ] Logout и login с 2FA кодом
- [ ] Verify: `POST /api/auth/2fa/verify`

### 5. OAuth Login (если настроен)
- [ ] Google authorize работает
- [ ] Google callback создает сессию
- [ ] Facebook authorize работает
- [ ] Facebook callback создает сессию
- [ ] Account linking работает
- [ ] Account unlinking работает

### 6. Admin Features
- [ ] Login как admin
- [ ] Stats: `GET /api/admin/auth/stats`
- [ ] Users list: `GET /api/admin/users`
- [ ] Данные корректны

### 7. User Profile
- [ ] Get profile: `GET /api/user/profile`
- [ ] Update profile: `PUT /api/user/profile`
- [ ] Auth status отображается (emailVerified, twoFactorEnabled, linkedProviders)

### 8. Rate Limiting
- [ ] Password reset: 4-й запрос возвращает 429
- [ ] Email resend: 4-й запрос возвращает 429
- [ ] 2FA verify: 6-й запрос возвращает 429

### 9. Cron Jobs
- [ ] Token cleanup endpoint доступен
- [ ] Log cleanup endpoint доступен
- [ ] Cron jobs выполняются по расписанию (проверить через 24 часа)

### 10. Security Logging
- [ ] Security events записываются в БД
- [ ] Query: `SELECT * FROM "SecurityLog" ORDER BY "createdAt" DESC LIMIT 10`
- [ ] События корректны

---

## Security Verification

### 1. Secrets
- [ ] Все секреты случайные (не default values)
- [ ] ENCRYPTION_SECRET >= 32 символа
- [ ] Секреты не в Git
- [ ] .env в .gitignore

### 2. HTTPS
- [ ] HTTPS включен
- [ ] HTTP редиректит на HTTPS
- [ ] SSL сертификат валиден

### 3. CORS
- [ ] CORS настроен правильно
- [ ] Только разрешенные origins

### 4. OAuth
- [ ] Redirect URLs только для production домена
- [ ] State parameter работает (CSRF protection)
- [ ] Tokens шифруются

### 5. Rate Limiting
- [ ] Rate limiting работает на всех endpoints
- [ ] HTTP 429 возвращается при превышении
- [ ] Retry-After header присутствует

---

## Monitoring Setup

### 1. Logs
- [ ] Vercel logs доступны: `vercel logs --follow`
- [ ] Error tracking настроен (Sentry - опционально)

### 2. Database
- [ ] Security logs мониторятся
- [ ] Backup настроен (Neon автоматически)

### 3. Alerts (опционально)
- [ ] Алерты для failed logins
- [ ] Алерты для rate limit violations
- [ ] Алерты для cron job failures

---

## Documentation

### 1. User Documentation
- [ ] Password reset инструкции
- [ ] 2FA setup guide
- [ ] OAuth login guide

### 2. Admin Documentation
- [ ] Admin dashboard guide
- [ ] Security monitoring guide
- [ ] User management guide

### 3. Developer Documentation
- [x] API documentation (`API_ENDPOINTS_SUMMARY.md`)
- [x] Deployment guide (`DEPLOYMENT_GUIDE.md`)
- [x] Testing guide (`КАК_ТЕСТИРОВАТЬ_API.md`)

---

## Final Checks

### 1. Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Database queries оптимизированы

### 2. User Experience
- [ ] Email templates выглядят хорошо
- [ ] Error messages понятны
- [ ] Success messages показываются

### 3. Compliance
- [ ] GDPR compliance (если применимо)
- [ ] Privacy policy обновлена
- [ ] Terms of service обновлены

---

## Rollback Plan

### If Something Goes Wrong

1. **Immediate rollback:**
   ```bash
   vercel rollback
   ```

2. **Check logs:**
   ```bash
   vercel logs --follow
   ```

3. **Database rollback (если нужно):**
   - Neon имеет point-in-time recovery
   - Используйте Neon dashboard для восстановления

4. **Notify users:**
   - Если были проблемы с auth
   - Если данные были затронуты

---

## Post-Launch

### Week 1
- [ ] Мониторить error rates
- [ ] Проверить cron jobs выполняются
- [ ] Проверить email delivery rate
- [ ] Собрать feedback от пользователей

### Week 2-4
- [ ] Анализировать security logs
- [ ] Оптимизировать slow queries
- [ ] Улучшить error messages
- [ ] Добавить missing features

### Monthly
- [ ] Ротировать секреты (каждые 90 дней)
- [ ] Проверить backup
- [ ] Обновить dependencies
- [ ] Security audit

---

## Success Criteria

✅ Deployment считается успешным когда:

- [ ] Все тесты проходят
- [ ] Все endpoints работают
- [ ] Email отправляются
- [ ] OAuth работает (если настроен)
- [ ] 2FA работает
- [ ] Admin features работают
- [ ] Cron jobs выполняются
- [ ] Security logging работает
- [ ] Нет критичных ошибок в логах
- [ ] Users могут использовать все функции

---

**Дата:** 22.02.2026  
**Версия:** 1.0  
**Статус:** Ready for deployment ✅
