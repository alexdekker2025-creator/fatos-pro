/**
 * Компонент детальных логов посещений с IP-адресами
 */

'use client';

import { useState, useEffect } from 'react';
import MysticLoader from '../MysticLoader';

interface Visit {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  path: string;
  referrer: string | null;
  country: string | null;
  city: string | null;
  createdAt: string;
  duration: number | null;
}

interface VisitLogsData {
  visits: Visit[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function VisitLogs() {
  const [data, setData] = useState<VisitLogsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [ipFilter, setIpFilter] = useState('');
  const [pathFilter, setPathFilter] = useState('');
  const [searchIp, setSearchIp] = useState('');
  const [searchPath, setSearchPath] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [page, ipFilter, pathFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');

      const sessionId = localStorage.getItem('sessionId');
      const params = new URLSearchParams({
        sessionId: sessionId || '',
        page: page.toString(),
        limit: '50',
      });

      if (ipFilter) params.append('ip', ipFilter);
      if (pathFilter) params.append('path', pathFilter);

      const response = await fetch(`/api/admin/visit-logs?${params}`);

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('Не удалось загрузить логи посещений');
      }
    } catch (err) {
      console.error('Error fetching visit logs:', err);
      setError('Ошибка при загрузке логов');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setIpFilter(searchIp);
    setPathFilter(searchPath);
    setPage(1);
  };

  const handleReset = () => {
    setSearchIp('');
    setSearchPath('');
    setIpFilter('');
    setPathFilter('');
    setPage(1);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-';
    if (seconds < 60) return `${seconds}с`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}м ${secs}с`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getBrowserInfo = (userAgent: string | null) => {
    if (!userAgent) return 'Неизвестно';
    
    if (userAgent.includes('Chrome')) return '🌐 Chrome';
    if (userAgent.includes('Firefox')) return '🦊 Firefox';
    if (userAgent.includes('Safari')) return '🧭 Safari';
    if (userAgent.includes('Edge')) return '🔷 Edge';
    if (userAgent.includes('Opera')) return '🎭 Opera';
    
    return '🌐 Другой';
  };

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center py-12">
        <MysticLoader text="Загрузка логов..." size="md" />
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">📋 Детальные логи посещений</h2>

      {/* Фильтры */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">🔍 Фильтры</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-purple-200 text-sm mb-2">IP адрес</label>
            <input
              type="text"
              value={searchIp}
              onChange={(e) => setSearchIp(e.target.value)}
              placeholder="Например: 192.168"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block text-purple-200 text-sm mb-2">Путь страницы</label>
            <input
              type="text"
              value={searchPath}
              onChange={(e) => setSearchPath(e.target.value)}
              placeholder="Например: /ru/admin"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all"
          >
            Применить
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20"
          >
            Сбросить
          </button>
        </div>
      </div>

      {/* Таблица логов */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-purple-200 font-semibold">Дата и время</th>
                <th className="px-4 py-3 text-left text-purple-200 font-semibold">IP адрес</th>
                <th className="px-4 py-3 text-left text-purple-200 font-semibold">Страница</th>
                <th className="px-4 py-3 text-left text-purple-200 font-semibold">Браузер</th>
                <th className="px-4 py-3 text-left text-purple-200 font-semibold">Время на сайте</th>
                <th className="px-4 py-3 text-left text-purple-200 font-semibold">Откуда пришел</th>
              </tr>
            </thead>
            <tbody>
              {data?.visits.map((visit, index) => (
                <tr
                  key={visit.id}
                  className={`border-t border-white/10 hover:bg-white/5 transition-colors ${
                    index % 2 === 0 ? 'bg-white/[0.02]' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-white text-sm">
                    {formatDate(visit.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-purple-300 font-mono text-sm">
                    {visit.ipAddress || 'Неизвестно'}
                  </td>
                  <td className="px-4 py-3 text-white text-sm font-mono">
                    {visit.path}
                  </td>
                  <td className="px-4 py-3 text-white text-sm">
                    {getBrowserInfo(visit.userAgent)}
                  </td>
                  <td className="px-4 py-3 text-purple-300 text-sm">
                    {formatDuration(visit.duration)}
                  </td>
                  <td className="px-4 py-3 text-purple-300 text-sm truncate max-w-xs">
                    {visit.referrer || 'Прямой переход'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        {data && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
            <div className="text-purple-200 text-sm">
              Страница {data.pagination.page} из {data.pagination.totalPages} 
              ({data.pagination.total} записей)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Назад
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === data.pagination.totalPages}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперед →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Кнопка обновления */}
      <div className="flex justify-center">
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span className={loading ? 'animate-spin' : ''}>🔄</span>
          {loading ? 'Обновление...' : 'Обновить логи'}
        </button>
      </div>
    </div>
  );
}
