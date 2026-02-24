/**
 * Административная панель (русская версия)
 * Страница /ru/admin для управления платформой
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTranslations } from 'next-intl';
import ArticleManager from '@/components/admin/ArticleManager';
import StatisticsDashboard from '@/components/admin/StatisticsDashboard';
import AdminLogs from '@/components/admin/AdminLogs';
import ServiceManager from '@/components/admin/ServiceManager';
import UserManagement from '@/components/admin/UserManagement';
import ContentManager from '@/components/admin/ContentManager';
import VisitStats from '@/components/admin/VisitStats';
import VisitLogs from '@/components/admin/VisitLogs';

type Tab = 'articles' | 'statistics' | 'logs' | 'services' | 'users' | 'content' | 'visits' | 'visit-logs';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations('admin');
  const [activeTab, setActiveTab] = useState<Tab>('articles');
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (loading) return;

      if (!user) {
        router.push('/ru');
        return;
      }

      // Проверяем права администратора через API
      try {
        const sessionId = localStorage.getItem('sessionId');
        const response = await fetch(`/api/admin/statistics?sessionId=${sessionId}`);
        if (response.status === 403 || response.status === 401) {
          router.push('/ru');
          return;
        }
        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/ru');
      } finally {
        setChecking(false);
      }
    };

    checkAdminAccess();
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('title')}
          </h1>
          <p className="text-purple-200">
            {t('subtitle')}
          </p>
        </div>

        {/* Навигация по вкладкам */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex-1 min-w-[120px] py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'articles'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {t('tabs.articles')}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 min-w-[120px] py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Пользователи
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 min-w-[120px] py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'content'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Контент
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 min-w-[120px] py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'services'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Премиум услуги
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex-1 min-w-[120px] py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'statistics'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {t('tabs.statistics')}
            </button>
            <button
              onClick={() => setActiveTab('visits')}
              className={`flex-1 min-w-[120px] py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'visits'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Посещения
            </button>
            <button
              onClick={() => setActiveTab('visit-logs')}
              className={`flex-1 min-w-[120px] py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'visit-logs'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Логи посещений
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-1 min-w-[120px] py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'logs'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {t('tabs.logs')}
            </button>
          </div>
        </div>

        {/* Контент вкладок */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {activeTab === 'articles' && <ArticleManager />}
          {activeTab === 'users' && user && <UserManagement locale="ru" currentUserId={user.id} />}
          {activeTab === 'content' && <ContentManager sessionId={localStorage.getItem('sessionId') || ''} />}
          {activeTab === 'services' && <ServiceManager />}
          {activeTab === 'statistics' && <StatisticsDashboard />}
          {activeTab === 'visits' && <VisitStats />}
          {activeTab === 'visit-logs' && <VisitLogs />}
          {activeTab === 'logs' && <AdminLogs />}
        </div>
      </div>
    </div>
  );
}
