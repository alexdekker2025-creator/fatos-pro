'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import StarryBackground from '@/components/StarryBackground';
import AuthButton from '@/components/AuthButton';
import ArcanaCollection from '@/components/ArcanaCollection';
import SecuritySettings from '@/components/auth/SecuritySettings';
import { Card } from '@/components/ui';

export default function ProfilePage() {
  const t = useTranslations();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'arcana'>('info');
  const [stats, setStats] = useState({
    totalCalculations: 0,
    arcanaCollected: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      // Load calculations count
      const calcResponse = await fetch('/api/calculations');
      const calcData = await calcResponse.json();
      
      // Load arcana collection
      const arcanaResponse = await fetch('/api/arcana/collection');
      const arcanaData = await arcanaResponse.json();

      setStats({
        totalCalculations: calcData.total || 0,
        arcanaCollected: arcanaData.collection?.length || 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        <StarryBackground />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center text-white">Загрузка...</div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        <StarryBackground />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <Link
              href="/ru"
              className="text-white hover:text-purple-200 transition-colors"
            >
              ← Назад
            </Link>
            <AuthButton />
          </div>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Профиль
            </h1>
            <p className="text-purple-200 mb-6">
              Войдите, чтобы увидеть свой профиль
            </p>
          </div>
        </div>
      </main>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      <StarryBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 animate-fade-in">
          <Link
            href="/ru"
            className="text-white hover:text-purple-200 transition-colors"
          >
            ← Назад
          </Link>
          <AuthButton />
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Профиль
          </h1>
          <p className="text-purple-200">
            {user.name}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8 gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'info'
                ? 'bg-amber-500 text-purple-950 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            📊 Информация
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'security'
                ? 'bg-amber-500 text-purple-950 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            🔒 Безопасность
          </button>
          <button
            onClick={() => setActiveTab('arcana')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'arcana'
                ? 'bg-amber-500 text-purple-950 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            ✨ Коллекция Арканов
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6 animate-fade-in">
              {/* User Info Card */}
              <Card variant="elevated">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-amber-400 font-semibold mb-2">Email</h3>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-amber-400 font-semibold mb-2">Имя</h3>
                    <p className="text-white">{user.name}</p>
                  </div>
                  <div>
                    <h3 className="text-amber-400 font-semibold mb-2">Дата регистрации</h3>
                    <p className="text-white">{formatDate(user.createdAt || new Date().toISOString())}</p>
                  </div>
                </div>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card variant="elevated">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-bold text-amber-400 mb-2">
                      {loadingStats ? '...' : stats.totalCalculations}
                    </div>
                    <div className="text-purple-200">Всего расчетов</div>
                  </div>
                </Card>

                <Card variant="elevated">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-bold text-amber-400 mb-2">
                      {loadingStats ? '...' : `${stats.arcanaCollected}/22`}
                    </div>
                    <div className="text-purple-200">Собрано арканов</div>
                  </div>
                </Card>
              </div>

              {/* Quick Links */}
              <Card variant="elevated">
                <h3 className="text-amber-400 font-semibold mb-4">Быстрые ссылки</h3>
                <div className="space-y-2">
                  <Link
                    href="/ru/history"
                    className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
                  >
                    📜 История расчетов →
                  </Link>
                  <Link
                    href="/ru"
                    className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
                  >
                    🔮 Новый расчет →
                  </Link>
                </div>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <SecuritySettings user={user} />
            </div>
          )}

          {/* Arcana Tab */}
          {activeTab === 'arcana' && (
            <div className="animate-fade-in">
              <ArcanaCollection userId={user.id} />
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg text-center">
                <p className="text-purple-200 text-sm">
                  💡 Совет: Выполняйте расчеты каждый день, чтобы собрать все 22 аркана!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
