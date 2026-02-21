'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/hooks/useAuth';
import AuthModal from './AuthModal';
import { Button } from '@/components/ui';

export default function AuthButton() {
  const t = useTranslations('auth');
  const { user, loading, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');

  if (loading) {
    return (
      <div className="flex gap-2">
        <div className="w-20 h-10 bg-white/10 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-white text-sm hidden sm:inline">
          {user.name}
        </span>
        <Button
          variant="outline"
          onClick={logout}
          className="min-h-[40px]"
        >
          {t('logout')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setModalMode('login');
            setShowModal(true);
          }}
          className="min-h-[40px]"
        >
          {t('login')}
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setModalMode('register');
            setShowModal(true);
          }}
          className="min-h-[40px]"
        >
          {t('register')}
        </Button>
      </div>

      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialMode={modalMode}
      />
    </>
  );
}
