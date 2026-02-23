/**
 * Admin Panel (English version)
 * Page /en/admin for platform management
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

type Tab = 'articles' | 'statistics' | 'logs' | 'services' | 'users' | 'content';

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
        router.push('/en');
        return;
      }

      // Check admin rights via API
      try {
        const response = await fetch('/api/admin/statistics');
        if (response.status === 403 || response.status === 401) {
          router.push('/en');
          return;
        }
        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/en');
      } finally {
        setChecking(false);
      }
    };

    checkAdminAccess();
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('title')}
          </h1>
          <p className="text-purple-200">
            {t('subtitle')}
          </p>
        </div>

        {/* Tab Navigation */}
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
              Users
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 min-w-[120px] py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'content'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 min-w-[120px] py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'services'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Premium Services
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

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {activeTab === 'articles' && <ArticleManager />}
          {activeTab === 'users' && <UserManagement locale="en" />}
          {activeTab === 'content' && <ContentManager sessionId={localStorage.getItem('sessionId') || ''} />}
          {activeTab === 'services' && <ServiceManager />}
          {activeTab === 'statistics' && <StatisticsDashboard />}
          {activeTab === 'logs' && <AdminLogs />}
        </div>
      </div>
    </div>
  );
}
