'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { MysticalInput } from '@/components/ui/MysticalInput';

interface TwoFactorSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const t = useTranslations('auth');
  
  const [step, setStep] = useState<'setup' | 'confirm'>('setup');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setBackupCodes(data.backupCodes);
        setStep('confirm');
      } else {
        setError(data.error || t('2faSetupError'));
      }
    } catch (err) {
      setError(t('2faSetupError'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/2fa/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, secret, backupCodes }),
      });

      const data = await response.json();

      if (response.ok) {
        onComplete();
      } else {
        setError(data.error || t('2faConfirmError'));
      }
    } catch (err) {
      setError(t('2faConfirmError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 rounded-2xl shadow-2xl border-4 border-amber-500/60 p-8">
      <div className="text-center mb-6">
        <div className="text-amber-400 text-4xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-amber-400">
          {t('twoFactorAuth')}
        </h2>
      </div>

      {step === 'setup' ? (
        <div className="space-y-4">
          <p className="text-purple-300 text-sm text-center">
            {t('2faDescription')}
          </p>

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSetup}
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? t('loading') : t('enable2FA')}
            </Button>
            <Button
              onClick={onCancel}
              variant="secondary"
              disabled={loading}
              className="flex-1"
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <img src={qrCode} alt="QR Code" className="w-full" />
          </div>

          <div className="bg-purple-900/50 p-4 rounded-lg">
            <p className="text-purple-300 text-xs mb-2">{t('manualEntry')}:</p>
            <code className="text-amber-400 text-sm break-all">{secret}</code>
          </div>

          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
            <p className="text-amber-300 text-sm font-bold mb-2">{t('backupCodes')}:</p>
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <code key={index} className="text-amber-400 text-xs bg-purple-950/50 p-2 rounded">
                  {code}
                </code>
              ))}
            </div>
            <p className="text-amber-300 text-xs mt-2">{t('saveBackupCodes')}</p>
          </div>

          <MysticalInput
            type="text"
            value={code}
            onChange={setCode}
            label={t('verificationCode')}
            placeholder="000000"
            disabled={loading}
            maxLength={6}
          />

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              disabled={loading || code.length !== 6}
              className="flex-1"
            >
              {loading ? t('loading') : t('confirm')}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              disabled={loading}
              className="flex-1"
            >
              {t('cancel')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
