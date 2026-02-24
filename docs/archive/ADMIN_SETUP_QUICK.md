# Быстрая настройка администратора

## Шаг 1: Применить миграцию

```bash
npx prisma migrate dev --name add_is_admin_field
npx prisma generate
```

## Шаг 2: Назначить администратора

### Windows
```powershell
.\scripts\make-admin.ps1 your-email@example.com
```

### Linux/Mac
```bash
chmod +x scripts/make-admin.sh
./scripts/make-admin.sh your-email@example.com
```

### Или напрямую
```bash
npx ts-node scripts/make-admin.ts your-email@example.com
```

## Шаг 3: Войти и проверить

1. Войдите в систему под вашей учетной записью
2. Перейдите на `/admin`
3. Вы должны увидеть административную панель

## Готово! 🎉

Полная документация: [docs/admin-setup.md](docs/admin-setup.md)
