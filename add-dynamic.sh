#!/bin/bash

# Files that need force-dynamic
files=(
    "app/api/auth/logout/route.ts"
    "app/api/auth/password-reset/request/route.ts"
    "app/api/auth/password-reset/confirm/route.ts"
    "app/api/auth/email/verify/route.ts"
    "app/api/auth/email/resend/route.ts"
    "app/api/auth/2fa/setup/route.ts"
    "app/api/auth/2fa/confirm/route.ts"
    "app/api/auth/2fa/verify/route.ts"
    "app/api/auth/2fa/disable/route.ts"
    "app/api/auth/2fa/backup-codes/regenerate/route.ts"
    "app/api/auth/oauth/link/route.ts"
    "app/api/auth/oauth/unlink/route.ts"
    "app/api/auth/oauth/[provider]/authorize/route.ts"
    "app/api/auth/oauth/[provider]/callback/route.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        # Check if already has force-dynamic
        if ! grep -q "export const dynamic = 'force-dynamic'" "$file"; then
            # Add after imports, before first export function
            sed -i "/^export async function/i \\
// Force dynamic rendering\\
export const dynamic = 'force-dynamic';\\
" "$file"
            echo "Added to: $file"
        else
            echo "Already has: $file"
        fi
    fi
done
