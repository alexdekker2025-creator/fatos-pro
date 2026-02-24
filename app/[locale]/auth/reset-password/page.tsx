'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { MysticalInput } from '@/components/ui/MysticalInput';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function ResetPasswordContent() {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setMessage(t('invalidResetLink'));
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/password-reset/verify?token=${token}`);
        const data = await response.json();

        if (data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setMessage(data.expired ? t('resetLinkExpired') : t('invalidResetLink'));
        }
      } catch (err) {
        setTokenValid(false);
        setMessage(t('invalidResetLink'));
      }
    };

    verifyToken();
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage(t('passwordsDoNotMatch'));
      return;
    }

    if (newPassword.length < 8) {
      setMessage(t('passwordTooShort'));
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(t('passwordResetSuccess'));
      } else {
        setStatus('error');
        setMessage(data.error || t('passwordResetFailed'));
      }
    } catch (err) {
      setStatus('error');
      setMessage(t('passwordResetFailed'));
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900">
        <div className="text-amber-400 text-6xl animate-pulse">⏳</div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 rounded-2xl shadow-2xl border-4 border-amber-500/60 p-8 text-center">
            <div className="text-red-400 text-6xl mb-4">✗</div>
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              {t('invalidLink')}
            </h1>
            <p className="text-purple-300 mb-6">{message}</p>
            <Button
              onClick={() => router.push('/')}
              variant="primary"
              className="w-full"
            >
              {t('goToHome')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 rounded-2xl shadow-2xl border-4 border-amber-500/60 p-8 text-center">
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-green-400 mb-4">
              {t('passwordChanged')}
            </h1>
            <p className="text-purple-300 mb-6">{message}</p>
            <Button
              onClick={() => router.push('/')}
              variant="primary"
              className="w-full"
            >
              {t('goToLogin')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 rounded-2xl shadow-2xl border-4 border-amber-500/60 p-8">
          <div className="text-center mb-6">
            <div className="text-amber-400 text-6xl mb-4">🔑</div>
            <h1 className="text-2xl font-bold text-amber-400 mb-2">
              {t('resetPassword')}
            </h1>
            <p className="text-purple-300 text-sm">{t('enterNewPassword')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <MysticalInput
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              label={t('newPassword')}
              placeholder="••••••••"
              disabled={status === 'loading'}
            />

            <MysticalInput
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              label={t('confirmPassword')}
              placeholder="••••••••"
              disabled={status === 'loading'}
            />

            {message && (
              <div className={`rounded-lg p-3 ${
                status === 'error'
                  ? 'bg-red-900/30 border border-red-500/50'
                  : 'bg-amber-900/30 border border-amber-500/50'
              }`}>
                <p className={`text-sm text-center ${
                  status === 'error' ? 'text-red-300' : 'text-amber-300'
                }`}>
                  {message}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={status === 'loading' || !newPassword || !confirmPassword}
              className="w-full"
            >
              {status === 'loading' ? t('loading') : t('resetPassword')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900">
        <div className="text-amber-400 text-6xl animate-pulse">⏳</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
