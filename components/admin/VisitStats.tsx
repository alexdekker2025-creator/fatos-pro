/**
 * Компонент статистики посещений сайта
 */

'use client';

import { useState, useEffect } from 'react';
import MysticLoader from '../MysticLoader';

interface VisitStatsData {
  totalVisits: number;
  todayVisits: number;
  uniqueVisitorsToday: number;
  last7DaysVisits: number;
  last30DaysVisits: number;
  visitsByDay: { [key: string]: number };
  topPages: { path: string; visits: number }[];
}

export default function VisitStats() {
  const [stats, setStats] = useState<VisitStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      const sessionId = localStorage.getItem('sessionId');
      const response = await fetch(`/api/admin/visit-stats?sessionId=${sessionId}`);

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Не удалось загрузить статистику посещений');
      }
    } catch (err) {
      console.error('Error fetching visit stats:', err);
      setError('Ошибка при загрузке статистики');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchStats(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <MysticLoader text="Загрузка статистики..." size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6">
        <p className="text-red-300 text-center">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">📊 Статистика посещений</h2>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Всего посещений */}
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-lg p-6 border border-purple-400/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-purple-200 text-sm font-medium">Всего посещений</h3>
            <span className="text-2xl">🌐</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalVisits.toLocaleString()}</p>
          <p className="text-purple-300 text-xs mt-1">За все время</p>
        </div>

        {/* Сегодня */}
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-blue-200 text-sm font-medium">Сегодня</h3>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.todayVisits.toLocaleString()}</p>
          <p className="text-blue-300 text-xs mt-1">
            {stats.uniqueVisitorsToday} уникальных
          </p>
        </div>

        {/* За 7 дней */}
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-lg p-6 border border-green-400/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-green-200 text-sm font-medium">За 7 дней</h3>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.last7DaysVisits.toLocaleString()}</p>
          <p className="text-green-300 text-xs mt-1">
            ~{Math.round(stats.last7DaysVisits / 7)} в день
          </p>
        </div>

        {/* За 30 дней */}
        <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 backdrop-blur-sm rounded-lg p-6 border border-amber-400/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-amber-200 text-sm font-medium">За 30 дней</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.last30DaysVisits.toLocaleString()}</p>
          <p className="text-amber-300 text-xs mt-1">
            ~{Math.round(stats.last30DaysVisits / 30)} в день
          </p>
        </div>
      </div>

      {/* Топ страниц */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">🔥 Популярные страницы</h3>
        <div className="space-y-3">
          {stats.topPages.length > 0 ? (
            stats.topPages.map((page, index) => (
              <div
                key={page.path}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-purple-400">#{index + 1}</span>
                  <span className="text-white font-mono text-sm">{page.path}</span>
                </div>
                <span className="text-purple-300 font-semibold">
                  {page.visits.toLocaleString()} посещений
                </span>
              </div>
            ))
          ) : (
            <p className="text-purple-300 text-center py-4">Нет данных о посещениях</p>
          )}
        </div>
      </div>

      {/* График по дням (простая визуализация) */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">📈 Посещения по дням (последние 30 дней)</h3>
        <div className="space-y-2">
          {Object.entries(stats.visitsByDay)
            .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
            .slice(0, 10)
            .map(([date, visits]) => {
              const maxVisits = Math.max(...Object.values(stats.visitsByDay));
              const percentage = (visits / maxVisits) * 100;
              
              return (
                <div key={date} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">{new Date(date).toLocaleDateString('ru-RU')}</span>
                    <span className="text-white font-semibold">{visits} посещений</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Кнопка обновления */}
      <div className="flex justify-center">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
          {refreshing ? 'Обновление...' : 'Обновить статистику'}
        </button>
      </div>
    </div>
  );
}
