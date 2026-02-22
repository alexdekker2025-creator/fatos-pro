'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { MysticalInput } from '@/components/ui/MysticalInput';
import { useAuth } from '@/lib/hooks/useAuth';
import OAuthButtons from './auth/OAuthButtons';
import PasswordResetModal from './auth/PasswordResetModal';
import TwoFactorVerify from './auth/TwoFactorVerify';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const t = useTranslations('auth');
  const { login, register } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorUserId, setTwoFactorUserId] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      
      if (mode === 'login') {
        result = await login(email, password);
        
        // Check if 2FA is required
        if (result.requiresTwoFactor && result.userId) {
          setTwoFactorUserId(result.userId);
          setShow2FA(true);
          setLoading(false);
          return;
        }
      } else {
        if (!name.trim()) {
          setError(t('nameRequired'));
          setLoading(false);
          return;
        }
        result = await register(email, password, name);
      }

      if (result.success) {
        setEmail('');
        setPassword('');
        setName('');
        onClose();
        // Reload page to update user state
        window.location.reload();
      } else {
        setError(result.error || t('error'));
      }
    } catch (err) {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Show 2FA verification if required
  if (show2FA && twoFactorUserId) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={handleOverlayClick}
      >
        <div className="w-full max-w-md">
          <TwoFactorVerify
            userId={twoFactorUserId}
            onSuccess={() => {
              setShow2FA(false);
              setTwoFactorUserId('');
              onClose();
              // Reload page to update user state
              window.location.reload();
            }}
            onCancel={() => {
              setShow2FA(false);
              setTwoFactorUserId('');
            }}
          />
        </div>
      </div>
    );
  }

  // Show password reset modal
  if (showPasswordReset) {
    return (
      <PasswordResetModal
        isOpen={showPasswordReset}
        onClose={() => setShowPasswordReset(false)}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md relative">
        {/* Мистический контейнер */}
        <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 rounded-2xl shadow-2xl border-4 border-amber-500/60 hover:border-amber-400/80 transition-all hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] overflow-hidden relative">
          {/* Мистическая текстура фона */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 60%)
              `
            }}></div>
          </div>

          {/* Внутренняя светящаяся рамка */}
          <div className="absolute inset-3 border-2 border-purple-400/30 rounded-lg shadow-inner pointer-events-none"></div>

          {/* Декоративные углы */}
          <div className="absolute top-4 left-4 w-10 h-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="text-amber-400/70" fill="currentColor">
              <path d="M0,0 L100,0 L100,15 L15,15 L15,100 L0,100 Z" />
              <circle cx="25" cy="25" r="6" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute top-4 right-4 w-10 h-10 transform rotate-90 pointer-events-none">
            <svg viewBox="0 0 100 100" className="text-amber-400/70" fill="currentColor">
              <path d="M0,0 L100,0 L100,15 L15,15 L15,100 L0,100 Z" />
              <circle cx="25" cy="25" r="6" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-4 left-4 w-10 h-10 transform -rotate-90 pointer-events-none">
            <svg viewBox="0 0 100 100" className="text-amber-400/70" fill="currentColor">
              <path d="M0,0 L100,0 L100,15 L15,15 L15,100 L0,100 Z" />
              <circle cx="25" cy="25" r="6" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-4 right-4 w-10 h-10 transform rotate-180 pointer-events-none">
            <svg viewBox="0 0 100 100" className="text-amber-400/70" fill="currentColor">
              <path d="M0,0 L100,0 L100,15 L15,15 L15,100 L0,100 Z" />
              <circle cx="25" cy="25" r="6" fill="currentColor" />
            </svg>
          </div>

          {/* Светящиеся частицы */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60 pointer-events-none"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-400 rounded-full animate-pulse opacity-70 pointer-events-none" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-50 pointer-events-none" style={{animationDelay: '1s'}}></div>

          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-amber-400 hover:text-amber-300 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg p-2 bg-purple-950/80 hover:bg-purple-900/90"
            aria-label="Close modal"
            type="button"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Контент */}
          <div className="relative z-10 p-8">
            {/* Заголовок с мистическим символом */}
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <div className="text-amber-400 text-4xl animate-pulse">✦</div>
              </div>
              <h2 className="text-3xl font-bold text-amber-400 mb-2 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                {mode === 'login' ? t('login') : t('register')}
              </h2>
              
              {/* Декоративная линия */}
              <div className="flex items-center justify-center mt-4">
                <div className="h-px bg-purple-400/40 flex-1 max-w-[80px]"></div>
                <div className="mx-3 text-amber-400/70 text-sm">✦</div>
                <div className="h-px bg-purple-400/40 flex-1 max-w-[80px]"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <div>
                  <MysticalInput
                    type="text"
                    value={name}
                    onChange={setName}
                    label={t('name')}
                    placeholder={t('namePlaceholder')}
                    disabled={loading}
                  />
                  <p className="text-purple-300/70 text-xs mt-1 ml-1">
                    Минимум 2 символа
                  </p>
                </div>
              )}

              <div>
                <MysticalInput
                  type="email"
                  value={email}
                  onChange={setEmail}
                  label={t('email')}
                  placeholder="user@example.com"
                  disabled={loading}
                />
              </div>

              <div>
                <MysticalInput
                  type="password"
                  value={password}
                  onChange={setPassword}
                  label={t('password')}
                  placeholder="••••••••"
                  disabled={loading}
                />
                {mode === 'register' && (
                  <p className="text-purple-300/70 text-xs mt-1 ml-1">
                    Минимум 8 символов, должен содержать буквы и цифры
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-300 text-sm text-center">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-purple-950 font-bold py-3 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? t('loading')
                  : mode === 'login'
                  ? t('loginButton')
                  : t('registerButton')}
              </Button>

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-purple-300 hover:text-amber-400 text-sm transition-colors text-center w-full"
                  disabled={loading}
                >
                  {t('forgotPassword')}
                </button>
              )}
            </form>

            {/* OAuth Buttons */}
            <OAuthButtons disabled={loading} />

            {/* Декоративная линия перед переключателем */}
            <div className="flex items-center justify-center my-6">
              <div className="h-px bg-purple-400/40 flex-1 max-w-[60px]"></div>
              <div className="mx-3 text-amber-400/70 text-xs">✦</div>
              <div className="h-px bg-purple-400/40 flex-1 max-w-[60px]"></div>
            </div>

            <div className="text-center">
              <button
                onClick={switchMode}
                className="text-purple-300 hover:text-amber-400 text-sm transition-colors font-medium disabled:opacity-50"
                disabled={loading}
              >
                {mode === 'login' ? t('switchToRegister') : t('switchToLogin')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
