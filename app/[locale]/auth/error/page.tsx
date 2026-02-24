'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const t = useTranslations('auth');
  
  const error = searchParams.get('error') || 'unknown';
  const provider = searchParams.get('provider') || '';

  const errorMessages: Record<string, string> = {
    invalid_provider: 'Неверный OAuth провайдер',
    missing_parameters: 'Отсутствуют необходимые параметры',
    missing_state: 'Отсутствует state параметр (возможно истекла сессия)',
    csrf_detected: 'Обнаружена попытка CSRF атаки',
    invalid_code: 'Неверный код авторизации',
    oauth_failed: 'Ошибка OAuth авторизации',
    oauth_initiation_failed: 'Не удалось начать OAuth авторизацию',
    unknown: 'Неизвестная ошибка',
  };

  const message = errorMessages[error] || errorMessages.unknown;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Ошибка авторизации
          </h1>
          <p className="text-white/80 mb-6">
            {message}
            {provider && ` (${provider})`}
          </p>
          <div className="space-y-3">
            <a
              href="/"
              className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Вернуться на главную
            </a>
            <button
              onClick={() => window.history.back()}
              className="block w-full px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
            >
              Назад
            </button>
          </div>
          <p className="text-white/60 text-sm mt-6">
            Код ошибки: {error}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
