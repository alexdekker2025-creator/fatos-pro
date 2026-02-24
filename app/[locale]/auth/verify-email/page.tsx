'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function VerifyEmailContent() {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t('invalidVerificationLink'));
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/email/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(t('emailVerifiedSuccess'));
        } else {
          setStatus('error');
          setMessage(data.error || t('emailVerificationFailed'));
        }
      } catch (err) {
        setStatus('error');
        setMessage(t('emailVerificationFailed'));
      }
    };

    verifyEmail();
  }, [token, t]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 rounded-2xl shadow-2xl border-4 border-amber-500/60 p-8">
          <div className="text-center">
            {status === 'verifying' && (
              <>
                <div className="text-amber-400 text-6xl mb-4 animate-pulse">⏳</div>
                <h1 className="text-2xl font-bold text-amber-400 mb-4">
                  {t('verifyingEmail')}
                </h1>
                <p className="text-purple-300">{t('pleaseWait')}</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="text-green-400 text-6xl mb-4">✓</div>
                <h1 className="text-2xl font-bold text-green-400 mb-4">
                  {t('emailVerified')}
                </h1>
                <p className="text-purple-300 mb-6">{message}</p>
                <Button
                  onClick={() => router.push('/')}
                  variant="primary"
                  className="w-full"
                >
                  {t('goToHome')}
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="text-red-400 text-6xl mb-4">✗</div>
                <h1 className="text-2xl font-bold text-red-400 mb-4">
                  {t('verificationFailed')}
                </h1>
                <p className="text-purple-300 mb-6">{message}</p>
                <Button
                  onClick={() => router.push('/')}
                  variant="primary"
                  className="w-full"
                >
                  {t('goToHome')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 rounded-2xl shadow-2xl border-4 border-amber-500/60 p-8">
            <div className="text-center">
              <div className="text-amber-400 text-6xl mb-4 animate-pulse">⏳</div>
              <h1 className="text-2xl font-bold text-amber-400 mb-4">
                Загрузка...
              </h1>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
