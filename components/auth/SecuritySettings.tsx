'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import TwoFactorSetup from './TwoFactorSetup';
import OAuthButtons from './OAuthButtons';

interface SecuritySettingsProps {
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    linkedProviders?: string[];
  };
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
  const t = useTranslations('auth');
  
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorEnabled);
  const [emailVerified, setEmailVerified] = useState(user.emailVerified);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResendVerification = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/email/resend', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(t('verificationEmailSent'));
      } else {
        setMessage(data.error || t('error'));
      }
    } catch (err) {
      setMessage(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm(t('confirm2FADisable'))) return;

    const password = prompt(t('enterPasswordToDisable'));
    if (!password) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setTwoFactorEnabled(false);
        setMessage(t('2faDisabled'));
      } else {
        setMessage(data.error || t('error'));
      }
    } catch (err) {
      setMessage(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkProvider = async (provider: string) => {
    if (!confirm(t('confirmUnlinkProvider', { provider }))) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/oauth/unlink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ provider }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(t('providerUnlinked', { provider }));
        // Reload to update linked providers
        window.location.reload();
      } else {
        setMessage(data.error || t('error'));
      }
    } catch (err) {
      setMessage(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Verification */}
      <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 rounded-xl border-2 border-amber-500/40 p-6">
        <h3 className="text-xl font-bold text-amber-400 mb-4">{t('emailVerification')}</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-300 text-sm">{user.email}</p>
            <p className="text-xs mt-1">
              {emailVerified ? (
                <span className="text-green-400">✓ {t('verified')}</span>
              ) : (
                <span className="text-amber-400">⚠ {t('notVerified')}</span>
              )}
            </p>
          </div>
          
          {!emailVerified && (
            <Button
              onClick={handleResendVerification}
              disabled={loading}
              variant="secondary"
              className="text-sm"
            >
              {t('resendEmail')}
            </Button>
          )}
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 rounded-xl border-2 border-amber-500/40 p-6">
        <h3 className="text-xl font-bold text-amber-400 mb-4">{t('twoFactorAuth')}</h3>
        
        {show2FASetup ? (
          <TwoFactorSetup
            onComplete={() => {
              setTwoFactorEnabled(true);
              setShow2FASetup(false);
              setMessage(t('2faEnabled'));
            }}
            onCancel={() => setShow2FASetup(false)}
          />
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm">{t('2faDescription')}</p>
              <p className="text-xs mt-1">
                {twoFactorEnabled ? (
                  <span className="text-green-400">✓ {t('enabled')}</span>
                ) : (
                  <span className="text-amber-400">⚠ {t('disabled')}</span>
                )}
              </p>
            </div>
            
            {twoFactorEnabled ? (
              <Button
                onClick={handleDisable2FA}
                disabled={loading}
                variant="secondary"
                className="text-sm"
              >
                {t('disable')}
              </Button>
            ) : (
              <Button
                onClick={() => setShow2FASetup(true)}
                disabled={loading}
                variant="primary"
                className="text-sm"
              >
                {t('enable')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* OAuth Providers */}
      <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 rounded-xl border-2 border-amber-500/40 p-6">
        <h3 className="text-xl font-bold text-amber-400 mb-4">{t('linkedAccounts')}</h3>
        
        {user.linkedProviders && user.linkedProviders.length > 0 ? (
          <div className="space-y-3 mb-4">
            {user.linkedProviders.map((provider) => (
              <div key={provider} className="flex items-center justify-between bg-purple-900/50 p-3 rounded-lg">
                <span className="text-purple-300 capitalize">{provider}</span>
                <Button
                  onClick={() => handleUnlinkProvider(provider)}
                  disabled={loading}
                  variant="secondary"
                  className="text-sm"
                >
                  {t('unlink')}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-purple-300 text-sm mb-4">{t('noLinkedAccounts')}</p>
        )}

        <OAuthButtons mode="link" disabled={loading} />
      </div>

      {/* Messages */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.includes(t('error')) || message.includes('error')
            ? 'bg-red-900/30 border border-red-500/50'
            : 'bg-green-900/30 border border-green-500/50'
        }`}>
          <p className={`text-sm ${
            message.includes(t('error')) || message.includes('error')
              ? 'text-red-300'
              : 'text-green-300'
          }`}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
