/**
 * Дашборд статистики платформы
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Statistics {
  totalUsers: number;
  totalCalculations: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalArticles: number;
  recentUsers: number;
  recentCalculations: number;
}

export default function StatisticsDashboard() {
  const t = useTranslations('admin.statistics');
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/statistics');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white py-8">
        {t('loading', { default: 'Loading statistics...' })}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-white/70 py-8">
        {t('error', { default: 'Failed to load statistics' })}
      </div>
    );
  }

  const statCards = [
    {
      title: t('totalUsers', { default: 'Total Users' }),
      value: stats.totalUsers.toLocaleString(),
      recent: stats.recentUsers,
      recentLabel: t('last30Days', { default: 'Last 30 days' }),
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: t('totalCalculations', { default: 'Total Calculations' }),
      value: stats.totalCalculations.toLocaleString(),
      recent: stats.recentCalculations,
      recentLabel: t('last30Days', { default: 'Last 30 days' }),
      icon: '🔢',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: t('totalOrders', { default: 'Total Orders' }),
      value: stats.totalOrders.toLocaleString(),
      subtitle: `${stats.completedOrders} ${t('completed', { default: 'completed' })}`,
      icon: '🛒',
      color: 'from-green-500 to-green-600',
    },
    {
      title: t('totalRevenue', { default: 'Total Revenue' }),
      value: `${stats.totalRevenue.toLocaleString()} ₽`,
      subtitle: t('fromCompletedOrders', { default: 'From completed orders' }),
      icon: '💰',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: t('totalArticles', { default: 'Total Articles' }),
      value: stats.totalArticles.toLocaleString(),
      icon: '📝',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        {t('title', { default: 'Platform Statistics' })}
      </h2>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-white/70 text-sm mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </div>
              <div className={`text-4xl bg-gradient-to-br ${card.color} w-16 h-16 rounded-lg flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            {card.subtitle && (
              <p className="text-white/50 text-sm">{card.subtitle}</p>
            )}
            {card.recent !== undefined && (
              <div className="mt-2 pt-2 border-t border-white/20">
                <p className="text-white/70 text-sm">
                  <span className="text-green-300 font-semibold">+{card.recent}</span>{' '}
                  {card.recentLabel}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Дополнительная информация */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {t('overview', { default: 'Overview' })}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-white/70 text-sm mb-1">
              {t('conversionRate', { default: 'Order Conversion Rate' })}
            </p>
            <p className="text-2xl font-bold text-white">
              {stats.totalOrders > 0
                ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div>
            <p className="text-white/70 text-sm mb-1">
              {t('avgRevenue', { default: 'Average Revenue per Order' })}
            </p>
            <p className="text-2xl font-bold text-white">
              {stats.completedOrders > 0
                ? (stats.totalRevenue / stats.completedOrders).toFixed(0)
                : 0} ₽
            </p>
          </div>
          <div>
            <p className="text-white/70 text-sm mb-1">
              {t('calcPerUser', { default: 'Calculations per User' })}
            </p>
            <p className="text-2xl font-bold text-white">
              {stats.totalUsers > 0
                ? (stats.totalCalculations / stats.totalUsers).toFixed(1)
                : 0}
            </p>
          </div>
          <div>
            <p className="text-white/70 text-sm mb-1">
              {t('recentGrowth', { default: 'Recent Growth Rate' })}
            </p>
            <p className="text-2xl font-bold text-white">
              {stats.totalUsers > 0
                ? ((stats.recentUsers / stats.totalUsers) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
