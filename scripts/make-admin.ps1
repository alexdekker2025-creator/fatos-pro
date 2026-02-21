# Скрипт для назначения роли администратора пользователю (PowerShell)
#
# Использование:
# .\scripts\make-admin.ps1 <email>
#
# Пример:
# .\scripts\make-admin.ps1 admin@fatos.pro

param(
    [Parameter(Mandatory=$true)]
    [string]$Email
)

Write-Host ""
Write-Host "🔧 Назначение роли администратора..." -ForegroundColor Cyan
Write-Host ""

# Запускаем TypeScript скрипт
npx ts-node scripts/make-admin.ts $Email

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✨ Готово!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Произошла ошибка" -ForegroundColor Red
    exit 1
}
