'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { MysticalInput } from '@/components/ui/MysticalInput';

interface TwoFactorVerifyProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TwoFactorVerify({ userId, onSuccess, onCancel }: TwoFactorVerifyProps) {
  const t = useTranslations('auth');
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(data.error || t('2faVerifyError'));
      }
    } catch (err) {
      setError(t('2faVerifyError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 rounded-2xl shadow-2xl border-4 border-amber-500/60 p-8">
      <div className="text-center mb-6">
        <div className="text-amber-400 text-4xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-amber-400">
          {t('twoFactorVerification')}
        </h2>
        <p className="text-purple-300 text-sm mt-2">
          {useBackupCode ? t('enterBackupCode') : t('enterAuthCode')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <MysticalInput
          type="text"
          value={code}
          onChange={setCode}
          label={useBackupCode ? t('backupCode') : t('verificationCode')}
          placeholder={useBackupCode ? 'XXXX-XXXX' : '000000'}
          disabled={loading}
          maxLength={useBackupCode ? 9 : 6}
        />

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={loading || code.length < 6}
          className="w-full"
        >
          {loading ? t('loading') : t('verify')}
        </Button>

        <button
          type="button"
          onClick={() => setUseBackupCode(!useBackupCode)}
          className="text-purple-300 hover:text-amber-400 text-sm w-full text-center"
          disabled={loading}
        >
          {useBackupCode ? t('useAuthCode') : t('useBackupCode')}
        </button>

        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={loading}
          className="w-full"
        >
          {t('cancel')}
        </Button>
      </form>
    </div>
  );
}
