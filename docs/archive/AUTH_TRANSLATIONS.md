# Переводы для новых компонентов аутентификации

Добавьте эти переводы в ваши файлы локализации:

## Английский (messages/en.json)

```json
{
  "auth": {
    "passwordReset": "Password Reset",
    "passwordResetDescription": "Enter your email address and we'll send you a link to reset your password.",
    "passwordResetEmailSent": "If an account with that email exists, a password reset link has been sent.",
    "passwordResetError": "Failed to send password reset email. Please try again.",
    "sendResetLink": "Send Reset Link",
    "forgotPassword": "Forgot password?",
    
    "twoFactorAuth": "Two-Factor Authentication",
    "twoFactorVerification": "Two-Factor Verification",
    "2faDescription": "Add an extra layer of security to your account with two-factor authentication.",
    "2faSetupError": "Failed to set up two-factor authentication. Please try again.",
    "2faConfirmError": "Invalid verification code. Please try again.",
    "2faVerifyError": "Verification failed. Please try again.",
    "enable2FA": "Enable 2FA",
    "disable": "Disable",
    "enabled": "Enabled",
    "disabled": "Disabled",
    "verificationCode": "Verification Code",
    "backupCode": "Backup Code",
    "backupCodes": "Backup Codes",
    "saveBackupCodes": "Save these codes in a safe place. Each code can only be used once.",
    "manualEntry": "Manual entry",
    "enterAuthCode": "Enter the 6-digit code from your authenticator app",
    "enterBackupCode": "Enter one of your backup codes",
    "useAuthCode": "Use authenticator code",
    "useBackupCode": "Use backup code",
    "confirm2FADisable": "Are you sure you want to disable two-factor authentication?",
    "enterPasswordToDisable": "Enter your password to disable 2FA:",
    "2faDisabled": "Two-factor authentication has been disabled",
    "2faEnabled": "Two-factor authentication has been enabled",
    
    "emailVerification": "Email Verification",
    "verified": "Verified",
    "notVerified": "Not Verified",
    "verificationEmailSent": "Verification email sent. Please check your inbox.",
    "resendEmail": "Resend Email",
    
    "linkedAccounts": "Linked Accounts",
    "noLinkedAccounts": "No linked accounts",
    "linkGoogle": "Link Google Account",
    "linkFacebook": "Link Facebook Account",
    "continueWithGoogle": "Continue with Google",
    "continueWithFacebook": "Continue with Facebook",
    "orContinueWith": "or continue with",
    "unlink": "Unlink",
    "confirmUnlinkProvider": "Are you sure you want to unlink your {provider} account?",
    "providerUnlinked": "{provider} account has been unlinked",
    
    "securitySettings": "Security Settings",
    "close": "Close",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "verify": "Verify",
    "loading": "Loading..."
  }
}
```

## Русский (messages/ru.json)

```json
{
  "auth": {
    "passwordReset": "Сброс пароля",
    "passwordResetDescription": "Введите ваш email и мы отправим вам ссылку для сброса пароля.",
    "passwordResetEmailSent": "Если аккаунт с таким email существует, ссылка для сброса пароля была отправлена.",
    "passwordResetError": "Не удалось отправить письмо для сброса пароля. Попробуйте снова.",
    "sendResetLink": "Отправить ссылку",
    "forgotPassword": "Забыли пароль?",
    
    "twoFactorAuth": "Двухфакторная аутентификация",
    "twoFactorVerification": "Двухфакторная верификация",
    "2faDescription": "Добавьте дополнительный уровень безопасности к вашему аккаунту с помощью двухфакторной аутентификации.",
    "2faSetupError": "Не удалось настроить двухфакторную аутентификацию. Попробуйте снова.",
    "2faConfirmError": "Неверный код верификации. Попробуйте снова.",
    "2faVerifyError": "Верификация не удалась. Попробуйте снова.",
    "enable2FA": "Включить 2FA",
    "disable": "Отключить",
    "enabled": "Включено",
    "disabled": "Отключено",
    "verificationCode": "Код верификации",
    "backupCode": "Резервный код",
    "backupCodes": "Резервные коды",
    "saveBackupCodes": "Сохраните эти коды в безопасном месте. Каждый код можно использовать только один раз.",
    "manualEntry": "Ручной ввод",
    "enterAuthCode": "Введите 6-значный код из вашего приложения-аутентификатора",
    "enterBackupCode": "Введите один из ваших резервных кодов",
    "useAuthCode": "Использовать код аутентификатора",
    "useBackupCode": "Использовать резервный код",
    "confirm2FADisable": "Вы уверены, что хотите отключить двухфакторную аутентификацию?",
    "enterPasswordToDisable": "Введите ваш пароль для отключения 2FA:",
    "2faDisabled": "Двухфакторная аутентификация отключена",
    "2faEnabled": "Двухфакторная аутентификация включена",
    
    "emailVerification": "Верификация email",
    "verified": "Подтвержден",
    "notVerified": "Не подтвержден",
    "verificationEmailSent": "Письмо для верификации отправлено. Проверьте вашу почту.",
    "resendEmail": "Отправить снова",
    
    "linkedAccounts": "Связанные аккаунты",
    "noLinkedAccounts": "Нет связанных аккаунтов",
    "linkGoogle": "Связать Google аккаунт",
    "linkFacebook": "Связать Facebook аккаунт",
    "continueWithGoogle": "Продолжить с Google",
    "continueWithFacebook": "Продолжить с Facebook",
    "orContinueWith": "или продолжить с",
    "unlink": "Отвязать",
    "confirmUnlinkProvider": "Вы уверены, что хотите отвязать ваш {provider} аккаунт?",
    "providerUnlinked": "{provider} аккаунт был отвязан",
    
    "securitySettings": "Настройки безопасности",
    "close": "Закрыть",
    "cancel": "Отмена",
    "confirm": "Подтвердить",
    "verify": "Проверить",
    "loading": "Загрузка..."
  }
}
```

## Использование компонентов

### 1. Обновленный AuthModal
Теперь поддерживает:
- Сброс пароля (кнопка "Forgot password?")
- OAuth вход (Google/Facebook)
- 2FA верификацию при входе

### 2. SecuritySettings
Используйте в профиле пользователя:
```tsx
import SecuritySettings from '@/components/auth/SecuritySettings';

<SecuritySettings user={currentUser} />
```

### 3. Отдельные компоненты
- `PasswordResetModal` - модальное окно сброса пароля
- `TwoFactorSetup` - настройка 2FA
- `TwoFactorVerify` - верификация 2FA при входе
- `OAuthButtons` - кнопки OAuth входа/привязки

