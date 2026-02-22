# Script to add force-dynamic export to all auth API routes

$files = @(
    "app/api/auth/login/route.ts",
    "app/api/auth/logout/route.ts",
    "app/api/auth/register/route.ts",
    "app/api/auth/session/route.ts",
    "app/api/auth/password-reset/request/route.ts",
    "app/api/auth/password-reset/confirm/route.ts",
    "app/api/auth/email/verify/route.ts",
    "app/api/auth/email/resend/route.ts",
    "app/api/auth/2fa/setup/route.ts",
    "app/api/auth/2fa/confirm/route.ts",
    "app/api/auth/2fa/verify/route.ts",
    "app/api/auth/2fa/disable/route.ts",
    "app/api/auth/2fa/backup-codes/regenerate/route.ts",
    "app/api/auth/oauth/link/route.ts",
    "app/api/auth/oauth/unlink/route.ts",
    "app/api/auth/oauth/[provider]/authorize/route.ts",
    "app/api/auth/oauth/[provider]/callback/route.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Check if force-dynamic already exists
        if ($content -notmatch "export const dynamic = 'force-dynamic'") {
            # Find the line with the first export async function
            if ($content -match "(?m)^export async function (GET|POST)") {
                # Add force-dynamic before the function
                $content = $content -replace "(?m)^(export async function (GET|POST))", "// Force dynamic rendering`nexport const dynamic = 'force-dynamic';`n`n`$1"
                Set-Content -Path $file -Value $content -NoNewline
                Write-Host "Added force-dynamic to: $file" -ForegroundColor Green
            }
        } else {
            Write-Host "Already has force-dynamic: $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nDone!" -ForegroundColor Cyan
