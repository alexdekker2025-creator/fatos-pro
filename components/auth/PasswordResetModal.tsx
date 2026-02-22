'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { MysticalInput } from '@/components/ui/MysticalInput';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordResetModal({ isOpen, onClose }: PasswordResetModalProps) {
  const t = useTranslations('auth');
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(data.error || t('passwordResetError'));
      }
    } catch (err) {
      setError(t('passwordResetError'));
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-md relative">
        <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 rounded-2xl shadow-2xl border-4 border-amber-500/60 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-amber-400 hover:text-amber-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-6">
            <div className="text-amber-400 text-4xl mb-4">🔑</div>
            <h2 className="text-2xl font-bold text-amber-400">
              {t('passwordReset')}
            </h2>
          </div>

          {success ? (
            <div className="text-center">
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 mb-4">
                <p className="text-green-300">{t('passwordResetEmailSent')}</p>
              </div>
              <Button onClick={onClose} variant="primary" className="w-full">
                {t('close')}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-purple-300 text-sm text-center mb-4">
                {t('passwordResetDescription')}
              </p>

              <MysticalInput
                type="email"
                value={email}
                onChange={setEmail}
                label={t('email')}
                placeholder="user@example.com"
                disabled={loading}
              />

              {error && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-300 text-sm text-center">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? t('loading') : t('sendResetLink')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
